package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import model.Emi;
import utility.DbConnection;
import utility.QueryUtil;

public class EmiQueryMap {

    private DbConnection db = new DbConnection();

    public ResultSet selectAllEmis(Connection conn, TreeMap<String, Integer> pathMap) throws SQLException {
        Map<String, Object[]> conditions = new HashMap<>();

        for (String key : pathMap.keySet()) {
            conditions.put(changeName(key), new Object[] { "=", pathMap.get(key) });
        }

        QueryUtil query = QueryUtil.create("SELECT * FROM emi")
                .where(conditions);

        return query.executeQuery(conn, db);
    }

    public String changeName(String key) {
        if (key.equals("transactions")) {
            return "transaction_id";
        } else if (key.equals("loans")) {
            return "loan_id";
        }
        return key;
    }

    public List<Emi> convertResultSetToList(ResultSet rs) throws SQLException {
        List<Emi> emiList = new ArrayList<>();

        while (rs.next()) {
            Emi emi = new Emi();
            emi.setEmi_id(rs.getInt("emi_id"));
            emi.setEmi_number(rs.getInt("emi_number"));
            emi.setTransaction_id(rs.getInt("transaction_id"));
            emi.setLoan_id(rs.getInt("loan_id"));
            emiList.add(emi);
        }
        return emiList;
    }

    public List<Emi> applyFilters(List<Emi> emis, Map<String, String[]> parameterMap) {
        return emis.stream()
                .filter(emi -> parameterMap.entrySet().stream()
                        .allMatch(entry -> {
                            String param = entry.getKey();
                            String[] values = entry.getValue();

                            switch (param) {
                                case "emi_id":
                                    return emi.getEmi_id() == Integer.parseInt(values[0]);
                                case "emi_number":
                                    return emi.getEmi_number() == Integer.parseInt(values[0]);
                                case "transaction_id":
                                    return emi.getTransaction_id() == Integer.parseInt(values[0]);
                                case "loan_id":
                                    return emi.getLoan_id() == Integer.parseInt(values[0]);
                                default:
                                    return true;
                            }
                        }))
                .collect(Collectors.toList());
    }
}
