package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
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
import model.Bank;
import redis.clients.jedis.Jedis;
import utility.DbConnection;
import utility.JsonHandler;
import utility.LoggerConfig;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class BanksServlet extends HttpServlet 
{
	private Logger logger=LoggerConfig.initializeLogger(); 
    BankDAO bankQueryMap = new BankDAO();
    BranchDAO branchDao = new BranchDAO();
    UserDAO userDao = new UserDAO();
    Jedis jedis = null;
  
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request,response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 

        jedis = ControllerServlet.pool.getResource();
        
        String cachedData = jedis.get(cacheKey);
        if (cachedData != null) {
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
            logger.info("Data fetched from Redis cache for key: " + cacheKey);
        }
        else {
            logger.info("Cache miss for key: " + cacheKey);
            try (Connection conn = DbConnection.connect()) {
                ResultSet rs = bankQueryMap.getBanks(conn, ControllerServlet.pathMap);
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
                JsonHandler.sendJsonResponse(response, jsonArray);
                logger.info("Data fetched from DB and cached in Redis for key: " + cacheKey);
            } 
            catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching bank details from DB", e);
                JsonHandler.sendErrorResponse(response, "Error fetching bank details: " + e.getMessage());
            }
        }
        jedis.close();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request, response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));

        try (Connection conn = DbConnection.connect()) {
            JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
            Bank newBank = bankQueryMap.extractBankDetails(jsonRequest);
            if (bankQueryMap.insertBank(conn, newBank)) {
                jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
                JsonHandler.sendSuccessResponse(response, "Bank inserted successfully");
                logger.info("New bank inserted and cache invalidated for key: " + cacheKey);
            } else {
                JsonHandler.sendErrorResponse(response, "Error inserting bank");
                logger.warning("Error inserting bank");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error inserting bank", e);
            JsonHandler.sendErrorResponse(response, "Error processing request: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request, response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));

        JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
        Bank bank = new Bank();
        bank.setBank_id(ControllerServlet.pathMap.get("banks"));
        bank.setBank_name(jsonRequest.get("bank_name").getAsString());
        bank.setAdmin_id(jsonRequest.get("admin_id").getAsInt());
        bank.setMain_branch_id(jsonRequest.get("main_branch_id").getAsInt());

        try (Connection conn = DbConnection.connect()) {
            if (bankQueryMap.updateBank(conn, bank)) {
                jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
                jedis.del("/banks");
                JsonHandler.sendSuccessResponse(response, "Bank updated successfully");
                logger.info("Bank updated and cache invalidated for key: " + cacheKey);
            } else {
                JsonHandler.sendErrorResponse(response, "Error updating bank");
                logger.warning("Error updating bank");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating bank", e);
            JsonHandler.sendErrorResponse(response, "Error updating bank: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }
}
