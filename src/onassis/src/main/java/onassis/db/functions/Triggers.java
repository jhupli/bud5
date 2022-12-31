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
public class Triggers {

	static public DataSource ds;
	/*
	 * a------------------------------------------- 
	 * r(a, i, d) -> r(a2), a!=0 
	 * 1° create r(a2) if not there 
	 * 2° Δ=i: b-=Δ where >= d, i-=Δ 
	 * 3° b(a2)+=Δ where >= d, i(a2)+=Δ 
	 * 4° delete r if i=0 <- is this really necessary? 
	 * (r0 does not change because d or i are not changing) 
	 * 5° smallest balance where >=d 
	 * -------------------------------------------
	 */

	private static void a(Connection con, int a, int a2, BigDecimal i, Date d) throws SQLException, ParseException {
		
		createIfNotExists(con, d, a2);
		
		String sql = " update b " + " set b = b - ? " + " where a = ? and d >= ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, a);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();

			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, a2);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();
		}

		sql = " update b " + " set " + (i.compareTo(BigDecimal.ZERO) > 0 ? " i = i - ?" : "e = e - ? ")
				+ " where a = ? and d = ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, a);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();

			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, a2);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();

		}
	}

	/*
	 * i------------------------------------------- 
	 * r(a, i, d) -> r(i2), a!=0 
	 * 1° Δ=i2-i: b+=Δ, b0+=Δ where >= d, i+=Δ, i0+=Δ (i,e)
	 * 2° delete r, r0 if i=0 <- is this really necessary? 
	 * 3° smallest balance where >= d
	 * -------------------------------------------
	 */
	public static void i(Connection con, int a, BigDecimal s1, BigDecimal s2, Date d)
			throws SQLException, ParseException {

		createIfNotExists(con, d, a);
		createIfNotExists(con, d, 0);

		BigDecimal delta = s1.subtract(s2);
		String sql = " update b " + " set b = b - ? " + " where (a = ? or a = 0) and d >= ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, delta);
			pstmnt.setLong(2, a);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();
		}

		/*
		 * How (i,e) is calculated: if( s1>0 && s2>0) i += (s2 - s1) if( s1<0 &&
		 * s2<0) e += (s2 - s1)
		 * 
		 * if( s1>=0 && s2=<0) i -= s1, e += s2 if( s1<0 && s2>0) i += s2, e -=
		 * s1
		 */
		if (s1.signum() == 1 && s2.signum() == 1) {
			sql = " update b " + " set i = i - ? " + " where (a = ? or a = 0) and d = ? ";

			try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
				pstmnt.setBigDecimal(1, delta);
				pstmnt.setLong(2, a);
				pstmnt.setDate(3, d);
				pstmnt.executeUpdate();
			}
		} else if (s1.signum() != 1 && s2.signum() != 1) {
			sql = " update b " + " set e = e - ? " + " where (a = ? or a = 0) and d = ? ";

			try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
				pstmnt.setBigDecimal(1, delta);
				pstmnt.setLong(2, a);
				pstmnt.setDate(3, d);
				pstmnt.executeUpdate();
			}
		} else if (s1.signum() == 1) {
			sql = " update b " + " set i = i - ?, e = e + ? " + " where (a = ? or a = 0) and d = ? ";

			try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
				pstmnt.setBigDecimal(1, s1);
				pstmnt.setBigDecimal(2, s2);
				pstmnt.setLong(3, a);
				pstmnt.setDate(4, d);
				pstmnt.executeUpdate();
			}
		} else {
			sql = " update b " + " set i = i + ?, e = e - ? " + " where (a = ? or a = 0) and d = ? ";

			try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
				pstmnt.setBigDecimal(1, s2);
				pstmnt.setBigDecimal(2, s1);
				pstmnt.setLong(3, a);
				pstmnt.setDate(4, d);
				pstmnt.executeUpdate();
			}
		}
	}

	/*
	 * 
	 * 3:d------------------------------------------- 
	 * r(a, i, d) -> r(d2), a!=0
	 * 1° create r0(d2) if not there 
	 * 2° Δ=i: b+=Δ, b0+=Δ where between d and d2, i0-=Δ, i0(d2)+=Δ, i(d2)+=Δ
	 * 3° delete r <-not necessary
	 * 4° delete r0 if i=0 and e=0
	 * 5° smallest balance where between d and d2
	 */
	private static void d(Connection con, int a, BigDecimal i, Date d, Date d2) throws SQLException, ParseException {
		
		createIfNotExists(con, d2, a);
		createIfNotExists(con, d2, 0);
		
		String sql = null;
		
		if( d2.after(d) ) {
			sql = " update b " + " set b = b - ? " + " where (a = ? or a = 0) and d >= ? and d < ?";
		} else {
			sql = " update b " + " set b = b + ? " + " where (a = ? or a = 0) and d < ? and d >= ?";
		}
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, a);
			pstmnt.setDate(3, d);
			pstmnt.setDate(4, d2);
			pstmnt.executeUpdate();
		}
		
		sql = " update b " + " set " + (i.compareTo(BigDecimal.ZERO) > 0 ? " i = i - ?" : "e = e - ? ")
				+ " where (a = ? or a = 0) and d = ? ";

		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i);
			pstmnt.setLong(2, a);
			pstmnt.setDate(3, d);
			pstmnt.executeUpdate();
		}
		
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setBigDecimal(1, i.negate());
			pstmnt.setLong(2, a);
			pstmnt.setDate(3, d2);
			pstmnt.executeUpdate();
		}
	}

	public static void clear0(Connection con) throws SQLException {
		String sql = " delete from b where i = 0 and e = 0";
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.executeUpdate();
		}
	}

    private static void smallestB(Connection con, Date d) throws SQLException, ParseException {
        String sql = " select d from b where a = 0 and d >= ? ";
        try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
              pstmnt.setDate(1, d);
              pstmnt.execute();
              try(ResultSet rset = pstmnt.getResultSet()) {
                  updateB(con, rset);
              }
        }
    }

    private static void smallestB(Connection con, Date d, Date d2) throws SQLException, ParseException {
        Date startDate =  d.after(d2) ? d2 : d;
        Date endDate =  d.after(d2) ? d : d2;
        String sql = " select d from b where a = 0 and d between ? and ? ";
        try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
            pstmnt.setDate(1, startDate);
            pstmnt.setDate(2, endDate);
            pstmnt.execute();
            try(ResultSet rset = pstmnt.getResultSet()) {
                updateB(con, rset);
            }
        }
    }

    private static void updateB(Connection con, ResultSet rset) throws SQLException, ParseException {
        String sql = "update b set smallestb = ? " + " where a = 0 and d = ? ";
        try (PreparedStatement updateStmt = con.prepareStatement(sql)) {
            while (rset.next()) {
                Date dx = rset.getDate("d");
                BigDecimal smallestBalance = Balance._smallestBalanceAt(con, dx);
                updateStmt.setBigDecimal(1, smallestBalance);
                updateStmt.setDate(2, dx);
                updateStmt.executeUpdate();

            }
        }
    }

	private static void createIfNotExists(Connection con, Date d, int a) throws SQLException {
		String sql = "select a from b where d = ? and a = ?";
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setDate(1, d);
			pstmnt.setLong(2, a);
			pstmnt.execute();

			try (ResultSet set = pstmnt.getResultSet()) {
				if (set == null || !set.next()) {
					BigDecimal balance = Balance._balanceBefore(con, d, a);
					sql = " insert into b(d, b, i, e, a, smallestb) " + " values( ?, ?, 0, 0, ?, 0) ";
					try (PreparedStatement ipstmnt = con.prepareStatement(sql)) {
						ipstmnt.setDate(1, d);
						ipstmnt.setBigDecimal(2, balance);
						ipstmnt.setLong(3, a);
						ipstmnt.executeUpdate();
					}
				}
			}
		}
	}

		
    static NamedParameterJdbcTemplate jdbcTemplate;
    public static void balancesUpdateTrigger( Date d, Date d2, BigDecimal i, BigDecimal i2, int a, int a2) throws SQLException, ParseException {
        _balancesUpdateTrigger( d, d2, i, i2, a, a2, false);
    }

    public static void balancesUpdateTriggerDebug( Date d, Date d2, BigDecimal i, BigDecimal i2, int a, int a2) throws SQLException, ParseException {
        _balancesUpdateTrigger( d, d2, i, i2, a, a2, true);
    }

    private static void _balancesUpdateTrigger( Date d, Date d2, BigDecimal i, BigDecimal i2, int a, int a2, boolean dblog) throws SQLException, ParseException {
		
		boolean aChanged =  (a != a2);
		boolean iChanged =  (i.compareTo(i2) != 0);
		boolean dChanged =  (d.compareTo(d2) != 0);
		if(!aChanged && !iChanged && !dChanged) {
		    return;
        }

		try( Connection con = ds.getConnection(); ) {
			
			jdbcTemplate = new NamedParameterJdbcTemplate(ds);
			if (dblog) {
			    DBTestUtilsDB.statistics_start(con, "TRIGGERSCHEMA");
            }
			
            if (aChanged) {
                a(con, a, a2, i, d);
                a = a2;
            }
            if (iChanged) {
                i(con, a, i, i2, d);
                i = i2;
            }
            if ( aChanged || iChanged)  {
                smallestB(con, d);
            }
            if(dChanged) {
                d(con, a, i, d, d2);
                smallestB(con, d, d2);
            }
            clear0(con);
            if (dblog) {
                DBTestUtilsDB.statistics_end(con, "TRIGGERSCHEMA");
            }
        }
    }
}