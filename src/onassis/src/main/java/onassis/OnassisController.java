package onassis;

import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import onassis.db.functions.Balance;
import onassis.db.functions.DBTestUtils;
import onassis.db.functions.History;
import onassis.dto.A;
import onassis.dto.B;
import onassis.dto.C;
import onassis.dto.Constant;
import onassis.dto.LogEntry;
import onassis.dto.P;
import onassis.dto.Slice;
import onassis.services.AccountService;
import onassis.services.CategoryService;
import onassis.services.ChartService;
import onassis.services.ConstantService;
import onassis.services.HelloService;
import onassis.services.HistoryLogService;
import onassis.services.MinibarsService;
import onassis.services.PaymentService;
import onassis.services.PieService;
import onassis.services.UtilService;

//@CrossOrigin(origins = "http://localhost:3000") //<-development only
@CrossOrigin
@RestController
public class OnassisController {

    @PostConstruct
    void init() throws SQLException {
        Balance.ds = this.ds;
        History.ds = this.ds;
    }

    @Autowired
    DataSource ds;

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    @Autowired
    HelloService helloService;

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

    private static class Updates<T> {
        List<T> created;

        List<Integer> deleted;

        List<T> modified;

        public List<T> getCreated() {
            return created;
        }

        public void setCreated(List<T> created) {
            this.created = created;
        }

        public List<Integer> getDeleted() {
            return deleted;
        }

        public void setDeleted(List<Integer> deleted) {
            this.deleted = deleted;
        }

        public List<T> getModified() {
            return modified;
        }

        public void setModified(List<T> modified) {
            this.modified = modified;
        }
    }

    @RequestMapping("/hello")
    String hello() {
        return helloService.hello();
    }

    @RequestMapping("/ping")
    String ping() {
        return helloService.ping();
    }

    @RequestMapping(value = "/log", produces = "application/zip")
    public void AuditLogZip(HttpServletResponse response) throws IOException, SQLException {
        //setting headers
        SimpleDateFormat format = new SimpleDateFormat("dd_M_yyyy_hh_mm_ss");
        response.setStatus(HttpServletResponse.SC_OK);
        response.addHeader("Content-Disposition", "attachment; filename=\"Bud_5_Onassis_Log_" + format.format(new java.util.Date()) + ".zip\"");

        historyLogService.uploadLogZip(response.getOutputStream());
    }

    @RequestMapping("minibars")
    List minibars(@RequestParam int cat) {
        return minibarsService.minibars(cat);
    }

    @RequestMapping("chart")
    List<List<Object>> details(@RequestParam String s, @RequestParam String e) throws SQLException, ParseException {
        return chartService.chartRows(s, e);
    }

    @RequestMapping("history")
    List<LogEntry> history(@RequestParam(required = false) Long s, @RequestParam(required = false) Long e, @RequestParam(required = false) Long id) throws SQLException, ParseException {
        if (null != id) {
            return historyLogService.singleHistory(id);
        }
        return historyLogService.allHistory(s, e);
    }

    private @RequestMapping(value = "pie")
    List<Slice> pie(@RequestParam String s, @RequestParam String e) throws SQLException, ParseException {
        return pieService.pieSlices(s, e);
    }

    @RequestMapping("payments")
    List<List<? extends Object>> payments(@RequestParam String e, @RequestParam(required = false) String d, @RequestParam(required = false) String a, @RequestParam(required = false) String c, @RequestParam(required = false) String g, @RequestParam(required = false) String d1, @RequestParam(required = false) String d2, @RequestParam(required = false, value = "ids[]") Set<Integer> ids) throws SQLException, ParseException {

        List<P> paymentsList = null;
        List<B> balancesList = null;

        if (e.equals("l") && null != ids) {
            paymentsList = paymentService.list(ids);
        }

        if (e.equals("d") && null != d) {
            paymentsList = paymentService.day(d);
        }

        if (e.equals("a") && null != a && null != d1 && null != d2) {
            paymentsList = paymentService.account(a, d1, d2);
        }

        if (e.equals("c") && null != c && null != d1 && null != d2) {
            paymentsList = paymentService.category(c, d1, d2);
        }

        if (e.equals("g") && null != g) {
            paymentsList = paymentService.group(g);
        }
        return Arrays.asList(paymentsList, balancesList);
    }

    @RequestMapping(value = "lock")
    void lock(@RequestParam long id, @RequestParam boolean l) throws SQLException, ParseException {
        paymentService.lock(id, l);
    }

    @RequestMapping(value = "payments/update", method = RequestMethod.POST)
    void update(@RequestBody Updates<P> updates) throws SQLException, ParseException {
        paymentService.create(updates.created);
        paymentService.remove(updates.deleted);
        paymentService.modify(updates.modified);
    }

    @RequestMapping("constants")
    List<Constant> constants(String id) throws SQLException, ParseException {
        return constantService.constants(id);
    }

    @RequestMapping("cat/list")
    List<C> catList() throws SQLException, ParseException {
        return categoryService.catList();
    }

    @RequestMapping(value = "cat/update", method = RequestMethod.POST)
    void catUpdate(@RequestBody Updates<C> updates) throws SQLException, ParseException {
        categoryService.create(updates.created);
        //categoryService.remove(updates.deleted);
        categoryService.modify(updates.modified);
    }

    @RequestMapping("acc/list")
    List<A> accList() throws SQLException, ParseException {
        return accountService.accList();
    }

    @RequestMapping(value = "acc/update", method = RequestMethod.POST)
    void accUpdate(@RequestBody Updates<A> updates) throws SQLException, ParseException {
        accountService.create(updates.created);
        //accountService.remove(updates.deleted);
        accountService.modify(updates.modified);
    }

    @RequestMapping("group/newid")
    String newGroupId() throws SQLException, ParseException {
        return utilService.newGroupId();
    }

    @RequestMapping("generate")
    void generate() throws SQLException, ParseException {
        utilService.generateRandomData();
    }

    /*DateTimeFormatter dfs = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
    @RequestMapping(value = "test") 
    void test() throws SQLException, ParseException {
    	LocalDateTime now = LocalDateTime.now();
    	
    	String st = (now).format(dfs);
    	System.out.println("Test starts at : " + st);
    	long startTime = System.currentTimeMillis();
    	//Your test starts here:
    		this.minibars(0);
    		this.minibars(1);
    		this.minibars(2);
    		this.minibars(3);
    		this.minibars(4);
    		this.minibars(5);
    		this.minibars(6);
    	//Your test ends here:
    	long stopTime = System.currentTimeMillis();
    	long elapsedTime = stopTime - startTime;
    	System.out.println("Elapsed time (ms): "+elapsedTime);
    }*/
}