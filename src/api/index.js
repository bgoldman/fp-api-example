import Item from '../models/item';

const findItem = id => Item.findById({ id });

const missingId = respond =>
  respond(400, {
    error: true,
    message: 'Send the query param `id` with the item ID.',
  });

const notFound = respond =>
  respond(400, { error: true, message: 'Item not found.' });

const api = router =>
      router
    // well this is mutation for sure. `router` must be a registry of some kind.
    // either wrap the mutation in a Thunk or get rid of it somehow.
    .get('/', async ({ respond }) =>
      respond(200, { items: await Item.findAll() }),
    )
    .get('/items', async ({ request, respond }) => {
      // This pattern is very attractive to me.
      const found = item => respond(200, { item });

      return (
        (!request.query.id && missingId(respond)) || // badly typed usage of `||`, use Alternative instead
        findItem(request.query.id).then(
          item => (!item && notFound(respond)) || found(item),
        )
      );
    })
    .get('/items/add', async ({ request, respond }) => {
      const missingItem = () => // yay! more natural lazyness!
        respond(400, {
          error: true,
          message: 'Send the query param `item` with the new item text.',
        });

      const createItem = () => Item.create({ item: request.query.item });

      const created = item =>
        respond(200, {
          message: `Added item.`,
          item,
        });

        return !request.query.item ? missingItem() : createItem().then(created); // Perfect!
    })
    .get('/items/delete', async ({ request, respond }) => {
      const del = item => Item.delete({ item });

      const deleted = ({ id, item }) =>
        respond(200, {
          message: `Deleted ${item} (id=${id})`,
        });

        return (
         // Alternative here also. Only use || and && when both sides are bools. Not falsy truthy, booleans only.
        (!request.query.id && missingId(respond)) ||
        findItem(request.query.id).then(
          async item =>
            (!item && notFound(respond)) ||
            ((await del(item)) && deleted(item)),
        )
      );
    });

export default api;
