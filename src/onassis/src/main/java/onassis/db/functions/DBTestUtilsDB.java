/**
 * 
 */
package onassis.db.functions;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
/**
 * @author Janne Hupli
 * @version 1.0 Aug 2017
 */

public class DBTestUtilsDB {


    public static void  statistics_start(Connection con, String schema) throws SQLException {
        String sql = "CALL SYSCS_UTIL.SYSCS_SET_RUNTIMESTATISTICS(1)";
        PreparedStatement st = con.prepareStatement(sql);
        st.execute();

        sql = "CALL SYSCS_UTIL.SYSCS_SET_XPLAIN_SCHEMA('"+schema+"')";
        st = con.prepareStatement(sql);
        st.execute();

    }

    public static void  statistics_end(Connection con, String schema) throws SQLException {
        String sql = "CALL SYSCS_UTIL.SYSCS_SET_RUNTIMESTATISTICS(0)";

        PreparedStatement st = con.prepareStatement(sql);
        st.execute();

        sql = "select st.stmt_text, sp.scan_object_name, rs.op_identifier "
                + "    from "+schema+".sysxplain_scan_props sp, "
                + "         "+schema+".sysxplain_resultsets rs, "
                + "         "+schema+".sysxplain_statements st "
                + "    where st.stmt_id = rs.stmt_id and "
                + "          rs.scan_rs_id = sp.scan_rs_id ";/*and "
                + "          rs.op_identifier = 'TABLESCAN'"; */


        try (PreparedStatement pstmnt = con.prepareStatement(sql)) {
            pstmnt.execute();

            try (ResultSet rset = pstmnt.getResultSet()) {
            	boolean containsResults = false;
                while (rset.next()) {
                	containsResults = true;
                    System.out.println(String.format("%s|%-18s|%-16s|%s",
                            schema,
                            rset.getString("SCAN_OBJECT_NAME"),
                            rset.getString("OP_IDENTIFIER"),
                            rset.getString("STMT_TEXT")
                            ));
                    if(rset.getString("OP_IDENTIFIER").equals("TABLESCAN")) {
                        throw new RuntimeException("Tablescan occurred: see log.");
                    }
                }
                if (!containsResults) {    
            		throw new RuntimeException("No statistics result: are you sure you executed some SQL?");
            	}
            }
        }
        final String [] dropsqls ={
                "DROP TABLE "+schema+".SYSXPLAIN_STATEMENTS",
                "DROP TABLE "+schema+".SYSXPLAIN_RESULTSETS",
                "DROP TABLE "+schema+".SYSXPLAIN_SCAN_PROPS",
                "DROP TABLE "+schema+".SYSXPLAIN_SORT_PROPS",
                "DROP TABLE "+schema+".SYSXPLAIN_STATEMENT_TIMINGS",
                "DROP TABLE "+schema+".SYSXPLAIN_RESULTSET_TIMINGS"};


        for(String dropsql : dropsqls) {
            st = con.prepareStatement( dropsql );
            st.execute();
        }
        schema = null;
    }
}
