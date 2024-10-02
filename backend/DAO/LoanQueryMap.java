package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import javax.servlet.ServletException;

import com.google.gson.JsonObject;

import enums.LoanStatus;
import enums.LoanType;
import model.Loan;
import utility.DbConnection;
import utility.QueryUtil;

public class LoanQueryMap {

    private DbConnection db = new DbConnection();
    private Loan loan = new Loan();

    public boolean insertLoan(Connection conn, Loan loan) throws SQLException 
    {
        QueryUtil query = QueryUtil.create()
			                .insert("loan")
			                .columns("loan_type", "loan_amount", "loan_interest", "loan_duration", "loan_status", "loan_availed_date", "acc_number")
			                .values(loan.getLoan_type(), loan.getLoan_amount(), loan.getLoan_interest(),
			                		loan.getLoan_duration(), loan.getLoan_status(), loan.getLoan_availed_date(),
			                		loan.getAcc_no());

        return query.executeUpdate(conn, db) > 0;
    }

    
    public ResultSet selectAllLoans(Connection conn, TreeMap<String,Integer> pathMap) throws SQLException 
    {
        Map<String,Object[]> conditions = new HashMap<>();
    	
        for(String key: pathMap.keySet()) {
            conditions.put(changeName(key), new Object[] {"=", pathMap.get(key)});
        }

        QueryUtil query = QueryUtil.create("SELECT * FROM loan l INNER JOIN account a ON l.acc_number = a.acc_number ")
    			 				.where(conditions);

        return query.executeQuery(conn, db);
    }
    
    public String changeName(String key) 
    {
    	if (key.equals("branches")) 
    	{
    		return key.substring(0, key.length() - 2) + "_id";
    	}
    	else if(key.equals("accounts"))
    	{
    		return "a."+key.substring(0, key.length() - 1) + "_id";
    	}
    	return key.substring(0, key.length() - 1) + "_id";
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

    public List<Loan> applyFilters(List<Loan> loans, Map<String, String[]> parameterMap) 
    {
        return loans.stream()
                .filter(loan -> parameterMap.entrySet().stream()
                    .allMatch(entry -> {
                        String param = entry.getKey();
                        String[] values = entry.getValue();

                        switch (param) {
                            case "loan_id":
                                return loan.getLoan_id() == Integer.parseInt(values[0]);
                            case "loan_type":
                                return loan.getLoan_type() == Integer.parseInt(values[0]);
                            case "loan_amount":
                                return loan.getLoan_amount() == Double.parseDouble(values[0]);
                            case "loan_interest":
                                return loan.getLoan_interest() == Double.parseDouble(values[0]);
                            case "loan_duration":
                                return loan.getLoan_duration() == Integer.parseInt(values[0]);
                            case "loan_status":
                                return loan.getLoan_status() == Integer.parseInt(values[0]);
                            case "acc_number":
                                return loan.getAcc_no() == Integer.parseInt(values[0]);
                            default:
                                return true;
                        }
                    })
                ).collect(Collectors.toList());
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

        return query.executeUpdate(conn, db) > 0;
    }

    

    public Loan extractLoanDetails(JsonObject jsonRequest) throws SQLException, ServletException 
    {
        loan.setLoan_type(LoanType.valueOf(jsonRequest.get("loan_type").getAsString().toUpperCase()).getValue());
        loan.setLoan_amount(jsonRequest.get("loan_amount").getAsDouble());
        loan.setLoan_interest(jsonRequest.get("loan_interest").getAsDouble());
        loan.setLoan_duration(jsonRequest.get("loan_duration").getAsInt());
        loan.setLoan_status(LoanStatus.valueOf(jsonRequest.get("loan_status").getAsString().toUpperCase()).getValue());
        loan.setLoan_availed_date(java.sql.Date.valueOf(jsonRequest.get("loan_availed_date").getAsString()));
        loan.setAcc_no(jsonRequest.get("acc_number").getAsInt());
        return loan;
    }
}
