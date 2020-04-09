package onassis.services;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import onassis.db.functions.Balance;
import onassis.db.functions.CbTriggers;
import onassis.db.functions.History;
import onassis.db.functions.Triggers;
import onassis.dto.A;
import onassis.dto.mappers.MapA;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class AccountService extends ServicesBase {

	@PostConstruct
    void init() throws SQLException {
        Balance.ds = this.ds;
        History.ds = this.ds;
        Triggers.ds = this.ds;
        CbTriggers.ds = this.ds;
    }

    MapA rmA = new MapA();

    public List<A> accList() throws SQLException, ParseException {
        final String query = "SELECT id, descr, active, color, credit FROM A WHERE id > :id ORDER BY id ASC";
        
        //obsolete WHERE -clause was added to force DB to use index, see https://docs.oracle.com/javadb/10.8.3.0/tuning/ctundepth36205.html
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", -1);
        
        List<A> accList = jdbcTemplate.query(query, namedParameters, new RowMapperResultSetExtractor<A>(rmA));
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
        /*String insertSQL = "DELETE FROM A WHERE id = :id";
        for(Integer id : ids) {
            MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
            jdbcTemplate.update(insertSQL, namedParameters);
        }*/
    }

    public void modify(List<A> accounts) {
        for(A a : accounts) {
            String setterSQL = "";
            //if(null != a.credit) setterSQL += ", credit = :credit";
            if(null != a.descr) setterSQL += ", descr = :descr";
            if(null != a.active) setterSQL += ", active = :active";
            if(null != a.color) setterSQL += ", color = :color";

            setterSQL = "UPDATE A SET "+setterSQL.substring(1) + " WHERE id=:id";
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    //.addValue("credit", a.credit)
                    .addValue("descr", a.descr)
                    .addValue("active", a.active)
                    .addValue("color", a.color)
                    .addValue("id", a.id);
            jdbcTemplate.update(setterSQL, namedParameters);
        }
    }

}