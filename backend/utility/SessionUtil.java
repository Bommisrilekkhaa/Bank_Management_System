package utility;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.JsonObject;

import enums.UserRole;
import model.User;

public class SessionUtil {

    private static final int COOKIE_MAX_AGE = 24 * 60 * 60;

    public void createSession(Connection conn, User user, HttpServletResponse response, HttpServletRequest request)
            throws SQLException, IOException {
        HttpSession session = request.getSession(true);
        // session.setMaxInactiveInterval(0);

        // System.out.println("session"+session.getId());
        session.setAttribute("user_id", user.getUser_id());
        session.setAttribute("user_role", "" + UserRole.valueOf(user.getUser_role()));
        JsonObject sessionData = new JsonObject();
        sessionData.addProperty("authToken", session.getId());
        sessionData.addProperty("user_id", user.getUser_id());
        sessionData.addProperty("user_role", "" + UserRole.valueOf(user.getUser_role()));

        String sessionDataStr = URLEncoder.encode(sessionData.toString(), StandardCharsets.UTF_8.toString());

        Cookie sessionCookie = new Cookie("sessionData", sessionDataStr);
        sessionCookie.setHttpOnly(false);
        sessionCookie.setMaxAge(COOKIE_MAX_AGE);
        sessionCookie.setPath("/");
        response.addCookie(sessionCookie);

        // System.out.println(session.getId());

        JsonUtil.sendSuccessResponse(response, "Login successful");

    }

    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);

        if (session != null && session.getId() != null) {
            clearSessionCookie(request, response);
            JsonUtil.sendSuccessResponse(response, "Logout successful");
        } else {
            JsonUtil.sendErrorResponse(response, "No active session found");
        }

    }

    private void clearSessionCookie(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        session.removeAttribute("user_id");
        session.removeAttribute("user_role");
        session.invalidate();
        Cookie cookie = new Cookie("sessionData", null);
        cookie.setHttpOnly(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

    }

    public static String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedPassword = md.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();

            for (byte b : hashedPassword) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

}
