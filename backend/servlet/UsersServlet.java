package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;

import DAO.UserDAO;
import enums.Status;
import model.User;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class UsersServlet extends HttpServlet 
{
    private UserDAO userQueryMap = new UserDAO();
    private User user = new User();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
//    	SessionHandler.doOptions(request, response);
//
//        try (Connection conn = DbConnection.connect()) 
//        {
//         
//            ResultSet rs = userQueryMap.selectAllUsers(conn);
//            
//            List<User> users = userQueryMap.convertResultSetToList(rs);
//           
//          
//            List<User> filteredUsers = userQueryMap.applyFilters(users, ControllerServlet.pathMap.get("users"));
//
//            JsonArray jsonArray = new JsonArray();
//            if (!filteredUsers.isEmpty()) 
//            {
//                for (User user : filteredUsers) 
//                {
//                    JsonObject userJson = new JsonObject();
//                    userJson.addProperty("user_id", user.getUser_id());
//                    userJson.addProperty("fullname", user.getFullname());
//                    userJson.addProperty("date_of_birth", user.getDate_of_birth().toString());
//                    userJson.addProperty("user_phonenumber", user.getUser_phonenumber());
//                    userJson.addProperty("user_address", user.getUser_address());
//                    userJson.addProperty("user_role", user.getUser_role());
//                    userJson.addProperty("username", user.getUsername());
//                    userJson.addProperty("user_status", user.getUser_status());
//                    
//                    jsonArray.add(userJson);
//                }
//            } 
//            else 
//            {
//                JsonHandler.sendSuccessResponse(response, "No matching users found.");
//                return;
//            }
//
//            response.setContentType("application/json");
//            JsonHandler.sendJsonResponse(response, jsonArray);
//        } 
//        catch (SQLException e) 
//        {
//            response.getWriter().write("Error fetching user details: " + e.getMessage());
//        }
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
        	user.setUser_id(ControllerServlet.pathMap.get("users"));

            user.setUser_status(Status.valueOf(jsonRequest.get("user_status").getAsString().toUpperCase()).getValue());
           
            if (userQueryMap.updateUser(conn, user)) 
            {
                response.getWriter().write("User updated successfully");
            } 
            else 
            {
                response.getWriter().write("Error updating user");
            }
        } 
        catch (SQLException | ParseException e) 
        {
            response.getWriter().write("Error updating user: " + e.getMessage());
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
                response.getWriter().write("User deleted successfully");
            } 
            else 
            {
                response.getWriter().write("Error deleting user");
            }
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error deleting user: " + e.getMessage());
        }
    }
}
