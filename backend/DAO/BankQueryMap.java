package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.google.gson.JsonObject;

import model.Bank;
import utility.DbConnection;
import utility.Query_util;

public class BankQueryMap {

    private DbConnection db = new DbConnection();
    private Bank bank = new Bank();

    public Bank getBankById(Connection conn, int bankId) throws SQLException 
    {
        
        Query_util query = Query_util.create()
            .select("*")
            .from("banks")
            .where("bank_id", "=", bankId);
        
        try (ResultSet rs = query.executeQuery(conn, db)) 
        {
            if (rs.next()) 
            {
                bank.setBank_id(rs.getInt("bank_id"));
                bank.setBank_name(rs.getString("bank_name"));
                bank.setBank_code(rs.getString("bank_code"));
                bank.setAdmin_id(rs.getInt("admin_id"));
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
            .columns("bank_name", "bank_code","admin_id")
            .values(banks.getBank_name(), banks.getBank_code(),banks.getAdmin_id());
        
       
        return query.executeUpdate(conn, db) > 0;
    }

    public boolean deleteBank(Connection conn, int bankId) throws SQLException 
    {
        Query_util query = Query_util.create()
            .deleteFrom("banks")
            .where("bank_id", "=", bankId);
        
        return query.executeUpdate(conn, db) > 0;
    }

   

    public Bank extractBankDetails(JsonObject jsonRequest) 
    {
        bank.setBank_name(jsonRequest.get("bank_name").getAsString());
        bank.setBank_code(jsonRequest.get("bank_code").getAsString());
        bank.setAdmin_id(jsonRequest.get("admin_id").getAsInt());
        
        return bank;
    }
}
