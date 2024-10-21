package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
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
import DAO.BankDAO;
import DAO.BranchDAO;
import DAO.UserDAO;
import enums.AccountType;
import enums.Status;
import model.Account;
import model.User;
import redis.clients.jedis.Jedis;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class AccountsServlet extends HttpServlet 
{
    private AccountDAO accountQueryMap = new AccountDAO();
    private UserDAO userQueryMap = new UserDAO();
    private BranchDAO branchQueryMap = new BranchDAO();
    Jedis jedis = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
    	
    	String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 
    	
        jedis = ControllerServlet.pool.getResource();
        
//        String cachedData = null;
        String cachedData = jedis.get(cacheKey);
        if(request.getSession(false).getAttribute("user_role").equals("CUSTOMER"))
        {
        	ControllerServlet.pathMap.put("users",(Integer) request.getSession(false).getAttribute("user_id"));
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
	    		 JsonArray jsonArray = new JsonArray();
		    		 
		    		 ResultSet rs = accountQueryMap.selectAllAccounts(conn,ControllerServlet.pathMap);
		    		 
		    		 List<Account> accounts = accountQueryMap.convertResultSetToList(rs);
		    		 
		    		 if (!accounts.isEmpty()) 
		    		 {
		    			 for (Account account : accounts) 
		    			 {
		    				 JsonObject accountJson = new JsonObject();
		    				 accountJson.addProperty("acc_no", account.getAccNo());
		    				 accountJson.addProperty("acc_type",(""+AccountType.valueOf(account.getAccType())).toLowerCase());	
		    				 accountJson.addProperty("acc_balance", account.getAccBalance());
		    				 accountJson.addProperty("acc_status", ((""+Status.valueOf(account.getAccStatus())).toLowerCase()));
		    				 User user = userQueryMap.getUsername(conn, account.getUserId());
		    				 accountJson.addProperty("user_fullname", user.getFullname());
		    				 accountJson.addProperty("username", user.getUsername());
		    				 accountJson.addProperty("user_id",account.getUserId());
		    				 accountJson.addProperty("branch_id", account.getBranchId());
		    				 ResultSet rsBranch = branchQueryMap.selectBranchById(conn, account.getBranchId());
		    				 if(rsBranch.next())
		    				 {
		    					 accountJson.addProperty("branch_name", rsBranch.getString("branch_name"));
		    				 }
		    				 jsonArray.add(accountJson);
		    			 }
		    		 } 
		    		 else 
		    		 {
		    			 JsonHandler.sendErrorResponse(response, "No matching accounts found.");
		    			 return;
		    		 }
		    	 
		    	jedis.set(cacheKey, jsonArray.toString()); 
	            response.setContentType("application/json");
	            JsonHandler.sendJsonResponse(response, jsonArray);
	        } 
	        catch (SQLException e) 
	        {
	        	JsonHandler.sendErrorResponse(response, "Error fetching account details: " + e.getMessage());
	        }
        }
        jedis.close();

    }
    
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
    	String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey = "/"+path[0]+"/"+path[1]+"*/"+path[path.length-1]; 
    	
        try (Connection conn = DbConnection.connect()) 
        {
                    JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
                    Account newAccount = accountQueryMap.extractAccountDetails(jsonRequest,request);
                    newAccount.setBranchId(ControllerServlet.pathMap.get("branches"));
                    
                    if(request.getSession(false).getAttribute("user_role").equals("CUSTOMER"))
                    {
                    	newAccount.setUserId((Integer)request.getSession(false).getAttribute("user_id"));
                    }
                    
                    if(!accountQueryMap.checkAccount(newAccount))
                    {
                    	
                    	if (accountQueryMap.insertAccount(conn, newAccount)) 
                    	{
                    		jedis = ControllerServlet.pool.getResource();
                    		Set<String> keys = jedis.keys(cacheKey);
                    		if (!keys.isEmpty()) {
                                jedis.del(keys.toArray(new String[0]));
                                System.out.println("Deleted keys: " + keys);
                            }
                    		JsonHandler.sendSuccessResponse(response,"Account inserted successfully");
                    	} 
                    	else 
                    	{
                    		JsonHandler.sendErrorResponse(response,"Error inserting account");
                    	}
                    }
                    else {
                    	JsonHandler.sendErrorResponse(response,"Account already exists");
                    	
                    }
                    
              
            
        } 
        catch (SQLException e) 
        {
        	JsonHandler.sendErrorResponse(response,"Error processing request: " + e.getMessage());
        }
        finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }
    
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {  
    	SessionHandler.doOptions(request,response);
    	  
    	JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
    	

    	
        try (Connection conn = DbConnection.connect()) 
        {
        	Account newAccount = accountQueryMap.extractAccountDetails(jsonRequest,request);
//        	System.out.println(ControllerServlet.pathMap);
        	newAccount.setBranchId(ControllerServlet.pathMap.get("branches"));
        	newAccount.setAccNo(ControllerServlet.pathMap.get("accounts"));  
        	
        		 BankDAO bankQueryMap = new BankDAO();
        		 HashMap<String, Integer> bankMap = new HashMap<>();
        		 bankMap.put("banks",ControllerServlet.pathMap.get("banks"));
        		 ResultSet rsBank = bankQueryMap.getBanks(conn, bankMap);
        		 if(rsBank.next())
        		 {
        			 if(newAccount.getBranchId() == rsBank.getInt("main_branch_id"))
        			 {
        				 update(conn,newAccount,request,response);
        			 }
        			 else
        			 {
        				 HashMap<String, Integer> accountMap = new HashMap<>();
        				 accountMap.put("accounts", newAccount.getAccNo());
        				 ResultSet rs = accountQueryMap.selectAllAccounts(conn, accountMap);
        				 if(rs.next())
        				 {
        					 if(rs.getInt("branch_id")==newAccount.getBranchId())
        					 update(conn,newAccount,request,response);
        				 }
        			 }
        				 
        		 
        		
        		 }
        } 
        catch (SQLException e) 
        {
        	JsonHandler.sendErrorResponse(response,"Error updating account: " + e.getMessage());
        }
        finally {
                jedis.close();
            
        }
    }
	private void update(Connection conn,Account newAccount,HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException
	{
		String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey1 = "/"+path[0]+"/"+path[1]+"*/"+path[path.length-2]+"/"+path[path.length-1]; 
        String cacheKey2 = "/"+path[0]+"/"+path[1]+"*/"+path[path.length-2];
        
		 if (accountQueryMap.updateAccount(conn, newAccount)) 
		 {
			jedis = ControllerServlet.pool.getResource();
         	Set<String> keys = jedis.keys(cacheKey1);
    		if (!keys.isEmpty()) {
                jedis.del(keys.toArray(new String[0]));
                System.out.println("Deleted keys: " + keys);
            }
    		keys = jedis.keys(cacheKey2);
    		if (!keys.isEmpty()) {
                jedis.del(keys.toArray(new String[0]));
                System.out.println("Deleted keys: " + keys);
            }
			 JsonHandler.sendSuccessResponse(response,"Account updated successfully");
		 } 
		 else 
		 {
			 if(newAccount.getAccStatus()==Status.INACTIVE.getValue())
			 {
				 JsonHandler.sendErrorResponse(response,"Insufficient Balance");
			 }
 			JsonHandler.sendErrorResponse(response,"Error updating Account");
		 }
		 jedis.close();
	}
		
    

}
