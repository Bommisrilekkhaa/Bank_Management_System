package utility;

import java.io.IOException;
import java.io.InputStream;
import java.util.logging.LogManager;
import java.util.logging.Logger;

public class LoggerConfig {
	

    static {
        try (InputStream configFile = LoggerConfig.class.getClassLoader().getResourceAsStream("logging.properties")) {
            if (configFile != null) {
                LogManager.getLogManager().readConfiguration(configFile);
//                System.out.println("Logger configuration loaded from logging.properties");
            } else {
                System.err.println("Could not find logging.properties file.");
            }
        } catch (IOException e) {
            System.err.println("Error loading logging configuration: " + e.getMessage());
        }
    }

    public static Logger initializeLogger() {
        return Logger.getLogger("BankApplicationLogger");
    }
}
