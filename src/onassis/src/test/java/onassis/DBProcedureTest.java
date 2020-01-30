package onassis;

import onassis.db.functions.DBTestUtilsDB;
import onassis.dto.A;
import onassis.dto.B;
import onassis.dto.H;
import onassis.dto.P;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

import static org.junit.Assert.assertTrue;

/**
 * @author Janne Hupli
 * @version 1.0 Aug 2017
 * 
 * (Jdbc) Tests for db-functions 
 *  -without JPA (Hibernate) -layer.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@IntegrationTest({"spring.datasource.url:jdbc:derby:memory:onassisTest;create=true;"})

@WebAppConfiguration
@SpringBootApplication
@SpringApplicationConfiguration( classes = {
        SecurityConfig.class,
        App.class
} )

public class DBProcedureTest extends DBTestUtils{
    
    SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
    Date d1, d2, d3, d4 = null;
    int a = 1;
    int a2 = 2;
    int a3 = 3;
    int c = 1;
    int c2 = 2;
    
    @Before
    public void before() throws Exception {
        con = ds.getConnection();
        jdbcTemplate = new NamedParameterJdbcTemplate(new SingleConnectionDataSource(con, true));

        d1 = new Date(df.parse("2.1.2016").getTime());
        d2 = new Date(df.parse("4.1.2016").getTime());
        d3 = new Date(df.parse("6.1.2016").getTime());
        d4 = new Date(df.parse("8.1.2016").getTime());
        insert_basedata();
    }

    @After
    public void after() throws Exception {
        empty_db();
        con.close();
    }

    @Test(expected = UncategorizedSQLException.class)
    public void p_i_310() throws Exception {
        int id = insert_p(d2, d1, bd(1), c, a);
    }

    @Test(expected = UncategorizedSQLException.class)
    public void p_u_310() throws Exception {
        int id = insert_p(d1, d2, bd(1), c, a);
        update_p(d3, null, bd(1), null, null, id, null);
    }

    @Test(expected = UncategorizedSQLException.class)
    public void p_u_311() throws Exception {
        int id = insert_p(d2, d3, bd(1), c, a);
        update_p(null, d1, bd(1), null, null, id, null);
    }
}
