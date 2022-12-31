package onassis.services;

import onassis.dto.Slice;
import onassis.dto.mappers.MapSlice;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.SQLException;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.List;

@Component
public class PieService extends ServicesBase {
    MapSlice rmSlice = new MapSlice();

    public List<Slice> pieSlices(@RequestParam String s, @RequestParam String e) throws SQLException, ParseException {

        LocalDate day1 = LocalDate.parse(s);
        LocalDate day2 = LocalDate.parse(e);

        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("d1", day1.format(sqldf))
                .addValue("d2", day2.format(sqldf));

        String paymetsQuery = "SELECT sum(i) as sl, c FROM P WHERE i<=0 AND dc BETWEEN :d1 and :d2 AND s GROUP BY c ORDER BY sl ASC";
        List<Slice> slices = jdbcTemplate.query(paymetsQuery,
                namedParameters,
                new RowMapperResultSetExtractor<Slice>(rmSlice));

        paymetsQuery = "SELECT sum(i) as sl, c FROM P WHERE i>0 AND dc BETWEEN :d1 and :d2 AND s GROUP BY c ORDER BY sl ASC";
        slices.addAll(jdbcTemplate.query(paymetsQuery,
                namedParameters,
                new RowMapperResultSetExtractor<Slice>(rmSlice)));

        return slices;
    }
}