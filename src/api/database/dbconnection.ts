import mongoose from "mongoose";
import config from "../../config/";

const {
  db: { url },
} = config;

(async () => {
  try {
    await mongoose.connect(url);
    console.log("db connected");
  } catch (error) {
    console.error(error);
  }
})();

export default mongoose;
