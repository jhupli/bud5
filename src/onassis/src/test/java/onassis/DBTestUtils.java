/**
 * 
 */
package onassis;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import onassis.dto.B;
import onassis.dto.H;
import onassis.dto.P;
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
    NamedParameterJdbcTemplate jdbcTemplate;
    String sql = null;

    public BigDecimal bd(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.UP);
    }
    
    public void insert_basedata() throws Exception {
        jdbcTemplate.update("insert into c( descr, i, active, color) values( 'cat 1', 1.00, true, 'red')", new MapSqlParameterSource());
        jdbcTemplate.update("insert into c( descr, i, active, color) values( 'cat 2', 1.00, true, 'green')", new MapSqlParameterSource());
        
        jdbcTemplate.update("insert into a( descr, active, color, credit) values( 'acc 1', true, 'blue', false)", new MapSqlParameterSource());
        jdbcTemplate.update("insert into a( descr, active, color, credit) values( 'acc 2', true, 'yellow', false)", new MapSqlParameterSource());

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
        assertNotNull(d);
        assertNotNull(i);
        assertNotNull(a);
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("d", d)
                .addValue("i", i)
                .addValue("c", c)
                .addValue("a", a);
        
        sql = "insert into p( d, i, c, a) values( :d, :i, :c, :a)";
        jdbcTemplate.update( sql, namedParameters );
        
        sql = "select max(id) from p";
        int maxId = (int) jdbcTemplate.queryForObject(sql, namedParameters, int.class);
        return maxId;
    }
    
 
    public void update_p(Date d, BigDecimal i, Integer c, Integer a, int id) throws Exception {
        assertTrue(null != d || null !=i || null!= c || null != a);
        String set = "";
        
        if (null != d) {
            set = " d = :d";
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
        
        sql = "update p set "+set+" where id = :id";
        
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("d", d)
                .addValue("i", i)
                .addValue("c", c)
                .addValue("a", a)
                .addValue("id", id);
        
        jdbcTemplate.update( sql, namedParameters );
    }
    
    public void delete_p(int id) throws Exception {
        sql = "delete from p where id = :id";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
        jdbcTemplate.update( sql, namedParameters );
    }
    
    public void empty_pbh() throws Exception {
        sql = "delete from p";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
        sql = "delete from b";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );
        sql = "delete from h";
        jdbcTemplate.update( sql, new MapSqlParameterSource() );        
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
        b1.getA() == b2.getA();
    }
}
