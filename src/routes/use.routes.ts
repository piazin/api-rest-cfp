import { Express } from 'express';
import { userRouter, categoryRouter, transactionRouter, authRouter } from '.';

export const useRoutes = async (app: Express) => {
  const baseUrl = '/api/v1';
  app.get('/', (req, res) => res.status(200).json({}));
  app.use(baseUrl, userRouter, authRouter, categoryRouter, transactionRouter);
};
