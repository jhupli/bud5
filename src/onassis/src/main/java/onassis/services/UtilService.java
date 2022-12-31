package onassis.services;

import onassis.db.functions.DataProvider;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.UUID;

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