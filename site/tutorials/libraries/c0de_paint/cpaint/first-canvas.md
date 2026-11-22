---
description: A garden shed drawn with DRAW_BOX into a canvas and built with RENDER_CANVAS from the blocks of a chest, and the list of blocks it needs with CANVAS_MATERIALS and CANVAS_COUNT.
---

# A first canvas

A program as an architect: it draws a garden shed of oak planks with posts of oak logs, and then builds it from the blocks of a chest, for every player. Before you fill the chest, a laptop tells you what the shed needs.

**Functions:** [DRAW_BOX](/c0de_paint/cpaint/draw_box), [STYLE_SOLID](/c0de_paint/cpaint/style_solid), [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas), [CANVAS_MATERIALS](/c0de_paint/cpaint/canvas_materials) and [CANVAS_COUNT](/c0de_paint/cpaint/canvas_count), with the types [CANVAS](/c0de_paint/cpaint/canvas), [POINT](/c0de_paint/cpaint/point), [BLOCK](/c0de_paint/cpaint/block) and [STYLE](/c0de_paint/cpaint/style)

::: info What you need

- the mods **c0de** and **c0de paint**
- a **trigger block** with a **button** on it, and an empty sheet for the program
- a **chest** with **36 oak logs** and **30 oak planks**
- a **laptop** for the list of blocks
- a flat place of 5 × 4 blocks, free of tall grass and flowers
- no rights: the shed is built from the chest, like a player builds from their inventory

:::

## The idea

The functions of c0de/minecraft place one block at a time. c0de paint works like a drawing program instead: you draw into a **canvas**, a grid of voxels in three dimensions, and the canvas is built in the world in one go. The canvas is only in the program – nothing happens in the world until RENDER_CANVAS.

Four kinds of values do the drawing:

- a [CANVAS](/c0de_paint/cpaint/canvas) holds the drawing. A new variable holds an empty canvas, and it grows with whatever you draw.
- a [POINT](/c0de_paint/cpaint/point) is a voxel of the canvas, with `x` (east), `y` (up) and `z` (south). A new POINT is 0, 0, 0.
- a [BLOCK](/c0de_paint/cpaint/block) names a Minecraft block by its `id`, like `"oak_planks"`.
- a [STYLE](/c0de_paint/cpaint/style) says how something is drawn. [STYLE_SOLID](/c0de_paint/cpaint/style_solid) makes one: always the same block.

[DRAW_BOX](/c0de_paint/cpaint/draw_box) draws a box between two corners. It has three styles: `line_style` for its 12 edges, `side_style` for its six faces and `fill_style` for the inside. A shed is a box with planks on its faces, logs on its edges and nothing inside.

## The shed

<<< @/tutorials/programs/libraries/paint/first-canvas-shed.c0de

## Building and running it

1. Place the trigger block with the button 2 blocks west of where the shed should stand.
2. Place the chest 2 blocks west of the trigger block, and put the oak logs and planks into it.
3. Set the trigger block to `shed` and `build`, and press the button.

The shed takes the 5 × 4 blocks from 2 to 6 blocks east of the trigger block and from the trigger block's row to 3 blocks south of it. It is 4 blocks high, with a floor of planks, and its doorway in the west wall faces the trigger block. The chest is empty afterwards.

<!-- screenshot: first-canvas-shed | the finished garden shed, 5 × 4 blocks and 4 high, oak planks with oak logs on all edges, its doorway in the west wall, the trigger block with its button 2 blocks west of it and the chest 2 blocks further west -->

## How it works

- **`draw` only draws.** It gets the size, gives back the canvas as its `result`, and doesn't touch the world. `build` builds the canvas, `materials` counts it – both call `draw`, so they always agree on the shed.
- **The two styles.** Every STYLE_SOLID gets a BLOCK. The id `"oak_planks"` has no namespace, so it becomes `minecraft:oak_planks`.
- **The box.** `a` stays 0, 0, 0; `b` is the opposite corner, `width - 1` east, `height - 1` up and `depth - 1` south. A box from 0 to 4 is 5 voxels long. There is no `fill_style`, so the inside isn't drawn at all: whatever is there in the world stays.
- **The drawing functions change the canvas.** DRAW_BOX gets `canvas result`, the canvas of `draw`, and draws into it, like INPUT stores in its variable.
- **The doorway** is a second box, 1 voxel wide and 2 high, in the west wall, drawn with [STYLE_EMPTY](/c0de_paint/cpaint/style_empty): air. It overwrites the planks there. When the shed is built, air means "no block here".
- **Building.** [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas) puts the voxel 0, 0, 0 of the canvas at `site`, 2 blocks east of the trigger block. With `input`, it takes the blocks from the chest. Before the first block, it checks that the chest has all of them, so a missing plank doesn't leave half a shed: the program crashes with ITEM_MISSING, and nothing is built. Blocks that are already in place are skipped, so pressing the button again does no harm.
- **Without `input`**, RENDER_CANVAS creates the blocks out of nowhere and replaces whatever is in the way. That needs `allowBlockChanges` on the server or an operator as owner, like REMOVE_BLOCK.

## The list of blocks

How many logs, how many planks? You don't have to count: the second function of the program, `materials`, prints the list on a laptop. Bind the laptop to `shed` / `materials`, switch the trigger block to the same function and press the button. The laptop shows

```
The shed needs:
36 minecraft:oak_log
30 minecraft:oak_planks
68 voxels in all
```

<!-- screenshot: first-canvas-list | the laptop screen with the list "The shed needs:", "36 minecraft:oak_log", "30 minecraft:oak_planks" and "68 voxels in all", the trigger block and the chest next to it -->

- **[CANVAS_MATERIALS](/c0de_paint/cpaint/canvas_materials)** gives a HASH from block id to number: exactly what the chest must hold. EACH goes through its keys in alphabetical order.
- **[CANVAS_COUNT](/c0de_paint/cpaint/canvas_count)** counts the set voxels: 68, but the list only adds up to 66. The two missing voxels are the air of the doorway – a set voxel, but no block you need. CANVAS_MATERIALS leaves air out.

## Try it yourself

1. Put a window of glass into the east wall, opposite the door: 2 blocks at eye height.

::: details Solution
A third box, from `width - 1`, 2, 1 to `width - 1`, 2, `depth - 2`, with a STYLE_SOLID of glass. It overwrites two planks, so the chest needs 2 glass and only 28 planks.

<<< @/tutorials/programs/libraries/paint/first-canvas-window.c0de

:::

2. Your horse wants a stable: make the shed 7 blocks wide, 5 deep and 5 high. How many logs and planks does it need?

::: details Solution
No new code: put the INTEGER variable items `width` 7, `depth` 5 and `height` 5 into the trigger block, for `materials` and then for `build`. The laptop says 52 oak logs and 76 oak planks, 130 voxels in all.
:::

3. Take 5 planks out of the chest and press the button. What happens – and what stays in the world?

::: details Solution
The program crashes with ITEM_MISSING, and the trigger block's dialog shows the error. Not a single block is placed: RENDER_CANVAS checks the chest before the first block. Put the planks back and press again.
:::

## Read more

- The functions of this recipe: [DRAW_BOX](/c0de_paint/cpaint/draw_box), [STYLE_SOLID](/c0de_paint/cpaint/style_solid), [STYLE_EMPTY](/c0de_paint/cpaint/style_empty), [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas), [CANVAS_MATERIALS](/c0de_paint/cpaint/canvas_materials) and [CANVAS_COUNT](/c0de_paint/cpaint/canvas_count)
- The types [CANVAS](/c0de_paint/cpaint/canvas), [POINT](/c0de_paint/cpaint/point), [BLOCK](/c0de_paint/cpaint/block) and [STYLE](/c0de_paint/cpaint/style)
- [Getting started](/c0de_paint/cpaint/getting-started) with c0de paint, and its [errors](/c0de_paint/cpaint/errors)
- [Styles](/tutorials/libraries/c0de_paint/cpaint/styles): random blocks, gradients and patterns
- [Building](/tutorials/libraries/c0de/minecraft/building): a wall block by block with PLACE_BLOCK
- [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide, [EACH loops](/c0de/guide/language#each-loops) and the [laptop](/c0de/reference/devices#laptop)
