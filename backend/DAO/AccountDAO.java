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
import javax.servlet.http.HttpServletRequest;

import com.google.gson.JsonObject;

import enums.AccountType;
import enums.Status;
import model.Account;
import utility.DbConnection;
import utility.QueryUtil;

public class AccountDAO {

    private DbConnection db = new DbConnection();
    private Account account = new Account();
    private UserDAO userQueryMap = new UserDAO();

    public boolean insertAccount(Connection conn, Account account) throws SQLException 
    {
        QueryUtil query = QueryUtil.create()
			                .insert("account")
			                .columns("acc_type", "acc_balance", "acc_status", "user_id", "branch_id")
			                .values( account.getAccType(), 0, 0,
			                		account.getUserId(), account.getBranchId());

        return query.executeUpdate(conn, db) > 0;
    }
    
    public boolean checkAccount() throws SQLException, ServletException
    {
    	
    	Map<String,Object[]> conditions = new HashMap<>();
    	
    	conditions.put("branch_id", new Object[] {"=",account.getBranchId()});
    	conditions.put("user_id", new Object[] {"=",account.getUserId()});
    	conditions.put("acc_type", new Object[] {"=",account.getAccType()});
    	QueryUtil query = QueryUtil.create()
    			.select("*")
    			.from("account")
    			.where(conditions);
    	ResultSet rs= query.executeQuery(DbConnection.connect(), new DbConnection());
    	return rs.next();
    }
    public ResultSet selectAllAccounts(Connection conn,HashMap<String, Integer> pathMap) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	
    	for(String key:pathMap.keySet()) {
    		conditions.put(changeName(key), new Object[] {"=",pathMap.get(key)});
    	}
    	 QueryUtil query = QueryUtil.create()
    			 					.select("*")
    			 					.from("branch b")
    			 					.join("account a","b.branch_id=a.branch_id", "INNER")
    			 					.where(conditions);
        return query.executeQuery(conn, new DbConnection());
    }
    
    public String changeName(String key)
    {
    	System.out.println(key);
    	if(key.equals("branches"))
    	{
    		return "a."+key.substring(0,key.length()-2)+"_id";
    	}
    	else if(key.equals("user_id"))
    	{
    		return "a."+key;
    	}
    	else if(key.equals("accounts"))
    	{
    		return "a."+key.substring(0,3)+"_number";
    	}
    	return "b."+key.substring(0,key.length()-1)+"_id";
    }
    
   
    
    public List<Account> convertResultSetToList(ResultSet rs) throws SQLException 
    {
        List<Account> accountList = new ArrayList<>();
        
        while (rs.next()) 
        {
            Account account = new Account();
            account.setAccNo(rs.getInt("acc_number"));
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
    	
        QueryUtil query = QueryUtil.create()
                .update("account")
                .set(conditions)
                .where(whereconditions);

        return query.executeUpdate(conn, db) > 0;
    }
    
    
    

    public boolean updateBalance(Connection conn, int type,double amount,int acc_no) throws SQLException 
    {
    	HashMap<String, Integer> pathMap = new HashMap<>();
    	pathMap.put("accounts", acc_no);
    	ResultSet rs = selectAllAccounts(conn,pathMap);
    	if(rs.next())
    	{
    		account.setAccBalance(rs.getDouble("acc_balance"));
    	}
    	Map<String,Object[]> whereconditions = new HashMap<>();
    	whereconditions.put("acc_number", new Object[] {"=",acc_no});
    	
    	if(type==0)
    	{
    		amount = account.getAccBalance() + amount;
    	}
    	else if(type==1)
    	{
    		
    		amount = account.getAccBalance() - amount;
    	}
    	Map<String,Object> conditions = new HashMap<>();
    	
    	conditions.put("acc_balance",amount);
        QueryUtil query = QueryUtil.create()
                .update("account")
                .set(conditions)
                .where(whereconditions);

        return query.executeUpdate(conn, db) > 0;
    }
    
    
    public Account extractAccountDetails(JsonObject jsonRequest,HttpServletRequest request) throws SQLException, ServletException 
    {
    	if(!request.getSession(false).getAttribute("user_role").equals("CUSTOMER"))
    	account.setUserId(userQueryMap.getUserId(DbConnection.connect(), jsonRequest.get("username").getAsString()).getUser_id());
    	
        account.setAccType((AccountType.valueOf(jsonRequest.get("acc_type").getAsString().toUpperCase())).getValue());
        account.setAccStatus(Status.valueOf(jsonRequest.get("acc_status").getAsString().toUpperCase()).getValue());
        return account;
    }
}
