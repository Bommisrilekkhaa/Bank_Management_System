package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

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
import utility.LoggerConfig;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class EmisServlet extends HttpServlet {

    private Logger logger = LoggerConfig.initializeLogger();
    private EmiDAO emiQueryMap = new EmiDAO();
    private LoanDAO loanDao = new LoanDAO();
    private Jedis jedis;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);

        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));
        
        logger.info("EmisServlet doGet called with path: " + path);
        
        jedis = ControllerServlet.pool.getResource();
        String cachedData = jedis.get(cacheKey);
        
        if (cachedData != null) {
            logger.info("Cache hit for key: " + cacheKey);
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
            logger.info("Data fetched from Redis cache and sent as response.");
        } else {
            logger.info("Cache miss for key: " + cacheKey + ". Fetching data from database.");
            try (Connection conn = DbConnection.connect()) {
                Emi newEmi = new Emi();
                newEmi.setLoan_id(ControllerServlet.pathMap.get("loans"));

                if (checkLoanStatus(conn, newEmi)) {
                    logger.info("Loan status is approved. Fetching EMI details.");
                    
                    ResultSet rs = emiQueryMap.selectAllEmis(conn, ControllerServlet.pathMap);
                    List<Emi> emis = emiQueryMap.convertResultSetToList(rs);
                    
                    JsonArray jsonArray = new JsonArray();
                    if (!emis.isEmpty()) {
                        for (Emi emi : emis) {
                            JsonObject emiJson = new JsonObject();
                            emiJson.addProperty("emi_id", emi.getEmi_id());
                            emiJson.addProperty("emi_number", emi.getEmi_number());
                            emiJson.addProperty("transaction_id", emi.getTransaction_id());
                            emiJson.addProperty("actual_paid_date", "" + emi.getTransaction_datetime());
                            emiJson.addProperty("loan_availed_date", "" + emi.getLoan_availed_date());
                            emiJson.addProperty("loan_duration", emi.getLoan_duration());
                            emiJson.addProperty("loan_id", emi.getLoan_id());
                            jsonArray.add(emiJson);
                        }

                        jedis.set(cacheKey, jsonArray.toString());
                        logger.info("EMI data cached with key: " + cacheKey);
                        
                        response.setContentType("application/json");
                        JsonHandler.sendJsonResponse(response, jsonArray);
                        logger.info("EMI data sent as response.");
                    } else {
                        logger.info("No matching EMIs found for loan ID: " + newEmi.getLoan_id());
                        JsonHandler.sendErrorResponse(response, "No matching EMIs found.");
                    }
                } else {
                    logger.warning("Loan ID: " + newEmi.getLoan_id() + " is not in approved status.");
                    JsonHandler.sendErrorResponse(response, "Loan status is not approved.");
                }
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching EMI details", e);
                JsonHandler.sendErrorResponse(response, "Error fetching EMI details: " + e.getMessage());
            } finally {
                if (jedis != null) {
                    jedis.close();
                    logger.info("Jedis connection closed.");
                }
            }
        }
    }

    private boolean checkLoanStatus(Connection conn, Emi emi) throws SQLException {
        HashMap<String, Integer> loanMap = new HashMap<>();
        loanMap.put("loans", emi.getLoan_id());
        loanMap.put("l.loan_status", LoanStatus.APPROVED.getValue());
        
        logger.info("Checking loan status for loan ID: " + emi.getLoan_id());
        ResultSet rs = loanDao.selectAllLoans(conn, loanMap);
        boolean isApproved = rs.next();
        
        logger.info("Loan ID: " + emi.getLoan_id() + " is approved: " + isApproved);
        return isApproved;
    }
}
