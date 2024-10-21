package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.JsonObject;

import model.Bank;
import utility.DbConnection;
import utility.QueryUtil;

public class BankDAO {

    private DbConnection db = new DbConnection();
    private Bank bank = new Bank();
    
    public ResultSet getBanks(Connection conn, HashMap<String, Integer> pathMap) throws SQLException 
    {
    	QueryUtil query;
    	if(pathMap.isEmpty())
    	{
    		
    		query = QueryUtil.create()
    				.select("*")
    				.from("banks");
    	}
    	else
    	{
    		 Map<String,Object[]> conditions = new HashMap<>();
    		 conditions.put("bank_id", new Object[] {"=", pathMap.get("banks")});
    		query = QueryUtil.create()
    				.select("*")
    				.from("banks")
    				.where(conditions);
    	}
        
       return query.executeQuery(conn, db);
        
    }

    public Bank getBankById(Connection conn, int bankId) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("bank_id", new Object[] {"=",bankId});
    	
        
        QueryUtil query = QueryUtil.create()
            .select("*")
            .from("banks")
            .where(conditions);
        
        try (ResultSet rs = query.executeQuery(conn, db)) 
        {
            if (rs.next()) 
            {
                bank.setBank_id(rs.getInt("bank_id"));
                bank.setBank_name(rs.getString("bank_name"));
                bank.setBank_code(rs.getString("bank_code"));
                bank.setAdmin_id(rs.getInt("admin_id"));
                bank.setMain_branch_id(rs.getInt("main_branch_id"));
            }
            else
            {
            	System.out.println("Bank not found");
            }
        }
        return bank;
    }

    public boolean insertBank(Connection conn,Bank banks) throws SQLException 
    {
//    	System.out.println(banks.getBank_name());
        QueryUtil query = QueryUtil.create()
            .insert("banks")
            .columns("bank_name", "bank_code","admin_id")
            .values(banks.getBank_name(), banks.getBank_code(),banks.getAdmin_id());
        
       
        return query.executeUpdate(conn, db) > 0;
    }

  
    public boolean updateBank(Connection conn, Bank bank) throws SQLException 
    {
        Map<String, Object[]> whereConditions = new HashMap<>();
        whereConditions.put("bank_id", new Object[]{"=", bank.getBank_id()});

        Map<String, Object> setConditions = new HashMap<>();
        setConditions.put("bank_name", bank.getBank_name());
        setConditions.put("admin_id", bank.getAdmin_id());
        setConditions.put("main_branch_id", bank.getMain_branch_id());

        QueryUtil query = QueryUtil.create()
                .update("banks") 
                .set(setConditions)
                .where(whereConditions);

        return query.executeUpdate(conn, db) > 0;
    }
    
   
    public Bank extractBankDetails(JsonObject jsonRequest) 
    {
        bank.setBank_name(jsonRequest.get("bank_name").getAsString());
        bank.setBank_code(jsonRequest.get("bank_code").getAsString());
        bank.setAdmin_id(jsonRequest.get("admin_id").getAsInt());
        if(jsonRequest.has("main_branch_id"))
        {
        	
        	bank.setMain_branch_id(jsonRequest.get("main_branch_id").getAsInt());
        }
        
        return bank;
    }
}
