import askify from '../lib/magic';

const cacheKey = id => `item-${id}`;

const Item = {
  create: askify(async ({ ask, item: text }) => {
    const id = await ask('db').run('INSERT INTO items (item) VALUES ($item)', {
      $item: text,
    });

    const item = await ask('db').get('SELECT * FROM items WHERE id = $id', {
      $id: id,
    });

    const cached = await ask('cache').set(
      cacheKey(item.id),
      JSON.stringify(item),
    );

    return cached && item;
  }),

  delete: askify(async ({ ask, item }) => {
    const deleted = await ask('db').run('DELETE FROM items WHERE id = $id', {
      $id: item.id,
    });

    const cacheDeleted = await ask('cache').del(cacheKey(item.id));

    return deleted && cacheDeleted;
  }),

  findAll: askify(({ ask }) =>
    ask('db').all('SELECT * FROM items ORDER BY item'),
  ),

  findById: askify(async ({ ask, id }) => {
    const cached = await ask('cache').get(cacheKey(id));

    const find = ask('db').get('SELECT * FROM items WHERE id = $id', {
      $id: id,
    });

    const cache = item =>
      ask('cache').set(cacheKey(item.id), JSON.stringify(item));

    return (
      (cached && JSON.parse(cached)) ||
      find.then(async item => item && (await cache(item)) && item)
    );
  }),
};

export default Item;
