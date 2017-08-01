import cache from './cache';
import db from './db';

const store = { cache, db };

const connect = method => args => method({ ...store })(args);

export default connect;
