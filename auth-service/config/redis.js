const redis = require("redis");

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

redisClient.on("error", (err) => {
  console.error(err);
});

module.exports = { redisClient };
