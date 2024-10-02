package enums;

import java.util.HashMap;
import java.util.Map;

public enum TransactionType {
	
	CREDIT(0),
	DEBIT(1),
	EMI(2);

	
	private int value;
    private static Map<Integer,TransactionType > map = new HashMap<>();

	private TransactionType (int value) 
	{
		this.value = value;
			
	}
		
		
	static 
	{
	    for (TransactionType  type :TransactionType .values()) 
	    {
	        map.put(type.value, type);
	    }
	}

	public static TransactionType  valueOf(int type) 
	{
	    return (TransactionType ) map.get(type);
	    
	}

	public int getValue() 
	{
	        return value;
	}
	

}
