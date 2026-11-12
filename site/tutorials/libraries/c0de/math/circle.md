---
description: A ring of blocks of any radius around the trigger block – COS and SIN turn an angle into a point on the circle, ROUND turns it into a block, and PLACE_BLOCK builds it.
---

# Drawing a circle

A round tower, a fountain, a ring of torches around the spawn: Minecraft is made of squares, but a program can draw a circle of blocks of any radius around the trigger block. It walks once around the circle in small steps, turns each angle into a point with COS and SIN, and places a block on every point.

**Functions:** [SIN](/c0de/math/sin), [COS](/c0de/math/cos), [ROUND](/c0de/math/round) and the constant `c0de/math/PI`, with [PLACE_BLOCK](/c0de/minecraft/place_block) and [SAY](/c0de/minecraft/say) of c0de/minecraft

::: warning Needs an operator
PLACE_BLOCK without `inventory` puts blocks into the world out of nothing, so the owner of the trigger block must be an operator. In the world of the tutorials, you are one. On a server, the administrator can allow it for everybody with `allowBlockChanges=true` in `config/c0de.properties`; without that right, the program crashes with PERMISSION_DENIED. The alternative for everyone is PLACE_BLOCK with `inventory`: it takes the blocks from a chest, like a player – see the first exercise.
:::

::: info What you need
A trigger block with a button on flat ground, with some free space around it. Optionally the **variable items** `radius` of type INTEGER and `block` of type STRING (a block ID, like `minecraft:oak_planks`); without them, the ring has the radius 5 and is made of stone bricks.
:::

## The idea

A point on a circle with the radius `r` around the center is `x = r · cos(angle)` and `z = r · sin(angle)`. When the angle goes from 0 to a full turn, the point walks once around the circle. The angle is in radians, and a full turn is 2 × PI.

Blocks have whole coordinates, so ROUND moves every point to the nearest block. Two things follow from that:

- **Enough steps.** The circle is 2 × PI × r long, about 6.3 × r blocks. With 8 × r steps, two points are less than one block apart, so the ring has no gaps.
- **No block twice.** With so many steps, neighboring points often round to the same block. PLACE_BLOCK only places a block into air (or grass, water and other replaceable blocks) and raises INVALID_ARGUMENT otherwise, so a point that is the same as the one before it is skipped.

## The calculation

The function `points` only computes, so it can be tested without the world: for the radius 3, it gives 20 offsets from the center, from `x: 3, z: 0` once around to `x: 3, z: -1`; for the radius 1, the 8 blocks around the center.

<<< @/tutorials/programs/libraries/math/circle-points.c0de

## The ring in the world

The program `ring` has the same struct and function, and a function `draw` that places a block on every point:

<<< @/tutorials/programs/libraries/math/circle-ring.c0de

## Building and running it

1. Place the trigger block on flat ground and put a button on it.
2. Set it to the program `ring` and the function `draw`. If you like, put the items `radius` and `block` into its input inventory.
3. Press the button. Block by block, a ring of stone bricks grows around the trigger block, clockwise as seen from above, starting in the east. At the end, the chat says `40 blocks placed, 0 spots were taken`.

<!-- screenshot: circle-ring | a ring of stone bricks with the radius 5 on flat grass around a trigger block with a button, seen from above at an angle -->

The ring stands at the height of the trigger block. A spot that holds a block already, like a tree, is skipped and counted.

## How it works

- **`angle`** is `2 * c0de/math/PI * i / steps`: a fraction of a full turn. `/` gives a FLOAT, as COS and SIN need it.
- **COS and SIN** give a number from -1 to 1; times `radius`, that is the offset from the center. ROUND writes it straight into the elements `spot.x` and `spot.z` of the struct.
- **Skipping doubles.** The new point is compared with the last one in the list and with the first one, because the last steps of the circle come back to where it started. Structs compare element by element.
- **The ERROR variable on the CALL line** catches the error of PLACE_BLOCK, so a blocked spot doesn't crash the program. After a CALL without an error, `problem.code` is 0 again.
- **Not quite symmetrical.** ROUND sends a .5 to the even neighbor, and a FLOAT is often a tiny bit off a .5. Some points of a small ring land on the other block than their mirror image – the ring is still closed.

## Try it yourself

1. Build the ring without operator rights: take the blocks from a chest on top of the trigger block.

::: details Solution
The parameter `inventory` of PLACE_BLOCK names the chest, a POSITION one block above the trigger block. Fill the chest with stone bricks (40 for the radius 5) and put the button on a side of the trigger block. When the chest is empty, PLACE_BLOCK raises ITEM_MISSING, and the spot counts as skipped.

<<< @/tutorials/programs/libraries/math/circle-chest.c0de

:::

2. What happens with `4 * radius` steps instead of `8 * radius`?

::: details Solution
The circle is about 6.3 × r blocks long, so 4 × r steps are about 1.6 blocks apart. For a small radius, ROUND still hits neighboring blocks, but for a larger one the ring gets gaps where a step jumps over a block. More steps cost time – one line per tick – but never make a gap.
:::

## Read more

- The handbook pages of [SIN](/c0de/math/sin), [COS](/c0de/math/cos) and [ROUND](/c0de/math/round), and the constant `c0de/math/PI` in [Libraries](/c0de/guide/libraries#c0demath)
- [PLACE_BLOCK](/c0de/minecraft/place_block), [Changing the world](/c0de/guide/libraries#changing-the-world) and [Owner and permissions](/c0de/guide/libraries#owner-and-permissions)
- [Errors](/c0de/guide/language#errors): catching an error with an ERROR variable
- [Programs in the world](/tutorials/programmers/world): who may change the world
