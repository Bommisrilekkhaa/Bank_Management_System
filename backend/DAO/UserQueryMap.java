package DAO;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.gson.JsonObject;

import model.User;
import model.UserRole;
import utility.DbConnection;
import utility.Query_util;
import utility.SessionHandler;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

public class UserQueryMap {

	    private DbConnection db = new DbConnection();

	    public boolean authenticateUser(Connection conn, User user) throws SQLException 
	    {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("username", new Object[] {"=",user.getUsername()});
	    	conditions.put("password", new Object[] {"=",SessionHandler.hashPassword(user.getPassword())});
	    	conditions.put("user_role", new Object[] {"=", user.getUser_role()});
	    	
	        Query_util query = Query_util.create()
	                			.select("*")
				                .from("users")
				                .where(conditions);
	        
	        try (ResultSet rs = query.executeQuery(conn, db)) 
	        {
	        	
	        		return rs.next();
	        	
	        }
	    }

	    public boolean registerUser(Connection conn, User user) throws SQLException 
	    {
	        Query_util query = Query_util.create()
	                .insert("users")
	                .columns("full_name", "date_of_birth", "user_phonenumber", "user_address", "user_role", "username", "password", "user_status")
	                .values(user.getFullname(),user.getDate_of_birth(),
		             user.getUser_phonenumber(),
		             user.getUser_address(),
		             user.getUser_role(),
		             user.getUsername(),
		             SessionHandler.hashPassword(user.getPassword()),
		             user.getUser_status());
	        
//	        for(String i:userDetails)
//	        System.out.println(query.executeUpdate(conn, db) > 0);
	        return query.executeUpdate(conn, db) > 0;
	    }

	    public boolean isUsernameTaken(Connection conn, User user) throws SQLException 
	    {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("username", new Object[] {"=",user.getUsername()});
	    	
	        Query_util query = Query_util.create()
	                .select("*")
	                .from("users")
	                .where(conditions);
	        
	        try (ResultSet rs = query.executeQuery(conn, db)) 
	        {
	            return rs.next();
	        }
	    }

		public User extractUserDetails(JsonObject jsonRequest,User user) throws ParseException 
	    {
	        
		  
		    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");  
		    Date strDate=  new java.sql.Date(formatter.parse(jsonRequest.get("date_of_birth").getAsString()).getTime());  
	             user.setFullname(jsonRequest.get("full_name").getAsString());
	             user.setDate_of_birth(strDate); 
	             user.setUser_phonenumber(jsonRequest.get("user_phonenumber").getAsString());
	             user.setUser_address(jsonRequest.get("user_address").getAsString());
	             user.setUser_role(UserRole.valueOf(jsonRequest.get("user_role").getAsString()).getValue());
	             user.setUsername(jsonRequest.get("username").getAsString());
	             user.setPassword(jsonRequest.get("password").getAsString());
	             user.setUser_status(0);
	                
	        return user;
	    }
		
		 public User getUsername(Connection conn, int userId) throws SQLException 
		 {
			 Map<String,Object[]> conditions = new HashMap<>();
		     conditions.put("user_id", new Object[] {"=",userId});
		     
			 User user = new User();
//			 System.out.println("full_namesatrt");
		        Query_util query = Query_util.create()
		                .select("full_name")
		                .from("users")
		                .where(conditions);
		        try (ResultSet rs = query.executeQuery(conn, db)) 
		        {
		        	
		        	if(rs.next())
		            {
		        		user.setFullname(rs.getString("full_name"));
		        		return user;
		            }
		        }
		        return null;
		  }
		 
		 
		 
	


}
