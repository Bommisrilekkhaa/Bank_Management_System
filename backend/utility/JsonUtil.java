package utility;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class JsonUtil {

	private static Gson gson = new Gson(); 
	
	
	public static void sendJsonResponse(HttpServletResponse response, JsonObject jsonResponse) throws IOException 
	{
	        response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(gson.toJson(jsonResponse));
	}
	
	public static JsonObject parseJsonRequest(HttpServletRequest request) throws IOException 
	{
	    BufferedReader reader = request.getReader();
	    
	    return gson.fromJson(reader, JsonObject.class);
	}
	
	 public static <T> T parseRequest(String body, Class<T> clazz) throws IOException {
		 return gson.fromJson(body, clazz);

	 }
	 
	 
	
	     public static <T> List<T> convertResultSetToList(ResultSet rs, Class<T> clazz) throws SQLException {
	         List<T> resultList = new ArrayList<>();
	         
	         try {
	             while (rs.next()) {
	                 T instance = clazz.getDeclaredConstructor().newInstance();
	                 
	                 for (Field field : clazz.getDeclaredFields()) {
	                     field.setAccessible(true);
	                     
	                     try {
	                         Object value = rs.getObject(field.getName());
	                         if (value != null) {
	                             field.set(instance, value);
//	                             System.out.println(field.get(instance));
	                         }
	                     } catch (SQLException e) {
	                         System.err.println("No column found in ResultSet for field: " + field.getName());
	                     }
	                 }
	                 
	                 resultList.add(instance);
	             }
	         } catch (Exception e) {
	             throw new SQLException("Error converting ResultSet to List: " + e.getMessage(), e);
	         }
	         
	         return resultList;
	     }
	 


	public static void sendSuccessResponse(HttpServletResponse response, String message) throws IOException 
	{
	    JsonObject jsonResponse = new JsonObject();
	    response.setStatus(HttpServletResponse.SC_OK);
	    jsonResponse.addProperty("status", "success");
	    jsonResponse.addProperty("message", message);
	    sendJsonResponse(response, jsonResponse);
	}

	
	public static void sendErrorResponse(HttpServletResponse response, String message) throws IOException 
	{
	    JsonObject jsonResponse = new JsonObject();
	    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	    jsonResponse.addProperty("status", "error");
	    jsonResponse.addProperty("message", message);
	    sendJsonResponse(response, jsonResponse);
	}

	public static void sendJsonResponse(HttpServletResponse response, JsonArray jsonArray) throws IOException {
		
		  response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(gson.toJson(jsonArray));
	}

}
