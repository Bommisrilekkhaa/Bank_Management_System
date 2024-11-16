package DAO;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import enums.Status;
import enums.TransactionType;
import handlers.AccountsHandler;
import model.Account;
import utility.DbUtil;
import utility.QueryUtil;

public class AccountDAO {
	
	public final static int itemsPerPage = 8;
    private DbUtil dbUtil = new DbUtil();
    private Account account = new Account();

    public boolean insertAccount(Connection conn, Account account) throws SQLException 
    {
        QueryUtil query = QueryUtil.create()
			                .insert("account")
			                .columns("acc_type", "acc_balance", "acc_status", "user_id", "branch_id")
			                .values( account.getAccType(), 0, account.getAccStatus(),
			                		account.getUserId(), account.getBranchId());

        return query.executeUpdate(conn, dbUtil) > 0;
    }
    
    public boolean checkAccount(Account account) throws  ServletException, SQLException
    {
    	
    	Map<String,Object[]> conditions = new HashMap<>();
    	
    	conditions.put("branch_id", new Object[] {"=",account.getBranchId()});
    	conditions.put("user_id", new Object[] {"=",account.getUserId()});
    	conditions.put("acc_type", new Object[] {"=",account.getAccType()});
    	QueryUtil query = QueryUtil.create()
    			.select("*")
    			.from("account")
    			.where(conditions);
    	ResultSet rs = query.executeQuery(dbUtil.connect(), dbUtil);
		return rs.next();
		
    }
    public ResultSet selectPageWise(Connection conn,HashMap<String, Integer> pathMap,String searchParam) throws SQLException 
    {
    	UserDAO userDAO = new UserDAO();
    	Map<String,Object[]> conditions = new HashMap<>();
    	
    	for(String key:pathMap.keySet()) {
    		conditions.put(changeName(key), new Object[] {"=",pathMap.get(key)});
    	}
    	if(searchParam!=null)
    	{
    		List<Integer> userId = userDAO.getUserId(conn,searchParam);

    		conditions.put("a.user_id", new Object[] {"IN",userId});
    		
    	}
    	
    	 QueryUtil query = QueryUtil.create()
    			 					.select("*")
    			 					.from("branch b")
    			 					.join("account a","b.branch_id=a.branch_id", "INNER")
    			 					.where(conditions)
    			 					.orderBy("a.acc_number", "DESC");
    	 if(AccountsHandler.offset!=-1)
    	 {
    		 query.limitOffset(itemsPerPage, AccountsHandler.offset);	 
    	 }
        return query.executeQuery(conn, new DbUtil());
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
        return query.executeQuery(conn, new DbUtil());
    }
    
    public int totalAccounts(Connection conn,HashMap<String, Integer> pathMap,String searchParam) throws SQLException
    {
    	UserDAO userDAO = new UserDAO();

    	Map<String,Object[]> conditions = new HashMap<>();
    	
    	for(String key:pathMap.keySet()) {
    		conditions.put(changeName(key), new Object[] {"=",pathMap.get(key)});
    	}
    	if(searchParam!=null)
    	{
    		List<Integer> userId = userDAO.getUserId(conn,searchParam);

    		conditions.put("a.user_id", new Object[] {"IN",userId});
    		
    	}
    	
    	 QueryUtil query = QueryUtil.create()
    			 					.select("COUNT(a.acc_number) AS TotalAccounts")
    			 					.from("branch b")
    			 					.join("account a","b.branch_id=a.branch_id", "INNER")
    			 					.where(conditions);
        ResultSet rs = null;
        try{
        	rs = query.executeQuery(conn, new DbUtil());
        	if(rs.next())
        	{
        		return rs.getInt("TotalAccounts");
        	}
        	
        }
        finally {
        	dbUtil.close(null, null, rs);
        }
        return -1;
    }
    
    public String changeName(String key)
    {
//    	System.out.println(key);
    	if(key.equals("branches"))
    	{
    		return "a."+key.substring(0,key.length()-2)+"_id";
    	}
    	else if(key.equals("users"))
    	{
    		return "a."+key.substring(0,key.length()-1)+"_id";
    	}
    	else if(key.equals("accounts"))
    	{
    		return "a."+key.substring(0,3)+"_number";
    	}
    	else if(key.equals("banks"))
    	{
    		
    		return "b."+key.substring(0,key.length()-1)+"_id";
    	}
    	else
    		return key;
    }
    
   
   
   public ResultSet accountsAndLoans(Connection conn,HashMap<String, Integer> pathMap) throws SQLException
   {
		Map<String,Object[]> conditions = new HashMap<>();
		for(String key:pathMap.keySet()) {
    		conditions.put(changeName(key), new Object[] {"=",pathMap.get(key)});
    	}
	   
	   QueryUtil query = QueryUtil.create()
			   .select("a.acc_number AS accountNumber, "
					   + "a.acc_balance AS accountBalance, "
					   + "l.loan_id AS loanId, "
					   + "l.loan_type AS loanType, "
					   + "l.loan_amount AS loanAmount, "
					   + "l.loan_duration AS loanDuration, "
					   + "l.loan_availed_date AS loanAvailedDate, "
					   +"l.loan_interest AS loanInterest, "
					   + "t.transaction_id AS transactionId, "
					   + "t.transaction_datetime AS transactionDateTime, "
					   + "t.transaction_type AS transactionType ")
			   .from("account a")
			   .join("branch b", "b.branch_id=a.branch_id", "INNER")
			   .join("loan l", "a.acc_number = l.acc_number","LEFT")
			   .join("transaction t", "a.acc_number = t.acc_number","LEFT")
			   .where(conditions)
			   .orderBy("a.acc_number, l.loan_id, t.transaction_id", "ASC");
	   return query.executeQuery(conn, new DbUtil());
	   
   }
   
   
   
    public boolean updateAccount(Connection conn, Account account) throws SQLException 
    {
    	Map<String,Object[]> whereconditions = new HashMap<>();
    	whereconditions.put("acc_number", new Object[] {"=",account.getAccNo()});
    	
    	Map<String,Object> conditions = new HashMap<>();
    	if(account.getAccStatus() == Status.INACTIVE.getValue())
    	{
    		if(!updateBalance(conn,TransactionType.DEBIT.getValue(),BigDecimal.valueOf(1000.0),account.getAccNo()))
    		{
    			return false;
    		}
    	}
    	conditions.put("acc_type",account.getAccType());
    	conditions.put("acc_status", account.getAccStatus());
    	conditions.put("branch_id", account.getBranchId());
    	
        QueryUtil query = QueryUtil.create()
                .update("account")
                .set(conditions)
                .where(whereconditions);

        return query.executeUpdate(conn, dbUtil) > 0;
    }
    
    

    public boolean updateBalance(Connection conn, int type,BigDecimal amount,int acc_no) throws SQLException
    {
    	HashMap<String, Integer> pathMap = new HashMap<>();
    	pathMap.put("accounts", acc_no);
    	ResultSet rs=null;
		try {
			rs = selectAllAccounts(conn,pathMap);
			if(rs.next())
			{
				account.setAccBalance(rs.getBigDecimal("acc_balance"));
			}
		}
		finally {
			dbUtil.close(null, null, rs);
		}
    	Map<String,Object[]> whereconditions = new HashMap<>();
    	whereconditions.put("acc_number", new Object[] {"=",acc_no});
    	
    	if(type==TransactionType.CREDIT.getValue())
    	{
    		amount = account.getAccBalance().add(amount);
    	}
    	else if(type==TransactionType.DEBIT.getValue())
    	{
    		if(account.getAccBalance().compareTo(amount) >=0)
    		{
    			amount = account.getAccBalance().subtract(amount);
    		}
    		else
    		{
    			return false;
    		}
    	}
    	
    	Map<String,Object> conditions = new HashMap<>();
    	
    	conditions.put("acc_balance",amount);
        QueryUtil query = QueryUtil.create()
                .update("account")
                .set(conditions)
                .where(whereconditions);

        return query.executeUpdate(conn, dbUtil) > 0;
    }
    
   
}
