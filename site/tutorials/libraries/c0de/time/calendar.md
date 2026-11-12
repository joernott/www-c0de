---
description: A calendar board that shows today's date with the weekday and the week, and counts down the days to an event – with DAY, MONTH, YEAR, WEEK and WEEKDAY.
---

# A calendar

A board for your base that shows today's date with the weekday and the week of the year, and how long it is until the next party.

Functions: [DAY](/c0de/time/day), [MONTH](/c0de/time/month), [YEAR](/c0de/time/year), [WEEK](/c0de/time/week) and [WEEKDAY](/c0de/time/weekday), with [NOW](/c0de/time/now) and [DIV](/c0de/math/div) of c0de/math.

::: info What you need
A **trigger block** with a button and a **display wall** of 3 × 1 display blocks (48 columns), or a **laptop**. Optionally a **timer block** instead of the button, to refresh the board by itself.
:::

## The idea

A TIME value knows the exact millisecond, but people read dates: "Thursday, 12 November 2026". The functions of c0de/time take a TIME apart into the numbers of the calendar, in the time zone of the server: DAY (1 to 31), MONTH (1 to 12), YEAR, WEEKDAY (1 for Monday to 7 for Sunday) and WEEK, the week of the year as many calendars in Europe count it. Arrays turn the numbers into names.

For the countdown you don't need the calendar at all. Two TIME values subtracted give the milliseconds between them, and a day has 86 400 000 of them.

## The program

<<< @/tutorials/programs/libraries/time/calendar-board.c0de

## Building and running it

Bind the display wall to the program `calendar` and the function `board`. Set the trigger block to the same program and function and press the button. On 12 November 2026 at 9 o'clock, the board shows:

```
Today is Thursday, 12 November 2026 (week 46)
Winter party:
Saturday, 19 December 2026 (week 51)
37 days and 8 hours to go
```

Change the constants `EVENT_NAME` and `EVENT` for your own event. To keep the board up to date, use a timer block with an interval of 1200 ticks (a minute) instead of the button.

## How it works

- **`describe` takes a TIME.** It works for any point in time, not only for now: `board` calls it for `now` and for `EVENT`. Every library function gets the same `time`, so all parts belong to the same moment.
- **Arrays start at 0, the calendar at 1.** WEEKDAY and MONTH start at 1, so both arrays start with an empty entry and `weekdays[weekday]` needs no calculation. An index can only be a number or a variable, not an expression like `weekday - 1`.
- **Subtracting times.** `to - from` is an INTEGER in milliseconds. [DIV](/c0de/math/div) divides without decimals: the whole days, and of the rest (`\` is the remainder), the whole hours. `/` would give a FLOAT.
- **Weeks are ISO weeks.** Week 1 is the week with the first Thursday of the year, and weeks start on Monday. So 1 January 2027, a Friday, still belongs to week 53 of 2026 – while YEAR says 2027.
- **The time zone counts.** `EVENT` is 18:00 UTC, which is 19:00 in Berlin. Near midnight, DAY and WEEKDAY of the same TIME can differ from server to server.

## Try it yourself

1. After the party has started, the board counts negative days. Show "It has started!" instead.

::: details Solution
<<< @/tutorials/programs/libraries/time/calendar-past.c0de

TIME values can be compared like numbers. `RETURN` ends `board` early, so the countdown isn't printed.
:::

2. Which week does `describe` report for 31 December 2024, a Tuesday? Try it: run `describe` with the program runner, or put a TIME variable item `time` with that date into a trigger block set to `describe`. It needs no uninitialized item: the result `text` takes the place of the parameter item.

::: details Solution
`Tuesday, 31 December 2024 (week 1)`. The week from Monday 30 December 2024 to Sunday 5 January 2025 contains the first Thursday of 2025, so it is week 1 of 2025. Show the year of the week with care: around New Year, it isn't always YEAR.
:::

## Read more

- Handbook [c0de/time](/c0de/time/) and [DIV](/c0de/math/div)
- [Libraries: c0de/time](/c0de/guide/libraries#c0detime)
- [TYPE_TIME](/c0de/reference/data#type_time) and [TYPE_ARRAY](/c0de/reference/data#type_array)
- [Display block](/c0de/reference/devices#display-block) and [Timer block](/c0de/reference/triggers#timer-block)
