package utility;

import java.io.IOException;
import java.io.InputStream;
import java.util.logging.LogManager;
import java.util.logging.Logger;

public class LoggerConfig {
	

    static {
        // Load the logging.properties file programmatically
        try (InputStream configFile = LoggerConfig.class.getClassLoader().getResourceAsStream("logging.properties")) {
            if (configFile != null) {
                LogManager.getLogManager().readConfiguration(configFile);
                System.out.println("Logger configuration loaded from logging.properties");
            } else {
                System.err.println("Could not find logging.properties file.");
            }
        } catch (IOException e) {
            System.err.println("Error loading logging configuration: " + e.getMessage());
        }
    }

    // Static method to initialize and return the logger
    public static Logger initializeLogger() {
        // Get the logger for the application (this will use the configuration in logging.properties)
        return Logger.getLogger("BankApplicationLogger");
    }
}
