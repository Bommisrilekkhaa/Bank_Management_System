package model;

import java.sql.Date;

public class Loan {
	
	 private int loan_id;
	 private String loan_type;
	 private double loan_amount;
	 private double loan_interest;
	 private int loan_duration;
	 private int loan_status;
	 private Date loan_availed_date;
	 private int user_id;
	 private String acc_no;
	 
	 
	public int getLoan_id() {
		return loan_id;
	}
	public void setLoan_id(int loan_id) {
		this.loan_id = loan_id;
	}
	public String getLoan_type() {
		return loan_type;
	}
	public void setLoan_type(String loan_type) {
		this.loan_type = loan_type;
	}
	public double getLoan_amount() {
		return loan_amount;
	}
	public void setLoan_amount(double loan_amount) {
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
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public String getAcc_no() {
		return acc_no;
	}
	public void setAcc_no(String acc_no) {
		this.acc_no = acc_no;
	}

	 
	 
}
