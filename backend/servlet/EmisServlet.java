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

import DAO.EmiQueryMap;
import model.Emi;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class EmisServlet extends HttpServlet {

    private EmiQueryMap emiQueryMap = new EmiQueryMap();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);

        try (Connection conn = DbConnection.connect()) {
            ResultSet rs = emiQueryMap.selectAllEmis(conn, ControllerServlet.pathMap);

            List<Emi> emis = emiQueryMap.convertResultSetToList(rs);
            
            Map<String, String[]> parameterMap = request.getParameterMap();
            List<Emi> filteredEmis = emiQueryMap.applyFilters(emis, parameterMap);

            JsonArray jsonArray = new JsonArray();
            if (!filteredEmis.isEmpty()) {
                for (Emi emi : filteredEmis) {
                    JsonObject emiJson = new JsonObject();
                    emiJson.addProperty("emi_id", emi.getEmi_id());
                    emiJson.addProperty("emi_number", emi.getEmi_number());
                    emiJson.addProperty("transaction_id", emi.getTransaction_id());
                    emiJson.addProperty("loan_id", emi.getLoan_id());
                    jsonArray.add(emiJson);
                }
            } else {
                JsonHandler.sendErrorResponse(response, "No matching EMIs found.");
                return;
            }

            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
        } catch (SQLException e) {
            response.getWriter().write("Error fetching EMI details: " + e.getMessage());
        }
    }
}
