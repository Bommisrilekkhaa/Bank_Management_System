package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import enums.Resources;
import model.Emi;
import utility.DbUtil;
import utility.QueryUtil;

public class EmiDAO {

    private DbUtil db = new DbUtil();

    public boolean insertEmi(Connection conn, Emi emi) throws SQLException {
        QueryUtil query = QueryUtil.create()
                .insert("emi")
                .columns("emi_number", "transaction_id", "loan_id")
                .values(emi.getEmi_number(), emi.getTransaction_id(), emi.getLoan_id());

        return query.executeUpdate(conn, db) > 0;
    }

    public ResultSet selectAllEmis(Connection conn, HashMap<String, Integer> pathMap) throws SQLException {
        Map<String, Object[]> conditions = new HashMap<>();

        conditions.put("e.loan_id", new Object[] { "=", pathMap.get(Resources.LOANS.toString().toLowerCase()) });

        QueryUtil query = QueryUtil.create()
                .select("*")
                .from("emi e")
                .join("transaction t", "e.transaction_id=t.transaction_id", "INNER")
                .join("loan l", "e.loan_id=l.loan_id", "INNER")
                .where(conditions);

        return query.executeQuery(conn, db);
    }

    public ResultSet getEmiNumber(Connection conn, int loanId) throws SQLException {
        Map<String, Object[]> conditions = new HashMap<>();

        conditions.put("loan_id", new Object[] { "=", loanId });

        QueryUtil query = QueryUtil.create()
                .select("MAX(emi_number) AS emiNumber")
                .from("emi")
                .where(conditions);

        return query.executeQuery(conn, db);
    }

}
