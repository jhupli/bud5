package onassis.db.functions;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class History {
	public static DataSource ds;

	//@Value(value = "${buddb.jdbc.url:foo}")
	public static String jdbcUrl;
	

    
	public static void history(
			boolean old_l, boolean  new_l,
			int new_id, Date new_d, BigDecimal new_i, int new_c, int new_a, boolean new_s, String new_g, String new_descr
			)
	        throws SQLException, ParseException {
		Connection conn = null;
		
		if (null == ds) {
		    if(null == jdbcUrl) {
		    	System.out.println("Using mem");
		        jdbcUrl = "jdbc:derby:memory:onassisTest;create=true";
		    }
			conn = DriverManager.getConnection(jdbcUrl);
		} else {
			
		}
		conn = ds.getConnection();
		conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
			
		String insertSQL =
				
		"insert into h(id, d, i, c, a, s, g, descr, op, hd, rownr) values "+
		"(?, "+ //new.id 1
		 "?, "+ //new.d  2 
		 "?, "+	//new.i  3
		 "?, "+ //new.c  4
		 "?, "+ //new.a  5
		 "?, "+ //new.s  6
		 "?, "+ //new.g  7 
		 "?, "+ //new.descr 8, 
		 "'U', current_timestamp, "+
		 "(select max(rownr) + 1 from h "+
		 " where id = ?))"; //new.id 9

		PreparedStatement pstmnt = conn.prepareStatement(insertSQL);
		pstmnt.setLong(1, new_id);
		pstmnt.setDate(2, new_d);
		pstmnt.setBigDecimal(3, new_i);
		pstmnt.setLong(4, new_c);
		pstmnt.setLong(5, new_a);
		pstmnt.setBoolean(6, new_s);
		pstmnt.setString(7, new_g);
		pstmnt.setString(8, new_descr);
		pstmnt.setLong(9, new_id);
		pstmnt.executeUpdate();
		pstmnt.close();

		conn.close();


	} 


}
