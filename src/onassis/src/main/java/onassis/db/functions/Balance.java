package onassis.db.functions;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Balance {
	@Autowired
	static public DataSource ds;

    public static BigDecimal smallestBalanceAt(Date d) throws SQLException {

        BigDecimal res = null;
        try (Connection conn = ds.getConnection()) {
            conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
            try (PreparedStatement pstmnt = conn.prepareStatement("select id from a")) {
                if (!pstmnt.execute()) {
                    throw new RuntimeException("execute failed");
                }
                try (ResultSet set = pstmnt.getResultSet()) {
                    if (set == null) {
                        return BigDecimal.ZERO;
                    }

                    while (set.next()) {
                        int id = set.getInt(1);
                        BigDecimal b = balanceAfter(d, id);
                        if (res == null || b.compareTo(res) < 0) {
                            res = b;
                        }
                    }
                }
            }
        }
        return res;
    }
	
	public static BigDecimal balanceAfter(Date d, int a)
	        throws SQLException {
			Calendar c = Calendar.getInstance();
			c.setTime(d);
			c.add(Calendar.DATE, 1);
			return balanceBefore(new Date(c.getTimeInMillis()), a);
	}

    public static BigDecimal balanceBefore(Date d, int a) throws SQLException {
        try (Connection conn = ds.getConnection()) {
            conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
            try (PreparedStatement pstmnt = conn.prepareStatement("select b from b where d<? and a=? order by d desc fetch first 1 rows only")) {
                if (pstmnt == null) {
                    throw new RuntimeException("prepareStatement failed");
                }
                pstmnt.setDate(1, d);
                pstmnt.setInt(2, a);
                if (!pstmnt.execute()) {
                    throw new RuntimeException("execute failed");
                }
                try (ResultSet set = pstmnt.getResultSet()) {
                    if (set == null) {
                        return BigDecimal.ZERO;
                    }
                    if (!set.next()) {
                        return BigDecimal.ZERO;
                    }
                    BigDecimal bd = (BigDecimal) set.getBigDecimal(1);
                    return bd;
                }
            }
        }
    }
    
    public static Boolean hasUnlockedPayments(Date d) throws SQLException {
        try (Connection conn = ds.getConnection()) {
            conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
            try (PreparedStatement pstmnt = conn.prepareStatement("select id from p where d=? and l=false fetch first 1 rows only")) {
                if (pstmnt == null) {
                    throw new RuntimeException("prepareStatement failed");
                }
                pstmnt.setDate(1, d);
                if (!pstmnt.execute()) {
                    throw new RuntimeException("execute failed");
                }
                try (ResultSet set = pstmnt.getResultSet()) {
                    if (set == null) {
                        return false;
                    }
                    if (!set.next()) {
                        return false;
                    }
                    return true;
                }
            }
        }
    }
}
