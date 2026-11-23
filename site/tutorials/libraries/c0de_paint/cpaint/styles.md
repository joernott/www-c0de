---
description: A wall of mixed stone with STYLE_RANDOM, a sunset in wool with STYLE_GRADIENT, a chequered floor with STYLE_PATTERN, logs with block states, and the blocks of a chest as a palette with INVENTORY_BLOCKS.
---

# Styles

A style decides how a shape is drawn. So far, that was one block. This recipe paints with more: a city wall of stone bricks with moss and cracks in random places, a sunset of wool behind it, a chequered floor, and stripes in the colours of whatever you put into a chest.

**Functions:** [STYLE_RANDOM](/c0de_paint/cpaint/style_random), [STYLE_GRADIENT](/c0de_paint/cpaint/style_gradient), [STYLE_PATTERN](/c0de_paint/cpaint/style_pattern), [STYLE_NONE](/c0de_paint/cpaint/style_none), [STYLE_EMPTY](/c0de_paint/cpaint/style_empty) and [INVENTORY_BLOCKS](/c0de_paint/cpaint/inventory_blocks), and block states in a [BLOCK](/c0de_paint/cpaint/block)

::: warning Needs an operator
These programs call [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas) without `input`, so the blocks come out of nowhere and replace what is in the way. That only works if the owner of the trigger block is an operator, or if the server allows it with `allowBlockChanges=true` in `config/c0de.properties`; otherwise RENDER_CANVAS raises PERMISSION_DENIED. In a single player world with cheats, you are an operator. To build from a chest instead, see [A first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas) and exercise 4.
:::

::: info What you need

- the mods **c0de** and **c0de paint**
- a **trigger block** with a **button** on it, and an empty sheet for each program
- for the palette: a **chest** with a few stacks of blocks, e.g. 64 **sandstone**, 32 **smooth sandstone** and 32 **terracotta**
- free space: 17 blocks wide and 11 high north of the trigger block for the wall and the sunset, and 8 × 8 blocks east of it for the floor

:::

## The idea

Every shape has up to three parts, each with its own style: the lines (`line_style`), the faces (`side_style`) and the inside (`fill_style`). The styles are values like any other: a program makes them with the STYLE functions, keeps them in variables and hands them to the drawing functions. Besides [STYLE_SOLID](/c0de_paint/cpaint/style_solid), there are:

| Style                                               | draws                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| [STYLE_NONE](/c0de_paint/cpaint/style_none)         | nothing: the voxels stay as they are                                   |
| [STYLE_EMPTY](/c0de_paint/cpaint/style_empty)       | air, which removes blocks                                              |
| [STYLE_RANDOM](/c0de_paint/cpaint/style_random)     | a random block of a list for every voxel                               |
| [STYLE_GRADIENT](/c0de_paint/cpaint/style_gradient) | the blocks of a list one after the other, by the distance from a point |
| [STYLE_PATTERN](/c0de_paint/cpaint/style_pattern)   | a small canvas, repeated again and again                               |

## The wall

<<< @/tutorials/programs/libraries/paint/styles-wall.c0de

## Building and running it

Stand behind the trigger block and look north. Set it to `stonewall` and `build`, and press the button. The wall rises 3 blocks north of the trigger block: 13 blocks long, with the trigger block in front of its middle, and 5 high. A gate 3 blocks wide and 3 high goes through its middle.

Press the button again: the wall gets new moss and new cracks every time.

<!-- screenshot: styles-wall | the city wall of stone bricks with mossy and cracked bricks in random places and the gate in its middle, seen from the trigger block -->

## How it works

- **A list of blocks.** `stones` is an ARRAY of BLOCKs. The program fills one BLOCK, `stone`, and copies it into the list three times, with a new id and weight each time.
- **Weights.** [STYLE_RANDOM](/c0de_paint/cpaint/style_random) picks a block for every voxel. A block's chance is its weight divided by the sum: 6 of 10 voxels become plain stone bricks, 3 mossy and 1 cracked – on average.
- **A full box.** The wall is a box 1 voxel thick, drawn with only a `fill_style`. A box without line and side styles is full: lines and faces take the style of the inside.
- **The canvas goes both ways.** The wall runs from `- half` to `half`, so the voxel 0, 0, 0 lies in its middle. RENDER_CANVAS puts this voxel at `site`, right in front of the trigger block, 3 blocks north. Negative coordinates are fine in a canvas.
- **The gate** is a second box from -1 to 1, 3 high, drawn with [STYLE_EMPTY](/c0de_paint/cpaint/style_empty): air replaces the stones there. Air is drawn like a block – when it is built, it removes the block in the world.
- **New every time.** The random numbers come from the process, like RANDOM. Every run draws a different wall.

## The sunset

The second program paints a picture: a sunset in wool, 15 blocks wide and 9 high, in a frame of oak logs.

<<< @/tutorials/programs/libraries/paint/styles-sunset.c0de

Leave the trigger block where it is, set it to `sunset` and `paint`, and press the button. The picture stands 4 blocks north of the trigger block, right behind the wall, so the sun sets in the gate and the sky rises above the wall.

<!-- screenshot: styles-sunset | the wool sunset in its frame of oak logs right behind the city wall, seen from the trigger block: the sun sets in the gate, and the circles of yellow, orange, red, magenta, purple and blue rise above the wall (run `stonewall` with the function `build` from the same trigger block first) -->

- **A gradient.** [STYLE_GRADIENT](/c0de_paint/cpaint/style_gradient) draws the blocks of the list one after the other, by the distance from `from`. `from` is the sun, in the middle of the lowest row of the picture. Without `axes`, the distance is measured in all directions, so on a flat wall the colours form circles around the sun: yellow, orange, red, magenta, purple and blue.
- **The weights** give the share of each colour. Yellow, orange and red have 2, magenta and purple 1, the blue sky 3. Without `to`, the gradient ends at the voxel farthest from the sun, the upper corners.
- **`fuzzy 1`** blurs the borders between the colours: in the row next to a border, a voxel takes the neighbouring colour with a chance of 50 %.
- **Block states.** A log has the state `axis`: `y` stands upright, `x` lies east-west. `log.properties["axis"]` sets it, just like the states of [PLACE_BLOCK](/c0de/minecraft/place_block). The `posts` have no state – an upright log is the default.
- **The frame.** A box with only a `line_style` is just its edges: around a flat picture, that's the rim. Then two boxes overwrite the top and the bottom row with `beams`, except the corners. [CANVAS_MATERIALS](/c0de_paint/cpaint/canvas_materials) would count both kinds of logs as `minecraft:oak_log`: the states don't matter for the materials.

## The floor

<<< @/tutorials/programs/libraries/paint/styles-floor.c0de

Set the trigger block to `floor` and `lay`, and press the button. The floor replaces the ground east of the trigger block: 8 × 8 blocks from 2 blocks east of it, starting in its row and reaching south, in black and white concrete with a border of dark oak planks. For a floor without a border, put a BOOLEAN variable item `border` with `FALSE` into the trigger block.

<!-- screenshot: styles-floor | the chequered floor of black and white concrete, 8 × 8 blocks, with its border of dark oak planks, set into the grass east of the trigger block, seen from above -->

- **The tile.** `tile` is a canvas of its own, 2 × 1 × 2 voxels: a black box with two white voxels on the diagonal, drawn with [DRAW_BLOCK](/c0de_paint/cpaint/draw_block).
- **The pattern.** [STYLE_PATTERN](/c0de_paint/cpaint/style_pattern) repeats the tile along all axes, starting at 0, 0, 0. Every voxel of the floor takes the voxel of the tile at its place.
- **STYLE_NONE on purpose.** Without a border, `edge` becomes [STYLE_NONE](/c0de_paint/cpaint/style_none). A part with STYLE_NONE takes the style of the next part inward, so the edges of the floor get the pattern, too. A new STYLE variable holds STYLE_NONE anyway; the call makes it visible.
- **Into the ground.** `site.y` is one below the trigger block, so the floor lies flush with the ground and replaces grass and dirt.

## The palette

Instead of writing the blocks into the program, take them from a chest. [INVENTORY_BLOCKS](/c0de_paint/cpaint/inventory_blocks) reads them: in the order of the slots, with the number of items as weight – a list ready for STYLE_RANDOM and STYLE_GRADIENT.

<<< @/tutorials/programs/libraries/paint/styles-palette.c0de

Move the trigger block to a free place and put the chest 2 blocks west of it, with 64 sandstone in the first slot, 32 smooth sandstone in the second and 32 terracotta in the third. Set the trigger block to `palette` and `build`, and press the button. A wall 16 blocks long and 4 high appears 2 blocks east of the trigger block, in stripes: 8 blocks of sandstone, 4 of smooth sandstone, 4 of terracotta, with blurred borders. The chest keeps its blocks; it is only the palette.

<!-- screenshot: styles-palette | the open chest with sandstone, smooth sandstone and terracotta in its first three slots, and the striped wall 16 blocks long beside it, sandstone fading to smooth sandstone and terracotta from west to east -->

- **Two functions.** `build` reads the chest and hands the list to `show`, which draws and builds. `show` works with any list of blocks, so it can be tried without a chest, too.
- **Stripes.** `axes "x"` measures the distance from `a` only along x, so all voxels of a column have the same distance: the gradient becomes vertical stripes. The 128 items share the 16 blocks of the wall: 64 sandstone get half of them.
- **Your own palette.** Change the order of the slots, and the stripes change their order. Wool, concrete or glass in many colours make a rainbow.

## Try it yourself

1. The wall is getting old: more moss, and here and there a block of cobblestone.

::: details Solution
Give `mossy_stone_bricks` a weight of 5, and add a fourth block:

```c0de
ASSIGN stone.id "cobblestone" ;
ASSIGN stone.weight 1 ;
ASSIGN stones[3] stone ;
```

Now the weights add up to 13: 6 of 13 voxels are plain stone bricks, 5 mossy, 1 cracked and 1 cobblestone.
:::

2. Paint the sky in horizontal bands instead of circles.

::: details Solution
Add `PARAMETER axes "y" ;` to STYLE_GRADIENT. Now only the height counts: the row of the sun is yellow, and the colours follow in layers up to the blue at the top.
:::

3. A parquet floor: stripped oak logs, lying alternately east-west and north-south, like the squares of the chequered floor.

::: details Solution
The tile has two styles of the same block with different states: `axis` `x` lies east-west, `z` north-south.

<<< @/tutorials/programs/libraries/paint/styles-parquet.c0de

:::

4. Build the palette wall from the chest itself, with STYLE_RANDOM instead of the gradient. Does it always work?

::: details Solution
Replace the STYLE_GRADIENT call with

```c0de
CALL c0de_paint/cpaint/STYLE_RANDOM
    PARAMETER blocks palette ;
    RESULT result stripes
```

Then give `show` a third parameter `chest`, which `build` passes on, and RENDER_CANVAS the line `PARAMETER input chest ;`, like the shed of [A first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas). Now the wall takes its 64 blocks from the chest. With 128 items for 64 blocks, there is nearly always enough of each. But fill the chest with exactly 64 items, and the random blocks don't match it: where the chest has 32 sandstone, one run wants 35, the next 29. RENDER_CANVAS checks the chest before the first block and raises ITEM_MISSING when a block is short – without placing a single one. A gradient without `fuzzy` has no such surprises: its stripes always have the same width.
:::

## Read more

- The functions of this recipe: [STYLE_RANDOM](/c0de_paint/cpaint/style_random), [STYLE_GRADIENT](/c0de_paint/cpaint/style_gradient), [STYLE_PATTERN](/c0de_paint/cpaint/style_pattern), [STYLE_NONE](/c0de_paint/cpaint/style_none), [STYLE_EMPTY](/c0de_paint/cpaint/style_empty), [INVENTORY_BLOCKS](/c0de_paint/cpaint/inventory_blocks), [DRAW_BOX](/c0de_paint/cpaint/draw_box), [DRAW_BLOCK](/c0de_paint/cpaint/draw_block) and [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas)
- The types [STYLE](/c0de_paint/cpaint/style) and [BLOCK](/c0de_paint/cpaint/block), with weights and block states
- [A first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas): building from a chest, for every player
- [Getting started](/c0de_paint/cpaint/getting-started) with c0de paint, and its [errors](/c0de_paint/cpaint/errors)
- [Changing the world](/c0de/guide/libraries#changing-the-world) and [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide
