import { createClient } from "redis";
import { config } from ".";

export async function connectToRedis() {
  try {
    const redisClient = createClient({
      url: config.REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.log("Redis connection error:", err);
    });

    redisClient.on("end", () => {
      console.log("Disconnected from Redis");
    });

    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.log("Redis connection error:", err);
  }
}
