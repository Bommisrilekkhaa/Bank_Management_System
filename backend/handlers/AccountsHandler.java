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
import DAO.BankDAO;
import DAO.BranchDAO;
import DAO.UserDAO;
import enums.AccountType;
import enums.Status;
import model.Account;
import model.User;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;
import utility.SessionUtil;

@SuppressWarnings("serial")
public class AccountsHandler extends HttpServlet {
    private Logger logger = LoggerConfig.initializeLogger();
    private AccountDAO accountDAO = new AccountDAO();
    private UserDAO userDAO = new UserDAO();
    private BranchDAO branchDAO = new BranchDAO();
    private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();

   
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionUtil.doOptions(request, response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));

        jedis = ControllerServlet.pool.getResource();
        String cachedData = jedis.get(cacheKey);
        String param = request.getParameter("acc_status");
        
        if(param!=null)
        {
        	ControllerServlet.pathMap.put("a.acc_status", Integer.valueOf(request.getParameter("acc_status")));
        	cachedData = null;
        }
        
        if (request.getSession(false).getAttribute("user_role").equals("CUSTOMER")) {
            ControllerServlet.pathMap.put("users", (Integer) request.getSession(false).getAttribute("user_id"));
            cachedData = null;
        }

        if (cachedData != null) {
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonUtil.sendJsonResponse(response, jsonArray);
            logger.info("Data fetched from Redis cache for path: " + cacheKey);
        } else {
        	ResultSet rs=null;
        	ResultSet rsBranch=null;
            try{
            	conn = dbUtil.connect();
                JsonArray jsonArray = new JsonArray();
                rs = accountDAO.selectAllAccounts(conn, ControllerServlet.pathMap);
                List<Account> accounts = accountDAO.convertResultSetToList(rs);

                if (!accounts.isEmpty()) {
                    for (Account account : accounts) {
                        JsonObject accountJson = new JsonObject();
                        accountJson.addProperty("acc_no", account.getAccNo());
                        accountJson.addProperty("acc_type", ("" + AccountType.valueOf(account.getAccType())).toLowerCase());
                        accountJson.addProperty("acc_balance", account.getAccBalance());
                        accountJson.addProperty("acc_status", ("" + Status.valueOf(account.getAccStatus())).toLowerCase());
                        User user = userDAO.getUsername(conn, account.getUserId());
                        accountJson.addProperty("user_fullname", user.getFullname());
                        accountJson.addProperty("username", user.getUsername());
                        accountJson.addProperty("user_id", account.getUserId());
                        accountJson.addProperty("branch_id", account.getBranchId());
                        rsBranch = branchDAO.selectBranchById(conn, account.getBranchId());
                        if (rsBranch.next()) {
                            accountJson.addProperty("branch_name", rsBranch.getString("branch_name"));
                        }
                        jsonArray.add(accountJson);
                    }
                    jedis.set(cacheKey, jsonArray.toString());
                    logger.info("Data cached in Redis for path: " + cacheKey);
                } else {
                    JsonUtil.sendErrorResponse(response, "No matching accounts found.");
                    logger.warning("No accounts found for path: " + cacheKey);
                    return;
                }

                response.setContentType("application/json");
                JsonUtil.sendJsonResponse(response, jsonArray);
                logger.info("Data fetched from database for path: " + cacheKey);
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching account details: " + e.getMessage(), e);
                JsonUtil.sendErrorResponse(response, "Error fetching account details: " + e.getMessage());
            }
            finally {
            	dbUtil.close(conn, null, rs);
            	dbUtil.close(null, null, rsBranch);
            }
        }
        if (jedis != null) {
            jedis.close();
        }
    }

  
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionUtil.doOptions(request, response);
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1];

        try {
           	conn = dbUtil.connect();
            JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);
            Account newAccount = accountDAO.extractAccountDetails(jsonRequest, request);
            newAccount.setBranchId(ControllerServlet.pathMap.get("branches"));

            if (request.getSession(false).getAttribute("user_role").equals("CUSTOMER")) {
                newAccount.setUserId((Integer) request.getSession(false).getAttribute("user_id"));
            }

            if (!accountDAO.checkAccount(newAccount)) {
                if (accountDAO.insertAccount(conn, newAccount)) {
                    jedis = ControllerServlet.pool.getResource();
                    Set<String> keys = jedis.keys(cacheKey);
                    if (!keys.isEmpty()) {
                        jedis.del(keys.toArray(new String[0]));
                        logger.info("Deleted cache keys: " + keys);
                    }
                    JsonUtil.sendSuccessResponse(response, "Account inserted successfully");
                    logger.info("Account inserted successfully for path: " + cacheKey);
                } else {
                    JsonUtil.sendErrorResponse(response, "Error inserting account");
                    logger.warning("Failed to insert account for path: " + cacheKey);
                }
            } else {
                JsonUtil.sendErrorResponse(response, "Account already exists");
                logger.warning("Account already exists for path: " + cacheKey);
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error processing request: " + e.getMessage(), e);
            JsonUtil.sendErrorResponse(response, "Error processing request: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
           dbUtil.close(conn, null, null);
            
        }
    }

    
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionUtil.doOptions(request, response);
        JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);

        try {
           	conn = dbUtil.connect();
            Account newAccount = accountDAO.extractAccountDetails(jsonRequest, request);
            newAccount.setBranchId(ControllerServlet.pathMap.get("branches"));
            newAccount.setAccNo(ControllerServlet.pathMap.get("accounts"));

            BankDAO bankDAO = new BankDAO();
            HashMap<String, Integer> bankMap = new HashMap<>();
            bankMap.put("banks", ControllerServlet.pathMap.get("banks"));
            ResultSet rsBank = bankDAO.getBanks(conn, bankMap);
            if (rsBank.next()) {
                if (newAccount.getBranchId() == rsBank.getInt("main_branch_id") ||
                    accountDAO.selectAllAccounts(conn, new HashMap<>()).next()) {
                    update(conn, newAccount, request, response);
                }
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating account: " + e.getMessage(), e);
            JsonUtil.sendErrorResponse(response, "Error updating account: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
            
        }
    }

    private void update(Connection conn, Account newAccount, HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey1 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2] + "/" + path[path.length - 1];
        String cacheKey2 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2];

        if (accountDAO.updateAccount(conn, newAccount)) {
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
            JsonUtil.sendSuccessResponse(response, "Account updated successfully");
            logger.info("Account updated successfully for path: " + cacheKey1);
        } else {
            JsonUtil.sendErrorResponse(response, "Error updating account");
            logger.warning("Failed to update account for path: " + cacheKey1);
        }
        if (jedis != null) {
            jedis.close();
        }
    }
}
