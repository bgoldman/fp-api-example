import http from 'http';

import api from './src/api';
import { cacheInit } from './src/lib/cache';
import { dbInit } from './src/lib/db';
import { log, responsify } from './src/lib/fp';
import router from './src/lib/router';

const main = async () => {
  const server = http.createServer();

  const dbConnected =
    (log('Connecting to db...') &&
      (await dbInit()) &&
      log('  ...connected.')) ||
    (log('  ...failed!') && false);

  const cacheConnected =
    (log('Connecting to cache...') &&
      (await cacheInit()) &&
      log('  ...connected.')) ||
    (log('  ... failed!') && false);

  const route = router(api);

  const started =
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

main(); // eslint-disable-line fp/no-unused-expression
