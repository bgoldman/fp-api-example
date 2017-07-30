import sqlite3 from 'sqlite3';

const fpSqlite3 = {
  Database: connectionString => {
    // eslint-disable-next-line better/no-new
    const conn = new sqlite3.Database(connectionString);

    conn.oldRun = conn.run; // eslint-disable-line fp/no-mutation

    // eslint-disable-next-line fp/no-mutation
    conn.run = (query, maybeParams, maybeCallback) => {
      const params = typeof maybeParams === 'object' ? maybeParams : {};

      const callback =
        typeof maybeCallback === 'function' ? maybeCallback : maybeParams;

      return conn.oldRun(query, params, function runCallback(error) {
        // eslint-disable-next-line fp/no-this
        return callback(error, this && this.lastID);
      });
    };

    return conn;
  },
};

const fpPromise = {
  // eslint-disable-next-line better/no-new
  new: callback => new Promise(callback),
};

const log = message => {
  // eslint-disable-next-line fp/no-unused-expression, no-console
  console.log(message);

  return true;
};

const responsify = response => ({
  end: body => response.end(body),

  setHeader: (key, value) => {
    // eslint-disable-next-line fp/no-unused-expression
    response.setHeader(key, value);

    return responsify(response);
  },

  statusCode: code => {
    // eslint-disable-next-line fp/no-mutation
    response.statusCode = code;

    return responsify(response);
  },
});

export { log, responsify, fpSqlite3 as sqlite3, fpPromise as Promise };
