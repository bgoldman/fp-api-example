import promisify from 'es6-promisify';
import { sqlite3, Promise } from './fp';

const db = () => sqlite3.Database('db.sqlite');

const conn = db();

const promisifiedConn = {
  all: promisify(conn.all, conn),
  get: promisify(conn.get, conn),

  run: (query, params = {}) =>
    Promise.new((resolve, reject) =>
      conn.run(
        query,
        params,
        (error, lastId) => (error ? reject(error) : resolve(lastId || true)),
      ),
    ),
};

const dbInit = () =>
  Promise.new(resolve =>
    conn.run(
      'CREATE TABLE items (' +
        '  id INTEGER PRIMARY KEY ASC' +
        '  ,item STRING' +
        ')',
      () =>
        // an error just means this means the table already exists, no big deal
        resolve(true),
    ),
  );

export { dbInit };

export default () => promisifiedConn;
