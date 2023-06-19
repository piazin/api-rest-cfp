import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: Number(process.env.PORT),
  db: {
    url: process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : process.env.MONGO_DOCKER,
  },
  email: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
    api_key_resend: process.env.RESENDER_API_KEY,
  },
  jwt_secret: process.env.SECRET_JWT,
  google_folder_id: process.env.GOOGLE_API_FOLDER_ID,
};
