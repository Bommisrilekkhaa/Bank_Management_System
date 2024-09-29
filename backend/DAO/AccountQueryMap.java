package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.ServletException;

import com.google.gson.JsonObject;

import model.Account;
import model.Status;
import utility.DbConnection;
import utility.Query_util;

public class AccountQueryMap {

    private DbConnection db = new DbConnection();
    private Account account = new Account();

    private BranchQueryMap branchQueryMap = new BranchQueryMap();

    public boolean insertAccount(Connection conn, Account account) throws SQLException 
    {
        Query_util query = Query_util.create()
			                .insert("account")
			                .columns("acc_type", "acc_balance", "acc_status", "user_id", "branch_id")
			                .values( account.getAccType(), 0, 0,
			                		account.getUserId(), account.getBranchId());

        return query.executeUpdate(conn, db) > 0;
    }
    
    public ResultSet selectAllAccounts(Connection conn) throws SQLException 
    {
        Query_util query = Query_util.create()
			                .select("*")
			                .from("account");

        return query.executeQuery(conn, new DbConnection());
    }
    
    
    public List<Account> convertResultSetToList(ResultSet rs) throws SQLException 
    {
        List<Account> accountList = new ArrayList<>();
        
        while (rs.next()) 
        {
            Account account = new Account();
            account.setAccNo(rs.getInt("acc_no"));
            account.setAccType(rs.getInt("acc_type"));
            account.setAccBalance(rs.getDouble("acc_balance"));
            account.setAccStatus(rs.getInt("acc_status"));
            account.setUserId(rs.getInt("user_id"));
            account.setBranchId(rs.getInt("branch_id"));
            accountList.add(account);
        }
        return accountList;
    }

    public List<Account> applyFilters(List<Account> accounts, Map<String, String[]> parameterMap) 
    {
        return ( accounts.stream()
                .filter(account -> 
                    parameterMap.entrySet().stream()
                    .allMatch(entry -> {
                        String param = entry.getKey();
                        String[] values = entry.getValue();
                        
                        switch (param) {
                            case "acc_no":
                            	int num = Integer.parseInt(values[0]);
                                return account.getAccNo() == num;
                            case "acc_type":
                            	int type = Integer.parseInt(values[0]);
                                return account.getAccType() == type;
                            case "acc_balance":
                            	double balance = Double.parseDouble(values[0]);
                                return account.getAccBalance() == balance;
                            case "acc_status":
                                int status = Integer.parseInt(values[0]);
                                return account.getAccStatus() == status;
                            case "user_id":
                                int userId = Integer.parseInt(values[0]);
                                return account.getUserId() == userId;
                            case "branch_id":
                                int branchId = Integer.parseInt(values[0]);
                                return account.getBranchId() == branchId;
                            default:
                                return true;
                        }
                    })
                )).collect(Collectors.toList());
    }

   

    public boolean updateAccount(Connection conn, Account account) throws SQLException 
    {
    	Map<String,Object[]> whereconditions = new HashMap<>();
    	whereconditions.put("acc_number", new Object[] {"=",account.getAccNo()});
    	
    	Map<String,Object> conditions = new HashMap<>();
    	conditions.put("acc_type",account.getAccType());
    	conditions.put("acc_balance", account.getAccBalance());
    	conditions.put("acc_status", account.getAccStatus());
    	conditions.put("user_id", account.getUserId());
    	conditions.put("branch_id", account.getBranchId());
    	
        Query_util query = Query_util.create()
                .update("account")
                .set(conditions)
                .where(whereconditions);

        return query.executeUpdate(conn, db) > 0;
    }

    public boolean deleteAccount(Connection conn, int acc_no) throws SQLException 
    {
    	
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("acc_number", new Object[] {"=",account.getAccNo()});
    	
        Query_util query = Query_util.create()
                .deleteFrom("account")
                .where(conditions);

        return query.executeUpdate(conn, db) > 0;
    }
    
    
    public Account extractAccountDetails(JsonObject jsonRequest) throws SQLException, ServletException 
    {
        
        
//        account.setAccNo(jsonRequest.get("acc_no").getAsInt());
        account.setAccType(jsonRequest.get("acc_type").getAsInt());
//        account.setAccBalance(jsonRequest.get("acc_balance").getAsDouble());
        account.setAccStatus(Status.valueOf(jsonRequest.get("acc_status").getAsString().toUpperCase()).getValue());
        account.setUserId(1);
        account.setBranchId(branchQueryMap.getBranchId(DbConnection.connect(),jsonRequest.get("branch_name").getAsString()));

        return account;
    }
}
