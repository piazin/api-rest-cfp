import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';
dotenv.config();

export default {
  port: Number(process.env.PORT),
  cores: Number(process.env.MAX_CORES),
  db: {
    url: process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : process.env.MONGO_DOCKER,
  },
  redis: {
    username: process.env.REDIS_USER_NAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: 6379,
  },
  email: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
    api_key_resend: process.env.RESENDER_API_KEY,
  },
  jwt_secret: process.env.SECRET_JWT,
  google_folder_id: process.env.GOOGLE_API_FOLDER_ID,
  google_json_key: process.env.GOOGLE_JSON_KEY,
  // process.env.NODE_ENV === 'production'
  //   ? process.env.GOOGLE_JSON_KEY
  //   : JSON.parse(fs.readFileSync(resolve('keys/google_json_key.json'), { encoding: 'utf-8' })),
  google_email: process.env.GOOGLE_EMAIL,
};
