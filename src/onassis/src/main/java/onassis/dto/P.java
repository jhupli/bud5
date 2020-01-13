package onassis.dto;

import java.math.BigDecimal;
import java.util.Date;

public class P {
	public Long id;
	public Date d;
    public Date dc;
	public BigDecimal i;
	public Integer c;
	public Integer a;
	public Boolean s;
	public String g;
	public String descr;
	public Boolean l;
	
	public P() {
		super();
	}
	
	public P(Long id, Date d, BigDecimal i, Integer c, Integer a, Boolean s, String g, String descr, Boolean l) {
		super();
		this.id = id;
		this.d = d;
		this.i = i;
		this.c = c;
		this.a = a;
		this.s = s;
		this.g = g;
		this.descr = descr;
		this.l = l;
		//FIXME:
		this.dc = d;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
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
	public Boolean getL() {
		return l;
	}
	public void setL(Boolean l) {
		this.l = l;
	}
}
