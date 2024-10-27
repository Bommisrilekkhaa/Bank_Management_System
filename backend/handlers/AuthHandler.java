package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import DAO.UserDAO;
import model.Bank;
import model.User;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;
import utility.SessionUtil;

public class AuthHandler  {

    private Logger logger=LoggerConfig.initializeLogger();
    private Jedis jedis = null;
    private SessionUtil sessionHandler = new SessionUtil();
    private UserDAO userDAO = new UserDAO();
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();
    
    
   
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException,SQLException {
       
        String action = request.getParameter("action");

        if ("logout".equals(action)) {
            logger.info("Logout request received.");
            sessionHandler.logout(request, response);
            logger.info("User logged out successfully.");
        } else {
            logger.warning("Invalid GET request action: " + action);
            JsonUtil.sendErrorResponse(response, "Invalid request");
        }
    }

  
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException ,SQLException{
      
        String action = request.getParameter("action");

        try {
        	conn = dbUtil.connect();
            logger.info("Connection to the database established for action: " + action);

            if ("login".equals(action)) {
                handleLogin(request, response, conn);
            } else if ("register".equals(action)) {
                handleRegister(request, response, conn);
            } else {
                logger.warning("Invalid POST request action: " + action);
                JsonUtil.sendErrorResponse(response, "Invalid request");
            }
        } catch (ParseException e) {
            logger.log(Level.SEVERE, "Parse error during registration: " + e.getMessage(), e);
            JsonUtil.sendErrorResponse(response, "Parse error: " + e.getMessage());
        }
        finally {
        	dbUtil.close(conn, null, null);

        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response, Connection conn) throws IOException, ServletException,SQLException {
    
        String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        
        User user = (User) JsonUtil.parseRequest(body,User.class);  
        Bank bank = (Bank) JsonUtil.parseRequest(body,Bank.class); 

        try {
            if (request.getParameter("isSuperAdmin") != null) {
                bank=null;
            }

            if (userDAO.authenticateUser(conn, user, bank)) {
                logger.info("User authenticated successfully: " + user.getUsername());
                sessionHandler.createSession(conn, user, response, request);
                logger.info("Session created for user: " + user.getUsername());
            } else {
                logger.warning("Authentication failed for user: " + user.getUsername());
                JsonUtil.sendErrorResponse(response, "Invalid credentials");
            }
        } catch (SQLException | IOException e) {
            logger.log(Level.SEVERE, "Error during login process for user: " + user.getUsername(), e);
            JsonUtil.sendErrorResponse(response, "Login error: " + e.getMessage());
        }
    }

    private void handleRegister(HttpServletRequest request, HttpServletResponse response, Connection conn) throws IOException, SQLException, ParseException {
    	 
    	String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
          
          User user = new User();
//          SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");  
//          Date strDate = new java.sql.Date(formatter.parse(body.("date_of_birth").getAsString()).getTime());

//          user.setDate_of_birth(strDate);
          user = (User) JsonUtil.parseRequest(body,User.class);  
          try {
        	
        	if (userDAO.isUsernameTaken(conn, user)) {
        		logger.warning("Username already exists: " + user.getUsername());
        		JsonUtil.sendErrorResponse(response, "Username already exists");
        		return;
        	}
        	
        	boolean success = userDAO.registerUser(conn, user);
        	
        	if (success) {
        		jedis = ControllerServlet.pool.getResource();
        		Set<String> keys = jedis.keys("*users*");
        		if (!keys.isEmpty()) {
        			jedis.del(keys.toArray(new String[0]));
        		}
        		logger.info("User registered successfully: " + user.getUsername());
        		JsonUtil.sendSuccessResponse(response, "User registered successfully");
        	} else {
        		logger.warning("Registration failed for user: " + user.getUsername());
        		JsonUtil.sendErrorResponse(response, "Registration failed");
        	}
        }
        finally {
        	
        	if (jedis != null) {
        		jedis.close();
        	}
        }
    }
}
