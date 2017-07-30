import http from 'http';

import api from './src/api';
import cache from './src/lib/cache';
import { dbInit } from './src/lib/db';
import { log, responsify } from './src/lib/fp';
import router from './src/lib/router';

const main = async () => {
  const server = http.createServer();

  const connected =
    log('Connecting to db...') &&
    (await dbInit()) &&
    log('...connected.') &&
    log('Connecting to cache...') &&
    (await cache()) &&
    log('...connected.');

  const route = router(api);

  const started =
    server.on('request', (request, response) =>
      route(request, responsify(response)),
    ) &&
    log('Starting server...') &&
    (await server.listen(3200, 'localhost')) &&
    log('...started.');

  return connected && started;
};

main(); // eslint-disable-line fp/no-unused-expression
