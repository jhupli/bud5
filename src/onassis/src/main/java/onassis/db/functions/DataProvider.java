package onassis.db.functions;

import java.awt.Color;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import javax.sql.DataSource;

import org.springframework.stereotype.Component;

@Component
public class DataProvider {
	//@Autowired
	public static DataSource ds = null;

	/*@Autowired 
	OnassisConfiguration appConstants;*/
	

	//@Value(value = "${buddb.jdbc.url:foo}")
	public static String jdbcUrl;
	
	public static long getDifferenceDays(Date d1, Date d2) {
	    long diff = d2.getTime() - d1.getTime();
	    return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
	}
    
	public static Date addDays(Date date, int days)
    {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days); //minus number would decrement the days
        return new Date(cal.getTimeInMillis());
    }
	

	private static String randomColor() {
		Color c = new Color((int)(Math.random() * 0x1000000));
		String hex = String.format("#%02x%02x%02x", c.getRed(), c.getGreen(), c.getBlue());  
		return hex;
	}
	
	public static void random_data()
	        throws SQLException, ParseException {
		//System.out.println("ranodom: generating data to p");
		
		SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
		
		int count = 1000;
		
		long MAX_I = 1120;
		long MIN_I = -1100;

		Date MAX_D = new Date(df.parse("1.1.2017").getTime());
		Date MIN_D = new Date(df.parse("31.12.2018").getTime());

		int MAX_C = 12;
		int MIN_C = 1;
		
		int MAX_A = 6;
		int MIN_A = 1;
		
		long I_DIFF = MAX_I - MIN_I;
		long D_DIFF = getDifferenceDays(MIN_D, MAX_D);
		long C_DIFF = MAX_C - MIN_C;
		long A_DIFF = MAX_A - MIN_A;
				
		Connection conn = null;
		/*
		if (null == ds) {
			String connectionURL = "jdbc:derby:C:\\Users\\jahup1\\Google Drive\\bud5\\bud5\\src\\onassis\\BudDB.v5";
    		conn = DriverManager.getConnection(connectionURL);
		} else {
			conn = ds.getConnection();
		}*/
		
		if (null == ds) {
    		//String connectionURL = "jdbc:default:connection";
    		//String connectionURL = "jdbc:derby:/Users/Janne/tmp/BudDB";

			//String connectionURL = "jdbc:derby:/Users/Janne/tmp/BudDB";
			//String connectionURL = "jdbc:derby:C:\\Users\\jahup1\\Google Drive\\bud5\\bud5\\src\\onassis\\BudDB";
    		//conn = DriverManager.getConnection(connectionURL);
		    //if(null == jdbcUrl) {
		    //    jdbcUrl = "jdbc:derby:C:\\Users\\jahup1\\Google Drive\\bud5\\bud5\\src\\onassis\\BudDB.v5";
		    //}
			conn = DriverManager.getConnection(jdbcUrl);
		} else {
			//conn = ds.getConnection();
		}

		for(int c = MIN_C; c<=MAX_C ; c++) {
			conn = ds.getConnection();
			
			String insertSQL =
					"INSERT INTO C(DESCR,I,ACTIVE,COLOR) VALUES(?,?,?,?)";
			PreparedStatement pstmnt = conn.prepareStatement(insertSQL);
			BigDecimal i = new BigDecimal(MIN_I + I_DIFF * Math.random()).setScale(2, RoundingMode.HALF_UP);
			pstmnt.setString(1, "Cat "+c);
			pstmnt.setBigDecimal(2, i);
			pstmnt.setBoolean(3, true);
			pstmnt.setString(4, randomColor());
			pstmnt.executeUpdate();
			System.out.println("added cat "+c);
			
			pstmnt.close();
		}
		
		for(int a = MIN_A; a<=MAX_A ; a++) {
			conn = ds.getConnection();
			
			String insertSQL =
					"INSERT INTO A(DESCR,ACTIVE,COLOR,CREDIT) VALUES(?,?,?,?)";
			PreparedStatement pstmnt = conn.prepareStatement(insertSQL);
			BigDecimal i = new BigDecimal(MIN_I + I_DIFF * Math.random()).setScale(2, RoundingMode.HALF_UP);
			pstmnt.setString(1, "Acc "+a);
			pstmnt.setBoolean(2, true);
			pstmnt.setString(3, randomColor());
			pstmnt.setBoolean(4, false);
			pstmnt.executeUpdate();
			System.out.println("added acc "+a);
			
			pstmnt.close();
		}
		for (int ix = 0; ix<count; ix++) {
			conn = ds.getConnection();
			conn.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
			String insertSQL =
					"INSERT INTO P(D,I,C,A,L,S,G,DESCR) VALUES(?,?,?,?,?,?,?,?)";
			
			 String sumSQL =
					"select sum(i) from p where d<=? and a=?"; 

			String balanceSQL =
					"select b from b where d=? and a=?";
			PreparedStatement pstmnt = conn.prepareStatement(insertSQL);
			PreparedStatement sumstmnt = conn.prepareStatement(sumSQL);
			PreparedStatement balancestmnt = conn.prepareStatement(balanceSQL);
			ResultSet set = null;
			System.out.println((ix+1) + "/" + count );
			BigDecimal i = new BigDecimal(MIN_I + I_DIFF * Math.random()).setScale(2, RoundingMode.HALF_UP);
			Date d = addDays(MIN_D, (int) Math.round(D_DIFF * Math.random()));
			int c = (int) Math.round(MIN_C + C_DIFF * Math.random());
			int a = (int) Math.round(MIN_A + A_DIFF * Math.random());
			boolean l = Math.random() >= 0.5;
			
			pstmnt.setDate(1, d);
			pstmnt.setBigDecimal(2, i);
			pstmnt.setInt(3, c);
			pstmnt.setInt(4, a);
			pstmnt.setBoolean(5, l);
			pstmnt.setBoolean(6, true);
			pstmnt.setString(7, ""+ix);
			pstmnt.setString(8, "description of "+ix);
			
			pstmnt.executeUpdate();
			System.out.println("isolation_1="+conn.getTransactionIsolation());
			conn.commit();
			System.out.println("isolation_2="+conn.getTransactionIsolation());

		    int tx = conn.getMetaData().getDefaultTransactionIsolation();
		    String txtxt=null;
		    switch(tx) {
		      case Connection.TRANSACTION_NONE :
		        txtxt = "TRANSACTION_NONE"; break;
		      case Connection.TRANSACTION_READ_COMMITTED :
		        txtxt = "TRANSACTION_READ_COMMITTED"; break;
		      case Connection.TRANSACTION_READ_UNCOMMITTED :
		        txtxt = "TRANSACTION_READ_UNCOMMITTED"; break;
		      case Connection.TRANSACTION_REPEATABLE_READ :
		        txtxt = "TRANSACTION_REPEATABLE_READ"; break;
		          case Connection.TRANSACTION_SERIALIZABLE :
		        txtxt = "TRANSACTION_SERIALIZABLE"; break;
		      default:
		        txtxt = "UNKNOWN!!";
		    }
		    System.out.println(txtxt);
			

			sumstmnt.setDate(1, d);
			sumstmnt.setInt(2, a);
			balancestmnt.setDate(1, d);
			balancestmnt.setInt(2, a);
			
		    if( !sumstmnt.execute() 
		    		|| ((set = sumstmnt.getResultSet())==null)
		    		|| !set.next()
		    		) {
		    	System.out.println("sum execute failed");
		    }
		    BigDecimal sum = (BigDecimal) set.getBigDecimal(1);

		    if( !balancestmnt.execute() 
		    		|| ((set = balancestmnt.getResultSet())==null)
		    		|| !set.next()
		    		) {
		    	System.out.println("balance execute failed");
		    }
		    BigDecimal balance = (BigDecimal) set.getBigDecimal(1);
		    if (sum.compareTo(balance)!=0) {
			    System.out.println("ERROR sum="+sum+" balance="+balance);
				System.out.println((ix+1) + "/" + count + ": " +
						"d: " + d +
						", i: " + i +
						", a: " + a );
				break;
		    }
		    set.close();
			pstmnt.close();
			sumstmnt.close();
			balancestmnt.close();
			conn.close();
		}//for


	} 


}
