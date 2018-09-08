import * as mem from "./mem";

export type DB = {
  put: <D>(
    {
      table,
      data,
      ifValueNotExists
    }: {
      table: string;
      data: D;
      ifValueNotExists?: string;
    }
  ) => Promise<any>;

  get: <D>(
    { table, query }: { table: string; query: object }
  ) => Promise<D | null>;

  batchGet: <D>(
    { table, queries }: { table: string; queries: object[] }
  ) => Promise<D[]>;
};

export const connect: () => DB = mem.connect;
