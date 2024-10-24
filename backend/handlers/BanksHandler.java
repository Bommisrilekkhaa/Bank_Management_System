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
import DAO.UserDAO;
import model.Bank;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;
import utility.SessionUtil;

@SuppressWarnings("serial")
public class BanksHandler extends HttpServlet 
{
	private Logger logger=LoggerConfig.initializeLogger(); 
	private BankDAO bankDAO = new BankDAO();
	private UserDAO userDao = new UserDAO();
	private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();
  
   
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionUtil.doOptions(request,response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 

        jedis = ControllerServlet.pool.getResource();
        
        String cachedData = jedis.get(cacheKey);
        if (cachedData != null) {
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonUtil.sendJsonResponse(response, jsonArray);
            logger.info("Data fetched from Redis cache for key: " + cacheKey);
        }
        else {
            logger.info("Cache miss for key: " + cacheKey);
            ResultSet rs=null;
            try{
            	conn = dbUtil.connect();
                rs = bankDAO.getBanks(conn, ControllerServlet.pathMap);
                JsonArray jsonArray = new JsonArray();
                while(rs.next()) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("bank_id", rs.getInt("bank_id"));
                    jsonResponse.addProperty("bank_name", rs.getString("bank_name"));
                    jsonResponse.addProperty("bank_code", rs.getString("bank_code"));
                    jsonResponse.addProperty("admin_id", rs.getInt("admin_id"));
                    jsonResponse.addProperty("admin_name", userDao.getUsername(conn, rs.getInt("admin_id")).getFullname());
                    jsonResponse.addProperty("main_branch_id", rs.getInt("main_branch_id"));
                    jsonArray.add(jsonResponse);
                }
                jedis.set(cacheKey, jsonArray.toString());
                response.setContentType("application/json");
                JsonUtil.sendJsonResponse(response, jsonArray);
                logger.info("Data fetched from DB and cached in Redis for key: " + cacheKey);
            } 
            catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching bank details from DB", e);
                JsonUtil.sendErrorResponse(response, "Error fetching bank details: " + e.getMessage());
            }
            finally {
            	dbUtil.close(conn, null, rs);
            }
        }
        if (jedis != null) {
            jedis.close();
        }
    }

    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionUtil.doOptions(request, response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));

        try {
        	 conn = dbUtil.connect();
            JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);
            Bank newBank = bankDAO.extractBankDetails(jsonRequest);
            if (bankDAO.insertBank(conn, newBank)) {
                jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
                Set<String> keys = jedis.keys("*admin");
                if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    logger.info("Deleted cache keys: " + keys);
                }
                JsonUtil.sendSuccessResponse(response, "Bank inserted successfully");
                logger.info("New bank inserted and cache invalidated for key: " + cacheKey);
            } else {
                JsonUtil.sendErrorResponse(response, "Error inserting bank");
                logger.warning("Error inserting bank");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error inserting bank", e);
            JsonUtil.sendErrorResponse(response, "Error processing request: " + e.getMessage());
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
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));

        JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);
        Bank bank = new Bank();
        bank.setBank_id(ControllerServlet.pathMap.get("banks"));
        bank.setBank_name(jsonRequest.get("bank_name").getAsString());
        bank.setAdmin_id(jsonRequest.get("admin_id").getAsInt());
        bank.setMain_branch_id(jsonRequest.get("main_branch_id").getAsInt());

        try {
        	conn = dbUtil.connect();
            if (bankDAO.updateBank(conn, bank)) {
                jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
                jedis.del("/banks");
                JsonUtil.sendSuccessResponse(response, "Bank updated successfully");
                logger.info("Bank updated and cache invalidated for key: " + cacheKey);
            } else {
                JsonUtil.sendErrorResponse(response, "Error updating bank");
                logger.warning("Error updating bank");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating bank", e);
            JsonUtil.sendErrorResponse(response, "Error updating bank: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }
}
