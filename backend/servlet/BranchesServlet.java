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
import DAO.BranchDAO;
import model.Branch;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

public class BranchesServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private BranchDAO branchQueryMap = new BranchDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
    	SessionHandler.doOptions(request,response);
    	
//        String branchId = request.getParameter("branch_id");
//        if (branchId != null) {
    		Branch branch = new Branch();
    		ResultSet rs;
            try (Connection conn = DbConnection.connect()) {
            	if( !ControllerServlet.pathMap.containsKey("branches"))
            	{
            		branch.setBank_id(ControllerServlet.pathMap.get("banks"));
            		rs = branchQueryMap.selectBranches(conn,branch);
            		
            	}
            	else
            	{
            		rs = branchQueryMap.selectBranchById(conn, ControllerServlet.pathMap.get("branches"));
            	}
            		
                JsonArray jsonArray = new JsonArray();
                while(rs.next())
                {
                	
                	JsonObject jsonResponse = new JsonObject();
                	jsonResponse.addProperty("branch_id", rs.getInt("branch_id"));
                	jsonResponse.addProperty("branch_name", rs.getString("branch_name"));
                	jsonResponse.addProperty("branch_address", rs.getString("branch_address"));
                	jsonResponse.addProperty("branch_number", rs.getInt("branch_number"));
                	jsonResponse.addProperty("bank_id", rs.getInt("bank_id"));
                	jsonResponse.addProperty("manager_id", rs.getInt("manager_id"));
                	jsonArray.add(jsonResponse);
                }
                    JsonHandler.sendJsonResponse(response, jsonArray);
               
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
    	branch.setBank_id(ControllerServlet.pathMap.get("banks"));  
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
        branch.setBank_id(ControllerServlet.pathMap.get("banks"));       
        branch.setBranch_id(ControllerServlet.pathMap.get("branches"));    
        branchQueryMap.extractBranchDetails(jsonRequest,branch);
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
    	

        try (Connection conn = DbConnection.connect()) 
        {
            if (branchQueryMap.deleteBranch(conn, ControllerServlet.pathMap.get("branches"))) 
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
