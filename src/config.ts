import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT ,
  CLUSTER: process.env.ATLAS_CLUSTER,
  MONGO_DB: process.env.MONGO_DATABASE,
  MONGO_USER: process.env.MONGO_USER ,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD 
};