package onassis;

import static org.junit.Assert.assertTrue;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import onassis.db.functions.DBTestUtilsDB;
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

public class DBFunctionsTest extends DBTestUtils{
    
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
        DBTestUtilsDB.statistics_start(con, "FUNCTIONSCHEMA");
        //statistics_start();
    }


    @After
    public void after() throws Exception {
        DBTestUtilsDB.statistics_end(con, "FUNCTIONSCHEMA");
        //statistics_end();
        if(!this.CB_MODE) {
            xcheck_b0_b();
        }
        empty_db();
        con.close();
    }
    
    public void xcheck_b0_b() throws Exception {
    	 //for every 0-account row in balances, there must be at least 1 non-0 account row
    	 for(B b : getBalances(0)) {
    		 assert(getBalancesCount(b.getD()) >=1);
    	 }
    	 //for every non 0-account row in balances, there must be exactly 1 0-account row
    	 for(A a : getAccounts()) {
    		 for(B b : getBalances(a.id)) {
    			 assertTrue(null != select_b(b.getD(), 0));
    		 }
    	 }
    	 assertTrue(0 == get0BalancesCount());
    }
    
    public void xcheck_b0_smallestb() throws Exception {
    	//TOBE DONE
    }
    
    @Test
    public void triggers_h_010() throws Exception {
    	int id = insert_p(new Date(df.parse("1.1.2016").getTime()), bd(1), c, a);
    	P p0 = select_p(id);
    	assertTrue(select_h0().isEmpty());

        update_p(new Date(df.parse("1.1.2018").getTime()),null, null, null, id);
        assertTrue(select_h0().isEmpty());

        P p1 = select_p(id);
        update_p(null, bd(2), null, null, id);
        P p2 = select_p(id);
        update_p(null, null, null, 2, id);
        P p3 = select_p(id);           
        update_p(new Date(df.parse("31.12.2017").getTime()), bd(2), null, 2, id);
        P p4 = select_p(id);
        
        delete_p(id);
        
        assertTrue(select_h0().isEmpty());
        
        List<H> hList = select_h(id);
        assertTrue(hList.size()==6);
        assertTrue(comparePtoH(hList.get(0), p0, 0, "C"));
        assertTrue(comparePtoH(hList.get(1), p1, 1, "U"));
        assertTrue(comparePtoH(hList.get(2), p2, 2, "U"));
        assertTrue(comparePtoH(hList.get(3), p3, 3, "U"));
        assertTrue(comparePtoH(hList.get(4), p4, 4, "U"));
        assertTrue(comparePtoH(hList.get(5), p4, 5, "D"));
    }
    
    @Test
    public void triggers_h_020() throws Exception {
    	int id = insert_p(new Date(df.parse("1.1.2016").getTime()), bd(1), c, a);
    	P p0 = select_p(id);
    	assertTrue(select_h0().isEmpty());

        update_p(new Date(df.parse("1.1.2018").getTime()),null, null, null, id);
        assertTrue(select_h0().isEmpty());

        P p1 = select_p(id);
        update_p(null, bd(2), null, null, id);
        update_p(null, null, null, null, id, true);
        P p2 = select_p(id);
        update_p(null, null, null, 2, id);
        update_p(null, null, null, null, id, false);
        P p3 = select_p(id);           
        update_p(new Date(df.parse("31.12.2017").getTime()), bd(2), null, 2, id);
        P p4 = select_p(id);
        update_p(null, null, null, null, id, false);
        
        delete_p(id);
        
        assertTrue(select_h0().isEmpty());
        
        List<H> hList = select_h(id);
        assertTrue(hList.size()==6);
        assertTrue(comparePtoH(hList.get(0), p0, 0, "C"));
        assertTrue(comparePtoH(hList.get(1), p1, 1, "U"));
        assertTrue(comparePtoH(hList.get(2), p2, 2, "U"));
        assertTrue(comparePtoH(hList.get(3), p3, 3, "U"));
        assertTrue(comparePtoH(hList.get(4), p4, 4, "U"));
        assertTrue(comparePtoH(hList.get(5), p4, 5, "D"));
    }
    
    @Test(expected = UncategorizedSQLException.class)
    public void triggers_h_030() throws Exception {
    	int id = insert_p(new Date(df.parse("1.1.2016").getTime()), bd(1), c, a); 
        update_p(new Date(df.parse("1.1.2018").getTime()),null, null, null, id, true);
    }
   
    @Test
    public void triggers_h_031() throws Exception {
    	int id = insert_p(new Date(df.parse("1.1.2016").getTime()), bd(1), c, a); 
    	P p0 = select_p(id);
        update_p(new Date(df.parse("1.1.2018").getTime()),null, null, null, id, false); //no real change in l, so update ok
        P p1 = select_p(id);
        List<H> hList = select_h(id);
        assertTrue(hList.size()==2);
        assertTrue(comparePtoH(hList.get(0), p0, 0, "C"));
        assertTrue(comparePtoH(hList.get(1), p1, 1, "U"));
    }
    
    @Test(expected = UncategorizedSQLException.class)
    public void triggers_h_040() throws Exception {
    	int id = insert_p(new Date(df.parse("1.1.2016").getTime()), bd(1), c, a); 
        update_p(null, bd(100), null, null, id, true);
    }
    
    @Test(expected = UncategorizedSQLException.class)
    public void triggers_h_050() throws Exception {
    	int id = insert_p(new Date(df.parse("1.1.2016").getTime()), bd(1), c, a); 
        update_p(null, null, a2, null, id, true);
    }
    
    @Test(expected = UncategorizedSQLException.class)
    public void triggers_h_060() throws Exception {
    	int id = insert_p(new Date(df.parse("1.1.2016").getTime()), bd(1), c, a); 
        update_p(null, null, null, c2, id, true);
    }
    
    @Test    
    public void p_i_010() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        
        assertTrue(null == select_b(d1, a));
        assertTrue(null == select_b(d3, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        
        assertTrue(null == select_b(d1, 0));
        assertTrue(null == select_b(d3, 0));
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
    }
    
    @Test    
    public void p_i_020() throws Exception {
        int id = insert_p(d2, bd(1.99), c, a);
        delete_p(id);
        
        assertTrue(null == select_b(d2, a));
        assertTrue(null == select_b(d2, 0));
    }
    
    @Test    
    public void p_i_030() throws Exception {
        insert_p(d2, bd(-1.99), c, a);
        
        assertTrue(null == select_b(d1, a));
        assertTrue(null == select_b(d3, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(-1.99), bd(0), bd(-1.99), a);
            assertTrue(compareBs(b, bExp));
        }
        
        assertTrue(null == select_b(d1, 0));
        assertTrue(null == select_b(d3, 0));
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(-1.99), bd(0), bd(-1.99), 0);
            bExp.setSmallestb(bd(-1.99));
            assertTrue(compareBs(b, bExp));
        }
    }
    
    @Test    
    public void p_i_040() throws Exception {
        int id = insert_p(d2, bd(-1.99), c, a);
        delete_p(id);
        assertTrue(null == select_b(d2, a));
        assertTrue(null == select_b(d2, 0));
    }
    
    @Test    
    public void p_i_050() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        insert_p(d2, bd(-1.99), c, a);
        
        assertTrue(null == select_b(d1, a));
        assertTrue(null == select_b(d3, a));
        {
            B b = select_b(d2, a);
            if(this.CB_MODE) {
                assertTrue(null == b);
            } else {
                B bExp = new B(d2, bd(0), bd(1.99), bd(-1.99), a);
                assertTrue(compareBs(b, bExp));
            }
        }
        
        assertTrue(null == select_b(d1, 0));
        assertTrue(null == select_b(d3, 0));
        {
            B b = select_b(d2, 0);
            if(this.CB_MODE) {
                assertTrue(null == b);
            } else {
                B bExp = new B(d2, bd(0), bd(1.99), bd(-1.99), 0);
                assertTrue(compareBs(b, bExp));
            }
        }
    }
    
    @Test    
    public void p_i_060() throws Exception {
        int id = insert_p(d2, bd(1.99), c, a);
        insert_p(d2, bd(-1.99), c, a);
        
        delete_p(id);

        {
            B b = select_b(d2, a);
            if(this.CB_MODE) {
                assertTrue(null == b);
            } else {
                B bExp = new B(d2, bd(-1.99), bd(0), bd(-1.99), a);
                assertTrue(compareBs(b, bExp));
            }
        }
        
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(-1.99), bd(0), bd(-1.99), 0);
            bExp.setSmallestb(bd(-1.99));
            assertTrue(compareBs(b, bExp));
        }
    }
    
    @Test    
    public void p_i_070() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        int id = insert_p(d2, bd(-1.99), c, a);
        
        delete_p(id);

        {
            B b = select_b(d2, a);
            if(this.CB_MODE) {
                assertTrue(null == b);
            } else {
                B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), a);
                assertTrue(compareBs(b, bExp));
            }
        }
        
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test    
    public void p_i_080() throws Exception {
        int id1 = insert_p(d2, bd(1.99), c, a);
        int id2 = insert_p(d2, bd(-1.99), c, a);
        
        delete_p(id1);
        delete_p(id2);

        assertTrue(null == select_b(d2, a));
        assertTrue(null == select_b(d2, 0));
    }
    
    @Test    
    public void p_i_090() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        insert_p(d2, bd(0.01), c, a);

        B b = select_b(d2, a);
        B bExp = new B(d2, bd(2.00), bd(2.00), bd(0), a);
        assertTrue(compareBs(b, bExp));
    }
    
    @Test    
    public void p_i_100() throws Exception {
        insert_p(d2, bd(-1.99), c, a);
        insert_p(d2, bd(-0.01), c, a);

        B b = select_b(d2, a);
        B bExp = new B(d2, bd(-2.00), bd(0), bd(-2.00), a);
        assertTrue(compareBs(b, bExp));
    }
    
    @Test    
    public void  p_i_110() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        insert_p(d3, bd(0.01), c, a);

        assertTrue(null == select_b(d1, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(2.00), bd(0.01), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }

        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_i_111() throws Exception {
        insert_p(d2, bd(9.99), c, a);
        insert_p(d3, bd(9.99), c, a);

        assertTrue(null == select_b(d1, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(9.99), bd(9.99), bd(0), a);
        assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(19.98), bd(9.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_i_120() throws Exception {
        insert_p(d2, bd(-1.99), c, a);
        insert_p(d3, bd(-0.01), c, a);

        assertTrue(null == select_b(d1, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(-1.99), bd(0), bd(-1.99), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(-2.00), bd(0), bd(-0.01), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_i_121() throws Exception {
        insert_p(d2, bd(-9.99), c, a);
        insert_p(d3, bd(-9.99), c, a);

        assertTrue(null == select_b(d1, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(-9.99), bd(0), bd(-9.99), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(-19.98), bd(0), bd(-9.99), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_i_130() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        insert_p(d3, bd(-1.99), c, a);

        assertTrue(null == select_b(d1, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(0), bd(0), bd(-1.99), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(0), bd(0), bd(-1.99), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
        
    }

    @Test    
    public void  p_i_140() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        insert_p(d3, bd(0.01), c, a);
        
        insert_p(d1, bd(-0.02), c, a);

        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(-0.02), bd(0), bd(-0.02), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(1.97), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b2 = select_b(d3, a);
            B bExp2 = new B(d3, bd(1.98), bd(0.01), bd(0), a);
            assertTrue(compareBs(b2, bExp2));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(-0.02), bd(0), bd(-0.02), 0);
            bExp.setSmallestb(bd(-0.02)); //d1 is smallest
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(1.97), bd(1.99), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b2 = select_b(d3, 0);
            B bExp2 = new B(d3, bd(1.98), bd(0.01), bd(0), 0);
            assertTrue(compareBs(b2, bExp2));
        }
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_i_150() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        insert_p(d3, bd(0.01), c, a);
        
        insert_p(d2, bd(-0.02), c, a);

        assertTrue(null == select_b(d1, a));
        
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(1.97), bd(1.99), bd(-0.02), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(1.98), bd(0.01), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(1.97), bd(1.99), bd(-0.02), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(1.98), bd(0.01), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_i_160() throws Exception {
        insert_p(d2, bd(1.99), c, a);
        insert_p(d3, bd(0.01), c, a);
        
        insert_p(d3, bd(-0.02), c, a);

        assertTrue(null == select_b(d1, a));       
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(1.98), bd(0.01), bd(-0.02), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        assertTrue(null == select_b(d1, 0));       
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(1.98), bd(0.01), bd(-0.02), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_i_170() throws Exception {
        insert_p(d1, bd(1.99), c, a);
        insert_p(d2, bd(0.01), c, a);

        insert_p(d3, bd(-0.02), c, a);

        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1.99), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(2.00), bd(0.01), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(1.98), bd(0), bd(-0.02), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(1.99), bd(1.99), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(2.00), bd(0.01), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(1.98), bd(0), bd(-0.02), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_d_010() throws Exception {
        int id = insert_p(d1, bd(1.99), c, a);
        insert_p(d2, bd(0.01), c, a);
        insert_p(d3, bd(-0.02), c, a);
        delete_p(id);
        
        assertTrue(null == select_b(d1, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(0.01), bd(0.01), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(-0.01), bd(0), bd(-0.02), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_d_020() throws Exception {
        insert_p(d1, bd(1.99), c, a);
        int id = insert_p(d2, bd(0.01), c, a);
        insert_p(d3, bd(-0.02), c, a);
        delete_p(id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1.99), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(1.97), bd(0), bd(-0.02), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(1.99), bd(1.99), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, 0));
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(1.97), bd(0), bd(-0.02), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_d_030() throws Exception {
        insert_p(d1, bd(1.99), c, a);
        insert_p(d2, bd(0.01), c, a);
        int id = insert_p(d3, bd(-0.02), c, a);
        delete_p(id);
             
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1.99), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(2.00), bd(0.01), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d3, a));
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(1.99), bd(1.99), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(2.00), bd(0.01), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d3, 0));
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_u_010() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);

        update_p(null, bd(2), null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(3), bd(2), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(4), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(3), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(4), bd(1), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_u_011() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(-1), c, a);
        
        update_p(null, bd(-1), null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(0), bd(0), bd(-1), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(-1), bd(0), bd(-1), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_u_020() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        update_p(d1, null, null, null, id);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(2), bd(2), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(3), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_u_030() throws Exception {
        insert_p(d2, bd(1), c, a);
        int id = insert_p(d3, bd(1), c, a);
        insert_p(d4, bd(1), c, a);
        
        update_p(d1, null, null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(2), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d3, a));
        {
            B b = select_b(d4, a);
            B bExp = new B(d4, bd(3), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
    }
    
    @Test    
    public void  p_u_040() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        update_p(d3, null, null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(3), bd(2), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_u_050() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        update_p(d4, null, null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(2), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d4, a);
            B bExp = new B(d4, bd(3), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test    
    public void  p_u_060() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        update_p(d1, bd(2), null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(3), bd(3), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(4), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_u_070() throws Exception {
        insert_p(d2, bd(1), c, a);
        int id = insert_p(d3, bd(1), c, a);
        insert_p(d4, bd(1), c, a);
        
        update_p(d1, bd(2), null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(2), bd(2), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(3), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d3, a));
        {
            B b = select_b(d4, a);
            B bExp = new B(d4, bd(4), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
    }
    
    @Test    
    public void  p_u_080() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        update_p(d3, bd(2), null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(4), bd(3), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
    }
    
    @Test    
    public void  p_u_090() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        update_p(d4, bd(2), null, null, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(2), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d4, a);
            B bExp = new B(d4, bd(4), bd(2), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
    }
    
    @Test    
    public void  p_u_100() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        insert_p(d1, bd(1), c, a2);
        insert_p(d2, bd(1), c, a2);
        insert_p(d3, bd(1), c, a2);
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(2), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(4), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(6), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        
        update_p(null, bd(2), null, a2, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(2), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, a2);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a2);
            B bExp = new B(d2, bd(4), bd(3), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a2);
            B bExp = new B(d3, bd(5), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a2));
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(2), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(5), bd(3), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(7), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_u_110() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        insert_p(d1, bd(1), c, a2);
        insert_p(d2, bd(1), c, a2);
        insert_p(d3, bd(1), c, a2);
        
        update_p(d1, bd(2), null, a2, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(2), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, a2);
            B bExp = new B(d1, bd(3), bd(3), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a2);
            B bExp = new B(d2, bd(4), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a2);
            B bExp = new B(d3, bd(5), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a2));
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(4), bd(4), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(5), bd(1), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(7), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
    }
    
    @Test    
    public void  p_u_120() throws Exception {
        insert_p(d2, bd(1), c, a);
        int id = insert_p(d3, bd(1), c, a);
        insert_p(d4, bd(1), c, a);
        
        insert_p(d2, bd(1), c, a2);
        insert_p(d3, bd(1), c, a2);
        insert_p(d4, bd(1), c, a2);
       
        update_p(d1, bd(2), null, a2, id);
        
        assertTrue(null == select_b(d1, a));
        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d3, a));
        {
            B b = select_b(d4, a);
            B bExp = new B(d4, bd(2), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, a2);
            B bExp = new B(d1, bd(2), bd(2), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a2);
            B bExp = new B(d2, bd(3), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a2);
            B bExp = new B(d3, bd(4), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d4, a2);
            B bExp = new B(d4, bd(5), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(2), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(4), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(5), bd(1), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d4, 0);
            B bExp = new B(d4, bd(7), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
    }
    
    @Test    
    public void  p_u_130() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        insert_p(d1, bd(1), c, a2);
        insert_p(d2, bd(1), c, a2);
        insert_p(d3, bd(1), c, a2);
        
        update_p(d3, bd(2), null, a2, id);
        
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(2), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, a2);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a2);
            B bExp = new B(d2, bd(2), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a2);
            B bExp = new B(d3, bd(5), bd(3), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a2));
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(2), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(3), bd(1), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(7), bd(4), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, 0));
    }

    @Test    
    public void  p_u_140() throws Exception {
        insert_p(d1, bd(1), c, a);
        int id = insert_p(d2, bd(1), c, a);
        insert_p(d3, bd(1), c, a);
        
        insert_p(d1, bd(1), c, a2);
        insert_p(d2, bd(1), c, a2);
        insert_p(d3, bd(1), c, a2);
        
        update_p(d4, bd(2), null, a2, id);

        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d2, a));
        {
            B b = select_b(d3, a);
            B bExp = new B(d3, bd(2), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        assertTrue(null == select_b(d4, a));
        
        {
            B b = select_b(d1, a2);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, a2);
            B bExp = new B(d2, bd(2), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, a2);
            B bExp = new B(d3, bd(3), bd(1), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d4, a2);
            B bExp = new B(d4, bd(5), bd(2), bd(0), a2);
            assertTrue(compareBs(b, bExp));
        }
        
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(2), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(3), bd(1), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d3, 0);
            B bExp = new B(d3, bd(5), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d4, 0);
            B bExp = new B(d4, bd(7), bd(2), bd(0), 0);
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test
    public void  p_u_150() throws Exception {
        int id = insert_p(d1, bd(-1), c, a);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(-1), bd(0), bd(-1), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(-1), bd(0), bd(-1), 0);
            bExp.setSmallestb(bd(-1));
            assertTrue(compareBs(b, bExp));
        }

        update_p(null, bd(-2), null, null, id);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(-2), bd(0), bd(-2), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(-2), bd(0), bd(-2), 0);
            bExp.setSmallestb(bd(-2));
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test
    public void  p_u_155() throws Exception {
        int id = insert_p(d1, bd(-2), c, a);
        update_p(null, bd(-1), null, null, id);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(-1), bd(0), bd(-1), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(-1), bd(0), bd(-1), 0);
            bExp.setSmallestb(bd(-1));
            assertTrue(compareBs(b, bExp));
        }
    }
    @Test
    public void  p_u_160() throws Exception {
        int id = insert_p(d1, bd(1), c, a);
        update_p(null, bd(2), null, null, id);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(2), bd(2), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(2), bd(2), bd(0), 0);
            bExp.setSmallestb(bd(0));
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test
    public void  p_u_165() throws Exception {
        int id = insert_p(d1, bd(2), c, a);
        update_p(null, bd(1), null, null, id);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
            bExp.setSmallestb(bd(0));
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test
    public void  p_u_170() throws Exception {
        int id = insert_p(d1, bd(1), c, a);
        update_p(null, bd(-1), null, null, id);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(-1), bd(0), bd(-1), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(-1), bd(0), bd(-1), 0);
            bExp.setSmallestb(bd(-1));
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test
    public void  p_u_175() throws Exception {
        int id = insert_p(d1, bd(-1), c, a);
        update_p(null, bd(1), null, null, id);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
            bExp.setSmallestb(bd(0));
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test
    public void  p_u_180() throws Exception {
        int id = insert_p(d1, bd(0), c, a);
        update_p(null, bd(1), null, null, id);
        {
            B b = select_b(d1, a);
            B bExp = new B(d1, bd(1), bd(1), bd(0), a);
            assertTrue(compareBs(b, bExp));
        }
        {
            B b = select_b(d1, 0);
            B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
            bExp.setSmallestb(bd(0));
            assertTrue(compareBs(b, bExp));
        }
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void a_d_100() throws Exception {
        int id = insert_p(d1, bd(-1), c, a);
        jdbcTemplate.update("delete from a where id=1", new MapSqlParameterSource());
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void a_c_100() throws Exception {
        int id = insert_p(d1, bd(-1), c, a);
        jdbcTemplate.update("delete from c where id=1", new MapSqlParameterSource());
    }

    //CB-tests:
    @Test
    public void  cb_p_i_010() throws Exception {
        this.CB_MODE=true;
        p_i_010();
    }

    @Test
    public void  cb_p_i_020() throws Exception {
        this.CB_MODE=true;
        p_i_020();
    }

    @Test
    public void  cb_p_i_030() throws Exception {
        this.CB_MODE=true;
        p_i_030();
    }

    @Test
    public void  cb_p_i_040() throws Exception {
        this.CB_MODE=true;
        p_i_040();
    }

    @Test
    public void  cb_p_i_050() throws Exception {
        this.CB_MODE=true;
        p_i_050();
    }

    @Test
    public void  cb_p_i_060() throws Exception {
        this.CB_MODE=true;
        p_i_060();
    }

    @Test
    public void  cb_p_i_070() throws Exception {
        this.CB_MODE=true;
        p_i_070();
    }

    @Test
    public void  cb_p_i_080() throws Exception {
        this.CB_MODE=true;
        p_i_080();
    }

    @Test
    public void  cb_p_i_090() throws Exception {
        this.CB_MODE=true;
        p_i_090();
    }

    @Test
    public void  cb_p_i_100() throws Exception {
        this.CB_MODE=true;
        p_i_100();
    }

    @Test
    public void  cb_p_i_110() throws Exception {
        this.CB_MODE=true;
        p_i_110();
    }

    @Test
    public void  cb_p_i_111() throws Exception {
        this.CB_MODE=true;
        p_i_111();
    }

    @Test
    public void  cb_p_i_120() throws Exception {
        this.CB_MODE=true;
        p_i_120();
    }

    @Test
    public void  cb_p_i_121() throws Exception {
        this.CB_MODE=true;
        p_i_121();
    }

    @Test
    public void  cb_p_i_130() throws Exception {
        this.CB_MODE=true;
        p_i_130();
    }

    @Test
    public void  cb_p_i_140() throws Exception {
        this.CB_MODE=true;
        p_i_140();
    }

    @Test
    public void  cb_p_i_150() throws Exception {
        this.CB_MODE=true;
        p_i_150();
    }

    @Test
    public void  cb_p_i_160() throws Exception {
        this.CB_MODE=true;
        p_i_160();
    }

    @Test
    public void  cb_p_i_170() throws Exception {
        this.CB_MODE=true;
        p_i_170();
    }

    @Test
    public void  cb_p_d_010() throws Exception {
        this.CB_MODE=true;
        p_d_010();
    }

    @Test
    public void  cb_p_d_020() throws Exception {
        this.CB_MODE=true;
        p_d_020();
    }

    @Test
    public void  cb_p_d_030() throws Exception {
        this.CB_MODE=true;
        p_d_030();
    }

    @Test
    public void  cb_p_u_010() throws Exception {
        this.CB_MODE=true;
        p_u_010();
    }

    @Test
    public void  cb_p_u_011() throws Exception {
        this.CB_MODE=true;
        p_u_011();
    }

    @Test
    public void  cb_p_u_020() throws Exception {
        this.CB_MODE=true;
        p_u_020();
    }

    @Test
    public void  cb_p_u_030() throws Exception {
        this.CB_MODE=true;
        p_u_030();
    }

    @Test
    public void  cb_p_u_040() throws Exception {
        this.CB_MODE=true;
        p_u_040();
    }

    @Test
    public void  cb_p_u_050() throws Exception {
        this.CB_MODE=true;
        p_u_050();
    }

    @Test
    public void  cb_p_u_060() throws Exception {
        this.CB_MODE=true;
        p_u_060();
    }

    @Test
    public void  cb_p_u_070() throws Exception {
        this.CB_MODE=true;
        p_u_070();
    }

    @Test
    public void  cb_p_u_080() throws Exception {
        this.CB_MODE=true;
        p_u_080();
    }

    @Test
    public void  cb_p_u_090() throws Exception {
        this.CB_MODE=true;
        p_u_090();
    }

    @Test
    public void  cb_p_u_100() throws Exception {
        this.CB_MODE=true;
        p_u_100();
    }

    @Test
    public void  cb_p_u_110() throws Exception {
        this.CB_MODE=true;
        p_u_110();
    }

    @Test
    public void  cb_p_u_120() throws Exception {
        this.CB_MODE=true;
        p_u_120();
    }

    @Test
    public void  cb_p_u_130() throws Exception {
        this.CB_MODE=true;
        p_u_130();
    }

    @Test
    public void  cb_p_u_140() throws Exception {
        this.CB_MODE=true;
        p_u_140();
    }

    @Test
    public void  cb_p_u_150() throws Exception {
        this.CB_MODE=true;
        p_u_150();
    }

    @Test
    public void  cb_p_u_155() throws Exception {
        this.CB_MODE=true;
        p_u_155();
    }

    @Test
    public void  cb_p_u_160() throws Exception {
        this.CB_MODE=true;
        p_u_160();
    }

    @Test
    public void  cb_p_u_165() throws Exception {
        this.CB_MODE=true;
        p_u_165();
    }

    @Test
    public void  cb_p_u_170() throws Exception {
        this.CB_MODE=true;
        p_u_170();
    }

    @Test
    public void  cb_p_u_175() throws Exception {
        this.CB_MODE=true;
        p_u_175();
    }

    @Test
    public void  cb_p_u_180() throws Exception {
        this.CB_MODE=true;
        p_u_180();
    }
}
