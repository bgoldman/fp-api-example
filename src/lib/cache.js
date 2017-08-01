import promisify from 'es6-promisify';

import Redis from 'ioredis';

const cache = Redis(6379, '127.0.0.1');

// default to return true because the cache will return null -this throws an
// exception if redis is offline, the purpose is just to check if redis is up
const cacheInit = async () =>
  (await promisify(cache.get, cache)('a-fake-key')) || true;

export { cacheInit };

export default cache;
