import { Express } from 'express';
import { userRouter, categoryRouter, transactionRouter, authRouter } from '.';

export default async (app: Express) => {
  const baseUrl = '/api/v1';
  app.use(baseUrl, userRouter, authRouter, categoryRouter, transactionRouter);
};
