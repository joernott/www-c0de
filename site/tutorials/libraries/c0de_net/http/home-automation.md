---
description: A lever in Minecraft switches a real lamp at home – HTTP_PUT to the home automation, the token kept in a constant item, and the request tried out on the echo of c0de.at first.
---

# Home automation

Flip a lever in your base, and the lamp in your real kitchen goes on; flip it back, and it goes off. The program sends the new state of the lamp to your home automation with HTTP_PUT. Its token – the password of the home automation – doesn't stand on the sheet, but comes from a constant item in the trigger block.

**Functions:** [HTTP_PUT](/c0de_net/http/http_put), [HTTP_CONNECTION](/c0de_net/http/http_connection), [TO_JSON](/c0de/strings/to_json) of c0de/strings, [SLEEP](/c0de/time/sleep) of c0de/time and [GET_LEVER](/c0de/minecraft/get_lever) of c0de/minecraft

::: info What you need
The mod **c0de net** in your game, a home automation with an HTTP API in your home network and a token for it, a trigger block with a **lever** on top, and a **constant item** `token` of type STRING with the token. To try the request first: a second trigger block with a button and a laptop.
:::

## The idea

Most home automations – a hub, a bridge, a smart plug – can be switched over HTTP. Each has its own API, but they look alike: an address in your home network, an endpoint for the lamp, the new state as JSON, and a token in the `Authorization` header. This recipe uses a made-up hub at `homehub.local`, port 8080, that takes `PUT /api/lamps/kitchen` with `{"on":true}`. Look up the address, the endpoint, the data and the kind of token of your own system in its documentation and change the program accordingly.

Two things make this possible, and safe:

- **The request comes from your computer.** c0de net sends it from the computer of the player who flips the lever, not from the Minecraft server. So it reaches your home network when you play at home – even on a server far away. A friend who flips the lever sends it from their computer, where `homehub.local` doesn't exist. Every player can switch requests off for their own computer.
- **The token is not on the sheet.** Everybody who can see the sheet can read its literals. The token goes into a **constant item** instead, which can't be changed once it has a value, in a trigger block that only you can change.

## The program

<<< @/tutorials/programs/libraries/http/home-automation-lamp.c0de

## Try the request first

You can't see what your hub receives, and a mistake in the data just does nothing. So send the same request to the echo of c0de.at first, which answers with the request as it arrived:

<<< @/tutorials/programs/libraries/http/home-automation-preview.c0de

Bind the laptop to `lamppreview` / `preview` and start it with a trigger block. It shows:

```
PUT /api/tutorial/echo/lamps/kitchen
Authorization: Bearer test
Content-Type: application/json
{"on":true}
```

Use the token `test` here, not your real one: the echo shows everything it gets. With a variable item `on` set to `FALSE`, the last line is `{"on":false}`.

## Building and running it

1. Change the address, the port, the endpoint and the data of `send` to those of your home automation.
2. Set the trigger block to `homelamp` / `switch` and put the lever on top of it.
3. Make a constant item: name `token`, type STRING, your token as value. Put it into the input inventory of the trigger block. Set its **Run** button to *Only me*.
4. Flip the lever on: the lamp at home goes on. Flip it off: after half a second, the lamp goes off.

<!-- screenshot: home-automation-lever | The trigger block with the lever on top, switched on, and the PID block of the running process on the sheet -->

## How it works

- **The lever starts it.** Switching the lever on gives the trigger block a redstone pulse, and the block knows who flipped it. Switching it off starts nothing, so the process stays alive while the lamp is on: it asks the lever every 10 ticks with GET_LEVER and sends "off" when the lever is off. Meanwhile its sheet is locked.
- **Where the lever is.** `PID.x`, `PID.y` and `PID.z` are the position of the trigger block, so the lever on top of it is at `PID.y + 1`.
- **The data.** `VARIABLE state BOOLEAN TAG(json: "on")` puts the value at the key `on`, so TO_JSON writes `{"on":true}` or `{"on":false}`.
- **The connection.** `use_ssl` stays FALSE, because most hubs in a home network speak plain http; `port` 8080 and `base_endpoint` `/api` complete the address to `http://homehub.local:8080/api/lamps/kitchen`. The token goes into the header `Authorization` as `Bearer <token>`, which replaces `user` and `password`.
- **The token is a parameter.** `switch` gets it from the constant item and passes it on to `send`. Nothing secret is on the sheet.
- **When it fails.** If the hub isn't reachable, HTTP_PUT raises REQUEST_FAILED, and the process crashes; the trigger block shows the error. The "off" request is sent by the player who switched the lamp on, so they must still be online.

## Try it yourself

1. Switch several lamps with the same program.

::: details Solution
Give `switch` and `send` a parameter `lamp` STRING with the default `"kitchen"`, and use the endpoint `"/lamps/" ⊕ lamp`. Each lamp gets its own trigger block with a lever and a variable item `lamp`, like `garden`; the constant item `token` is the same for all.
:::

2. A friend flips your lever while you're online. What happens?

::: details Solution
With *Only me* on the **Run** button, nothing: the trigger block doesn't start. With *Players*, the process starts and sends the request from your friend's computer. Unless they are in your home network, `homehub.local` is unknown there, and the process crashes with REQUEST_FAILED (1003). Your lamp, and your token, stay safe.
:::

## Read more

- [HTTP_PUT](/c0de_net/http/http_put), [HTTP_CONNECTION](/c0de_net/http/http_connection) and the example [Switching a lamp](/c0de_net/http/examples#switching-a-lamp)
- [How requests are sent](/c0de_net/http/getting-started#how-requests-are-sent)
- [Constant items](/c0de/guide/tools#constant-items) and [Trigger block](/c0de/reference/triggers#trigger-block)
- [GET_LEVER](/c0de/minecraft/get_lever) and [SLEEP](/c0de/time/sleep)
