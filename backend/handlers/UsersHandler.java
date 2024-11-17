package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
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
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;

public class UsersHandler {
    private Logger logger = LoggerConfig.initializeLogger();
    private UserDAO userDAO = new UserDAO();
    private User user = new User();
    private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();
    public static int offset = -1;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {

        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/users"));
        Map<String, String[]> queryParamMap = request.getParameterMap();
        String searchParam = null;
        cacheKey = JsonUtil.keyGenerate(cacheKey, queryParamMap);

        if (queryParamMap.containsKey("filter_role")) {
            ControllerServlet.pathMap.put("user_role",
                    Integer.valueOf(UserRole.valueOf(queryParamMap.get("filter_role")[0].toUpperCase()).getValue()));

        }
        if (queryParamMap.containsKey("filter_status")) {
            ControllerServlet.pathMap.put("user_status",
                    Integer.valueOf(Status.valueOf(queryParamMap.get("filter_status")[0].toUpperCase()).getValue()));

        }
        if (queryParamMap.containsKey("search_item")) {
            searchParam = queryParamMap.get("search_item")[0];

        }
        if (queryParamMap.containsKey("page")) {
            offset = (Integer.valueOf(queryParamMap.get("page")[0]) - 1) * UserDAO.itemsPerPage;

        }

        jedis = ControllerServlet.pool.getResource();
        String cachedData = jedis.get(cacheKey);

        if (cachedData != null) {
            logger.info("Cache hit for key: " + cacheKey);
            if (queryParamMap.containsKey("filter_manager") || queryParamMap.containsKey("filter_admin")) {
                JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
                JsonUtil.sendJsonResponse(response, jsonArray);
            } else {
                JsonObject jsonObject = JsonParser.parseString(cachedData).getAsJsonObject();
                JsonUtil.sendJsonResponse(response, jsonObject);
            }
        } else {
            logger.info("Cache miss for key: " + cacheKey);
            ResultSet rs = null;
            try {
                conn = dbUtil.connect();

                JsonArray jsonArray = new JsonArray();

                if (queryParamMap.containsKey("filter_manager")) {
                    logger.info("Fetching unassigned managers from the database.");
                    rs = userDAO.getUnassignedManagers(conn);
                    List<User> users = JsonUtil.convertResultSetToList(rs, User.class);

                    if (!users.isEmpty()) {
                        for (User user : users) {
                            JsonObject jsonResponse = new JsonObject();
                            jsonResponse.addProperty("manager_id", user.getUser_id());
                            jsonResponse.addProperty("manager_name", user.getFullname());
                            jsonArray.add(jsonResponse);
                        }
                    }

                    JsonUtil.sendJsonResponse(response, jsonArray);
                    jedis.set(cacheKey, jsonArray.toString());

                } else if (queryParamMap.containsKey("filter_admin")) {
                    logger.info("Fetching unassigned admins from the database.");
                    rs = userDAO.getUnassignedAdmins(conn);
                    List<User> users = JsonUtil.convertResultSetToList(rs, User.class);

                    if (!users.isEmpty()) {
                        for (User user : users) {
                            JsonObject jsonResponse = new JsonObject();
                            jsonResponse.addProperty("admin_id", user.getUser_id());
                            jsonResponse.addProperty("admin_name", user.getFullname());
                            jsonArray.add(jsonResponse);
                        }
                    }

                    JsonUtil.sendJsonResponse(response, jsonArray);
                    jedis.set(cacheKey, jsonArray.toString());
                } else {
                    int totalUsers = userDAO.totalUsers(conn, ControllerServlet.pathMap, searchParam);
                    logger.info("Fetching all users from the database.");

                    if (!ControllerServlet.pathMap.containsKey("users")) {
                        rs = userDAO.selectPageWise(conn, ControllerServlet.pathMap, searchParam);
                    } else {

                        rs = userDAO.selectAllUsers(conn, ControllerServlet.pathMap);
                    }
                    List<User> users = JsonUtil.convertResultSetToList(rs, User.class);
                    JsonObject objectJson = new JsonObject();
                    objectJson.addProperty("totalUsers", totalUsers);

                    if (!users.isEmpty()) {
                        for (User user : users) {
                            if (user.getUser_role() != UserRole.SUPERADMIN.getValue()) {
                                JsonObject userJson = new JsonObject();
                                userJson.addProperty("user_id", user.getUser_id());
                                userJson.addProperty("fullname", user.getFullname());
                                userJson.addProperty("date_of_birth", user.getDate_of_birth().toString());
                                userJson.addProperty("user_phonenumber", user.getUser_phonenumber());
                                userJson.addProperty("user_address", user.getUser_address());
                                userJson.addProperty("user_role",("" + UserRole.valueOf(user.getUser_role())).toLowerCase());
                                userJson.addProperty("username", user.getUsername());
                                userJson.addProperty("user_status",("" + Status.valueOf(user.getUser_status())).toLowerCase());
                                jsonArray.add(userJson);
                            }
                        }
                    } else {
                        logger.warning("No matching users found.");
                        JsonUtil.sendErrorResponse(response, "No matching users found.");
                        return;
                    }
                    objectJson.add("data", jsonArray);
                    JsonUtil.sendJsonResponse(response, objectJson);
                    jedis.set(cacheKey, objectJson.toString());
                }
                logger.info("Data fetched from the database and cached with key: " + cacheKey);

            } finally {
                dbUtil.close(conn, null, rs);
            }
        }
        if (jedis != null) {
            jedis.close();
        }
    }

    public void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ParseException, SQLException {

        try {
            conn = dbUtil.connect();
            String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

            User user = (User) JsonUtil.parseRequest(body, User.class);

            user.setUser_id(ControllerServlet.pathMap.get("users"));

            if (userDAO.updateUser(conn, user)) {
                jedis = ControllerServlet.pool.getResource();
                Set<String> keys = jedis.keys("*users*");
                if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    logger.info("Deleted cache keys after user update: " + keys);
                }
                JsonUtil.sendSuccessResponse(response, "User updated successfully");
                logger.info("User updated successfully: " + user.getUser_id());
            } else {
                JsonUtil.sendErrorResponse(response, "Error updating user");
                logger.warning("Failed to update user: " + user.getUser_id());
            }
        } finally {
            if (jedis != null)
                jedis.close();
            dbUtil.close(conn, null, null);
        }
    }

    public void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {

        try {
            conn = dbUtil.connect();
            user.setUser_id(ControllerServlet.pathMap.get("users"));

            if (userDAO.deleteUser(conn, user.getUser_id())) {
                jedis = ControllerServlet.pool.getResource();
                Set<String> keys = jedis.keys("*users*");
                if (!keys.isEmpty()) {
                    jedis.del(keys.toArray(new String[0]));
                    logger.info("Deleted cache keys after user deletion: " + keys);
                }
                JsonUtil.sendSuccessResponse(response, "User deleted successfully");
                logger.info("User deleted successfully: " + user.getUser_id());
            } else {
                JsonUtil.sendErrorResponse(response, "Error deleting user");
                logger.warning("Failed to delete user: " + user.getUser_id());
            }
        } finally {
            if (jedis != null)
                jedis.close();
            dbUtil.close(conn, null, null);
        }
    }
}
