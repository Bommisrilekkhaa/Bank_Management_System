package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import DAO.BankDAO;
import model.Bank;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class BanksServlet extends HttpServlet 
{
    BankDAO bankQueryMap = new BankDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
//        int bankId = Integer.parseInt(request.getParameter("bank_id"));
    	 System.out.println("gett....");
        try (Connection conn = DbConnection.connect()) 
        {
            ResultSet rs = bankQueryMap.getBanks(conn,ControllerServlet.pathMap);
            JsonArray jsonArray = new JsonArray();
            
            while(rs.next()) 
            {
            	JsonObject jsonResponse = new JsonObject();
                jsonResponse.addProperty("bank_id", rs.getInt("bank_id"));
                jsonResponse.addProperty("bank_name", rs.getString("bank_name"));
                jsonResponse.addProperty("bank_code", rs.getString("bank_code"));
                jsonResponse.addProperty("admin_id", rs.getString("admin_id"));
                jsonResponse.addProperty("main_branch_id", rs.getInt("main_branch_id"));
                jsonArray.add(jsonResponse);
            }
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error fetching bank details: " + e.getMessage());
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);

        try (Connection conn = DbConnection.connect()) 
        {
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

        Bank bank = new Bank();
        bank.setBank_id(ControllerServlet.pathMap.get("banks"));
        bank.setBank_name(jsonRequest.get("bank_name").getAsString());
        bank.setBank_code(jsonRequest.get("bank_code").getAsString());
        bank.setAdmin_id(jsonRequest.get("admin_id").getAsInt());
        bank.setMain_branch_id(jsonRequest.get("main_branch_id").getAsInt());

        try (Connection conn = DbConnection.connect()) 
        {
            if (bankQueryMap.updateBank(conn, bank)) 
            {
                response.getWriter().write("Bank updated successfully");
            } 
            else 
            {
                response.getWriter().write("Error updating bank");
            }
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error updating bank: " + e.getMessage());
        }
    }
    
   
}
