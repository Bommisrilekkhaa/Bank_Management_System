package DAO;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.gson.JsonObject;

import enums.Status;
import enums.UserRole;
import model.Bank;
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

public class UserDAO {

	    private DbConnection db = new DbConnection();
	    private BankDAO bankDao = new BankDAO();
	    private BranchDAO branchDao = new BranchDAO();

	    public boolean authenticateUser(Connection conn, User user,Bank bank) throws SQLException 
	    {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("username", new Object[] {"=",user.getUsername()});
	    	conditions.put("password", new Object[] {"=",SessionHandler.hashPassword(user.getPassword())});
	    	
	    	
	        QueryUtil query = QueryUtil.create()
	                			.select("*")
				                .from("users")
				                .where(conditions);
	        
	        try (ResultSet rs = query.executeQuery(conn, db)) 
	        {
	        	if(rs.next())
	        	{
	        		user.setUser_id(rs.getInt("user_id"));
	        		user.setUser_role(rs.getInt("user_role"));
//	        		System.out.println("status"+(Integer)Status.ACTIVE.getValue());
	        		if(rs.getInt("user_status")== (Integer)Status.ACTIVE.getValue())
	        		{
	        			if(user.getUser_role()==(Integer)UserRole.ADMIN.getValue())
	        			{
	        				Bank newBank = bankDao.getBankById(conn, bank.getBank_id());
	        				if(newBank.getAdmin_id()==user.getUser_id())
	        				{
	        					return true;
	        				}
	        				
	        				return false;

	        			}
	        			else if(user.getUser_role()==(Integer)UserRole.MANAGER.getValue())
	        			{
	        				ResultSet rsBranch = branchDao.selectBranchByManager(conn, user.getUser_id());
	        				if(rsBranch.next())
	        				{
	        					if(rsBranch.getInt("bank_id") == bank.getBank_id())
	        					{
	        						return true;
	        					}
	        					return false;
	        				}
	        				return false;
	        			}
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
	    	
	    	if(ControllerServlet.pathMap.containsKey("users")) 
	    	{
	    		conditions.put("user_id", new Object[] {"=",ControllerServlet.pathMap.get("users")});
	    	}
	    	
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

	    
	    
	    public ResultSet getUnassignedManagers(Connection conn) throws SQLException
	    {
	    	
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("u.user_role", new Object[] {"=",UserRole.MANAGER.getValue()});
	    	 QueryUtil query = QueryUtil.create()
		                .select("*")
		                .from("users u")
		                .join("branch b", "u.user_id = b.manager_id", "LEFT")
		                .where(conditions);
	    	 
	    	query.append("AND b.manager_id IS NULL");
	    	return query.executeQuery(conn, db);

	    }
	    
	    public ResultSet getUnassignedAdmins(Connection conn) throws SQLException
	    {
	    	
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("u.user_role", new Object[] {"=",UserRole.ADMIN.getValue()});
	    	 QueryUtil query = QueryUtil.create()
		                .select("*")
		                .from("users u")
		                .join("banks b", "u.user_id = b.admin_id", "LEFT")
		                .where(conditions);
	    	 
	    	query.append("AND b.admin_id IS NULL");
	    	return query.executeQuery(conn, db);

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
	    	
	    	conditions.put("user_status", user.getUser_status());
	    	
	        QueryUtil query = QueryUtil.create()
	                .update("users")
	                .set(conditions)
	                .where(whereconditions);

	        return query.executeUpdate(conn, db) > 0;
	    }
	    
	    public boolean updateFullname(Connection conn,User user) throws SQLException 
	    {
	    	Map<String,Object[]> whereconditions = new HashMap<>();
	    	whereconditions.put("user_id", new Object[] {"=",user.getUser_id()});
	    	
	    	Map<String,Object> conditions = new HashMap<>();
	    	
	    	conditions.put("full_name", user.getFullname());
	    	
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

	    public User extractUserDetails(JsonObject jsonRequest, User user) throws ParseException {
	        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");  

	        if (jsonRequest.has("full_name")) {
	            user.setFullname(jsonRequest.get("full_name").getAsString());
	        }

	        if (jsonRequest.has("date_of_birth")) {
	            Date strDate = new java.sql.Date(formatter.parse(jsonRequest.get("date_of_birth").getAsString()).getTime());
	            user.setDate_of_birth(strDate);
	        }

	        if (jsonRequest.has("user_phonenumber")) {
	            user.setUser_phonenumber(jsonRequest.get("user_phonenumber").getAsString());
	        }

	        if (jsonRequest.has("user_address")) {
	            user.setUser_address(jsonRequest.get("user_address").getAsString());
	        }

	        if (jsonRequest.has("user_role")) {
	            user.setUser_role(UserRole.valueOf(jsonRequest.get("user_role").getAsString().toUpperCase()).getValue());
	        }

	        if (jsonRequest.has("username")) {
	            user.setUsername(jsonRequest.get("username").getAsString());
	        }

	        if (jsonRequest.has("password")) {
	            user.setPassword(jsonRequest.get("password").getAsString());
	        }
	        
	        if(jsonRequest.has("user_status"))
	        {

	            user.setUser_status(Status.valueOf(jsonRequest.get("user_status").getAsString().toUpperCase()).getValue());
	          
	        }

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
