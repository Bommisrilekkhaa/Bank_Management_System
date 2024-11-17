package DAO;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import enums.LoanStatus;
import enums.Resources;
import enums.TransactionType;
import handlers.LoansHandler;
import model.Loan;
import model.Transaction;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.QueryUtil;

public class LoanDAO {

	public final static int itemsPerPage = 8;
	private DbUtil dbUtil = new DbUtil();

	public boolean insertLoan(Connection conn, Loan loan) throws SQLException {
		QueryUtil query = QueryUtil.create()
				.insert("loan")
				.columns("loan_type", "loan_amount", "loan_interest", "loan_duration", "loan_status",
						"loan_availed_date", "acc_number")
				.values(loan.getLoan_type(), loan.getLoan_amount(), loan.getLoan_interest(),
						loan.getLoan_duration(), loan.getLoan_status(), loan.getLoan_availed_date(),
						loan.getAcc_no());

		return query.executeUpdate(conn, dbUtil) > 0;
	}

	public boolean isLoanExists(Loan loan) throws ServletException, SQLException {
		Map<String, Object[]> conditions = new HashMap<>();

		conditions.put("acc_number", new Object[] { "=", loan.getAcc_no() });
		conditions.put("loan_status", new Object[] { "!=", LoanStatus.REJECTED.getValue() });
		conditions.put("loan_status", new Object[] { "!=", LoanStatus.CLOSED.getValue() });
		QueryUtil query = QueryUtil.create()
				.select("*")
				.from("loan")
				.where(conditions);
		ResultSet rs = null;
		try {
			rs = query.executeQuery(dbUtil.connect(), dbUtil);
			return rs.next();
		} finally {
			dbUtil.close(null, null, rs);
		}

	}

	public ResultSet selectPageWise(Connection conn, HashMap<String, Integer> pathMap, String searchParam)
			throws SQLException {
		Map<String, Object[]> conditions = new HashMap<>();

		for (String key : pathMap.keySet()) {
			conditions.put(changeName(key), new Object[] { "=", pathMap.get(key) });
		}
		String searchQuery = "";
		if (searchParam != null) {
			conditions.put("l.acc_number", new Object[] { "=", Integer.valueOf(searchParam) });
		}

		QueryUtil query = QueryUtil.create()
				.select("*")
				.from("loan l")
				.join("account a", "l.acc_number = a.acc_number", "INNER")
				.join("branch b", "a.branch_id = b.branch_id", "INNER")
				.where(conditions)
				.append(searchQuery)
				.orderBy("l.loan_id", "DESC");
		if (LoansHandler.offset != -1) {
			query.limitOffset(itemsPerPage, LoansHandler.offset);
		}

		return query.executeQuery(conn, dbUtil);
	}

	public ResultSet selectAllLoans(Connection conn, HashMap<String, Integer> pathMap) throws SQLException {
		Map<String, Object[]> conditions = new HashMap<>();

		for (String key : pathMap.keySet()) {
			conditions.put(changeName(key), new Object[] { "=", pathMap.get(key) });
		}

		QueryUtil query = QueryUtil.create()
				.select("*")
				.from("loan l")
				.join("account a", "l.acc_number = a.acc_number", "INNER")
				.join("branch b", "a.branch_id = b.branch_id", "INNER")
				.where(conditions);

		return query.executeQuery(conn, dbUtil);
	}

	public String changeName(String key) {
		if (key.equals(Resources.BRANCHES.toString().toLowerCase())) {
			return "a." + key.substring(0, key.length() - 2) + "_id";
		} else if (key.equals(Resources.ACCOUNTS.toString().toLowerCase())) {
			return "a." + key.substring(0, 3) + "_number";
		} else if (key.equals(Resources.LOANS.toString().toLowerCase())) {
			return "l." + key.substring(0, key.length() - 1) + "_id";
		} else if (key.equals("user_id")) {
			return "a." + key;
		} else if (key.equals(Resources.BANKS.toString().toLowerCase())) {

			return "b." + key.substring(0, key.length() - 1) + "_id";
		}
		return key;
	}

	public int totalLoans(Connection conn, HashMap<String, Integer> pathMap, String searchParam) throws SQLException {

		Map<String, Object[]> conditions = new HashMap<>();

		for (String key : pathMap.keySet()) {
			conditions.put(changeName(key), new Object[] { "=", pathMap.get(key) });
		}
		String searchQuery = "";
		if (searchParam != null) {
			conditions.put("l.acc_number", new Object[] { "=", Integer.valueOf(searchParam) });
		}

		QueryUtil query = QueryUtil.create()
				.select("COUNT(l.loan_id) AS TotalLoans")
				.from("loan l")
				.join("account a", "l.acc_number = a.acc_number", "INNER")
				.join("branch b", "a.branch_id = b.branch_id", "INNER")
				.where(conditions)
				.append(searchQuery);

		ResultSet rs = null;
		try {
			rs = query.executeQuery(conn, new DbUtil());
			if (rs.next()) {
				return rs.getInt("TotalLoans");
			}

		} finally {
			dbUtil.close(null, null, rs);
		}
		return -1;
	}

	public boolean updateLoan(Connection conn, Loan loan) throws SQLException {
		Map<String, Object[]> whereconditions = new HashMap<>();
		whereconditions.put("loan_id", new Object[] { "=", loan.getLoan_id() });

		Map<String, Object> conditions = new HashMap<>();
		conditions.put("loan_type", loan.getLoan_type());
		conditions.put("loan_amount", loan.getLoan_amount());
		conditions.put("loan_duration", loan.getLoan_duration());
		conditions.put("loan_status", loan.getLoan_status());
		if (loan.getLoan_status() != LoanStatus.REJECTED.getValue()
				&& loan.getLoan_status() != LoanStatus.CLOSED.getValue()) {
			conditions.put("loan_availed_date", loan.getLoan_availed_date());
		}
		conditions.put("acc_number", loan.getAcc_no());

		QueryUtil query = QueryUtil.create()
				.update("loan")
				.set(conditions)
				.where(whereconditions);

		return query.executeUpdate(conn, dbUtil) > 0;
	}

	public boolean checkLoans(int accNo) throws ServletException, SQLException {
		Map<String, Object[]> whereconditions = new HashMap<>();
		whereconditions.put("acc_number", new Object[] { "=", accNo });

		QueryUtil query = QueryUtil.create()
				.select("*")
				.from("loan")
				.where(whereconditions);
		ResultSet rs = null;
		try {
			rs = query.executeQuery(dbUtil.connect(), dbUtil);
			return rs.next();
		} finally {
			dbUtil.close(null, null, rs);
		}
	}
	
	public boolean preclosure(Connection conn,Loan loan) throws SQLException
	{
		BigDecimal amount = null;
         Map<String, Object[]> conditions = new HashMap<>();
         conditions.put("l.loan_id", new Object[]{"=", loan.getLoan_id()}); 

         QueryUtil queryUtil = QueryUtil.create()
             .select("l.loan_amount - COALESCE(SUM(t.transaction_amount), 0) AS remaining_balance")
             .from("loan l") 
             .join("emi e", "l.loan_id = e.loan_id", "LEFT") 
             .join("transaction t", "e.transaction_id=t.transaction_id", "LEFT")
             .where(conditions)
             .append("GROUP BY l.loan_id, l.loan_amount;");

         ResultSet rs = null;
         try{
        	 rs = queryUtil.executeQuery(conn, dbUtil);
        	 if(rs.next())
        	 {
        		 amount = rs.getBigDecimal("remaining_balance");
        	 }
         }
         finally {
        	 dbUtil.close(null, null, rs);
         }

         Transaction transaction = new Transaction();
         transaction.setAcc_number(loan.getAcc_no());
         transaction.setTransaction_amount(amount);
         transaction.setTransaction_datetime(new java.sql.Timestamp(System.currentTimeMillis()));
         transaction.setTransaction_type(TransactionType.EMI.getValue());
         TransactionDAO transactionDAO = new TransactionDAO();
         AccountDAO accountDAO = new AccountDAO();
         if(accountDAO.updateBalance(conn,transaction.getTransaction_type(), amount, transaction.getAcc_number()))
         {
        	 
        	 if(transactionDAO.insertTransaction(conn, transaction)) {
        		 String[] cacheKeys = new String[] { "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/accounts",
        	                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/accounts_*",
        	                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/accounts/" + ControllerServlet.pathMap.get(Resources.ACCOUNTS.toString().toLowerCase()) ,
        	                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/transactions",
        	                "/banks/" +  ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase())+ "*/transactions_*"};
        		 Jedis jedis = ControllerServlet.pool.getResource();   
        		 JsonUtil.deleteCache(jedis, cacheKeys);
        		 return true;
        	 }
        	
         }
         return false;  
	}

}
