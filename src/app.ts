import * as express from 'express';
import * as handler from './handler';

const promiseToResponse = (res: express.Response) => <T>(promise: Promise<T>) => promise
    .then(result => res.send(result))
    .catch(e => {
        res.status(500);
        res.send(e);
    })

const getUserFromReq = (req: express.Request) => ({ userId: req.query.userId });

const cbWithUser = <D>(cb: (user: { userId: string }, req: express.Request) => Promise<D>) => (req: express.Request, res: express.Response) => {
    const user = getUserFromReq(req);
    if (user.userId == null) {
        res.status(401);
        res.send('Invalid user id');
        return;
    }

    const handlePromise = cb(user, req);
    promiseToResponse(res)(handlePromise);
}

const cbAsAdmin = <D>(cb: () => Promise<D>) => (req: express.Request, res: express.Response) => {
    const handlePromise = cb();
    promiseToResponse(res)(handlePromise);
}

const app = express();

app.use(express.json());

app.put('/user', cbWithUser(({ userId }, req) => {
    const { name: userName } = req.body;
    if (userName == null) {
        return Promise.reject('No name');
    }

    return handler.putUser({ userId, userName });
}));

app.get('/map', cbWithUser(handler.getMap));

app.post('/move', cbWithUser((user, req) => {
    const { direction } = req.body;

    return handler.move(user, direction);
}));

app.get('/users', cbAsAdmin(handler.getUsers));

app.listen(3000);
