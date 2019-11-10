package onassis.db.functions;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Date;

public class Util {

	public static BigDecimal positive(BigDecimal x)
	        throws SQLException {
		 if (x.compareTo(BigDecimal.ZERO) > 0) {
			 return x;
		 }
		 return BigDecimal.ZERO;
	}

	public static BigDecimal negative(BigDecimal x)
	        throws SQLException {
		 if (x.compareTo(BigDecimal.ZERO) < 0) {
			 return x;
		 }
		 return BigDecimal.ZERO;
	}
	
	public static Date earlier(Date d1, Date d2)
	        throws SQLException {
		 if(d1.compareTo(d2) <= 0) {
			 return d1;
		 }
		 return d2;
	}
	
	public static BigDecimal ifThenElseDecimal(Boolean ifClause, BigDecimal thenDecimal, BigDecimal elseDecimal)
	        throws SQLException {
		 if(ifClause) {
			 return thenDecimal;
		 }
		 return elseDecimal;
	}
}
