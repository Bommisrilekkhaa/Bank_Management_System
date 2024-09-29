package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import DAO.BranchQueryMap;
import model.Branch;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

public class BranchServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private BranchQueryMap branchQueryMap = new BranchQueryMap();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
    	
//        String branchId = request.getParameter("branch_id");
//        if (branchId != null) {
            try (Connection conn = DbConnection.connect()) {
                Branch branch = branchQueryMap.selectBranches(conn);
                JsonArray jsonArray = new JsonArray();
                if (branch != null) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("branch_id", branch.getBranch_id());
                    jsonResponse.addProperty("branch_name", branch.getName());
                    jsonResponse.addProperty("branch_address", branch.getAddress());
                    jsonResponse.addProperty("branch_number", branch.getBranch_number());
                    jsonResponse.addProperty("bank_id", branch.getBank_id());
                    jsonResponse.addProperty("manager_id", branch.getManager_id());
                    jsonArray.add(jsonResponse);
                    JsonHandler.sendJsonResponse(response, jsonArray);
                } 
                else 
                {
                	
                    response.getWriter().write("Branch not found");
                }
            } 
            catch (SQLException e) 
            {
                response.getWriter().write("Error fetching branch: " + e.getMessage());
            }
//        } 
//        else 
//        {
//            response.getWriter().write("Invalid branch ID");
//        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
       
    	JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
    	
    	Branch branch = new Branch();
    	
    	branchQueryMap.extractBranchDetails(jsonRequest,branch);
    	
    	
    	try (Connection conn = DbConnection.connect()) 
    	{
    		if (branchQueryMap.insertBranch(conn, branch)) 
    		{
    			response.getWriter().write("Branch inserted successfully");
    		} 
    		else 
    		{
    			response.getWriter().write("Error inserting branch");
    		}
    	} 
    	catch (SQLException e) {
    		response.getWriter().write("Error inserting branch: " + e.getMessage());
    	}
    }

    

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {  
    	SessionHandler.doOptions(request,response);
    	
    	JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);

        Branch branch = new Branch();
        branch.setBranch_id(jsonRequest.get("branch_id").getAsInt());
        branch.setName(jsonRequest.get("branch_name").getAsString());
        branch.setAddress(jsonRequest.get("branch_address").getAsString());
        branch.setBranch_number(jsonRequest.get("branch_number").getAsString());
        branch.setBank_id(jsonRequest.get("bank_id").getAsInt());
        branch.setManager_id(jsonRequest.get("manager_id").getAsInt());

        try (Connection conn = DbConnection.connect()) 
        {
            if (branchQueryMap.updateBranch(conn, branch)) 
            {
                response.getWriter().write("Branch updated successfully");
            } 
            else 
            {
                response.getWriter().write("Error updating branch");
            }
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error updating branch: " + e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	
    	SessionHandler.doOptions(request,response);
    	
        String branchId = request.getParameter("branch_id");

        try (Connection conn = DbConnection.connect()) 
        {
            if (branchQueryMap.deleteBranch(conn, Integer.parseInt(branchId))) 
            {
                response.getWriter().write("Branch deleted successfully");
            } 
            else 
            {
                response.getWriter().write("Error deleting branch");
            }
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error deleting branch: " + e.getMessage());
        }
    }
}
