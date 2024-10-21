package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import DAO.EmiDAO;
import DAO.LoanDAO;
import enums.LoanStatus;
import model.Emi;
import redis.clients.jedis.Jedis;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class EmisServlet extends HttpServlet {

    private EmiDAO emiQueryMap = new EmiDAO();
    private LoanDAO loanDao = new LoanDAO();
    Jedis jedis = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 
        
        jedis = ControllerServlet.pool.getResource();
        
//        String cachedData = null;
        String cachedData = jedis.get(cacheKey);
        
        if (cachedData != null) {

        	JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
            System.out.println("Data fetched from Redis cache");
        }
        else
        {
	        try (Connection conn = DbConnection.connect()) {
	        	Emi newemi = new Emi();
	        	newemi.setLoan_id(ControllerServlet.pathMap.get("loans"));
	        	if(checkLoanStatus(conn,newemi))
	        	{
	        		
	        		ResultSet rs = emiQueryMap.selectAllEmis(conn, ControllerServlet.pathMap);
	        		
	        		List<Emi> emis = emiQueryMap.convertResultSetToList(rs);
	        		
	        		JsonArray jsonArray = new JsonArray();
	        		if (!emis.isEmpty()) {
	        			for (Emi emi : emis) {
	        				JsonObject emiJson = new JsonObject();
	        				emiJson.addProperty("emi_id", emi.getEmi_id());
	        				emiJson.addProperty("emi_number", emi.getEmi_number());
	        				emiJson.addProperty("transaction_id", emi.getTransaction_id());
	        				emiJson.addProperty("actual_paid_date",""+emi.getTransaction_datetime());
	        				emiJson.addProperty("loan_availed_date", ""+emi.getLoan_availed_date());
	        				emiJson.addProperty("loan_duration", emi.getLoan_duration());
	        				emiJson.addProperty("loan_id", emi.getLoan_id());
	        				jsonArray.add(emiJson);
	        			}
	        		} else {
	        			JsonHandler.sendErrorResponse(response, "No matching EMIs found.");
	        			return;
	        		}
	        		jedis.set(cacheKey, jsonArray.toString()); 
	        		response.setContentType("application/json");
	        		JsonHandler.sendJsonResponse(response, jsonArray);
	        	}
	        } catch (SQLException e) {
	        	JsonHandler.sendErrorResponse(response,"Error fetching EMI details: " + e.getMessage());
	        }
	        finally {
	        	jedis.close();
	        }
        }
    }
    private boolean checkLoanStatus(Connection conn,Emi emi) throws SQLException
    {

        HashMap<String, Integer> loanmap = new HashMap<>();
        loanmap.put("loans",emi.getLoan_id());
        loanmap.put("l.loan_status", LoanStatus.APPROVED.getValue());
        ResultSet rs = loanDao.selectAllLoans(conn, loanmap);
        return rs.next();
    	
    }
}
