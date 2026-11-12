---
description: A wall and a tower built with PLACE_BLOCK from the blocks of a chest, which works for every player, and the tower pulled down again with REMOVE_BLOCK.
---

# Building

A program as a builder: it takes stone bricks from a chest and puts up a wall of any length and height, layer by layer. A second program builds a hollow tower – and pulls it down again.

**Functions:** [PLACE_BLOCK](/c0de/minecraft/place_block), [REMOVE_BLOCK](/c0de/minecraft/remove_block), [GET_BLOCK](/c0de/minecraft/get_block) and [SAY](/c0de/minecraft/say)

::: warning Needs an operator – partly
PLACE_BLOCK with the parameter `inventory` takes each block from a chest, just like a player places blocks from their inventory. That works for every owner, on every server: the wall and the tower are built for everybody. REMOVE_BLOCK makes blocks disappear without a player, so it only works if the owner of the trigger block is an operator, or if the server allows it with `allowBlockChanges=true` in `config/c0de.properties`; otherwise it raises PERMISSION_DENIED. For everybody, MINE_BLOCK pulls the tower down instead (exercise 2).
:::

::: info What you need

- a **trigger block** with a **button** on it, and an empty sheet for each program
- a **chest** with two stacks of **stone bricks**, and one with a stack of **cobblestone**
- a flat place of about 10 × 5 blocks

:::

## The idea

PLACE_BLOCK puts a block with an `id` at a position that holds air or something replaceable like grass. Without `inventory`, the block comes out of nowhere – that's why it needs the right. With `inventory`, it is taken from the chest, and if the chest has none left, PLACE_BLOCK raises ITEM_MISSING.

A wall is a rectangle of positions: a loop over the layers, and inside it a loop along the wall.

## The wall

<<< @/tutorials/programs/libraries/minecraft/building-wall.c0de

## Building and running it

1. Place the trigger block where the wall should start, and put the button on it.
2. Place the chest with the stone bricks 2 blocks west of it.
3. Set the trigger block to `wallbuilder` and `wall`, and press the button.

The wall grows from 2 blocks east of the trigger block, 8 blocks long and 3 high, one block per few ticks.

<!-- screenshot: building-wall | the finished wall of stone bricks, 8 blocks long and 3 high, with the trigger block and its button in front of its west end and the chest 2 blocks west of it -->

## How it works

- **Parameters with default values.** `length`, `height` and `material` have defaults, so the trigger block needs no items. To build a different wall, put an INTEGER variable item `length` or a STRING variable item `material` into the trigger block.
- **The loops.** The outer loop counts the layers from the bottom, the inner one the blocks along the wall. `spot.z` never changes: the wall runs straight east.
- **When things go wrong.** If the chest runs empty, PLACE_BLOCK raises ITEM_MISSING; if something is in the way, INVALID_ARGUMENT. The CALL catches the error in `problem`. Instead of crashing, the program says what happened and stops with RETURN – the wall stays as far as it got.

## The tower

The second program has two entry functions: `build` puts up a hollow tower of cobblestone, 3 × 3 blocks and 6 high, and `pullDown` removes it again.

<<< @/tutorials/programs/libraries/minecraft/building-tower.c0de

Again, the chest stands 2 blocks west of the trigger block; the tower takes the 3 × 3 blocks from 2 to 4 blocks east and from 1 block north to 1 block south. Set the trigger block to `towerbuilder` and `build`, and press the button. To pull it down, switch the function in the dialog to `pullDown` and press the button again.

<!-- screenshot: building-tower | the hollow cobblestone tower, 6 blocks high, half pulled down from the top, cobblestone items lying around it, the trigger block and the chest in front of it -->

- **The ring.** Three loops go through the layers and the 3 × 3 positions of each layer. `dx ≠ 1 OR dz ≠ 1` leaves out the middle, so the tower is hollow.
- **From the top.** `pullDown` counts the layers down with the step -1. A tower that loses its bottom first would look odd for a while.
- **Only its own blocks.** Before REMOVE_BLOCK, GET_BLOCK checks that there is cobblestone. If you put a door into the tower, the program leaves it alone.
- **`drop TRUE`:** every removed block falls on the ground as an item, as if it was mined. With `FALSE`, it simply disappears.
- **No catching here.** If the chest runs empty, `build` crashes with ITEM_MISSING – the trigger block's dialog shows the error. Compare with the wall, which catches it.

## Try it yourself

1. Give the wall windows: in the middle layer, leave out every third block.

::: details Solution
`i \ 3 ≠ 1` is true for all blocks except the 2nd, 5th, 8th …; in the middle layer (`row` 1), only these get a block.

<<< @/tutorials/programs/libraries/minecraft/building-windows.c0de

:::

2. Pull the tower down without any rights: break it with MINE_BLOCK and a pickaxe from the chest, and put the cobblestone back into the chest.

::: details Solution
Put a pickaxe into the chest. MINE_BLOCK takes it as `tool_inventory` and puts the drops into the same chest as `output_inventory`. It takes as long as a player would need, and the pickaxe wears out.

<<< @/tutorials/programs/libraries/minecraft/building-mine.c0de

:::

## Read more

- The functions of this recipe: [PLACE_BLOCK](/c0de/minecraft/place_block), [REMOVE_BLOCK](/c0de/minecraft/remove_block), [GET_BLOCK](/c0de/minecraft/get_block), [MINE_BLOCK](/c0de/minecraft/mine_block) and [SAY](/c0de/minecraft/say)
- [Changing the world](/c0de/guide/libraries#changing-the-world) and [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide
- [Drawing a circle](/tutorials/libraries/c0de/math/circle), another builder with PLACE_BLOCK
- [Errors](/c0de/guide/language#errors) in the guide: catching an error in a CALL
