package onassis;

import java.sql.Date;
import java.text.SimpleDateFormat;

import com.jayway.restassured.RestAssured;
import com.jayway.restassured.response.Response;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import onassis.db.functions.DataProvider;
import onassis.services.AccountService;
import onassis.services.CategoryService;
import onassis.services.ChartService;
import onassis.services.ConstantService;
import onassis.services.HistoryLogService;
import onassis.services.MinibarsService;
import onassis.services.PaymentService;
import onassis.services.PieService;
import onassis.services.UtilService;

import static com.jayway.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = App.class)
@WebAppConfiguration
@IntegrationTest({"server.port:0",
				//jdbc:derby:BudDB.v5;create=true;
				  "spring.datasource.url:jdbc:derby:memory:onassis;create=true;"})
        	    //"spring.datasource.url:jdbc:h2:mem:onassis;DB_CLOSE_ON_EXIT=FALSE"})
public class OnassisControllerTest {

    @Autowired
    MinibarsService minibarsService;

    @Autowired
    ChartService chartService;

    @Autowired
    HistoryLogService historyLogService;

    @Autowired
    PieService pieService;

    @Autowired
    PaymentService paymentService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    AccountService accountService;

    @Autowired
    ConstantService constantService;

    @Autowired
    UtilService utilService;

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
    }

    @After
    public void after() throws Exception {
        dbTestUtils.empty_db();
    }

    @Test
    public void hello() throws Exception {
        given().auth().basic("user","kakkakikkare").
                when().get("/hello").then()
               .body(is("Hello World, This is Onassis 5.0.0 (Keitele) ! Can you here me?"));
    }

    @Test
    public void minibarsService_0() throws Exception {
    	minibarsService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/minibars?cat=0");
        minibarsService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void minibarsService_1() throws Exception {
    	minibarsService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/minibars?cat=1");
        minibarsService.endStatistics();
        System.out.println(response.asString());
    }
   
    @Test
    public void minibarsService_123() throws Exception {
    	minibarsService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/minibars?cat=123");
        minibarsService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void chartService() throws Exception {
    	chartService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/chart?s=2019-03-08&e=2020-03-09");
        chartService.endStatistics();
        System.out.println(response.asString());
    }     
    
    @Test
    public void historyLogService_all() throws Exception {
    	historyLogService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/history");
        historyLogService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void historyLogService_s() throws Exception {
    	historyLogService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/history?s=9999999999999");
        historyLogService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void historyLogService_e() throws Exception {
    	historyLogService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/history?e=1111111111111");
        historyLogService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void historyLogService_s_e() throws Exception {
    	historyLogService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/history?s=9999999999999&e=1111111111111");
        historyLogService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void historyLogService_id() throws Exception {
    	historyLogService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/history?id=1");
        historyLogService.endStatistics();
        System.out.println(response.asString());
    }

    @Test
    public void pieService() throws Exception {
    	pieService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/pie?s=2019-03-08&e=2020-03-09");
        pieService.endStatistics();
        System.out.println(response.asString());
    }

    @Test
    public void pieService_null() throws Exception {
    	pieService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/pie");
        pieService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void paymentService_l() throws Exception {
    	paymentService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/payments?e=l&ids[]=2&ids[]=3");
        paymentService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void paymentService_d() throws Exception {
    	paymentService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/payments?e=d&d=2019-03-08");
        paymentService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void paymentService_a() throws Exception {
    	paymentService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/payments?e=a&a=1&d1=2019-03-08&d1=2020-03-09");
        paymentService.endStatistics();
        System.out.println(response.asString());
    }

    @Test
    public void paymentService_c() throws Exception {
    	paymentService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/payments?e=c&c=1&d1=2019-03-08&d1=2020-03-09");
        paymentService.endStatistics();
        System.out.println(response.asString());
    }

    @Test
    public void paymentService_g() throws Exception {
    	paymentService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/payments?e=g&g=foo");
        paymentService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void paymentService_foo() throws Exception {
    	paymentService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/payments");
        paymentService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void categoryService_list() throws Exception {
    	categoryService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/cat/list");
        categoryService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void accountService_list() throws Exception {
    	accountService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/acc/list");
        accountService.endStatistics();
        System.out.println(response.asString());
    }

    
    @Test
    public void constantService_cat() throws Exception {
    	minibarsService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/constants?id=cat");
        minibarsService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void constantService_acc() throws Exception {
    	minibarsService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/constants?id=acc");
        minibarsService.endStatistics();
        System.out.println(response.asString());
    }

    @Test
    public void constantService_foo() throws Exception {
    	minibarsService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/constants?id=acc");
        minibarsService.endStatistics();
        System.out.println(response.asString());
    }
    
    @Test
    public void utilService_foo() throws Exception {
    	utilService.startStatistics();
        Response response =
        given().auth().basic("user","kakkakikkare").	
        when().get("/group/newid");
        utilService.endStatistics();
        System.out.println(response.asString());
    }
   



}