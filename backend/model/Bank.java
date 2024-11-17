package model;

public class Bank {

	private int bank_id;
	private String bank_name;
	private String bank_code;
	private int admin_id;
	private int main_branch_id;

	public int getBank_id() {
		return bank_id;
	}

	public void setBank_id(int bank_id) {
		this.bank_id = bank_id;
	}

	public String getBank_name() {
		return bank_name;
	}

	public void setBank_name(String bank_name) {
		this.bank_name = bank_name;
	}

	public String getBank_code() {
		return bank_code;
	}

	public void setBank_code(String bank_code) {
		this.bank_code = bank_code;
	}

	public int getAdmin_id() {
		return admin_id;
	}

	public void setAdmin_id(int admin_id) {
		this.admin_id = admin_id;
	}

	public int getMain_branch_id() {
		return main_branch_id;
	}

	public void setMain_branch_id(int main_branch_id) {
		this.main_branch_id = main_branch_id;
	}

}
