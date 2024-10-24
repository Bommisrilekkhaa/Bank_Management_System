package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.JsonObject;

import model.Account;
import model.Branch;
import servlet.ControllerServlet;
import utility.DbConnection;
import utility.QueryUtil;

public class BranchDAO {

    private DbConnection db = new DbConnection();
    

    public boolean insertBranch(Connection conn, Branch branch) throws SQLException 
    {
        QueryUtil query = QueryUtil.create()
                .insert("branch")
                .columns("branch_name", "branch_address", "bank_id",  "manager_id")
                .values(branch.getName(), branch.getAddress(), branch.getBank_id(),
                         branch.getManager_id());

        return query.executeUpdate(conn, db) > 0;
    }

    public ResultSet selectBranches(Connection conn,Branch branch) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("bank_id", new Object[] {"=",branch.getBank_id()});
    	
        QueryUtil query = QueryUtil.create()
                .select("*")
                .from("branch")
                .where(conditions);

       return query.executeQuery(conn, db); 
    }
    
    public ResultSet selectBranchById(Connection conn ,int branchId) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("branch_id", new Object[] {"=",branchId});
    	
        QueryUtil query = QueryUtil.create()
                .select("*")
                .from("branch")
                .where(conditions);

        return query.executeQuery(conn, db);
    }
    
    public ResultSet selectBranchByManager(Connection conn ,int managerId) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("manager_id", new Object[] {"=",managerId});
    	
        QueryUtil query = QueryUtil.create()
                .select("*")
                .from("branch")
                .where(conditions);

        return query.executeQuery(conn, db);
    }

    public ResultSet selectBranchesAndAccounts(Connection conn,HashMap<String, Integer> pathMap) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	for(String key:pathMap.keySet()) {
    		conditions.put(changeName(key), new Object[] {"=",pathMap.get(key)});
    	}
    	
    	QueryUtil query = QueryUtil.create()
    		    .select("b.branch_name AS branchName, COUNT(a.acc_number) AS accountCount, "
    		          + "SUM(a.acc_balance) AS totalDeposits, COUNT(l.loan_id) AS loansAvailed,b.manager_id")
    		    .from("branch b")
    		    .join("account a", "b.branch_id = a.branch_id", "LEFT")
    		    .join("loan l", "l.acc_number = a.acc_number", "LEFT")
    		    .where(conditions)
    		    .append("GROUP BY b.branch_id, b.branch_name");


        return query.executeQuery(conn, db);
    }
    public ResultSet selectBranchAndAccounts(Connection conn,HashMap<String, Integer> pathMap) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	for(String key:pathMap.keySet()) {
    		conditions.put(changeName(key), new Object[] {"=",pathMap.get(key)});
    	}
    
	    QueryUtil query = QueryUtil.create()
	    	    .select("b.branch_name AS branchName, " +
	    	    		"b.branch_id AS branch_id, "+
	    	    		"b.manager_id AS manager_id, "+
	    	            "COUNT(CASE WHEN a.acc_type = 1 THEN a.acc_number END) AS savingsAccountCount, " +
	    	            "COUNT(CASE WHEN a.acc_type = 0 THEN a.acc_number END) AS businessAccountCount, " +
	    	            "SUM(CASE WHEN a.acc_type = 1 THEN a.acc_balance ELSE 0 END) AS totalSavingsDeposits, " +
	    	            "SUM(CASE WHEN a.acc_type = 0 THEN a.acc_balance ELSE 0 END) AS totalBusinessDeposits, " +
	    	            "COUNT(CASE WHEN l.loan_type = 0 THEN l.loan_id END) AS homeLoanCount, " +
	    	            "COUNT(CASE WHEN l.loan_type = 1 THEN l.loan_id END) AS educationLoanCount, " +
	    	            "COUNT(CASE WHEN l.loan_type = 2 THEN l.loan_id END) AS businessLoanCount")
	    	    .from("branch b")
	    	    .join("account a", "b.branch_id = a.branch_id", "LEFT")
	    	    .join("loan l", "l.acc_number = a.acc_number", "LEFT")
	    	    .where(conditions)
	    	    .append("GROUP BY b.branch_id, b.branch_name");
	    return query.executeQuery(conn, db);

    }
    
    
    public String changeName(String key)
    {
    	System.out.println(key);
    	if(key.equals("branches"))
    	{
    		return "b."+key.substring(0,key.length()-2)+"_id";
    	}
    	else if(key.equals("accounts"))
    	{
    		return "a."+key.substring(0,3)+"_number";
    	}
    	else if(key.equals("banks"))
    	{
    		
    		return "b."+key.substring(0,key.length()-1)+"_id";
    	}
    	else if(key.equals("users"))
    	{
    		
    		return "a."+key.substring(0,key.length()-1)+"_id";
    	}
    	else
    		return key;
    }
    
    public int getBranchId(Connection conn, String branch_name) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("branch_name", new Object[] {"=",branch_name});
    	
        QueryUtil query = QueryUtil.create()
                .select("*")
                .from("branch")
                .where(conditions);

        try (ResultSet rs = query.executeQuery(conn, db)) {
            if (rs.next()) {
                
                return rs.getInt("branch_id");
            }
        }
        return -1;
    }

    public boolean updateBranch(Connection conn, Branch branch) throws SQLException 
    {
    	Map<String,Object[]> whereconditions = new HashMap<>();
    	Map<String,Object> setconditions = new HashMap<>();
    	setconditions.put("branch_name", branch.getName());
    	setconditions.put("branch_address", branch.getAddress());
    	setconditions.put("manager_id", branch.getManager_id());
    	whereconditions.put("branch_id", new Object[]{"=",branch.getBranch_id()});
    	
    	
        QueryUtil query = QueryUtil.create()
                .update("branch")
                .set(setconditions)
                .where(whereconditions);

        return query.executeUpdate(conn, db) > 0;
    }

    public boolean deleteBranch(Connection conn, int branchId) throws SQLException 
    {
    	moveAccounts(conn, branchId);
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("branch_id", new Object[] {"=",branchId});
    	
        QueryUtil query = QueryUtil.create()
                .deleteFrom("branch")
                .where(conditions);

        return query.executeUpdate(conn, db) > 0;
    }
    
    private void moveAccounts(Connection conn,int branchId) throws SQLException
    {
    	BankDAO bankDAO = new BankDAO();
    	HashMap<String, Integer> branchMap = new HashMap<>();
    	HashMap<String, Integer> bankMap = new HashMap<>();
    	branchMap.put("branches", branchId);
    	bankMap.put("banks", ControllerServlet.pathMap.get("banks"));
    	AccountDAO accountDAO = new AccountDAO();
    	ResultSet rs = accountDAO.selectAllAccounts(conn, branchMap);
    	ResultSet rsBank = bankDAO.getBanks(conn, bankMap);
    	while(rs.next())
    	{
    		Account account = new Account();
            account.setAccNo(rs.getInt("acc_number"));
            account.setAccType(rs.getInt("acc_type"));
            account.setAccStatus(rs.getInt("acc_status"));
            account.setAccBalance(rs.getDouble("acc_balance"));
            account.setUserId(rs.getInt("user_id"));
            if(rsBank.next())
            {
            	account.setBranchId(rsBank.getInt("main_branch_id"));
            }
            
            accountDAO.updateAccount(conn, account);
    	}
    	
    }
    
    public Branch extractBranchDetails(JsonObject jsonRequest,Branch branch) 
    {
    	branch.setName(jsonRequest.get("branch_name").getAsString());
        branch.setAddress(jsonRequest.get("branch_address").getAsString());
        branch.setManager_id(jsonRequest.get("manager_id").getAsInt());
        
		return branch;
    
    }
}
