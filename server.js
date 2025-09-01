require("dotenv").config();
const app = require("./src/app");
const httpServer = require("http").createServer(app);
const connectDB = require("./src/db/db");
const initailizeSocket = require("./src/sockets/socket.server");
const redis = require("./src/config/redis");

(async () => {
  try {
    const dbConnection = await connectDB(); // Should return mongoose.connection

    // Remove this if using ioredis with lazyConnect: false
    // await redis.connect();

    console.log("Redis client ready");

    const PORT = process.env.PORT || 3000;

    initailizeSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      try {
        await dbConnection.close();
        await redis.quit();
        httpServer.close(() => {
          console.log("Closed out remaining connections.");
          process.exit(0);
        });
      } catch (err) {
        console.error("Error during shutdown", err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error("Failed to start the application", err);
    process.exit(1);
  }
})();
