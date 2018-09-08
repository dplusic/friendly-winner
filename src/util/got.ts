import * as got from 'got';

export const timeout = (time: number) => <B extends Buffer | string | object>(p: got.GotPromise<B>): got.GotPromise<B> => {
    setTimeout(() => p.cancel(), time);
    return p;
}
