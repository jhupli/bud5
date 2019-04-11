package onassis.services;

import java.util.List;

import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

import onassis.dto.B;
import onassis.dto.mappers.MapB;

/**
 * <Beschreibung>
 * <br>
 * @author jhupli
 */
@Component
public class MinibarsService extends ServicesBase {
    MapB rmB = new MapB();

    public List minibars(int cat) {
        String query = null;
        if (cat > 0) {
            query = "SELECT d,0 as b,sum(positive(i)) as i, sum(negative(i)) as e, -1 as a, 0 as smallestb FROM P WHERE C = :cat "
                    + "GROUP BY D ORDER BY D ASC ";
        } else {
            query = "SELECT d, b, i, e, a, smallestb FROM B WHERE A=0 "
                    + "ORDER BY D ASC ";
        }

        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("cat", cat);

        return jdbcTemplate.query(query,
                namedParameters,
                new RowMapperResultSetExtractor<B>(rmB));
    }
}