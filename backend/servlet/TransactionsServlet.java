package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import DAO.AccountDAO;
import DAO.EmiDAO;
import DAO.LoanDAO;
import DAO.TransactionDAO;
import enums.LoanStatus;
import enums.Status;
import enums.TransactionStatus;
import enums.TransactionType;
import model.Emi;
import model.Transaction;
import redis.clients.jedis.Jedis;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class TransactionsServlet extends HttpServlet {
    
    private TransactionDAO transactionQueryMap = new TransactionDAO();
    private LoanDAO loanDao = new LoanDAO();
    private EmiDAO emiDao = new EmiDAO();
    private AccountDAO accountDao = new AccountDAO();
    Jedis jedis = null;
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request, response);
    	String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 
    	
        jedis = ControllerServlet.pool.getResource();
        
//        String cachedData = null;
        String cachedData = jedis.get(cacheKey);
        if(request.getSession(false).getAttribute("user_role").equals("CUSTOMER"))
        {
        	ControllerServlet.pathMap.put("user_id",(Integer) request.getSession(false).getAttribute("user_id"));
        	cachedData = null;
        }
        
        if (cachedData != null) {

        	JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
            System.out.println("Data fetched from Redis cache");
        }
        else
        {
        	
        	try (Connection conn = DbConnection.connect()) 
        	{
        		ResultSet rs = transactionQueryMap.selectAllTransactions(conn, ControllerServlet.pathMap);
        		List<Transaction> transactions = transactionQueryMap.convertResultSetToList(rs);
        		
        		JsonArray jsonArray = new JsonArray();
        		if (!transactions.isEmpty()) 
        		{
        			for (Transaction transaction : transactions) 
        			{
        				JsonObject transactionJson = new JsonObject();
        				transactionJson.addProperty("transaction_id", transaction.getTransaction_id());
        				transactionJson.addProperty("transaction_datetime", transaction.getTransaction_datetime().toString());
        				transactionJson.addProperty("transaction_type", (""+TransactionType.valueOf(transaction.getTransaction_type())).toLowerCase());
        				transactionJson.addProperty("transaction_status", (""+TransactionStatus.valueOf(transaction.getTransaction_status())).toLowerCase());
        				transactionJson.addProperty("transaction_amount", transaction.getTransaction_amount());
        				transactionJson.addProperty("acc_number", transaction.getAcc_number());
        				jsonArray.add(transactionJson);
        			}
        		} 
        		else 
        		{
        			JsonHandler.sendErrorResponse(response, "No matching transactions found.");
        			return;
        		}
        		jedis.set(cacheKey, jsonArray.toString()); 
        		response.setContentType("application/json");
        		JsonHandler.sendJsonResponse(response, jsonArray);
        	} 
        	catch (SQLException e) 
        	{
        		JsonHandler.sendErrorResponse(response,"Error fetching transaction details: " + e.getMessage());
        	}
        }
        jedis.close();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request, response);
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey = "/"+path[0]+"/"+path[1]+"*/"+path[path.length-1]; 
    	
        try (Connection conn = DbConnection.connect()) 
        {
            JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
            Transaction newTransaction = transactionQueryMap.extractTransactionDetails(jsonRequest);
            newTransaction.setAcc_number(ControllerServlet.pathMap.get("accounts"));
            
            if(checkAccountStatus(conn,newTransaction))
            {
            	
            	
            	if (transactionQueryMap.insertTransaction(conn, newTransaction)) 
            	{
            		jedis = ControllerServlet.pool.getResource();
            		Set<String> keys =jedis.keys(cacheKey);
    				if (!keys.isEmpty()) {
    					jedis.del(keys.toArray(new String[0]));
    					System.out.println("Deleted keys: " + keys);
    				}
            		if(newTransaction.getTransaction_type()==TransactionType.EMI.getValue())
            		{
            			HashMap<String, Integer> pathMap = new HashMap<>();
            			pathMap.put("accounts", newTransaction.getAcc_number());
            			ResultSet rs =loanDao.selectAllLoans(conn,pathMap);
            			
            			int loanId = -1;
            			Date loan_availed_date = null;
            			
            			while(rs.next()) 
            			{
            				if(rs.getInt("loan_status")==LoanStatus.APPROVED.getValue())
            				{
            					loanId = rs.getInt("loan_id");
            					loan_availed_date = rs.getDate("loan_availed_date");
            					break;
            				}
            			}
            			LocalDate loanAvailedDate = LocalDate.parse(""+loan_availed_date);
            			LocalDate currentDate = LocalDate.now();
            			
            			int monthsDifference =(int) ChronoUnit.MONTHS.between(loanAvailedDate, currentDate);
            			
            			Emi emi = new Emi();
            			emi.setEmi_number(monthsDifference);
            			emi.setLoan_id(loanId);
            			emi.setTransaction_id(newTransaction.getTransaction_id());
            			
            			keys =jedis.keys("/banks/"+ControllerServlet.pathMap.get("banks")+"*/loans/"+emi.getLoan_id()+"/emis");
        				if (!keys.isEmpty()) {
        					jedis.del(keys.toArray(new String[0]));
        					System.out.println("Deleted keys: " + keys);
        				}
            			emiDao.insertEmi(conn,emi);
            			
            		}
            		else
            		{
            			if(transactionQueryMap.updateBalance(newTransaction.getTransaction_type(),newTransaction.getTransaction_amount()))
            			{
            				Set<String> acckeys =jedis.keys("/banks/"+ControllerServlet.pathMap.get("banks")+"*/accounts"+ControllerServlet.pathMap.get("accounts"));
            				if (!acckeys.isEmpty()) {
            					jedis.del(acckeys.toArray(new String[0]));
            					System.out.println("Deleted keys: " + acckeys);
            				}
            				 acckeys =jedis.keys("/banks/"+ControllerServlet.pathMap.get("banks")+"*/accounts");
            				if (!acckeys.isEmpty()) {
            					jedis.del(acckeys.toArray(new String[0]));
            					System.out.println("Deleted keys: " + acckeys);
            				}
            				JsonHandler.sendSuccessResponse(response,"Transaction inserted successfully");
            				   
            			}
            			else 
            			{
            				if(newTransaction.getTransaction_type()==TransactionType.DEBIT.getValue())
            				{
            					JsonHandler.sendErrorResponse(response,"Insufficient Balance.");
            				}
            				JsonHandler.sendErrorResponse(response,"Error inserting transaction");
            			}
            		}
            	} 
            	else 
            	{
            		JsonHandler.sendErrorResponse(response,"Error inserting transaction");
            	}
            }
            else
            {
            	JsonHandler.sendErrorResponse(response,"Unauthorized Account");
            }
        } 
        catch (SQLException e) 
        {
        	JsonHandler.sendErrorResponse(response,"Error processing request: " + e.getMessage());
        }
        finally {
        	 jedis.close();
        }
    }
    
    private boolean checkAccountStatus(Connection conn,Transaction newTransaction) throws SQLException
    {

        HashMap<String, Integer> accountmap = new HashMap<>();
        accountmap.put("accounts",newTransaction.getAcc_number());
        accountmap.put("a.acc_status", Status.ACTIVE.getValue());
        ResultSet rs = accountDao.selectAllAccounts(conn, accountmap);
        return rs.next();
    	
    }

}
