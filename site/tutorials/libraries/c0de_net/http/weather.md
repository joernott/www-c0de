---
description: The current weather of any city on a display wall – two requests to the free Open-Meteo API with HTTP_GET, read into structs with FROM_JSON.
---

# Reading data from the web

A weather station for your base: type the name of a city, press the button, and a display wall shows the sky, the temperature and the wind there right now. The data comes from [Open-Meteo](https://open-meteo.com/), a free weather service that needs no account and no key.

**Functions:** [HTTP_CONNECTION](/c0de_net/http/http_connection), [HTTP_GET](/c0de_net/http/http_get), and [FROM_JSON](/c0de/strings/from_json) of c0de/strings

::: info What you need
The mod **c0de net** in your game, a trigger block with a button, a **display wall** of 2 × 1 display blocks (32 columns and 8 rows), one uninitialized variable item, and optionally a **variable item** `city` of type STRING with the name of a city, for example `Berlin`. Without it, the program shows Vienna.
:::

## The idea

A web API is a web page for programs: instead of HTML, it answers with JSON. Open-Meteo has two of them. The geocoding API turns a name into a place with its coordinates, and the forecast API tells the weather at coordinates. So the program asks twice: first "where is Berlin?", then "what's the weather at 52.52, 13.41?".

c0de_net/http sends the requests. A struct [HTTP_CONNECTION](/c0de_net/http/http_connection) says which server to ask and how; [HTTP_GET](/c0de_net/http/http_get) asks for one endpoint, a path with a query, and returns the answer as text. [FROM_JSON](/c0de/strings/from_json) reads that text into variables of your own types. You only declare the parts of the answer you need; FROM_JSON ignores the rest.

The requests don't come from the Minecraft server, but from the computer of the player who presses the button, which must have c0de net installed. Every player can switch this off for their own computer.

## The program

<<< @/tutorials/programs/libraries/http/weather-wall.c0de

## Building and running it

1. Build the display wall from two display blocks side by side. Right-click one of them, click the buttons until they show `weatherwall` and `show`, and click ✔.
2. Set the trigger block to the program `weatherwall` and the function `show`. Put an uninitialized variable item into its input inventory, and the item `city` if you want another city than Vienna.
3. Press the button. After a moment, the wall shows:

```
Vienna, Austria

Cloudy
6.2 °C
Wind 7.7 km/h
```

<!-- screenshot: weather-wall | The display wall showing Vienna, Austria, the sky, the temperature and the wind -->

The result item `found` is `TRUE`. For a name that Open-Meteo doesn't know, like `Xyzzyqx`, the wall shows `No city called Xyzzyqx`, and `found` is `FALSE`.

## How it works

- **One connection, two servers.** `api` is set up once: `use_ssl` for https, a `timeout` of 10 seconds instead of 60. For the second request, only `server` changes. The endpoint is everything behind the server name, including the query after `?`.
- **The geocoding answer** looks like `{"results": [{"name": "Vienna", "latitude": 48.20849, "longitude": 16.37208, "country": "Austria", …}]}` with many more keys. The struct `search` has the one element `results`, an array of `place`, and `place` has just the four elements the program uses.
- **No result is not an error.** For an unknown city, the answer has no `results` at all. FROM_JSON then keeps the start value of the element, an empty array, and LEN says 0. (A tag on a VARIABLE line, like `TAG(json: "results")`, would raise UNKNOWN_KEY instead.)
- **Tags rename.** The forecast calls its values `temperature_2m`, `wind_speed_10m` and `weather_code`. The tags in the struct `weather` map them to shorter names. The tag on `VARIABLE now STRUCT weather TAG(json: "current")` is a path: FROM_JSON reads only the object `current` of the answer.
- **Numbers into the endpoint.** `⊕` turns the coordinates into text, so the endpoint becomes `/v1/forecast?latitude=48.20849&longitude=16.37208&current=…`.
- **The weather code** is a number of the WMO: 0 is a clear sky, 1 to 3 clouds, 45 fog, 51 to 67 rain, 71 to 77 snow, 80 to 82 showers, 95 and above thunderstorms. `sky` checks the limits from low to high, so the last one that fits wins.
- **Errors.** If the player has no c0de net, or Open-Meteo doesn't answer, the CALL raises an error of c0de net and the process crashes; the trigger block shows it. [When the network fails](/tutorials/libraries/c0de_net/http/network-errors) shows how to catch them.

## Try it yourself

1. Show tomorrow's lowest and highest temperature in Vienna. Open-Meteo gives daily values with `daily=temperature_2m_min,temperature_2m_max`.

::: details Solution
<<< @/tutorials/programs/libraries/http/weather-tomorrow.c0de

`forecast_days=2` asks for today and tomorrow, and each daily value comes as an array with one number per day: `{"daily": {"temperature_2m_min": [3.1, 4.0], …}}`. The tags on the VARIABLE lines are paths into the answer; index 1 is tomorrow. One answer can be read twice, into different variables.
:::

2. Keep the wall up to date without pressing the button.

::: details Solution
Use a **timer block** instead of the trigger block, with the same program and function and an interval of 18000 ticks (15 minutes; Open-Meteo updates its current values every 15 minutes). Nobody starts a timer block's process, so the requests come from the owner of the timer block, who must be online. Asking every second would gain nothing and only load the free service.
:::

3. Try the city `New York`. What happens, and how do you fix it?

::: details Solution
The process crashes with INVALID_ARGUMENT: `Not a valid URL … (Illegal character in query)`. A URL can't contain spaces. Write the city as `New+York`; in a query, `+` stands for a space.
:::

## Read more

- [c0de_net/http](/c0de_net/http/): [Getting started](/c0de_net/http/getting-started), [HTTP_CONNECTION](/c0de_net/http/http_connection), [HTTP_GET](/c0de_net/http/http_get), [Errors](/c0de_net/http/errors)
- [FROM_JSON](/c0de/strings/from_json) and [JSON and YAML](/c0de/guide/libraries#json-and-yaml)
- [Data and the network](/tutorials/programmers/data): types, tags and FROM_JSON in detail
- [Display block](/c0de/reference/devices#display-block) and [Timer block](/c0de/reference/triggers#timer-block)
- The [Open-Meteo documentation](https://open-meteo.com/en/docs) lists all values the forecast can give
