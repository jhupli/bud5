package onassis.services;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import org.springframework.jdbc.core.namedparam.EmptySqlParameterSource;
import org.springframework.stereotype.Component;

import onassis.db.functions.Balance;

/**
 * <Beschreibung>
 * <br>
 * @author jhupli
 */
@Component
public class ChartService extends ServicesBase {

    public List<List<Object>> chartRows(String s, String e) throws SQLException, ParseException {

        LocalDate start = LocalDate.parse(s);
        LocalDate end = LocalDate.parse(e);

        List<List<Object>> accounts = new ArrayList<List<Object>>();

        accounts.add(dates(start, end));
        accounts.add(incomes(true, start, end));
        accounts.add(incomes(false, start, end));

        String accountQuery = "SELECT id FROM a WHERE active ORDER BY id ASC";
        List<Integer> accList = jdbcTemplate.queryForList(accountQuery, new EmptySqlParameterSource(), Integer.class);

        for (Integer id : accList) {
            accounts.add(balancesWithA(id, start, end));
        }

        return accounts;
    }

    private List<Object> dates(LocalDate s, LocalDate e) {
        List<Object> localDates = new ArrayList<Object>();
        localDates.add("x");
        LocalDate localDate = s;
        while (localDate.isBefore(e.plusDays(1))) {
            String fd = localDate.format(df);
            localDates.add(localDate.format(df) + "T00");
            localDate = localDate.plusDays(1);
        }
        return localDates;
    }

    private List<Object> incomes(boolean positives, LocalDate s, LocalDate e) throws SQLException {
        Connection conn = null;
        PreparedStatement sumstmnt = null;
        ResultSet resultSet = null;
        try {
            List<Object> localDates = new ArrayList<Object>();
            Hashtable<String, BigDecimal> hashtable = new Hashtable<String, BigDecimal>();

            LocalDate localDate = s;
            while (localDate.isBefore(e.plusDays(1))) {
                hashtable.put(localDate.format(df), BigDecimal.ZERO);
                localDate = localDate.plusDays(1);
            }
            conn = ds.getConnection();
            String sumSQL = "select d, " + (positives ? "i" : "e") + " from b where d>='" + s.format(sqldf) + "' and d<='" + e.format(sqldf) + "' and a = 0 order by d asc";

            sumstmnt = conn.prepareStatement(sumSQL);
            if (!sumstmnt.execute()) {
                throw new RuntimeException("incomes - execute failed");
            }

            resultSet = sumstmnt.getResultSet();
            if (resultSet != null) {
                while (resultSet.next()) {
                    LocalDate d = LocalDate.parse(resultSet.getString(1));
                    BigDecimal sum = resultSet.getBigDecimal(2);
                    hashtable.put(d.format(df), sum);
                }
            }

            localDates.add(positives ? "I" : "E");
            localDate = s;
            while (localDate.isBefore(e.plusDays(1))) {
                localDates.add(hashtable.get(localDate.format(df)));
                localDate = localDate.plusDays(1);
            }
            return localDates;

        } finally {
            resultSet.close();
            sumstmnt.close();
            conn.close();
        }
    }

    private List<Object> balancesWithA(int a, LocalDate s, LocalDate e) throws SQLException {
        List<Object> localDates = new ArrayList<Object>();
        localDates.add("" + a);
        LocalDate localDate = s;
        while (localDate.isBefore(e.plusDays(1))) {
            localDates.add(Balance.balanceAfter(Date.valueOf(localDate), a));
            localDate = localDate.plusDays(1);
        }
        return localDates;
    }
}