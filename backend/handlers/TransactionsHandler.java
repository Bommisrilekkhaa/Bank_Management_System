package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
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
import enums.Resources;
import enums.Status;
import enums.TransactionStatus;
import enums.TransactionType;
import enums.UserRole;
import model.Account;
import model.Emi;
import model.Loan;
import model.Transaction;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;

public class TransactionsHandler {

    private Logger logger = LoggerConfig.initializeLogger();
    private TransactionDAO transactionDAO = new TransactionDAO();
    private LoanDAO loanDao = new LoanDAO();
    private EmiDAO emiDao = new EmiDAO();
    private AccountDAO accountDao = new AccountDAO();
    private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();
    public static int offset = -1;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {

        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks"));
        jedis = ControllerServlet.pool.getResource();
        Map<String, String[]> queryParamMap = request.getParameterMap();
        cacheKey = JsonUtil.keyGenerate(cacheKey, queryParamMap);
        String cachedData = jedis.get(cacheKey);
        logger.info("GET request received for path: " + path);
        String role = request.getSession(false).getAttribute("user_role").toString();
        String searchParam = null;

        if (queryParamMap.containsKey("filter_type")) {
            ControllerServlet.pathMap.put("t.transaction_type", Integer
                    .valueOf(TransactionType.valueOf(queryParamMap.get("filter_type")[0].toUpperCase()).getValue()));

        }
        if (queryParamMap.containsKey("filter_status")) {
            ControllerServlet.pathMap.put("t.transaction_status", Integer.valueOf(
                    TransactionStatus.valueOf(queryParamMap.get("filter_status")[0].toUpperCase()).getValue()));

        }
        if (queryParamMap.containsKey("search_item")) {
            searchParam = queryParamMap.get("search_item")[0];

        }

        if (queryParamMap.containsKey("page")) {
            offset = (Integer.valueOf(queryParamMap.get("page")[0]) - 1) * TransactionDAO.itemsPerPage;

        }

        if (role.equals(UserRole.CUSTOMER.toString())) {
            ControllerServlet.pathMap.put("user_id", (Integer) request.getSession(false).getAttribute("user_id"));
            cachedData = null;
        }

        if (cachedData != null) {
            JsonObject jsonObject = JsonParser.parseString(cachedData).getAsJsonObject();
            JsonUtil.sendJsonResponse(response, jsonObject);
            logger.info("Data fetched from Redis cache for key: " + cacheKey);
        } else {
            ResultSet rs = null;
            try {
                conn = dbUtil.connect();
                JsonArray jsonArray = new JsonArray();
                int totalTransactions = transactionDAO.totalTransactions(conn, ControllerServlet.pathMap, searchParam);
                if (ControllerServlet.pathMap.containsKey(Resources.TRANSACTIONS.toString().toLowerCase())) {
                    rs = transactionDAO.selectAllTransactions(conn, ControllerServlet.pathMap);
                } else {
                    rs = transactionDAO.selectPageWise(conn, ControllerServlet.pathMap, searchParam);
                }
                List<Transaction> transactions = JsonUtil.convertResultSetToList(rs, Transaction.class);

                JsonObject objectJson = new JsonObject();
                objectJson.addProperty("totalTransactions", totalTransactions);

                if (!transactions.isEmpty()) {
                    for (Transaction transaction : transactions) {
                        JsonObject transactionJson = new JsonObject();
                        transactionJson.addProperty("transaction_id", transaction.getTransaction_id());
                        transactionJson.addProperty("transaction_datetime",
                                transaction.getTransaction_datetime().toString());
                        transactionJson.addProperty("transaction_type",
                                TransactionType.valueOf(transaction.getTransaction_type()).toString().toLowerCase());
                        transactionJson.addProperty("transaction_status", TransactionStatus
                                .valueOf(transaction.getTransaction_status()).toString().toLowerCase());
                        transactionJson.addProperty("transaction_amount", transaction.getTransaction_amount());
                        transactionJson.addProperty("acc_number", transaction.getAcc_number());
                        jsonArray.add(transactionJson);
                    }

                } else {
                    logger.warning("No matching transactions found for path: " + path);
                    JsonUtil.sendErrorResponse(response, "No matching transactions found.");
                    return;
                }
                objectJson.add("data", jsonArray);

                if (!role.equals(UserRole.CUSTOMER.toString())) {
                    jedis.set(cacheKey, objectJson.toString());
                    logger.info("Transaction data fetched from DB and stored in Redis for key: " + cacheKey);

                }

                JsonUtil.sendJsonResponse(response, objectJson);
            } finally {
                dbUtil.close(conn, null, rs);
            }
        }
        if (jedis != null) {
            jedis.close();
        }
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {

        String[] path = request.getRequestURI().substring(request.getRequestURI().indexOf(Resources.BANKS.toString().toLowerCase())).split("/");
        String[] cacheKeys = new String[] { "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1],
                "/" + path[0] + "/" + path[1] + "*/" + path[path.length - 1] + "_*" };

        logger.info("POST request received for path: " + String.join("/", path));

        try {
            conn = dbUtil.connect();
            String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

            Transaction newTransaction = (Transaction) JsonUtil.parseRequest(body, Transaction.class);

            newTransaction.setAcc_number(ControllerServlet.pathMap.get(Resources.ACCOUNTS.toString().toLowerCase()));

            if (checkAccountStatus(conn, newTransaction)) {
                if (transactionDAO.insertTransaction(conn, newTransaction)) {
                    jedis = ControllerServlet.pool.getResource();

                    JsonUtil.deleteCache(jedis, cacheKeys);

                    if (newTransaction.getTransaction_type() == TransactionType.EMI.getValue()) {
                        if (!processEmiTransaction(conn, newTransaction)) {
                            logger.warning("Error inserting EMI transaction!");
                            JsonUtil.sendErrorResponse(response, "Error inserting EMI transaction");
                            return;

                        }
                    }
                    if (transactionDAO.updateBalance(newTransaction.getTransaction_type(),
                            newTransaction.getTransaction_amount(), newTransaction.getAcc_number())) {
                        clearAccountCache();
                        JsonUtil.sendSuccessResponse(response, "Transaction inserted successfully");
                        logger.info("Transaction inserted successfully! ");
                    } else {
                        handleTransactionFailure(newTransaction, response);
                    }

                } else {
                    logger.warning("Error inserting transaction!");
                    JsonUtil.sendErrorResponse(response, "Error inserting transaction");
                }
            } else {
                logger.warning("Unauthorized account access attempt for account: " + newTransaction.getAcc_number());
                JsonUtil.sendErrorResponse(response, "Unauthorized Account/Insufficient Balance");
            }
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }

    private boolean checkAccountStatus(Connection conn, Transaction newTransaction) throws SQLException {
        HashMap<String, Integer> accountMap = new HashMap<>();
        accountMap.put(Resources.ACCOUNTS.toString().toLowerCase(), newTransaction.getAcc_number());
        accountMap.put("a.acc_status", Status.ACTIVE.getValue());
        boolean status = false;
        ResultSet rs = null;
        try {
            rs = accountDao.selectAllAccounts(conn, accountMap);
            List<Account> accounts = JsonUtil.convertResultSetToList(rs, Account.class);

            if (!accounts.isEmpty()) {
                for (Account account : accounts) {

                    if (newTransaction.getTransaction_type() != TransactionType.CREDIT.getValue()) {
                        if (account.getAccBalance().compareTo(newTransaction.getTransaction_amount()) == 1) {
                            status = true;
                        } else {
                            status = false;
                        }

                    } else {

                        status = true;
                    }
                }
            }

        } finally {
            dbUtil.close(null, null, rs);
        }
        logger.info("Account status check for account " + newTransaction.getAcc_number() + ": "
                + (status ? "Active" : "Inactive"));
        return status;
    }

    private boolean processEmiTransaction(Connection conn, Transaction newTransaction) throws SQLException {
        logger.info("Processing EMI transaction for account: " + newTransaction.getAcc_number());
        HashMap<String, Integer> pathMap = new HashMap<>();
        pathMap.put(Resources.ACCOUNTS.toString().toLowerCase(), newTransaction.getAcc_number());
        ResultSet rs = null;
        ResultSet rsTransaction = null;
        ResultSet rsEmi = null;
        int emiNumber = -1;
        int loanId = -1;
        Loan availedloan = new Loan();
        try {
            rs = loanDao.selectAllLoans(conn, pathMap);
            List<Loan> loans = JsonUtil.convertResultSetToList(rs, Loan.class);

            if (!loans.isEmpty()) {
                for (Loan loan : loans) {

                    if (loan.getLoan_status() == LoanStatus.APPROVED.getValue()) {
                        loanId = loan.getLoan_id();
                        availedloan = loan;
                        break;
                    }
                }
            }
            else
            {
            	return false;
            }

            rsTransaction = transactionDAO.lastTransaction(conn, pathMap);

            if (rsTransaction.next()) {
                newTransaction.setTransaction_id(rsTransaction.getInt("transactionId"));
            }

            rsEmi = emiDao.getEmiNumber(conn, loanId);
            if (rsEmi.next()) {
                emiNumber = rsEmi.getInt("emiNumber");

            }
        } finally {
            dbUtil.close(null, null, rs);
            dbUtil.close(null, null, rsTransaction);
        }

        Emi emi = new Emi();
        emi.setEmi_number(emiNumber + 1);
        emi.setLoan_id(loanId);
        emi.setTransaction_id(newTransaction.getTransaction_id());

        Set<String> keys = jedis
                .keys("/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/loans/" + emi.getLoan_id() + "/emis");
        if (!keys.isEmpty()) {
            jedis.del(keys.toArray(new String[0]));
            logger.info("Deleted EMI cache keys: " + keys);
        }
        if (emiDao.insertEmi(conn, emi)) {
        	if(emi.getEmi_number()==availedloan.getLoan_duration())
        	{
        		availedloan.setLoan_status(LoanStatus.CLOSED.getValue());
        		if(!loanDao.updateLoan(conn,availedloan))
        		{
        			return false;
        		}
        		 String[] cacheKeys = new String[] {
        				 "/banks/" +  ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase())+ "*/" + "loans" + "/" + availedloan.getLoan_id(),
        				 "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/" + "loans",
        				 "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/" + "loans" + "_*" };
        		  JsonUtil.deleteCache(jedis, cacheKeys);
        	}
            logger.info("EMI inserted successfully for transaction: " + newTransaction.getTransaction_id());
            return true;
        }
        return false;
    }

    private void clearAccountCache() {
        String[] cacheKeys = new String[] { "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/accounts",
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/accounts_*",
                "/banks/" + ControllerServlet.pathMap.get(Resources.BANKS.toString().toLowerCase()) + "*/accounts/" + ControllerServlet.pathMap.get(Resources.ACCOUNTS.toString().toLowerCase()) };
        JsonUtil.deleteCache(jedis, cacheKeys);

    }

    private void handleTransactionFailure(Transaction newTransaction, HttpServletResponse response) throws IOException {
        if (newTransaction.getTransaction_type() == TransactionType.DEBIT.getValue()) {
            JsonUtil.sendErrorResponse(response, "Insufficient Balance.");
            logger.warning("Insufficient balance for debit transaction: " + newTransaction.getTransaction_id());
        } else {
            JsonUtil.sendErrorResponse(response, "Error inserting transaction");
            logger.warning("Error inserting transaction: " + newTransaction.getTransaction_id());
        }
    }
}
