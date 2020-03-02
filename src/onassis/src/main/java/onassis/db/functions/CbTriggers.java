/*
  ------------------------------------------------------------------------------
        (c) by data experts gmbh
              Postfach 1130
              Woldegker Str. 12
              17001 Neubrandenburg

  Dieses Dokument und die hierin enthaltenen Informationen unterliegen
  dem Urheberrecht und duerfen ohne die schriftliche Genehmigung des
  Herausgebers weder als ganzes noch in Teilen dupliziert oder reproduziert
  noch manipuliert werden.
*/

package onassis.db.functions;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;

import javax.sql.DataSource;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * <Beschreibung> <br>
 * 
 * @author jhupli
 */

@Component
public class CbTriggers {

	static public DataSource ds;

	private static void c(Connection con, int c, int c2, BigDecimal i, Date d) throws SQLException, ParseException {
		
		createIfNotExists(con, d, c2);
		
		String sql = " update cb set b = b - ?  where c = ? and d >= ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();

			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, c2);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();
		}

		sql = " update cb set i = i - ?  where c = ? and d = ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();

			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, c2);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();
		}
	}

	public static void i(Connection con, int c, BigDecimal s1, BigDecimal s2, Date d)
			throws SQLException, ParseException {

	    createIfNotExists(con, d, c);
        createIfNotExists(con, d, 0);

		BigDecimal delta = s1.subtract(s2);

		String sql = " update cb set b = b - ? where c = ? and d >= ? ";
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, delta);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();
		}

        sql = " update cb set i = i - ? where c = ? and d = ? ";
        try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
            pstmnt.setBigDecimal(1, delta);
            pstmnt.setLong(2, c);
            pstmnt.setDate(3, d);
            pstmnt.executeUpdate();
        }
	}

	private static void d(Connection con, int c, BigDecimal i, Date d, Date d2) throws SQLException, ParseException {
		
		createIfNotExists(con, d2, c);

		String sql = null;
		
		if( d2.after(d) ) {
			sql = " update cb set b = b - ? where c = ? and d >= ? and d < ? ";
		} else {
			sql = " update cb set b = b + ? where c = ? and d < ? and d >= ? ";
		}
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, d);
			pstmnt.setDate(4, d2);
			pstmnt.executeUpdate();
		}
		
		sql = " update cb set i = i - ? where c = ? and d = ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();
		}
		
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, d2);
			pstmnt.executeUpdate();
		}
	}

	public static void clear0(Connection con) throws SQLException {
		String sql = " delete from cb where i = 0 ";
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.executeUpdate();
		}
	}

	private static void createIfNotExists(Connection con, Date d, int c) throws SQLException {
		String sql = "select c from cb where d = ? and c = ? ";
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setDate(1, d);
			pstmnt.setLong(2, c);
			pstmnt.execute();

			try (ResultSet set = pstmnt.getResultSet()) {
				if (set == null || !set.next()) {
					BigDecimal balance = Balance._cBalanceBefore(con, d, c);
					sql = " insert into cb(d, b, i, c) values ( ?, ?, 0, ?) ";
					try (PreparedStatement ipstmnt = con.prepareStatement(sql)) {
						ipstmnt.setDate(1, d);
						ipstmnt.setBigDecimal(2, balance);
						ipstmnt.setLong(3, c);
						ipstmnt.executeUpdate();
					}
				}
			}
		}
	}
		
    static NamedParameterJdbcTemplate jdbcTemplate;
    public static void cBalancesUpdateTrigger( Date d, Date d2, BigDecimal i, BigDecimal i2, int c, int c2) throws SQLException, ParseException {
        _cBalancesUpdateTrigger( d, d2, i, i2, c, c2, false);
    }

    public static void cBalancesUpdateTriggerDebug( Date d, Date d2, BigDecimal i, BigDecimal i2, int c, int c2) throws SQLException, ParseException {
        _cBalancesUpdateTrigger( d, d2, i, i2, c, c2, true);
    }

    private static void _cBalancesUpdateTrigger( Date d, Date d2, BigDecimal i, BigDecimal i2, int c, int c2, boolean dblog) throws SQLException, ParseException {
		
		boolean cChanged =  (c != c2);
		boolean iChanged =  (i != i2);
		boolean dChanged =  (d.compareTo(d2) != 0);
		
		try( Connection con = ds.getConnection(); ) {
			
			jdbcTemplate = new NamedParameterJdbcTemplate(ds);
			if (dblog) {
			    DBTestUtilsDB.statistics_start(con, "TRIGGERSCHEMA");
            }
			
            if (cChanged) {
                c(con, c, c2, i, d);
                c = c2;
            }
            if (iChanged) {
                i(con, c, i, i2, d);
                i = i2;
            }

            if(dChanged) {
                d(con, c, i, d, d2);
            }
            clear0(con);
            if (dblog) {
                DBTestUtilsDB.statistics_end(con, "TRIGGERSCHEMA");
            }
        }
    }
}