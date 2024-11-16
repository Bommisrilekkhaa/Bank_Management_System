package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import handlers.BanksHandler;
import model.Bank;
import utility.DbUtil;
import utility.QueryUtil;

public class BankDAO {

	public final static int itemsPerPage = 8;
    private DbUtil dbUtil = new DbUtil();
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
        
       return query.executeQuery(conn, dbUtil);
        
    }
    
    public ResultSet selectPageWise(Connection conn) throws SQLException 
    {
    	QueryUtil query = QueryUtil.create()
    				.select("*")
    				.from("banks")
					.orderBy("bank_id", "DESC");
    	
	if(BanksHandler.offset!=-1)
	{
		query.limitOffset(itemsPerPage, BanksHandler.offset);	 
	}
        
       return query.executeQuery(conn, dbUtil);
        
    }
    
    public int totalBanks(Connection conn) throws SQLException
    {
    	QueryUtil query = QueryUtil.create()
				.select("COUNT(bank_id) AS TotalBanks")
				.from("banks");
    	
        ResultSet rs = null;
        try{
        	rs = query.executeQuery(conn, new DbUtil());
        	if(rs.next())
        	{
        		return rs.getInt("TotalBanks");
        	}
        	
        }
        finally {
        	dbUtil.close(null, null, rs);
        }
        return -1;
    }

    public Bank getBankById(Connection conn, int bankId) throws SQLException 
    {
    	Map<String,Object[]> conditions = new HashMap<>();
    	conditions.put("bank_id", new Object[] {"=",bankId});
    	
        
        QueryUtil query = QueryUtil.create()
            .select("*")
            .from("banks")
            .where(conditions);
        ResultSet rs=null;
        try 
        {
        	rs = query.executeQuery(conn, dbUtil);
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
        finally {
        	dbUtil.close(null, null, rs);
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
        
       
        return query.executeUpdate(conn, dbUtil) > 0;
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

        return query.executeUpdate(conn, dbUtil) > 0;
    }
    
   
    
}
