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

import DAO.TransactionQueryMap;
import enums.TransactionStatus;
import enums.TransactionType;
import model.Transaction;
import utility.DbConnection;
import utility.JsonHandler;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class TransactionsServlet extends HttpServlet {
    
    private TransactionQueryMap transactionQueryMap = new TransactionQueryMap();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request, response);

        try (Connection conn = DbConnection.connect()) 
        {
            ResultSet rs = transactionQueryMap.selectAllTransactions(conn, ControllerServlet.pathMap);
            List<Transaction> transactions = transactionQueryMap.convertResultSetToList(rs);
            Map<String, String[]> parameterMap = request.getParameterMap();

            List<Transaction> filteredTransactions = transactionQueryMap.applyFilters(transactions, parameterMap);

            JsonArray jsonArray = new JsonArray();
            if (!filteredTransactions.isEmpty()) 
            {
                for (Transaction transaction : filteredTransactions) 
                {
                    JsonObject transactionJson = new JsonObject();
                    transactionJson.addProperty("transaction_id", transaction.getTransaction_id());
                    transactionJson.addProperty("transaction_datetime", transaction.getTransaction_datetime().toString());
                    transactionJson.addProperty("transaction_type", (""+TransactionType.valueOf(transaction.getTransaction_type())).toLowerCase());
                    transactionJson.addProperty("transaction_status", (""+TransactionStatus.valueOf(transaction.getTransaction_status())).toLowerCase());
                    transactionJson.addProperty("transaction_amount", transaction.getTransaction_amount());
                    transactionJson.addProperty("acc_number", transaction.getAcc_number());
                    jsonArray.add(transactionJson);
                }
            } 
            else 
            {
                JsonHandler.sendErrorResponse(response, "No matching transactions found.");
                return;
            }

            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error fetching transaction details: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        SessionHandler.doOptions(request, response);

        try (Connection conn = DbConnection.connect()) 
        {
            JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
            Transaction newTransaction = transactionQueryMap.extractTransactionDetails(jsonRequest);
            newTransaction.setAcc_number(ControllerServlet.pathMap.get("accounts"));

            if (transactionQueryMap.insertTransaction(conn, newTransaction)) 
            {
                response.getWriter().write("Transaction inserted successfully");
            } 
            else 
            {
                response.getWriter().write("Error inserting transaction");
            }
        } 
        catch (SQLException e) 
        {
            response.getWriter().write("Error processing request: " + e.getMessage());
        }
    }

}
