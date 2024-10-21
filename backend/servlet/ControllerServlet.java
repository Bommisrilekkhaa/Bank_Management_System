package servlet;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import enums.UserRole;
import redis.clients.jedis.JedisPool;
import utility.JsonHandler;
import utility.SessionHandler;

public class ControllerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static List<String> resources = Arrays.asList("banks","branches","accounts","transactions","loans","emis","users","dashboard");
	public static HashMap<String,Integer> pathMap ;
	public static JedisPool pool = null;
	    
	 
	    public static void initializeCache() {
	        pool = new JedisPool("localhost", 6379);
	        System.out.println("redis....");
	    }
	    @Override
	    public void destroy() {
	    	
	        if (pool != null) {
	            pool.close();
	        }
	    }
    public ControllerServlet() {
        super();
    }

	public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		
		initializeCache();
		
		pathMap = new LinkedHashMap<>();
		SessionHandler.doOptions(request,response);
		String[] path = request.getRequestURI().split("/");
		String method = request.getMethod();
		String reqServlet ="";
		System.out.println(request.getRequestURI());
		try {
			
			if(path.length >= 4)
			{
				
				if(!(path[path.length-1].contains("auth")  || path[path.length-1].equals("banks")))
				{
					try {
						
						String role = (String) request.getSession(false).getAttribute("user_role");
						if(roleValidation(role,method,path))
						{
							
							try 
							{
								reqServlet= pathValidation(path);
								
								
							}
							catch(IllegalAccessException e)
							{
								e.printStackTrace();
							}
						}
						else
						{
							
							response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
							return;
						}
					}
					catch(NullPointerException e)
					{
						JsonHandler.sendErrorResponse(response, "No Cookies Found! Login to Proceed");
					}
//			System.out.println(role+"session");
					
					
					
				}
				else
				{
					reqServlet= path[4];
				}
			}
			else
			{
				throw new IllegalAccessException("Invalid url");
			}
			
		}
		catch( IllegalAccessException e)
		{
			e.printStackTrace();
		}
		reflection(reqServlet,method,request,response);
		pathMap = new LinkedHashMap<>();
	
		
	}
	
	private boolean roleValidation(String role,String method,String[] path)
	{
		if(role == UserRole.CUSTOMER.toString())
		{
			if((path[4] != "banks" && path[6] != "branches") || path[path.length-1]!="banks" || path[path.length-2]!="banks" )
			{
				if(method == "GET" || method == "POST")
				{
					
					return true;
				}
				else
					return false;
			}
			else
				return false;
		}
		
		
		return true;
	}
	
	private String pathValidation(String[] path) throws IllegalAccessException
	{
		int n=path.length;
		String reqServlet="" ;
		for(int i=4;i<n-1;i+=2)
		{
			System.out.println(path[i]);
			if(path[i+1]!="*")
			{
				
				pathMap.put(path[i],Integer.valueOf(path[i+1]));
			}
		}
		if(n%2!=0)
		{
			reqServlet = path[n-1];
		}
		int index=-1;
		for(String key:pathMap.keySet())
		{
			int resIndex =resources.indexOf(key);
			System.out.println(key);
			if(index < resIndex)
				index=resIndex;
			else
			{
				System.out.println(key);
				throw new IllegalAccessException("Invalid url");
			}
		}
		
		if(reqServlet!="")
		{
			if(index < resources.indexOf(reqServlet))
			{
				return reqServlet;
			}
			else
			{
				System.out.println(reqServlet);
				throw new IllegalAccessException("Invalid url");
			}
			
		}
		return path[n-2];
	}
	
	private String buildClassName(String path)
	{
		String firstLetter = path.substring(0,1);
		
		return (firstLetter.toUpperCase()+path.substring(1));
	}
	
	
	private void reflection(String reqServlet,String method,HttpServletRequest request, HttpServletResponse response)
	{
		try {
				Class<?> servlets = Class.forName("servlet."+ buildClassName(reqServlet)+"Servlet");
				
				HttpServlet servlet =  (HttpServlet) servlets.getDeclaredConstructor().newInstance();
				//servlets.doGet(request,response);
				
				switch(method)
				{
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
		//		for(Method m:servlet.getMethods())
		//		System.out.println(m);
				
				servlets.getDeclaredMethod(method, HttpServletRequest.class,HttpServletResponse.class).invoke(servlet,request,response);
				
		//		response.getWriter().append("Served at: ").append(servlet.getName());
			} 
			catch (ClassNotFoundException | NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException | InstantiationException e) 
			{
				e.printStackTrace();
			}

	}

	
	
	
	 
	

}
