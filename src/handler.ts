import * as got from 'got';
import { connect as connectDb } from "./db";
import * as UserIO from "./IO/User";
import * as MapIO from "./IO/Map";
import * as MoveAction from "./Action/Move";
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
    position: Point.origin,
    actionStates: {},
  };

  return connectDb()
    .put({
      table: "user",
      data: user
    });
};

export const getMap = (
  { userId }: { userId: string }
) => {
  const db = connectDb();

  return UserIO.getUser(db)(userId)
    .then(user => Section.intersectedSections(View.fromPoint(user.position)))
    .then(MapIO.getMap(db))
};

export const move = (
  { userId }: { userId: string },
  direction: string,
) => {
  const db = connectDb();

  return UserIO.getUser(db)(userId)
    .then(user => MoveAction.move(user, direction))
    .then(user => db.put({
      table: "user",
      data: user,
    })
      .then(() => user.position))
};

export const getUsers = () => {
  const db = connectDb();

  const fwUsersPromise = db.getAll<UserModel.User>({ table: "user" })
    .then(users => users.map(user => ({
      id: user.name,
      position: user.position,
    })))

  const airplaneUsersPromise = got('http://ec2-13-125-216-146.ap-northeast-2.compute.amazonaws.com:19856/playerList', { json: true });
  setTimeout(() => airplaneUsersPromise.cancel(), 500);

  return Promise.all([fwUsersPromise, airplaneUsersPromise])
    .then(([fwUsers, airplaneUsers]) => ({
      users: fwUsers,
      inTheAirplain: airplaneUsers.body.playerList,
    }));
};
