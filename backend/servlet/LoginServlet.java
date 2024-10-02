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

import DAO.UserQueryMap;
import enums.UserRole;
import model.User;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

public class LoginServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
    private SessionHandler sessionHandler = new SessionHandler();
    private UserQueryMap userQueryMap = new UserQueryMap();
	private User user = new User();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		SessionHandler.doOptions(request,response);
		
		String action = request.getParameter("action");
		
        if ("logout".equals(action)) {
            sessionHandler.logout(request, response);
        } else {
            response.getWriter().append("Auth Servlet at: ").append(request.getContextPath());
        }
		
	
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		SessionHandler.doOptions(request,response);
		
		String action = request.getParameter("action");
		try (Connection conn = DbConnection.connect())
		{ 
//			System.out.println(action);
//			System.out.println(request.getParameter("username"));
			
			
			if (("login").equals(action)) {
				handleLogin(request, response, conn);
			} 
			else if (action.equals("register")) {
				handleRegister(request, response, conn);
			} else {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			}
			
		}
		catch(SQLException e){
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
	}
	
	private void handleLogin(HttpServletRequest request, HttpServletResponse response, Connection conn) throws IOException, ServletException
	{
	    JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
	    user.setUsername(jsonRequest.get("username").getAsString());
	    user.setPassword(jsonRequest.get("password").getAsString());
	    user.setUser_role(UserRole.valueOf(jsonRequest.get("user_role").getAsString().toUpperCase()).getValue());

	    try {
	    	
			if (userQueryMap.authenticateUser(conn, user)) 
			{
			    sessionHandler.createSession(conn, user, response,request);
			} 
			else {
				
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			    JsonHandler.sendErrorResponse(response, "Invalid credentials");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void handleRegister(HttpServletRequest request, HttpServletResponse response, Connection conn) throws IOException, SQLException, ParseException 
	{
	    JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
	    
	    userQueryMap.extractUserDetails(jsonRequest,user);
	    
	    if (userQueryMap.isUsernameTaken(conn, user)) {
	        JsonHandler.sendErrorResponse(response, "Username already exists");
	        return;
	    }
	    
	    
	    boolean success = userQueryMap.registerUser(conn, user);
	    
	    if (success) {
	        JsonHandler.sendSuccessResponse(response, "User registered successfully");
	    } else {
	        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	
	

}
