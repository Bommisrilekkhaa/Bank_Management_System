package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import enums.Resources;
import handlers.BranchesHandler;
import model.Account;
import model.Branch;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.QueryUtil;

public class BranchDAO {

	public final static int itemsPerPage = 8;
	private DbUtil dbUtil = new DbUtil();

	public boolean insertBranch(Connection conn, Branch branch) throws SQLException {
		QueryUtil query = QueryUtil.create()
				.insert("branch")
				.columns("branch_name", "branch_address", "bank_id", "manager_id")
				.values(branch.getName(), branch.getAddress(), branch.getBank_id(),
						branch.getManager_id());

		return query.executeUpdate(conn, dbUtil) > 0;
	}

	public ResultSet selectBranches(Connection conn, int bankId, String searchParam) throws SQLException {
		Map<String, Object[]> conditions = new HashMap<>();
		conditions.put("bank_id", new Object[] { "=", bankId });

		String searchQuery = "";
		if (searchParam != null) {
			searchQuery = "AND (b.branch_name ILIKE '" + searchParam + "%' OR u.username ILIKE '" + searchParam + "%')";
		}
		QueryUtil query = QueryUtil.create()
				.select("*")
				.from("branch b")
				.join("users u", "u.user_id = b.manager_id", "INNER")
				.where(conditions)
				.append(searchQuery)
				.orderBy("branch_id", "DESC");
		if (BranchesHandler.offset != -1) {
			query.limitOffset(itemsPerPage, BranchesHandler.offset);

		}

		return query.executeQuery(conn, dbUtil);
	}

	public ResultSet selectBranchById(Connection conn, int branchId) throws SQLException {
		Map<String, Object[]> conditions = new HashMap<>();
		conditions.put("branch_id", new Object[] { "=", branchId });

		QueryUtil query = QueryUtil.create()
				.select("*")
				.from("branch")
				.where(conditions);

		return query.executeQuery(conn, dbUtil);
	}

	public ResultSet selectBranchByManager(Connection conn, int managerId) throws SQLException {
		Map<String, Object[]> conditions = new HashMap<>();
		conditions.put("manager_id", new Object[] { "=", managerId });

		QueryUtil query = QueryUtil.create()
				.select("*")
				.from("branch")
				.where(conditions);

		return query.executeQuery(conn, dbUtil);
	}

	public ResultSet selectBranchesAndAccounts(Connection conn, HashMap<String, Integer> pathMap) throws SQLException {
		Map<String, Object[]> conditions = new HashMap<>();
		for (String key : pathMap.keySet()) {
			conditions.put(changeName(key), new Object[] { "=", pathMap.get(key) });
		}

		QueryUtil query = QueryUtil.create()
				.select("b.branch_name AS branchName, COUNT(a.acc_number) AS accountCount, "
						+ "SUM(a.acc_balance) AS totalDeposits, COUNT(l.loan_id) AS loansAvailed,b.manager_id")
				.from("branch b")
				.join("account a", "b.branch_id = a.branch_id", "LEFT")
				.join("loan l", "l.acc_number = a.acc_number", "LEFT")
				.where(conditions)
				.append("GROUP BY b.branch_id, b.branch_name");

		return query.executeQuery(conn, dbUtil);
	}

	public ResultSet selectBranchAndAccounts(Connection conn, HashMap<String, Integer> pathMap) throws SQLException {
		Map<String, Object[]> conditions = new HashMap<>();
		for (String key : pathMap.keySet()) {
			conditions.put(changeName(key), new Object[] { "=", pathMap.get(key) });
		}

		QueryUtil query = QueryUtil.create()
				.select("b.branch_name AS branchName, " +
						"b.branch_id AS branch_id, " +
						"b.manager_id AS manager_id, " +
						"COUNT(CASE WHEN a.acc_type = 1 THEN a.acc_number END) AS savingsAccountCount, " +
						"COUNT(CASE WHEN a.acc_type = 0 THEN a.acc_number END) AS businessAccountCount, " +
						"SUM(CASE WHEN a.acc_type = 1 THEN a.acc_balance ELSE 0 END) AS totalSavingsDeposits, " +
						"SUM(CASE WHEN a.acc_type = 0 THEN a.acc_balance ELSE 0 END) AS totalBusinessDeposits, " +
						"COUNT(CASE WHEN l.loan_type = 0 THEN l.loan_id END) AS homeLoanCount, " +
						"COUNT(CASE WHEN l.loan_type = 1 THEN l.loan_id END) AS educationLoanCount, " +
						"COUNT(CASE WHEN l.loan_type = 2 THEN l.loan_id END) AS businessLoanCount")
				.from("branch b")
				.join("account a", "b.branch_id = a.branch_id", "LEFT")
				.join("loan l", "l.acc_number = a.acc_number", "LEFT")
				.where(conditions)
				.append("GROUP BY b.branch_id, b.branch_name");
		return query.executeQuery(conn, dbUtil);

	}

	public String changeName(String key) {
		// System.out.println(key);
		if (key.equals(Resources.BRANCHES.toString().toLowerCase())) {
			return "b." + key.substring(0, key.length() - 2) + "_id";
		} else if (key.equals(Resources.ACCOUNTS.toString().toLowerCase())) {
			return "a." + key.substring(0, 3) + "_number";
		} else if (key.equals(Resources.BANKS.toString().toLowerCase())) {

			return "b." + key.substring(0, key.length() - 1) + "_id";
		} else if (key.equals("users")) {

			return "a." + key.substring(0, key.length() - 1) + "_id";
		} else
			return key;
	}

	public int totalBranches(Connection conn, HashMap<String, Integer> pathMap, String searchParam)
			throws SQLException {

		Map<String, Object[]> conditions = new HashMap<>();
		conditions.put("bank_id", new Object[] { "=", pathMap.get(Resources.BANKS.toString().toLowerCase()) });
		String searchQuery = "";
		if (searchParam != null) {
			searchQuery = "AND (b.branch_name ILIKE '" + searchParam + "%' OR u.username ILIKE '" + searchParam + "%')";
		}
		QueryUtil query = QueryUtil.create()
				.select("COUNT(b.branch_id) AS TotalBranches")
				.from("branch b")
				.join("users u", "u.user_id = b.manager_id", "INNER")
				.where(conditions)
				.append(searchQuery);
		ResultSet rs = null;
		try {
			rs = query.executeQuery(conn, new DbUtil());
			if (rs.next()) {
				return rs.getInt("TotalBranches");
			}

		} finally {
			dbUtil.close(null, null, rs);
		}
		return -1;
	}

	public int getBranchId(Connection conn, String branch_name) throws SQLException {
		Map<String, Object[]> conditions = new HashMap<>();
		conditions.put("branch_name", new Object[] { "=", branch_name });

		QueryUtil query = QueryUtil.create()
				.select("*")
				.from("branch")
				.where(conditions);
		ResultSet rs = null;
		try {
			rs = query.executeQuery(conn, dbUtil);
			if (rs.next()) {

				return rs.getInt("branch_id");
			}
		} finally {
			dbUtil.close(null, null, rs);
		}
		return -1;
	}

	public boolean updateBranch(Connection conn, Branch branch) throws SQLException {
		Map<String, Object[]> whereconditions = new HashMap<>();
		Map<String, Object> setconditions = new HashMap<>();
		setconditions.put("branch_name", branch.getName());
		setconditions.put("branch_address", branch.getAddress());
		setconditions.put("manager_id", branch.getManager_id());
		whereconditions.put("branch_id", new Object[] { "=", branch.getBranch_id() });

		QueryUtil query = QueryUtil.create()
				.update("branch")
				.set(setconditions)
				.where(whereconditions);

		return query.executeUpdate(conn, dbUtil) > 0;
	}

	public boolean deleteBranch(Connection conn, int branchId) throws SQLException {
		moveAccounts(conn, branchId);
		Map<String, Object[]> conditions = new HashMap<>();
		conditions.put("branch_id", new Object[] { "=", branchId });

		QueryUtil query = QueryUtil.create()
				.deleteFrom("branch")
				.where(conditions);

		return query.executeUpdate(conn, dbUtil) > 0;
	}

	private void moveAccounts(Connection conn, int branchId) throws SQLException {
		BankDAO bankDAO = new BankDAO();
		HashMap<String, Integer> branchMap = new HashMap<>();
		HashMap<String, Integer> bankMap = new HashMap<>();
		branchMap.put(Resources.BRANCHES.toString().toLowerCase(), branchId);
		bankMap.put(Resources.BANKS.toString().toLowerCase(), ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()));
		AccountDAO accountDAO = new AccountDAO();
		ResultSet rs = null;
		ResultSet rsBank = null;
		try {
			rs = accountDAO.selectAllAccounts(conn, branchMap);
			rsBank = bankDAO.getBanks(conn, bankMap);
			List<Account> accounts = JsonUtil.convertResultSetToList(rs, Account.class);

			if (!accounts.isEmpty()) {
				for (Account account : accounts) {
					if (rsBank.next()) {
						account.setBranchId(rsBank.getInt("main_branch_id"));
					}

					accountDAO.updateAccount(conn, account);
				}
			}
		} finally {
			dbUtil.close(null, null, rsBank);
			dbUtil.close(null, null, rs);
		}

	}

}
