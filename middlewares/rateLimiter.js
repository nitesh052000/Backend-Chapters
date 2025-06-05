import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

// Create Redis client (must use legacyMode: true)
const redisClient = createClient({
  url: process.env.REDIS_URL,
  legacyMode: true, // required for compatibility with rate-limit-redis
});

await redisClient.connect().catch((err) => {
  console.error("❌ Redis connection failed:", err.message);
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error in rate limiter:", err.message);
});

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: "⚠️ Too many requests from this IP. Please try again later.",
  store: RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

export default rateLimiter;
