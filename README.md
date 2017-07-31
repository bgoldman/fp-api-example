# FP API Example

## Description

This is an example of an API server written in a functional programming style.

It uses the cleanjs eslint plugin, which is pretty strict!

## Commands

Start the server at `http://localhost:3200`

`yarn start`

When developing, you can use this to lint the code

`yarn run lint`

## Endpoints

### GET /

Responds with `{ items: [...] }`

### GET /items?id=:id

Requires the query param `id`

Responds with `{ message: :message, item: :item }`

### GET /items/add?item=:text

Requires the query param `item`

Responds with `{ message: :message, item: :newItem }`

### GET /items/delete?id=:id

Requires the query param `id`

Responds with `{ message: :message }`

## Notes

This is just a **very** simple example - but a working one - while I learn FP.

I realize that it's not RESTful for the API to use `HTTP GET` for `/items/add` and `/items/delete`,
however this is just a proof of concept and I didn't build a body parser yet.
I also wanted it to be super easy to test in a new browser tab.

The same reasoning applies to using query params instead of URL params for `GET /items` and `GET /items/delete` - I didn't build a URL param parser yet.

If I work on this more, it would naturally make sense to add a body parser, a URL param parser,
and not to use `HTTP GET` for adding and deleting.
It would also make sense to add examples for `HTTP PATCH` and `HTTP PUT`.
