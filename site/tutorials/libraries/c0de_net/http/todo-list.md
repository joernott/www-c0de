---
description: A to-do list shared by all players, kept on a server – entries added with HTTP_POST, replaced with HTTP_PUT, completed with HTTP_PATCH and deleted with HTTP_DELETE, the data made with TO_JSON.
---

# Talking to a REST service

A to-do list for your team that isn't stored in the world but on a server: one player adds "Feed the cats" with a trigger block, another completes it, and a display shows the list to everyone. The server is the tutorial API of c0de.at, which keeps the list in memory and empties it every night.

**Functions:** [HTTP_POST](/c0de_net/http/http_post), [HTTP_PUT](/c0de_net/http/http_put), [HTTP_PATCH](/c0de_net/http/http_patch), [HTTP_DELETE](/c0de_net/http/http_delete), [HTTP_GET](/c0de_net/http/http_get), and [TO_JSON](/c0de/strings/to_json) and [FROM_JSON](/c0de/strings/from_json) of c0de/strings

::: info What you need
The mod **c0de net** in your game, five trigger blocks with buttons (one for each function), a **display wall** or a laptop for the list, **variable items** `title` of type STRING and `id` of type INTEGER, and uninitialized variable items for the results.
:::

## The idea

A REST service stores things – here, entries of a list – and every entry has its own address. The HTTP method says what to do with it:

| What                    | Method | Endpoint                 | Data                    | Answer                                  |
| ----------------------- | ------ | ------------------------ | ----------------------- | --------------------------------------- |
| read the list           | GET    | `/api/tutorial/todo`     |                         | `[{"id":1,"title":"…","done":false}, …]` |
| add an entry            | POST   | `/api/tutorial/todo`     | `{"title":"…"}`         | 201 and the new entry with its `id`     |
| replace an entry        | PUT    | `/api/tutorial/todo/<id>` | `{"title":"…"}`         | the entry                               |
| change part of an entry | PATCH  | `/api/tutorial/todo/<id>` | `{"done":true}`         | the entry                               |
| delete an entry         | DELETE | `/api/tutorial/todo/<id>` |                         | 204, no data                            |

The data is JSON. Writing JSON by hand means quotes inside a text, which is easy to get wrong; [TO_JSON](/c0de/strings/to_json) makes it from a struct or a variable instead. The header `Content-Type: application/json` tells the server what it gets.

The list is the same for every player in every world, so be nice: it holds at most 100 entries with titles of up to 100 characters, takes 60 requests a minute from one computer, and is emptied at 00:00 UTC. The requests come from the computer of the player who presses the button; every player can switch them off for their own computer.

## The program

<<< @/tutorials/programs/libraries/http/todo-list-api.c0de

## Building and running it

1. Set up one trigger block per function of the program `todolist`: `add`, `rename`, `complete`, `remove` and `show`. Label them with signs.
2. Bind the display wall or the laptop to `todolist` / `show`.
3. `add`: put a variable item `title` with `Feed the cats` and an uninitialized item into the trigger block and press its button. The result item `id` holds the number of the new entry, for example 1. Add `Build a farm` the same way (2).
4. `complete`: put an item `id` with 1 in it. The result `answer` is what the server answers: `{"id":1,"title":"Feed the cats","done":true}`.
5. `rename`: items `id` 2 and `title` `Build a big farm`. The answer is `{"id":2,"title":"Build a big farm","done":false}`.
6. `remove`: an item `id`. The result `status` is 204: deleted, nothing to answer.
7. `show` prints the list and returns the number of entries:

```
[x] 1 Feed the cats
[ ] 2 Build a big farm
```

Other players see the same list – and the numbers of other entries, because everybody shares it.

## How it works

- **One connection for all.** `connect` returns a ready HTTP_CONNECTION, so the server, the base endpoint `/api/tutorial/todo` and the header are written only once. Every request adds its endpoint behind the base: nothing for the list, `"/" ⊕ id` for one entry.
- **POST creates.** `add` fills the struct `change` and lets TO_JSON write it: `{"title":"Feed the cats"}`. The server answers 201 with the new entry, and FROM_JSON reads it into `created`, a `todo` with `id`, `title` and `done`.
- **Two structs.** The server refuses keys it doesn't know, and it gives every entry its `id` itself. So the data that goes out (`change`) has only a title, and the answer that comes in (`todo`) has all three elements.
- **PUT replaces, PATCH changes.** PUT sends the whole entry and sets everything that's missing to its default: a renamed entry is not done any more. PATCH sends only what changes. `VARIABLE done BOOLEAN TRUE TAG(json: "done")` with TO_JSON gives exactly `{"done":true}`: a tag on a VARIABLE line is the path where TO_JSON puts the value.
- **DELETE answers with a status.** There is no data to read, so `remove` returns `status`, 204 ("No Content").
- **Mistakes are errors.** An `id` that doesn't exist answers 404, an empty title 400, a full list 409. Each of them raises HTTP_STATUS (code 1000), and the process crashes. [When the network fails](/tutorials/libraries/c0de_net/http/network-errors) shows how to catch them and read the reason the server gives.

## Try it yourself

1. Write a function that deletes all completed entries and returns how many it deleted.

::: details Solution
<<< @/tutorials/programs/libraries/http/todo-list-cleanup.c0de

GET reads the whole list, EACH goes through it, and every entry with `done` gets its own DELETE. Without a RESULT line, the CALL throws all results away. After the steps above, `removed` is 1.
:::

2. Complete the entry 99, which doesn't exist. What does the trigger block show?

::: details Solution
The process crashes with error 1000, HTTP_STATUS, and the message `404 Not Found`. All items come out of the trigger block unchanged. The server also says why, in its answer `{"error":"no such entry"}`; the first exercise of [When the network fails](/tutorials/libraries/c0de_net/http/network-errors) reads it.
:::

## Read more

- [c0de_net/http](/c0de_net/http/): [HTTP_POST](/c0de_net/http/http_post), [HTTP_PUT](/c0de_net/http/http_put), [HTTP_PATCH](/c0de_net/http/http_patch), [HTTP_DELETE](/c0de_net/http/http_delete), [HTTP_CONNECTION](/c0de_net/http/http_connection)
- [TO_JSON](/c0de/strings/to_json), [FROM_JSON](/c0de/strings/from_json) and [TAG](/c0de/reference/data#tag)
- [Data and the network](/tutorials/programmers/data)
- [Variable items](/c0de/guide/running-programs#variable-items) and [Results](/c0de/guide/running-programs#results)
