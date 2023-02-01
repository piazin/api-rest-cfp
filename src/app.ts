import morgan from 'morgan';
import express from 'express';
import mongoose from './api/database/dbconnection';
import { jobOfDeletingTokens } from './jobs/deleteUsedTokens';
import { notFoundResource } from './api/middlewares/notFoundResource';
import { userRouter, categoryRouter, transactionRouter } from './routes';
import { errorRequestHandler } from './api/middlewares/errorRequestHandler';

jobOfDeletingTokens.start();
mongoose.connections[0];
const app = express();

// routes import
if (!(process.env.NODE_ENV === 'production')) app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/transaction', transactionRouter);

app.use(errorRequestHandler);
app.use(notFoundResource);

export default app;
