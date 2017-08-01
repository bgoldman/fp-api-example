import http from 'http';

import api from './src/api';
import { cacheInit } from './src/lib/cache';
import controlFlow from './src/lib/control-flow';
import { dbInit } from './src/lib/db';
import { log, responsify } from './src/lib/fp';
import router from './src/lib/router';

const main = async () => {
  const server = http.createServer();

  const dbConnected = await controlFlow()
    .do(() => log('Connecting to db...'))
    .and(dbInit)
    .and(() => log('  ...connected.'))
    .or(() => log('  ...failed!'))
    .return(() => false);

  const cacheConnected = await controlFlow()
    .do(() => log('Connecting to cache...'))
    .and(cacheInit)
    .and(() => log('  ...connected.'))
    .or(() => log('  ... failed!'))
    .return(() => false);

  const route = router(api);

  const started = await controlFlow()
    .do(() => dbConnected && cacheConnected)
    .and(() =>
      controlFlow()
        .do(() =>
          server.on('request', (request, response) =>
            route(request, responsify(response)),
          ),
        )
        .and(() => log('Starting server...'))
        .and(() => server.listen(3200, 'localhost'))
        .and(() => log('  ...started.'))
        .or(() => log('  ...failed!')),
    )
    .or(() => log('Not starting server'));

  return started;
};

main(); // eslint-disable-line fp/no-unused-expression
