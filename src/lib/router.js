import qs from 'qs';
import url from 'url';

import { static as Immutable } from 'seamless-immutable'; // Feldman! you stike again.

const define = (method, path, handler, routes) =>
  Immutable.merge(
    routes,
    {
      [method]: { [url.parse(path).pathname]: handler },
    },
    { deep: true },
  );

// OOP baggage, unecissary object. Just make these top level. You can also use currying
// to reduce code here.
/*
const define = (method) => (path, handler, routes) => ...
const get = define('get')

 */
const createRouteMethods = {
  get: (path, handler, routes) => define('get', path, handler, routes),
  delete: (path, handler, routes) => define('delete', path, handler, routes),
  patch: (path, handler, routes) => define('patch', path, handler, routes),
  post: (path, handler, routes) => define('post', path, handler, routes),
  put: (path, handler, routes) => define('put', path, handler, routes),
};

const respond = response => (code, body) =>
  // once this is in Thunks, use `bind/flatmap/chain` to link them together
  response
    .setHeader('Content-Type', 'application/json') // Thunkify
    .statusCode(code) // Thunkify
    .end(JSON.stringify(body)); // Thunkify

// This function is chalk full of things that can go wrong.
// You need error handling via Either to report to consumers
// what went wrong when it does go wrong.
const createRouter = routes => (request, response) => {
  const method = request.method.toLowerCase();

         // parsed object could be lacking
         // one or both of these
  const { pathname: path, search } = url.parse(request.url); // parse failure?

  // both `[method]` and `[path]` need unique error handling for where it is missing
  const handler = routes[method][path];

  // error handling
  const query = qs.parse(search, { ignoreQueryPrefix: true });

    // since there could be errors before getting here,
    // the function will need to return an `Either` as it could be an error,
    // or a Thunk, that could also contain an error.
    // Either ParseError (Thunk (Either HttpError Response))
  return handler
    ? handler({ request: { ...request, query }, respond: respond(response) })
    : respond(response)(404, {
        error: true,
        message: 'Route not found.'
      });
};

// many loves for this function. Good job!
const chain = routes =>
  Object.entries(createRouteMethods)
    .map(([method, createRoute]) => [
      method,
       (path, handler) => chain(createRoute(path, handler, routes)),
    ])
    .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), { routes: () => routes });

const router = chain({});

export default api => createRouter(api(router).routes());
