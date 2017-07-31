import cache from './cache';
import db from './db';

/*
  Love this Reader Monad! Cool interesting way of going about it. And totally valid from what I can see.
  After you have purified the IO out the application, I will show you how to upgrade this to a ReaderT.
*/

// The store here is impure it seems since cache is an IO value (its mutable state)
const store = { cache, db };

const ask = key => store[key](); // Error handling, what if the key is not there? Use Maybe or Either.

const askify = method => args => method(ask)(args); // Perfect! You get the core idea behind Reader!

export default askify;
