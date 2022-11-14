package onassis.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import onassis.dto.P;
import onassis.dto.mappers.MapP;
import onassis.dto.mappers.MapPb;

@Component
public class    PaymentService extends ServicesBase {

    MapP rmP = new MapP();
    MapPb rmPb = new MapPb();

    public List<P> list(Set<Integer> ids) {
        final String query = "SELECT id, dc, d, i, a, c, l, s, g, descr, balanceAfter(d, a) as b  FROM P WHERE id in (:ids) ORDER BY a ASC";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("ids", ids);
        return jdbcTemplate.query(query, namedParameters, new RowMapperResultSetExtractor<P>(rmP));
    }

    public List<P> day(String d) {
        LocalDate day = LocalDate.parse(d);
        final String query = "SELECT id, dc, d, i, a, c, l, s, g, descr, 0 as b FROM P WHERE d=:day " +
                             " UNION " +
                             "SELECT id, dc, d, i, a, c, l, s, g, descr, 0 as b FROM P WHERE dc=:day " +
                             " ORDER BY a ASC";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("day", day.format(sqldf));
        return jdbcTemplate.query(query, namedParameters, new RowMapperResultSetExtractor<P>(rmP));
    }

    public List<P> account(String a, String d1, String d2) {
        LocalDate day1 = LocalDate.parse(d1);
        LocalDate day2 = LocalDate.parse(d2);

        final String paymetsQuery = "SELECT id, dc, d, i, a, c, l, s, g, descr, balanceAfter(d, a) as b FROM P WHERE d BETWEEN :d1 and :d2 AND a=:a ORDER BY d ASC";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("d1", day1.format(sqldf))
                .addValue("d2", day2.format(sqldf))
                .addValue("a", a);
        return jdbcTemplate.query(paymetsQuery, namedParameters, new RowMapperResultSetExtractor<P>(rmPb));
    }

    public List<P> category(String c, String d1, String d2) {
        LocalDate day1 = LocalDate.parse(d1);
        LocalDate day2 = LocalDate.parse(d2);

        final String paymetsQuery = "SELECT id, dc, d, i, a, c, l, s, g, descr, cBalanceAfter(dc, c) as b FROM P WHERE dc BETWEEN :d1 and :d2 AND c=:c ORDER BY dc ASC";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("d1", day1.format(sqldf))
                .addValue("d2", day2.format(sqldf))
                .addValue("c", c);
        return jdbcTemplate.query(paymetsQuery, namedParameters, new RowMapperResultSetExtractor<P>(rmPb));
    }

    public List<P> group(String g) {
        final String paymetsQuery = "SELECT id, dc, d, i, a, c, l, s, g, descr, 0 as b FROM P WHERE g=:g ORDER BY d ASC";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("g", g);
        return jdbcTemplate.query(paymetsQuery, namedParameters, new RowMapperResultSetExtractor<P>(rmP));
    }



    public void lock(long id, boolean l, String d) {
        final String lUpdateSQL = "update p set l=:l WHERE id=:id ";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("l", l);
        jdbcTemplate.update(lUpdateSQL, namedParameters);
        if(null != d && l) {
            LocalDate day = LocalDate.parse(d);
            final String dcUpdateSQL = "update p set d=:d WHERE id=:id AND dc <= :d";
            namedParameters = new MapSqlParameterSource()
                    .addValue("id", id)
                    .addValue("d", d);
            if(0 == jdbcTemplate.update(dcUpdateSQL, namedParameters)) {
                final String dcUpdateSQL2 = "update p set d=:d, dc=:d WHERE id=:id ";
                jdbcTemplate.update(dcUpdateSQL2, namedParameters);
            };
        }
    }

    public void create(List<P> payments) {
        String insertSQL =
                "INSERT INTO P(dc, d, i, c, a, s, g, descr, l) VALUES(:dc, :d, :i, :c, :a, :s, :g, :descr, :l)";
        for(P p : payments) {
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("dc", p.dc)
                    .addValue("d", p.d)
                    .addValue("i", p.i)
                    .addValue("c", p.c)
                    .addValue("a", p.a)
                    .addValue("l", p.l == null ? false : true)
                    .addValue("s", p.s)
                    .addValue("g", p.g)
                    .addValue("descr", p.descr);
            jdbcTemplate.update(insertSQL, namedParameters);
        }
    }

    public void remove(List<Integer> ids) {
        String insertSQL = "DELETE FROM P WHERE id = :id";
        for(Integer id : ids) {
            MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
            jdbcTemplate.update(insertSQL, namedParameters);
        }
    }

    public void modify(List<P> payments) {
        for(P p : payments) {
            String setterSQL = "";
            if(null != p.dc) setterSQL += ", dc = :dc";
            if(null != p.d) setterSQL += ", d = :d";
            if(null != p.i) setterSQL += ", i = :i";
            if(null != p.c) setterSQL += ", c = :c";
            if(null != p.a) setterSQL += ", a = :a";
            if(null != p.s) setterSQL += ", s = :s";
            if(null != p.g) setterSQL += ", g = :g";
            if(null != p.descr) setterSQL += ", descr = :descr";

            setterSQL = "UPDATE P SET "+setterSQL.substring(1) + " WHERE id=:id";
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("id", p.id)
                    .addValue("dc", p.dc)
                    .addValue("d", p.d)
                    .addValue("i", p.i)
                    .addValue("c", p.c)
                    .addValue("a", p.a)
                    .addValue("s", p.s)
                    .addValue("g", p.g)
                    .addValue("descr", p.descr);
            jdbcTemplate.update(setterSQL, namedParameters);
        }
    }

}