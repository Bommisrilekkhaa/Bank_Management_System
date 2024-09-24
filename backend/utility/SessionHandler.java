package utility;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import model.User;

public class SessionHandler {

    private static final int COOKIE_MAX_AGE = 24*60*60;
    
    
    public void createSession(Connection conn, User user,HttpServletResponse response, HttpServletRequest request) throws SQLException, IOException 
    {
    	HttpSession session = request.getSession(true);
    	session.setMaxInactiveInterval(0);
    	
//    	System.out.println("session"+session.getId());
    	
        
        Cookie sessionCookie = new Cookie("authToken", session.getId());
        sessionCookie.setHttpOnly(false); 
	    sessionCookie.setMaxAge(COOKIE_MAX_AGE);
	    sessionCookie.setPath("/");
	    response.addCookie(sessionCookie);
	    response.setHeader("Set-Cookie", "JSESSIONID="+session.getId());
	    JsonHandler.sendSuccessResponse(response, "Login successful");
	
       
    }



    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException 
    {

//    	System.out.print("sesss"+request.getSession(false));
    	
    	
        if (request.getSession(false).getId() != null) 
        {
            clearSessionCookie(request,response);
            JsonHandler.sendSuccessResponse(response, "Logout successful");
            
        } 
        else 
        {
        	JsonHandler.sendErrorResponse(response, "No active session found");
        }
    }


    private void clearSessionCookie(HttpServletRequest request,HttpServletResponse response) 
    {
    	request.getSession(false).invalidate();        
    	Cookie cookie = new Cookie("authToken", null);
        cookie.setHttpOnly(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); 
        response.addCookie(cookie);
    }
}
