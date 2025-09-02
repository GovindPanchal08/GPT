const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  lazyConnect: true,
  connectTimeout: 10000,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 100, 2000),
  // tls: {}, // Uncomment if using Redis over TLS (e.g., Redis Labs, Azure, etc.)
});

module.exports = redis;
