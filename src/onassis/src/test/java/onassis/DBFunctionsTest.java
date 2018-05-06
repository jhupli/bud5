package onassis;

import static org.junit.Assert.assertTrue;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

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
@SpringApplicationConfiguration(classes = App.class)
@IntegrationTest({"spring.datasource.url:jdbc:derby:memory:onassisTest;create=true;"})
public class DBFunctionsTest extends DBTestUtils{
    
    SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
    Date d1, d2, d3, d4 = null;
    int a = 1;
    int a2 = 2;
    int a3 = 3;
    int c = 1;
    
    @Before
    public void before() throws Exception {
        d1 = new Date(df.parse("2.1.2016").getTime());
        d2 = new Date(df.parse("4.1.2016").getTime());
        d3 = new Date(df.parse("6.1.2016").getTime());
        d4 = new Date(df.parse("8.1.2016").getTime());
        insert_basedata();
    }

    @After
    public void after() throws Exception {
    	xcheck_b0_b();
        empty_pbh();
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
    }
    
    public void xcheck_b0_smallestb() throws Exception {
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
    }
    
    @Test
    public void triggers_h() throws Exception {
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
            B bExp = new B(d2, bd(0), bd(1.99), bd(-1.99), a);
            assertTrue(compareBs(b, bExp));
        }
        
        assertTrue(null == select_b(d1, 0));
        assertTrue(null == select_b(d3, 0));
        {
            B b = select_b(d2, 0);
            B bExp = new B(d2, bd(0), bd(1.99), bd(-1.99), 0);
            assertTrue(compareBs(b, bExp));
        }
    }
    
    @Test    
    public void p_i_060() throws Exception {
        int id = insert_p(d2, bd(1.99), c, a);
        insert_p(d2, bd(-1.99), c, a);
        
        delete_p(id);

        {
            B b = select_b(d2, a);
            B bExp = new B(d2, bd(-1.99), bd(0), bd(-1.99), a);
            assertTrue(compareBs(b, bExp));
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
            B bExp = new B(d2, bd(1.99), bd(1.99), bd(0), a);
            assertTrue(compareBs(b, bExp));
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
    
    //smallest b tests
    @Test    
    public void  p_i_sb_10() throws Exception {
    	insert_p(d1, bd(1), c, a);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_i_sb_20() throws Exception {
    	insert_p(d1, bd(1), c, a);
    	insert_p(d1, bd(-1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(0), bd(1), bd(-1), 0);
    		bExp.setSmallestb(bd(-1));
    		assertTrue(compareBs(b, bExp));
    	}
    }

    @Test    
    public void  p_i_sb_30() throws Exception {
    	insert_p(d1, bd(-1), c, a);
    	insert_p(d1, bd(1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(0), bd(1), bd(-1), 0);
    		bExp.setSmallestb(bd(-1));
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_i_sb_40() throws Exception {
    	insert_p(d1, bd(1), c, a);
    	insert_p(d2, bd(-1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(0), bd(0), bd(-1), 0);
    		bExp.setSmallestb(bd(-1));
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_i_sb_50() throws Exception {
    	insert_p(d1, bd(-1), c, a);
    	insert_p(d2, bd(1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(-1), bd(-1), bd(0), 0);
    		bExp.setSmallestb(bd(-1));
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(0), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(-1));
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_i_sb_60() throws Exception {
    	insert_p(d1, bd(1), c, a);
    	insert_p(d2, bd(1), c, a2);
    	insert_p(d3, bd(1), c, a3);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(2), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d3, 0);
    		B bExp = new B(d3, bd(3), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_i_sb_70() throws Exception {
    	insert_p(d1, bd(1), c, a);
    	insert_p(d2, bd(1), c, a2);
    	insert_p(d3, bd(1), c, a3);
    	insert_p(d2, bd(-1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(1), bd(1), bd(-1), 0);
    		bExp.setSmallestb(bd(0));
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d3, 0);
    		B bExp = new B(d3, bd(2), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0));
    		assertTrue(compareBs(b, bExp));
    	}
    }
}
