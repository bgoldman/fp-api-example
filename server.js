/*
  This file is almost all effects, so it will need lots of safety wrappers to be pure.
 */

import http from 'http';

import api from './src/api';
import { cacheInit } from './src/lib/cache';
import { dbInit } from './src/lib/db';
import { log, responsify } from './src/lib/fp';
import router from './src/lib/router';

const main = async () => {
  const server = http.createServer(); // This is impure, and needs to be a Thunk.

  const dbConnected =
    (log('Connecting to db...') && // log('Conn...') is not a boolean. Use Alternative here.
      (await dbInit()) &&
      log('  ...connected.')) ||
    (log('  ...failed!') && false); // log should also be a Thunk, as its effectful.

  const cacheConnected =
    (log('Connecting to cache...') &&
      (await cacheInit()) &&
      log('  ...connected.')) ||
    (log('  ... failed!') && false);

  const route = router(api);

    const started =
          // The logic here looks perfect to me,
          // but the code is not pure, since you are using truthy flasey,
          // and having effects on the world outside of a Thunk.
    dbConnected && cacheConnected
      ? (server.on('request', (request, response) =>
          route(request, responsify(response)),
        ) &&
          log('Starting server...') &&
          (await server.listen(3200, 'localhost')) &&
          log('  ...started.')) ||
        log('  ...failed!')
      : log('Not starting server!');

  return started;
};

// Very nice. Ideally this will be the only usage of this
// lint escape.

// `main` should be a Thunk representing all effects
// for the entire application, and this should be the one impure line
// that runs the Thunk tree (all Thunks aggregate here to this one value).
main(); // eslint-disable-line fp/no-unused-expression
