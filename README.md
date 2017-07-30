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

### GET /add?item=:text

Accepts a `GET` param `item`

Responds with `{ message: ..., item: ... }`

### GET /delete?id=:id

Accepts a `GET` param `id`

Responds with `{ message: ... }`

## Notes

This is just a **very** simple example - but a working one - while I learn FP.

I realize that it's not RESTful for the API to use `HTTP GET` for `/add` and `/delete`,
however this is just a proof of concept and I didn't build a body parser yet.
I also wanted it to be super easy to test in a new browser tab.

If I work on this more, it would naturally make sense to add a body parser
and not to use `HTTP GET` for adding and deleting.
