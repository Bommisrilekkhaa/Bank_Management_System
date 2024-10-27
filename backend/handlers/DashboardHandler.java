package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import DAO.AccountDAO;
import DAO.BranchDAO;
import enums.LoanType;
import enums.TransactionType;
import enums.UserRole;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;

public class DashboardHandler  {
	private Logger logger=LoggerConfig.initializeLogger(); 
    private AccountDAO accountDAO = new AccountDAO();
    private BranchDAO branchDAO = new BranchDAO();
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();

    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        String role = (String) request.getSession(false).getAttribute("user_role");
        
        logger.info("Dashboard request initiated for role: " + role);
        ResultSet resultSet=null;
        try{
        	conn = dbUtil.connect();
            JsonArray jsonArray = new JsonArray();
            
            if (role.equals(UserRole.CUSTOMER.toString())) {
                logger.info("Fetching account and loan details for customer.");
//                System.out.println( ControllerServlet.pathMap.toString());
                resultSet = accountDAO.accountsAndLoans(conn, ControllerServlet.pathMap);
                
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
//                System.out.println( ControllerServlet.pathMap.toString());
                resultSet = branchDAO.selectBranchAndAccounts(conn, ControllerServlet.pathMap);
                
                if (resultSet.next()) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("branchName", resultSet.getString("branchName"));
                    jsonResponse.addProperty("branch_id", resultSet.getString("branch_id"));
                    jsonResponse.addProperty("manager_id", resultSet.getString("manager_id"));
                    jsonResponse.addProperty("savingsAccountCount", resultSet.getInt("savingsAccountCount"));
                    jsonResponse.addProperty("businessAccountCount", resultSet.getInt("businessAccountCount"));
                    jsonResponse.addProperty("totalSavingsDeposits", resultSet.getInt("totalSavingsDeposits"));
                    jsonResponse.addProperty("totalBusinessDeposits", resultSet.getInt("totalBusinessDeposits"));
                    jsonResponse.addProperty("homeLoanCount", resultSet.getInt("homeLoanCount"));
                    jsonResponse.addProperty("educationLoanCount", resultSet.getInt("educationLoanCount"));
                    jsonResponse.addProperty("businessLoanCount", resultSet.getInt("businessLoanCount"));
                    jsonArray.add(jsonResponse);
                }

            } else if (role.equals(UserRole.ADMIN.toString())) {
                logger.info("Fetching branches and account details for admin.");
                
                ControllerServlet.pathMap.remove("users");
//                System.out.println( ControllerServlet.pathMap.toString());
                resultSet = branchDAO.selectBranchesAndAccounts(conn, ControllerServlet.pathMap);
                
                while (resultSet.next()) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("branchName", resultSet.getString("branchName"));
                    jsonResponse.addProperty("manager_id", resultSet.getString("manager_id"));
                    jsonResponse.addProperty("accountCount", resultSet.getInt("accountCount"));
                    jsonResponse.addProperty("totalDeposits", resultSet.getInt("totalDeposits"));
                    jsonResponse.addProperty("loansAvailed", resultSet.getInt("loansAvailed"));
                    jsonArray.add(jsonResponse);
                }
            }

            JsonUtil.sendJsonResponse(response, jsonArray);
            logger.info("Dashboard data sent successfully.");

        }
        finally {
        	dbUtil.close(conn, null, resultSet);
        }
    }
}
