package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;
import DAO.BranchQueryMap;
import model.Branch;
import utility.DbConnection;
import utility.JsonHandler;

@WebServlet("/BranchServlet")
public class BranchServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private BranchQueryMap branchQueryMap = new BranchQueryMap();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        String branchId = request.getParameter("branch_id");
        if (branchId != null) {
            try (Connection conn = DbConnection.connect()) {
                Branch branch = branchQueryMap.selectBranchById(conn, Integer.parseInt(branchId));
                if (branch != null) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("branch_id", branch.getBranch_id());
                    jsonResponse.addProperty("branch_name", branch.getName());
                    jsonResponse.addProperty("branch_address", branch.getAddress());
                    jsonResponse.addProperty("branch_number", branch.getBranch_no());
                    jsonResponse.addProperty("bank_id", branch.getBank_id());
                    jsonResponse.addProperty("is_main_branch", branch.getIs_main_branch());
                    jsonResponse.addProperty("manager_id", branch.getManager_id());

                    JsonHandler.sendJsonResponse(response, jsonResponse);
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
        } 
        else 
        {
            response.getWriter().write("Invalid branch ID");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        String action = request.getParameter("action");

        switch (action) {
            case "insert":
                insertBranch(request, response);
                break;
            case "update":
                updateBranch(request, response);
                break;
            case "delete":
                deleteBranch(request, response);
                break;
            default:
                response.getWriter().write("Invalid action");
                break;
        }
    }

    private void insertBranch(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
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

    private void updateBranch(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);

        Branch branch = new Branch();
        branch.setBranch_id(jsonRequest.get("branch_id").getAsInt());
        branch.setName(jsonRequest.get("branch_name").getAsString());
        branch.setAddress(jsonRequest.get("branch_address").getAsString());
        branch.setBranch_no(jsonRequest.get("branch_number").getAsString());
        branch.setBank_id(jsonRequest.get("bank_id").getAsInt());
        branch.setIs_main_branch(jsonRequest.get("is_main_branch").getAsBoolean());
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

    private void deleteBranch(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException 
    {
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
