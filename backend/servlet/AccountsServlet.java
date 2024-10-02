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

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import DAO.AccountQueryMap;
import DAO.BranchQueryMap;
import DAO.UserQueryMap;
import enums.AccountType;
import enums.Status;
import model.Account;
import model.User;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class AccountsServlet extends HttpServlet 
{
    private AccountQueryMap accountQueryMap = new AccountQueryMap();
    private UserQueryMap userQueryMap = new UserQueryMap();
    private BranchQueryMap branchQueryMap = new BranchQueryMap();
    
    

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
    	

    	try (Connection conn = DbConnection.connect()) 
        {
            ResultSet rs = accountQueryMap.selectAllAccounts(conn,ControllerServlet.pathMap);
            
            List<Account> accounts = accountQueryMap.convertResultSetToList(rs);
            Map<String, String[]> parameterMap = request.getParameterMap();
           
            List<Account> filteredAccounts = accountQueryMap.applyFilters(accounts, parameterMap);

            JsonArray jsonArray = new JsonArray();
            if (!filteredAccounts.isEmpty()) 
            {
                for (Account account : filteredAccounts) 
                {
                    JsonObject accountJson = new JsonObject();
                    accountJson.addProperty("acc_no", account.getAccNo());
                    accountJson.addProperty("acc_type",(""+AccountType.valueOf(account.getAccType())).toLowerCase());	
                    accountJson.addProperty("acc_balance", account.getAccBalance());
                    accountJson.addProperty("acc_status", ((""+Status.valueOf(account.getAccStatus())).toLowerCase()));
                    User user = userQueryMap.getUsername(conn, account.getUserId());
                    accountJson.addProperty("user_fullname", user.getFullname());
                    accountJson.addProperty("username", user.getUsername());
                    accountJson.addProperty("branch_name", branchQueryMap.selectBranchById(conn, account.getBranchId()).getName());
                    jsonArray.add(accountJson);
                }
            } 
            else 
            {
                JsonHandler.sendErrorResponse(response, "No matching accounts found.");
                return;
            }

            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error fetching account details: " + e.getMessage());
        }

    }
    
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);

        try (Connection conn = DbConnection.connect()) 
        {
                    JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
                    Account newAccount = accountQueryMap.extractAccountDetails(jsonRequest);
                    newAccount.setBranchId(ControllerServlet.pathMap.get("branches"));

                    if (accountQueryMap.insertAccount(conn, newAccount)) 
                    {
                        response.getWriter().write("Account inserted successfully");
                    } 
                    else 
                    {
                        response.getWriter().write("Error inserting account");
                    }
              
            
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error processing request: " + e.getMessage());
        }
    }
    
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {  
    	SessionHandler.doOptions(request,response);
    	
    	JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);


    	
        try (Connection conn = DbConnection.connect()) 
        {
        	Account newAccount = accountQueryMap.extractAccountDetails(jsonRequest);
        	newAccount.setBranchId(ControllerServlet.pathMap.get("branches"));
        	newAccount.setAccNo(ControllerServlet.pathMap.get(ControllerServlet.pathMap.lastKey()));        	
            if (accountQueryMap.updateAccount(conn, newAccount)) 
            {
                response.getWriter().write("Account updated successfully");
            } 
            else 
            {
                response.getWriter().write("Error updating Account");
            }
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error updating account: " + e.getMessage());
        }
    }
    

}
