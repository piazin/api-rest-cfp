import { cpus } from 'os';
import cluster from 'cluster';
import { Express } from 'express';
import { startServer } from './server';

let numberOfCPUs = cpus().length;

export function manageCluster(app: Express, maxCors?: number, maxRestarts = 5) {
  if (cluster.isPrimary) {
    let restartCounts = new Map();

    if (maxCors) numberOfCPUs = maxCors;
    for (let i = 0; i < numberOfCPUs; i++) {
      cluster.fork();
      console.log(i);
    }

    cluster.on('exit', (worker, code, signal) => {
      const restartCount = restartCounts.get(worker.id) || 0;
      if (restartCount < maxRestarts) {
        console.info(`Worker ${worker.id} exited with code ${code}. Restarting...`);
        restartCounts.set(worker.id, restartCount + 1);
        cluster.fork();
      } else {
        console.info(`Worker ${worker.id} reached the maximum restart limit. Not restarting.`);
      }
    });

    const workers = Object.values(cluster.workers);
    let currentWorkerIndex = 0;

    for (const worker of workers) {
      worker.on('message', (message) => {
        if (message.type === 'assignJob') {
          const job = message.job;
          const targetWorker = getNextWorker();
          targetWorker.send({ type: 'job', job });
        }
      });
    }

    function getNextWorker() {
      const nextWorker = workers[currentWorkerIndex];
      currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
      return nextWorker;
    }

    const gracefulShutdown = () => {
      console.info('Received shutdown signal. Shutting down...');
      for (const worker of workers) {
        worker.disconnect();
      }
      process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } else {
    startServer(app);
  }
}
