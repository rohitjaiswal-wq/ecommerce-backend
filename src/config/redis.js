// const { createClient } =
//   require("redis")

// const redisClient =
//   createClient()

// redisClient.on(
//   "error",
//   (err) => {
//     console.log(
//       "Redis Error:",
//       err
//     )
//   }
// )

// const connectRedis =
//   async () => {

//     await redisClient.connect()

//     console.log(
//       "Redis Connected"
//     )
// }

// module.exports = {

//   redisClient,

//   connectRedis
// }


const { createClient } = require("redis");

let redisClient = null;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.log("⚠️ Redis is disabled (REDIS_URL not configured).");
    return;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Error:", err);
    });

    await redisClient.connect();
    console.log("✅ Redis Connected");
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err.message);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};