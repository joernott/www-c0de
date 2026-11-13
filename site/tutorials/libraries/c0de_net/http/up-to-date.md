---
description: Is my c0de up to date? A display that compares the installed versions of c0de and c0de net, C0DE_VERSION and C0DE_NET_VERSION, with the latest releases from c0de.at/api/version.
---

# Is my c0de up to date?

A display next to your sheets that tells you whether a new version of c0de or c0de net is out. The program asks c0de.at for the latest releases and compares them with the versions installed on your server.

**Functions:** [HTTP_GET](/c0de_net/http/http_get) and [FROM_JSON](/c0de/strings/from_json) of c0de/strings, and the constants `C0DE_VERSION` and `C0DE_NET_VERSION`

::: info What you need
The mod **c0de net** in your game, a trigger block with a button, a **display wall** of 2 × 1 display blocks and one uninitialized variable item.
:::

## The idea

Every program knows the versions it runs on: the constant `C0DE_VERSION` holds the version of c0de as text, like `"0.5.0"`, and c0de net adds `C0DE_NET_VERSION`, like `"0.3.0"`. They need no INCLUDE.

The latest released versions are on the web. c0de.at reads them from the releases on GitHub and answers `https://c0de.at/api/version` with a small JSON object:

```json
{ "c0de": "0.5.0", "c0de_net": "0.3.0" }
```

So the program needs one GET, one FROM_JSON and two comparisons. The request comes from the computer of the player who presses the button, and every player can switch requests off for their own computer. The installed versions, though, are those of the server: the constants tell what the sheet runs on.

## The program

<<< @/tutorials/programs/libraries/http/up-to-date-check.c0de

## Building and running it

1. Build the display wall and bind it to `versioncheck` / `check`.
2. Set the trigger block to `versioncheck` / `check`, put an uninitialized variable item into it, and press the button.

When everything is up to date, the wall shows two green lines, and the result `current` is `TRUE`:

```
c0de 0.5.0: up to date
c0de net 0.3.0: up to date
```

<!-- screenshot: up-to-date-wall | The display wall with the two green lines c0de 0.5.0: up to date and c0de net 0.3.0: up to date -->

If a new version is out, its line is red, like `c0de 0.3.1: 0.4.0 is out`, and `current` is `FALSE`.

## How it works

- **The struct is the answer.** `releases` has one element per key of the answer. `c0de` is a valid name, because it starts with a letter. `c0de_net` would be too, but the element is called `net`, and `TAG(json: "c0de_net")` maps it to the key.
- **`compare` does the work twice.** It gets a name, the installed and the latest version, prints one line in green or red, and returns whether the two are equal. `=` compares two texts character by character.
- **Colors.** COLOR sets the color of the text that follows; `compare` sets it back to white at the end, so the next line starts clean.
- **Both must be current.** `current` from the first CALL and `netCurrent` from the second are joined with AND.
- **Asking is cheap.** c0de.at asks GitHub at most once an hour and keeps the answer in between, so you may press the button as often as you like. If GitHub can't be reached and the versions are unknown, the answer is the status 503, and the process crashes with HTTP_STATUS.

## Try it yourself

1. A version that isn't equal to the latest one isn't always older: a test version of c0de may be newer than the latest release. Write a function that tells if a version is older than another.

::: details Solution
<<< @/tutorials/programs/libraries/http/up-to-date-order.c0de

`number` takes the version apart at its dots with INSTR and MID, turns each part into a number with VAL, and joins them into one number: `0.4.0` becomes 4000, `0.10.0` becomes 10000. Comparing the texts would be wrong here: `"0.10.0"` comes before `"0.9.0"` in the alphabet, but 0.10.0 is the newer version. To use it in `versioncheck`, copy both functions above `compare` and call `outdated` instead of comparing with `=`.
:::

2. Make the display show `can't check` instead of crashing when the request fails.

::: details Solution
Add a variable `problem` of type ERROR to `check` and put it on the CALL line: `CALL c0de_net/http/HTTP_GET problem`. Right after it, check `IF problem.code ≠ 0 ;`, print `can't check: ` with `problem.message` in its block, and end the function with RETURN. A player without c0de net then sees `can't check: …` instead of a crash; see [When the network fails](/tutorials/libraries/c0de_net/http/network-errors).
:::

## Read more

- [HTTP_GET](/c0de_net/http/http_get), [FROM_JSON](/c0de/strings/from_json) and [TAG](/c0de/reference/data#tag)
- [Getting started](/c0de_net/http/getting-started) with `C0DE_NET_VERSION`, and [the constants of every program](/c0de/reference/data#constant)
- [COLOR](/c0de/reference/functions#color)
- The releases of [c0de](https://github.com/joernott/minecraft-c0de/releases) and [c0de net](https://github.com/joernott/minecraft-c0de-net/releases)
