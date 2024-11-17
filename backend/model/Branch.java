package model;

public class Branch {
	private int branch_id;
	private String branch_name;
	private String branch_address;
	private int branch_number;
	private int bank_id;
	private int manager_id;

	public int getBranch_id() {
		return branch_id;
	}

	public void setBranch_id(int branch_id) {
		this.branch_id = branch_id;
	}

	public String getName() {
		return branch_name;
	}

	public void setName(String name) {
		this.branch_name = name;
	}

	public String getAddress() {
		return branch_address;
	}

	public void setAddress(String address) {
		this.branch_address = address;
	}

	public int getBranch_number() {
		return branch_number;
	}

	public void setBranch_number(int branch_number) {
		this.branch_number = branch_number;
	}

	public int getBank_id() {
		return bank_id;
	}

	public void setBank_id(int bank_id) {
		this.bank_id = bank_id;
	}

	public int getManager_id() {
		return manager_id;
	}

	public void setManager_id(int manager_id) {
		this.manager_id = manager_id;
	}

}
