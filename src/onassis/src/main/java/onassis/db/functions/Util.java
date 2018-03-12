package onassis.db.functions;

import java.math.BigDecimal;
import java.sql.SQLException;

import org.springframework.stereotype.Component;

@Component
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
}
