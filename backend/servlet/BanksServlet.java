package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

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
import utility.SessionHandler;
@SuppressWarnings("serial")
public class BanksServlet extends HttpServlet 
{
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
        
//        String cachedData = null;
        String cachedData = jedis.get(cacheKey);
        if (cachedData != null) {

        	JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
            System.out.println("Data fetched from Redis cache");
        }
        else
        {
        	 
        	 try (Connection conn = DbConnection.connect()) 
        	 {
        		 ResultSet rs = bankQueryMap.getBanks(conn,ControllerServlet.pathMap);
        		 JsonArray jsonArray = new JsonArray();
        		 
        		 while(rs.next()) 
        		 {
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
        		 System.out.println("Data fetched from DB and cached in Redis");
        	 } 
        	 catch (SQLException e) 
        	 {
        		 JsonHandler.sendErrorResponse(response, "Error fetching bank details: " + e.getMessage());
        		 
        	 }
        	 
         }
        jedis.close(); 
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
    	String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 
    	
        try (Connection conn = DbConnection.connect()) 
        {
        			JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
                    
                    Bank newBank = bankQueryMap.extractBankDetails(jsonRequest);

                    if (bankQueryMap.insertBank(conn, newBank)) 
                    {
                    	jedis = ControllerServlet.pool.getResource();
                        jedis.del(cacheKey);
                        JsonHandler.sendSuccessResponse(response, "Bank inserted successfully");
                       
                    } 
                    else 
                    {
                    	 JsonHandler.sendErrorResponse(response, "Error inserting bank");
                      
                    }
                    
        } 
        catch (SQLException e) 
        {
        	 JsonHandler.sendErrorResponse(response, "Error processing request: " + e.getMessage());
             
        }
        finally {
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

        try (Connection conn = DbConnection.connect()) 
        {
            if (bankQueryMap.updateBank(conn, bank)) 
            {
            	jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
                jedis.del("/banks");
                JsonHandler.sendSuccessResponse(response, "Bank updated successfully");
            } 
            else 
            {
            	 JsonHandler.sendErrorResponse(response, "Error updating bank");
            }
        } 
        catch (SQLException e) 
        {
        	 JsonHandler.sendErrorResponse(response, "Error updating bank: " + e.getMessage());
        }
        finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }
    
   
}
