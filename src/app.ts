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
    if ([
        '35764424-3dd7-408d-9bc3-fbe66b731533',
        '11303a3e-eff3-4b12-ad70-652726f05b30',
        'c0683a1c-7251-4988-839c-9d76bd305521',
        '5532ca76-e6bd-4259-9f79-4db471503a5e',
        '93802ba6-a6df-4c42-bf07-cea706e10963',
        '15ee3b1c-b53e-4432-a9e2-333c86efa01f',
        'c4c19c6c-f1d4-4cfd-917a-1d054ea3a5e3',
        '630e574a-e2fa-4930-b984-0ed9735c1cfb',
        'c2f56983-6088-4663-912b-c7b507b69bb5',
        'c61bd3fd-af39-43d7-bcec-78b7ddd7b16d',
    ].includes(user.userId) === false) {
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
