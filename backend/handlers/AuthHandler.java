package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;

import DAO.UserDAO;
import model.Bank;
import model.User;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;
import utility.SessionUtil;

public class AuthHandler extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private Logger logger=LoggerConfig.initializeLogger();
    private Jedis jedis = null;
    private SessionUtil sessionHandler = new SessionUtil();
    private UserDAO userDAO = new UserDAO();
    private User user = new User();
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();
    
    
   
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionUtil.doOptions(request, response);
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

  
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionUtil.doOptions(request, response);
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
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error: " + e.getMessage(), e);
            JsonUtil.sendErrorResponse(response, "Error: " + e.getMessage());
        } catch (ParseException e) {
            logger.log(Level.SEVERE, "Parse error during registration: " + e.getMessage(), e);
            JsonUtil.sendErrorResponse(response, "Parse error: " + e.getMessage());
        }
        finally {
        	dbUtil.close(conn, null, null);

        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response, Connection conn) throws IOException, ServletException {
        JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);
        user.setUsername(jsonRequest.get("username").getAsString());
        user.setPassword(jsonRequest.get("password").getAsString());

        try {
            Bank bank = new Bank();
            if (request.getParameter("isSuperAdmin") == null) {
                bank.setBank_id(jsonRequest.get("bank_id").getAsInt());
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
        JsonObject jsonRequest = JsonUtil.parseJsonRequest(request);
        userDAO.extractUserDetails(jsonRequest, user);

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
        if (jedis != null) {
            jedis.close();
        }
    }
}
