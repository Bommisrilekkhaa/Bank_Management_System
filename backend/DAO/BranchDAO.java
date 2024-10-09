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
    	setconditions.put("branch_number", branch.getBranch_number());
    	setconditions.put("bank_id", branch.getBank_id());
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
    	BankDAO bankQueryMap = new BankDAO();
    	HashMap<String, Integer> branchMap = new HashMap<>();
    	HashMap<String, Integer> bankMap = new HashMap<>();
    	branchMap.put("branches", branchId);
    	bankMap.put("banks", ControllerServlet.pathMap.get("banks"));
    	AccountDAO accountQueryMap = new AccountDAO();
    	ResultSet rs = accountQueryMap.selectAllAccounts(conn, branchMap);
    	ResultSet rsBank = bankQueryMap.getBanks(conn, bankMap);
    	while(rs.next())
    	{
    		Account account = new Account();
            account.setAccNo(rs.getInt("acc_number"));
            account.setAccType(rs.getInt("acc_type"));
            account.setAccStatus(rs.getInt("acc_status"));
            account.setAccBalance(rs.getDouble("acc_balance"));
            account.setUserId(rs.getInt("user_id"));
            if(rsBank.next())
            	account.setBranchId(rsBank.getInt("main_branch_id"));

            accountQueryMap.updateAccount(conn, account);
    	}
    	
    	
    }
    
    public Branch extractBranchDetails(JsonObject jsonRequest,Branch branch) 
    {
    	branch.setName(jsonRequest.get("branch_name").getAsString());
        branch.setAddress(jsonRequest.get("branch_address").getAsString());
        branch.setBranch_number(jsonRequest.get("branch_number").getAsString());
        branch.setManager_id(jsonRequest.get("manager_id").getAsInt());
        
		return branch;
    
    }
}
