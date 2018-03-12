package onassis;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.EmptySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;
import onassis.db.functions.Balance;
import onassis.db.functions.DataProvider;
import onassis.dto.A;
import onassis.dto.B;
import onassis.dto.C;
import onassis.dto.P;
import onassis.dto.Slice;
import onassis.dto.mappers.MapA;
import onassis.dto.mappers.MapB;
import onassis.dto.mappers.MapC;
import onassis.dto.mappers.MapP;
import onassis.dto.mappers.MapSlice;

@CrossOrigin(origins = "http://localhost:3000") //<-development only
@RestController
public class HelloController {
	
	@Autowired
	public DataSource ds = null;
	
    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    
    @RequestMapping("/")
    String hello() {
        return "Hello World, This is Onassis! Can ou here me?";
    }
    
    @RequestMapping("/ping")
    String ping() {
        return "Yep!";
    }
    
    @PostConstruct
    void init(){
    	DataProvider.ds = this.ds;
    	Balance.ds = this.ds;
    }

    @Data
    static class Result {
        public int getLeft() {
			return left;
		}
		public int getRight() {
			return right;
		}
		public long getAnswer() {
			return answer;
		}
		public Result(int left, int right, long answer) {
			super();
			this.left = left;
			this.right = right;
			this.answer = answer;
		}
        
		private final int left;
        private final int right;
        private final long answer;
    }

    
    MapB rmB = new MapB();
    MapP rmP = new MapP();
    MapC rmC = new MapC();
    MapA rmA = new MapA();
    MapSlice rmSlice = new MapSlice();

    
    // SQL sample

    @RequestMapping("calc")
    List calc(@RequestParam int cat) {
    	//final String query = "SELECT d,b,i,e,a FROM B WHERE A=0 ORDER BY D ASC";
    	
    	String query = null;
    	if (cat > 0) {
    		query = "SELECT d,0 as b,sum(positive(i)) as i, sum(negative(i)) as e, -1 as a FROM P WHERE C = :cat " // AND i<>0 "
    			+ "GROUP BY D ORDER BY D ASC ";
    		/*query = "SELECT d,0 as b,i,e,a FROM B WHERE A=0 "
    			+  "AND D IN (SELECT D FROM P WHERE C = :cat) "
    			+ "ORDER BY D ASC ";*/
    	} else {
    	//query = "SELECT d,b,i,e,a FROM B WHERE A=0 "
    		query = "SELECT d,0 as b,i,e,a FROM B WHERE A=0 "
    			+ "ORDER BY D ASC ";
    	}
    	
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("cat", cat);  

        return jdbcTemplate.query(query, 
        		namedParameters,
        		new RowMapperResultSetExtractor<B>(rmB));
    }
   /* public Forum selectForum(int forumId) {
		String query = "SELECT * FROM FORUMS WHERE FORUM_ID=:forumId";
		SqlParameterSource namedParameters = new MapSqlParameterSource("forumId", Integer.valueOf(forumId));

		return (Forum) namedParameterJdbcTemplate.queryForObject(query,
				namedParameters, new RowMapper() {
			public Object mapRow(ResultSet resultSet, int rowNum)
					throws SQLException {
				return new Forum(resultSet.getInt("FORUM_ID"), resultSet.getString("FORUM_NAME"), resultSet.getString("FORUM_DESC"));
			}
		});
	}*/
    // SQL sample
    @RequestMapping("generate")
    void generate() throws SQLException, ParseException {
    	
        /*MapSqlParameterSource source = new MapSqlParameterSource();  
        return jdbcTemplate.queryForList("CALL random_data()", source);*/
    	DataProvider.random_data();
    }
    
 /*   private static Period getPeriod(LocalDateTime dob, LocalDateTime now) {
        return Period.between(dob.toLocalDate(), now.toLocalDate());
    }*/
    DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMdd");
    DateTimeFormatter sqldf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    private List<Object> dates(LocalDate s, LocalDate e) {
        List<Object> localDates = new ArrayList<Object>();
        localDates.add("x");
        LocalDate localDate = s;
        while ( localDate.isBefore( e.plusDays(1) ) ) {
            String fd = localDate.format(df);
            localDates.add( localDate.format(df) + "T00");
            localDate = localDate.plusDays( 1 );
        }
        return localDates;
    }
    
    private List<Object> incomes(boolean positives, LocalDate s, LocalDate e) throws SQLException {
        Connection conn = null;
        PreparedStatement sumstmnt = null;
        ResultSet resultSet = null;
        try{
        List<Object> localDates = new ArrayList<Object>();
        Hashtable<String, BigDecimal> hashtable = new Hashtable<String, BigDecimal>();

        LocalDate localDate = s;
        while ( localDate.isBefore( e.plusDays(1) ) ) {
            hashtable.put(localDate.format(df), BigDecimal.ZERO);
            localDate = localDate.plusDays( 1 );
        }
        //TODO: TÄMÄ TULEE UUDELLEENKIRJOITTAA S.E hakee arvot 0-tililtä (i,e)
        conn = ds.getConnection();
        String sumSQL = "select d, sum(i) from p where i " + (positives ? ">0" : "<0") +" and d>='"+s.format(sqldf)+"' and d<='"+e.format(sqldf)+"' and not a=0 group by d order by d asc"; 
        sumstmnt = conn.prepareStatement(sumSQL);
        if( !sumstmnt.execute() ) {
            throw new RuntimeException("incomes - execute failed");
        }
        
        resultSet = sumstmnt.getResultSet();
        if (resultSet!=null) {
            while(resultSet.next())
            {
                LocalDate d = LocalDate.parse(resultSet.getString(1));
                BigDecimal sum = resultSet.getBigDecimal(2);
                hashtable.put(d.format(df), sum);
            }
        }
        
        localDates.add(positives ? "I" : "E");
        localDate = s;
        while ( localDate.isBefore( e.plusDays(1) ) ) {
            localDates.add(hashtable.get(localDate.format(df)));
            localDate = localDate.plusDays( 1 );
        }
        return localDates;
        
        }finally{
            resultSet.close();
            sumstmnt.close();
            conn.close();
        }
    }
    
    
    private List<Object> balancesWithA(int a, LocalDate s, LocalDate e) throws SQLException {
        List<Object> localDates = new ArrayList<Object>();
        localDates.add(""+a);
        LocalDate localDate = s;
        while ( localDate.isBefore( e.plusDays(1) ) ) {
            localDates.add(Balance.balanceAfter(Date.valueOf(localDate), a) );
            localDate = localDate.plusDays( 1 );
        }
        return localDates;
    }
    
    /*private List<BigDecimal> balances(int a, LocalDate s, LocalDate e) throws SQLException {
        List<BigDecimal> localDates = new ArrayList<BigDecimal>();
        LocalDate localDate = s;
        while ( localDate.isBefore( e.plusDays(1) ) ) {
            localDates.add(Balance.balanceAfter(Date.valueOf(localDate), a) );
            localDate = localDate.plusDays( 1 );
        }
        return localDates;
    }*/
    
    // SQL sample
    @RequestMapping("details")
    List<List<Object>> details(@RequestParam String s, @RequestParam String e) throws SQLException, ParseException {
    	
    	LocalDate start = LocalDate.parse(s);
    	LocalDate end = LocalDate.parse(e);

    	
    	List<List<Object>> accounts = new ArrayList<List<Object>>();
    	
    	accounts.add(dates(start,end));
    	accounts.add(incomes(true, start, end));
    	accounts.add(incomes(false, start, end));
    	
    	String accountQuery = "SELECT id FROM a WHERE active ORDER BY id ASC";
    	List<Integer> accList = jdbcTemplate.queryForList(accountQuery, new EmptySqlParameterSource(), Integer.class );
    	
        for (Integer id : accList) {
            accounts.add(balancesWithA(id, start, end));
        } 

    	return accounts;
    } 
    
    @RequestMapping(value = "pie")
    List<Slice> pie(@RequestParam String s, @RequestParam String e) throws SQLException, ParseException {
        
        LocalDate day1 = LocalDate.parse(s);
        LocalDate day2 = LocalDate.parse(e);
        
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("d1", day1.format(sqldf))
                .addValue("d2", day2.format(sqldf));
        
        String paymetsQuery = "SELECT sum(i) as sl, c FROM P WHERE i<=0 AND d BETWEEN :d1 and :d2 AND s GROUP BY c ORDER BY sl ASC";
        List<Slice> slices = jdbcTemplate.query(paymetsQuery, 
            namedParameters,
            new RowMapperResultSetExtractor<Slice>(rmSlice));

        paymetsQuery = "SELECT sum(i) as sl, c FROM P WHERE i>0 AND d BETWEEN :d1 and :d2 AND s GROUP BY c ORDER BY sl ASC";
        slices.addAll(jdbcTemplate.query(paymetsQuery, 
            namedParameters,
            new RowMapperResultSetExtractor<Slice>(rmSlice)));

        return slices; 
    }
    
    @RequestMapping("day")
    List<List<? extends Object>> day(@RequestParam String e, 
                @RequestParam(required=false) String d, 
                @RequestParam(required=false) String a,
                @RequestParam(required=false) String c,
                @RequestParam(required=false) String g,
                @RequestParam(required=false) String d1,
                @RequestParam(required=false) String d2,
                @RequestParam(required=false, value="ids[]") Set<Integer> ids
            ) throws SQLException, ParseException {
        List<P> paymentsList = null;
        List<B> balancesList = null;
        
    	if(e.equals("l") && null != ids) {

    	    final String query = "SELECT id, d, i, a, c, l, s, g, descr FROM P WHERE id in (:ids) ORDER BY a ASC";
    	    MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("ids", ids);
    	    
    	    paymentsList = jdbcTemplate.query(query, 
                    namedParameters,
                    new RowMapperResultSetExtractor<P>(rmP));
    	}
    	
    	if(e.equals("d") && null != d) {
    	    LocalDate day = LocalDate.parse(d);
    	    final String query = "SELECT id, d, i, a, c, l, s, g, descr FROM P WHERE d=:day ORDER BY a ASC";
    	    MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("day", day.format(sqldf));
    	    
    	    paymentsList = jdbcTemplate.query(query, 
                    namedParameters,
                    new RowMapperResultSetExtractor<P>(rmP));
    	}

        if(e.equals("a") && null != a && null != d1 && null != d2) {
            LocalDate day1 = LocalDate.parse(d1);
            LocalDate day2 = LocalDate.parse(d2);
            
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("d1", day1.format(sqldf))
                    .addValue("d2", day2.format(sqldf))
                    .addValue("a", a);
            
            final String paymetsQuery = "SELECT id, d, i, a, c, l, s, g, descr FROM P WHERE d BETWEEN :d1 and :d2 AND a=:a ORDER BY d ASC";
            paymentsList = jdbcTemplate.query(paymetsQuery, 
                namedParameters,
                new RowMapperResultSetExtractor<P>(rmP));
            
            final String balancesQuery = "SELECT d, b, i, e, a FROM b WHERE d BETWEEN :d1 and :d2 AND a=:a ORDER BY d ASC";
            balancesList = jdbcTemplate.query(balancesQuery, 
                namedParameters,
                new RowMapperResultSetExtractor<B>(rmB));
        }
        
        if(e.equals("c") && null != c && null != d1 && null != d2) {
            LocalDate day1 = LocalDate.parse(d1);
            LocalDate day2 = LocalDate.parse(d2);
            
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("d1", day1.format(sqldf))
                    .addValue("d2", day2.format(sqldf))
                    .addValue("c", c);
            
            final String paymetsQuery = "SELECT id, d, i, a, c, l, s, g, descr FROM P WHERE d BETWEEN :d1 and :d2 AND c=:c ORDER BY d ASC";
            paymentsList = jdbcTemplate.query(paymetsQuery, 
                namedParameters,
                new RowMapperResultSetExtractor<P>(rmP));
        }
        
        if(e.equals("g") && null != g) {
            MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                    .addValue("g", g);
            
            final String paymetsQuery = "SELECT id, d, i, a, c, l, s, g, descr FROM P WHERE g=:g ORDER BY d ASC";
            paymentsList = jdbcTemplate.query(paymetsQuery, 
                namedParameters,
                new RowMapperResultSetExtractor<P>(rmP));
        }
        return Arrays.asList(paymentsList, balancesList);
    } 
    
    @RequestMapping(value = "lock")
    void lock(@RequestParam long id, @RequestParam boolean l) throws SQLException, ParseException {
    	final String query = "update p set l=:l WHERE id=:id ";
        MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("l", l);
        
        jdbcTemplate.update(query, namedParameters);
    }

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
     
   public void createP(List<P> payments) {
	   	String insertSQL =
					"INSERT INTO P(d, i, c, a, s, g, descr, l) VALUES(:d, :i, :c, :a, :s, :g, :descr, false)";
        for(P p : payments) {
        	MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("d", p.d)
                .addValue("i", p.i)
                .addValue("c", p.c)
                .addValue("a", p.a)
                .addValue("s", p.s)
                .addValue("g", p.g)
                .addValue("descr", p.descr);
	   		jdbcTemplate.update(insertSQL, namedParameters);
        }
   }
   
   public void removeP(List<Integer> ids) {
	   	String insertSQL = "DELETE FROM P WHERE id = :id";
        for(Integer id : ids) {
        	MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
	   		jdbcTemplate.update(insertSQL, namedParameters);
        }
   }

   public void modifyP(List<P> payments) {
	   for(P p : payments) {
		   String setterSQL = "";
		   
    		if(null != p.d) setterSQL += ", d = :d";
    		if(null != p.i) setterSQL += ", i = :i"; 
    		if(null != p.c) setterSQL += ", c = :c"; 
    		if(null != p.a) setterSQL += ", a = :a";
    		if(null != p.s) setterSQL += ", s = :s";
    		if(null != p.g) setterSQL += ", g = :g";
	    	if(null != p.descr) setterSQL += ", descr = :descr";
	    	
		    setterSQL = "UPDATE P SET "+setterSQL.substring(1) + " WHERE id=:id";
		    MapSqlParameterSource namedParameters = new MapSqlParameterSource()
		    	.addValue("id", p.id)
                .addValue("d", p.d)
                .addValue("i", p.i)
                .addValue("c", p.c)
                .addValue("a", p.a)
                .addValue("s", p.s)
                .addValue("g", p.g)
                .addValue("descr", p.descr);
	   		jdbcTemplate.update(setterSQL, namedParameters);
	   }
   }

    @RequestMapping(value = "update", method = RequestMethod.POST)
    void update(@RequestBody  Updates<P> updates) throws SQLException, ParseException {
    	createP(updates.created);
    	removeP(updates.deleted);
    	modifyP(updates.modified);
    	System.out.println("foo");
    }
    
    
   /* List<Constant> constants = new LinkedList<Constant>();
    {
    	constants.add(new Constant(1, "Golden Delisös -omena", "green", true));
    	constants.add(new Constant(2, "banaani", "yellow", true));
    	constants.add(new Constant(3, "mansikka", "red", true));
    	constants.add(new Constant(4, "mustikka", "blue", true));
    }*/
    
    @RequestMapping("constants")
    List<Constant> constants(String id) throws SQLException, ParseException {
    	List<Constant> constants =  new LinkedList<Constant>();
    	switch(id) {
    	case "cat" :
    		List<C> cats = cat();
    		for (C c : cats) {
    			constants.add(new Constant(c.id, c.descr, c.color, c.active));
    		}
    		return constants;
    	case "acc" :
    		List<A> accs = acc();
    		for (A a : accs) {
    			constants.add(new Constant(a.id, a.descr, a.color, a.active));
    		}
    		return constants;
    	}
    	return constants;
    }
    
    private static class Constant implements Serializable {
 		public long getValue() {
			return value;
		}
		public void setValue(long value) {
			this.value = value;
		}
		public String getLabel() {
			return label;
		}
		public void setLabel(String label) {
			this.label = label;
		}
		public String getColor() {
			return color;
		}
		public void setColor(String color) {
			this.color = color;
		}
		public boolean isValid() {
			return valid;
		}
		public void setValid(boolean valid) {
			this.valid = valid;
		}
		public static long getSerialversionuid() {
			return serialVersionUID;
		}

		private static final long serialVersionUID = 1L;
		long value;
    	String label;
    	String color;
    	boolean valid;
		public Constant(long value, String label, String color, boolean valid) {
			super();
			this.value = value;
			this.label = label;
			this.color = color;
			this.valid = valid;
		}
    }
    
    @RequestMapping("cat/list")
    List<C> cat() throws SQLException, ParseException {
    	final String query = "SELECT id, i, descr, active, color FROM C ORDER BY id ASC";
    	List<C> catList = jdbcTemplate.query(query, new RowMapperResultSetExtractor<C>(rmC));
        return catList;
    }
    
    public void createC(List<C> categories) {
	   	String insertSQL =
					"INSERT INTO C(i, descr, active, color) VALUES(:i, :descr, :active, :color)";
        for(C c : categories) {
        	MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("i", c.i)
                .addValue("descr", c.descr)
                .addValue("active", c.active)
                .addValue("color", c.color);
	   		jdbcTemplate.update(insertSQL, namedParameters);
        }
   }
   
   public void removeC(List<Integer> ids) {
	   	String insertSQL = "DELETE FROM C WHERE id = :id";
        for(Integer id : ids) {
        	MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
	   		jdbcTemplate.update(insertSQL, namedParameters);
        }
   }

   public void modifyC(List<C> categories) {
	   for(C c : categories) {
		   String setterSQL = "";
		   if(null != c.i) setterSQL += ", i = :i"; 
		   if(null != c.descr) setterSQL += ", descr = :descr"; 
		   if(null != c.active) setterSQL += ", active = :active";
		   if(null != c.color) setterSQL += ", color = :color";
		
		   setterSQL = "UPDATE C SET "+setterSQL.substring(1) + " WHERE id=:id";
		   MapSqlParameterSource namedParameters = new MapSqlParameterSource()
		    .addValue("i", c.i)
		    .addValue("descr", c.descr)
		    .addValue("active", c.active)
		    .addValue("color", c.color)
		    .addValue("id", c.id);
		    
		   jdbcTemplate.update(setterSQL, namedParameters);
	   }
   }

    @RequestMapping(value = "cat/update", method = RequestMethod.POST)
    void catUpdate(@RequestBody  Updates<C> updates) throws SQLException, ParseException {
    	createC(updates.created);
    	removeC(updates.deleted);
    	modifyC(updates.modified);
    }

    @RequestMapping("acc/list")
    List<A> acc() throws SQLException, ParseException {
    	final String query = "SELECT id, descr, active, color, credit FROM A ORDER BY id ASC";
    	List<A> accList = jdbcTemplate.query(query, new RowMapperResultSetExtractor<A>(rmA));
        return accList;
    }
    
    public void createA(List<A> accounts) {
	   	String insertSQL =
					"INSERT INTO A(credit, descr, active, color) VALUES(:credit, :descr, :active, :color)";
        for(A a : accounts) {
        	MapSqlParameterSource namedParameters = new MapSqlParameterSource()
                .addValue("credit", a.credit)
                .addValue("descr", a.descr)
                .addValue("active", a.active)
                .addValue("color", a.color);
	   		jdbcTemplate.update(insertSQL, namedParameters);
        }
   }
   
   public void removeA(List<Integer> ids) {
	   	String insertSQL = "DELETE FROM A WHERE id = :id";
        for(Integer id : ids) {
        	MapSqlParameterSource namedParameters = new MapSqlParameterSource().addValue("id", id);
	   		jdbcTemplate.update(insertSQL, namedParameters);
        }
   }

   public void modifyA(List<A> accounts) {
	   for(A a : accounts) {
		   String setterSQL = "";
		   if(null != a.credit) setterSQL += ", credit = :credit"; 
		   if(null != a.descr) setterSQL += ", descr = :descr"; 
		   if(null != a.active) setterSQL += ", active = :active";
		   if(null != a.color) setterSQL += ", color = :color";
		
		   setterSQL = "UPDATE A SET "+setterSQL.substring(1) + " WHERE id=:id";
		   MapSqlParameterSource namedParameters = new MapSqlParameterSource()
		    .addValue("credit", a.credit)
		    .addValue("descr", a.descr)
		    .addValue("active", a.active)
		    .addValue("color", a.color)
		    .addValue("id", a.id);
		   jdbcTemplate.update(setterSQL, namedParameters);
	   }
   }

    @RequestMapping(value = "acc/update", method = RequestMethod.POST)
    void accUpdate(@RequestBody  Updates<A> updates) throws SQLException, ParseException {
    	createA(updates.created);
    	removeA(updates.deleted);
    	modifyA(updates.modified);
    }    
}