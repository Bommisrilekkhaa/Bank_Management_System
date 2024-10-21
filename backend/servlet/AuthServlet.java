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
import model.Bank;
import model.User;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

public class AuthServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
    private SessionHandler sessionHandler = new SessionHandler();
    private UserDAO userQueryMap = new UserDAO();
	private User user = new User();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		SessionHandler.doOptions(request,response);
		
		String action = request.getParameter("action");
		
        if ("logout".equals(action)) {
            sessionHandler.logout(request, response);
        } else {
        	 JsonHandler.sendErrorResponse(response, "Invalid request");
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
				 JsonHandler.sendErrorResponse(response, "Invalid request");
			}
			
		}
		catch(SQLException e){
			JsonHandler.sendErrorResponse(response, "Error : " + e.getMessage());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
	}
	
	private void handleLogin(HttpServletRequest request, HttpServletResponse response, Connection conn) throws IOException, ServletException
	{
		
	    JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
	    user.setUsername(jsonRequest.get("username").getAsString());
	    user.setPassword(jsonRequest.get("password").getAsString());

	    try {
	    	Bank bank = new Bank();
	    	if( request.getParameter("isSuperAdmin")==null)
	    	{
	    		
	    		bank.setBank_id(jsonRequest.get("bank_id").getAsInt());
	    	}
	    	
			if (userQueryMap.authenticateUser(conn, user,bank)) 
			{
			    sessionHandler.createSession(conn, user, response,request);
			} 
			else {
				
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
	    	 JsonHandler.sendErrorResponse(response, "Registration failed");
	    }
	}
		

}
