package servlet;

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
import utility.DbConnection;
import utility.JsonHandler;
import utility.LoggerConfig;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class LoansServlet extends HttpServlet {
    private Logger logger = LoggerConfig.initializeLogger();
    private LoanDAO loanQueryMap = new LoanDAO();
    private AccountDAO accountDao = new AccountDAO();
    Jedis jedis = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("GET request received for LoansServlet");
        SessionHandler.doOptions(request, response);
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
            JsonHandler.sendJsonResponse(response, jsonArray);
        } else {
            logger.info("No cache found, querying database.");
            try (Connection conn = DbConnection.connect()) {
                ResultSet rs = loanQueryMap.selectAllLoans(conn, ControllerServlet.pathMap);
                List<Loan> loans = loanQueryMap.convertResultSetToList(rs);
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
                    JsonHandler.sendJsonResponse(response, jsonArray);
                } else {
                    logger.warning("No matching loans found.");
                    JsonHandler.sendErrorResponse(response, "No matching loans found.");
                }
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching loan details: " + e.getMessage(), e);
                JsonHandler.sendErrorResponse(response, "Error fetching loan details: " + e.getMessage());
            }
        }
        jedis.close();
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("POST request received for LoansServlet");
        SessionHandler.doOptions(request, response);
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1];

        try (Connection conn = DbConnection.connect()) {
            JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
            Loan newLoan = loanQueryMap.extractLoanDetails(jsonRequest, request);
            newLoan.setAcc_no(ControllerServlet.pathMap.get("accounts"));
            if (checkAccountStatus(conn, newLoan)) {
                if (!loanQueryMap.isLoanExists()) {
                    if (loanQueryMap.insertLoan(conn, newLoan)) {
                        jedis = ControllerServlet.pool.getResource();
                        Set<String> keys = jedis.keys(cacheKey);
                        if (!keys.isEmpty()) {
                            jedis.del(keys.toArray(new String[0]));
                            logger.info("Deleted cache keys: " + keys);
                        }
                        JsonHandler.sendSuccessResponse(response, "Loan inserted successfully");
                    } else {
                        logger.warning("Error inserting loan.");
                        JsonHandler.sendErrorResponse(response, "Error inserting loan");
                    }
                } else {
                    logger.warning("Loan already exists.");
                    JsonHandler.sendErrorResponse(response, "Loan already exists");
                }
            } else {
                logger.warning("Unauthorized account access.");
                JsonHandler.sendErrorResponse(response, "Unauthorized Account");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error processing loan insertion: " + e.getMessage(), e);
            JsonHandler.sendErrorResponse(response, "Error processing request: " + e.getMessage());
        } finally {
            if (jedis != null) jedis.close();
        }
    }
    
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("PUT request received for LoansServlet");
        SessionHandler.doOptions(request, response);
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey1 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2] + "/" + path[path.length - 1];
        String cacheKey2 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2];

        JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);

        try (Connection conn = DbConnection.connect()) {
            Loan updatedLoan = loanQueryMap.extractLoanDetails(jsonRequest, request);
            updatedLoan.setAcc_no(ControllerServlet.pathMap.get("accounts"));
            updatedLoan.setLoan_id(ControllerServlet.pathMap.get("loans"));
            if (checkAccountStatus(conn, updatedLoan)) {
                if (updatedLoan.getLoan_amount() > 3000000 && 
                    updatedLoan.getLoan_status() != LoanStatus.REJECTED.getValue()) {
                    logger.warning("Loan amount exceeds limit, updating status to REJECTED.");
                    JsonHandler.sendErrorResponse(response, "Error updating loan, Loan amount is greater than Limit");
                }

                if (loanQueryMap.updateLoan(conn, updatedLoan)) {
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
                    JsonHandler.sendSuccessResponse(response, "Loan updated successfully");
                } else {
                    logger.warning("Error updating loan.");
                    JsonHandler.sendErrorResponse(response, "Error updating loan");
                }
            } else {
                logger.warning("Unauthorized account access.");
                JsonHandler.sendErrorResponse(response, "Unauthorized Account");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating loan: " + e.getMessage(), e);
            JsonHandler.sendErrorResponse(response, "Error updating loan: " + e.getMessage());
        } finally {
            if (jedis != null) jedis.close();
        }
    }

    private boolean checkAccountStatus(Connection conn, Loan loan) throws SQLException {
        HashMap<String, Integer> accountMap = new HashMap<>();
        accountMap.put("accounts", loan.getAcc_no());
        accountMap.put("a.acc_status", Status.ACTIVE.getValue());
        ResultSet rs = accountDao.selectAllAccounts(conn, accountMap);
        boolean isActive = rs.next();
        logger.info("Account status check for acc_no " + loan.getAcc_no() + ": " + (isActive ? "Active" : "Inactive"));
        return isActive;
    }
}
