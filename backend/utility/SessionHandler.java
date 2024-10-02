package utility;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.JsonObject;

import enums.UserRole;
import model.User;

public class SessionHandler {

    private static final int COOKIE_MAX_AGE = 24*60*60;
    
    
    public void createSession(Connection conn, User user,HttpServletResponse response, HttpServletRequest request) throws SQLException, IOException
    {
    	HttpSession session = request.getSession(true);
//    	session.setMaxInactiveInterval(0);
    	
//    	System.out.println("session"+session.getId());
    	session.setAttribute("user_id", user.getUser_id());
    	session.setAttribute("user_role", ""+UserRole.valueOf(user.getUser_role()));
        
    	JsonObject sessionData = new JsonObject();
        sessionData.addProperty("authToken", session.getId());
        sessionData.addProperty("user_id", user.getUser_id());
        sessionData.addProperty("user_role", user.getUser_role());

        // Encoding the JSON string to store in a cookie
        String sessionDataStr = URLEncoder.encode(sessionData.toString(), StandardCharsets.UTF_8.toString());

        // Creating a single cookie with all session data
        Cookie sessionCookie = new Cookie("sessionData", sessionDataStr);
        sessionCookie.setHttpOnly(false); 
        sessionCookie.setMaxAge(COOKIE_MAX_AGE);
        sessionCookie.setPath("/");
        response.addCookie(sessionCookie);


//	    JsonHandler.sendSuccessResponse(response, "Login successful");
	  
    

        System.out.println(session.getId());
//        Cookie sessionCookie = new Cookie("authToken", session.getId());
//        sessionCookie.setHttpOnly(false); 
//	    sessionCookie.setMaxAge(COOKIE_MAX_AGE);
//	    sessionCookie.setPath("/");
	    
	    
//	    sessionCookie.setDomain("localhost");

//	    response.addCookie(sessionCookie);
//	    response.addHeader("Set-Cookie", sessionCookie.getName() + "=" + sessionCookie.getValue() + "; Path=" + sessionCookie.getPath() + 
//                "; HttpOnly=" + sessionCookie.isHttpOnly() + "; SameSite=Lax");

	    JsonHandler.sendSuccessResponse(response, "Login successful");
	  
    }


    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);  
        
        if (session != null && session.getId() != null) {  
            clearSessionCookie(request, response);
            JsonHandler.sendSuccessResponse(response, "Logout successful");
        } else {
            JsonHandler.sendErrorResponse(response, "No active session found");
        }
    

    }


    private void clearSessionCookie(HttpServletRequest request,HttpServletResponse response) 
    {
    	HttpSession session = request.getSession(false);
    	session.removeAttribute("username");
    	session.removeAttribute("userRole");
    	session.invalidate();        
//    	Cookie cookie = new Cookie("authToken", null);
//        cookie.setHttpOnly(false);
//        cookie.setPath("/");
//        cookie.setMaxAge(0); 
//        response.addCookie(cookie);
//        Cookie jsessionCookie = new Cookie("JSESSIONID", null);
//        jsessionCookie.setMaxAge(0);
//        jsessionCookie.setPath("/");
//        response.addCookie(jsessionCookie);

    }
    
   
        public static String hashPassword(String password) 
        {
            try 
            {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hashedPassword = md.digest(password.getBytes());
                StringBuilder hexString = new StringBuilder();
                
                for (byte b : hashedPassword) 
                {
                    String hex = Integer.toHexString(0xff & b);
                    if (hex.length() == 1) hexString.append('0');
                    hexString.append(hex);
                }
                return hexString.toString();
            } 
            catch (NoSuchAlgorithmException e) {
                throw new RuntimeException(e);
            }
        }

        

       
    
        public static void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With,XSet-Cookie"); // Allow Content-Type
            response.setHeader("Access-Control-Allow-Credentials", "true");

            response.setStatus(HttpServletResponse.SC_OK);
            System.out.println("CORS preflight response sent.");
        }
}
