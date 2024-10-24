package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
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

import DAO.BankDAO;
import DAO.BranchDAO;
import DAO.UserDAO;
import enums.UserRole;
import model.Bank;
import model.Branch;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;
import utility.SessionUtil;

public class BranchesHandler extends HttpServlet {

    private static final long serialVersionUID = 1L;
	private Logger logger=LoggerConfig.initializeLogger(); 

    private BranchDAO branchDAO = new BranchDAO();
    private BankDAO bankDao = new BankDAO();
    private UserDAO userDao = new UserDAO();
    private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();

   
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionUtil.doOptions(request, response);

        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));
        jedis = ControllerServlet.pool.getResource();
        
        String cachedData = jedis.get(cacheKey);
        if (cachedData != null) {
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonUtil.sendJsonResponse(response, jsonArray);
            logger.info("Data fetched from Redis cache for key: " + cacheKey);
        } else {
            logger.info("Cache miss for key: " + cacheKey);
            Branch branch = new Branch();
            ResultSet rs = null;
            try {
            	conn = dbUtil.connect();
                if (request.getSession(false).getAttribute("user_role").equals(UserRole.MANAGER.toString())) {
                    rs = branchDAO.selectBranchByManager(conn, (int) request.getSession(false).getAttribute("user_id"));
                } else if (!ControllerServlet.pathMap.containsKey("branches")) {
                    branch.setBank_id(ControllerServlet.pathMap.get("banks"));
                    rs = branchDAO.selectBranches(conn, branch);
                } else {
                    rs = branchDAO.selectBranchById(conn, ControllerServlet.pathMap.get("branches"));
                }

                JsonArray jsonArray = new JsonArray();
                while (rs.next()) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("branch_id", rs.getInt("branch_id"));
                    jsonResponse.addProperty("branch_name", rs.getString("branch_name"));
                    jsonResponse.addProperty("branch_address", rs.getString("branch_address"));
                    jsonResponse.addProperty("branch_number", rs.getInt("branch_number"));
                    jsonResponse.addProperty("bank_id", rs.getInt("bank_id"));
                    Bank bank=bankDao.getBankById(conn, rs.getInt("bank_id"));
                    jsonResponse.addProperty("bank_name", bank.getBank_name());
                    jsonResponse.addProperty("main_branch_id", bank.getMain_branch_id());
                    jsonResponse.addProperty("manager_id", rs.getInt("manager_id"));
                    jsonResponse.addProperty("manager_name", userDao.getUsername(conn, rs.getInt("manager_id")).getFullname());
                    jsonArray.add(jsonResponse);
                }

                jedis.set(cacheKey, jsonArray.toString());
                JsonUtil.sendJsonResponse(response, jsonArray);
                logger.info("Data fetched from DB and cached in Redis for key: " + cacheKey);
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching branch data from DB", e);
                JsonUtil.sendErrorResponse(response, "Error fetching branch: " + e.getMessage());
            } finally {
                
                dbUtil.close(conn, null, rs);
            }
            if (jedis != null) {
                jedis.close();
            }
        }
    }

   
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionUtil.doOptions(request, response);
        String cacheKey = "/banks/"+ControllerServlet.pathMap.get("banks")+"/branches";

        JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);
        Branch branch = new Branch();
        branch.setBank_id(ControllerServlet.pathMap.get("banks"));
        branchDAO.extractBranchDetails(jsonRequest, branch);

        try {
        	conn = dbUtil.connect();
            if (branchDAO.insertBranch(conn, branch)) {
                jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
                Set<String> keys = jedis.keys("*manager");
                if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    logger.info("Deleted cache keys: " + keys);
                }
                JsonUtil.sendSuccessResponse(response, "Branch inserted successfully");
                logger.info("Branch inserted successfully and cache invalidated for key: " + cacheKey);
            } else {
                JsonUtil.sendErrorResponse(response, "Error inserting branch");
                logger.warning("Error inserting branch");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error inserting branch", e);
            JsonUtil.sendErrorResponse(response, "Error inserting branch: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }

   
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionUtil.doOptions(request, response);
        String cacheKey1 = "/banks/"+ControllerServlet.pathMap.get("banks")+"/branches";
        String cacheKey2 = "/banks/"+ControllerServlet.pathMap.get("banks")+"/branches/"+ControllerServlet.pathMap.get("branches");
        JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);
        Branch branch = new Branch();
        branch.setBank_id(ControllerServlet.pathMap.get("banks"));
        branch.setBranch_id(ControllerServlet.pathMap.get("branches"));
        branchDAO.extractBranchDetails(jsonRequest, branch);

        try  {
        	 conn = dbUtil.connect();
            if (branchDAO.updateBranch(conn, branch)) {
                jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey1);
                jedis.del(cacheKey2);
                Set<String> keys = jedis.keys("*manager");
                if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    logger.info("Deleted cache keys: " + keys);
                }
                JsonUtil.sendSuccessResponse(response, "Branch updated successfully");
                logger.info("Branch updated successfully and cache invalidated for keys: " + cacheKey1+","+cacheKey2);
            } else {
                JsonUtil.sendErrorResponse(response, "Error updating branch");
                logger.warning("Error updating branch");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating branch", e);
            JsonUtil.sendErrorResponse(response, "Error updating branch: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }

 
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionUtil.doOptions(request, response);
        String cacheKey1 = "/banks/"+ControllerServlet.pathMap.get("banks")+"/branches";
        String cacheKey2 = "/banks/"+ControllerServlet.pathMap.get("banks")+"/branches/"+ControllerServlet.pathMap.get("branches");
       

        try {
        	conn = dbUtil.connect();
            if (branchDAO.deleteBranch(conn, ControllerServlet.pathMap.get("branches"))) {
                jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey1);
                jedis.del(cacheKey2);
                Set<String> keys = jedis.keys("*manager");
                if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    logger.info("Deleted cache keys: " + keys);
                }
                JsonUtil.sendSuccessResponse(response, "Branch deleted successfully");
                logger.info("Branch deleted successfully and cache invalidated for keys: " + cacheKey1+","+cacheKey2);
            } else {
                JsonUtil.sendErrorResponse(response, "Error deleting branch");
                logger.warning("Error deleting branch");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error deleting branch", e);
            JsonUtil.sendErrorResponse(response, "Error deleting branch: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }
}
