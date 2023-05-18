import fs from 'fs';
import { resolve } from 'path';

const options = {
  key: fs.readFileSync(resolve('cert/server.key')),
  cert: fs.readFileSync(resolve('cert/server.cert')),
};

export { options };
