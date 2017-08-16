import http from 'http';

import api from './src/api';
import { cacheInit } from './src/lib/cache';
import controlFlow from './src/lib/control-flow';
import { dbInit } from './src/lib/db';
import { log, responsify } from './src/lib/fp';
import router from './src/lib/router';

const main = async () => {
  const connectDb = controlFlow()
    .do(log('Connecting to db...'))
    //    .and(dbInit())
    .and(io => io.join(log('  ...connected.')()))
    .or(io => io.join(log('  ...failed!')()))
    .return(() => false);

  console.log('run');
  console.log('done', await (await connectDb).run());
  return;

  const connectCache = controlFlow()
    .do(log('Connecting to cache...'))
    .and(cacheInit)
    .and(log('  ...connected.'))
    .or(log('  ... failed!'))
    .return(() => false);

  const route = router(api);

  const send = (response, { code, body }) =>
    responsify(response)
      .setHeader('Content-Type', 'application/json')
      .statusCode(code)
      .end(JSON.stringify(body));

  const server = http.createServer();

  const startServer = controlFlow()
    .do(() =>
      server.on('request', async (request, response) =>
        send(response, await route(request, (code, body) => ({ code, body }))),
      ),
    )
    .and(log('Starting server...'))
    .and(() => server.listen(3200, 'localhost'))
    .and(log('  ...started.'))
    .or(log('  ...failed!'));

  const start = controlFlow()
    .do(connectDb)
    .and(connectCache)
    .and(startServer)
    .or(log('Not starting server.'));

  return start.then();
};

main(); // eslint-disable-line fp/no-unused-expression
