import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from './api/database/dbconnection';
import { jobOfDeletingTokens } from './jobs/deleteUsedTokens';
import { notFoundResource } from './api/middlewares/notFoundResource';
import { userRouter, categoryRouter, transactionRouter, authRouter } from './routes';
import { errorRequestHandler } from './api/middlewares/errorRequestHandler';
import { rateTimiter } from './api/middlewares/rateLimiter';

jobOfDeletingTokens.start();
mongoose.connections[0];
const app = express();
const baseUrl = '/api/v1';

app.use(rateTimiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (!(process.env.NODE_ENV === 'production')) app.use(morgan('dev'));

app.use(baseUrl, userRouter);
app.use(baseUrl, authRouter);
app.use(baseUrl, categoryRouter);
app.use(baseUrl, transactionRouter);

app.use(errorRequestHandler);
app.use(notFoundResource);

export default app;
