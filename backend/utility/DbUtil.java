package utility;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;

public class DbUtil {
	private static final String url = "jdbc:postgresql://localhost:5431/banker";
	private static final String user = "postgres";
	private static final String password = "";

	public Connection connect() throws SQLException, ServletException {
		try {

			Class.forName("org.postgresql.Driver");
		} catch (ClassNotFoundException e) {
			throw new ServletException("PSQL JDBC Driver not found", e);
		}
		return DriverManager.getConnection(url, user, password);
	}

	public void close(Connection conn, PreparedStatement stmt, ResultSet rs) {
		try {
			if (rs != null) {
				rs.close();
			}
			if (stmt != null) {
				stmt.close();
			}
			if (conn != null) {
				conn.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
