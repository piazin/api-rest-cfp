import express from 'express';
import config from './config';
import { useRoutes } from '@routes';
import { manageCluster } from './cluster';
import mongoose from './api/database/dbconnection';
import { useMiddlewares } from '@middlewares/useMiddlewares';
import { jobOfDeletingTokens } from '@jobs/deleteUsedTokens';
import { notFoundResource } from '@middlewares/notFoundResource';
import { errorRequestHandler } from '@middlewares/errorRequestHandler';

const app = express();

mongoose.connections[0];
jobOfDeletingTokens.start();

useMiddlewares(app);
useRoutes(app);

app.use(errorRequestHandler);
app.use(notFoundResource);

manageCluster(app, config.cores);
