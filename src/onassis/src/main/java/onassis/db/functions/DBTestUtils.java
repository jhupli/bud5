/**
 * 
 */
package onassis.db.functions;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;


/**
 * @author Janne Hupli
 * @version 1.0 Aug 2017
 */

public class DBTestUtils {

    public static void  statistics_start(NamedParameterJdbcTemplate jdbcTemplate, String schema) throws SQLException {
        String sql = "CALL SYSCS_UTIL.SYSCS_SET_RUNTIMESTATISTICS(1)";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );

        sql = "CALL SYSCS_UTIL.SYSCS_SET_XPLAIN_SCHEMA('"+schema+"')";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
    }

    public static void  statistics_end(NamedParameterJdbcTemplate jdbcTemplate, String schema) throws SQLException {
        String sql = "CALL SYSCS_UTIL.SYSCS_SET_RUNTIMESTATISTICS(0)";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );

        List<String> tablescans = new ArrayList<>();

        sql = "select st.stmt_text, sp.scan_object_name"
                + "    from "+schema+".sysxplain_scan_props sp, "
                + "         "+schema+".sysxplain_resultsets rs, "
                + "         "+schema+".sysxplain_statements st "
                + "    where st.stmt_id = rs.stmt_id and "
                + "          rs.scan_rs_id = sp.scan_rs_id and "
                + "          rs.op_identifier = 'TABLESCAN'";

        jdbcTemplate.query(sql, rs -> {
            System.err.println(String.format("Caused tablescan: (%s) |%-10s|%-30s|", schema, rs.getString(2), rs.getString(1)));});

        final String [] dropsqls ={
                "DROP TABLE myschema.SYSXPLAIN_STATEMENTS",
                "DROP TABLE myschema.SYSXPLAIN_RESULTSETS",
                "DROP TABLE myschema.SYSXPLAIN_SCAN_PROPS",
                "DROP TABLE myschema.SYSXPLAIN_SORT_PROPS",
                "DROP TABLE myschema.SYSXPLAIN_STATEMENT_TIMINGS",
                "DROP TABLE myschema.SYSXPLAIN_RESULTSET_TIMINGS"};

        for(String dropsql : dropsqls) {
            jdbcTemplate.update( dropsql, new MapSqlParameterSource() );
        }
    }
}
