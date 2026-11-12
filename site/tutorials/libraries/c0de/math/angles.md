---
description: How high does a ramp of 10 blocks at 30 degrees go, and how steep is a slope you already built? TAN turns an angle into a slope, ATN a slope back into an angle.
---

# Angles and ramps

A ramp up to your castle, a slide down a mountain, a roof: you know how long it should be and how steep it should look, but how many blocks high does it go? And the other way round: how steep is the hill behind your house? Two functions answer it, TAN and its opposite ATN.

**Functions:** [TAN](/c0de/math/tan) and [ATN](/c0de/math/atn), with [ROUND](/c0de/math/round) and the constant [PI](/c0de/math/pi)

::: info What you need
A trigger block with a button and a **display block**. For `height`, the **variable items** `length` of type INTEGER and `degrees` of type FLOAT (optional: the defaults are 10 blocks and 30 degrees) and two uninitialized items; for `slope`, the variable items `run` and `rise` of type INTEGER and one uninitialized item.
:::

## The idea

The steepness of a ramp is its **slope**: how many blocks it rises per block forward. Stairs rise 1 per 1, a ramp of slabs 1 per 2. The tangent of the angle is exactly that slope:

- **TAN** turns an angle into a slope: `rise = length × tan(angle)`.
- **ATN**, the arc tangent, turns a slope back into an angle: `angle = atn(rise / run)`.

The functions of c0de/math work in radians, where a full turn is 2 × PI. People think in degrees, where it is 360. So the program converts: degrees × PI / 180 gives radians, radians × 180 / PI gives degrees.

## The program

<<< @/tutorials/programs/libraries/math/angles-ramp.c0de

## Building and running it

Bind the display block to the program `ramps` and the function you want, and set the trigger block to the same function.

- **`height`** without items: a ramp of 10 blocks at 30 degrees rises 5.77 blocks; `blocks` is 6, and the display shows `10 long at 30.0°: 6 blocks high`. With `length` = 8 and `degrees` = 45, it rises 8 blocks – like stairs.
- **`slope`** with `run` = 2 and `rise` = 1, a ramp of slabs: `degrees` is 27, and the display shows `1 up over 2: 27°`. With `rise` = -1 and `run` = 4, the slope goes down: -14°. With `run` = 0, it is a wall: 90°.

## How it works

- **Radians in, FLOAT out.** TAN gets `degrees * c0de/math/PI / 180`. Its result is a FLOAT, and so is `rise`: for 45 degrees it is 7.999999999999999, not 8, because PI and the tangent are only nearly exact. ROUND makes the 8 blocks of it you can build.
- **`rise / run`** gives a FLOAT, because `/` always does, even for two INTEGERs. ATN takes it and gives the angle in radians, which `angle * 180 / c0de/math/PI` turns into degrees.
- **The wall.** A run of 0 would divide by zero and raise DIVISION_BY_ZERO. The IF answers 90 degrees first and leaves the function with RETURN, before the PRINT.
- **Negative slopes** give negative angles: ATN keeps the sign. Its result is always between -90 and 90 degrees.
- **The constant `c0de/math/PI`** comes with `INCLUDE c0de/math`, like the functions. A CONSTANT needs a literal value, so the program writes the conversion into the expressions instead of a constant of its own.

## Try it yourself

1. Your castle gate is 5 blocks above the ground. How long must a ramp at 30 degrees be to reach it?

::: details Solution
The opposite of `height`: `length = height / tan(angle)`. For 5 blocks at 30 degrees, `blocks` is 9 (8.66, rounded).

<<< @/tutorials/programs/libraries/math/angles-length.c0de

At 0 degrees, the tangent is 0 and the program crashes with DIVISION_BY_ZERO: a flat ramp never gets anywhere.
:::

2. What does `height` say for 90 degrees, and why?

::: details Solution
A huge number: TAN of 90 degrees is infinite in theory, but `90 * PI / 180` is a tiny bit less than a right angle, so TAN gives about 16 million billion, and the display says `10 long at 90.0°: 163312393531953696 blocks high`. ROUND can still make an INTEGER of that, but no ramp is that high: at 90 degrees, it is a wall. Keep the angles of ramps well below 90 degrees, and use ATN, which never has this problem, to measure steep slopes.
:::

## Read more

- The handbook pages of [TAN](/c0de/math/tan), [ATN](/c0de/math/atn) and [ROUND](/c0de/math/round)
- The handbook page of the constant [PI](/c0de/math/pi)
- [Drawing a circle](/tutorials/libraries/c0de/math/circle): SIN and COS, the other functions with angles
