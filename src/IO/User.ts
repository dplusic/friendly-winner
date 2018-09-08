import { DB } from "../db";
import * as UserModel from "../Model/User";

export const getUser = (db: DB) => (userId: string) => db.get<UserModel.User>({
    table: "user",
    query: {
      id: userId
    }
  })
    .then(user => (user ? Promise.resolve(user) : Promise.reject("No User")));
