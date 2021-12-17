import { Db, MongoClient } from "mongodb";
import config from '../config';

export const connectDB = async (): Promise<Db> => {

  const cluster = config.CLUSTER;
  const db_name = config.MONGO_DB;
  const password = config.MONGO_PASSWORD;
  const user = config.MONGO_USER;
  if (!cluster || !db_name || !user || !password) {
    throw Error("Please define all de params of .env.example file");
  };
  const uri: string = `mongodb+srv://${user}:${password}@${cluster}/${db_name}e?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.info("MongoDB connected");

    return client.db(db_name);
  } catch (e) {
    throw e;
  }
};