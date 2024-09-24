package utility;


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

@SuppressWarnings("serial")
public class Auth_Filter extends HttpFilter implements Filter {
       

    public Auth_Filter() {
        super();
       
    }

	public void destroy() {
		
		
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException 
	{
		 

//		System.out.println("start");
		
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		Cookie[] cookies = req.getCookies();
		
//		System.out.println("cookie"+req.getCookies());
		
		String path = req.getParameter("action");
		
		if (cookies == null) 
		{
			if (path.contains("login") || path.contains("register")) 
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
                	    JsonHandler.sendSuccessResponse((HttpServletResponse)response, "User is already Logged In");
                    	
                    }
                    else
        	        {
                    	 ((HttpServletResponse) response).setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    	 JsonHandler.sendErrorResponse((HttpServletResponse)response, "Invalis session");
        	        }
                }
          }
	         
		
		chain.doFilter(request, response);
		
//		System.out.println("bye");

	}

	public void init(FilterConfig fConfig) throws ServletException {
		
	}

}
