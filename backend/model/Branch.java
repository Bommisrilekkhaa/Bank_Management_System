package model;

public class Branch 
{
	 private int branch_id;
	 private String name;
	 private String address;
	 private String branch_no;
	 private int bank_id;
	 private boolean is_main_branch;
	 private int manager_id;
	public int getBranch_id() {
		return branch_id;
	}
	public void setBranch_id(int branch_id) {
		this.branch_id = branch_id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getBranch_no() {
		return branch_no;
	}
	public void setBranch_no(String branch_no) {
		this.branch_no = branch_no;
	}
	public int getBank_id() {
		return bank_id;
	}
	public void setBank_id(int bank_id) {
		this.bank_id = bank_id;
	}
	public boolean getIs_main_branch() {
		return is_main_branch;
	}
	public void setIs_main_branch(boolean is_main_branch) {
		this.is_main_branch = is_main_branch;
	}
	public int getManager_id() {
		return manager_id;
	}
	public void setManager_id(int manager_id) {
		this.manager_id = manager_id;
	}
	 
	 
	 
	

}
