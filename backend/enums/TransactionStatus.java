package enums;

import java.util.HashMap;
import java.util.Map;

public enum TransactionStatus {
	
	PENDING(0),
	SUCCESS(1);

	
	private int value;
    private static Map<Integer,TransactionStatus> map = new HashMap<>();

	private TransactionStatus(int value) 
	{
		this.value = value;
			
	}
		
		
	static 
	{
	    for (TransactionStatus status : TransactionStatus.values()) 
	    {
	        map.put(status.value, status);
	    }
	}

	public static TransactionStatus valueOf(int status) 
	{
	    return (TransactionStatus) map.get(status);
	    
	}

	public int getValue() 
	{
	        return value;
	}
	


}
