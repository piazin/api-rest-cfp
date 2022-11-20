import morgan from 'morgan';
import express, {
  Request as Req,
  Response as Res,
  NextFunction as Next,
  ErrorRequestHandler as ErrReqHndler,
} from 'express';

import mongoose from './api/database/dbconnection';
mongoose.connections[0];

import { router as categoryRouter } from './routes/category.routes';
import { router as userRouter } from './routes/user.routes';
import { router as transactionRouter } from './routes/transaction.routes';

const app = express();

import { job } from './jobs/testJob';
job.start();

// routes import

if (!(process.env.NODE_ENV === 'production')) app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/transaction', transactionRouter);

app.use((err: ErrReqHndler, req: Req, res: Res, next: Next) => {
  if (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      message: 'Ops! Bad Request',
    });
  }
  next();
});

app.use((req: Req, res: Res, next: Next) => {
  res.status(404).json({
    status: 404,
    message: 'Ops Bad Request! Nothing around here',
  });
});

export default app;
