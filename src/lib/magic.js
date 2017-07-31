import cache from './cache';
import db from './db';

const store = { cache, db };

const ask = key => store[key]();

const askify = method => args => method(ask)(args);

export default askify;
