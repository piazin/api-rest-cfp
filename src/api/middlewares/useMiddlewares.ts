import cors from 'cors';
import morgan from 'morgan';
import express, { Express } from 'express';
import { rateLimiter } from './rateLimiter';

export const useMiddlewares = async (app: Express) => {
  app.use(rateLimiter, cors(), express.json(), express.urlencoded({ extended: false }));
  if (!(process.env.NODE_ENV === 'production')) {
    app.use(morgan('dev'));
  }
};
