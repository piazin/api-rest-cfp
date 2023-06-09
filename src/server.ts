import app from './app';
import https from 'https';
import config from './config';
import { options } from './server.config';

app.listen(config.port, () => console.log(`🚀 -> server on in http://localhost:${config.port}`));

// https.createServer(options, app).listen(config.port, null, null, () => {
//   console.log(`🚀 -> server on in https://localhost:${config.port}`);
// });
