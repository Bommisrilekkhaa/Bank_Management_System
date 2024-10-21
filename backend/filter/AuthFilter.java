package filter;


import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import utility.JsonHandler;

@SuppressWarnings("serial")
public class AuthFilter extends HttpFilter implements Filter {
       

    public AuthFilter() {
        super();
       
    }

	public void destroy() {
		
		
	}
	
	public static void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
	    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With,XSet-Cookie"); 
	    response.setHeader("Access-Control-Allow-Credentials", "true");

	    response.setStatus(HttpServletResponse.SC_OK);
	    System.out.println("CORS preflight response sent.");
	}
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException 
	{
		 

//		System.out.println("start");
		
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		Cookie[] cookies = req.getCookies();
		
//		System.out.println("cookie"+req.getCookies());
		doOptions(req,res);
		String[] path = req.getRequestURI().split("/");
		
		if (cookies == null) 
		{
			if (path[path.length-1].equals("auth") || path[path.length-1].equals("banks")) 
			{
				System.out.println("Login request, skipping auth filter.");
				
				chain.doFilter(request, response);
				return;
			}
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			JsonHandler.sendErrorResponse(res, "No cookies present, user is not logged in.");
			return;
		}
	    
		
		for (Cookie cookie : cookies) 
        {
                if ("authToken".equals(cookie.getName())) 
                {
                    if(cookie.getValue()!=null && cookie.getValue().equals(req.getSession(false).getId()))
                    {
                    	System.out.println("cookie"+cookie.getValue());

                	    ((HttpServletResponse) response).setStatus(HttpServletResponse.SC_OK);
//                	    JsonHandler.sendSuccessResponse((HttpServletResponse)response, "User is already Logged In");
                    	
                    }
                    else
        	        {
                    	 ((HttpServletResponse) response).setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    	 return;
//                    	 JsonHandler.sendErrorResponse((HttpServletResponse)response, "Invalis session");
        	        }
                }
          }
	         
		
		chain.doFilter(request, response);
		
//		System.out.println("bye");

	}

	public void init(FilterConfig fConfig) throws ServletException {
		
	}

}
