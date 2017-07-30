import askify from './magic';

const Item = {
  create: askify(async ({ ask, item: text }) => {
    const id = await ask('db').run('INSERT INTO items (item) VALUES ($item)', {
      $item: text,
    });

    return ask('db').get('SELECT * FROM items WHERE id = $id', {
      $id: id,
    });
  }),

  delete: askify(({ ask, item }) =>
    ask('db').run('DELETE FROM items WHERE id = $id', {
      $id: item.id,
    }),
  ),

  findAll: askify(({ ask }) =>
    ask('db').all('SELECT * FROM items ORDER BY item'),
  ),

  findById: askify(({ ask, id }) =>
    ask('db').get('SELECT * FROM items WHERE id = $id', { $id: id }),
  ),
};

export default Item;
