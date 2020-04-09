package onassis.db.functions;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;

import javax.sql.DataSource;

import org.springframework.stereotype.Component;

@Component
public class History {
	public static DataSource ds;

	//@Value(value = "${buddb.jdbc.url:foo}")
	public static String jdbcUrl;
	public static boolean xor(boolean x, boolean y) {
		return ( ( x || y ) && ! ( x && y ) );
	}

    /*
     * locking of p must not be historified, it is checked here
     * input: old & new values values
     *
     * a try to lock and update another filed, must yield exception
     */
	public static void historify(
        boolean old_l, Boolean  new_l,
        int old_id, Date old_dc, Date old_d, BigDecimal old_i, int old_c, int old_a, boolean old_s, String old_g, String old_descr,
        int new_id, Date new_dc, Date new_d, BigDecimal new_i, int new_c, int new_a, boolean new_s, String new_g, String new_descr
        ) throws SQLException, ParseException {

        if (xor(new_l, old_l)) {
            String olds = "" + old_id + "|" + old_dc + "|" + old_d + "|" + old_i + "|" + old_a + "|" + old_s + "|" + old_g + "|" + old_c + "|" + old_descr;
            String news = "" + new_id + "|" + new_dc + "|" + new_d + "|" + new_i + "|" + new_a + "|" + new_s + "|" + new_g + "|" + new_c + "|" + new_descr;
            if (olds.equals(news)) {
                return; //change of l will not be historified
            }
            throw new SQLException("if changing l, no other elements can be simultaenously changed");
        }
        String olds = "" + old_l + "|" + old_id + "|" + old_dc + "|" + old_d + "|" + old_i + "|" + old_a + "|" + old_s + "|" + old_g + "|" + old_c + "|" + old_descr;
        String news = "" + new_l + "|" + new_id + "|" + new_dc + "|" + new_d + "|" + new_i + "|" + new_a + "|" + new_s + "|" + new_g + "|" + new_c + "|" + new_descr;
        if (olds.equals(news)) {
            return; //no change
        }

        String insertSQL = "insert into h(id, dc, d, i, c, c_descr, a, a_descr, s, g, descr, op, hd, rownr) values " +
                "(?, " + //new.id 1
                "?, " + //new.dc  2
                "?, " + //new.d  3
                "?, " + //new.i  4
                "?, " + //new.c  5
                "(select descr from c where id = ?), " + //new.c  6
                "?, " + //new.a  7
                "(select descr from a where id = ?), " + //new.a  8
                "?, " + //new.s  9
                "?, " + //new.g  10
                "?, " + //new.descr 11,
                "'U', current_timestamp, " + "(select max(rownr) + 1 from h " + " where id = ?))"; //new.id 12

        try(Connection conn = ds.getConnection()) {
            conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);

            try(PreparedStatement pstmnt = conn.prepareStatement(insertSQL)) {
                pstmnt.setLong(1, new_id);
                pstmnt.setDate(2, new_dc);
                pstmnt.setDate(3, new_d);
                pstmnt.setBigDecimal(4, new_i);
                pstmnt.setLong(5, new_c);
                pstmnt.setLong(6, new_c);
                pstmnt.setLong(7, new_a);
                pstmnt.setLong(8, new_a);
                pstmnt.setBoolean(9, new_s);
                pstmnt.setString(10, new_g);
                pstmnt.setString(11, new_descr);
                pstmnt.setLong(12, new_id);

                pstmnt.executeUpdate();
            }
        }
	}

    public static void history(
            boolean old_l, Boolean  new_l,
            int old_id, Date old_d, BigDecimal old_i, int old_c, int old_a, boolean old_s, String old_g, String old_descr,
            int new_id, Date new_d, BigDecimal new_i, int new_c, int new_a, boolean new_s, String new_g, String new_descr
    ) throws SQLException {
        //throw new SQLException("binary backward compatibility");
    }
}
