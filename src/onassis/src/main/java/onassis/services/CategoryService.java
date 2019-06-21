package onassis.services;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;

import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import onassis.dto.C;
import onassis.dto.mappers.MapC;

@Component
public class CategoryService extends ServicesBase {

    MapC rmC = new MapC();

    public List<C> catList() throws SQLException, ParseException {
        final String query = "SELECT id, i, descr, active, color FROM C ORDER BY id ASC";
        List<C> catList = jdbcTemplate.query(query, new RowMapperResultSetExtractor<C>(rmC));
        return catList;
    }

    public void create(List<C> categories) {
        String insertSQL =
                "INSERT INTO C(i, descr, active, color) VALUES(:i, :descr, :active, :color)";
        for(C c : categories) {
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("i", c.i)
                    .addValue("descr", c.descr)
                    .addValue("active", c.active)
                    .addValue("color", c.color);
            jdbcTemplate.update(insertSQL, namedParameters);
        }
    }

    public void remove(List<Integer> ids) {
        String deleteSQL = "DELETE FROM C WHERE id = :id";
        for(Integer id : ids) {
            MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
            jdbcTemplate.update(deleteSQL, namedParameters);
        }
    }

    public void modify(List<C> categories) {
        for(C c : categories) {
            String setterSQL = "";
            if(null != c.i) setterSQL += ", i = :i";
            if(null != c.descr) setterSQL += ", descr = :descr";
            if(null != c.active) setterSQL += ", active = :active";
            if(null != c.color) setterSQL += ", color = :color";

            setterSQL = "UPDATE C SET "+setterSQL.substring(1) + " WHERE id=:id";
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("i", c.i)
                    .addValue("descr", c.descr)
                    .addValue("active", c.active)
                    .addValue("color", c.color)
                    .addValue("id", c.id);

            jdbcTemplate.update(setterSQL, namedParameters);
        }
    }

}