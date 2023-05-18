import Redis from 'ioredis';
import { RequestHandler } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis({ enableOfflineQueue: false });

redisClient.on('error', (err) => {
  console.error('🚀 ~ file: rateLimiter.ts:10 ~ redisClient.on ~ err:', err);
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 5,
  duration: 5,
});

export const rateLimiter: RequestHandler = async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    return next();
  } catch (error) {
    return res.status(429).json({ message: 'Too many requests', code: 429 });
  }
};
