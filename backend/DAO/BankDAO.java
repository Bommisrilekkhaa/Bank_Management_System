package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import enums.Resources;
import handlers.BanksHandler;
import model.Bank;
import utility.DbUtil;
import utility.JsonUtil;
import utility.QueryUtil;

public class BankDAO {

    public final static int itemsPerPage = 8;
    private DbUtil dbUtil = new DbUtil();

    public ResultSet getBanks(Connection conn, HashMap<String, Integer> pathMap) throws SQLException {
        QueryUtil query;
        if (pathMap.isEmpty()) {

            query = QueryUtil.create()
                    .select("*")
                    .from(Resources.BANKS.toString().toLowerCase());
        } else {
            Map<String, Object[]> conditions = new HashMap<>();
            conditions.put("bank_id", new Object[] { "=", pathMap.get(Resources.BANKS.toString().toLowerCase()) });
            query = QueryUtil.create()
                    .select("*")
                    .from(Resources.BANKS.toString().toLowerCase())
                    .where(conditions);
        }

        return query.executeQuery(conn, dbUtil);

    }

    public ResultSet selectPageWise(Connection conn) throws SQLException {
        QueryUtil query = QueryUtil.create()
                .select("*")
                .from(Resources.BANKS.toString().toLowerCase())
                .orderBy("bank_id", "DESC");

        if (BanksHandler.offset != -1) {
            query.limitOffset(itemsPerPage, BanksHandler.offset);
        }

        return query.executeQuery(conn, dbUtil);

    }

    public int totalBanks(Connection conn) throws SQLException {
        QueryUtil query = QueryUtil.create()
                .select("COUNT(bank_id) AS TotalBanks")
                .from(Resources.BANKS.toString().toLowerCase());

        ResultSet rs = null;
        try {
            rs = query.executeQuery(conn, new DbUtil());
            if (rs.next()) {
                return rs.getInt("TotalBanks");
            }

        } finally {
            dbUtil.close(null, null, rs);
        }
        return -1;
    }

    public Bank getBankById(Connection conn, int bankId) throws SQLException {
        Map<String, Object[]> conditions = new HashMap<>();
        conditions.put("bank_id", new Object[] { "=", bankId });

        QueryUtil query = QueryUtil.create()
                .select("*")
                .from(Resources.BANKS.toString().toLowerCase())
                .where(conditions);
        ResultSet rs = null;
        Bank bank = new Bank();
        try {
            rs = query.executeQuery(conn, dbUtil);

            List<Bank> banks = JsonUtil.convertResultSetToList(rs, Bank.class);
            if (banks.size() != 0) {
                bank = banks.get(0);

            } else {
                System.out.println("Bank not found");
            }
        } finally {
            dbUtil.close(null, null, rs);
        }
        return bank;
    }

    public boolean insertBank(Connection conn, Bank banks) throws SQLException {
        // System.out.println(banks.getBank_name());
        QueryUtil query = QueryUtil.create()
                .insert(Resources.BANKS.toString().toLowerCase())
                .columns("bank_name", "bank_code", "admin_id")
                .values(banks.getBank_name(), banks.getBank_code(), banks.getAdmin_id());

        return query.executeUpdate(conn, dbUtil) > 0;
    }

    public boolean updateBank(Connection conn, Bank bank) throws SQLException {
        Map<String, Object[]> whereConditions = new HashMap<>();
        whereConditions.put("bank_id", new Object[] { "=", bank.getBank_id() });

        Map<String, Object> setConditions = new HashMap<>();
        setConditions.put("main_branch_id", bank.getMain_branch_id());

        QueryUtil query = QueryUtil.create()
                .update(Resources.BANKS.toString().toLowerCase())
                .set(setConditions)
                .where(whereConditions);

        return query.executeUpdate(conn, dbUtil) > 0;
    }

}
