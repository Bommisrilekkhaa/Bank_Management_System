package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;

import com.google.gson.JsonObject;

import enums.TransactionStatus;
import enums.TransactionType;
import model.Transaction;
import utility.DbConnection;
import utility.QueryUtil;

public class TransactionDAO {

    private DbConnection db = new DbConnection();
    private Transaction transaction = new Transaction();

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
    
    public boolean updateBalance(int type,double amount) throws SQLException, ServletException
    {
    	AccountDAO accountQueryMap = new AccountDAO();
    	return accountQueryMap.updateBalance(DbConnection.connect(), type, amount, transaction.getAcc_number());
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

    public List<Transaction> convertResultSetToList(ResultSet rs) throws SQLException 
    {
        List<Transaction> transactionList = new ArrayList<>();
        
        while (rs.next()) 
        {
            Transaction transaction = new Transaction();
            transaction.setTransaction_id(rs.getInt("transaction_id"));
            transaction.setTransaction_datetime(rs.getTimestamp("transaction_datetime"));
            transaction.setTransaction_type(rs.getInt("transaction_type"));
            transaction.setTransaction_status(rs.getInt("transaction_status"));
            transaction.setTransaction_amount(rs.getDouble("transaction_amount"));
            transaction.setAcc_number(rs.getInt("acc_number"));
            transactionList.add(transaction);
        }
        return transactionList;
    }

    

    
    public Transaction extractTransactionDetails(JsonObject jsonRequest) throws SQLException, ServletException 
    {
    	transaction.setTransaction_datetime(new Timestamp(System.currentTimeMillis()));
        transaction.setTransaction_type(TransactionType.valueOf(jsonRequest.get("transaction_type").getAsString().toUpperCase()).getValue());
        transaction.setTransaction_amount(jsonRequest.get("transaction_amount").getAsDouble());
        transaction.setAcc_number(jsonRequest.get("acc_number").getAsInt());
        return transaction;
    }
}
