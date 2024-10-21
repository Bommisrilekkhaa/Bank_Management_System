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
import enums.UserRole;
import model.Branch;
import redis.clients.jedis.Jedis;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

public class BranchesServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private BranchDAO branchQueryMap = new BranchDAO();
    private BankDAO bankDao = new BankDAO();
    private UserDAO userDao = new UserDAO();
    Jedis jedis = null;
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);

    	String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/branches")); 
        jedis = ControllerServlet.pool.getResource();
        
//        String cachedData =null;
        String cachedData = jedis.get(cacheKey);
        if (cachedData != null) 
        {

        	JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
            System.out.println("Data fetched from Redis cache");
        }
        else
        {
    		Branch branch = new Branch();
    		ResultSet rs;
            try (Connection conn = DbConnection.connect()) 
            {
	            	if(request.getSession(false).getAttribute("user_role").equals(UserRole.MANAGER.toString()))
	            	{
	            		rs = branchQueryMap.selectBranchByManager(conn,(int)request.getSession(false).getAttribute("user_id"));
	            	}
            		 else if( !ControllerServlet.pathMap.containsKey("branches"))
        			 {
        				 branch.setBank_id(ControllerServlet.pathMap.get("banks"));
        				 rs = branchQueryMap.selectBranches(conn,branch);
        				 
        			 }
        			 else
        			 {
        				 rs = branchQueryMap.selectBranchById(conn, ControllerServlet.pathMap.get("branches"));
        			 }
        			 
        			 JsonArray jsonArray = new JsonArray();
        			 while(rs.next())
        			 {
        				 
        				 JsonObject jsonResponse = new JsonObject();
        				 jsonResponse.addProperty("branch_id", rs.getInt("branch_id"));
        				 jsonResponse.addProperty("branch_name", rs.getString("branch_name"));
        				 jsonResponse.addProperty("branch_address", rs.getString("branch_address"));
        				 jsonResponse.addProperty("branch_number", rs.getInt("branch_number"));
        				 jsonResponse.addProperty("bank_id", rs.getInt("bank_id"));
        				 jsonResponse.addProperty("bank_name",bankDao.getBankById(conn, rs.getInt("bank_id")).getBank_name());
        				 jsonResponse.addProperty("manager_id", rs.getInt("manager_id"));
        				 jsonResponse.addProperty("manager_name",userDao.getUsername(conn, rs.getInt("manager_id")).getFullname());
        				 jsonArray.add(jsonResponse);
        			 }
        			 jedis.set(cacheKey, jsonArray.toString()); 
        			 JsonHandler.sendJsonResponse(response, jsonArray);
        			 
        		 
            	
            } 
            catch (SQLException e) 
            {
            	 JsonHandler.sendErrorResponse(response, "Error fetching branch: " + e.getMessage());
            }
            
        }
        jedis.close(); 

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
    	String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/branches")); 
    	
    	JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
    	
    	Branch branch = new Branch();
    	branch.setBank_id(ControllerServlet.pathMap.get("banks"));  
    	branchQueryMap.extractBranchDetails(jsonRequest,branch);
    	
    	
    	try (Connection conn = DbConnection.connect()) 
    	{
    		if (branchQueryMap.insertBranch(conn, branch)) 
    		{
    			jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
    			JsonHandler.sendSuccessResponse(response, "Branch inserted successfully");
    			
    		} 
    		else 
    		{
    			JsonHandler.sendErrorResponse(response, "Error inserting branch");
    		}
    	} 
    	catch (SQLException e) {
    		JsonHandler.sendErrorResponse(response, "Error inserting branch: " + e.getMessage());
    	}
    }

    

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {  
    	SessionHandler.doOptions(request,response);
    	String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/branches")); 
    	
    	JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
    	
        Branch branch = new Branch();
        branch.setBank_id(ControllerServlet.pathMap.get("banks"));       
        branch.setBranch_id(ControllerServlet.pathMap.get("branches"));    
        branchQueryMap.extractBranchDetails(jsonRequest,branch);
        try (Connection conn = DbConnection.connect()) 
        {
            if (branchQueryMap.updateBranch(conn, branch)) 
            {
            	jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
            	jedis.del("branches");
          	    JsonHandler.sendSuccessResponse(response, "Branch updated successfully");
            } 
            else 
            {
            	JsonHandler.sendErrorResponse(response, "Error updating branch");
            }
        } 
        catch (SQLException e) 
        {
        	JsonHandler.sendErrorResponse(response, "Error updating branch: " + e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	
    	SessionHandler.doOptions(request,response);

    	String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/branches")); 

        try (Connection conn = DbConnection.connect()) 
        {
            if (branchQueryMap.deleteBranch(conn, ControllerServlet.pathMap.get("branches"))) 
            {
            	jedis = ControllerServlet.pool.getResource();
                jedis.del(cacheKey);
            	jedis.del("branches");
            	JsonHandler.sendSuccessResponse(response,"Branch deleted successfully");

            } 
            else 
            {
            	JsonHandler.sendErrorResponse(response, "Error deleting branch");
            }
        } 
        catch (SQLException e) 
        {
        	JsonHandler.sendErrorResponse(response,"Error deleting branch: " + e.getMessage());
        }
    }
}
