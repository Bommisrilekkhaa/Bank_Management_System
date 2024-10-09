package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import model.Emi;
import utility.DbConnection;
import utility.QueryUtil;

public class EmiDAO {

    private DbConnection db = new DbConnection();

    public ResultSet selectAllEmis(Connection conn, HashMap<String, Integer> pathMap) throws SQLException {
        Map<String, Object[]> conditions = new HashMap<>();

       conditions.put("e.loan_id", new Object[] { "=", pathMap.get("loans") });
        

        QueryUtil query = QueryUtil.create()
        		.select("*")
        		.from("emi e")
        		.join("transaction t","e.transaction_id=t.transaction_id","INNER")
                .where(conditions);

        return query.executeQuery(conn, db);
    }


    public List<Emi> convertResultSetToList(ResultSet rs) throws SQLException {
        List<Emi> emiList = new ArrayList<>();

        while (rs.next()) {
            Emi emi = new Emi();
            emi.setEmi_id(rs.getInt("emi_id"));
            emi.setEmi_number(rs.getInt("emi_number"));
            emi.setTransaction_id(rs.getInt("transaction_id"));
            emi.setLoan_id(rs.getInt("loan_id"));
            emi.setTransaction_datetime(rs.getTimestamp("transaction_datetime"));
            emi.setLoan_duration(rs.getInt("loan_duration"));
            emi.setLoan_availed_date(rs.getDate("loan_availed_date"));
            emiList.add(emi);
        }
        return emiList;
    }

    
}
