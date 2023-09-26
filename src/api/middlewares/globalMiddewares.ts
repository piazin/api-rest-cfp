import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { rateLimiter } from './rateLimiter';

const globalMiddewares: express.RequestHandler[] = [cors(), rateLimiter];
if (process.env.NODE_ENV !== 'production') {
  globalMiddewares.push(morgan('dev'));
}

export { globalMiddewares };
