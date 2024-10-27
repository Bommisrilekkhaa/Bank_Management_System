package servlets;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
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
import Exception.CustomExceptions.CustomIllegalAccessException;
import Exception.CustomExceptions.CustomSQLException;
import enums.Resources;
import enums.UserRole;
import redis.clients.jedis.JedisPool;
import utility.JsonUtil;
import utility.LoggerConfig;

public class ControllerServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Logger logger= LoggerConfig.initializeLogger();
    public static List<String> resources = Arrays.asList(Resources.BANKS.toString().toLowerCase(),Resources.BRANCHES.toString().toLowerCase(),Resources.ACCOUNTS.toString().toLowerCase(),Resources.TRANSACTIONS.toString().toLowerCase(),Resources.LOANS.toString().toLowerCase(),Resources.EMIS.toString().toLowerCase(),Resources.USERS.toString().toLowerCase(),Resources.DASHBOARD.toString().toLowerCase());
    public static HashMap<String, Integer> pathMap;
    public static JedisPool pool = null;
   
    
    public static void initializeCache(Logger logger) {
        pool = new JedisPool("localhost", 6379);
        logger.info("Redis cache initialized.");
    }

    public void destroying() {
    	if (pool != null) 
    	{
	      pool.close();
	        logger.info("Pool is Closed");
	       
        }
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        initializeCache(logger);
        pathMap = new LinkedHashMap<>();
        
        String[] path = request.getRequestURI().split("/");
        System.out.println(request.getRequestURI());
        String method = request.getMethod();
        String reqServlet = "";
        logger.info("Request URI: " + request.getRequestURI());
        logger.info("HTTP Method: " + method);
        try {

	            if (path.length >= 4) {
	                if (!(path[path.length - 1].contains("auth") || path[path.length - 1].equals("banks"))) {

	                        String role = (String) request.getSession(false).getAttribute("user_role");
	                        logger.info("User role: " + role);
	
	                        if (roleValidation(role, method, path)) {

	                                reqServlet = pathValidation(path);
	                                logger.info("Validated servlet path: " + reqServlet);
	                        } else {
	                            throw new IllegalAccessException("Illegal Access for "+role+"!");
	                            
	                        }
	                        
	                } else {
	                    reqServlet = path[4];
	                }
	            } else {
	                throw new IllegalAccessException("Invalid request URL!");
	            }
	            
	        reflection(reqServlet, method, request, response);
	        pathMap = new LinkedHashMap<>();
        }
        catch(SQLException e)
        {
        	try {
        		logger.log(Level.SEVERE, "Error fetching "+reqServlet+" details: " + e.getMessage(), e);
                throw new CustomSQLException("Error fetching "+reqServlet+" details", e);
        	}
        	catch(CustomSQLException ex)
        	{
        		JsonUtil.sendErrorResponse(response,ex.getMessage());
        		
        	}
        }
        catch (NullPointerException e) {
            logger.log(Level.WARNING, "No session found: User not logged in.", e);
            JsonUtil.sendErrorResponse(response, "No Cookies Found! Login to Proceed");
        }
        catch(IllegalAccessException e)
        {
        	try {
        		logger.log(Level.SEVERE, "Illegal Access: " + e.getMessage(), e);
                throw new CustomIllegalAccessException(e.getMessage());
        	}
        	catch(CustomIllegalAccessException ex)
        	{
        		JsonUtil.sendErrorResponse(response,ex.getMessage());
        		
        	}
        } 
        catch (ClassNotFoundException | InstantiationException | IllegalArgumentException | 
        	       InvocationTargetException | NoSuchMethodException | SecurityException e) {
        	 logger.log(Level.WARNING, "Error during reflection: ", e);
             JsonUtil.sendErrorResponse(response, "Error during reflection: "+e);
        
        	   
        }
        finally {
        	destroying();
        }
        
    }

    private boolean roleValidation(String role, String method, String[] path) 
    {
    	switch(UserRole.valueOf(role)){
    	
    	case CUSTOMER:
    		return customerRouteAccess(path,method);
    		
    	case MANAGER:
    		return managerRouteAccess(path,method);
    		
    	case ADMIN:
    		return adminRouteAccess(path,method);
    		
    	case SUPERADMIN:
    		return superadminRouteAccess(path,method);
    		
    	default:
    		return false;
    		
    	
    	}
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

    private String buildClassName(String path) 
    {
        String firstLetter = path.substring(0, 1);
        return firstLetter.toUpperCase() + path.substring(1);
    }

    private void reflection(String reqServlet, String method, HttpServletRequest request, HttpServletResponse response)  throws SQLException, ClassNotFoundException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException
    {
        
            Class<?> servlets = Class.forName("handlers." + buildClassName(reqServlet)+"Handler");
            Object servlet =  servlets.getDeclaredConstructor().newInstance();
            
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

        
      
    }
    
    private boolean customerRouteAccess(String[] path,String method)
    {
    	if (!path[path.length - 1].equals("banks") && 
    			!path[path.length - 1].equals("users") &&  !path[path.length - 2].equals("users")) 
        {
    		if(path[path.length - 1].equals("branches") || path[path.length - 2].equals("banks") ||path[path.length - 2].equals("branches"))
    		{
    			return method.equals("GET");
    		}
            return method.equals("GET") || method.equals("POST");
        } 
        return false;
        
    }
    
    private boolean managerRouteAccess(String[] path,String method)
    {
    	 if ( !path[path.length - 1].equals("banks") && !path[path.length - 1].equals("branches") && 
    			 !path[path.length - 1].equals("users") &&  !path[path.length - 2].equals("users")) 
         {
             if(path[path.length - 2].equals("branches"))
             {
             	return  method.equals("GET") || method.equals("DELETE");
             }
             else if(path[path.length - 2].equals("banks"))
             {
            	 return  method.equals("GET");
             }
             return true;
         } 
         return false;
         
    }
    
    private boolean adminRouteAccess(String[] path,String method)
    {
    	 if ( !path[path.length - 1].equals("banks") && 
    			 !path[path.length - 2].equals("users")) 
         {
             return true;
         } 
         return false;
         
    }
        
    private boolean superadminRouteAccess(String[] path,String method)
    {
    	 if ( path[path.length - 1].equals("users") ||  path[path.length - 2].equals("users") || path[path.length - 1].equals("banks") ||  path[path.length - 2].equals("banks") ||  path[path.length - 2].equals("branches") ) 
         {
         	if(path[path.length - 2].equals("banks"))
         	{
         		return !method.equals("PUT");
         	}
             return true;
         } 
         return false;
         
         
    }  
}
