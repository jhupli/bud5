package onassis.services;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;

import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import onassis.OnassisController;
import onassis.dto.A;
import onassis.dto.C;
import onassis.dto.mappers.MapA;
import onassis.dto.mappers.MapC;

@Component
public class AccountService extends ServicesBase {

    MapA rmA = new MapA();

    public List<A> accList() throws SQLException, ParseException {
        final String query = "SELECT id, descr, active, color, credit FROM A ORDER BY id ASC";
        List<A> accList = jdbcTemplate.query(query, new RowMapperResultSetExtractor<A>(rmA));
        return accList;
    }

    public void create(List<A> accounts) {
        String insertSQL =
                "INSERT INTO A(credit, descr, active, color) VALUES(:credit, :descr, :active, :color)";
        for(A a : accounts) {
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("credit", a.credit)
                    .addValue("descr", a.descr)
                    .addValue("active", a.active)
                    .addValue("color", a.color);
            jdbcTemplate.update(insertSQL, namedParameters);
        }
    }

    public void remove(List<Integer> ids) {
        String insertSQL = "DELETE FROM A WHERE id = :id";
        for(Integer id : ids) {
            MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
            jdbcTemplate.update(insertSQL, namedParameters);
        }
    }

    public void modify(List<A> accounts) {
        for(A a : accounts) {
            String setterSQL = "";
            if(null != a.credit) setterSQL += ", credit = :credit";
            if(null != a.descr) setterSQL += ", descr = :descr";
            if(null != a.active) setterSQL += ", active = :active";
            if(null != a.color) setterSQL += ", color = :color";

            setterSQL = "UPDATE A SET "+setterSQL.substring(1) + " WHERE id=:id";
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("credit", a.credit)
                    .addValue("descr", a.descr)
                    .addValue("active", a.active)
                    .addValue("color", a.color)
                    .addValue("id", a.id);
            jdbcTemplate.update(setterSQL, namedParameters);
        }
    }

}