package DAO;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.gson.JsonObject;

import enums.Status;
import enums.UserRole;
import model.User;
import servlet.ControllerServlet;
import utility.DbConnection;
import utility.QueryUtil;
import utility.SessionHandler;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class UserDAO {

	    private DbConnection db = new DbConnection();

	    public boolean authenticateUser(Connection conn, User user) throws SQLException 
	    {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("username", new Object[] {"=",user.getUsername()});
	    	conditions.put("password", new Object[] {"=",SessionHandler.hashPassword(user.getPassword())});
	    	conditions.put("user_role", new Object[] {"=", user.getUser_role()});
	    	
	        QueryUtil query = QueryUtil.create()
	                			.select("*")
				                .from("users")
				                .where(conditions);
	        
	        try (ResultSet rs = query.executeQuery(conn, db)) 
	        {
	        	if(rs.next())
	        	{
	        		user.setUser_id(rs.getInt("user_id"));
	        		System.out.println("status"+(Integer)Status.ACTIVE.getValue());
	        		if(rs.getInt("user_status")== (Integer)Status.ACTIVE.getValue())
	        		{
	        			return true;
	        		}
	        		return false;
	        	}
	        	return false;
	        	
	        }
	    }

	    public boolean registerUser(Connection conn, User user) throws SQLException 
	    {
	        QueryUtil query = QueryUtil.create()
	                .insert("users")
	                .columns("full_name", "date_of_birth", "user_phonenumber", "user_address", "user_role", "username", "password", "user_status")
	                .values(user.getFullname(),user.getDate_of_birth(),
		             user.getUser_phonenumber(),
		             user.getUser_address(),
		             user.getUser_role(),
		             user.getUsername(),
		             SessionHandler.hashPassword(user.getPassword()),
		            (Integer) Status.PENDING.getValue());
	        
//	        for(String i:userDetails)
//	        System.out.println(query.executeUpdate(conn, db) > 0);
	        return query.executeUpdate(conn, db) > 0;
	    }
	    
	    public ResultSet selectAllUsers(Connection conn) throws SQLException 
	    {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("bank_id", new Object[] {"=",ControllerServlet.pathMap.get("banks")});
	        QueryUtil query = QueryUtil.create()
	                .select("*")
	                .from("users")
	                .where(conditions);
	        

	        return query.executeQuery(conn, db);
	    }
	    
	    public List<User> convertResultSetToList(ResultSet rs) throws SQLException 
	    {
	        List<User> userList = new ArrayList<>();

	        while (rs.next()) 
	        {
	            User user = new User();
	            user.setUser_id(rs.getInt("user_id"));
	            user.setFullname(rs.getString("full_name"));
	            user.setDate_of_birth(rs.getDate("date_of_birth"));
	            user.setUser_phonenumber(rs.getString("user_phonenumber"));
	            user.setUser_address(rs.getString("user_address"));
	            user.setUser_role(rs.getInt("user_role"));
	            user.setUsername(rs.getString("username"));
	            user.setPassword(rs.getString("password"));
	            user.setUser_status(rs.getInt("user_status"));
	            userList.add(user);
	        }
	        return userList;
	    }

	    public List<User> applyFilters(List<User> users, Map<String, String[]> parameterMap) 
	    {
	        return users.stream()
	                .filter(user -> parameterMap.entrySet().stream()
	                    .allMatch(entry -> {
	                        String param = entry.getKey();
	                        String[] values = entry.getValue();

	                        switch (param) {
	                            case "user_id":
	                                int userId = Integer.parseInt(values[0]);
	                                return user.getUser_id() == userId;
	                            case "full_name":
	                                return user.getFullname().equalsIgnoreCase(values[0]);
	                            case "user_phonenumber":
	                                return user.getUser_phonenumber().equals(values[0]);
	                            case "user_role":
	                                int userRole = Integer.parseInt(values[0]);
	                                return user.getUser_role() == userRole;
	                            case "user_status":
	                                int status = Integer.parseInt(values[0]);
	                                return user.getUser_status() == status;
	                            default:
	                                return true;
	                        }
	                    })
	                )
	                .collect(Collectors.toList());
	    }
	    
	    public boolean isUsernameTaken(Connection conn, User user) throws SQLException 
	    {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("username", new Object[] {"=",user.getUsername()});
	    	
	        QueryUtil query = QueryUtil.create()
	                .select("*")
	                .from("users")
	                .where(conditions);
	        
	        try (ResultSet rs = query.executeQuery(conn, db)) 
	        {
	            return rs.next();
	        }
	    }
	    
	    public boolean updateUser(Connection conn, User user) throws SQLException 
	    {
	    	Map<String,Object[]> whereconditions = new HashMap<>();
	    	whereconditions.put("user_id", new Object[] {"=",user.getUser_id()});
	    	
	    	Map<String,Object> conditions = new HashMap<>();
	    	
	    	conditions.put("fullname", user.getFullname());
	    	conditions.put("date_of_birth", user.getDate_of_birth());
	    	conditions.put("user_phonenumber", user.getUser_phonenumber());
	    	conditions.put("user_address", user.getUser_address());
	    	conditions.put("user_role", user.getUser_role());
	    	conditions.put("user_status", user.getUser_status());
	    	
	        QueryUtil query = QueryUtil.create()
	                .update("users")
	                .set(conditions)
	                .where(whereconditions);

	        return query.executeUpdate(conn, db) > 0;
	    }
	    
	    public boolean deleteUser(Connection conn,int userId) throws SQLException 
	    {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("user_id", new Object[] {"=",userId});
	    	
	        QueryUtil query = QueryUtil.create()
	                .deleteFrom("users")
	                .where(conditions);

	        return query.executeUpdate(conn, db) > 0;
	    }

		public User extractUserDetails(JsonObject jsonRequest,User user) throws ParseException 
	    {
	        
		  
		    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");  
		    Date strDate=  new java.sql.Date(formatter.parse(jsonRequest.get("date_of_birth").getAsString()).getTime());  
	             user.setFullname(jsonRequest.get("full_name").getAsString());
	             user.setDate_of_birth(strDate); 
	             user.setUser_phonenumber(jsonRequest.get("user_phonenumber").getAsString());
	             user.setUser_address(jsonRequest.get("user_address").getAsString());
	             user.setUser_role(UserRole.valueOf(jsonRequest.get("user_role").getAsString().toUpperCase()).getValue());
	             user.setUsername(jsonRequest.get("username").getAsString());
	             user.setPassword(jsonRequest.get("password").getAsString());
	                
	        return user;
	    }
		
		 public User getUsername(Connection conn, int userId) throws SQLException 
		 {
			 Map<String,Object[]> conditions = new HashMap<>();
		     conditions.put("user_id", new Object[] {"=",userId});
		     
			 User user = new User();
//			 System.out.println("full_namesatrt");
		        QueryUtil query = QueryUtil.create()
		                .select("full_name,username")
		                .from("users")
		                .where(conditions);
		        try (ResultSet rs = query.executeQuery(conn, db)) 
		        {
		        	
		        	if(rs.next())
		            {
		        		user.setUsername(rs.getString("username"));
		        		user.setFullname(rs.getString("full_name"));
		        		return user;
		            }
		        }
		        return null;
		  }
		 
		 public User getUserId(Connection conn, String username) throws SQLException 
		 {
			 Map<String,Object[]> conditions = new HashMap<>();
		     conditions.put("username", new Object[] {"=",username});
		     
			 User user = new User();
//			 System.out.println("full_namesatrt");
		        QueryUtil query = QueryUtil.create()
		                .select("user_id")
		                .from("users")
		                .where(conditions);
		        try (ResultSet rs = query.executeQuery(conn, db)) 
		        {
		        	
		        	if(rs.next())
		            {
		        		user.setUser_id(rs.getInt("user_id"));
		        		return user;
		            }
		        }
		        return null;
		  }
		 
		 
	


}
