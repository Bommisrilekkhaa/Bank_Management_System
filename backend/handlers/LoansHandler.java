package handlers;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import DAO.AccountDAO;
import DAO.LoanDAO;
import enums.LoanStatus;
import enums.LoanType;
import enums.Status;
import enums.UserRole;
import model.Loan;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;

public class LoansHandler{
    private Logger logger = LoggerConfig.initializeLogger();
    private LoanDAO loanDAO = new LoanDAO();
    private AccountDAO accountDao = new AccountDAO();
    private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();

  
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException ,SQLException{
        logger.info("GET request received for LoansServlet");
      
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 

        String role = request.getSession(false).getAttribute("user_role").toString();
        jedis = ControllerServlet.pool.getResource();
        String cachedData = jedis.get(cacheKey);
        
        if (role.equals(UserRole.CUSTOMER.toString())) {
            ControllerServlet.pathMap.put("user_id", (Integer) request.getSession(false).getAttribute("user_id"));
            cachedData = null;
        }

        if (cachedData != null) {
            logger.info("Fetching data from Redis cache for key: " + cacheKey);
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonUtil.sendJsonResponse(response, jsonArray);
        } else {
            logger.info("No cache found, querying database.");
            ResultSet rs=null;
            try {
            	conn = dbUtil.connect();
                rs = loanDAO.selectAllLoans(conn, ControllerServlet.pathMap);
                List<Loan> loans = JsonUtil.convertResultSetToList(rs, Loan.class);
                
                JsonArray jsonArray = new JsonArray();

                if (!loans.isEmpty()) {
                    for (Loan loan : loans) {
                        JsonObject loanJson = new JsonObject();
                        loanJson.addProperty("loan_id", loan.getLoan_id());
                        loanJson.addProperty("loan_type", LoanType.valueOf(loan.getLoan_type()).toString().toLowerCase());
                        loanJson.addProperty("loan_amount", loan.getLoan_amount());
                        loanJson.addProperty("loan_interest", loan.getLoan_interest());
                        loanJson.addProperty("loan_duration", loan.getLoan_duration());
                        loanJson.addProperty("loan_status", LoanStatus.valueOf(loan.getLoan_status()).toString().toLowerCase());
                        loanJson.addProperty("loan_availed_date", loan.getLoan_availed_date().toString());
                        loanJson.addProperty("acc_number", loan.getAcc_no());
                        jsonArray.add(loanJson);
                    }
                    
                    if(!role.equals(UserRole.CUSTOMER.toString()))
                    {
	                    jedis.set(cacheKey, jsonArray.toString());
	                    logger.info("Data cached with key: " + cacheKey);
                    }
                    response.setContentType("application/json");
                    JsonUtil.sendJsonResponse(response, jsonArray);
                } else {
                    logger.warning("No matching loans found.");
                    JsonUtil.sendErrorResponse(response, "No matching loans found.");
                }
            } 
            finally {
            	dbUtil.close(conn, null, rs);
            }
        }
        
        if (jedis != null) {
            jedis.close();
        }
    }
    
  
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        logger.info("POST request received for LoansServlet");
       
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1];

        try {
        	conn = dbUtil.connect();
        	String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
             
        	Loan newLoan = (Loan) JsonUtil.parseRequest(body,Loan.class);
            
            newLoan.setAcc_no(ControllerServlet.pathMap.get("accounts"));
            
            if(loanDAO.checkLoans(newLoan.getAcc_no()))
        	{
            	newLoan.setLoan_interest(11.0);
        	}
        	else
        	{
        		
        		newLoan.setLoan_interest(15.0);
        	}
	        if(newLoan.getLoan_status() < 2)
	        {
	        	newLoan.setLoan_availed_date(new java.sql.Date(System.currentTimeMillis()));
	        	
	        }
        	
            if (checkAccountStatus(conn, newLoan)) {
                if (!loanDAO.isLoanExists(newLoan)) {
                    if (loanDAO.insertLoan(conn, newLoan)) {
                        jedis = ControllerServlet.pool.getResource();
                        Set<String> keys = jedis.keys(cacheKey);
                        if (!keys.isEmpty()) {
                            jedis.del(keys.toArray(new String[0]));
                            logger.info("Deleted cache keys: " + keys);
                        }
                        JsonUtil.sendSuccessResponse(response, "Loan inserted successfully");
                    } else {
                        logger.warning("Error inserting loan.");
                        JsonUtil.sendErrorResponse(response, "Error inserting loan");
                    }
                } else {
                    logger.warning("Loan already exists.");
                    JsonUtil.sendErrorResponse(response, "Loan already exists");
                }
            } else {
                logger.warning("Unauthorized account access.");
                JsonUtil.sendErrorResponse(response, "Unauthorized Account");
            }
        } finally {
            if (jedis != null) jedis.close();
            dbUtil.close(conn, null, null);
        }
    }
    
   
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        logger.info("PUT request received for LoansServlet");
     
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey1 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2] + "/" + path[path.length - 1];
        String cacheKey2 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2];

        try  {
        	conn = dbUtil.connect();
        	String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        	
        	Loan updatedLoan = (Loan) JsonUtil.parseRequest(body,Loan.class);
        	
            updatedLoan.setAcc_no(ControllerServlet.pathMap.get("accounts"));
            updatedLoan.setLoan_id(ControllerServlet.pathMap.get("loans"));
            if(updatedLoan.getLoan_status() < 2)
	        {
            	updatedLoan.setLoan_availed_date(new java.sql.Date(System.currentTimeMillis()));
	        	
	        }
            if (checkAccountStatus(conn, updatedLoan)) {
                if (updatedLoan.getLoan_amount().compareTo(BigDecimal.valueOf(3000000.0))==1  && 
                    updatedLoan.getLoan_status() != LoanStatus.REJECTED.getValue()) {
                    logger.warning("Loan amount exceeds limit, updating status to REJECTED.");
                    JsonUtil.sendErrorResponse(response, "Loan amount is greater than Limit!");
                }

                if (loanDAO.updateLoan(conn, updatedLoan)) {
                    jedis = ControllerServlet.pool.getResource();
                    Set<String> keys = jedis.keys(cacheKey1);
                    if (!keys.isEmpty()) {
                        jedis.del(keys.toArray(new String[0]));
                        logger.info("Deleted cache keys: " + keys);
                    }
                    keys = jedis.keys(cacheKey2);
                    if (!keys.isEmpty()) {
                        jedis.del(keys.toArray(new String[0]));
                        logger.info("Deleted cache keys: " + keys);
                    }
                    JsonUtil.sendSuccessResponse(response, "Loan updated successfully");
                } else {
                    logger.warning("Error updating loan.");
                    JsonUtil.sendErrorResponse(response, "Error updating loan");
                }
            } else {
                logger.warning("Unauthorized account access.");
                JsonUtil.sendErrorResponse(response, "Unauthorized Account");
            }
        } finally {
            if (jedis != null) jedis.close();
            dbUtil.close(conn, null, null);
        }
    }

    private boolean checkAccountStatus(Connection conn, Loan loan) throws SQLException {
        HashMap<String, Integer> accountMap = new HashMap<>();
        accountMap.put("accounts", loan.getAcc_no());
        accountMap.put("a.acc_status", Status.ACTIVE.getValue());
        boolean isActive=false;
        ResultSet rs=null;
		try {
			rs = accountDao.selectAllAccounts(conn, accountMap);
			isActive= rs.next();
		} 
		finally {
			dbUtil.close(null, null, rs);
		}
        logger.info("Account status check for acc_no " + loan.getAcc_no() + ": " + (isActive ? "Active" : "Inactive"));
        return isActive;
    }
}
