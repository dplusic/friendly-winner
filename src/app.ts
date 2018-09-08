import * as express from 'express';
import * as handler from './handler';

const handleError = (res: express.Response) => (e: Error) => {
    res.status(500);
    res.send(e);
};

const app = express();

app.use(express.json());

app.put('/user', (req, res) =>
    handler.putUser({ userId: req.query.userId })
        .then(user => {
            res.send(user)
        })
        .catch(handleError(res))
);

app.get('/map', (req, res) =>
    handler.getMap({ userId: req.query.userId })
        .then(maps => {
            res.send(maps)
        })
        .catch(handleError(res))
)

app.listen(3000);
