package servlet;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ControllerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ControllerServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String[] path = request.getRequestURI().split("/");
		
		try 
		{
			Class<?> servlet = Class.forName("servlet."+ buildClassName(path[4])+"Servlet");
			
			HttpServlet servlets =  (HttpServlet) servlet.getDeclaredConstructor().newInstance();
			String method = request.getMethod();
			//servlets.doGet(request,response);
			
			switch(method)
			{
			case "GET":
				method = "doGet";
				break;
				
			case "POST":
				method = "doPost";
				break;
			}
//			for(Method m:servlet.getMethods())
//			System.out.println(m);
			
			servlet.getDeclaredMethod(method, HttpServletRequest.class,HttpServletResponse.class).invoke(servlets,request,response);

			response.getWriter().append("Served at: ").append(servlet.getName());
		} 
		catch (ClassNotFoundException | NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException | InstantiationException e) 
		{
			e.printStackTrace();
		}
		
	}
	
	private String buildClassName(String path)
	{
		String firstLetter = path.substring(0,1);
		
		return (firstLetter.toUpperCase()+path.substring(1));
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		doGet(request, response);
	}

}
