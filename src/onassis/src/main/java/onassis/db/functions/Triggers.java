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

/**
 * <Beschreibung> <br>
 * 
 * @author jhupli
 */
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
		smallestB(con, d, null);
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
		BigDecimal delta = s2.subtract(s1);
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
			sql = " update b " + " set i = i + ? " + " where (a = ? or a = 0) and d = ? ";

			try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
				pstmnt.setBigDecimal(1, delta);
				pstmnt.setLong(2, a);
				pstmnt.setDate(3, d);
				pstmnt.executeUpdate();
			}
		} else if (s1.signum() != 1 && s2.signum() != 1) {
			sql = " update b " + " set e = e + ? " + " where (a = ? or a = 0) and d = ? ";

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
	 * 2° Δ=i: b+=Δ, b0+=Δ where between d and d2, i0-=Δ, i0(d2)+=Δ, i-=Δ, i(d2)+=Δ
	 * 3° smallest balance where between d and d2
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
	// TODO eristä Connection, s.e. kaikki käyttää samaa, ei luoda joka paikassa
	// uutta (:/ kato jos vanhojaki vois optiomoida
	public static void smallestB(Connection con, Date d, Date d2) throws SQLException, ParseException {
		String sql = " update b set smallestb = smallestBalanceAt(d) " + " where a = 0 and "
				+ (null != d2 ? " d >= ? " : " d between ? and ? ");
		try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
			pstmnt.setDate(1, d);
			if (null != d2) {
				pstmnt.setDate(2, d2);
			}
			pstmnt.executeUpdate();
		}
	}

	/*
	 * public static void history( boolean old_l, Boolean new_l, int old_id,
	 * Date old_d, BigDecimal old_i, int old_c, int old_a, boolean old_s, String
	 * old_g, String old_descr, int new_id, Date new_d, BigDecimal new_i, int
	 * new_c, int new_a, boolean new_s, String new_g, String new_descr ) throws
	 * SQLException, ParseException {
	 * 
	 * if (xor(new_l, old_l)) { String olds = "" + old_id + "|" + old_d + "|" +
	 * old_i + "|" + old_a + "|" + old_s + "|" + old_g + "|" + old_c + "|" +
	 * old_descr; String news = "" + new_id + "|" + new_d + "|" + new_i + "|" +
	 * new_a + "|" + new_s + "|" + new_g + "|" + new_c + "|" + new_descr; if
	 * (olds.equals(news)) { return; //change of l will not be historified }
	 * throw new
	 * SQLException("if changing l, no other elements can be simultaenously changed"
	 * ); } String olds = "" + old_l + "|" + old_id + "|" + old_d + "|" + old_i
	 * + "|" + old_a + "|" + old_s + "|" + old_g + "|" + old_c + "|" +
	 * old_descr; String news = "" + new_l + "|" + new_id + "|" + new_d + "|" +
	 * new_i + "|" + new_a + "|" + new_s + "|" + new_g + "|" + new_c + "|" +
	 * new_descr; if (olds.equals(news)) { return; //no change }
	 * 
	 * String insertSQL =
	 * "insert into h(id, d, i, c, c_descr, a, a_descr, s, g, descr, op, hd, rownr) values "
	 * + "(?, " + //new.id 1 "?, " + //new.d 2 "?, " + //new.i 3 "?, " + //new.c
	 * 4 "(select descr from c where id = ?), " + //new.c 5 "?, " + //new.a 6
	 * "(select descr from a where id = ?), " + //new.a 7 "?, " + //new.s 8
	 * "?, " + //new.g 9 "?, " + //new.descr 10, "'U', current_timestamp, " +
	 * "(select max(rownr) + 1 from h " + " where id = ?))"; //new.id 11
	 * 
	 * try(Connection conn = ds.getConnection()) {
	 * conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
	 * 
	 * try(PreparedStatement pstmnt = conn.prepareStatement(insertSQL)) {
	 * pstmnt.setLong(1, new_id); pstmnt.setDate(2, new_d);
	 * pstmnt.setBigDecimal(3, new_i); pstmnt.setLong(4, new_c);
	 * pstmnt.setLong(5, new_c); pstmnt.setLong(6, new_a); pstmnt.setLong(7,
	 * new_a); pstmnt.setBoolean(8, new_s); pstmnt.setString(9, new_g);
	 * pstmnt.setString(10, new_descr); pstmnt.setLong(11, new_id);
	 * 
	 * pstmnt.executeUpdate(); } } }
	 */
	private static void createIfNotExists(Connection con, Date d, int a) throws SQLException, ParseException {
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
						pstmnt.setDate(1, d);
						pstmnt.setBigDecimal(2, balance);
						pstmnt.setLong(3, a);
						pstmnt.executeUpdate();
					}
				}
			}
		}
	}
}