package model;

import java.util.HashMap;
import java.util.Map;

public enum AccountType {
	
	BUSSINESS(0),
	SAVINGS(1);
	
	private int value;
    private static Map<Integer,AccountType> map = new HashMap<>();

	private AccountType(int value) 
	{
		this.value = value;
			
	}
		
		
	static 
	{
	    for (AccountType type : AccountType.values()) 
	    {
	        map.put(type.value, type);
	    }
	}

	public static AccountType valueOf(int type) 
	{
	    return (AccountType) map.get(type);
	    
	}

	public int getValue() 
	{
	        return value;
	}

}
