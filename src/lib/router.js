import qs from 'qs';
import url from 'url';

import { static as Immutable } from 'seamless-immutable';

const addRoute = (method, path, handler, routes) =>
  Immutable.merge(routes, { [method]: { [path]: handler } }, { deep: true });

const router = (routes = {}) =>
  Immutable.asObject(
    ['delete', 'get', 'patch', 'post', 'put']
      .map(method => [
        method,
        (path, handler) => router(addRoute(method, path, handler, routes)),
      ])
      .concat([['routes', () => routes]]),
  );

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

export default api => createRouter(api(router()).routes());
