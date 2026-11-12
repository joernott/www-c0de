---
description: How far away is every player, and in which direction? Pythagoras with SQR, the walking distance with ABS, and one step towards the player along each axis with SGN.
---

# Distance and direction

A finder at the gate of your base: press the button, and the chat tells you where every player nearby is – "Alex is 7 blocks away, north-east, higher up". The program measures the straight distance, the distance on foot, and the direction as one step along each axis.

**Functions:** [SQR](/c0de/math/sqr), [ABS](/c0de/math/abs) and [SGN](/c0de/math/sgn), with [ROUND](/c0de/math/round) of c0de/math and [FIND_ENTITIES](/c0de/minecraft/find_entities) and [SAY](/c0de/minecraft/say) of c0de/minecraft

::: info What you need
A trigger block with a button. To try the calculation alone: the **variable items** `dx`, `dy` and `dz` of type FLOAT and six uninitialized items. For the finder in the world: nothing else, and a friend (or a second account) to find.
:::

## The idea

Minecraft counts x towards the east, z towards the south and y upwards. The difference of two positions, `dx`, `dy` and `dz`, says everything about the way between them:

- **The straight distance** is the diagonal of a box with the sides `dx`, `dy` and `dz`. Pythagoras says its square is `dx² + dy² + dz²`, and SQR, the square root, turns that back into blocks.
- **The distance on foot**, when you can only walk along the axes, adds the sizes of the three sides. A side is a size even if it is negative – 6 blocks to the north are `dz` = -6 – so ABS drops the sign first.
- **The direction** is the sign of each side: SGN gives -1, 0 or 1. Those three numbers are also one step from one block towards the other: `x + stepX`, `y + stepY`, `z + stepZ`.

## The calculation

First the calculation alone, so you can test it with variable items:

<<< @/tutorials/programs/libraries/math/distance-compass.c0de

With `dx` = 3, `dy` = 2 and `dz` = -6, the results are `distance` = 7.0 (the square root of 9 + 4 + 36), `walk` = 11.0, the steps 1, 1 and -1 and `direction` = `north-east`. With `dx` = -4.5 and the others 0, it is 4.5, 4.5 and `west`.

## The finder in the world

The function `measure` goes unchanged into a program with c0de/minecraft. `find` looks for players around the trigger block and asks `measure` about each of them:

<<< @/tutorials/programs/libraries/math/distance-player.c0de

## Building and running it

1. Set the trigger block to the program `playerfinder` and the function `find`. It needs no items: `radius` has the default 32.
2. Walk away a bit, or ask a friend to, and press the button (or let your friend press it).
3. The chat shows one line per player within 32 blocks, like `[playerfinder/0] Alex is 7 blocks away, north-east, higher up`. You are on the list too, as the player right next to the trigger block.

## How it works

- **`PID.x`, `PID.y` and `PID.z`** are the position of the trigger block. `here` is a POSITION struct with them, the center of FIND_ENTITIES.
- **The differences go straight into the PARAMETER lines**: `player.position.x - here.x`. `measure` takes FLOATs, and an INTEGER goes into a FLOAT by itself.
- **`dx ^ 2`** squares a value; the sum is never negative, so SQR never raises INVALID_ARGUMENT here. Without the square, a negative value would.
- **ABS and SGN together** split a number into its size and its sign: `size * sign` is the number again.
- **The direction text** puts north or south first, then east or west, with a dash only if there are both. For a player straight above or below the trigger block, there is no compass direction.
- **RESULT lines pick results.** `find` only needs `distance`, `stepY` and `direction` of `measure`; the others are thrown away.

## Try it yourself

1. A guard zone is a cube, not a ball: a player is inside if they are at most `size` blocks away along each axis. Write a function `inside` with ABS.

::: details Solution
Each of the three distances must be at most `size`. With `dx` = -8, `dy` = 3, `dz` = 10 and the default size 10, `inside` is TRUE; with `dz` = -11, it is FALSE.

<<< @/tutorials/programs/libraries/math/distance-zone.c0de

:::

2. Why is `walk` (11 blocks) longer than `distance` (7 blocks) in the example – and when are they the same?

::: details Solution
`distance` is the straight line through the air, the diagonal; `walk` goes along the edges of the box, which is always at least as long. They are the same when two of the three differences are 0, like `dx` = -4.5 alone: then the way is a straight line along one axis.
:::

## Read more

- The handbook pages of [SQR](/c0de/math/sqr), [ABS](/c0de/math/abs) and [SGN](/c0de/math/sgn)
- [FIND_ENTITIES](/c0de/minecraft/find_entities) and [SAY](/c0de/minecraft/say) of [c0de/minecraft](/c0de/minecraft/)
- [Structs](/c0de/guide/language#structs) in the guide: the constant `PID`
- [Changing the world](/c0de/guide/libraries#changing-the-world): the POSITION struct
