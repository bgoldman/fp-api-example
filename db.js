import promisify from 'es6-promisify';
import sqlite3 from 'sqlite3';

const db = () => new sqlite3.Database('db.sqlite');

const conn = db();

const promisifiedConn = {
  all: promisify(conn.all, conn),
  get: promisify(conn.get, conn),

  run: (...args) =>
    new Promise((resolve, reject) => {
      conn.run(...args, function runCallback(error) {
        return error ? reject(error) : resolve(this.lastID || true);
      });
    }),
};

const dbInit = () =>
  new Promise(resolve =>
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
