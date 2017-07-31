import promisify from 'es6-promisify';
import { sqlite3, Promise } from './fp';

const db = sqlite3.Database('db.sqlite');

const promisifiedDb = {
  all: promisify(db.all, db),
  get: promisify(db.get, db),

  run: (query, params = {}) =>
    Promise.new((resolve, reject) =>
      db.run(
        query,
        params,
        (error, lastId) => (error ? reject(error) : resolve(lastId || true)),
      ),
    ),
};

const dbInit = () =>
  Promise.new(resolve =>
    db.run(
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

export default () => promisifiedDb;
