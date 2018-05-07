package onassis.db.functions;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;

import javax.sql.DataSource;

import org.springframework.stereotype.Component;

@Component
public class Balance {
	//@Autowired
	static public DataSource ds;
	
	//@Value(value = "${buddb.jdbc.url}")
	private static String jdbcUrl;
	
	public static BigDecimal smallestBalanceAt(Date d) throws SQLException {
		Connection conn = null;
		if (null == ds) {
		    if(null == jdbcUrl) {
		        jdbcUrl = "jdbc:derby:C:\\Users\\jahup1\\Google Drive\\bud5\\bud5\\src\\onassis\\BudDB.v5";
		    }
			conn = DriverManager.getConnection(jdbcUrl);
		} else {
			conn = ds.getConnection();
		}
		conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
		//System.out.println("day "+d + " accoount "+a+ " i "+i);
		String DML = "select id from a";
		PreparedStatement pstmnt = conn.prepareStatement(DML);
		if( !pstmnt.execute() ) {
	    	System.out.println("execute failed");
	    }
	    ResultSet set = pstmnt.getResultSet();
	    if (set==null) {
	    	System.out.println("set is null");
			pstmnt.close();
			conn.close();
		    return BigDecimal.ZERO;
	    }

		BigDecimal res = null;
		while( set.next() ) {
			
			int id = set.getInt(1);
			System.out.println("account "+id+" res "+res);
			BigDecimal b = balanceAfter(d, id);
			System.out.println("db "+b);
			/*if(a == id) {
				b.add(i);
			}*/
			System.out.println("-> "+b);
			if(res == null || b.compareTo(res) < 0) {
				System.out.println("smaller");
				res = b;
			}
		}
		set.close();
	    pstmnt.close();
		conn.close();
		return res;
	}
	
	public static BigDecimal balanceAfter(Date d, int a)
	        throws SQLException {
			Calendar c = Calendar.getInstance();
			c.setTime(d);
			c.add(Calendar.DATE, 1);
			return balanceBefore(new Date(c.getTimeInMillis()), a);
	}
	
	public static int cc=0;
	public static BigDecimal balanceBefore(Date d, int a)
	        throws SQLException {
		
		//System.out.println("ok: balance :"+(cc++));
		Connection conn = null;
		if (null == ds) {
    		//String connectionURL = "jdbc:default:connection";
    		//String connectionURL = "jdbc:derby:/Users/Janne/tmp/BudDB";

			//String connectionURL = "jdbc:derby:/Users/Janne/tmp/BudDB";
			//String connectionURL = "jdbc:derby:C:\\Users\\jahup1\\Google Drive\\bud5\\bud5\\src\\onassis\\BudDB";
    		//conn = DriverManager.getConnection(connectionURL);
		    if(null == jdbcUrl) {
		        jdbcUrl = "jdbc:derby:C:\\Users\\jahup1\\Google Drive\\bud5\\bud5\\src\\onassis\\BudDB.v5";
		    }
			conn = DriverManager.getConnection(jdbcUrl);
		} else {
			conn = ds.getConnection();
		}
		conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
		//System.out.println("conn :"+conn.getHoldability());
	    //String DML = "UPDATE TEST_TABLE SET NAME = ? WHERE ID = ?";
	    String DML = "select b from b where d<? and a=? order by d desc fetch first 1 rows only";
	    //System.out.println("DML: "+  DML);
	    //String DML = "UPDATE TEST_TABLE SET NAME = ? WHERE ID = ?";
	    PreparedStatement pstmnt = conn.prepareStatement(DML);
	    //System.out.println("b");
//	    pstmnt.setString(1, iParam2);
//	    pstmnt.setInt(2, iParam1);
	    if (pstmnt==null) {
	    	System.out.println("pstmnt is null");
	    }
	    
	    //System.out.println("d="+d);
	    pstmnt.setDate(1, d);
	    //System.out.println("a="+a);
	    pstmnt.setInt(2, a);
	    if( !pstmnt.execute() ) {
	    	System.out.println("execute failed");
	    }
	    //System.out.println("b2");
	    ResultSet set = pstmnt.getResultSet();
	    if (set==null) {
	    	System.out.println("set is null");
	    	System.out.println("ZERO result");
	    	pstmnt.close();
			conn.close();
		    return BigDecimal.ZERO;
	    }
	   // if( set.first() ) {
		//System.out.println("set next");
			if( !set.next() ) {
				//System.out.println("no result");
		    	set.close();
		    	pstmnt.close();
				conn.close();
				return BigDecimal.ZERO;
			}
	    	//System.out.println("result");
	    	BigDecimal bd = (BigDecimal) set.getBigDecimal(1);
	    	System.out.println("Balance before " + bd + "account: " + a + " ");
	    	
	    	
	    	set.close();
	    	pstmnt.close();
			conn.close();
			

	    	return bd;
	    	
	    	

	    //}
	    //System.out.println("ZERO result");
	    //return BigDecimal.ZERO;
	} // testProc()


}
