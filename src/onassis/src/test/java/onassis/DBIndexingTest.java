package onassis;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import onassis.db.functions.Triggers;
import onassis.dto.A;
import onassis.dto.B;
import onassis.dto.H;
import onassis.dto.P;
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

public class DBIndexingTest extends DBTestUtils {

    SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");

    Date d1, d2, d3 = null;

    BigDecimal i1, i2, i3, i4;

    int a1 = 1;

    int a2 = 2;

    int c = 1;

    @Before
    public void before() throws Exception {
        d1 = new Date(df.parse("2.1.2016").getTime());
        d2 = new Date(df.parse("4.1.2016").getTime());
        d3 = new Date(df.parse("6.1.2016").getTime());

        i1 = bd(-2);
        i2 = bd(-1);
        i3 = bd(1);
        i4 = bd(2);
        
        insert_basedata(2);
        //statistics_start();
    }

    @After
    public void after() throws Exception {
        //statistics_end();
        empty_db();
    }

    @Test
    public void  t_none() throws Exception {
        insert_p(d2, i2, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d2, i2, i2, a2, a2); //no changes
    }

    @Test
    public void  t_d_1() throws Exception {
        insert_p(d2, i2, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d3, i2, i2, a2, a2);
    }

    @Test
    public void  t_d_2() throws Exception {
        insert_p(d2, i2, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d1, i2, i2, a2, a2);
    }

    @Test
    public void  t_i_1() throws Exception {
        insert_p(d2, i2, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d2, i2, i1, a2, a2);
    }

    @Test
    public void  t_i_2() throws Exception {
        insert_p(d2, i2, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d2, i2, i3, a2, a2);
    }

    @Test
    public void  t_i_3() throws Exception {
        insert_p(d2, i3, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d2, i3, i2, a2, a2);
    }

    @Test
    public void  t_i_4() throws Exception {
        insert_p(d2, i3, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d2, i3, i4, a2, a2);
    }

    @Test
    public void  t_a_4() throws Exception {
        insert_p(d2, i3, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d2, i3, i3, a2, a1);
    }

    @Test
    public void  t_d_i_a_1() throws Exception {
        insert_p(d2, i3, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d1, i3, i2, a2, a1);
    }

    @Test
    public void  t_d_i_a_2() throws Exception {
        insert_p(d2, i3, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d3, i3, i4, a2, a1);
    }

    @Test
    public void  t_d_i_a_3() throws Exception {
        insert_p(d2, i2, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d3, i2, i3, a2, a1);
    }

    @Test
    public void  t_d_i_a_4() throws Exception {
        insert_p(d2, i2, c, a2);
        Triggers.balancesUpdateTriggerDebug(d2, d3, i2, i1, a2, a1);
    }

}