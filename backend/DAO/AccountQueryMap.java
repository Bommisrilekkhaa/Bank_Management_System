package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.google.gson.JsonObject;

import model.Account;
import utility.DbConnection;
import utility.Query_util;

public class AccountQueryMap {

    private DbConnection db = new DbConnection();
    private Account account = new Account();

    public boolean insertAccount(Connection conn, Account account) throws SQLException 
    {
        Query_util query = Query_util.create()
			                .insert("account")
			                .columns("acc_no", "acc_type", "acc_balance", "acc_status", "user_id", "branch_id")
			                .values(account.getAccNo(), account.getAccType(), account.getAccBalance(), account.getAccStatus(),
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
            account.setAccNo(rs.getString("acc_no"));
            account.setAccType(rs.getString("acc_type"));
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
                                return account.getAccNo().equals(values[0]);
                            case "acc_type":
                                return account.getAccType().equals(values[0]);
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

   

    public boolean updateAccount(Connection conn, Account account) throws SQLException {
    	
        Query_util query = Query_util.create()
                .update("account")
                .set("acc_type", account.getAccType())
                .set("acc_balance", account.getAccBalance())
                .set("acc_status", account.getAccStatus())
                .set("user_id", account.getUserId())
                .set("branch_id", account.getBranchId())
                .where("acc_no", "=", account.getAccNo());

        return query.executeUpdate(conn, db) > 0;
    }

    public boolean deleteAccount(Connection conn, String accNo) throws SQLException {
    	
        Query_util query = Query_util.create()
                .deleteFrom("account")
                .where("acc_no", "=", accNo);

        return query.executeUpdate(conn, db) > 0;
    }
    
    
    public Account extractAccountDetails(JsonObject jsonRequest) 
    {
        
        
        account.setAccNo(jsonRequest.get("acc_no").getAsString());
        account.setAccType(jsonRequest.get("acc_type").getAsString());
        account.setAccBalance(jsonRequest.get("acc_balance").getAsDouble());
        account.setAccStatus(jsonRequest.get("acc_status").getAsInt());
        account.setUserId(jsonRequest.get("user_id").getAsInt());
        account.setBranchId(jsonRequest.get("branch_id").getAsInt());

        return account;
    }
}
