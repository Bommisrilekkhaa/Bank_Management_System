package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import DAO.AccountDAO;
import DAO.EmiDAO;
import DAO.LoanDAO;
import DAO.TransactionDAO;
import enums.LoanStatus;
import enums.Status;
import enums.TransactionStatus;
import enums.TransactionType;
import model.Emi;
import model.Transaction;
import redis.clients.jedis.Jedis;
import utility.DbConnection;
import utility.JsonHandler;
import utility.LoggerConfig;
import utility.SessionHandler;

@SuppressWarnings("serial")
public class Transactions extends HttpServlet {
    
    private Logger logger = LoggerConfig.initializeLogger();
    private TransactionDAO transactionDAO = new TransactionDAO();
    private LoanDAO loanDao = new LoanDAO();
    private EmiDAO emiDao = new EmiDAO();
    private AccountDAO accountDao = new AccountDAO();
    Jedis jedis = null;
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));
        jedis = ControllerServlet.pool.getResource();
        
        logger.info("GET request received for path: " + path);

        String cachedData = jedis.get(cacheKey);
        if(request.getSession(false).getAttribute("user_role").equals("CUSTOMER")) {
            ControllerServlet.pathMap.put("user_id", (Integer) request.getSession(false).getAttribute("user_id"));
            cachedData = null;
        }
        
        if (cachedData != null) {
            JsonArray jsonArray = JsonParser.parseString(cachedData).getAsJsonArray();
            response.setContentType("application/json");
            JsonHandler.sendJsonResponse(response, jsonArray);
            logger.info("Data fetched from Redis cache for key: " + cacheKey);
        } else {
            try (Connection conn = DbConnection.connect()) {
                ResultSet rs = transactionDAO.selectAllTransactions(conn, ControllerServlet.pathMap);
                List<Transaction> transactions = transactionDAO.convertResultSetToList(rs);

                JsonArray jsonArray = new JsonArray();
                if (!transactions.isEmpty()) {
                    for (Transaction transaction : transactions) {
                        JsonObject transactionJson = new JsonObject();
                        transactionJson.addProperty("transaction_id", transaction.getTransaction_id());
                        transactionJson.addProperty("transaction_datetime", transaction.getTransaction_datetime().toString());
                        transactionJson.addProperty("transaction_type", TransactionType.valueOf(transaction.getTransaction_type()).toString().toLowerCase());
                        transactionJson.addProperty("transaction_status", TransactionStatus.valueOf(transaction.getTransaction_status()).toString().toLowerCase());
                        transactionJson.addProperty("transaction_amount", transaction.getTransaction_amount());
                        transactionJson.addProperty("acc_number", transaction.getAcc_number());
                        jsonArray.add(transactionJson);
                    }
                } else {
                    logger.warning("No matching transactions found for path: " + path);
                    JsonHandler.sendErrorResponse(response, "No matching transactions found.");
                    return;
                }
                
                jedis.set(cacheKey, jsonArray.toString());
                response.setContentType("application/json");
                JsonHandler.sendJsonResponse(response, jsonArray);
                logger.info("Transaction data fetched from DB and stored in Redis for key: " + cacheKey);
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error fetching transaction details", e);
                JsonHandler.sendErrorResponse(response, "Error fetching transaction details: " + e.getMessage());
            }
        }
        jedis.close();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionHandler.doOptions(request, response);
        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf("banks")).split("/");
        String cacheKey = "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1];

        logger.info("POST request received for path: " + String.join("/", path));

        try (Connection conn = DbConnection.connect()) {
            JsonObject jsonRequest = JsonHandler.parseJsonRequest(request);
            Transaction newTransaction = transactionDAO.extractTransactionDetails(jsonRequest);
            newTransaction.setAcc_number(ControllerServlet.pathMap.get("accounts"));
            
            if (checkAccountStatus(conn, newTransaction)) {
                if (transactionDAO.insertTransaction(conn, newTransaction)) {
                    jedis = ControllerServlet.pool.getResource();
                    Set<String> keys = jedis.keys(cacheKey);
                    if (!keys.isEmpty()) {
                        jedis.del(keys.toArray(new String[0]));
                        logger.info("Deleted cache keys: " + keys);
                    }

                    if (newTransaction.getTransaction_type() == TransactionType.EMI.getValue()) {
                        processEmiTransaction(conn, newTransaction);
                    } else {
                        if (transactionDAO.updateBalance(newTransaction.getTransaction_type(), newTransaction.getTransaction_amount())) {
                            clearAccountCache();
                            JsonHandler.sendSuccessResponse(response, "Transaction inserted successfully");
                            logger.info("Transaction inserted successfully: " + newTransaction.getTransaction_id());
                        } else {
                            handleTransactionFailure(newTransaction, response);
                        }
                    }
                } else {
                    logger.warning("Error inserting transaction for request: " + jsonRequest);
                    JsonHandler.sendErrorResponse(response, "Error inserting transaction");
                }
            } else {
                logger.warning("Unauthorized account access attempt for account: " + newTransaction.getAcc_number());
                JsonHandler.sendErrorResponse(response, "Unauthorized Account");
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error processing transaction request", e);
            JsonHandler.sendErrorResponse(response, "Error processing request: " + e.getMessage());
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }

    private boolean checkAccountStatus(Connection conn, Transaction newTransaction) throws SQLException {
        HashMap<String, Integer> accountMap = new HashMap<>();
        accountMap.put("accounts", newTransaction.getAcc_number());
        accountMap.put("a.acc_status", Status.ACTIVE.getValue());
        ResultSet rs = accountDao.selectAllAccounts(conn, accountMap);
        boolean status = rs.next();
        logger.info("Account status check for account " + newTransaction.getAcc_number() + ": " + (status ? "Active" : "Inactive"));
        return status;
    }

    private void processEmiTransaction(Connection conn, Transaction newTransaction) throws SQLException {
        logger.info("Processing EMI transaction for account: " + newTransaction.getAcc_number());
        HashMap<String, Integer> pathMap = new HashMap<>();
        pathMap.put("accounts", newTransaction.getAcc_number());
        ResultSet rs = loanDao.selectAllLoans(conn, pathMap);

        int loanId = -1;
        Date loanAvailedDate = null;

        while (rs.next()) {
            if (rs.getInt("loan_status") == LoanStatus.APPROVED.getValue()) {
                loanId = rs.getInt("loan_id");
                loanAvailedDate = rs.getDate("loan_availed_date");
                break;
            }
        }

        LocalDate loanAvailed = loanAvailedDate.toLocalDate();
        LocalDate currentDate = LocalDate.now();
        int monthsDifference = (int) ChronoUnit.MONTHS.between(loanAvailed, currentDate);

        Emi emi = new Emi();
        emi.setEmi_number(monthsDifference);
        emi.setLoan_id(loanId);
        emi.setTransaction_id(newTransaction.getTransaction_id());

        Set<String> keys = jedis.keys("/banks/" + ControllerServlet.pathMap.get("banks") + "*/loans/" + emi.getLoan_id() + "/emis");
        if (!keys.isEmpty()) {
            jedis.del(keys.toArray(new String[0]));
            logger.info("Deleted EMI cache keys: " + keys);
        }
        emiDao.insertEmi(conn, emi);
        logger.info("EMI inserted successfully for transaction: " + newTransaction.getTransaction_id());
    }

    private void clearAccountCache() {
        Set<String> accKeys = jedis.keys("/banks/" + ControllerServlet.pathMap.get("banks") + "*/accounts" + ControllerServlet.pathMap.get("accounts"));
        if (!accKeys.isEmpty()) {
            jedis.del(accKeys.toArray(new String[0]));
            logger.info("Deleted account cache keys: " + accKeys);
        }
    }

    private void handleTransactionFailure(Transaction newTransaction, HttpServletResponse response) throws IOException {
        if (newTransaction.getTransaction_type() == TransactionType.DEBIT.getValue()) {
            JsonHandler.sendErrorResponse(response, "Insufficient Balance.");
            logger.warning("Insufficient balance for debit transaction: " + newTransaction.getTransaction_id());
        } else {
            JsonHandler.sendErrorResponse(response, "Error inserting transaction");
            logger.warning("Error inserting transaction: " + newTransaction.getTransaction_id());
        }
    }
}
