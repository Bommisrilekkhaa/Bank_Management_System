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

import DAO.LoanDAO;
import enums.LoanStatus;
import enums.LoanType;
import model.Loan;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class LoansServlet extends HttpServlet 
{
    private LoanDAO loanQueryMap = new LoanDAO();
    

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request, response);
        if(request.getSession(false).getAttribute("user_role").equals("CUSTOMER"))
    	{
    		ControllerServlet.pathMap.put("user_id",(Integer) request.getSession(false).getAttribute("user_id"));
    	}
        try (Connection conn = DbConnection.connect()) 
        {
            ResultSet rs = loanQueryMap.selectAllLoans(conn, ControllerServlet.pathMap);
            
            List<Loan> loans = loanQueryMap.convertResultSetToList(rs);
            Map<String, String[]> parameterMap = request.getParameterMap();
           
            List<Loan> filteredLoans = loanQueryMap.applyFilters(loans, parameterMap);

            JsonArray jsonArray = new JsonArray();
            if (!filteredLoans.isEmpty()) 
            {
                for (Loan loan : filteredLoans) 
                {
                    JsonObject loanJson = new JsonObject();
                    loanJson.addProperty("loan_id", loan.getLoan_id());
                    loanJson.addProperty("loan_type", (""+LoanType.valueOf(loan.getLoan_type())).toLowerCase());
                    loanJson.addProperty("loan_amount", loan.getLoan_amount());
                    loanJson.addProperty("loan_interest", loan.getLoan_interest());
                    loanJson.addProperty("loan_duration", loan.getLoan_duration());
                    loanJson.addProperty("loan_status", ((""+LoanStatus.valueOf(loan.getLoan_status())).toLowerCase()));
                    loanJson.addProperty("loan_availed_date", loan.getLoan_availed_date().toString());
                    
                    // You can add account details if needed
                    loanJson.addProperty("acc_number", loan.getAcc_no());

                    jsonArray.add(loanJson);
                }
            } 
            else 
            {
                JsonHandler.sendSuccessResponse(response, "No matching loans found.");
                return;
            }

            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error fetching loan details: " + e.getMessage());
        }
    }
    
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request, response);

        try (Connection conn = DbConnection.connect()) 
        {
            JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
            Loan newLoan = loanQueryMap.extractLoanDetails(jsonRequest,request);
            newLoan.setAcc_no(ControllerServlet.pathMap.get("accounts"));
            
            if(!loanQueryMap.isLoanExists())
            {
            	
            	if (loanQueryMap.insertLoan(conn, newLoan)) 
            	{
            		response.getWriter().write("Loan inserted successfully");
            	} 
            	else 
            	{
            		response.getWriter().write("Error inserting loan");
            	}
            }
            else
            {
            	response.getWriter().write("Loan already Exists");
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
        SessionHandler.doOptions(request, response);
        
        JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);

        try (Connection conn = DbConnection.connect()) 
        {
            Loan updatedLoan = loanQueryMap.extractLoanDetails(jsonRequest,request);
            updatedLoan.setAcc_no(ControllerServlet.pathMap.get("accounts"));
            updatedLoan.setLoan_id(ControllerServlet.pathMap.get("loans"));

            if (loanQueryMap.updateLoan(conn, updatedLoan)) 
            {
                response.getWriter().write("Loan updated successfully");
            } 
            else 
            {
                response.getWriter().write("Error updating loan");
            }
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error updating loan: " + e.getMessage());
        }
    }
}
