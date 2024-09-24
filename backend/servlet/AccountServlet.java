package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.JsonObject;

import DAO.AccountQueryMap;
import model.Account;
import utility.DbConnection;
import utility.JsonHandler;

@SuppressWarnings("serial")
public class AccountServlet extends HttpServlet 
{
    AccountQueryMap accountQueryMap = new AccountQueryMap();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {

    	try (Connection conn = DbConnection.connect()) 
        {
            ResultSet rs = accountQueryMap.selectAllAccounts(conn);
            
            List<Account> accounts = accountQueryMap.convertResultSetToList(rs);
            Map<String, String[]> parameterMap = request.getParameterMap();
            List<Account> filteredAccounts = accountQueryMap.applyFilters(accounts, parameterMap);

            JsonObject jsonResponse = new JsonObject();
            if (!filteredAccounts.isEmpty()) 
            {
                for (Account account : filteredAccounts) 
                {
                    JsonObject accountJson = new JsonObject();
                    accountJson.addProperty("acc_no", account.getAccNo());
                    accountJson.addProperty("acc_type", account.getAccType());
                    accountJson.addProperty("acc_balance", account.getAccBalance());
                    accountJson.addProperty("acc_status", account.getAccStatus());
                    accountJson.addProperty("user_id", account.getUserId());
                    accountJson.addProperty("branch_id", account.getBranchId());
                    jsonResponse.add(account.getAccNo(), accountJson);
                }
            } 
            else 
            {
                JsonHandler.sendErrorResponse(response, "No matching accounts found.");
                return;
            }

            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonResponse);
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error fetching account details: " + e.getMessage());
        }

    }
    
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        String action = request.getParameter("action");

        try (Connection conn = DbConnection.connect()) 
        {
            switch (action) 
            {
                case "insert":
                    JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
                    
                    Account newAccount = accountQueryMap.extractAccountDetails(jsonRequest);

                    if (accountQueryMap.insertAccount(conn, newAccount)) 
                    {
                        response.getWriter().write("Account inserted successfully");
                    } 
                    else 
                    {
                        response.getWriter().write("Error inserting account");
                    }
                    break;

                case "delete":
                	
                    String accNo = request.getParameter("acc_no");

                    if (accountQueryMap.deleteAccount(conn, accNo)) 
                    {
                        response.getWriter().write("Account deleted successfully");
                    } 
                    else 
                    {
                        response.getWriter().write("Error deleting account");
                    }
                    break;

                default:
                    response.getWriter().write("Invalid action");
                    break;
            }
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error processing request: " + e.getMessage());
        }
    }
}
