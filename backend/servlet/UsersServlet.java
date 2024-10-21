package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import DAO.UserDAO;
import enums.Status;
import enums.UserRole;
import model.User;
import redis.clients.jedis.Jedis;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class UsersServlet extends HttpServlet 
{
    private UserDAO userQueryMap = new UserDAO();
    private User user = new User();
    Jedis jedis = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	
    	SessionHandler.doOptions(request, response);
    	String adminParam = request.getParameter("filter_admin");
    	String managerParam = request.getParameter("filter_manager");
    	
    	 String path = request.getRequestURI();
         String cacheKey = path.substring(path.indexOf("/users")); 
         
        if(managerParam!=null)
        {
        	cacheKey = path.substring(path.indexOf("/banks"))+"_filter_manager"; 
        }
        else if(adminParam!=null)
        {
        	cacheKey+="_filter_admin";
        }
        jedis = ControllerServlet.pool.getResource();
        
//         String cachedData = null;
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
	    		 JsonArray jsonArray = new JsonArray();
	    		 if(managerParam!=null)
	    		 {
	    			 
	    			 ResultSet rs = userQueryMap.getUnassignedManagers(conn);
	    			 
	    			 
	    			 while(rs.next())
	    			 {
	    				 
	    				 JsonObject jsonResponse = new JsonObject();
	    				 jsonResponse.addProperty("manager_id", rs.getInt("user_id"));
	    				 jsonResponse.addProperty("manager_name", rs.getString("full_name"));
	    				 jsonArray.add(jsonResponse);
	    			 }
	    		 }
	    		 else if(adminParam!=null)
	    		 {
	    			 ResultSet rs = userQueryMap.getUnassignedAdmins(conn);	
	    			 
	    			 while(rs.next())
	    			 {
	    				 
	    				 JsonObject jsonResponse = new JsonObject();
	    				 jsonResponse.addProperty("admin_id", rs.getInt("user_id"));
	    				 jsonResponse.addProperty("admin_name", rs.getString("full_name"));
	    				 jsonArray.add(jsonResponse);
	    			 }
	    		 }
	    		 else
	    		 {
	    			 ResultSet rs = userQueryMap.selectAllUsers(conn);
	               
	               List<User> users = userQueryMap.convertResultSetToList(rs);
	              
	               if (!users.isEmpty()) 
	               {
	                   for (User user : users) 
	                   {
	                	   if(user.getUser_role()!=UserRole.SUPERADMIN.getValue())
	                	   {
	                		   
	                		   JsonObject userJson = new JsonObject();
	                		   userJson.addProperty("user_id", user.getUser_id());
	                		   userJson.addProperty("fullname", user.getFullname());
	                		   userJson.addProperty("date_of_birth", user.getDate_of_birth().toString());
	                		   userJson.addProperty("user_phonenumber", user.getUser_phonenumber());
	                		   userJson.addProperty("user_address", user.getUser_address());
	                		   userJson.addProperty("user_role",( ""+UserRole.valueOf(user.getUser_role())).toLowerCase());
	                		   userJson.addProperty("username", user.getUsername());
	                		   userJson.addProperty("user_status", (""+Status.valueOf(user.getUser_status())).toLowerCase());
	                		   
	                		   jsonArray.add(userJson);
	                	   }
	                   }
	               } 
	               else 
	               {
	                   JsonHandler.sendSuccessResponse(response, "No matching users found.");
	                   return;
	               }

	    		 }
	    		 jedis.set(cacheKey, jsonArray.toString()); 
	    		 response.setContentType("application/json");
	    		 JsonHandler.sendJsonResponse(response, jsonArray);
	          
	         
	         } catch (SQLException e) {
				e.printStackTrace();
			}
	    	 
        }
        jedis.close();
    	
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request, response);
    	
        
    	JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);

        try (Connection conn = DbConnection.connect()) 
        {
        	userQueryMap.extractUserDetails(jsonRequest,user);
//        	System.out.println("users.."+ControllerServlet.pathMap);
        	
//        	System.out.println(ControllerServlet.pathMap.get("users"));
        	user.setUser_id(ControllerServlet.pathMap.get("users"));
        	
        	if (userQueryMap.updateUser(conn, user)) 
        	{
        		jedis = ControllerServlet.pool.getResource();
             	Set<String> keys = jedis.keys("*users*");
        		if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    System.out.println("Deleted keys: " + keys);
                }
        		JsonHandler.sendSuccessResponse(response,"User updated successfully");
        	} 
        	else 
        	{
        		JsonHandler.sendErrorResponse(response,"Error updating user");
        	}
        	
 
        } 
        catch (SQLException | ParseException e) 
        {
        	 JsonHandler.sendErrorResponse(response,"Error updating user: " + e.getMessage());

        }
        finally {
        	jedis.close();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request, response);
    	
        try (Connection conn = DbConnection.connect()) 
        {
        	
        	user.setUser_id(ControllerServlet.pathMap.get("users"));

            if (userQueryMap.deleteUser(conn, user.getUser_id())) 
            {
            	jedis = ControllerServlet.pool.getResource();
             	Set<String> keys = jedis.keys("*users*");
        		if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    System.out.println("Deleted keys: " + keys);
                }
            	 JsonHandler.sendSuccessResponse(response,"User deleted successfully");
            } 
            else 
            {
            	 JsonHandler.sendErrorResponse(response,"Error deleting user");
            }
        } 
        catch (SQLException e) 
        {
        	 JsonHandler.sendErrorResponse(response,"Error deleting user: " + e.getMessage());
        }
        finally {
        	jedis.close();
        }
    }
}
