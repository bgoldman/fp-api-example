import promisify from 'es6-promisify';

import Redis from 'ioredis';

const cache = () => Redis();

const conn = cache();

const cacheInit = () => promisify(conn.get, conn).get('a-fake-key') || true;

export { cacheInit };

export default () => conn;
