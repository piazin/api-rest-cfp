import config from './config';
import { manageCluster } from './cluster';
import { controllers } from '@controllers/index';
import mongoose from './api/database/dbconnection';
import { createExpressServer } from 'routeify-express';
import { jobOfDeletingTokens } from '@jobs/deleteUsedTokens';
import { globalMiddewares } from '@middlewares/globalMiddewares';
import { notFoundResource } from '@middlewares/notFoundResource';
import { errorRequestHandler } from '@middlewares/errorRequestHandler';

mongoose.connections[0];
jobOfDeletingTokens.start();

const app = createExpressServer({
  globalPrefix: 'api/v1',
  defaultExpressJson: true,
  controllers: controllers,
  useGlobalMiddlewares: globalMiddewares,
  useMiddlewaresAfterAll: [notFoundResource],
});

app.use(errorRequestHandler);
manageCluster(app, config.cores);
