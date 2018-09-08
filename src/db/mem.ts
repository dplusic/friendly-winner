import * as util from 'util';
import * as debug from 'debug';

const db: { [key: string]: any } = {
  user: {

  },
  map: {

  }
};

export const connect = () => {
  return {
    put: <D>({
      table,
      data,
      ifValueNotExists
    }: {
        table: string;
        data: D;
        ifValueNotExists?: string;
      }) => {
      db[table][(<any>data).id] = data;
      debug('friendly-winner:db')(util.inspect(db, { depth: null }));
      return Promise.resolve();
    },

    get: <D>({
      table,
      query
    }: {
        table: string;
        query: object;
      }): Promise<D | null> =>
      Promise.resolve(db[table][(<any>query).id]),

    batchGet: <D>({
      table,
      queries
    }: {
        table: string;
        queries: object[];
      }): Promise<D[]> =>
      Promise.resolve(queries.map((query: any) => db[table][query.id]).filter(x => x !== undefined)),

    getAll: <D>({
      table
    }: {
        table: string;
      }): Promise<D[]> =>
      Promise.resolve(Object.values(db[table])),
  };
};
