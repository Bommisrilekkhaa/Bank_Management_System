package model;

import java.math.BigDecimal;

public class Account {

	private int acc_number;
	private int acc_type;
	private BigDecimal acc_balance;
	private int acc_status;
	private int user_id;
	private int branch_id;

	public int getAccNo() {
		return acc_number;
	}

	public void setAccNo(int i) {
		this.acc_number = i;
	}

	public int getAccType() {
		return acc_type;
	}

	public void setAccType(int accType) {
		this.acc_type = accType;
	}

	public BigDecimal getAccBalance() {
		return acc_balance;
	}

	public void setAccBalance(BigDecimal accBalance) {
		this.acc_balance = accBalance;
	}

	public int getAccStatus() {
		return acc_status;
	}

	public void setAccStatus(int accStatus) {
		this.acc_status = accStatus;
	}

	public int getUserId() {
		return user_id;
	}

	public void setUserId(int userId) {
		this.user_id = userId;
	}

	public int getBranchId() {
		return branch_id;
	}

	public void setBranchId(int branchId) {
		this.branch_id = branchId;
	}

}
