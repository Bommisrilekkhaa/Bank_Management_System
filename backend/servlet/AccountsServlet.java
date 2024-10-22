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
import utility.LoggerConfig;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class AccountsServlet extends HttpServlet {
    private Logger logger = LoggerConfig.initializeLogger();
    private AccountDAO accountQueryMap = new AccountDAO();
    private UserDAO userQueryMap = new UserDAO();
    private BranchDAO branchQueryMap = new BranchDAO();
    private Jedis jedis = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));

        jedis = ControllerServlet.pool.getResource();
        String cachedData = jedis.get(cacheKey);

        if (request.getSession(false).getAttribute("user_role").equals("CUSTOMER")) {
            ControllerServlet.pathMap.put("users", (Integer) request.getSession(false).getAttribute("user_id"));
            cachedData = null;
        }

        if (cachedData != null) {
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
            logger.info("Data fetched from Redis cache for path: " + cacheKey);
        } else {
            try (Connection conn = DbConnection.connect()) {
                JsonArray jsonArray = new JsonArray();
                ResultSet rs = accountQueryMap.selectAllAccounts(conn, ControllerServlet.pathMap);
                List<Account> accounts = accountQueryMap.convertResultSetToList(rs);

                if (!accounts.isEmpty()) {
                    for (Account account : accounts) {
                        JsonObject accountJson = new JsonObject();
                        accountJson.addProperty("acc_no", account.getAccNo());
                        accountJson.addProperty("acc_type", ("" + AccountType.valueOf(account.getAccType())).toLowerCase());
                        accountJson.addProperty("acc_balance", account.getAccBalance());
                        accountJson.addProperty("acc_status", ("" + Status.valueOf(account.getAccStatus())).toLowerCase());
                        User user = userQueryMap.getUsername(conn, account.getUserId());
                        accountJson.addProperty("user_fullname", user.getFullname());
                        accountJson.addProperty("username", user.getUsername());
                        accountJson.addProperty("user_id", account.getUserId());
                        accountJson.addProperty("branch_id", account.getBranchId());
                        ResultSet rsBranch = branchQueryMap.selectBranchById(conn, account.getBranchId());
                        if (rsBranch.next()) {
                            accountJson.addProperty("branch_name", rsBranch.getString("branch_name"));
                        }
                        jsonArray.add(accountJson);
                    }
                    jedis.set(cacheKey, jsonArray.toString());
                    logger.info("Data cached in Redis for path: " + cacheKey);
                } else {
                    JsonHandler.sendErrorResponse(response, "No matching accounts found.");
                    logger.warning("No accounts found for path: " + cacheKey);
                    return;
                }

                response.setContentType("application/json");
                JsonHandler.sendJsonResponse(response, jsonArray);
                logger.info("Data fetched from database for path: " + cacheKey);
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching account details: " + e.getMessage(), e);
                JsonHandler.sendErrorResponse(response, "Error fetching account details: " + e.getMessage());
            }
        }
        jedis.close();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1];

        try (Connection conn = DbConnection.connect()) {
            JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
            Account newAccount = accountQueryMap.extractAccountDetails(jsonRequest, request);
            newAccount.setBranchId(ControllerServlet.pathMap.get("branches"));

            if (request.getSession(false).getAttribute("user_role").equals("CUSTOMER")) {
                newAccount.setUserId((Integer) request.getSession(false).getAttribute("user_id"));
            }

            if (!accountQueryMap.checkAccount(newAccount)) {
                if (accountQueryMap.insertAccount(conn, newAccount)) {
                    jedis = ControllerServlet.pool.getResource();
                    Set<String> keys = jedis.keys(cacheKey);
                    if (!keys.isEmpty()) {
                        jedis.del(keys.toArray(new String[0]));
                        logger.info("Deleted cache keys: " + keys);
                    }
                    JsonHandler.sendSuccessResponse(response, "Account inserted successfully");
                    logger.info("Account inserted successfully for path: " + cacheKey);
                } else {
                    JsonHandler.sendErrorResponse(response, "Error inserting account");
                    logger.warning("Failed to insert account for path: " + cacheKey);
                }
            } else {
                JsonHandler.sendErrorResponse(response, "Account already exists");
                logger.warning("Account already exists for path: " + cacheKey);
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error processing request: " + e.getMessage(), e);
            JsonHandler.sendErrorResponse(response, "Error processing request: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);

        try (Connection conn = DbConnection.connect()) {
            Account newAccount = accountQueryMap.extractAccountDetails(jsonRequest, request);
            newAccount.setBranchId(ControllerServlet.pathMap.get("branches"));
            newAccount.setAccNo(ControllerServlet.pathMap.get("accounts"));

            BankDAO bankQueryMap = new BankDAO();
            HashMap<String, Integer> bankMap = new HashMap<>();
            bankMap.put("banks", ControllerServlet.pathMap.get("banks"));
            ResultSet rsBank = bankQueryMap.getBanks(conn, bankMap);
            if (rsBank.next()) {
                if (newAccount.getBranchId() == rsBank.getInt("main_branch_id") ||
                    accountQueryMap.selectAllAccounts(conn, new HashMap<>()).next()) {
                    update(conn, newAccount, request, response);
                }
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating account: " + e.getMessage(), e);
            JsonHandler.sendErrorResponse(response, "Error updating account: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }

    private void update(Connection conn, Account newAccount, HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey1 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2] + "/" + path[path.length - 1];
        String cacheKey2 = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2];

        if (accountQueryMap.updateAccount(conn, newAccount)) {
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
            JsonHandler.sendSuccessResponse(response, "Account updated successfully");
            logger.info("Account updated successfully for path: " + cacheKey1);
        } else {
            JsonHandler.sendErrorResponse(response, "Error updating account");
            logger.warning("Failed to update account for path: " + cacheKey1);
        }
        jedis.close();
    }
}
