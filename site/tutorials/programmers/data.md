---
description: JSON and YAML read into typed variables and structs with tags, and HTTP requests with c0de net, which the game client of a player sends.
---

# Data and the network

c0de has no dynamic type – no `dict`, no `any`, no `Object`. JSON and YAML are read into variables of a declared type, and the type decides how the document is read, much like `encoding/json` in Go. This lesson reads a configuration into a struct and fetches JSON from the web with c0de net, whose requests come from the computer of a player, not from the server.

::: info What you need
A trigger block with a button, a **variable item** `source` of type STRING with the JSON text, and four uninitialized variable items. For the request: the mod **c0de net**, a screen bound to the program (see [Screens, keyboards and I/O blocks](/tutorials/programmers/screens)) and one uninitialized variable item.
:::

## The model

- **The variable's type is the schema.** FROM_JSON and FROM_YAML of c0de/strings read a document into an existing variable. A struct reads an object, a HASH an object with any keys, an ARRAY an array; every value must fit the type at its position.
- **The current value is the default.** Elements of a struct that are missing in the document, or `null`, keep their value. Initialize the variable with the defaults, then read the document over it. Keys that the struct doesn't have are ignored. Arrays and hashes are replaced completely.
- **All or nothing.** A value of the wrong type raises TYPE_MISMATCH, a malformed document INVALID_ARGUMENT, a too long STRING STRING_TOO_LONG – and the variable is not changed at all.
- **Tags map names.** A TAG block at the end of a struct element sets its key for one language, `json` or `yaml`: `TAG(json: "close_after")`. The name `-` skips the element. A tag on a VARIABLE line is a path instead: `TAG(json: "current.temperature_2m")` reads only the value at that path.
- **Writing.** TO_JSON (one line, or indented with `indent` 1 to 16) and TO_YAML (block style) write elements in the order of their declaration and the keys of hashes in ascending order.

| c0de                    | JSON / YAML                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| BOOLEAN, INTEGER, FLOAT | `true`/`false`, numbers (an INTEGER can't read `1.5`; a FLOAT reads `1`)                            |
| CHAR, STRING            | string (a CHAR exactly one character)                                                               |
| TIME                    | ISO 8601 string in UTC, like `2026-10-19T12:05:09.250Z`; reading also takes milliseconds since 1970 |
| ARRAY, HASH, STRUCT     | array / sequence, object / mapping                                                                  |
| ERROR                   | object with `code`, `message`, `context` and `line`                                                 |

## The program

A base configuration with defaults, a nested struct, an array, a hash and a field that never leaves the program:

<<< @/tutorials/programs/programmers/data-config.c0de

The same in Python, without the type checks:

```python
import json

def load(source: str):
    c = {"title": "My base", "color": 14,
         "entrance": {"delay": 100, "friends": []}, "prices": {}, "secret": ""}
    doc = json.loads(source)
    c["title"] = doc.get("title", c["title"])
    c["color"] = doc.get("color", c["color"])
    entrance = doc.get("entrance", {})
    c["entrance"]["delay"] = entrance.get("close_after", c["entrance"]["delay"])
    c["entrance"]["friends"] = entrance.get("friends", c["entrance"]["friends"])
    c["prices"] = doc.get("prices", c["prices"])
    return c["title"], c["entrance"]["delay"], len(c["entrance"]["friends"])
```

## Running it

Set the trigger block to the program `settings` and the function `load`. Put the variable item `source` with this text and the four uninitialized items into its input inventory:

```json
{
  "title": "Steve's base",
  "entrance": { "close_after": 60, "friends": ["Alex", "Kai"] },
  "prices": { "diamond": 5, "apple": 1 },
  "secret": "x",
  "owner": "Steve"
}
```

The results are `title` = `"Steve's base"`, `delay` = 60, `friends` = 2, and `yaml`:

```yaml
title: Steve's base
color: 14
entrance:
  delay: 60
  friends:
    - Alex
    - Kai
prices:
  apple: 1
  diamond: 5
secret: ''
```

With the text `{}`, everything keeps its default: `"My base"`, 100 and 0.

## How it works

- The code block under `VARIABLE c STRUCT config` sets the defaults: `title`, `color` and the nested `entrance.delay`. FROM_JSON then overwrites what the document has. `color` isn't in the document and stays 14; `owner` isn't in the struct and is ignored.
- `destination c` is passed by reference, like the `variable` of INPUT; all other parameters are copies. It must be a single variable name without index, not a constant or loop variable. FROM_JSON has no result.
- `TAG(json: "close_after")` reads the key `close_after` into the element `delay`. The tag is for JSON only, so TO_YAML writes `delay`.
- `TAG(json: "-")` keeps `secret` out of JSON in both directions: the `"x"` of the document is not read. In YAML, the element has no tag and is written as `secret: ''`.
- The hash `prices` is written with its keys in order: `apple` before `diamond`.

## The network

The library c0de_net/http of the mod c0de net sends HTTP requests. A struct `c0de_net/http/HTTP_CONNECTION` describes the server, and there is one function per method (HTTP_GET, HTTP_POST, HTTP_PUT …), each returning the raw answer, its status and its headers. This program asks Open-Meteo, a public weather API without a key, for the temperature in Vienna:

<<< @/tutorials/programs/programmers/data-weather.c0de

`VARIABLE current FLOAT TAG(json: "current.temperature_2m")` reads only the one number out of the whole answer. Bind a screen to `weather` / `vienna` and start it with a trigger block: the screen shows the temperature, and the item `temperature` holds it.

What's different from a request in other languages:

- **The client sends it.** The Minecraft server doesn't send requests. The game client of the player who started the process does – with a button, lever or pressure plate at the trigger block – or, if nobody did (a timer block, a redstone clock), the owner of the trigger block. That player must be online and have c0de net installed. A request reaches what that player's computer reaches, including their home network.
- **CALL waits.** The CALL line waits until the answer arrives, an error occurs or the timeout of the connection passes (`timeout`, 1 to 300 seconds, 0 for 60). Other processes go on meanwhile. If the process ends, the request is cancelled; after a server restart, a restored process sends it again – keep that in mind for POST and DELETE.
- **Statuses are errors.** A status of 400 or higher raises HTTP_STATUS (code 1000), and `result`, `status` and `headers` are delivered as well. Without a client, the code is CLIENT_UNAVAILABLE (1001); the other errors are REQUESTS_DISABLED, REQUEST_FAILED, REQUEST_TIMEOUT and RESPONSE_TOO_LARGE.
- **Limits.** The server's `config/c0de_net.properties` sets `maxResponseSize` (default 1 MiB) and `maxRequestsPerPlayer` (default 8 at the same time; more wait). A player who sets `allowRequests=false` in `config/c0de_net-client.properties` sends no requests.
- **Secrets are on the sheet.** Everybody who can read the sheet can read a password or token in the program. Pass them in as a parameter, from a constant item in the trigger block.

## Differences you'll trip over

- There is no `json.loads` that returns "something". Declare the type first; a document that doesn't fit raises an error.
- FROM_JSON and FROM_YAML have no result: the destination is a variable passed by reference.
- Missing keys don't clear elements, they keep the current value. Arrays and hashes are replaced, not merged.
- Unknown keys are silently ignored – a typo in a key of the document is not an error.
- A tag belongs to one language. A struct read from JSON and YAML with the same keys needs two tags.
- An INTEGER doesn't read `1.5`, and a FLOAT can't write infinity or NaN.
- An error leaves the whole variable unchanged, also the elements that were read without problem.
- HTTP requests come from a player's computer and need that player online with c0de net. A status of 400 or higher is an error, not a normal result.

## Try it yourself

1. Catch a broken configuration: keep the defaults, return the error code and print the message.

::: details Solution
<<< @/tutorials/programs/programmers/data-safe.c0de

With `{"title": "Steve's base", "color": "yellow"}`, `code` is 302 (TYPE_MISMATCH) and `title` stays `"My base"` – the valid title isn't taken either. A missing `}` gives 309 (INVALID_ARGUMENT). Compare with the constants: `IF problem.code = TYPE_MISMATCH ;`.
:::

2. Read the configuration from YAML, with the key `close_after` there too, and return it as JSON.

::: details Solution
<<< @/tutorials/programs/programmers/data-yaml.c0de

The elements get a `yaml` tag beside the `json` tag. With this source, the result `json` is `{"title":"Steve's base","color":14,"entrance":{"close_after":60,"friends":["Alex","Kai"]},"prices":{"apple":1,"diamond":5}}`:

```yaml
title: Steve's base
entrance:
  close_after: 60
  friends: [Alex, Kai]
prices:
  diamond: 5
  apple: 1
secret: x
```

:::

## Read more

- [JSON and YAML](/c0de/guide/libraries#json-and-yaml), [FROM_JSON](/c0de/strings/from_json), [TO_JSON](/c0de/strings/to_json), [FROM_YAML](/c0de/strings/from_yaml), [TO_YAML](/c0de/strings/to_yaml)
- [TAG](/c0de/reference/data#tag): tags of struct elements and variables
- [c0de_net/http](/c0de_net/http/): [Getting started](/c0de_net/http/getting-started), [HTTP_CONNECTION](/c0de_net/http/http_connection), [HTTP_GET](/c0de_net/http/http_get), [Errors](/c0de_net/http/errors)
