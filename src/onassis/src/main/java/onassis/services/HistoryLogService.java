package onassis.services;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import com.opencsv.CSVWriter;
import com.opencsv.ResultSetHelperService;

import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import onassis.dto.B;
import onassis.dto.H;
import onassis.dto.LogEntry;
import onassis.dto.mappers.MapB;
import onassis.dto.mappers.MapH;

@Component
public class HistoryLogService extends ServicesBase {

    MapH rmH = new MapH();

    public void uploadLogZip(OutputStream out) throws IOException, SQLException {
        ZipOutputStream zipOutputStream = new ZipOutputStream(out);
        Writer writer = new OutputStreamWriter(zipOutputStream);

        CSVWriter csvWriter = new CSVWriter(writer);
        zipOutputStream.putNextEntry(new ZipEntry("auditlog.csv"));

        ResultSetHelperService helper = new ResultSetHelperService();
        helper.setDateTimeFormat("dd.MM.yyyy HH:mm:ss.SSS");
        helper.setDateFormat("dd.MM.yyyy");
        csvWriter.setResultService(helper);

        String query = "SELECT hd, op, id, rownr, d, i, c, c_descr, a, a_descr, s, g, descr FROM h ORDER BY hd ASC, rownr ASC ";
        try (Connection conn = ds.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet result = pstmt.executeQuery()) {
            while (result.next()) {
                csvWriter.writeAll(result, false);
            }
        } finally {
            csvWriter.flush();
            zipOutputStream.closeEntry();
            csvWriter.close();
            writer.close();
            zipOutputStream.close();
        }
    }

    public List<LogEntry> singleHistory(Long id) throws SQLException, ParseException {
        List<LogEntry> singleHistory = new ArrayList<LogEntry>();
        List<H> history = getHistoryRows(id);
        singleHistory.add(new LogEntry(history, 0));
        return singleHistory;
    }

    public List<LogEntry> allHistory(Long s, Long e) throws SQLException, ParseException {

        if (s != null && e != null) {
            return null;
        }

        Long t = null;
        String hidQuery = "SELECT id, rownr FROM h";
        if (s != null) {
            hidQuery += " WHERE HD < ?  ORDER BY hd DESC";
            t = s;
        } else if (e != null) {
            hidQuery += " WHERE HD > ?  ORDER BY hd ASC";
            t = e;
        } else {
            hidQuery += " ORDER BY hd DESC";
        }

        hidQuery += " fetch first 51 rows only"; //note: this must be page_size + 1 in order for client to detect last/first page

        List<LogEntry> allhistory = new ArrayList<LogEntry>();
        try (Connection conn = this.ds.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(hidQuery);

        ) {
            if (t != null) {
                pstmt.setTimestamp(1, new java.sql.Timestamp(t));
            }
            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    List<H> history = getHistoryRows(result.getLong("id"));
                    allhistory.add(new LogEntry(history, result.getInt("rownr")));
                }
            }
        }

        if (null != e) {
            Collections.reverse(allhistory);
        }
        return allhistory;
    }

    private List<H> getHistoryRows(Long id) {
        String paymetsQuery = "SELECT hd, op, rownr, id, d, i, c, c_descr, a, a_descr, s, g, descr FROM h where id=:id ORDER BY rownr ASC ";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
        List<H> history = jdbcTemplate.query(paymetsQuery, namedParameters, new RowMapperResultSetExtractor<H>(rmH));
        return history;
    }
}