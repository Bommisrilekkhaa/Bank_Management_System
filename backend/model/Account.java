package model;

public class Account {
	
	private int accNo;
    private int accType;
    private double accBalance;
    private int accStatus;
    private int userId;
    private int branchId;
	public int getAccNo() {
		return accNo;
	}
	public void setAccNo(int i) {
		this.accNo = i;
	}
	public int getAccType() {
		return accType;
	}
	public void setAccType(int accType) {
		this.accType = accType;
	}
	public double getAccBalance() {
		return accBalance;
	}
	public void setAccBalance(double accBalance) {
		this.accBalance = accBalance;
	}
	public int getAccStatus() {
		return accStatus;
	}
	public void setAccStatus(int accStatus) {
		this.accStatus = accStatus;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getBranchId() {
		return branchId;
	}
	public void setBranchId(int branchId) {
		this.branchId = branchId;
	}
    
    
    
	

}
