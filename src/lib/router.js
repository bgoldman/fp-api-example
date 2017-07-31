import qs from 'qs';
import url from 'url';

import { static as Immutable } from 'seamless-immutable';

const define = (method, path, handler, routes) =>
  Immutable.merge(
    routes,
    {
      [method]: { [url.parse(path).pathname]: handler },
    },
    { deep: true },
  );

const createRouteMethods = {
  get: (path, handler, routes) => define('get', path, handler, routes),
  delete: (path, handler, routes) => define('delete', path, handler, routes),
  patch: (path, handler, routes) => define('patch', path, handler, routes),
  post: (path, handler, routes) => define('post', path, handler, routes),
  put: (path, handler, routes) => define('put', path, handler, routes),
};

const respond = response => (code, body) =>
  response
    .setHeader('Content-Type', 'application/json')
    .statusCode(code)
    .end(JSON.stringify(body));

const createRouter = routes => (request, response) => {
  const method = request.method.toLowerCase();

  const { pathname: path, search } = url.parse(request.url);

  const handler = routes[method][path];

  const query = qs.parse(search, { ignoreQueryPrefix: true });

  return handler
    ? handler({ request: { ...request, query }, respond: respond(response) })
    : respond(response)(404, {
        error: true,
        message: 'Route not found.',
      });
};

const chain = routes =>
  Object.entries(createRouteMethods)
    .map(([method, createRoute]) => [
      method,
      (path, handler) => chain(createRoute(path, handler, routes)),
    ])
    .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), { routes: () => routes });

const router = chain({});

export default api => createRouter(api(router).routes());
