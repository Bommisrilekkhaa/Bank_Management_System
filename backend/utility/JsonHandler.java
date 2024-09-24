package utility;
import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class JsonHandler {

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


}
