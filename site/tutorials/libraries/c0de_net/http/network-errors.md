---
description: When the network fails – catching the errors of c0de net, retrying a request with a growing wait with SLEEP, and a friendly message for every error code.
---

# When the network fails

Networks fail all the time: Wi-Fi drops, a server restarts, a service is busy. A program that crashes on the first hiccup is annoying. This recipe builds a request that tries again, waiting a little longer each time, and that tells the player in plain words what went wrong when it finally gives up.

**Functions:** the [errors of c0de net](/c0de_net/http/errors), [HTTP_GET](/c0de_net/http/http_get), and [SLEEP](/c0de/time/sleep) of c0de/time

::: info What you need
The mod **c0de net** in your game, a trigger block with a button, a laptop, two uninitialized variable items, and optionally **variable items** `server` and `endpoint` of type STRING. Without them, the program asks c0de.at for the latest versions of c0de.
:::

## The idea

Every function of c0de_net/http raises an error when the request doesn't work out. A CALL with an ERROR variable catches it, and its `code` says what happened:

| Code | Name               | What happened                                         | Try again?                |
| ---: | ------------------ | ----------------------------------------------------- | ------------------------- |
|  309 | INVALID_ARGUMENT   | the connection or the endpoint is wrong               | no, fix the program       |
| 1000 | HTTP_STATUS        | the server answered with a status of 400 or higher    | only for 429 and 500 – 599 |
| 1001 | CLIENT_UNAVAILABLE | the player isn't online or has no c0de net            | no                        |
| 1002 | REQUESTS_DISABLED  | the player has switched requests off on their computer | no                        |
| 1003 | REQUEST_FAILED     | no connection: unknown host, refused, network down    | yes                       |
| 1004 | REQUEST_TIMEOUT    | no complete answer within the timeout                 | yes                       |
| 1005 | RESPONSE_TOO_LARGE | the answer is larger than the server allows           | no, ask for less          |

The names are constants that hold the codes: INVALID_ARGUMENT is a constant of c0de, and the others come with `INCLUDE c0de_net/http`, like its functions, as `c0de_net/http/HTTP_STATUS` and so on. Compare with them instead of the numbers; a program reads better, and a typo is caught when it is checked.

Trying again only helps when the problem may go away by itself. And trying again right away rarely helps: if a server is overloaded, a hundred programs that ask again at once make it worse. So the wait grows with every try – 1 second, 2, 4 – which is called **exponential backoff**. [SLEEP](/c0de/time/sleep) waits a number of game ticks; 20 ticks are a second.

## The program

<<< @/tutorials/programs/libraries/http/network-errors-retry.c0de

## Building and running it

1. Bind the laptop to `netretry` / `fetch`.
2. Set the trigger block to `netretry` / `fetch`, put two uninitialized variable items into it, and press the button. The laptop shows the answer, `{"c0de":"0.5.0","c0de_net":"0.3.0"}`, and the result `tries` is 1.
3. Put a variable item `server` with `nothing.invalid` in it, a name that never exists, and press again. Now the laptop shows:

```
Try 1 failed, waiting 20 ticks
Try 2 failed, waiting 40 ticks
Try 3 failed, waiting 80 ticks
The server can't be reached
```

The exit code is 1, so a comparator can show it. With the server `c0de.at` and the endpoint `/api/nothing`, there is no retry: the laptop shows `There is nothing at this address` after the first try.

## How it works

- **`explain` turns a code into words.** It starts with a message for unknown codes and overwrites it for every code it knows. For HTTP_STATUS, the status says more: 404 is a wrong address, 429 means "too many requests", 500 and above is a problem of the server. It compares `code` with the constants: `INVALID_ARGUMENT` of c0de and `c0de_net/http/HTTP_STATUS` and the others of c0de net.
- **`worthRetrying` decides.** Only REQUEST_FAILED, REQUEST_TIMEOUT and the statuses 429 and 500 and above may go away by themselves. A 404 stays a 404, however often you ask.
- **The loop** runs while `again` is true. Each round sends the request with `problem` on the CALL line, so no error crashes the process. A successful request resets `problem.code` to 0, and `worthRetrying` says `FALSE`. After the fourth try, the ELSE ends the loop anyway.
- **The wait doubles:** `wait` starts at 20 ticks and becomes 40 and 80. SLEEP pauses only this process; the game and other programs go on.
- **Giving up** prints the message of `explain` and ends with `EXIT 1`, so the trigger block reports it without a crash.
- **Who gets the error.** The request is sent from the computer of the player who pressed the button. CLIENT_UNAVAILABLE and REQUESTS_DISABLED are about that player, not about the server – the same program may work for a friend.

Be careful with retries of requests that change something. If a POST times out, the server may have stored the entry anyway, and a retry adds it a second time. GET, HEAD, PUT and DELETE can be repeated safely: asking twice or deleting twice leaves the same result.

## Try it yourself

1. The to-do list of c0de.at answers errors with a reason in JSON, like `{"error":"no such entry"}`. Show the status line and that reason.

::: details Solution
<<< @/tutorials/programs/libraries/http/network-errors-reason.c0de

HTTP_GET delivers `result` also when it raises HTTP_STATUS, so the answer can be read after the error. Not every server answers errors in JSON, so FROM_JSON gets an ERROR variable of its own: if the answer can't be read, the program shows only the status line. For the entry 99, the text is `404 Not Found: no such entry`.
:::

2. A slow server keeps the player waiting for a long time. Make the program give up sooner.

::: details Solution
Lower `api.timeout`, for example to 3 seconds. The timeout covers the whole request until the last byte of the answer; with four tries and the waits of 1 + 2 + 4 seconds, the program then gives up after at most 19 seconds instead of 47.
:::

## Read more

- [Errors of c0de net](/c0de_net/http/errors) and [How requests are sent](/c0de_net/http/getting-started#how-requests-are-sent)
- [Errors](/tutorials/programmers/errors) in the programmer path, and [Errors](/c0de/guide/language#errors) in the guide
- [SLEEP](/c0de/time/sleep)
- [Exit codes](/c0de/guide/running-programs#exit-codes)
