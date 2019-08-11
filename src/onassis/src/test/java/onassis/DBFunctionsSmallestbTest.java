package onassis;

import static org.junit.Assert.assertTrue;

import java.sql.Date;
import java.text.SimpleDateFormat;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import onassis.dto.A;
import onassis.dto.B;

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
public class DBFunctionsSmallestbTest extends DBTestUtils{
    
    SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
    Date d1, d2, d3, d4 = null;
    int a = 1;
    int a2 = 2;
    int a3 = 3;
    int c = 1;
    
    @Before
    public void before() throws Exception {
    	empty_db();
        d1 = new Date(df.parse("2.1.2016").getTime());
        d2 = new Date(df.parse("4.1.2016").getTime());
        d3 = new Date(df.parse("6.1.2016").getTime());
        d4 = new Date(df.parse("8.1.2016").getTime());
        statistics_start();
    }

    @After
    public void after() throws Exception {
        statistics_end();
    	//xcheck_b0_b();
        empty_db();
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
    	 assertTrue(0 == get0BalancesCount());
    }
    
    @Test    
    public void  p_i_sb_10() throws Exception {
    	insert_basedata(1);
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
    	insert_basedata(2);
    	insert_p(d1, bd(1), c, a);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0));
    		assertTrue(compareBs(b, bExp));
    	}
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
    	insert_basedata(2);
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
    	insert_basedata(2);
    	insert_p(d1, bd(1), c, a);
    	insert_p(d2, bd(-1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a2) = 0
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
    	insert_basedata(2);
    	insert_p(d1, bd(-1), c, a);
    	insert_p(d2, bd(1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(-1), bd(0), bd(-1), 0);
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
    	insert_basedata(3);
    	insert_p(d1, bd(1), c, a);
    	insert_p(d2, bd(1), c, a2);
    	insert_p(d3, bd(1), c, a3);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a3)=b(a2)=0
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(2), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a3)=0
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
    	insert_basedata(3);
    	insert_p(d1, bd(1), c, a);
    	insert_p(d2, bd(1), c, a2);
    	insert_p(d3, bd(1), c, a3);
    	insert_p(d2, bd(-1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a3)=b(a2)=0
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(1), bd(1), bd(-1), 0);
    		bExp.setSmallestb(bd(0)); //b(a3)=b(a2)=0
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d3, 0);
    		B bExp = new B(d3, bd(2), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a2)=0
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_i_sb_80() throws Exception {
    	insert_basedata(3);
    	insert_p(d1, bd(1), c, a);
    	insert_p(d2, bd(2), c, a2);
    	insert_p(d3, bd(3), c, a3);
    	{
    		B b = select_b(d3, 0);
    		B bExp = new B(d3, bd(6), bd(3), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    }

    @Test    
    public void  p_i_sb_90() throws Exception {
    	insert_basedata(3);
    	insert_p(d1, bd(1), c, a);
    	insert_p(d2, bd(2), c, a2);
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(3), bd(2), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a3)=0
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_d_sb_10() throws Exception {
    	insert_basedata(1);
    	insert_p(d1, bd(1), c, a);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    	int id = insert_p(d1, bd(-2), c, a);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(-1), bd(1), bd(-2), 0);
    		bExp.setSmallestb(bd(-1));
    		assertTrue(compareBs(b, bExp));
    	}
    	delete_p(id);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(1));
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_d_sb_20() throws Exception {
    	insert_basedata(2);
    	insert_p(d1, bd(1), c, a);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a2) = 0 
    		assertTrue(compareBs(b, bExp));
    	}
    	int id = insert_p(d1, bd(-2), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(-1), bd(1), bd(-2), 0);
    		bExp.setSmallestb(bd(-2));
    		assertTrue(compareBs(b, bExp));
    	}
    	delete_p(id);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(0));
    		assertTrue(compareBs(b, bExp));
    	}
    }

    @Test    
    public void  p_d_sb_30() throws Exception {
    	insert_basedata(3);
    	int id1 = insert_p(d1, bd(1), c, a);
    	int id2 = insert_p(d1, bd(2), c, a2);
    	insert_p(d1, bd(3), c, a3);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(6), bd(6), bd(0), 0);
    		bExp.setSmallestb(bd(1)); 
    		assertTrue(compareBs(b, bExp));
    	}
    	delete_p(id1);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(5), bd(5), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a) = 0 
    		assertTrue(compareBs(b, bExp));
    	}
    	delete_p(id2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(3), bd(3), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a) = b(a2) = 0 
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_d_sb_40() throws Exception {
    	insert_basedata(3);
    	int id1 = insert_p(d1, bd(1), c, a);
    	int id2 = insert_p(d1, bd(2), c, a2);
    	insert_p(d1, bd(3), c, a3);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(6), bd(6), bd(0), 0);
    		bExp.setSmallestb(bd(1)); 
    		assertTrue(compareBs(b, bExp));
    	}
    	delete_p(id1);
    	insert_p(d1, bd(10), c, a);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(15), bd(15), bd(0), 0);
    		bExp.setSmallestb(bd(2));  
    		assertTrue(compareBs(b, bExp));
    	}
    	delete_p(id2);
    	insert_p(d1, bd(10), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(23), bd(23), bd(0), 0);
    		bExp.setSmallestb(bd(3)); 
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_u_sb_10() throws Exception {
    	insert_basedata(3);
    	int id1 = insert_p(d1, bd(1), c, a);
    	int id2 = insert_p(d1, bd(2), c, a2);
    	insert_p(d1, bd(3), c, a3);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(6), bd(6), bd(0), 0);
    		bExp.setSmallestb(bd(1)); 
    		assertTrue(compareBs(b, bExp));
    	}
    	
    	update_p(null, bd(10), null, null, id1);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(15), bd(15), bd(0), 0);
    		bExp.setSmallestb(bd(2));  
    		assertTrue(compareBs(b, bExp));
    	}
    	update_p(null, bd(10), null, null, id2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(23), bd(23), bd(0), 0);
    		bExp.setSmallestb(bd(3)); 
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_u_sb_20() throws Exception {
    	insert_basedata(2);
    	int id1 = insert_p(d1, bd(3), c, a);
    	int id2 = insert_p(d1, bd(1), c, a2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(4), bd(4), bd(0), 0);
    		bExp.setSmallestb(bd(1)); 
    		assertTrue(compareBs(b, bExp));
    	}
    	update_p(d2, bd(10), null, null, id2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(3), bd(3), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a2) = 0 
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(13), bd(10), bd(0), 0);
    		bExp.setSmallestb(bd(3)); 
    		assertTrue(compareBs(b, bExp));
    	}
    	update_p(null, bd(-1), null, null, id2);
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(3), bd(3), bd(0), 0);
    		bExp.setSmallestb(bd(0));  //b(a2) = 0 
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(2), bd(0), bd(-1), 0);
    		bExp.setSmallestb(bd(-1)); 
    		assertTrue(compareBs(b, bExp));
    	}
    }
    
    @Test    
    public void  p_u_sb_30() throws Exception {
    	insert_basedata(2);                                     //     d  b0,sbs b(a1) b(a2)
    	int id1 = insert_p(d2, bd(1), c, a);                    //     d2 1, 0   1     0 
    	
    	                                                        //     d  b0,sbs b(a1) b(a2)
    	int id2 = insert_p(d2, bd(3), c, a);                    //     d2 4, 0   3     0
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(4), bd(4), bd(0), 0);
    		bExp.setSmallestb(bd(0)); //b(a2)=0 
    		assertTrue(compareBs(b, bExp));
    	}                                                       //     d  b0,sbs b(a1) b(a2)
    	update_p(d3, bd(-1), null, a2, id2);                    //     d2 1, 0   1     0
    	                                                        //     d3 0, -1  1     -1
    	{
    		B b = select_b(d3, 0);
    		B bExp = new B(d3, bd(0), bd(0), bd(-1), 0);
    		bExp.setSmallestb(bd(-1)); 
    		assertTrue(compareBs(b, bExp));
    	}
    	update_p(d1, bd(-2), null, a2, id2);
    	                                                        //     d  b0,sbs b(a1) b(a2)
    	                                                        //     d1 -2,-2  0     -2
    	                                                        //     d2 -1,-2  1     -2
    	                                                        //     d3  0,-2  1     -2
    	
    	
    	{
    		B b = select_b(d2, 0);
    		B bExp = new B(d2, bd(-1), bd(1), bd(0), 0);
    		bExp.setSmallestb(bd(-2)); 
    		assertTrue(compareBs(b, bExp));
    	}
    	{
    		B b = select_b(d1, 0);
    		B bExp = new B(d1, bd(-2), bd(0), bd(-2), 0);
    		bExp.setSmallestb(bd(-2));  
    		assertTrue(compareBs(b, bExp));
    	}
    }
}
