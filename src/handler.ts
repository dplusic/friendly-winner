import * as got from 'got';
import { connect as connectDb } from "./db";
import * as UserIO from "./IO/User";
import * as MapIO from "./IO/Map";
import * as MoveAction from "./Action/Move";
import * as UserModel from "./Model/User";
import * as Section from "./Coordinates/Section";
import * as View from "./Coordinates/View";
import * as Point from "./Coordinates/Point";
import { timeout as gotTimeout } from "./util/got";

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
    .then(async user => {
      const bluemobalPosition = await diceBluemobal(user);
      const fireResult = await fireAirplaneBullet();
      await db.put({
        table: "user",
        data: user,
      });
      return {
        position: user.position,
        bluemobal: bluemobalPosition,
        airplane: fireResult,
      };
    })
};

type BluemobalSessionInfo = {
  gameId: string,
  clientId: string,
};

const diceBluemobal = async (user: UserModel.User) => {
  try {
    let sessionInfo: BluemobalSessionInfo | undefined = <BluemobalSessionInfo>user.actionStates['bluemobal'];
    if (sessionInfo) {
      const { body: sessionAlive } = await gotTimeout(100)(got.post('http://ec2-13-125-9-100.ap-northeast-2.compute.amazonaws.com:3001/api/checkSession', { json: true, body: sessionInfo }));
      if (sessionAlive !== true) {
        sessionInfo = undefined;
      }
    }

    if (sessionInfo == null) {
      const { body } = await gotTimeout(100)(got.post('http://ec2-13-125-9-100.ap-northeast-2.compute.amazonaws.com:3001/api/issueSession', { json: true }));
      sessionInfo = body;
    }

    const { body: gameInfo } = await gotTimeout(100)(got.post('http://ec2-13-125-9-100.ap-northeast-2.compute.amazonaws.com:3001/api/dice', { json: true, body: sessionInfo }));

    const playerInfo = gameInfo.players[sessionInfo!.clientId];

    user.actionStates['bluemobal'] = sessionInfo;

    return {
      hp: playerInfo.hp,
      money: playerInfo.money,
      position: playerInfo.position,
    };

  } catch (e) {
    return null;
  }
};

const fireAirplaneBullet = () => gotTimeout(300)(got.post('http://ec2-13-125-216-146.ap-northeast-2.compute.amazonaws.com:19856/fireBullet', { body: '{ "x": 0, "y": 0 }' }))
  .then(({ body }) => body)
  .catch(() => null);

export const getUsers = () => {
  const db = connectDb();

  const fwUsersPromise = db.getAll<UserModel.User>({ table: "user" })
    .then(users => users.map(user => ({
      id: user.name,
      position: user.position,
    })))

  const airplaneUsersPromise = getAirplaneUsers();

  return Promise.all([fwUsersPromise, airplaneUsersPromise])
    .then(([fwUsers, airplaneUsers]) => ({
      users: fwUsers,
      inTheAirplain: airplaneUsers,
    }));
};

const getAirplaneUsers = () => {
  const airplaneUsersPromise = got('http://ec2-13-125-216-146.ap-northeast-2.compute.amazonaws.com:19856/playerList', { json: true });
  setTimeout(() => airplaneUsersPromise.cancel(), 300);
  return airplaneUsersPromise
    .then(({ body: { playerList } }) => playerList)
    .catch(() => null);
};

