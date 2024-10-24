package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import com.google.gson.JsonObject;

import enums.LoanStatus;
import enums.LoanType;
import model.Loan;
import utility.DbUtil;
import utility.QueryUtil;

public class LoanDAO {

    private DbUtil dbUtil = new DbUtil();
    private Loan loan = new Loan();

    public boolean insertLoan(Connection conn, Loan loan) throws SQLException 
    {
        QueryUtil query = QueryUtil.create()
			                .insert("loan")
			                .columns("loan_type", "loan_amount", "loan_interest", "loan_duration", "loan_status", "loan_availed_date", "acc_number")
			                .values(loan.getLoan_type(), loan.getLoan_amount(), loan.getLoan_interest(),
			                		loan.getLoan_duration(), loan.getLoan_status(), loan.getLoan_availed_date(),
			                		loan.getAcc_no());

        return query.executeUpdate(conn, dbUtil) > 0;
    }
    
    public boolean isLoanExists() throws ServletException
    {
    	 Map<String,Object[]> conditions = new HashMap<>();
     	
        conditions.put("acc_number", new Object[] {"=", loan.getAcc_no()});
        conditions.put("loan_status", new Object[] {"=", LoanStatus.APPROVED.getValue()});
         
    	 QueryUtil query = QueryUtil.create()
    			 .select("*")
    			 .from("loan")
    			 .where(conditions);
    	 ResultSet rs=null;
		try {
			rs = query.executeQuery(dbUtil.connect(),dbUtil);
			return rs.next();
		} catch (SQLException | ServletException e) {
			e.printStackTrace();
		} 
		finally {
			dbUtil.close(null, null, rs);
		}
		return false;
    	 
    	 
    }

    
    public ResultSet selectAllLoans(Connection conn, HashMap<String, Integer> pathMap) throws SQLException 
    {
        Map<String,Object[]> conditions = new HashMap<>();
    	
        for(String key: pathMap.keySet()) {
            conditions.put(changeName(key), new Object[] {"=", pathMap.get(key)});
        }
        
        QueryUtil query = QueryUtil.create()
						        .select("*")
						        .from("loan l")
						        .join("account a", "l.acc_number = a.acc_number", "INNER")
						        .join("branch b", "a.branch_id = b.branch_id", "INNER")
						        .where(conditions);

        return query.executeQuery(conn, dbUtil);
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
    	else if(key.equals("loans"))
    	{
    		return "l."+key.substring(0, key.length() - 1) + "_id";
    	}
    	else if(key.equals("user_id"))
    	{
    		return "a."+key;
    	}
    	else if(key.equals("banks"))
    	{
    		
    		return "b."+key.substring(0, key.length() - 1) + "_id";
    	}
    	return key;
    }

    public List<Loan> convertResultSetToList(ResultSet rs) throws SQLException 
    {
        List<Loan> loanList = new ArrayList<>();
        
        while (rs.next()) 
        {
            Loan loan = new Loan();
            loan.setLoan_id(rs.getInt("loan_id"));
            loan.setLoan_type(rs.getInt("loan_type"));
            loan.setLoan_amount(rs.getDouble("loan_amount"));
            loan.setLoan_interest(rs.getDouble("loan_interest"));
            loan.setLoan_duration(rs.getInt("loan_duration"));
            loan.setLoan_status(rs.getInt("loan_status"));
            loan.setLoan_availed_date(rs.getDate("loan_availed_date"));
            loan.setAcc_no(rs.getInt("acc_number"));
            loanList.add(loan);
        }
        return loanList;
    }

   
    public boolean updateLoan(Connection conn, Loan loan) throws SQLException 
    {
    	Map<String,Object[]> whereconditions = new HashMap<>();
    	whereconditions.put("loan_id", new Object[] {"=", loan.getLoan_id()});
    	
    	Map<String,Object> conditions = new HashMap<>();
    	conditions.put("loan_type", loan.getLoan_type());
    	conditions.put("loan_amount", loan.getLoan_amount());
    	conditions.put("loan_interest", loan.getLoan_interest());
    	conditions.put("loan_duration", loan.getLoan_duration());
    	conditions.put("loan_status", loan.getLoan_status());
    	conditions.put("loan_availed_date", loan.getLoan_availed_date());
    	conditions.put("acc_number", loan.getAcc_no());
    	
        QueryUtil query = QueryUtil.create()
                .update("loan")
                .set(conditions)
                .where(whereconditions);

        return query.executeUpdate(conn,dbUtil) > 0;
    }

    private boolean checkLoans(int accNo) throws ServletException
    {
    	Map<String,Object[]> whereconditions = new HashMap<>();
    	whereconditions.put("acc_number", new Object[] {"=", accNo});
    	
    	
    	QueryUtil query = QueryUtil.create()
    						.select("*")
    						.from("loan")
    						.where(whereconditions);
    	ResultSet rs=null;
		try {
			rs = query.executeQuery( dbUtil.connect(), dbUtil);
			return rs.next();
		} catch (SQLException | ServletException e) {
			e.printStackTrace();
		}
		finally {
			dbUtil.close(null, null, rs);
		}
		return false;
    }
    	

    						
    

    public Loan extractLoanDetails(JsonObject jsonRequest,HttpServletRequest request) throws SQLException, ServletException 
    {
        loan.setLoan_type(LoanType.valueOf(jsonRequest.get("loan_type").getAsString().toUpperCase()).getValue());
        loan.setLoan_amount(jsonRequest.get("loan_amount").getAsDouble());
        loan.setLoan_duration(Integer.valueOf(jsonRequest.get("loan_duration").getAsString().substring(0,2)));
        if(!jsonRequest.has("loan_status"))
        {
        	loan.setLoan_status(LoanStatus.PENDING.getValue());

        }
        else
        {
        	if(jsonRequest.get("loan_status").getAsString().equals(""))
        	{
        		loan.setLoan_status(LoanStatus.PENDING.getValue());
        	}
        	else
        	{
        		
        		loan.setLoan_status(LoanStatus.valueOf(jsonRequest.get("loan_status").getAsString().toUpperCase()).getValue());
        	}
        }
        if(request.getMethod()!="PUT")
        {
        	
        	if(checkLoans(loan.getAcc_no()))
        	{
        		loan.setLoan_interest(11.0);
        	}
        	else
        	{
        		
        		loan.setLoan_interest(15.0);
        	}
        }
        
        
        if(loan.getLoan_status() < 2)
        	loan.setLoan_availed_date(new java.sql.Date(System.currentTimeMillis()));
        	
        return loan;
    }
}
