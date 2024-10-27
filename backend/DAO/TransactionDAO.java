package DAO;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;


import enums.TransactionStatus;
import model.Transaction;
import utility.DbUtil;
import utility.QueryUtil;

public class TransactionDAO {

    private DbUtil db = new DbUtil();

    public boolean insertTransaction(Connection conn, Transaction transaction) throws SQLException 
    {
        QueryUtil query = QueryUtil.create()
			                .insert("transaction")
			                .columns("transaction_datetime", "transaction_type", "transaction_status", "transaction_amount", "acc_number")
			                .values(transaction.getTransaction_datetime(), transaction.getTransaction_type(),
			                        TransactionStatus.SUCCESS.getValue(), transaction.getTransaction_amount(),
			                        transaction.getAcc_number());

        return query.executeUpdate(conn, db) > 0;
    }
    
    public boolean updateBalance(int type,BigDecimal amount,int acc_number) throws SQLException, ServletException
    {
    	AccountDAO accountDAO = new AccountDAO();
    	return accountDAO.updateBalance(db.connect(), type, amount, acc_number);
    }

    public ResultSet selectAllTransactions(Connection conn, HashMap<String, Integer> pathMap) throws SQLException 
    {
        Map<String,Object[]> conditions = new HashMap<>();
    	
        for(String key: pathMap.keySet()) {
            conditions.put(changeName(key), new Object[] {"=", pathMap.get(key)});
        }

        QueryUtil query = QueryUtil.create()
        		.select("*")
        		.from("transaction t")
        		.join("account a", "t.acc_number = a.acc_number", "INNER")
        		.join("branch b", "a.branch_id = b.branch_id", "INNER")
    			.where(conditions);

        return query.executeQuery(conn, db);
    }

    public String changeName(String key) 
    {
    	if (key.equals("branches")) 
    	{
    		return "a."+key.substring(0, key.length() - 2) + "_id";
    	}
    	else if(key.equals("accounts"))
    	{
    		return "a."+key.substring(0, 3) + "_number";
    	}
    	else if(key.equals("transactions"))
    	{
    		return "t."+key.substring(0, key.length() - 1) + "_id";
    	}
    	else if(key.equals("user_id"))
    	{
    		return "a."+key;
    	}
    	return "b."+key.substring(0, key.length() - 1) + "_id";
    }

   
    public ResultSet lastTransaction(Connection conn, HashMap<String, Integer> pathMap) throws SQLException 
    {
        Map<String,Object[]> conditions = new HashMap<>();
    	
        conditions.put("acc_number", new Object[] {"=", pathMap.get("accounts")});
        

        QueryUtil query = QueryUtil.create()
        		.select("MAX(transaction_id) AS transactionId")
        		.from("transaction")
    			.where(conditions);

        return query.executeQuery(conn, db);
    }
    
   
}
