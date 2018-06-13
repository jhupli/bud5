package onassis.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;

public class H {
    Timestamp hd;
    String op;
    Integer rownr;
    Integer id;
    Date d;
    BigDecimal i;
    Integer c;
    Integer a;
    Boolean s;
	String g;
	String descr;
       
    public H(Timestamp hd, String op, Integer rownr, Integer id, Date d, BigDecimal i, Integer c, Integer a, Boolean s,
			String g, String descr) {
		super();
		this.hd = hd;
		this.op = op;
		this.rownr = rownr;
		this.id = id;
		this.d = d;
		this.i = i;
		this.c = c;
		this.a = a;
		this.s = s;
		this.g = g;
		this.descr = descr;
	}

	public Timestamp getHd() {
		return hd;
	}

	public void setHd(Timestamp hd) {
		this.hd = hd;
	}

	public String getOp() {
		return op;
	}

	public void setOp(String op) {
		this.op = op;
	}

	public Integer getRownr() {
		return rownr;
	}

	public void setRownr(Integer rownr) {
		this.rownr = rownr;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Date getD() {
		return d;
	}

	public void setD(Date d) {
		this.d = d;
	}

	public BigDecimal getI() {
		return i;
	}

	public void setI(BigDecimal i) {
		this.i = i;
	}

	public Integer getC() {
		return c;
	}

	public void setC(Integer c) {
		this.c = c;
	}

	public Integer getA() {
		return a;
	}

	public void setA(Integer a) {
		this.a = a;
	}

	public Boolean getS() {
		return s;
	}

	public void setS(Boolean s) {
		this.s = s;
	}

	public String getG() {
		return g;
	}

	public void setG(String g) {
		this.g = g;
	}

	public String getDescr() {
		return descr;
	}

	public void setDescr(String descr) {
		this.descr = descr;
	}
}
