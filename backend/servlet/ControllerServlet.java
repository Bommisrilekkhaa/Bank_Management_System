package servlet;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import enums.UserRole;
import redis.clients.jedis.JedisPool;
import utility.JsonHandler;
import utility.LoggerConfig;
import utility.SessionHandler;

public class ControllerServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Logger logger= LoggerConfig.initializeLogger();
    public static List<String> resources = Arrays.asList("banks", "branches", "accounts", "transactions", "loans", "emis", "users", "dashboard");
    public static HashMap<String, Integer> pathMap;
    public static JedisPool pool = null;

   
   

    public static void initializeCache(Logger logger) {
        pool = new JedisPool("localhost", 6379);
        logger.info("Redis cache initialized.");
    }

    @Override
    public void destroy() {
        if (pool != null) {
            pool.close();
            logger.info("Redis pool closed.");
        }
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        initializeCache(logger);
        pathMap = new LinkedHashMap<>();
        SessionHandler.doOptions(request, response);
        String[] path = request.getRequestURI().split("/");
        System.out.println(request.getRequestURI());
        String method = request.getMethod();
        String reqServlet = "";
        logger.info("Request URI: " + request.getRequestURI());
        logger.info("HTTP Method: " + method);

        try {
            if (path.length >= 4) {
                if (!(path[path.length - 1].contains("auth") || path[path.length - 1].equals("banks"))) {
                    try {
                        String role = (String) request.getSession(false).getAttribute("user_role");
                        logger.info("User role: " + role);

                        if (roleValidation(role, method, path)) {
                            try {
                                reqServlet = pathValidation(path);
                                logger.info("Validated servlet path: " + reqServlet);
                            } catch (IllegalAccessException e) {
                                logger.log(Level.SEVERE, "Path validation failed.", e);
                            }
                        } else {
                            logger.warning("Role validation failed.");
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            return;
                        }
                    } catch (NullPointerException e) {
                        logger.log(Level.WARNING, "No session found: User not logged in.", e);
                        JsonHandler.sendErrorResponse(response, "No Cookies Found! Login to Proceed");
                    }
                } else {
                    reqServlet = path[4];
                }
            } else {
                throw new IllegalAccessException("Invalid URL");
            }
        } catch (IllegalAccessException e) {
            logger.log(Level.SEVERE, "Invalid URL format.", e);
        }

        reflection(reqServlet, method, request, response);
        pathMap = new LinkedHashMap<>();
    }

    private boolean roleValidation(String role, String method, String[] path) 
    {
        if (role.equals(UserRole.CUSTOMER.toString())) 
        { 
            if (!path[path.length - 1].equals("banks") || !path[path.length - 2].equals("branches") || !path[path.length - 1].equals("users") ||  !path[path.length - 2].equals("users")) 
            {
                return method.equals("GET") || method.equals("POST");
            } 
            else 
            {
                return false;
            }
        }
        else if (role.equals(UserRole.MANAGER.toString())) 
        { 
            if ( !path[path.length - 1].equals("banks") || !path[path.length - 1].equals("branches") || !path[path.length - 1].equals("users") ||  !path[path.length - 2].equals("users")) 
            {
                if(path[path.length - 2].equals("branches") )
                {
                	return  method.equals("GET") || method.equals("DELETE");
                }
                return true;
            } 
            else 
            {
                return false;
            }
        }
        else if (role.equals(UserRole.ADMIN.toString())) 
        { 
            if ( !path[path.length - 1].equals("users") ||  !path[path.length - 2].equals("users")) 
            {
                return true;
            } 
            else 
            {
                return false;
            }
        }
        else if (role.equals(UserRole.SUPERADMIN.toString())) 
        { 
            if ( path[path.length - 1].equals("users") ||  path[path.length - 2].equals("users") || path[path.length - 1].equals("banks") ||  path[path.length - 2].equals("banks") ||  path[path.length - 2].equals("branches") ) 
            {
            	if(path[path.length - 2].equals("banks"))
            	{
            		return !method.equals("PUT");
            	}
            	else if( path[path.length - 2].equals("branches") )
            	{
            		return method.equals("GET");
            	}
                return true;
            } 
            else 
            {
                return false;
            }
        }
        return true;
    }

    private String pathValidation(String[] path) throws IllegalAccessException {
        int n = path.length;
        String reqServlet = "";
        
        for (int i = 4; i < n - 1; i += 2) 
        {
            if (!path[i + 1].equals("*")) 
            {
                pathMap.put(path[i], Integer.valueOf(path[i + 1]));
            }
        }
        if (n % 2 != 0) 
        {
            reqServlet = path[n - 1];
        }

        int index = -1;
        
        for (String key : pathMap.keySet()) 
        {
            int resIndex = resources.indexOf(key);
            
            if (index < resIndex) 
            {
                index = resIndex;
            } 
            else 
            {
                throw new IllegalAccessException("Invalid URL: Resource out of order.");
            }
        }

        if (!reqServlet.isEmpty()) 
        {
            if (index < resources.indexOf(reqServlet)) 
            {
                return reqServlet;
            } 
            else 
            {
                throw new IllegalAccessException("Invalid URL: Request servlet out of order.");
            }
        }
        return path[n - 2];
    }

    private String buildClassName(String path) {
        String firstLetter = path.substring(0, 1);
        return firstLetter.toUpperCase() + path.substring(1);
    }

    private void reflection(String reqServlet, String method, HttpServletRequest request, HttpServletResponse response) {
        try {
            Class<?> servlets = Class.forName("servlet." + buildClassName(reqServlet));
            HttpServlet servlet = (HttpServlet) servlets.getDeclaredConstructor().newInstance();

            switch (method) {
                case "GET":
                    method = "doGet";
                    break;
                case "POST":
                    method = "doPost";
                    break;
                case "PUT":
                    method = "doPut";
                    break;
                case "DELETE":
                    method = "doDelete";
                    break;
            }

            logger.info("Invoking method: " + method + " on servlet: " + reqServlet);
            servlets.getDeclaredMethod(method, HttpServletRequest.class, HttpServletResponse.class)
                    .invoke(servlet, request, response);

        } catch (ClassNotFoundException | NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException | InstantiationException e) {
            logger.log(Level.SEVERE, "Error during reflection for servlet invocation.", e);
        }
    }
}
