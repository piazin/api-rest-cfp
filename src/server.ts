import app from './app';
import https from 'https';
import config from './config';
import { options } from './server.config';

https.createServer(options, app).listen(config.port, null, null, () => {
  console.log(`🚀 -> server on in http://localhost:${config.port}`);
});
