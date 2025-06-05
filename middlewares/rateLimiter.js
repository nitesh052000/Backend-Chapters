import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

let rateLimiter;

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  legacyMode: true,
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error in rate limiter:", err.message);
});

async function createRateLimiter() {
  await redisClient.connect().catch((err) => {
    console.error("❌ Redis connection failed:", err.message);
  });

  return rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: "⚠️ Too many requests from this IP. Please try again later.",
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
  });
}

rateLimiter = await createRateLimiter();

export default rateLimiter;
