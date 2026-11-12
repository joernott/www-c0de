---
description: A stopwatch started and stopped with two buttons, and a reaction test on a laptop – with TIMER, MILLISECOND and calculations with TIME values.
---

# Stopwatch and reaction test

A stopwatch for races in your world: one button starts it, another stops it, and a display wall shows the time to the millisecond. Then a reaction test on a laptop: how fast do you press a key when "GO!" appears?

Functions: [TIMER](/c0de/time/timer), [MILLISECOND](/c0de/time/millisecond) and calculations with TIME values, with [NOW](/c0de/time/now), [SLEEP](/c0de/time/sleep) and [FORMAT](/c0de/strings/format).

::: info What you need
For the stopwatch: two **trigger blocks** with a **button** each, a **display wall** of 2 × 1 display blocks, a **hopper**, a **chest** and a few **uninitialized variable items**. For the reaction test: a trigger block with a button and a **laptop**.
:::

## The idea

Measuring time means reading the clock twice and subtracting. c0de has two clocks for it:

- [NOW](/c0de/time/now) returns a TIME, a point in time in milliseconds. Two TIME values subtracted give an INTEGER, the milliseconds between them. A TIME can travel as a variable item, so one process can start the stopwatch and another one stop it.
- [TIMER](/c0de/time/timer) returns the seconds since midnight as a FLOAT, like `32703.25`. It is handy inside one process: no TIME values, just a subtraction of two numbers.

## The stopwatch

<<< @/tutorials/programs/libraries/time/stopwatch-buttons.c0de

### Building and running it

1. Place trigger block **A** and set it to `stopwatch` / `start`. Put a few uninitialized variable items into its input: each start needs one for its result `started`.
2. Place trigger block **B** right next to A and set it to `stopwatch` / `stop`. B is the only block with an inventory that touches A, so A's output goes into B by itself.
3. Put a hopper under B that leads into the chest.
4. Put a button on each trigger block, and bind the display wall to `stopwatch` / `stop`.

Press the button on A: the item `started` goes into B. Press the button on B: the wall shows

```
Start 09:04:50.655
Stop  09:05:03.000
Time  12.345 s
```

and the item `seconds` with the value 12.345 falls into the chest – a list of all your times.

<!-- screenshot: stopwatch-buttons | the two trigger blocks with buttons side by side, the hopper and chest under the second one, and the display wall showing the start, stop and elapsed time -->

### How it works

- **The time travels as an item.** `start` only returns NOW as `started`. `stop` takes it as a parameter, so the two processes share nothing but this item. Press A twice, and two items wait in B: the next run takes one for its parameter and passes the other one on into the chest.
- **Subtracting times.** `now - started` is the number of milliseconds. Divided by 1000 with `/`, it becomes a FLOAT in seconds, and `%.3f` writes it with three decimals.
- **MILLISECOND.** `%tT` writes a time to the second. `stamp` adds the milliseconds with [MILLISECOND](/c0de/time/millisecond), 0 to 999, padded to three digits by `.%03d`.
- **How exact is it?** NOW is exact to the millisecond, but a process starts at a tick and the cursor moves one line per tick, so a stopwatch in the game is good to about a twentieth of a second. Both buttons wait the same way, so the error mostly cancels out.

## The reaction test

<<< @/tutorials/programs/libraries/time/stopwatch-reaction.c0de

### Building and running it

Bind the laptop to `reaction` / `react`, set the trigger block to the same and press its button. Open the laptop and press a key to start. After two to five seconds, "GO!" appears: press a key as fast as you can. The laptop shows your time and a verdict.

### How it works

- **A random wait.** [RANDOM](/c0de/math/random) and [INT](/c0de/math/int) choose between 40 and 99 ticks, and [SLEEP](/c0de/time/sleep) waits that long, so you can't guess when "GO!" comes.
- **TIMER around the loop.** TIMER is read right after "GO!" and right after the key. The loop asks INKEY until a key is there, so the difference is your reaction time – plus a tick or two of the cursor.
- **Midnight.** TIMER starts again at 0 at midnight. If `stop` is smaller than `start`, the test ran over midnight, and a day of 86 400 seconds is added.
- **`rate` is a function of its own.** It takes the seconds as a parameter, so it can be tested with fixed values like 0.25 or 0.8, without waiting for a real reaction.

## Try it yourself

1. Keys pressed before "GO!" wait for INKEY, so pressing early gives a perfect time. Catch the cheaters: if a key is waiting right after the SLEEP, print "Too early!" and stop.

::: details Solution
<<< @/tutorials/programs/libraries/time/stopwatch-early.c0de

One INKEY after the SLEEP is enough: an early key is still waiting there. `RETURN` ends `react`.
:::

2. A race through your parkour takes minutes. Show the time as `2:05.300` instead of `125.300 s`.

::: details Solution
<<< @/tutorials/programs/libraries/time/stopwatch-minutes.c0de

DIV gives the whole minutes of the milliseconds, the remainder `\ 60000` the rest of the last minute. `%06.3f` writes the seconds six characters wide with three decimals and a leading zero, like `05.300`.
:::

## Read more

- Handbook [c0de/time](/c0de/time/), [FORMAT](/c0de/strings/format), [RANDOM](/c0de/math/random) and [DIV](/c0de/math/div)
- [Libraries: c0de/time](/c0de/guide/libraries#c0detime) and [FORMAT](/c0de/guide/libraries#format)
- [TYPE_TIME](/c0de/reference/data#type_time)
- [Chaining](/c0de/guide/running-programs#chaining) and [Talking to players](/c0de/guide/running-programs#talking-to-players)
- [Laptop](/c0de/reference/devices#laptop) and [INKEY](/c0de/reference/functions#inkey)
