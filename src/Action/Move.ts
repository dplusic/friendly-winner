import * as Point from '../Coordinates/Point';
import * as UserModel from '../Model/User';

const STATE_KEY = 'move'

const COOLTIME = 500;

const DIRECTION_POINTS: { [key: string]: Point.Point } = {
    up: Point.fromNumber(0, 1),
    down: Point.fromNumber(0, -1),
    right: Point.fromNumber(1, 0),
    left: Point.fromNumber(-1, 0),
};

type MoveState = {
    lastMoved: number
};

const getMoveState = (user: UserModel.User) => {
    const moveState = <MoveState>user.actionStates[STATE_KEY];
    if (moveState) {
        return moveState;
    } else {
        return {
            lastMoved: 0
        };
    }
}

export const moveWithNowFunc = (nowFunc: () => number) => (user: UserModel.User, direction: string): UserModel.User => {
    const now = nowFunc();

    const moveState = getMoveState(user);

    if (now - moveState.lastMoved < COOLTIME) {
        throw 'Under cool down';
    }
    if (direction in DIRECTION_POINTS === false) {
        throw 'Invalid direction';
    }

    const newPosition = Point.add(user.position, DIRECTION_POINTS[direction]);

    const newState = {
        ...moveState,
        lastMoved: now
    };

    return {
        ...user,
        position: newPosition,
        actionStates: {
            ...user.actionStates,
            [STATE_KEY]: newState,
        }
    };
};

export const move = moveWithNowFunc(Date.now);
