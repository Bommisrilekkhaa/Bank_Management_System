package model;

import java.math.BigDecimal;
import java.sql.Date;

public class Loan {
	
	 private int loan_id;
	 private int loan_type;
	 private BigDecimal loan_amount;
	 private double loan_interest;
	 private int loan_duration;
	 private int loan_status;
	 private Date loan_availed_date;
	 private int acc_number;
	 
	 
	public int getLoan_id() {
		return loan_id;
	}
	public void setLoan_id(int loan_id) {
		this.loan_id = loan_id;
	}
	public int getLoan_type() {
		return loan_type;
	}
	public void setLoan_type(int loan_type) {
		this.loan_type = loan_type;
	}
	public BigDecimal getLoan_amount() {
		return loan_amount;
	}
	public void setLoan_amount(BigDecimal loan_amount) {
		this.loan_amount = loan_amount;
	}
	public double getLoan_interest() {
		return loan_interest;
	}
	public void setLoan_interest(double loan_interest) {
		this.loan_interest = loan_interest;
	}
	public int getLoan_duration() {
		return loan_duration;
	}
	public void setLoan_duration(int loan_duration) {
		this.loan_duration = loan_duration;
	}
	public int getLoan_status() {
		return loan_status;
	}
	public void setLoan_status(int loan_status) {
		this.loan_status = loan_status;
	}
	public Date getLoan_availed_date() {
		return loan_availed_date;
	}
	public void setLoan_availed_date(Date loan_availed_date) {
		this.loan_availed_date = loan_availed_date;
	}
	
	public int getAcc_no() {
		return acc_number;
	}
	public void setAcc_no(int integer) {
		this.acc_number = integer;
	}

	 
	 
}
