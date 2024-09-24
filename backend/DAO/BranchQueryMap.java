package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.google.gson.JsonObject;

import model.Branch;
import utility.DbConnection;
import utility.Query_util;

public class BranchQueryMap {

    private DbConnection db = new DbConnection();

    public boolean insertBranch(Connection conn, Branch branch) throws SQLException 
    {
        Query_util query = Query_util.create()
                .insert("branch")
                .columns("branch_name", "branch_address", "branch_number", "bank_id", "is_main_branch", "manager_id")
                .values(branch.getName(), branch.getAddress(), branch.getBranch_no(), branch.getBank_id(),
                        branch.getIs_main_branch(), branch.getManager_id());

        return query.executeUpdate(conn, db) > 0;
    }

    public Branch selectBranchById(Connection conn, int branchId) throws SQLException 
    {
        Query_util query = Query_util.create()
                .select("*")
                .from("branch")
                .where("branch_id", "=", branchId);

        try (ResultSet rs = query.executeQuery(conn, db)) {
            if (rs.next()) {
                Branch branch = new Branch();
                branch.setBranch_id(rs.getInt("branch_id"));
                branch.setName(rs.getString("branch_name"));
                branch.setAddress(rs.getString("branch_address"));
                branch.setBranch_no(rs.getString("branch_number"));
                branch.setBank_id(rs.getInt("bank_id"));
                branch.setIs_main_branch(rs.getBoolean("is_main_branch"));
                branch.setManager_id(rs.getInt("manager_id"));
                return branch;
            }
        }
        return null;
    }

    public boolean updateBranch(Connection conn, Branch branch) throws SQLException 
    {
        Query_util query = Query_util.create()
                .update("branch")
                .set("branch_name", branch.getName())
                .set("branch_address", branch.getAddress())
                .set("branch_number", branch.getBranch_no())
                .set("bank_id", branch.getBank_id())
                .set("is_main_branch", branch.getIs_main_branch())
                .set("manager_id", branch.getManager_id())
                .where("branch_id", "=", branch.getBranch_id());

        return query.executeUpdate(conn, db) > 0;
    }

    public boolean deleteBranch(Connection conn, int branchId) throws SQLException 
    {
        Query_util query = Query_util.create()
                .deleteFrom("branch")
                .where("branch_id", "=", branchId);

        return query.executeUpdate(conn, db) > 0;
    }
    
    public Branch extractBranchDetails(JsonObject jsonRequest,Branch branch) 
    {
    	branch.setName(jsonRequest.get("branch_name").getAsString());
        branch.setAddress(jsonRequest.get("branch_address").getAsString());
        branch.setBranch_no(jsonRequest.get("branch_number").getAsString());
        branch.setBank_id(jsonRequest.get("bank_id").getAsInt());
        branch.setIs_main_branch(jsonRequest.get("is_main_branch").getAsBoolean());
        branch.setManager_id(jsonRequest.get("manager_id").getAsInt());
        
		return branch;
    
    }
}
