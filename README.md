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

Accepts a GET param `item`

Responds with `{ message: ..., item: ... }`

### GET /delete?id=:id

Accepts a GET param `id`

Responds with `{ message: ... }`
