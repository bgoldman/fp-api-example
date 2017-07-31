import askify from '../lib/magic';

/*
  This file is loaded with db calls that can fail, which is not handled
  in any way. Meaning the entire file is not runtime safe, IE these
  functions are not `total`. To be a total function, you must be able
  to handle any input of a given type. An error condition from IO land
  can occur and fuck the execution. Thats not total. Under some conditions,
  the function cannot handle an input value, thats impure. So in addition
  to lazy handling of IO, this code is going to need pure error handling
  via an Either type. Sancturary has it, if you just want to pull it in.
  https://sanctuary.js.org/#either-type
 */

const cacheKey = id => `item-${id}`;

/*
 There isn't a need for the top level object. Its just OOP baggage,
 I would get rid of it, and puts the methods at the top level, as
 just functions.
 */
const Item = {
    create: askify(ask => async ({ item: text }) => {
    /*
      This is very cool usage of await.
      `id` is a variant in the application, so it needs protection.
      It being a Promise is not quite strong enough for purity, since
      the very existence of a Promise is effectful. These need to be
      upgraded to Thunks (lazy Promise).
    */
    const id = await ask('db').run('INSERT INTO items (item) VALUES ($item)', {
      $item: text,
    });

    /*
      Same for `item` as `id`, this will need to be wrapped in a Thunk to be pure.
     */
    const item = await ask('db').get('SELECT * FROM items WHERE id = $id', {
      $id: id,
    });

    /*
      Same here `cache` nneds to be a Thunk
     */
    const cached = await ask('cache').set(
      cacheKey(item.id),
      JSON.stringify(item),
    );

    /*
      Instead of returing the straight value, you want to return a new Thunk
      built out of the other two. This is necissary because this value is
      going to vary between application runs (its non-determinisitc). To combine
      the Thunks you will want to use the Applicative property. Look for `lift2`,
     */
    return cached && item;
  }),

    delete: askify(ask => async ({ item }) => {
    /* Same as `create`, its not determintistic so it needs to be a Thunk. */
    const deleted = await ask('db').run('DELETE FROM items WHERE id = $id', {
      $id: item.id,
    });

    const cacheDeleted = await ask('cache').del(cacheKey(item.id));

    return deleted && cacheDeleted; // Use Applicative
  }),

    findAll: askify(ask => () => // nice! natural lazyness.
    ask('db').all('SELECT * FROM items ORDER BY item'),
  ),

  findById: askify(ask => async ({ id }) => {
    const cached = await ask('cache').get(cacheKey(id));

    const find = ask('db').get('SELECT * FROM items WHERE id = $id', {
      $id: id,
    });

    const cache = item =>
      ask('cache').set(cacheKey(item.id), JSON.stringify(item));

      return (
          // something is not right type wise about this
          // and should be resolved. `cached` is a promise, and `parse`
          // is pure.
      (cached && JSON.parse(cached)) ||
      find.then(async item => item && (await cache(item)) && item)
    );
  }),
};

export default Item;
