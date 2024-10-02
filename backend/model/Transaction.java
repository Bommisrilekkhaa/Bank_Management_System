package model;

import java.sql.Timestamp;

public class Transaction {
    
    private int transaction_id;
    private Timestamp transaction_datetime;
    private int transaction_type;
    private int transaction_status;
    private double transaction_amount;
    private int acc_number;

    public int getTransaction_id() {
        return transaction_id;
    }

    public void setTransaction_id(int transaction_id) {
        this.transaction_id = transaction_id;
    }

    public Timestamp getTransaction_datetime() {
        return transaction_datetime;
    }

    public void setTransaction_datetime(Timestamp transaction_datetime) {
        this.transaction_datetime = transaction_datetime;
    }

    public int getTransaction_type() {
        return transaction_type;
    }

    public void setTransaction_type(int transaction_type) {
        this.transaction_type = transaction_type;
    }

    public int getTransaction_status() {
        return transaction_status;
    }

    public void setTransaction_status(int transaction_status) {
        this.transaction_status = transaction_status;
    }

    public double getTransaction_amount() {
        return transaction_amount;
    }

    public void setTransaction_amount(double transaction_amount) {
        this.transaction_amount = transaction_amount;
    }

    public int getAcc_number() {
        return acc_number;
    }

    public void setAcc_number(int acc_number) {
        this.acc_number = acc_number;
    }
}
