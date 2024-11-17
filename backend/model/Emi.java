package model;

import java.sql.Date;
import java.sql.Timestamp;

public class Emi {

    private int emi_id;
    private int emi_number;
    private int transaction_id;
    private int loan_id;
    private Timestamp transaction_datetime;
    private int loan_duration;
    private Date loan_availed_date;

    public int getEmi_id() {
        return emi_id;
    }

    public void setEmi_id(int emi_id) {
        this.emi_id = emi_id;
    }

    public int getEmi_number() {
        return emi_number;
    }

    public void setEmi_number(int emi_number) {
        this.emi_number = emi_number;
    }

    public int getTransaction_id() {
        return transaction_id;
    }

    public void setTransaction_id(int transaction_id) {
        this.transaction_id = transaction_id;
    }

    public int getLoan_id() {
        return loan_id;
    }

    public void setLoan_id(int loan_id) {
        this.loan_id = loan_id;
    }

    public Timestamp getTransaction_datetime() {
        return transaction_datetime;
    }

    public void setTransaction_datetime(Timestamp transaction_datetime) {
        this.transaction_datetime = transaction_datetime;
    }

    public int getLoan_duration() {
        return loan_duration;
    }

    public void setLoan_duration(int loan_duration) {
        this.loan_duration = loan_duration;
    }

    public Date getLoan_availed_date() {
        return loan_availed_date;
    }

    public void setLoan_availed_date(Date loan_availed_date) {
        this.loan_availed_date = loan_availed_date;
    }
}
