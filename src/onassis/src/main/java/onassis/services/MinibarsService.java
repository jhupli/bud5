package onassis.services;

import java.util.List;

import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import onassis.dto.B;
import onassis.dto.mappers.MapB;

@Component
public class MinibarsService extends ServicesBase {
    MapB rmB = new MapB();

    @SuppressWarnings("rawtypes")
	public List minibars(int cat) {
        String query = null;
        MapSqlParameterSource namedParameters = new MapSqlParameterSource();
        if (cat > 0) {
            query = "SELECT d,0 as b,sum(positive(i)) as i, sum(negative(i)) as e, -1 as a, 0 as smallestb, false as l FROM P WHERE C = :cat "
                    + "GROUP BY D ORDER BY D ASC ";
            namedParameters.addValue("cat", cat);
        } else {
        	//obsolete WHERE -clause was added to force DB to use index, see https://docs.oracle.com/javadb/10.8.3.0/tuning/ctundepth36205.html
            query = "SELECT d, b, i, e, a, smallestb, l FROM B WHERE A = :acc "
                    + "ORDER BY D ASC ";
            namedParameters.addValue("acc", 0);
        }

        return jdbcTemplate.query(query,
                namedParameters,
                new RowMapperResultSetExtractor<B>(rmB));
    }
}