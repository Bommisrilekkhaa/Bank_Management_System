//package utility;
//
//import redis.clients.jedis.Jedis;
//import redis.clients.jedis.JedisPool;
//import redis.clients.jedis.JedisPoolConfig;
//
//public class RedisManager {
//    private static JedisPool jedisPool;
//
//    static {
//        JedisPoolConfig poolConfig = new JedisPoolConfig();
//        jedisPool = new JedisPool(poolConfig, "localhost", 6379);
//    }
//
//    public static Jedis getConnection() {
//        return jedisPool.getResource();
//    }
//}
