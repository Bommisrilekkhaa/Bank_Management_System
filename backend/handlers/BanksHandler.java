package handlers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import DAO.BankDAO;
import DAO.UserDAO;
import model.Bank;
import redis.clients.jedis.Jedis;
import servlets.ControllerServlet;
import utility.DbUtil;
import utility.JsonUtil;
import utility.LoggerConfig;

public class BanksHandler
{
	private Logger logger=LoggerConfig.initializeLogger(); 
	private BankDAO bankDAO = new BankDAO();
	private UserDAO userDao = new UserDAO();
	private Jedis jedis = null;
    private Connection conn = null;
    private DbUtil dbUtil = new DbUtil();
    public static int offset=-1;
   
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException 
    {
        String path = request.getRequestURI();
        String cacheKey = path.substring(path.indexOf("/banks")); 
        jedis = ControllerServlet.pool.getResource();
        Map<String,String[]> queryParamMap = request.getParameterMap();
       
        cacheKey = JsonUtil.keyGenerate(cacheKey, queryParamMap);
       
        if(queryParamMap.containsKey("page"))
        {
        	offset = (Integer.valueOf(queryParamMap.get("page")[0])-1)* BankDAO.itemsPerPage;
        
        }
        String cachedData = jedis.get(cacheKey);
        if (cachedData != null) {
            JsonObject jsonObject = JsonParser.parseString(cachedData).getAsJsonObject();
            JsonUtil.sendJsonResponse(response, jsonObject);
            logger.info("Data fetched from Redis cache for key: " + cacheKey);
        }
        else {
            logger.info("Cache miss for key: " + cacheKey);
            ResultSet rs=null;
            try{
            	conn = dbUtil.connect();
            	JsonArray jsonArray = new JsonArray();
            	 int totalBanks = bankDAO.totalBanks(conn);
                 if(ControllerServlet.pathMap.containsKey("banks"))
                 {
                 	rs = bankDAO.getBanks(conn, ControllerServlet.pathMap);
                 }
                 else
                 {
                 	rs = bankDAO.selectPageWise(conn);
                 }
                List<Bank> banks = JsonUtil.convertResultSetToList(rs, Bank.class);
                JsonObject objectJson = new JsonObject();
                objectJson.addProperty("totalBanks", totalBanks);
               
                if (!banks.isEmpty()) {
                    for (Bank bank : banks) {
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("bank_id", bank.getBank_id());
                    jsonResponse.addProperty("bank_name", bank.getBank_name());
                    jsonResponse.addProperty("bank_code", bank.getBank_code());
                    jsonResponse.addProperty("admin_id", bank.getAdmin_id());
                    jsonResponse.addProperty("main_branch_id", bank.getMain_branch_id());
                    jsonResponse.addProperty("admin_name", userDao.getUsername(conn, bank.getAdmin_id()).getFullname());
                    jsonArray.add(jsonResponse);
                    }
                }
                objectJson.add("data", jsonArray);
               
                jedis.set(cacheKey, objectJson.toString());
                response.setContentType("application/json");
                JsonUtil.sendJsonResponse(response, objectJson);
                logger.info("Data fetched from DB and cached in Redis for key: " + cacheKey);
            } 
            finally {
            	dbUtil.close(conn, null, rs);
            }
        }
        if (jedis != null) {
            jedis.close();
        }
    }

    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException 
    {
        String path = request.getRequestURI();
        String[] cacheKeys =new String[]{ path.substring(path.indexOf("/banks")),
        		"*admin",
        		path.substring(path.indexOf("/banks"))+"_*"};

        try {
        	 conn = dbUtil.connect();
        	 String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
             
        	 Bank newBank = (Bank) JsonUtil.parseRequest(body,Bank.class);
            
            if (bankDAO.insertBank(conn, newBank)) {
                jedis = ControllerServlet.pool.getResource();

                JsonUtil.deleteCache(jedis,cacheKeys);
                JsonUtil.sendSuccessResponse(response, "Bank inserted successfully");
                logger.info("New bank inserted and cache invalidated for key: " + cacheKeys[0]);
            } else {
                JsonUtil.sendErrorResponse(response, "Error inserting bank");
                logger.warning("Error inserting bank");
            }
        }  finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }

   
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException 
    {
        String path = request.getRequestURI();
        String[] cacheKeys =new String[]{ path.substring(path.indexOf("/banks")),
        		"/banks",
        		"/banks_*"};

        String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        
   	 	Bank bank = (Bank) JsonUtil.parseRequest(body,Bank.class);
       
   	 	bank.setBank_id(ControllerServlet.pathMap.get("banks"));
        try {
        	conn = dbUtil.connect();
            if (bankDAO.updateBank(conn, bank)) {
                jedis = ControllerServlet.pool.getResource();

                JsonUtil.deleteCache(jedis,cacheKeys);
                JsonUtil.sendSuccessResponse(response, "Bank updated successfully");
                logger.info("Bank updated and cache invalidated for key: " + cacheKeys[0]);
            } else {
                JsonUtil.sendErrorResponse(response, "Error updating bank");
                logger.warning("Error updating bank");
            }
        } finally {
            if (jedis != null) {
                jedis.close();
            }
            dbUtil.close(conn, null, null);
        }
    }
}
