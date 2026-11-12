---
description: A status lamp that lights when a web site is down, with HTTP_HEAD and a timer block, and a look at what a server allows with HTTP_OPTIONS and HTTP_TRACE.
---

# Checking a service

A lamp in your base that lights up when your favourite web site is down, and a display that tells why. And for the curious: asking a server which methods it allows, and what a request looks like when it arrives.

**Functions:** [HTTP_HEAD](/c0de_net/http/http_head), [HTTP_OPTIONS](/c0de_net/http/http_options), [HTTP_TRACE](/c0de_net/http/http_trace), and [FROM_JSON](/c0de/strings/from_json) of c0de/strings

::: info What you need
The mod **c0de net** in your game, a **timer block**, a **comparator** and a **redstone lamp**, a **display wall** of 2 × 1 display blocks, and optionally **variable items** `server` and `endpoint` of type STRING to check another site than c0de.at. For the second program: a trigger block with a button, a laptop and two uninitialized variable items.
:::

## The idea

To see if a site is up, you don't need the whole page. [HTTP_HEAD](/c0de_net/http/http_head) asks like GET, but the server sends only the headers of its answer: the status, the type, the date of the last change. That's quick and costs the server almost nothing, so a timer block can ask every minute.

The program tells the world through its **exit code**: 0 if the site answered, 1 if it answered with an error status like 404 or 503, 2 if there was no answer at all. A comparator next to the timer block turns the exit code into a redstone signal, and the lamp lights whenever it isn't 0.

[HTTP_OPTIONS](/c0de_net/http/http_options) and [HTTP_TRACE](/c0de_net/http/http_trace) are tools for finding out about a server: OPTIONS asks which methods an endpoint allows, TRACE asks the server to send back the request as it arrived.

## The program

<<< @/tutorials/programs/libraries/http/checking-lamp.c0de

## Building and running it

1. Place the timer block, a comparator facing away from it, and the redstone lamp in front of the comparator.
2. Bind the display wall to `statuslamp` / `check`.
3. Set the timer block to `statuslamp` / `check` and an interval of 1200 ticks (one minute). Put in the items `server` and `endpoint` if you want to check another site.

The wall shows the site and its answer, and the lamp stays dark:

```
c0de.at/
Status 200
text/html; charset=utf-8
Thu, 12 Nov 2026 07:28:38 GMT
```

<!-- screenshot: checking-lamp | The timer block with comparator and a dark redstone lamp, the display wall showing c0de.at/ and Status 200 -->

With the endpoint `/api/nothing`, the wall shows `Status 404` and `application/json; charset=utf-8`, and the lamp lights with signal strength 1. For a server that doesn't exist, it shows `DOWN:` and the reason, and the signal is 2.

Nobody starts the process of a timer block, so the requests come from the computer of its owner. If the owner is offline, the request fails with CLIENT_UNAVAILABLE, and the lamp lights too – the program can't tell whether the site is down or nobody can ask. The same happens if the owner has switched requests off on their computer.

## How it works

- **HEAD returns the headers twice.** `headers` is a HASH, and `result` – for HEAD only – is the same headers as a JSON object, like `{"content-type":"text/html; charset=utf-8","last-modified":"…",…}`. FROM_JSON reads it into the struct `page`, whose tags pick the two headers the program shows. A header that is missing leaves its element empty.
- **The error decides the exit code.** The CALL catches every error in `problem`. Code 1000, HTTP_STATUS, means the server answered with a status of 400 or higher – it's up, but something is wrong. Every other code means there was no answer to read, and the program shows the message, like an unknown host, and ends with `EXIT 2`.
- **EXIT is the signal.** `EXIT 1` and `EXIT 2` end the process with that code. Without an EXIT, the function ends normally with code 0.
- **Short timeout.** `timeout` 5 means: a site that takes longer than five seconds counts as down.

## What a server allows

This program asks the to-do list of c0de.at (see [Talking to a REST service](/tutorials/libraries/c0de_net/http/todo-list)) what it allows, and then tries TRACE on it:

<<< @/tutorials/programs/libraries/http/checking-allowed.c0de

Bind a laptop to `methodcheck` / `ask` and start it with a trigger block. The laptop shows:

```
Allowed: GET, HEAD, POST, OPTIONS
TRACE refused: 405 Method Not Allowed
```

- **OPTIONS** answers in the header `allow`. Not every server sends it, so HAS_KEY checks first; a missing key would raise UNKNOWN_KEY.
- **TRACE is often refused.** It's not in the list, so the server answers 405, and HTTP_TRACE raises HTTP_STATUS. The program catches it and shows the message instead of crashing. `traced`, the status, is 405.
- **A server that allows TRACE** sends the request back; the program reads its method and path. Many servers don't, because the echo could reveal headers like cookies. c0de.at doesn't either: try the endpoint `/api/tutorial/echo`, which answers every method – OPTIONS lists TRACE there, but the web server in front of it refuses TRACE with 405 before the request reaches the echo. That is what TRACE is for: seeing what the machines between you and the service do with a request.

## Try it yourself

1. Check several sites with one timer block and show each on its own line. The exit code is the number of sites that don't answer.

::: details Solution
<<< @/tutorials/programs/libraries/http/checking-many.c0de

The servers are an array, and EACH asks one after the other, with the same connection and a new `server`. Here a site counts as up if it answers at all, also with an error status: `api.open-meteo.com` answers 404 for `/`, but it is there. With two sites down, the lamp gets signal strength 2.
:::

2. Add a second lamp that lights while the site is up.

::: details Solution
Put a redstone torch on the side of a block that the comparator powers, and the second lamp next to the torch. The torch inverts the signal: it is on while the comparator is off, that is while the exit code is 0. The program doesn't change.
:::

## Read more

- [c0de_net/http](/c0de_net/http/): [HTTP_HEAD](/c0de_net/http/http_head), [HTTP_OPTIONS](/c0de_net/http/http_options), [HTTP_TRACE](/c0de_net/http/http_trace), [Errors](/c0de_net/http/errors), [How requests are sent](/c0de_net/http/getting-started#how-requests-are-sent)
- [Exit codes](/c0de/guide/running-programs#exit-codes) and [EXIT](/c0de/guide/language#exit)
- [Timer block](/c0de/reference/triggers#timer-block)
- [HAS_KEY](/c0de/reference/functions#has_key)
