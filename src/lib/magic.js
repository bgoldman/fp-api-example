import { static as Immutable } from 'seamless-immutable';

import cache from './cache';
import db from './db';

const store = { cache, db };

const ask = key => store[key]();

const magic = method => args => method(Immutable.set(args || {}, 'ask', ask));

export default magic;
