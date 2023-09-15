import config from '@config';
import mongoose from 'mongoose';

const {
  db: { url },
} = config;

(async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(url);
    console.log('💾 -> mongodb connection successfull');
  } catch (error) {
    console.log('🚀 ~ file: dbconnection.ts:13 ~ error', error);
  }
})();

export default mongoose;
