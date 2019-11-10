/*
  ------------------------------------------------------------------------------
        (c) by data experts gmbh
              Postfach 1130
              Woldegker Str. 12
              17001 Neubrandenburg

  Dieses Dokument und die hierin enthaltenen Informationen unterliegen
  dem Urheberrecht und duerfen ohne die schriftliche Genehmigung des
  Herausgebers weder als ganzes noch in Teilen dupliziert oder reproduziert
  noch manipuliert werden.
*/

package onassis.services;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.format.DateTimeFormatter;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;

import onassis.db.functions.DBTestUtilsDB;

abstract public class ServicesBase {
    @Autowired
    public DataSource ds = null;

    @Autowired
    public NamedParameterJdbcTemplate jdbcTemplate;

    DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMdd");

    DateTimeFormatter sqldf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    private NamedParameterJdbcTemplate jdbcTemplateStash;
    private Connection con = null;
    public void startStatistics() throws SQLException {
    	jdbcTemplateStash = jdbcTemplate;
    	con = ds.getConnection();
        DBTestUtilsDB.statistics_start(con, "ONASSISSCHEMA");
        jdbcTemplate =  new NamedParameterJdbcTemplate(new SingleConnectionDataSource(con, false));
    }
    
    public void endStatistics() throws SQLException {
        DBTestUtilsDB.statistics_end(con, "ONASSISSCHEMA");
        con.close();
        jdbcTemplate = jdbcTemplateStash;
    }
    
    
}