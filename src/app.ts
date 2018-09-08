import * as express from 'express';
import * as handler from './handler';

const promiseToResponse = (res: express.Response) => <T>(promise: Promise<T>) => promise
    .then(result => res.send(result))
    .catch(e => {
        res.status(500);
        res.send(e);
    })

const getUserFromReq = (req: express.Request) => ({ userId: req.connection.remoteAddress! });

const cb1 = <D>(cb: (user: { userId: string }, req: express.Request) => Promise<D>) => (req: express.Request, res: express.Response) => {
    const user = getUserFromReq(req);
    const handlePromise = cb(user, req);
    promiseToResponse(res)(handlePromise);
}

const cb2 = <D>(cb: () => Promise<D>) => (req: express.Request, res: express.Response) => {
    const handlePromise = cb();
    promiseToResponse(res)(handlePromise);
}

const app = express();

app.use(express.json());

app.put('/user', cb1(({ userId }, req) => {
    const { name: userName } = req.body;
    if (userName == null) {
        return Promise.reject('No name');
    }

    return handler.putUser({ userId, userName });
}));

app.get('/map', cb1(handler.getMap));

app.post('/move', cb1((user, req) => {
    const { direction } = req.body;

    return handler.move(user, direction);
}));

app.get('/users', cb2(handler.getUsers));

app.listen(3000);
