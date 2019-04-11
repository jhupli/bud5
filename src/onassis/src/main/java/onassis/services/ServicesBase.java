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

import java.time.format.DateTimeFormatter;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

/**
 * <Beschreibung>
 * <br>
 * @author jhupli
 */
abstract public class ServicesBase {
    @Autowired
    DataSource ds = null;

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMdd");

    DateTimeFormatter sqldf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
}