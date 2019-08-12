/**
 * 
 */
package onassis.db.functions;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;


/**
 * @author Janne Hupli
 * @version 1.0 Aug 2017
 */

public class DBTestUtils {

	static String schema = null;
    public static void  statistics_start(NamedParameterJdbcTemplate jdbcTemplate, String _schema) throws SQLException {
        if(null != schema) {
        	throw new RuntimeException("overlapping schemas, only one can be used at a time.");
        }
    	
    	schema = _schema;
    	String sql = "CALL SYSCS_UTIL.SYSCS_SET_RUNTIMESTATISTICS(1)";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );

        sql = "CALL SYSCS_UTIL.SYSCS_SET_XPLAIN_SCHEMA('"+schema+"')";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
    }

    public static void  statistics_end(NamedParameterJdbcTemplate jdbcTemplate) throws SQLException {
        String sql = "CALL SYSCS_UTIL.SYSCS_SET_RUNTIMESTATISTICS(0)";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );

        List<String> tablescans = new ArrayList<>();

        sql = "select st.stmt_text, sp.scan_object_name"
                + "    from "+schema+".sysxplain_scan_props sp, "
                + "         "+schema+".sysxplain_resultsets rs, "
                + "         "+schema+".sysxplain_statements st "
                + "    where st.stmt_id = rs.stmt_id and "
                + "          rs.scan_rs_id = sp.scan_rs_id "; /*and "
                + "          rs.op_identifier = 'TABLESCAN'";*/


        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, new MapSqlParameterSource());
        for(Map map : result) {
            System.err.println(String.format("Caused tablescan: (%s) |%-10s|%-30s|", schema, map.get("SCAN_OBJECT_NAME"), map.get("STMT_TEXT")));
        }

        final String [] dropsqls ={
                "DROP TABLE "+schema+".SYSXPLAIN_STATEMENTS",
                "DROP TABLE "+schema+".SYSXPLAIN_RESULTSETS",
                "DROP TABLE "+schema+".SYSXPLAIN_SCAN_PROPS",
                "DROP TABLE "+schema+".SYSXPLAIN_SORT_PROPS",
                "DROP TABLE "+schema+".SYSXPLAIN_STATEMENT_TIMINGS",
                "DROP TABLE "+schema+".SYSXPLAIN_RESULTSET_TIMINGS"};

        for(String dropsql : dropsqls) {
            jdbcTemplate.update( dropsql, new MapSqlParameterSource() );
        }
        schema = null;
    }
}
