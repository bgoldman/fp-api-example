import promisify from 'es6-promisify';

import Redis from 'ioredis';

const cache = Redis(6379, '127.0.0.1');

const cacheInit = async () =>
  (await promisify(cache.get, cache)('a-fake-key')) || true;

export { cacheInit };

export default () => cache;
