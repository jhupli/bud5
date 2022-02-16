package onassis.services;

import onassis.dto.P;
import onassis.dto.PInfo;
import onassis.dto.mappers.MapP;
import onassis.dto.mappers.MapPInfo;
import onassis.dto.mappers.MapPb;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Component
public class PInfoService extends ServicesBase {

    MapPInfo rmPInfo = new MapPInfo();
    public List<PInfo> unlockedUntil(String d, BigDecimal i) {
        LocalDate dd = LocalDate.parse(d);
        LocalDate end = dd.plusDays(10L);
        LocalDate start = end.minusDays(-30L);
        final String query = "SELECT p.id, p.d, p.dc, p.i, p.descr as descr, c.descr as c_descr, a.descr as a_descr " +
                " FROM P,C,A " +
                " WHERE p.dc >=:start and p.dc <=:end and p.l = false and c.id=p.c and p.i=:i and a.id=p.a" +
                " ORDER BY p.d ASC ";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("start", start.format(sqldf))
                .addValue("end", end.format(sqldf))
                .addValue("i", i);
        return jdbcTemplate.query(query, namedParameters, new RowMapperResultSetExtractor<PInfo>(rmPInfo));
    }

}