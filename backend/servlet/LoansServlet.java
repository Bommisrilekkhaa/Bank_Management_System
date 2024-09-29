//package servlet;
//
//import java.io.IOException;
//import java.sql.Connection;
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import java.util.List;
//import java.util.Map;
//
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import com.google.gson.JsonObject;
//
//import DAO.LoanQueryMap;
//import model.Loan;
//import utility.DbConnection;
//import utility.JsonHandler;
//
//@SuppressWarnings("serial")
//public class LoansServlet extends HttpServlet 
////{
////    LoanQueryMap loanQueryMap = new LoanQueryMap();
////
////    @Override
////    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
////    {
//////        try (Connection conn = DbConnection.connect()) 
//////        {
//////            ResultSet rs = loanQueryMap.selectAllLoans(conn);
//////
//////            List<Loan> loans = loanQueryMap.convertResultSetToList(rs);
//////            Map<String, String[]> parameterMap = request.getParameterMap();
//////            List<Loan> filteredLoans = loanQueryMap.applyFilters(loans, parameterMap);
//////
//////            JsonObject jsonResponse = new JsonObject();
//////            if (!filteredLoans.isEmpty()) 
//////            {
//////                for (Loan loan : filteredLoans) 
//////                {
//////                    JsonObject loanJson = new JsonObject();
//////                    loanJson.addProperty("loan_id", loan.getLoan_id());
//////                    loanJson.addProperty("loan_type", loan.getLoan_type());
//////                    loanJson.addProperty("loan_amount", loan.getLoan_amount());
//////                    loanJson.addProperty("loan_interest", loan.getLoan_interest());
//////                    loanJson.addProperty("loan_duration", loan.getLoan_duration());
//////                    loanJson.addProperty("loan_status", loan.getLoan_status());
//////                    loanJson.addProperty("loan_availed_date", loan.getLoan_availed_date().toString());
//////                    loanJson.addProperty("user_id", loan.getUser_id());
//////                    loanJson.addProperty("acc_no", loan.getAcc_no());
//////                    jsonResponse.add(String.valueOf(loan.getLoan_id()), loanJson);
//////                }
//////            } 
//////            else 
//////            {
//////                JsonHandler.sendErrorResponse(response, "No matching loans found.");
//////                return;
//////            }
//////
//////            response.setContentType("application/json");
//////            JsonHandler.sendJsonResponse(response, jsonResponse);
//////        } 
//////        catch (SQLException e) 
//////        {
//////            response.getWriter().write("Error fetching loan details: " + e.getMessage());
////        }
////    }
////
////    @Override
////    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
////    {
////        try (Connection conn = DbConnection.connect()) 
////        {
////            JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
////
////            Loan newLoan = loanQueryMap.extractLoanDetails(jsonRequest);
////
////            if (loanQueryMap.insertLoan(conn, newLoan)) 
////            {
////                response.getWriter().write("Loan inserted successfully");
////            } 
////            else 
////            {
////                response.getWriter().write("Error inserting loan");
////            }
////        } 
////        catch (SQLException e) 
////        {
////            response.getWriter().write("Error processing request: " + e.getMessage());
////        }
////    }
////
////    @Override
////    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
////    {
////        try (Connection conn = DbConnection.connect()) 
////        {
////            String loanId = request.getParameter("loan_id");
////
////            if (loanQueryMap.deleteLoan(conn, Integer.parseInt(loanId))) 
////            {
////                response.getWriter().write("Loan deleted successfully");
////            } 
////            else 
////            {
////                response.getWriter().write("Error deleting loan");
////            }
////        } 
////        catch (SQLException e) 
////        {
////            response.getWriter().write("Error deleting loan: " + e.getMessage());
////        }
////    }
//}
