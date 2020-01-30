/**
 * 
 */
package onassis;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.stereotype.Component;

import onassis.dto.A;
import onassis.dto.B;
import onassis.dto.H;
import onassis.dto.P;
import onassis.dto.mappers.MapA;
import onassis.dto.mappers.MapB;
import onassis.dto.mappers.MapH;
import onassis.dto.mappers.MapP;

/**
 * @author Janne Hupli
 * @version 1.0 Aug 2017
 */

@Component
public class DBTestUtils {

    @Autowired
    public DataSource ds;

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;
    String sql = null;
    Connection con = null;


    public BigDecimal bd(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.UP);
    }
    
    private void reset_sequencer(String tableName) throws Exception {
        sql = "alter table "+tableName+" alter column id restart with 1";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
    }

    public void empty_db() throws Exception {


        sql = "delete from p";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
        reset_sequencer("p");
        
        sql = "delete from b";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
        
        sql = "delete from h";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
        
        sql = "delete from c";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
        reset_sequencer("c");
        
        sql = "delete from a";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
        reset_sequencer("a");
    }
    
    public void insert_basedata() throws Exception {
    	insert_basedata(3);
    }
    
    public void insert_basedata(int numberOfAccounts) throws Exception {

    	jdbcTemplate.update("insert into c( descr, i, active, color) values( 'cat 1', 1.00, true, 'red')", new MapSqlParameterSource());
        jdbcTemplate.update("insert into c( descr, i, active, color) values( 'cat 2', 1.00, true, 'green')", new MapSqlParameterSource());
        
        for(int i=0; i<numberOfAccounts; i++) {
        	jdbcTemplate.update("insert into a( descr, active, color, credit) values( 'acc "+i+"', true, 'blue', false)", new MapSqlParameterSource());
        }
    }
    
    public P select_p(int id) {        
        sql = "select * from p where id=:id";
        MapP rm = new MapP();
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
        try{
            return (P) jdbcTemplate.queryForObject(sql, namedParameters, rm);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
    
    public B select_b(Date d, int a) {     
        sql = "select * from b where d=:d and a=:a";
        MapB rm = new MapB();
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("d", d)
                .addValue("a", a);  
        try{
            return (B) jdbcTemplate.queryForObject(sql, namedParameters, rm);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
    
    public int getBalancesCount(Date d) {
    	sql = "select count(*) from b where not a=0 and d=:d " ;
    	MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("d", d);
    	return jdbcTemplate.queryForObject(sql, namedParameters, Integer.class);
    }
    
    public int get0BalancesCount() {
    	sql = "select count(*) from b where i=0 and e=0 " ;
    	MapSqlParameterSource namedParameters = new MapSqlParameterSource();
    	return jdbcTemplate.queryForObject(sql, namedParameters, Integer.class);
    }
    
    public List<A> getAccounts() {
        sql = "select * from a" ;
        MapA rm = new MapA();
        MapSqlParameterSource namedParameters = new MapSqlParameterSource();  
        return jdbcTemplate.query(sql, namedParameters, new RowMapperResultSetExtractor<A>(rm));
    }
    
    public List<B> getBalances(long a) {
        sql = "select * from b where a=:a" ;
        MapB rm = new MapB();
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("a", a);  
        return jdbcTemplate.query(sql, namedParameters, new RowMapperResultSetExtractor<B>(rm));
    }
    
    public List<H> select_h(int id) {
        sql = "select * from h where id=:id order by hd asc" ;
        MapH rm = new MapH();
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);  
        return jdbcTemplate.query(sql, namedParameters, new RowMapperResultSetExtractor<H>(rm));
    }
    
    public List<H> select_h0() {
        sql = "select * from h where a=0 order by hd asc" ;
        MapH rm = new MapH();
        MapSqlParameterSource namedParameters = new MapSqlParameterSource();  
        try{
        	return jdbcTemplate.query(sql, namedParameters, new RowMapperResultSetExtractor<H>(rm));
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int insert_p(Date d, BigDecimal i, int c, int a) throws Exception {
        return insert_p(d, d, i ,c , a);
    }

    public int insert_p(Date dc, Date d, BigDecimal i, int c, int a) throws Exception {
        assertNotNull(dc);
        assertNotNull(d);
        assertNotNull(i);
        assertNotNull(a);
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("dc", dc)
                .addValue("d", d)
                .addValue("i", i)
                .addValue("c", c)
                .addValue("a", a);
        
        sql = "insert into p( dc, d, i, c, a) values(:dc, :d, :i, :c, :a)";
        jdbcTemplate.update( sql, namedParameters );
        
        sql = "select max(id) from p";
        int maxId = (int) jdbcTemplate.queryForObject(sql, namedParameters, int.class);
        return maxId;
    }
    
    public void update_p(Date d, BigDecimal i, Integer c, Integer a, int id) throws Exception {
    	update_p(d, d, i, c, a, id, null);
    }

    public void update_p(Date d, BigDecimal i, Integer c, Integer a, int id, Boolean l) throws Exception {
        update_p(d, d, i, c, a, id, l);
    }

    public void update_p(Date dc, Date d, BigDecimal i, Integer c, Integer a, int id, Boolean l) throws Exception {
        assertTrue(null != dc || null != d || null !=i || null!= c || null != a || null != l);
        String set = "";

        if (null != dc) {
            set = " dc = :dc";
        }
        if (null != d) {
            set += (set.length()>0 ? "," : "") + " d = :d";
        }
        if (null != i) {
            set += (set.length()>0 ? "," : "") + " i = :i";
        }
        if (null != c) {
            set += (set.length()>0  ? "," : "") + " c = :c";
        }
        if (null != a) {
            set += (set.length()>0  ? "," : "") + " a = :a";
        }
        if (null != l) {
            set += (set.length()>0  ? "," : "") + " l = :l";
        }
        sql = "update p set "+set+" where id = :id";
        
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("dc", dc)
                .addValue("d", d)
                .addValue("i", i)
                .addValue("c", c)
                .addValue("a", a)
                .addValue("l", l)
                .addValue("id", id);
        
        jdbcTemplate.update( sql, namedParameters );
    }
    
    public void delete_p(int id) throws Exception {
        sql = "delete from p where id = :id";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
        jdbcTemplate.update( sql, namedParameters );
    }
 
    public boolean comparePtoH(H h, P p, int rownr, String op) {
        return 
        h.getOp().equals(op) &&
        h.getRownr() == rownr &&
        h.getI().compareTo(p.getI()) == 0 &&
        h.getD().compareTo(p.getD()) == 0 &&
        h.getC() == p.getC() &&
        h.getA() == p.getA();
    }
    
    public boolean compareBs(B b1, B b2) {
        return
        b1.getD().equals(b2.getD()) &&
        b1.getB().equals(b2.getB()) &&
        b1.getI().equals(b2.getI()) &&
        b1.getE().equals(b2.getE()) &&
        b1.getA() == b2.getA() &&
        (
        	(null == b1.getSmallestb() && null == b2.getSmallestb()) ||
        	(b1.getSmallestb().equals(b2.getSmallestb()))
        );
    }
}
