package DAO;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.gson.JsonObject;

import model.User;
import utility.DbConnection;
import utility.Query_util;

import java.text.ParseException;
import java.text.SimpleDateFormat;

public class UserQueryMap {

	    private DbConnection db = new DbConnection();

	    public boolean authenticateUser(Connection conn, User user) throws SQLException 
	    {
	        Query_util query = Query_util.create()
	                			.select("*")
				                .from("users")
				                .where("username", "=", user.getUsername())
				                .and("password", "=", user.getPassword())
				                .and("user_role", "=", user.getUser_role());
	        
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
		             user.getPassword(),
		             user.getUser_status());
	        
//	        for(String i:userDetails)
	        System.out.println(query.executeUpdate(conn, db) > 0);
	        return query.executeUpdate(conn, db) > 0;
	    }

	    public boolean isUsernameTaken(Connection conn, User user) throws SQLException 
	    {
	        Query_util query = Query_util.create()
	                .select("*")
	                .from("users")
	                .where("username", "=", user.getUsername());
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
	             user.setUser_role(jsonRequest.get("user_role").getAsString());
	             user.setUsername(jsonRequest.get("username").getAsString());
	             user.setPassword(jsonRequest.get("password").getAsString());
	             user.setUser_status(0);
	                
	        return user;
	    }
	


}
