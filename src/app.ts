import * as express from 'express';
import * as handler from './handler';

const promiseToResponse = (res: express.Response) => <T>(promise: Promise<T>) => promise
    .then(result => res.send(result))
    .catch(e => {
        res.status(500);
        res.send(e);
    })

const getUserFromReq = (req: express.Request) => ({ userId: req.query.userId });

const cb1 = <D>(cb: (user: { userId: string }, req: express.Request) => Promise<D>) => (req: express.Request, res: express.Response) => {
    const user = getUserFromReq(req);
    const handlePromise = cb(user, req);
    promiseToResponse(res)(handlePromise);
}

const app = express();

app.use(express.json());

app.put('/user', cb1(handler.putUser));

app.get('/map', cb1(handler.getMap));

app.listen(3000);
