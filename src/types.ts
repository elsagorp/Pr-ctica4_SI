import { Db } from "mongodb";
import { UserMongo } from "./mongo/type";


export interface IContext {
  db: Db;
  user?: UserMongo;
}


