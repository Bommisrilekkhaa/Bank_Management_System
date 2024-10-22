package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

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
import utility.LoggerConfig;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class UsersServlet extends HttpServlet {
    private Logger logger = LoggerConfig.initializeLogger();
    private UserDAO userQueryMap = new UserDAO();
    private User user = new User();
    private Jedis jedis = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        String adminParam = request.getParameter("filter_admin");
        String managerParam = request.getParameter("filter_manager");

        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/users"));

        if (managerParam != null) {
            cacheKey = path.substring(path.indexOf("/banks")) + "_filter_manager";
        } else if (adminParam != null) {
            cacheKey += "_filter_admin";
        }

        jedis = ControllerServlet.pool.getResource();
        String cachedData = jedis.get(cacheKey);

        if (cachedData != null) {
            logger.info("Cache hit for key: " + cacheKey);
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
        } else {
            logger.info("Cache miss for key: " + cacheKey);
            try (Connection conn = DbConnection.connect()) {
                JsonArray jsonArray = new JsonArray();
                if (managerParam != null) {
                    logger.info("Fetching unassigned managers from the database.");
                    ResultSet rs = userQueryMap.getUnassignedManagers(conn);

                    while (rs.next()) {
                        JsonObject jsonResponse = new JsonObject();
                        jsonResponse.addProperty("manager_id", rs.getInt("user_id"));
                        jsonResponse.addProperty("manager_name", rs.getString("full_name"));
                        jsonArray.add(jsonResponse);
                    }
                } else if (adminParam != null) {
                    logger.info("Fetching unassigned admins from the database.");
                    ResultSet rs = userQueryMap.getUnassignedAdmins(conn);

                    while (rs.next()) {
                        JsonObject jsonResponse = new JsonObject();
                        jsonResponse.addProperty("admin_id", rs.getInt("user_id"));
                        jsonResponse.addProperty("admin_name", rs.getString("full_name"));
                        jsonArray.add(jsonResponse);
                    }
                } else {
                    logger.info("Fetching all users from the database.");
                    ResultSet rs = userQueryMap.selectAllUsers(conn);
                    List<User> users = userQueryMap.convertResultSetToList(rs);

                    if (!users.isEmpty()) {
                        for (User user : users) {
                            if (user.getUser_role() != UserRole.SUPERADMIN.getValue()) {
                                JsonObject userJson = new JsonObject();
                                userJson.addProperty("user_id", user.getUser_id());
                                userJson.addProperty("fullname", user.getFullname());
                                userJson.addProperty("date_of_birth", user.getDate_of_birth().toString());
                                userJson.addProperty("user_phonenumber", user.getUser_phonenumber());
                                userJson.addProperty("user_address", user.getUser_address());
                                userJson.addProperty("user_role", ("" + UserRole.valueOf(user.getUser_role())).toLowerCase());
                                userJson.addProperty("username", user.getUsername());
                                userJson.addProperty("user_status", ("" + Status.valueOf(user.getUser_status())).toLowerCase());
                                jsonArray.add(userJson);
                            }
                        }
                    } else {
                        logger.info("No matching users found.");
                        JsonHandler.sendSuccessResponse(response, "No matching users found.");
                        return;
                    }
                }
                jedis.set(cacheKey, jsonArray.toString());
                response.setContentType("application/json");
                JsonHandler.sendJsonResponse(response, jsonArray);
                logger.info("Data fetched from the database and cached with key: " + cacheKey);
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching users data", e);
                JsonHandler.sendErrorResponse(response, "Error fetching users data: " + e.getMessage());
            }
        }
        jedis.close();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Implement POST logic with logging if needed
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);

        try (Connection conn = DbConnection.connect()) {
            userQueryMap.extractUserDetails(jsonRequest, user);
            user.setUser_id(ControllerServlet.pathMap.get("users"));

            if (userQueryMap.updateUser(conn, user)) {
                jedis = ControllerServlet.pool.getResource();
                Set<String> keys = jedis.keys("*users*");
                if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    logger.info("Deleted cache keys after user update: " + keys);
                }
                JsonHandler.sendSuccessResponse(response, "User updated successfully");
                logger.info("User updated successfully: " + user.getUser_id());
            } else {
                JsonHandler.sendErrorResponse(response, "Error updating user");
                logger.warning("Failed to update user: " + user.getUser_id());
            }
        } catch (SQLException | ParseException e) {
            logger.log(Level.SEVERE, "Error updating user", e);
            JsonHandler.sendErrorResponse(response, "Error updating user: " + e.getMessage());
        } finally {
            if (jedis != null) jedis.close();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);

        try (Connection conn = DbConnection.connect()) {
            user.setUser_id(ControllerServlet.pathMap.get("users"));

            if (userQueryMap.deleteUser(conn, user.getUser_id())) {
                jedis = ControllerServlet.pool.getResource();
                Set<String> keys = jedis.keys("*users*");
                if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    logger.info("Deleted cache keys after user deletion: " + keys);
                }
                JsonHandler.sendSuccessResponse(response, "User deleted successfully");
                logger.info("User deleted successfully: " + user.getUser_id());
            } else {
                JsonHandler.sendErrorResponse(response, "Error deleting user");
                logger.warning("Failed to delete user: " + user.getUser_id());
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error deleting user", e);
            JsonHandler.sendErrorResponse(response, "Error deleting user: " + e.getMessage());
        } finally {
            if (jedis != null) jedis.close();
        }
    }
}
