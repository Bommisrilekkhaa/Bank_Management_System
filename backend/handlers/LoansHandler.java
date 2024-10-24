package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
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
import model.Loan;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;
import utility.SessionUtil;

@SuppressWarnings("serial")
public class LoansHandler extends HttpServlet {
    private Logger logger = LoggerConfig.initializeLogger();
    private LoanDAO loanDAO = new LoanDAO();
    private AccountDAO accountDao = new AccountDAO();
    private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();

  
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("GET request received for LoansServlet");
        SessionUtil.doOptions(request, response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 
        
        jedis = ControllerServlet.pool.getResource();
        String cachedData = jedis.get(cacheKey);
        
        if(request.getSession(false).getAttribute("user_role").equals("CUSTOMER")) {
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
                List<Loan> loans = loanDAO.convertResultSetToList(rs);
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
                    jedis.set(cacheKey, jsonArray.toString());
                    logger.info("Data cached with key: " + cacheKey);
                    response.setContentType("application/json");
                    JsonUtil.sendJsonResponse(response, jsonArray);
                } else {
                    logger.warning("No matching loans found.");
                    JsonUtil.sendErrorResponse(response, "No matching loans found.");
                }
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching loan details: " + e.getMessage(), e);
                JsonUtil.sendErrorResponse(response, "Error fetching loan details: " + e.getMessage());
            }
            finally {
            	dbUtil.close(conn, null, rs);
            }
        }
        
        if (jedis != null) {
            jedis.close();
        }
    }
    
  
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("POST request received for LoansServlet");
        SessionUtil.doOptions(request, response);
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1];

        try {
        	conn = dbUtil.connect();
            JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);
            Loan newLoan = loanDAO.extractLoanDetails(jsonRequest, request);
            newLoan.setAcc_no(ControllerServlet.pathMap.get("accounts"));
            if (checkAccountStatus(conn, newLoan)) {
                if (!loanDAO.isLoanExists()) {
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
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error processing loan insertion: " + e.getMessage(), e);
            JsonUtil.sendErrorResponse(response, "Error processing request: " + e.getMessage());
        } finally {
            if (jedis != null) jedis.close();
            dbUtil.close(conn, null, null);
        }
    }
    
   
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("PUT request received for LoansServlet");
        SessionUtil.doOptions(request, response);
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey1 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2] + "/" + path[path.length - 1];
        String cacheKey2 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2];

        JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);

        try  {
        	conn = dbUtil.connect();
            Loan updatedLoan = loanDAO.extractLoanDetails(jsonRequest, request);
            updatedLoan.setAcc_no(ControllerServlet.pathMap.get("accounts"));
            updatedLoan.setLoan_id(ControllerServlet.pathMap.get("loans"));
            if (checkAccountStatus(conn, updatedLoan)) {
                if (updatedLoan.getLoan_amount() > 3000000 && 
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
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating loan: " + e.getMessage(), e);
            JsonUtil.sendErrorResponse(response, "Error updating loan: " + e.getMessage());
        } finally {
            if (jedis != null) jedis.close();
            dbUtil.close(conn, null, null);
        }
    }

    private boolean checkAccountStatus(Connection conn, Loan loan) {
        HashMap<String, Integer> accountMap = new HashMap<>();
        accountMap.put("accounts", loan.getAcc_no());
        accountMap.put("a.acc_status", Status.ACTIVE.getValue());
        boolean isActive=false;
        ResultSet rs=null;
		try {
			rs = accountDao.selectAllAccounts(conn, accountMap);
			isActive= rs.next();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			dbUtil.close(null, null, rs);
		}
        logger.info("Account status check for acc_no " + loan.getAcc_no() + ": " + (isActive ? "Active" : "Inactive"));
        return isActive;
    }
}
