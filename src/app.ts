import express from 'express';
import mongoose from './api/database/dbconnection';
import { useMiddlewares } from './api/middlewares/useMiddlewares';
import { jobOfDeletingTokens } from './jobs/deleteUsedTokens';
import { notFoundResource } from './api/middlewares/notFoundResource';
import { errorRequestHandler } from './api/middlewares/errorRequestHandler';
import { useRoutes } from './routes/use.routes';

const app = express();

mongoose.connections[0];
jobOfDeletingTokens.start();

useMiddlewares(app);
useRoutes(app);

app.use(errorRequestHandler);
app.use(notFoundResource);

export default app;
