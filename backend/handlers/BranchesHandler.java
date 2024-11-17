package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
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

import DAO.BankDAO;
import DAO.BranchDAO;
import DAO.UserDAO;
import enums.Resources;
import enums.UserRole;
import model.Bank;
import model.Branch;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;

public class BranchesHandler {

    private Logger logger = LoggerConfig.initializeLogger();

    private BranchDAO branchDAO = new BranchDAO();
    private BankDAO bankDao = new BankDAO();
    private UserDAO userDao = new UserDAO();
    private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();
    public static int offset = -1;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {

        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));
        jedis = ControllerServlet.pool.getResource();
        Map<String, String[]> queryParamMap = request.getParameterMap();
        cacheKey = JsonUtil.keyGenerate(cacheKey, queryParamMap);

        String cachedData = jedis.get(cacheKey);
        String searchParam = null;

        if (queryParamMap.containsKey("search_item")) {
            searchParam = queryParamMap.get("search_item")[0];

        }
        if (queryParamMap.containsKey("page")) {
            offset = (Integer.valueOf(queryParamMap.get("page")[0]) - 1) * BranchDAO.itemsPerPage;

        }
        if (cachedData != null) {

            JsonObject jsonObject = JsonParser.parseString(cachedData).getAsJsonObject();
            JsonUtil.sendJsonResponse(response, jsonObject);
            logger.info("Data fetched from Redis cache for key: " + cacheKey);
        } else {
            logger.info("Cache miss for key: " + cacheKey);

            ResultSet rs = null;
            try {
                conn = dbUtil.connect();
                JsonArray jsonArray = new JsonArray();
                int totalBranches = branchDAO.totalBranches(conn, ControllerServlet.pathMap, searchParam);

                if (request.getSession(false).getAttribute("user_role").equals(UserRole.MANAGER.toString())) {
                    rs = branchDAO.selectBranchByManager(conn, (int) request.getSession(false).getAttribute("user_id"));
                } else if (!ControllerServlet.pathMap.containsKey(Resources.BRANCHES.toString().toLowerCase())) {

                    rs = branchDAO.selectBranches(conn, ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()), searchParam);
                } else {
                    rs = branchDAO.selectBranchById(conn, ControllerServlet.pathMap.get(Resources.BRANCHES.toString().toLowerCase()));
                }

                List<Branch> branches = JsonUtil.convertResultSetToList(rs, Branch.class);
                JsonObject objectJson = new JsonObject();
                objectJson.addProperty("totalBranches", totalBranches);

                if (!branches.isEmpty()) {
                    for (Branch branch : branches) {
                        JsonObject jsonResponse = new JsonObject();
                        jsonResponse.addProperty("branch_id", branch.getBranch_id());
                        jsonResponse.addProperty("branch_name", branch.getName());
                        jsonResponse.addProperty("branch_address", branch.getAddress());
                        jsonResponse.addProperty("branch_number", branch.getBranch_number());
                        jsonResponse.addProperty("manager_id", branch.getManager_id());
                        jsonResponse.addProperty("bank_id", branch.getBank_id());
                        Bank bank = bankDao.getBankById(conn, branch.getBank_id());
                        jsonResponse.addProperty("bank_name", bank.getBank_name());
                        jsonResponse.addProperty("main_branch_id", bank.getMain_branch_id());
                        jsonResponse.addProperty("manager_name",
                                userDao.getUsername(conn, branch.getManager_id()).getUsername());
                        jsonArray.add(jsonResponse);
                    }
                }
                objectJson.add("data", jsonArray);

                jedis.set(cacheKey, objectJson.toString());
                JsonUtil.sendJsonResponse(response, objectJson);
                logger.info("Data fetched from DB and cached in Redis for key: " + cacheKey);
            } finally {

                dbUtil.close(conn, null, rs);
            }
            if (jedis != null) {
                jedis.close();
            }
        }
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        String[] cacheKeys = new String[] { "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "/branches",
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "/branches" + "_*",
                "*manager" };

        String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

        Branch branch = (Branch) JsonUtil.parseRequest(body, Branch.class);

        branch.setBank_id(ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()));

        try {
            conn = dbUtil.connect();
            if (branchDAO.insertBranch(conn, branch)) {
                jedis = ControllerServlet.pool.getResource();

                JsonUtil.deleteCache(jedis, cacheKeys);
                JsonUtil.sendSuccessResponse(response, "Branch inserted successfully");
                logger.info("Branch inserted successfully!");
            } else {
                JsonUtil.sendErrorResponse(response, "Error inserting branch");
                logger.warning("Error inserting branch");
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
        String[] cacheKeys = new String[] {
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "/branches/" + ControllerServlet.pathMap.get(Resources.BRANCHES.toString().toLowerCase()),
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "/branches",
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "/branches" + "_*",
                "*manager" };

        String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

        Branch branch = (Branch) JsonUtil.parseRequest(body, Branch.class);

        branch.setBank_id(ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()));
        branch.setBranch_id(ControllerServlet.pathMap.get(Resources.BRANCHES.toString().toLowerCase()));

        try {
            conn = dbUtil.connect();
            if (branchDAO.updateBranch(conn, branch)) {
                jedis = ControllerServlet.pool.getResource();

                JsonUtil.deleteCache(jedis, cacheKeys);
                JsonUtil.sendSuccessResponse(response, "Branch updated successfully");
                logger.info("Branch updated successfully");
            } else {
                JsonUtil.sendErrorResponse(response, "Error updating branch");
                logger.warning("Error updating branch");
            }
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }

    public void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        String[] cacheKeys = new String[] {
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "/branches/" + ControllerServlet.pathMap.get(Resources.BRANCHES.toString().toLowerCase()),
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "/branches",
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "/branches" + "_*",
                "*manager",
                "*accounts*" };

        try {
            conn = dbUtil.connect();
            if (branchDAO.deleteBranch(conn, ControllerServlet.pathMap.get(Resources.BRANCHES.toString().toLowerCase()))) {
                jedis = ControllerServlet.pool.getResource();
                JsonUtil.deleteCache(jedis, cacheKeys);
                JsonUtil.sendSuccessResponse(response, "Branch deleted successfully");
                logger.info("Branch deleted successfully ");
            } else {
                JsonUtil.sendErrorResponse(response, "Error deleting branch");
                logger.warning("Error deleting branch");
            }
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }
}
