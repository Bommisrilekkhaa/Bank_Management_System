package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
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
import enums.Resources;
import enums.Status;
import enums.UserRole;
import model.Account;
import model.User;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;

public class AccountsHandler {
    private Logger logger = LoggerConfig.initializeLogger();
    private AccountDAO accountDAO = new AccountDAO();
    private UserDAO userDAO = new UserDAO();
    private BranchDAO branchDAO = new BranchDAO();
    private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();
    public static int offset = -1;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {

        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));
        String role = request.getSession(false).getAttribute("user_role").toString();
        jedis = ControllerServlet.pool.getResource();
        Map<String, String[]> queryParamMap = request.getParameterMap();
        String searchParam = null;
        cacheKey = JsonUtil.keyGenerate(cacheKey, queryParamMap);
        String cachedData = jedis.get(cacheKey);
       
        if (queryParamMap.containsKey("filter_type")) {
            ControllerServlet.pathMap.put("a.acc_type",
                    Integer.valueOf(AccountType.valueOf(queryParamMap.get("filter_type")[0].toUpperCase()).getValue()));

        }
        if (queryParamMap.containsKey("filter_status")) {
            ControllerServlet.pathMap.put("a.acc_status",
                    Integer.valueOf(Status.valueOf(queryParamMap.get("filter_status")[0].toUpperCase()).getValue()));

        }
        if (queryParamMap.containsKey("search_item")) {
            searchParam = queryParamMap.get("search_item")[0];

        }
        if (queryParamMap.containsKey("page")) {
            offset = (Integer.valueOf(queryParamMap.get("page")[0]) - 1) * AccountDAO.itemsPerPage;

        }

        if (role.equals(UserRole.CUSTOMER.toString())) {
            ControllerServlet.pathMap.put("users", (Integer) request.getSession(false).getAttribute("user_id"));
            cachedData = null;
        }

        if (cachedData != null) {
            JsonObject jsonObject = JsonParser.parseString(cachedData).getAsJsonObject();
            JsonUtil.sendJsonResponse(response, jsonObject);
            logger.info("Data fetched from Redis cache for path: " + cacheKey);
        } else {
            ResultSet rs = null;
            ResultSet rsBranch = null;
            try {
                conn = dbUtil.connect();
                JsonArray jsonArray = new JsonArray();
                int totalAccounts = accountDAO.totalAccounts(conn, ControllerServlet.pathMap, searchParam);
                if (ControllerServlet.pathMap.containsKey(Resources.ACCOUNTS.toString().toLowerCase()) || (queryParamMap.size()==1 && queryParamMap.containsKey("filter_status"))) {
                    rs = accountDAO.selectAllAccounts(conn, ControllerServlet.pathMap);
                } else {
                    rs = accountDAO.selectPageWise(conn, ControllerServlet.pathMap, searchParam);
                }
                List<Account> accounts = JsonUtil.convertResultSetToList(rs, Account.class);
                JsonObject objectJson = new JsonObject();
                objectJson.addProperty("totalAccounts", totalAccounts);

                if (!accounts.isEmpty()) {
                    for (Account account : accounts) {
                        JsonObject accountJson = new JsonObject();
                        accountJson.addProperty("acc_no", account.getAccNo());
                        accountJson.addProperty("acc_type",
                                ("" + AccountType.valueOf(account.getAccType())).toLowerCase());
                        accountJson.addProperty("acc_balance", account.getAccBalance());
                        accountJson.addProperty("acc_status",
                                ("" + Status.valueOf(account.getAccStatus())).toLowerCase());
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
                    objectJson.add("data", jsonArray);
                    if (!role.equals(UserRole.CUSTOMER.toString())) {
                        jedis.set(cacheKey, objectJson.toString());
                        logger.info("Data cached in Redis for path: " + cacheKey);

                    }

                } else {
                    JsonUtil.sendErrorResponse(response, "No matching accounts found.");
                    logger.warning("No accounts found for path: " + cacheKey);
                    return;
                }

                response.setContentType("application/json");
                JsonUtil.sendJsonResponse(response, objectJson);
                logger.info("Data fetched from database for path: " + cacheKey);
            } finally {

                dbUtil.close(conn, null, rs);
                dbUtil.close(null, null, rsBranch);
            }

        }
        if (jedis != null) {
            jedis.close();
        }
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {

        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf(Resources.BANKS.toString().toLowerCase())).split("/");
        String[] cacheKeys = new String[] { "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1],
                "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1] + "_*" };

        try {
            conn = dbUtil.connect();
            String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

            Account newAccount = (Account) JsonUtil.parseRequest(body, Account.class);
            User user = (User) JsonUtil.parseRequest(body, User.class);
            newAccount.setBranchId(ControllerServlet.pathMap.get(Resources.BRANCHES.toString().toLowerCase()));

            if (request.getSession(false).getAttribute("user_role").equals("CUSTOMER")) {
                newAccount.setUserId((Integer) request.getSession(false).getAttribute("user_id"));
            } else {
                List<Integer> userId = userDAO.getUserId(dbUtil.connect(), user.getUsername());
                if (userId.size() != 0) {

                    newAccount.setUserId(userId.get(0));
                    HashMap<String, Integer> userMap = new HashMap<>();
                    userMap.put("users", newAccount.getUserId());
                    ResultSet rs = null;
                    try {

                        rs = userDAO.selectAllUsers(conn, userMap);
                        if (rs.next()) {
                            if (rs.getInt("user_role") != UserRole.CUSTOMER.getValue()) {
                                JsonUtil.sendErrorResponse(response,
                                        "Illegal Access for " + UserRole.valueOf(rs.getInt("user_role")) + "!");
                                logger.warning("Illegal Access for " + UserRole.valueOf(rs.getInt("user_role")) + "!");
                                return;
                            }
                        }
                    } finally {
                        dbUtil.close(null, null, rs);
                    }
                } else {
                    JsonUtil.sendErrorResponse(response, "User does not exists");
                    logger.warning("User does not exists for the username: " + user.getUsername());
                    return;

                }

            }

            if (!accountDAO.checkAccount(newAccount)) {
                if (accountDAO.insertAccount(conn, newAccount)) {
                    jedis = ControllerServlet.pool.getResource();

                    JsonUtil.deleteCache(jedis, cacheKeys);

                    JsonUtil.sendSuccessResponse(response, "Account inserted successfully");
                    logger.info("Account inserted successfully for path: " + cacheKeys[0]);
                } else {
                    JsonUtil.sendErrorResponse(response, "Error inserting account");
                    logger.warning("Failed to insert account for path: " + cacheKeys[0]);
                }
            } else {
                JsonUtil.sendErrorResponse(response, "Account already exists");
                logger.warning("Account already exists for path: " + cacheKeys[0]);
            }
        } finally {

            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }

    }

    public void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        ResultSet rsBank = null;

        try {
            conn = dbUtil.connect();
            String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

            Account newAccount = (Account) JsonUtil.parseRequest(body, Account.class);

            newAccount.setBranchId(ControllerServlet.pathMap.get(Resources.BRANCHES.toString().toLowerCase()));
            newAccount.setAccNo(ControllerServlet.pathMap.get(Resources.ACCOUNTS.toString().toLowerCase()));

            BankDAO bankDAO = new BankDAO();
            HashMap<String, Integer> bankMap = new HashMap<>();
            bankMap.put(Resources.BANKS.toString().toLowerCase(), ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()));
            rsBank = bankDAO.getBanks(conn, bankMap);
            if (rsBank.next()) {
                if (newAccount.getBranchId() == rsBank.getInt("main_branch_id")) {
                    update(conn, newAccount, request, response);
                } else {
                    ControllerServlet.pathMap.remove(Resources.BRANCHES.toString().toLowerCase());
                    ResultSet rs = null;
                    try {

                        rs = accountDAO.selectAllAccounts(conn, ControllerServlet.pathMap);

                        if (rs.next()) {
                            if (rs.getInt("branch_id") == newAccount.getBranchId()) {
                                update(conn, newAccount, request, response);
                            } else {

                                if (!accountDAO.checkAccount(newAccount)) {
                                    update(conn, newAccount, request, response);
                                } else {
                                    JsonUtil.sendErrorResponse(response, "Account already exists");
                                    logger.warning("Account already exists!");
                                }
                            }
                        }
                    } finally {

                        dbUtil.close(null, null, rs);
                    }
                }
            }
        } finally {

            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, rsBank);
        }

    }

    private void update(Connection conn, Account newAccount, HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf(Resources.BANKS.toString().toLowerCase())).split("/");
        String[] cacheKeys = new String[] {
                "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2] + "/" + path[path.length - 1],
                "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2],
                "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 2] + "_*" };
        try {
            if (accountDAO.updateAccount(conn, newAccount)) {
                jedis = ControllerServlet.pool.getResource();

                JsonUtil.deleteCache(jedis, cacheKeys);
                JsonUtil.sendSuccessResponse(response, "Account updated successfully");
                logger.info("Account updated successfully for path: " + cacheKeys[0]);
            } else {
                JsonUtil.sendErrorResponse(response, "Error updating account/Insufficient Balance");
                logger.warning("Failed to update account for path: " + cacheKeys[0]);
            }
        } finally {

            if (jedis != null) {
                jedis.close();
            }
        }
    }
}
