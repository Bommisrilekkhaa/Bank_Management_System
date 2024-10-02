package model;

public class Emi {

    private int emi_id;
    private int emi_number;
    private int transaction_id;
    private int loan_id;

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
}
