package enums;

import java.util.HashMap;
import java.util.Map;

public enum LoanStatus {

	PENDING(0),
	APPROVED(1),
	CLOSED(2),
	REJECTED(3);

	private int value;
	private static Map<Integer, LoanStatus> map = new HashMap<>();

	private LoanStatus(int value) {
		this.value = value;

	}

	static {
		for (LoanStatus status : LoanStatus.values()) {
			map.put(status.value, status);
		}
	}

	public static LoanStatus valueOf(int status) {
		return (LoanStatus) map.get(status);

	}

	public int getValue() {
		return value;
	}

}
