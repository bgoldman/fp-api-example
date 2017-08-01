import connect from '../lib/connect';

const cacheKey = id => `item-${id}`;

const cacheItem = connect(({ cache }) => item =>
  cache.set(cacheKey(item.id), JSON.stringify(item)),
);

const Item = {
  create: connect(({ db }) => async ({ item: text }) => {
    const id = await db.run('INSERT INTO items (item) VALUES ($item)', {
      $item: text,
    });

    const item = await db.get('SELECT * FROM items WHERE id = $id', {
      $id: id,
    });

    const cached = await cacheItem(item);

    return cached && item;
  }),

  delete: connect(({ cache, db }) => async ({ item }) => {
    const deleted = await db.run('DELETE FROM items WHERE id = $id', {
      $id: item.id,
    });

    const cacheDeleted = await cache.del(cacheKey(item.id));

    return deleted && cacheDeleted;
  }),

  findAll: connect(({ db }) => async () =>
    Promise.all(
      (await db.all('SELECT * FROM items ORDER BY item')).map(
        async item => (await cacheItem(item)) && item,
      ),
    ),
  ),

  findById: connect(({ cache, db }) => async ({ id }) => {
    const cached = await cache.get(cacheKey(id));

    const find = db.get('SELECT * FROM items WHERE id = $id', {
      $id: id,
    });

    return (
      (cached && JSON.parse(cached)) ||
      find.then(async item => item && (await cacheItem(item)) && item)
    );
  }),
};

export default Item;
