import Item from '../models/item';

const api = router =>
  router
    .get('/', async ({ respond }) =>
      respond(200, { items: await Item.findAll() }),
    )
    .get('/add', async ({ request, respond }) => {
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
    .get('/delete', async ({ request, respond }) => {
      const missingId = () =>
        respond(400, { error: true, message: 'Must enter the item ID.' });

      const findItem = () => Item.findById({ id: request.query.id });

      const notFound = () =>
        respond(400, { error: true, message: 'Item not found.' });

      const del = item => Item.delete({ item });

      const deleted = item =>
        respond(200, {
          message: `Deleted ${item.item} (id=${item.id})`,
        });

      return (
        (!request.query.id && missingId()) ||
        findItem().then(
          async item =>
            (!item && notFound()) || ((await del(item)) && deleted(item)),
        )
      );
    });

export default api;
