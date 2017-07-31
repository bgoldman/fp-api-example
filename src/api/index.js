import Item from '../models/item';

const findItem = id => Item.findById({ id });

const missingId = respond =>
  respond(400, { error: true, message: 'Must enter the item ID.' });

const notFound = respond =>
  respond(400, { error: true, message: 'Item not found.' });

const api = router =>
  router
    .get('/', async ({ respond }) =>
      respond(200, { items: await Item.findAll() }),
    )
    .get('/items', async ({ request, respond }) => {
      const found = item => respond(200, { item });

      return (
        (!request.query.id && missingId(respond)) ||
        findItem(request.query.id).then(
          item => (!item && notFound(respond)) || found(item),
        )
      );
    })
    .get('/items/add', async ({ request, respond }) => {
      const missingItem = () =>
        respond(400, {
          error: true,
          message: 'Send the query param "item" with the new item text.',
        });

      const createItem = () => Item.create({ item: request.query.item });

      const created = item =>
        respond(200, {
          message: `Added item.`,
          item: { ...item },
        });

      return !request.query.item ? missingItem() : createItem().then(created);
    })
    .get('/items/delete', async ({ request, respond }) => {
      const del = item => Item.delete({ item });

      const deleted = item =>
        respond(200, {
          message: `Deleted ${item.item} (id=${item.id})`,
        });

      return (
        (!request.query.id && missingId(respond)) ||
        findItem(request.query.id).then(
          async item =>
            (!item && notFound(respond)) ||
            ((await del(item)) && deleted(item)),
        )
      );
    });

export default api;
