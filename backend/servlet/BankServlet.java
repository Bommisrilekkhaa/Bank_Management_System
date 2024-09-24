package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.JsonObject;

import DAO.BankQueryMap;
import model.Bank;
import utility.DbConnection;
import utility.JsonHandler;

@SuppressWarnings("serial")
public class BankServlet extends HttpServlet 
{
    BankQueryMap bankQueryMap = new BankQueryMap();

    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        int bankId = Integer.parseInt(request.getParameter("bank_id"));

        try (Connection conn = DbConnection.connect()) 
        {
            Bank bank = bankQueryMap.getBankById(conn, bankId);
            
            JsonObject jsonResponse = new JsonObject();
            if (bank != null) 
            {
                jsonResponse.addProperty("bank_id", bank.getBank_id());
                jsonResponse.addProperty("bank_name", bank.getBank_name());
                jsonResponse.addProperty("bank_code", bank.getBank_code());
            }
            
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonResponse);
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error fetching bank details: " + e.getMessage());
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        String action = request.getParameter("action");

        try (Connection conn = DbConnection.connect()) 
        {
            switch (action) 
            {
                case "insert":
                	
                    JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
                    
                    Bank newBank = bankQueryMap.extractBankDetails(jsonRequest);

                    if (bankQueryMap.insertBank(conn, newBank)) 
                    {
                        response.getWriter().write("Bank inserted successfully");
                    } 
                    else 
                    {
                        response.getWriter().write("Error inserting bank");
                    }
                    break;

                case "delete":
                	
                    int bankId = Integer.parseInt(request.getParameter("bank_id"));
                    
                    if (bankQueryMap.deleteBank(conn, bankId)) 
                    {
                        response.getWriter().write("Bank deleted successfully");
                    } 
                    else 
                    {
                        response.getWriter().write("Error deleting bank");
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
