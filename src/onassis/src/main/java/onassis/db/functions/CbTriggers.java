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

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.text.ParseException;

/**
 * <Beschreibung> <br>
 * 
 * @author jhupli
 */

@Component
public class CbTriggers {

	static public DataSource ds;

	private static void c(Connection con, int c, int c2, BigDecimal i, Date dc) throws SQLException, ParseException {
		
		createIfNotExists(con, dc, c2);
		
		String sql = " update cb set b = b - ?  where c = ? and dc >= ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, dc);
			pstmnt.executeUpdate();

			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, c2);
			pstmnt.setDate(3, dc);
			pstmnt.executeUpdate();
		}

		sql = " update cb set i = i - ?  where c = ? and dc = ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, dc);
			pstmnt.executeUpdate();

			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, c2);
			pstmnt.setDate(3, dc);
			pstmnt.executeUpdate();
		}
	}

	public static void i(Connection con, int c, BigDecimal s1, BigDecimal s2, Date dc)
			throws SQLException, ParseException {

	    createIfNotExists(con, dc, c);
        createIfNotExists(con, dc, 0);

		BigDecimal delta = s1.subtract(s2);

		String sql = " update cb set b = b - ? where c = ? and dc >= ? ";
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, delta);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, dc);
			pstmnt.executeUpdate();
		}

        sql = " update cb set i = i - ? where c = ? and dc = ? ";
        try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
            pstmnt.setBigDecimal(1, delta);
            pstmnt.setLong(2, c);
            pstmnt.setDate(3, dc);
            pstmnt.executeUpdate();
        }
	}

	private static void d(Connection con, int c, BigDecimal i, Date dc, Date dc2) throws SQLException, ParseException {
		
		createIfNotExists(con, dc2, c);

		String sql = null;
		
		if( dc2.after(dc) ) {
			sql = " update cb set b = b - ? where c = ? and dc >= ? and dc < ? ";
		} else {
			sql = " update cb set b = b + ? where c = ? and dc < ? and dc >= ? ";
		}
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, dc);
			pstmnt.setDate(4, dc2);
			pstmnt.executeUpdate();
		}
		
		sql = " update cb set i = i - ? where c = ? and dc = ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, dc);
			pstmnt.executeUpdate();
		}
		
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, c);
			pstmnt.setDate(3, dc2);
			pstmnt.executeUpdate();
		}
	}

	public static void clear0(Connection con) throws SQLException {
		String sql = " delete from cb where i = 0 ";
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.executeUpdate();
		}
	}

	private static void createIfNotExists(Connection con, Date dc, int c) throws SQLException {
		String sql = "select c from cb where dc = ? and c = ? ";
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setDate(1, dc);
			pstmnt.setLong(2, c);
			pstmnt.execute();

			try (ResultSet set = pstmnt.getResultSet()) {
				if (set == null || !set.next()) {
					BigDecimal balance = Balance._cBalanceBefore(con, dc, c);
					sql = " insert into cb(dc, b, i, c) values ( ?, ?, 0, ?) ";
					try (PreparedStatement ipstmnt = con.prepareStatement(sql)) {
						ipstmnt.setDate(1, dc);
						ipstmnt.setBigDecimal(2, balance);
						ipstmnt.setLong(3, c);
						ipstmnt.executeUpdate();
					}
				}
			}
		}
	}
		
    static NamedParameterJdbcTemplate jdbcTemplate;
    public static void cBalancesUpdateTrigger( Date dc, Date dc2, BigDecimal i, BigDecimal i2, int c, int c2) throws SQLException, ParseException {
        _cBalancesUpdateTrigger( dc, dc2, i, i2, c, c2, false);
    }

    public static void cBalancesUpdateTriggerDebug( Date dc, Date dc2, BigDecimal i, BigDecimal i2, int c, int c2) throws SQLException, ParseException {
        _cBalancesUpdateTrigger( dc, dc2, i, i2, c, c2, true);
    }

    private static void _cBalancesUpdateTrigger( Date dc, Date dc2, BigDecimal i, BigDecimal i2, int c, int c2, boolean dblog) throws SQLException, ParseException {
		
		boolean cChanged =  (c != c2);
        boolean iChanged =  (i.compareTo(i2) != 0);
		boolean dChanged =  (dc.compareTo(dc2) != 0);

        if(!cChanged && !iChanged && !dChanged) {
            return;
        }

		try( Connection con = ds.getConnection(); ) {
			
			jdbcTemplate = new NamedParameterJdbcTemplate(ds);
			if (dblog) {
			    DBTestUtilsDB.statistics_start(con, "TRIGGERSCHEMA");
            }
			
            if (cChanged) {
                c(con, c, c2, i, dc);
                c = c2;
            }
            if (iChanged) {
                i(con, c, i, i2, dc);
                i = i2;
            }

            if(dChanged) {
                d(con, c, i, dc, dc2);
            }
            clear0(con);
            if (dblog) {
                DBTestUtilsDB.statistics_end(con, "TRIGGERSCHEMA");
            }
        }
    }
}