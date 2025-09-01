const redis = require("../config/redis");
const windowSeconds = 10; // time window in seconds
const maxRequests = 2;

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const key = `ratelimit:${ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
      // First request — set expiration
      await redis.expire(key, windowSeconds);
    }

    if (current > maxRequests) {
      return res.status(429).json({
        message: "Too Many Requests — Slow Down",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Checks if the user is within allowed rate limits
 * @param {string} identifier - Unique key (userId or IP or socket.id)
 * @param {string} eventName - Event name for more granularity
 * @returns {Promise<boolean>} true if allowed, false if rate-limited
 */
const isRateLimited = async (
  identifier,
  eventName,
  maxRequests = 10,
  windowSeconds = 10
) => {
  const key = `ratelimit:${identifier}:${eventName}`;
  try {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    return current > maxRequests;
  } catch (err) {
    console.error("Redis rate limit error:", err);
    return false; // fallback: allow if Redis fails
  }
};

module.exports = { rateLimitMiddleware, isRateLimited };
