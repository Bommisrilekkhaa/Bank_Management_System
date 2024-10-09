package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import DAO.EmiDAO;
import model.Emi;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class EmisServlet extends HttpServlet {

    private EmiDAO emiQueryMap = new EmiDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);

        try (Connection conn = DbConnection.connect()) {
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
                JsonHandler.sendSuccessResponse(response, "No matching EMIs found.");
                return;
            }

            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
        } catch (SQLException e) {
            response.getWriter().write("Error fetching EMI details: " + e.getMessage());
        }
    }
}
