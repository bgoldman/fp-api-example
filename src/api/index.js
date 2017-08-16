import Item from '../models/item';

const findItem = id => Item.findById({ id });

const respondMissingId = respond =>
  respond(400, {
    error: true,
    message: 'Send the query param `id` with the item ID.',
  });

const respondNotFound = respond =>
  respond(400, { error: true, message: 'Item not found.' });

const api = router =>
  router
    .get('/', async ({ respond }) =>
      respond(200, { items: await Item.findAll() }),
    )
    .get('/items', async ({ request, respond }) => {
      const respondFound = item => respond(200, { item });

      return request.query.id
        ? findItem(request.query.id).then(
            item => (item ? respondFound(item) : respondNotFound(respond)),
          )
        : respondMissingId(respond);
    })
    .get('/items/add', async ({ request, respond }) => {
      const respondMissingItem = () =>
        respond(400, {
          error: true,
          message: 'Send the query param `item` with the new item text.',
        });

      const createItem = () => Item.create({ item: request.query.item });

      const respondCreated = item =>
        respond(200, {
          message: `Added item.`,
          item,
        });

      return request.query.item
        ? createItem().then(respondCreated)
        : respondMissingItem();
    })
    .get('/items/delete', ({ request, respond }) => {
      const del = item => Item.delete({ item });

      const respondDeleted = ({ id, item }) =>
        respond(200, {
          message: `Deleted ${item} (id=${id})`,
        });

      return request.query.id
        ? findItem(request.query.id).then(
            item =>
              item
                ? del(item).then(respondDeleted(item))
                : respondNotFound(respond),
          )
        : respondMissingId(respond);
    });

export default api;
