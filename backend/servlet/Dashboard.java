package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import DAO.AccountDAO;
import DAO.BranchDAO;
import enums.LoanType;
import enums.TransactionType;
import enums.UserRole;
import utility.DbConnection;
import utility.JsonHandler;
import utility.LoggerConfig;

public class Dashboard extends HttpServlet {
    private static final long serialVersionUID = 1L;
	private Logger logger=LoggerConfig.initializeLogger(); 
    private AccountDAO accountDAO = new AccountDAO();
    private BranchDAO branchDAO = new BranchDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String role = (String) request.getSession(false).getAttribute("user_role");
        
        logger.info("Dashboard request initiated for role: " + role);

        try (Connection conn = DbConnection.connect()) {
            JsonArray jsonArray = new JsonArray();
            
            if (role.equals(UserRole.CUSTOMER.toString())) {
                logger.info("Fetching account and loan details for customer.");
                
                ResultSet resultSet = accountDAO.accountsAndLoans(conn, ControllerServlet.pathMap);
                
                while (resultSet.next()) {
                    JsonObject accountJson = new JsonObject();
                    accountJson.addProperty("acc_no", resultSet.getInt("accountNumber"));
                    accountJson.addProperty("acc_balance", resultSet.getDouble("accountBalance"));
                    
                    if (resultSet.getString("loanId") != null) {
                        JsonObject loanJson = new JsonObject();
                        loanJson.addProperty("loan_id", resultSet.getInt("loanId"));
                        loanJson.addProperty("loan_type", "" + LoanType.valueOf(resultSet.getInt("loanType")));
                        loanJson.addProperty("loan_amount", resultSet.getDouble("loanAmount"));
                        loanJson.addProperty("loan_duration", resultSet.getInt("loanDuration"));
                        loanJson.addProperty("loan_interest", resultSet.getInt("loanInterest"));
                        loanJson.addProperty("loan_availed_date", resultSet.getDate("loanAvailedDate").toString());
                        accountJson.add("loan_details", loanJson);
                    }

                    JsonArray transactionsArray = new JsonArray();
                    while (resultSet.next() && resultSet.getInt("accountNumber") == accountJson.get("acc_no").getAsInt()) {
                        JsonObject transactionJson = new JsonObject();
                        transactionJson.addProperty("transaction_id", resultSet.getInt("transactionId"));
                        transactionJson.addProperty("transaction_datetime", resultSet.getTimestamp("transactionDateTime").toString());
                        transactionJson.addProperty("transaction_type", "" + TransactionType.valueOf(resultSet.getInt("transactionType")));
                        transactionsArray.add(transactionJson);
                    }

                    accountJson.add("transactions", transactionsArray);
                    jsonArray.add(accountJson);
                }

            } else if (role.equals(UserRole.MANAGER.toString())) {
                logger.info("Fetching branch and account details for manager.");

                ControllerServlet.pathMap.put("b.manager_id", ControllerServlet.pathMap.get("users"));
                ControllerServlet.pathMap.remove("users");
                
                ResultSet rs = branchDAO.selectBranchAndAccounts(conn, ControllerServlet.pathMap);
                
                if (rs.next()) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("branchName", rs.getString("branchName"));
                    jsonResponse.addProperty("branch_id", rs.getString("branch_id"));
                    jsonResponse.addProperty("manager_id", rs.getString("manager_id"));
                    jsonResponse.addProperty("savingsAccountCount", rs.getInt("savingsAccountCount"));
                    jsonResponse.addProperty("businessAccountCount", rs.getInt("businessAccountCount"));
                    jsonResponse.addProperty("totalSavingsDeposits", rs.getInt("totalSavingsDeposits"));
                    jsonResponse.addProperty("totalBusinessDeposits", rs.getInt("totalBusinessDeposits"));
                    jsonResponse.addProperty("homeLoanCount", rs.getInt("homeLoanCount"));
                    jsonResponse.addProperty("educationLoanCount", rs.getInt("educationLoanCount"));
                    jsonResponse.addProperty("businessLoanCount", rs.getInt("businessLoanCount"));
                    jsonArray.add(jsonResponse);
                }

            } else if (role.equals(UserRole.ADMIN.toString())) {
                logger.info("Fetching branches and account details for admin.");
                
                ControllerServlet.pathMap.remove("users");
                ResultSet rs = branchDAO.selectBranchesAndAccounts(conn, ControllerServlet.pathMap);
                
                while (rs.next()) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("branchName", rs.getString("branchName"));
                    jsonResponse.addProperty("manager_id", rs.getString("manager_id"));
                    jsonResponse.addProperty("accountCount", rs.getInt("accountCount"));
                    jsonResponse.addProperty("totalDeposits", rs.getInt("totalDeposits"));
                    jsonResponse.addProperty("loansAvailed", rs.getInt("loansAvailed"));
                    jsonArray.add(jsonResponse);
                }
            }

            JsonHandler.sendJsonResponse(response, jsonArray);
            logger.info("Dashboard data sent successfully.");

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error fetching dashboard data", e);
            JsonHandler.sendErrorResponse(response, "Error fetching dashboard data: " + e.getMessage());
        }
    }
}
