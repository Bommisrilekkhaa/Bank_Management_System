package enums;

import java.util.HashMap;
import java.util.Map;

public enum UserRole {
	
	ADMIN(0),
	MANAGER(1),
	CUSTOMER(2);

	
	private int value;
    private static Map<Integer,UserRole> map = new HashMap<>();

	private UserRole(int value) 
	{
		this.value = value;
			
	}
		
		
	static 
	{
	    for (UserRole role : UserRole.values()) 
	    {
	        map.put(role.value, role);
	    }
	}

	public static UserRole valueOf(int role) 
	{
	    return (UserRole) map.get(role);
	    
	}

	public int getValue() 
	{
	        return value;
	}
	

}
