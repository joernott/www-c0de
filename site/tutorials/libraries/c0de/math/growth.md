---
description: A farm that doubles every day – EXP computes the growth, LOG how many days until it reaches 1000, and the same LOG counts the digits of a number, with a check for the tiny errors of FLOATs.
---

# Growth

Two chickens, two cows, a few rabbits: animals that breed grow faster and faster. If your farm doubles every day, how many animals do you have after a week? How many days until there are 1000? And how many digits does that number have, so it fits on the display? EXP and LOG answer all three.

**Functions:** [EXP](/c0de/math/exp) and [LOG](/c0de/math/log), with [ROUND](/c0de/math/round) and [INT](/c0de/math/int)

::: info What you need
A trigger block with a button and a **display block**. The functions have default values, so they run without items. To change them: the **variable items** `start`, `days`, `goal` and `number` of type INTEGER and `factor` of type FLOAT, and one uninitialized item for the result.
:::

## The idea

A farm that starts with `start` animals and grows by the `factor` every day has `start × factor^days` animals after `days` days. Doubling means the factor 2: 1, 2, 4, 8 … 128 after a week.

EXP and LOG are the two halves of this power:

- **LOG**, the natural logarithm, turns multiplying into adding: LOG(2) is the growth of one day, and `days × LOG(2)` the growth of all days together.
- **EXP** turns that sum back into a factor: `factor^days` is `EXP(days × LOG(factor))`. This is how the computer calculates powers anyway.

The real use of LOG is the question backwards: how many days until the farm has `goal` animals? The farm must grow by `goal / start`, and each day adds LOG(`factor`) of growth, so it takes `LOG(goal / start) / LOG(factor)` days. With the same trick, LOG counts the digits of a number: a number with 4 digits is at least 10³ and below 10⁴, so `LOG(number) / LOG(10)` is between 3 and 4.

## The program

<<< @/tutorials/programs/libraries/math/growth-farm.c0de

## Building and running it

Bind the display block to the program `farm` and the function you want, and set the trigger block to the same function.

- **`grow`** without items: the display shows `Day 0: 1` to `Day 7: 128`, and `count` is 128.
- **`daysUntil`** without items: `days` is 10. After 9 days the farm has 512 animals, after 10 it has 1024, the first number of at least 1000.
- **`digits`** with `number` = 1000: 4. With 999 it is 3.

<!-- screenshot: growth-display | a display block showing the lines "Day 0: 1" to "Day 7: 128" -->

## How it works

- **LOG once, EXP every day.** `rate` is LOG(`factor`), computed before the loop. Each day, EXP of `day * rate` gives the growth since day 0. EXP returns a FLOAT like 127.99999999999997, so ROUND makes whole animals of it. With the operator `^`, `start * factor ^ day` would give the same numbers.
- **Rounding up with INT.** 9.97 days must become 10 days: the farm reaches 1000 only on day 10. INT rounds down, so the program rounds `-9.97` down to -10 and turns the sign back: that is rounding up.
- **The check after LOG.** A FLOAT is often a tiny bit off. LOG(1000) / LOG(10) gives 2.9999999999999996 instead of 3, and INT turns that into 2: without the check, `digits` would say 1000 has 3 digits. The IF compares with the exact INTEGER power `10 ^ digits` and corrects it. `daysUntil` checks the same way whether one day less is already enough.
- **What LOG can't do.** LOG only takes numbers greater than 0: `digits` with 0 crashes with INVALID_ARGUMENT. A factor of 1 doesn't grow at all; its LOG is 0, and `daysUntil` would divide by 0. A `goal` the farm has already reached gives 0 days without any LOG.

## Try it yourself

1. A rabbit farm with 10 rabbits grows by half every day (factor 1.5). On which day does it pass 100 rabbits?

::: details Solution
No new program: run `daysUntil` with `start` = 10, `factor` = 1.5 and `goal` = 100. `days` is 6: 10 × 1.5⁵ is about 76, 10 × 1.5⁶ about 114. `grow` with the same `start` and `factor` and `days` = 6 shows the rabbits day by day.
:::

2. Remove the IF from `digits` and try the numbers 99, 100, 999 and 1000. Which answers are wrong?

::: details Solution
99 and 999 still give 2 and 3, and 100 gives 3, because LOG(100) / LOG(10) happens to be exactly 2.0. 1000 gives 3 instead of 4: LOG(1000) / LOG(10) is 2.9999999999999996. Whether a FLOAT is a tiny bit off can't be seen in advance, so a calculation with LOG that must give an exact whole number needs a check with whole numbers.
:::

## Read more

- The handbook pages of [EXP](/c0de/math/exp), [LOG](/c0de/math/log), [ROUND](/c0de/math/round) and [INT](/c0de/math/int)
- [Operators](/c0de/guide/language#operators): `^` for powers
- [Whole numbers and fractions](/tutorials/libraries/c0de/math/fractions): ROUND, INT and FIX
