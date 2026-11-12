---
description: A digital clock on a display wall, refreshed every second by a timer block – with NOW, HOUR, MINUTE, SECOND and FORMAT.
---

# A clock on the wall

A digital clock on a display wall that shows the real time and moves on every second. A timer block starts the program again and again; each run reads the time once and writes it to the screen.

Functions: [NOW](/c0de/time/now), [HOUR](/c0de/time/hour), [MINUTE](/c0de/time/minute), [SECOND](/c0de/time/second) and [FORMAT](/c0de/strings/format) of c0de/strings.

::: info What you need
A **timer block** and a **display wall** of 2 × 1 display blocks (32 columns, 8 rows). No variable items: the program has no parameters and no results.
:::

## The idea

A program can't sit and watch the clock: it runs, does its work and ends. For something that changes all the time, a **timer block** starts the same function again and again, here every 20 ticks, about once a second. Each run asks [NOW](/c0de/time/now) for the current time, takes it apart with HOUR, MINUTE and SECOND, and writes `09:05:03` to the screen.

A TIME value is a point in time, counted in milliseconds since the start of 1970. HOUR, MINUTE and SECOND turn it into the numbers you know, in the time zone of the server. [FORMAT](/c0de/strings/format) then pads them with a leading zero, so 9 o'clock reads `09`, not `9`.

## The program

<<< @/tutorials/programs/libraries/time/clock-wall.c0de

## Building and running it

1. Build the display wall: two display blocks side by side, facing the same way.
2. Bind it to the program `wallclock` and the function `tick` (right-click a display block, pick the program and the function, click ✔).
3. Place a timer block, set it to `wallclock` / `tick` and an interval of 20 ticks.

The clock appears in the middle of the wall and counts the seconds. To change the program, first stop the timer block with a lever: a running process locks the sheet.

<!-- screenshot: clock-wall | a display wall of 2 × 1 display blocks showing the time 09:05:03 in the middle, the timer block in front of it -->

## How it works

- **One NOW, many parts.** The program asks for the time once and passes `now` to HOUR, MINUTE and SECOND. Without `time`, each of them would read the clock itself – and at 09:59:59.990, HOUR could still say 9 while MINUTE already says 0, a clock that jumps back to 09:00:00 for a second.
- **FORMAT pads the numbers.** `%02d` writes an integer at least two digits wide and fills it with zeros. The format `:%02d` adds the colon in the same call.
- **LOCATE instead of CLS.** The new time overwrites the old one at row 3, column 12. Clearing the screen first would make it flicker.
- **The cursor takes time too.** It moves one line per tick, and `tick` takes about 18 lines. With a timer interval of 20 ticks, a run ends before the next one is due. A timer block starts a new process only when the last one has ended, so a slower program would skip some seconds.
- **The time zone is the server's.** On a server in Berlin, 23:59:59 UTC is shown as `00:59:59`.

## Try it yourself

1. Show the date below the time, like `2026-11-12`.

::: details Solution
<<< @/tutorials/programs/libraries/time/clock-date.c0de

For TIME values, FORMAT knows its own codes: `%tT` is the time and `%tF` the date. One call each replaces HOUR, MINUTE, SECOND and their padding. The parts are worth it when you need the numbers, as in the next exercise.
:::

2. Greet the players: "Good morning" before noon, "Good afternoon" before 18:00, "Good evening" after it and "Good night" before 6:00.

::: details Solution
<<< @/tutorials/programs/libraries/time/clock-greeting.c0de

The day has four quarters of six hours, and [DIV](/c0de/math/div) of c0de/math turns the hour into the number of its quarter, 0 to 3, which picks the greeting from the array. The greetings are padded to the same length, so a long one is overwritten completely by a shorter one.
:::

## Read more

- Handbook [c0de/time](/c0de/time/) and [FORMAT](/c0de/strings/format)
- [Libraries: c0de/time](/c0de/guide/libraries#c0detime) and [FORMAT](/c0de/guide/libraries#format)
- [TYPE_TIME](/c0de/reference/data#type_time)
- [Timer block](/c0de/reference/triggers#timer-block) and [Display block](/c0de/reference/devices#display-block)
- [The cursor](/c0de/guide/running-programs#the-cursor)
