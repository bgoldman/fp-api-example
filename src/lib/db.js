import promisify from 'es6-promisify';
import { sqlite3 } from './fp';

// This appears to be effectful, db may vary between application runs,
// so it needs to be a Thunk, and cannot be a the top level like this.
// To be pure, we are going to need to collect up all this IO into a single
// Thunk we execute in `main`.
const db = sqlite3.Database('db.sqlite');

const promisifiedDb = {
  all: promisify(db.all, db),
  get: promisify(db.get, db),
  run: promisify(db.run, db),
};

// return true at the end even if CREATE TABLE fails because the table probably
// already exists - the first statement checks if the database is up and will
// throw an exception if it isn't.

// Exceptions are not pure. If you are going to raise an excpetion,
// you should have a single line of JavaScript with an explicit `throw`.
// No where else may throw an exception. This needs the Either type (see notes in item.js)
// so you can manage the existence of an error state with nice pure data.
const dbInit = async () =>
  (await promisifiedDb.get('SELECT 1 + 1'))['1 + 1'] === 2 &&
  db.get(
    'CREATE TABLE items (' +
      '  id INTEGER PRIMARY KEY ASC' +
      '  ,item STRING' +
      ')',
    () => true,
  );

export { dbInit };

export default () => promisifiedDb;
