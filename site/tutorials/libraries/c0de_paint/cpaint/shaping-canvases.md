---
description: A whole street from one house, drawn once and then moved, recoloured, cut, scaled, turned and mirrored with the canvas operations of c0de paint, with a path to every door found with CANVAS_GET.
---

# Shaping canvases

A program as a town planner: it draws one small house of oak planks, and makes a whole street of it. One copy gets brick walls, one is still a building site, one is only a façade, one is blown up into a hall, one is turned to close the end of the street, and the house across the road is a mirror image. At the end, every door gets a path.

**Functions:** [CANVAS_MIN and CANVAS_MAX](/c0de_paint/cpaint/canvas_min-and-canvas_max), [CANVAS_GET](/c0de_paint/cpaint/canvas_get), [CANVAS_CLEAR and CANVAS_CROP](/c0de_paint/cpaint/canvas_clear-and-canvas_crop), [CANVAS_MOVE](/c0de_paint/cpaint/canvas_move), [CANVAS_REPLACE](/c0de_paint/cpaint/canvas_replace), [CANVAS_MERGE](/c0de_paint/cpaint/canvas_merge), [CANVAS_SCALE](/c0de_paint/cpaint/canvas_scale), [CANVAS_ROTATE](/c0de_paint/cpaint/canvas_rotate) and [CANVAS_MIRROR](/c0de_paint/cpaint/canvas_mirror), with [DRAW_BOX](/c0de_paint/cpaint/draw_box), [DRAW_LINE](/c0de_paint/cpaint/draw_line), [DRAW_BLOCK](/c0de_paint/cpaint/draw_block) and [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas)

::: warning Needs an operator
The street needs oak planks, oak stairs, oak doors, bricks and dirt paths – too many kinds for a chest, and dirt paths can't be carried at all. So RENDER_CANVAS builds it without `input`, out of nowhere, and replaces whatever is in the way. That only works if the owner of the trigger block is an operator, or if the server allows it with `allowBlockChanges=true` in `config/c0de.properties`; otherwise it raises PERMISSION_DENIED. In a single-player world with cheats, you are an operator. [Copying a building](/tutorials/libraries/c0de_paint/cpaint/copying-buildings) shows how to build from chests.
:::

::: info What you need

- the mods **c0de** and **c0de paint**
- a **trigger block** with a **button** on it, and an empty sheet for the program
- a flat place of about 45 × 18 blocks: the street runs 45 blocks east of the trigger block, from 6 blocks north of it to 11 blocks south
- operator rights or `allowBlockChanges` (see above)

:::

## The idea

A canvas is a value like a number: `ASSIGN copy home ;` makes a copy, and changing the copy leaves `home` as it is. So the program draws the house only once, in a function of its own, and then takes a fresh copy for every plot of the street. The canvas operations change a copy without drawing anything new:

- [CANVAS_REPLACE](/c0de_paint/cpaint/canvas_replace) draws every voxel of one block again with another style – new colours.
- [CANVAS_CLEAR and CANVAS_CROP](/c0de_paint/cpaint/canvas_clear-and-canvas_crop) unset the voxels inside or outside a box – half a house.
- [CANVAS_SCALE](/c0de_paint/cpaint/canvas_scale), [CANVAS_ROTATE](/c0de_paint/cpaint/canvas_rotate) and [CANVAS_MIRROR](/c0de_paint/cpaint/canvas_mirror) make it bigger, turn it and mirror it. They turn the states of the blocks along: stairs and doors face the right way afterwards.
- [CANVAS_MOVE](/c0de_paint/cpaint/canvas_move) shifts a canvas, and [CANVAS_MERGE](/c0de_paint/cpaint/canvas_merge) draws it into another one – the street.
- [CANVAS_MIN and CANVAS_MAX](/c0de_paint/cpaint/canvas_min-and-canvas_max) tell where a canvas begins and ends, and [CANVAS_GET](/c0de_paint/cpaint/canvas_get) reads a single voxel.

Only one RENDER_CANVAS at the very end builds the whole street in the world.

## The program

<<< @/tutorials/programs/libraries/paint/shaping-canvases-street.c0de

## Building and running it

1. Stand where the street should begin, facing east, and place the trigger block there with the button on it. The trigger block stands in the middle of the road, at its west end.
2. Set the trigger block to `street` and `build`, and press the button.

The houses rise from the ground layer by layer. South of the road, from west to east: the oak house, the brick house, the building site, the façade and the hall. Across the road stands the mirror image of the oak house, and the turned house closes the east end of the road, its door looking back at the trigger block. In front of every door there is a dirt path.

<!-- screenshot: shaping-canvases-street | the whole street seen from above its west end: the trigger block in the middle of the road, south of it the oak house, the brick house, the two-block-high building site, the flat façade and the big hall with its gateway, across the road the mirrored oak house, and the turned house across the east end of the road; dirt paths in front of the doors -->

## How it works

**The house.** `house` draws into its result and doesn't touch the world.

- **The walls** are a box with only a `side_style` from 0, 0, 0 to `width - 1`, `height - 1`, `depth - 1`: walls, a floor and a ceiling of planks, nothing inside.
- **The door** is two voxels at `x` 1 on the north side, `z` 0: the lower and the upper half. The BLOCK variable still has `"facing"` `"north"` from the stairs, so the door looks north, and `"hinge"` `"left"` says on which side it hangs.
- **The roof** grows layer by layer. In every layer, a box of planks fills the attic from the front row `a.z` to the back row `b.z`, then two lines of stairs go over the front and the back row. Then both rows move one voxel inward and one up, until they meet: an odd depth ends with a ridge of planks. The stairs on the north side face south and the ones on the south side north, so both rise towards the ridge.

**The street.** `build` keeps the first house in `street` and adds the others one by one.

- **The brick house.** [CANVAS_REPLACE](/c0de_paint/cpaint/canvas_replace) draws every `oak_planks` voxel again with the style `bricks`: walls, floor, gables and ridge. The stairs and the door stay oak.
- **The building site.** [CANVAS_MAX](/c0de_paint/cpaint/canvas_min-and-canvas_max) gives the highest corner of the house, the top of its ridge. [CANVAS_CLEAR](/c0de_paint/cpaint/canvas_clear-and-canvas_crop) unsets everything from layer 2 up to there. Two layers stay: the floor and the walls of the ground floor, with the whole door.
- **The façade.** [CANVAS_CROP](/c0de_paint/cpaint/canvas_clear-and-canvas_crop) does the opposite: it unsets everything outside the box from 0, 0, 0 to the corner `b` with `b.z` 0. Only the front row is left, one block thick, like a film set.
- **The hall.** [CANVAS_SCALE](/c0de_paint/cpaint/canvas_scale) with 200 % on all three axes makes every voxel 2 × 2 × 2 voxels. Stairs stay stairs and keep their states, so the roof gets steps of two. A door of 4 blocks doesn't work in Minecraft, though: CANVAS_REPLACE draws the door again with STYLE_EMPTY, and the hall gets an open gateway instead.
- **The turned house.** [CANVAS_ROTATE](/c0de_paint/cpaint/canvas_rotate) turns it by 90° about the `y` axis through 0, 0, 0. +90° turns north to west: the door looks west, and the stairs and the door states turn along. The house now lies at negative `z`, which doesn't matter – `addHouse` finds it.
- **The mirror image.** [CANVAS_MIRROR](/c0de_paint/cpaint/canvas_mirror) mirrors at the plane `z` = -2, in the middle of the road: `z` 0 becomes -4, so the front faces the front of the oak house across the road. The door faces south now, and its hinge is on the right: a mirrored door opens the other way round. CANVAS_MERGE draws the copy into the street where it is.

**Putting a house on its plot.** `addHouse` puts the next house 3 voxels east of the street, whatever was done to it. CANVAS_MAX gives the east end of the street so far, [CANVAS_MIN](/c0de_paint/cpaint/canvas_min-and-canvas_max) the lowest corner of the house. The offset moves that corner to 2 free voxels after the end of the street, to height 0, and to the row `z`: 0 for the houses south of the road, `- width` for the turned house, so that its door lands in the middle of the road. [CANVAS_MOVE](/c0de_paint/cpaint/canvas_move) moves the copy, and [CANVAS_MERGE](/c0de_paint/cpaint/canvas_merge) draws it into the street. Merging only changes the voxels the house sets, so the street stays as it is around it.

**The paths.** `paths` looks at every voxel of the ground layer of the street with [CANVAS_GET](/c0de_paint/cpaint/canvas_get). Its `id` is "" for a voxel that is not set, and `minecraft:oak_door` for the lower half of a door. The `facing` of the door tells which way is out: the HASHes `dx` and `dz` turn it into a step east or south. One voxel further and one down, DRAW_BLOCK puts a dirt path into the ground. Every door gets its path, whichever way the house was turned.

**Building.** RENDER_CANVAS puts the voxel 0, 0, 0 of the street 2 blocks east and 2 blocks south of the trigger block. The road between the two rows is 3 blocks wide: `z` -1 to -3 in the canvas.

The program runner builds the street with houses of 3 × 3 × 3 blocks and compares every block with a list – the doors and stairs included, with all their states.

## Try it yourself

1. Make the other side of the street the mirror image of the whole row, not only of the first house.

::: details Solution
Move the part with CANVAS_MIRROR up, right before the turned house, and mirror the street instead of the house: `ASSIGN copy street ;`. Now the brick house, the building site, the façade and the hall get their mirror images too. The turned house comes afterwards, so it isn't mirrored onto itself, and `paths` finds the new doors without a change, because it reads their `facing`.
:::

2. Give the oak house a brick roof: why doesn't CANVAS_REPLACE of `"oak_stairs"` with a style of `"brick_stairs"` work?

::: details Solution
CANVAS_REPLACE finds the stairs whatever their states are, but it draws the new block with the states of the style. A STYLE_SOLID of `brick_stairs` without `facing` makes all stairs face the same way. Instead, give `house` a parameter `stairs STRING "oak_stairs"` and use it for `block.id` of the stairs; then call `house` a second time with `"brick_stairs"`.
:::

3. Add a tall tower house: scale a copy only upwards, with `x` 100, `y` 200 and `z` 100. What has to happen to the door?

::: details Solution
The same as in the hall: the door becomes two lower and two upper halves, which Minecraft doesn't accept. Replace `"oak_door"` with STYLE_EMPTY after scaling, and the tower gets a doorway 1 block wide and 4 high. Add it with `addHouse`, like the hall.
:::

## Read more

- The functions of this recipe: [CANVAS_MIN and CANVAS_MAX](/c0de_paint/cpaint/canvas_min-and-canvas_max), [CANVAS_GET](/c0de_paint/cpaint/canvas_get), [CANVAS_CLEAR and CANVAS_CROP](/c0de_paint/cpaint/canvas_clear-and-canvas_crop), [CANVAS_MOVE](/c0de_paint/cpaint/canvas_move), [CANVAS_REPLACE](/c0de_paint/cpaint/canvas_replace), [CANVAS_MERGE](/c0de_paint/cpaint/canvas_merge), [CANVAS_SCALE](/c0de_paint/cpaint/canvas_scale), [CANVAS_ROTATE](/c0de_paint/cpaint/canvas_rotate), [CANVAS_MIRROR](/c0de_paint/cpaint/canvas_mirror) and [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas)
- [A first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas): where to start with canvases, styles and RENDER_CANVAS
- [Copying a building](/tutorials/libraries/c0de_paint/cpaint/copying-buildings): the world into a canvas and back, from chests
- [Getting started](/c0de_paint/cpaint/getting-started) with c0de paint, and its [errors](/c0de_paint/cpaint/errors)
- [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide, [WHILE and REPEAT](/c0de/guide/language#while-and-repeat) and [variables and constants](/c0de/guide/language#variables-and-constants), for the HASHes with start values
