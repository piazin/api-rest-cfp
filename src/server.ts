import config from './config';
import { Express } from 'express';

export function startServer(app: Express) {
  const server = app.listen(config.port, () => console.info(`🚀 -> server on #${process.pid}`));

  process.on('uncaughtException', (error) => {
    console.error('🚀 ~ file: server.ts:8 ~ process.on ~ error:', error);
    shutdownServer();
  });

  process.on('unhandledRejection', (reason) => {
    console.error('🚀 ~ file: server.ts:14 ~ process.on ~ reason:', reason);
    shutdownServer();
  });

  process.on('SIGINT', shutdownServer);

  function shutdownServer() {
    console.info(`Shutting down server on process #${process.pid}...`);
    server.close(() => {
      console.info(`Server on process #${process.pid} has been shut down.`);
      process.exit(0);
    });
  }
}
