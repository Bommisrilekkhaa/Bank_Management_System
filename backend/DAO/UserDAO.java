package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import enums.Status;
import enums.UserRole;
import handlers.UsersHandler;
import model.Bank;
import model.User;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.QueryUtil;
import utility.SessionUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserDAO {

		public final static int itemsPerPage = 8;
	    private DbUtil db = new DbUtil();
	    private BankDAO bankDao = new BankDAO();
	    private BranchDAO branchDao = new BranchDAO();

	    public boolean authenticateUser(Connection conn, User user,Bank bank) throws SQLException 
	    {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("username", new Object[] {"=",user.getUsername()});
	    	conditions.put("password", new Object[] {"=",SessionUtil.hashPassword(user.getPassword())});
	    	
	    	
	        QueryUtil query = QueryUtil.create()
	                			.select("*")
				                .from("users")
				                .where(conditions);
	        ResultSet rs=null;
	        try 
	        {
	        	rs = query.executeQuery(conn, db);
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
	        finally {
	        	db.close(null, null, rs);
	        }
	    }

	    public boolean registerUser(Connection conn, User user) throws SQLException 
	    {
	        QueryUtil query = QueryUtil.create()
	                .insert("users")
	                .columns("full_name", "date_of_birth", "user_phonenumber", "user_address", "user_role", "username", "password", "user_status")
	                .values(user.getFullname(),new java.sql.Date(user.getDate_of_birth().getTime()),
		             user.getUser_phonenumber(),
		             user.getUser_address(),
		             user.getUser_role(),
		             user.getUsername(),
		             SessionUtil.hashPassword(user.getPassword()),
		            (Integer) Status.PENDING.getValue());
	        
//	        for(String i:userDetails)
//	        System.out.println(query.executeUpdate(conn, db) > 0);
	        return query.executeUpdate(conn, db) > 0;
	    }
	    
	   public ResultSet selectPageWise(Connection conn,HashMap<String, Integer> pathMap,String searchParam) throws SQLException 
	   {
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	
	    	for(String key:pathMap.keySet()) {
	    		conditions.put(key, new Object[] {"=",pathMap.get(key)});
	    	}
	    	
	    	if(searchParam!=null) 
	    	{
	    		conditions.put("username", new Object[] {"ILIKE",searchParam+"%"});
	    	}
	    	
	    	QueryUtil query = QueryUtil.create()
	                .select("*")
	                .from("users")
	                .where(conditions)
 					.orderBy("user_id", "DESC");
	    	
	    	 if(UsersHandler.offset!=-1)
	    	 {
	    		 query.limitOffset(itemsPerPage, UsersHandler.offset);	 
	    	 }

	        return query.executeQuery(conn, db);
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
	    
	    public int totalUsers(Connection conn,HashMap<String, Integer> pathMap,String searchParam) throws SQLException 
		{
		    	Map<String,Object[]> conditions = new HashMap<>();
		    	
		    	for(String key:pathMap.keySet()) {
		    		if(key.equals("users"))
		    		{
		    			key="user_id";
		    			conditions.put(key, new Object[] {"=",pathMap.get("users")});
		    		}
		    		else
		    		{

		    			conditions.put(key, new Object[] {"=",pathMap.get(key)});
		    		}
		    	}
		    	
		    	if(searchParam!=null) 
		    	{
		    		conditions.put("username", new Object[] {"ILIKE",searchParam+"%"});
		    	}
		    	
		    	QueryUtil query = QueryUtil.create()
		                .select("COUNT(user_id) AS TotalUsers")
		                .from("users")
		                .where(conditions);
		    	

		    	 ResultSet rs = null;
		         try{
		         	rs = query.executeQuery(conn, new DbUtil());
		         	if(rs.next())
		         	{
		         		return rs.getInt("TotalUsers");
		         	}
		         	
		         }
		         finally {
		         	db.close(null, null, rs);
		         }
		         return -1;
		}
	    
	    public ResultSet getUnassignedManagers(Connection conn) throws SQLException
	    {
	    	
	    	Map<String,Object[]> conditions = new HashMap<>();
	    	conditions.put("u.user_role", new Object[] {"=",UserRole.MANAGER.getValue()});
	    	conditions.put("u.user_status", new Object[] {"=",Status.ACTIVE.getValue()});
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
	    	conditions.put("u.user_status", new Object[] {"=",Status.ACTIVE.getValue()});
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
	        ResultSet rs=null;
	        try 
	        {
	        	rs = query.executeQuery(conn, db);
	            return rs.next();
	        }
	        finally {
	        	db.close(null, null, rs);
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
		        ResultSet rs=null;
		        try 
		        {
		        	rs = query.executeQuery(conn, db);
		        	
		        	if(rs.next())
		            {
		        		user.setUsername(rs.getString("username"));
		        		user.setFullname(rs.getString("full_name"));
		        		return user;
		            }
		        }
		        finally {
		        	db.close(null, null, rs);
		        }
		        return null;
		  }
		 
		 public List<Integer> getUserId(Connection conn, String username) throws SQLException 
		 {
			 Map<String,Object[]> conditions = new HashMap<>();
		     conditions.put("username", new Object[] {"ILIKE",username+"%"});
		     
//			 System.out.println("full_namesatrt");
		        QueryUtil query = QueryUtil.create()
		                .select("user_id")
		                .from("users")
		                .where(conditions);
		        ResultSet rs=null;
		        List<Integer> userId = new ArrayList<>();
		        try 
		        {
		        	rs = query.executeQuery(conn, db);
		        	while(rs.next())
		            {
		        		userId.add(rs.getInt("user_id"));
		        		
		            }
		        }
		        finally {
		        	db.close(null, null, rs);
		        }
		        return userId;
		  }
		 
		 
		


}
