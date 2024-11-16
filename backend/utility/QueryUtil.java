package utility;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class QueryUtil 
{
	    private StringBuilder query;
	    private List<Object> params;

	    private QueryUtil() 
	    {
	        query = new StringBuilder();
	        params = new ArrayList<>();
	    }
	    private QueryUtil(String queri) 
	    {
	        query = new StringBuilder(queri);
	        params = new ArrayList<>();
	    }
	    public static QueryUtil create()
	    {
	        return new QueryUtil();
	    }
	    
	    public static QueryUtil create(String queri)
	    {
	        return new QueryUtil(queri);
	    }

	    public QueryUtil select(String columns) 
	    {
	        query.append("SELECT ").append(columns).append(" ");
	        return this;
	    }

	    public QueryUtil from(String table) 
	    {
	        query.append("FROM ").append(table).append(" ");
	        return this;
	    }
	    
	    public QueryUtil join(String table, String condition, String joinType) {
	        query.append(joinType).append(" JOIN ").append(table).append(" ON ").append(condition).append(" ");
	        return this;
	    }
	    
	    public QueryUtil append(String sql) {
	        query.append(sql).append(" ");
	        return this;
	    }


	    public QueryUtil where(Map<String, Object[]> conditions) 
	    {
	        int index = 0;

	        for (Map.Entry<String, Object[]> entry : conditions.entrySet()) 
	        {
	            String column = entry.getKey();
	            Object[] condition = entry.getValue();
	            String operator = (String) condition[0];
	            Object value = condition[1];
	            
	            if ("IN".equalsIgnoreCase(operator)) {
	            	
	                Collection<?> values = (Collection<?>) value;
	                String placeholders = String.join(", ", values.stream().map(v -> "?").toArray(String[]::new));

	                if (index == 0) {
	                    query.append("WHERE ").append(column).append(" IN (").append(placeholders).append(") ");
	                } else {
	                    query.append("AND ").append(column).append(" IN (").append(placeholders).append(") ");
	                }

	                params.addAll(values);
	            } 
	            else {
	            	
	            	if (index == 0) {
	            		query.append("WHERE ").append(column).append(" ").append(operator).append(" ? ");
	            	} else {
	            		query.append("AND ").append(column).append(" ").append(operator).append(" ? ");
	            	}
	            	
	            	params.add(value);
	            }
	           
	            index=1;
	        }

	        return this;
	    }

	    public QueryUtil insert(String table) 
	    {
	        query.append("INSERT INTO ").append(table).append(" ");
	        return this;
	    }

	    public QueryUtil columns(String... columns) 
	    {
	        query.append("(").append(String.join(", ", columns)).append(") ");
	        return this;
	    }

	    public QueryUtil values(Object... values) 
	    {
	        query.append("VALUES (").append("?, ".repeat(values.length - 1)).append("?);");
//	        for(int i=0;i<values.length;i++)
//	        {
//	        	System.out.println(values[i]);
//	        }
	        params.addAll(Arrays.asList(values));
	        return this;
	    }

	    public QueryUtil update(String table) 
	    {
	        query.append("UPDATE ").append(table).append(" ");
	        return this;
	    }

	    public QueryUtil set(Map<String, Object> columns) 
	    {
	        int index = 0;
	        
	        for (Map.Entry<String, Object> entry : columns.entrySet()) 
	        {
	            String column = entry.getKey();
	            Object value = entry.getValue();

	            if (index == 0) {
	                query.append("SET ").append(column).append(" = ? ");
	            } else {
	                query.append(", ").append(column).append(" = ? ");
	            }

	            
	            params.add(value);

	            index=1;
	        }

	        return this;
	    }

	    
	    public QueryUtil deleteFrom(String table) 
	    {
	        query.append("DELETE FROM ").append(table).append(" ");
	        return this;
	    }
	    
	    public QueryUtil orderBy(String column, String direction) {
	        
	        query.append(" ORDER BY ").append(column).append(" ").append(direction);
	        return this;
	    }

	    public QueryUtil limitOffset(Object... values) {
	        query.append(" LIMIT ?").append(" OFFSET ?");
	        params.addAll(Arrays.asList(values));
	        return this;
	    }


	    public ResultSet executeQuery(Connection conn, DbUtil dbConn) throws SQLException 
	    {
	        PreparedStatement stmt = null;
	        stmt = setParams(conn,stmt);
	        
//	        System.out.println(stmt);
	        return stmt.executeQuery();
	    }

	    public int executeUpdate(Connection conn, DbUtil dbConn) throws SQLException 
	    {
	    	
	    	PreparedStatement stmt = null;
	        stmt = setParams(conn,stmt);
		        
	        return stmt.executeUpdate();
	    }
	    
	    private PreparedStatement setParams(Connection conn,PreparedStatement stmt) throws SQLException
	    {
	    	stmt = conn.prepareStatement(query.toString());
//	    	System.out.println(stmt);
	    	 if(params!=null)
		        {
		        	for (int i = 0; i < params.size(); i++) 
		        	{
		        		if(params.get(i) instanceof Integer) 
		        		{
//		        			System.out.println(params.get(i));
		        			stmt.setInt(i+1, (int) params.get(i));
		        		}
		        		else if(params.get(i) instanceof String)
		        		{
		        			stmt.setString(i+1,  (String) params.get(i));
		        		}
		        		else if(params.get(i) instanceof Double)
		        		{
		        			stmt.setDouble(i+1,(Double) params.get(i));
		        		}
		        		else if(params.get(i) instanceof Boolean)
		        		{
		        			stmt.setBoolean(i+1, (Boolean) params.get(i));
		        		}
		        		else if(params.get(i) instanceof Timestamp)
		        		{
		        			stmt.setTimestamp(i+1, (Timestamp) params.get(i));
		        		}
		        		else if(params.get(i) instanceof BigDecimal)
			        	{
				            stmt.setBigDecimal(i+1, (BigDecimal) params.get(i));
			        	}
		        		else
		        		{
		        			stmt.setDate(i+1, (Date) params.get(i));
		        		}
		        		
		        	}
		        	
		        }
	    	 
	    	return stmt;
	    }
	

}
