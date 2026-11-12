---
description: An animation on a display that waits with SLEEP, and a display that tells day from night with TICKS – the game time of Minecraft compared with the real time.
---

# Game time and real time

A ball that bounces across a display, and a display that shows the day and the clock of the Minecraft world: sunrise, day, sunset or night.

Functions: [SLEEP](/c0de/time/sleep) and [TICKS](/c0de/minecraft/ticks) of c0de/minecraft.

::: info What you need
A **trigger block** with a button, a **timer block** and two **display blocks**.
:::

## The idea

The other recipes of c0de/time read the **real time**, the clock of the server. Minecraft has a second clock, the **game time**, counted in ticks. When the server keeps up, there are 20 ticks in a second, and a Minecraft day of 24 000 ticks lasts 20 minutes.

- [SLEEP](/c0de/time/sleep) pauses a program for a number of ticks, 1 to 72 000 (an hour). It is how a program waits: for an animation, for a door to close, for the next try.
- [TICKS](/c0de/minecraft/ticks) returns the game time of the world, the ticks since it was created. The remainder `\ 24000` is the time of day: 0 is sunrise at 6:00, 6000 noon, 12 000 sunset and 18 000 midnight.

## An animation

<<< @/tutorials/programs/libraries/time/game-time-bounce.c0de

Bind a display block to the program `bouncer` and the function `bounce`, set the trigger block to the same and press its button. A ball runs across row 3 of the display and back, three times.

<!-- screenshot: game-time-bounce | a display block with the ball "o" in the middle of row 3, the trigger block with its button in front of it -->

### How it works

- **One frame, one SLEEP.** Each pass of the inner loops draws one frame and then waits `delay` ticks.
- **Drawing over the old ball.** On the way right, PRINT writes `" o"`: the space wipes out the ball of the last frame, one column to the left. On the way back, `"o "` wipes out the one to the right. No CLS, no flicker.
- **The lines count too.** The cursor needs a tick for every line, so a frame takes about four ticks plus the SLEEP. A program never runs faster than one line per tick.
- **Parameters with default values.** `rounds` and `delay` have default values, so the trigger block needs no items. Put an INTEGER variable item `delay` with 5 into it for a slow ball. With 0, SLEEP raises INVALID_ARGUMENT and the process crashes.

## Day and night

<<< @/tutorials/programs/libraries/time/game-time-daynight.c0de

Bind the second display block to `daynight` / `show`, set the timer block to the same and an interval of 100 ticks. The display shows the number of the Minecraft day, the clock of the world and what the sky is doing:

```
Day 3
18:30
Sunset
```

### How it works

- **From ticks to a clock.** A Minecraft hour has 1000 ticks, and tick 0 is 6:00 in the morning. So the hour is the whole thousands plus 6, and the minute the rest of a thousand ticks times 60 / 1000.
- **The day count.** Every 24 000 ticks a new day starts; `phase` counts from day 1.
- **The phases** are compared from the earliest to the latest: Day, then Sunset from 12 000, Night from 13 000 and Sunrise from 23 000. A later IF overwrites an earlier one.
- **TICKS is not the time of day.** TICKS counts every tick of the world. Sleeping in a bed or `/time set` change the sun, but not TICKS. In a world where somebody has slept, the display shows the wrong phase; in a world where nobody sleeps, it is right.
- **TICKS needs the game.** Programs with c0de/minecraft only run in Minecraft, so `phase` takes the ticks as a parameter: try it with a trigger block set to `phase`, an INTEGER variable item `ticks` with 12 500 and two uninitialized items (the parameter item makes room for the third result). The results are 1, `18:30` and `Sunset`.

## Try it yourself

1. Set `delay` to 1. Why is the ball not twice as fast as with 2?

::: details Solution
A frame takes about four ticks for the lines of the loop and `delay` ticks of SLEEP: six ticks with 2, five ticks with 1. Only the SLEEP gets shorter. For a faster ball, move it two columns per frame.
:::

2. SLEEP 20 is a second only when the server keeps up. Measure how many ticks your world really runs per second: read TICKS and NOW, sleep 200 ticks, read both again.

::: details Solution
<<< @/tutorials/programs/libraries/time/game-time-speed.c0de

The ticks between the two readings divided by the seconds between them. A healthy server shows 20.0; a busy one less, and then every SLEEP and every program takes longer in real time.
:::

## Read more

- Handbook [SLEEP](/c0de/time/sleep), [TICKS](/c0de/minecraft/ticks) and [NOW](/c0de/time/now)
- [Libraries: c0de/time](/c0de/guide/libraries#c0detime) and [c0de/minecraft](/c0de/guide/libraries#c0deminecraft)
- [The cursor](/c0de/guide/running-programs#the-cursor)
- [Display block](/c0de/reference/devices#display-block), [Trigger block](/c0de/reference/triggers#trigger-block) and [Timer block](/c0de/reference/triggers#timer-block)
