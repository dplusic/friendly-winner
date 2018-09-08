import { connect as connectDb } from "./db";
import * as MapIO from "./IO/Map";
import * as UserModel from "./Model/User";
import * as Section from "./Coordinates/Section";
import * as View from "./Coordinates/View";
import * as Point from "./Coordinates/Point";

export const putUser = (
  { userId, userName }: { userId: string, userName: string }
) => {
  const user: UserModel.User = {
    id: userId,
    name: userName,
    position: Point.origin
  };

  return connectDb()
    .put({
      table: "user",
      data: user
    })
    .then(() => user)
};

export const getMap = (
  { userId }: { userId: string }
) => {
  const db = connectDb();

  return db.get<UserModel.User>({
    table: "user",
    query: {
      id: userId
    }
  })
    .then(user => (user ? Promise.resolve(user) : Promise.reject("No User")))
    .then(user => Section.intersectedSections(View.fromPoint(user.position)))
    .then(MapIO.getMap(db))
};
