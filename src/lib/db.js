import promisify from 'es6-promisify';

import { sqlite3 } from './fp';

import IO from './io';

const db = sqlite3.Database('db.sqlite');

const promisifiedDb = {
  all: promisify(db.all, db),
  get: promisify(db.get, db),
  run: promisify(db.run, db),
};

// return true at the end even if CREATE TABLE fails because the table probably
// already exists - the first statement checks if the database is up and will
// throw an exception if it isn't
const dbInit = IO(
  async () =>
    (await promisifiedDb.get('SELECT 1 + 1'))['1 + 1'] === 2 &&
    db.get(
      'CREATE TABLE items (' +
        '  id INTEGER PRIMARY KEY ASC' +
        '  ,item STRING' +
        ')',
      () => true,
    ),
);

export { dbInit };

export default promisifiedDb;
