package enums;

import java.util.HashMap;
import java.util.Map;

public enum LoanType {

	HOMELOAN(0),
	BUSINESSLOAN(1),
	EDUCATIONLOAN(2);

	private int value;
	private static Map<Integer, LoanType> map = new HashMap<>();

	private LoanType(int value) {
		this.value = value;

	}

	static {
		for (LoanType type : LoanType.values()) {
			map.put(type.value, type);
		}
	}

	public static LoanType valueOf(int type) {
		return (LoanType) map.get(type);

	}

	public int getValue() {
		return value;
	}

}
