package onassis;

import java.sql.Connection;
import java.sql.Date;
import java.text.SimpleDateFormat;

import com.jayway.restassured.RestAssured;
import com.jayway.restassured.response.Response;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import onassis.db.functions.DBTestUtilsDB;
import onassis.db.functions.DataProvider;
import onassis.services.AccountService;

import static com.jayway.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = App.class)
@WebAppConfiguration
@IntegrationTest({"server.port:0",
				//jdbc:derby:BudDB.v5;create=true;
				  "spring.datasource.url:jdbc:derby:memory:onassis;create=true;"})
        	//	"spring.datasource.url:jdbc:h2:mem:onassis;DB_CLOSE_ON_EXIT=FALSE"})
public class OnassisControllerTest {

    @Autowired
    OnassisController onassisController;

    @Autowired
    AccountService accountService;

    @Autowired
    DBFunctionsTest dbTestUtils;

    @Value("${local.server.port}")
    int port;

    @Before
    public void before() throws Exception {
        SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
        DataProvider.random_data(50,
                1120, -1100,
                new Date(df.parse("8.3.2019").getTime()),new Date(df.parse("9.3.2020").getTime()),
                12, 1,
                6, 1);
        RestAssured.port = port;
        
        /*con = onassisController.ds.getConnection();
        DBTestUtilsDB.statistics_start(con, "ONASSISSCHEMA");
        NamedParameterJdbcTemplate jdbcTemplate =  new NamedParameterJdbcTemplate(new SingleConnectionDataSource(con, false));
        accountService.jdbcTemplate = jdbcTemplate;
        System.err.print(jdbcTemplate);*/
    }

    @After
    public void after() throws Exception {
       //DBTestUtilsDB.statistics_end(con, "ONASSISSCHEMA");
        dbTestUtils.empty_db();
        //con.close();
    }

    @Test
    public void hello() throws Exception {
        given().auth().basic("user","kakkakikkare").
                when().get("/hello").then()
               .body(is("Hello World, This is Onassis 5.0.0 (Keitele) ! Can you here me?"));
    }

    @Test
    public void accList() throws Exception {
    	accountService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/acc/list");
        accountService.endStatistics();
        System.out.println(response.asString());
    }



    @Test
    public void testCalc() throws Exception {
      /*  given().param("left", 100)
                .param("right", 200)
                .get("/calc")
                .then()
                .body("left", is(100))
                .body("right", is(200))
                .body("answer", is(300)); */
    }
}