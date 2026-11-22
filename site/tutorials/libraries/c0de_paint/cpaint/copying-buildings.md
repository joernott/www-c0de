---
description: A copy machine for buildings that reads a building into a canvas with CANVAS_FROM_WORLD and builds it again further away, turned if you like, with RENDER_CANVAS from the blocks of one chest, the tools of a second and a third chest for what's in the way.
---

# Copying a building

A program as a copy machine: it reads a building block by block into a canvas and builds it a second time, 12 blocks further east – facing the same way, or turned. The blocks for the copy come from a chest, whatever is in the way is mined with the tools from a second chest, and it all ends up in a third. That's how a player would do it, so it works for every player on every server.

**Functions:** [CANVAS_FROM_WORLD](/c0de_paint/cpaint/canvas_from_world) and [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas) with `input`, `tools` and `output`, with [CANVAS_ROTATE](/c0de_paint/cpaint/canvas_rotate), [CANVAS_MIN](/c0de_paint/cpaint/canvas_min-and-canvas_max) and, in exercise 1, [CANVAS_MATERIALS](/c0de_paint/cpaint/canvas_materials)

::: info What you need

- the mods **c0de** and **c0de paint**
- a **trigger block** with a **button** on it, and an empty sheet for each program
- a small **building** to copy, up to 7 × 7 blocks and 6 high – a hut, a fountain, a statue
- three **chests**: one for the **blocks** of the copy, one with **tools** (a pickaxe, a shovel and an axe) and an empty one for what's mined
- for the test run: **42 cobblestone** and **1 cobblestone stairs**
- free ground of 7 × 7 blocks for the copy, from 14 to 20 blocks east of the trigger block
- no rights: with `input`, RENDER_CANVAS only does what a player can do

:::

## The idea

[CANVAS_FROM_WORLD](/c0de_paint/cpaint/canvas_from_world) is the opposite of RENDER_CANVAS: it reads the blocks of the world between two corners into a new canvas, with their states – the stairs keep their `facing`, the doors their hinge. The corner `from` becomes the voxel 0, 0, 0. With `air TRUE`, air becomes air in the canvas, not an unset voxel. The copy then clears what's inside the building, too.

The canvas can then go anywhere: [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas) puts its voxel 0, 0, 0 at `position`. With `input`, it doesn't make blocks out of nowhere:

- the blocks come from the inventory `output` first, then from `input`;
- a block in the way is mined with the tools of `tools`, which take damage, and what it drops goes to `output`;
- before the first block, RENDER_CANVAS checks everything: the chunks (CHUNK_NOT_LOADED), the blocks in the chests (ITEM_MISSING) and a tool for every block that needs one. A missing block doesn't leave half a copy.

Reading the world only works in the game: the program runner has no world. So the program has two parts. `place` turns a canvas, finds its corner and builds it – it doesn't care where the canvas comes from. `copy` reads the canvas from the world and hands it to `place`. And `sample` draws a little hut and hands it to `place` too: a test run for the chests, and for the program runner.

## The copy machine

<<< @/tutorials/programs/libraries/paint/copying-buildings-copier.c0de

The program runner checks `copy`, which stops at CANVAS_FROM_WORLD with INVALID_ARGUMENT, and `sample` without and with `turn` 90: it compares every block of the hut with a list, including the step.

## Building and running it

1. Pick a building. Place the trigger block with the button 2 blocks west of its north-west corner, on the same ground. The program copies the 7 × 7 blocks from 2 to 8 blocks east of the trigger block and from the trigger block's row to 6 blocks south, from the trigger block's height up to 5 blocks above it.
2. Place the three chests: the one for the blocks 2 blocks north of the trigger block, the one with the tools 2 blocks west, the empty one 2 blocks south.
3. First the test run: put the cobblestone and the cobblestone stairs into the blocks chest. Set the trigger block to `copier` and `sample`, and press the button. A little cobblestone hut appears 14 blocks east of the trigger block, with a step in front of its doorway on the north side.
4. Leave the hut where it is: it stands where the copy will stand, so the copy mines it away, and its cobblestone ends up in the chest in the south.
5. Now the building: fill the blocks chest with everything the building is made of (exercise 1 tells you what that is). Switch the function to `copy`, and press the button.

The copy grows from the bottom to the top. Whatever is in the way – the test hut, tall grass, a flower – is mined and ends up in the chest in the south. To get the copy turned, put an INTEGER variable item `turn` with 90, 180 or 270 into the trigger block.

<!-- screenshot: copying-buildings-copy | a small house with a door and stairs on the left, its copy turned by 90° on the right, the trigger block in front of the original with the three chests around it, the south chest open with grass and dirt in it -->

## How it works

- **The region.** `copy` computes the two corners from the trigger block: `from` 2 blocks east of it at its height, `to` `width - 1`, `height - 1` and `depth - 1` further. `width`, `height` and `depth` have defaults, so a bigger building only needs variable items with the same names.
- **Air too.** `air TRUE` copies the air of the region as well. Air voxels make RENDER_CANVAS mine whatever stands in the copy's way – also inside the building. Without it, the copy would only add blocks, and the grass inside would stay.
- **What isn't copied.** CANVAS_FROM_WORLD copies blocks and their states, but not the contents of chests and other block data: a chest in the building is copied empty, and a sign without its text. `from` becomes the voxel 0, 0, 0, and a canvas ends at the voxel 127 by default (the setting `canvasMax`), so a region of more than 128 blocks on one axis raises CANVAS_LIMIT.
- **Turning.** `place` turns a copy of the canvas with [CANVAS_ROTATE](/c0de_paint/cpaint/canvas_rotate) about the `y` axis through 0, 0, 0. Stairs, doors, torches on walls and logs turn along. With `turn` 0, nothing changes.
- **Back to the corner.** After turning, the building lies at negative `x` or `z`. [CANVAS_MIN](/c0de_paint/cpaint/canvas_min-and-canvas_max) gives its lowest corner `low`, and the program subtracts it from the position: whichever way it is turned, the lowest corner lands `distance` blocks east of the corner of the original.
- **The three chests.** `blocks`, `tools` and `rubble` are the positions of the chests, 2 blocks north, west and south of the trigger block. RENDER_CANVAS takes the blocks from `rubble` first, then from `blocks`: a dirt block that was mined can go straight back into the copy.
- **When things go wrong.** The program doesn't catch errors: the trigger block's dialog shows them. ITEM_MISSING says which block is missing, and nothing is built yet. A tool that breaks or a full `rubble` chest (INVENTORY_FULL) stops the copy halfway; the message says how many blocks were placed, and pressing the button again goes on, because blocks that are in place are skipped. Bedrock in the way, the spawn protection or a sheet raise PERMISSION_DENIED.

## Try it yourself

1. Before you fill the chest: let a second program say in the chat which blocks the copy needs, and how many.

::: details Solution
[CANVAS_MATERIALS](/c0de_paint/cpaint/canvas_materials) gives a HASH from block id to number, without air. The program reads the same region as `copy`, so put it on a second sheet and its trigger block where the copier's trigger block is – or simply switch the copier's trigger block to `copylist` and `list` for a moment.

<<< @/tutorials/programs/libraries/paint/copying-buildings-list.c0de

:::

2. Make a mirror image of the building instead of a turned copy.

::: details Solution
Replace CANVAS_ROTATE in `place` with [CANVAS_MIRROR](/c0de_paint/cpaint/canvas_mirror) with `axis "x"`. Without `position`, it mirrors at the middle of the bounds, so the canvas stays where it is. Doors get their hinge on the other side, and stairs that faced east face west.
:::

3. Put a chest with a few items into the building and copy it. What's in the copied chest?

::: details Solution
Nothing: CANVAS_FROM_WORLD copies the chest block, with its `facing`, but not what's inside. A copy machine for items would be a little too good.
:::

## Read more

- The functions of this recipe: [CANVAS_FROM_WORLD](/c0de_paint/cpaint/canvas_from_world), [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas), [CANVAS_ROTATE](/c0de_paint/cpaint/canvas_rotate), [CANVAS_MIN and CANVAS_MAX](/c0de_paint/cpaint/canvas_min-and-canvas_max), [CANVAS_MATERIALS](/c0de_paint/cpaint/canvas_materials) and [CANVAS_MIRROR](/c0de_paint/cpaint/canvas_mirror)
- [Shaping canvases](/tutorials/libraries/c0de_paint/cpaint/shaping-canvases): moving, turning, mirroring and scaling a canvas
- [A first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas): where to start with canvases, and building from a chest
- [Getting started](/c0de_paint/cpaint/getting-started) with c0de paint, its settings, and its [errors](/c0de_paint/cpaint/errors)
- [A tunnel digger](/tutorials/libraries/c0de/minecraft/tunnel-digger): tools from one chest, drops into another, with MINE_BLOCK
- [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide: why `input` works for everybody
