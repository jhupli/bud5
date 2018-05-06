package onassis.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;

public class B {
	Date d;
	BigDecimal b;
	BigDecimal i;
	BigDecimal e;
	Integer a;
	BigDecimal smallestb = BigDecimal.valueOf(0).setScale(2, RoundingMode.UP);

	public B(Date d, BigDecimal b, BigDecimal i, BigDecimal e, Integer a) {
		super();
		this.d = d;
		this.b = b;
		this.i = i;
		this.e = e;
		this.a = a;
	}

	public Date getD() {
		return d;
	}

	public void setD(Date d) {
		this.d = d;
	}

	public BigDecimal getB() {
		return b;
	}

	public void setB(BigDecimal b) {
		this.b = b;
	}

	public BigDecimal getI() {
		return i;
	}

	public void setI(BigDecimal i) {
		this.i = i;
	}

	public BigDecimal getE() {
		return e;
	}

	public void setE(BigDecimal e) {
		this.e = e;
	}

	public Integer getA() {
		return a;
	}

	public void setA(Integer a) {
		this.a = a;
	}

	public BigDecimal getSmallestb() {
		return smallestb;
	}

	public void setSmallestb(BigDecimal smallestb) {
		this.smallestb = smallestb;
	}
}
