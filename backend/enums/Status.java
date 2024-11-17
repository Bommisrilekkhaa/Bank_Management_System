package enums;

import java.util.HashMap;
import java.util.Map;

public enum Status {

	PENDING(0),
	ACTIVE(1),
	INACTIVE(2);

	private int value;
	private static Map<Integer, Status> map = new HashMap<>();

	private Status(int value) {
		this.value = value;

	}

	static {
		for (Status status : Status.values()) {
			map.put(status.value, status);
		}
	}

	public static Status valueOf(int status) {
		return (Status) map.get(status);

	}

	public int getValue() {
		return value;
	}

}
