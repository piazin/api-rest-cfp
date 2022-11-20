import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT,
  db: {
    url: process.env.MONGO_URL,
  },
  jwt_secret: process.env.SECRET_JWT,
  google_json_key: process.env.GOOGLE_JSON_KEY,
  google_folder_id: process.env.GOOGLE_API_FOLDER_ID,
};
