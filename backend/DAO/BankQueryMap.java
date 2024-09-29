package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.JsonObject;

import model.Bank;
import utility.DbConnection;
import utility.Query_util;

public class BankQueryMap {

    private DbConnection db = new DbConnection();
    private Bank bank = new Bank();
    
    public Bank getBanks(Connection conn) throws SQLException 
    {
    	
        Query_util query = Query_util.create()
            .select("*")
            .from("banks");
        
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
            	System.out.println("Banks not found");
            }
        }
        return bank;
    }

    public Bank getBankById(Connection conn, int bankId) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("bank_id", new Object[] {"=",bankId});
    	
        
        Query_util query = Query_util.create()
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
        Query_util query = Query_util.create()
            .insert("banks")
            .columns("bank_name", "bank_code","admin_id","main_branch_id")
            .values(banks.getBank_name(), banks.getBank_code(),banks.getAdmin_id(),banks.getMain_branch_id());
        
       
        return query.executeUpdate(conn, db) > 0;
    }

  
    public boolean updateBank(Connection conn, Bank bank) throws SQLException 
    {
        Map<String, Object[]> whereConditions = new HashMap<>();
        whereConditions.put("bank_id", new Object[]{"=", bank.getBank_id()});

        Map<String, Object> setConditions = new HashMap<>();
        setConditions.put("bank_name", bank.getBank_name());
        setConditions.put("bank_code", bank.getBank_code());
        setConditions.put("admin_id", bank.getAdmin_id());
        setConditions.put("main_branch_id", bank.getMain_branch_id());

        Query_util query = Query_util.create()
                .update("bank") 
                .set(setConditions)
                .where(whereConditions);

        return query.executeUpdate(conn, db) > 0;
    }


    public Bank extractBankDetails(JsonObject jsonRequest) 
    {
        bank.setBank_name(jsonRequest.get("bank_name").getAsString());
        bank.setBank_code(jsonRequest.get("bank_code").getAsString());
        bank.setAdmin_id(jsonRequest.get("admin_id").getAsInt());
        bank.setMain_branch_id(jsonRequest.get("main_branch_id").getAsInt());
        
        return bank;
    }
}
