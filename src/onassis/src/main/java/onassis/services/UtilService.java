package onassis.services;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import onassis.db.functions.Balance;
import onassis.db.functions.DataProvider;
import onassis.db.functions.History;
import onassis.dto.A;
import onassis.dto.mappers.MapA;

@Component
public class UtilService extends ServicesBase {
    @PostConstruct
    void init() {
        DataProvider.ds = this.ds;
    }

    public void generateRandomData() throws SQLException, ParseException {
        DataProvider.random_data();
    }

    public String newGroupId() throws SQLException, ParseException {
        int length = 1;
        boolean used = true;
        String newVar = "";
        String sql = "SELECT COUNT(*) FROM P WHERE g=:g";
        while (used) {
            newVar = UUID.randomUUID().toString().substring(0, length);
            MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("g", newVar);
            int total = jdbcTemplate.queryForObject(sql, namedParameters, Integer.class);
            used = total > 0;
            length++;
        }
        return newVar;
    }
}