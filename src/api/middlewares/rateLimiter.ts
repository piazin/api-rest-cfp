import { RequestHandler } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: 5,
  duration: 5,
});

export const rateTimiter: RequestHandler = async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    return next();
  } catch (error) {
    console.error(error);
    return res.status(429).json({ message: 'Too many requests', code: 429 });
  }
};
