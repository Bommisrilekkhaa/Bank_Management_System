package Exception;

import java.util.logging.Level;
import java.util.logging.Logger;

public class CustomExceptions {

    private static final Logger logger = Logger.getLogger(CustomExceptions.class.getName());


    public static class CustomSQLException extends Exception {
        private static final long serialVersionUID = 1L;

        public CustomSQLException(String message) {
            super(message);
            logError(message);
        }

        public CustomSQLException(String message, Throwable cause) {
            super(message, cause);
            logError(message);
        }

        private void logError(String message) {
            logger.log(Level.SEVERE, "CustomSQLException: " + message);
        }
    }

  
    public static class CustomIllegalAccessException extends Exception {
        private static final long serialVersionUID = 1L;

        public CustomIllegalAccessException(String message) {
            super(message);
            logError(message);
        }

        public CustomIllegalAccessException(String message, Throwable cause) {
            super(message, cause);
            logError(message);
        }

        private void logError(String message) {
            logger.log(Level.SEVERE, "CustomIllegalAccessException: " + message);
        }
    }

   
   
}
