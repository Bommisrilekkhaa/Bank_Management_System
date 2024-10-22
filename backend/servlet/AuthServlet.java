package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
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
import utility.DbConnection;
import utility.JsonHandler;
import utility.LoggerConfig;
import utility.SessionHandler;

public class AuthServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private Logger logger=LoggerConfig.initializeLogger();
    
    private SessionHandler sessionHandler = new SessionHandler();
    private UserDAO userQueryMap = new UserDAO();
    private User user = new User();
    
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        String action = request.getParameter("action");

        if ("logout".equals(action)) {
            logger.info("Logout request received.");
            sessionHandler.logout(request, response);
            logger.info("User logged out successfully.");
        } else {
            logger.warning("Invalid GET request action: " + action);
            JsonHandler.sendErrorResponse(response, "Invalid request");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        String action = request.getParameter("action");

        try (Connection conn = DbConnection.connect()) {
            logger.info("Connection to the database established for action: " + action);

            if ("login".equals(action)) {
                handleLogin(request, response, conn);
            } else if ("register".equals(action)) {
                handleRegister(request, response, conn);
            } else {
                logger.warning("Invalid POST request action: " + action);
                JsonHandler.sendErrorResponse(response, "Invalid request");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error: " + e.getMessage(), e);
            JsonHandler.sendErrorResponse(response, "Error: " + e.getMessage());
        } catch (ParseException e) {
            logger.log(Level.SEVERE, "Parse error during registration: " + e.getMessage(), e);
            JsonHandler.sendErrorResponse(response, "Parse error: " + e.getMessage());
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response, Connection conn) throws IOException, ServletException {
        JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
        user.setUsername(jsonRequest.get("username").getAsString());
        user.setPassword(jsonRequest.get("password").getAsString());

        try {
            Bank bank = new Bank();
            if (request.getParameter("isSuperAdmin") == null) {
                bank.setBank_id(jsonRequest.get("bank_id").getAsInt());
            }

            if (userQueryMap.authenticateUser(conn, user, bank)) {
                logger.info("User authenticated successfully: " + user.getUsername());
                sessionHandler.createSession(conn, user, response, request);
                logger.info("Session created for user: " + user.getUsername());
            } else {
                logger.warning("Authentication failed for user: " + user.getUsername());
                JsonHandler.sendErrorResponse(response, "Invalid credentials");
            }
        } catch (SQLException | IOException e) {
            logger.log(Level.SEVERE, "Error during login process for user: " + user.getUsername(), e);
            JsonHandler.sendErrorResponse(response, "Login error: " + e.getMessage());
        }
    }

    private void handleRegister(HttpServletRequest request, HttpServletResponse response, Connection conn) throws IOException, SQLException, ParseException {
        JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
        userQueryMap.extractUserDetails(jsonRequest, user);

        if (userQueryMap.isUsernameTaken(conn, user)) {
            logger.warning("Username already exists: " + user.getUsername());
            JsonHandler.sendErrorResponse(response, "Username already exists");
            return;
        }

        boolean success = userQueryMap.registerUser(conn, user);

        if (success) {
            logger.info("User registered successfully: " + user.getUsername());
            JsonHandler.sendSuccessResponse(response, "User registered successfully");
        } else {
            logger.warning("Registration failed for user: " + user.getUsername());
            JsonHandler.sendErrorResponse(response, "Registration failed");
        }
    }
}
