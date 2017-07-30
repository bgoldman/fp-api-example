import http from 'http';

import api from './api';
import cache from './cache';
import db, { dbInit } from './db';
import router from './router';

/* eslint-disable no-console */

const main = async () => {
  const server = http.createServer();

  console.log('Connecting to db...');
  await dbInit();
  console.log('...connected.');

  console.log('Connecting to cache...');
  await cache();
  console.log('...connected.');

  const route = router(api);

  server.on('request', (request, response) => route(request, response));

  console.log('Starting server...');
  await server.listen(3200, 'localhost');
  console.log('...started.');
};

main();
