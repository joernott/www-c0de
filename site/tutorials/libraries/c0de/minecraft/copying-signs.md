---
description: A copier that reads a block with GET_BLOCK, including its data – the text of a sign, the items of a chest – and places an exact copy somewhere else with PLACE_BLOCK and its parameter data.
---

# Copying signs and chests

A sign with a long text, written by hand – and you need it five times, for every entrance of your base. Or a chest with a starter kit for every new player. A copier reads the block with everything in it and places a copy: the sign with its text, the chest with its items.

**Functions:** [GET_BLOCK](/c0de/minecraft/get_block), [PLACE_BLOCK](/c0de/minecraft/place_block) and [SAY](/c0de/minecraft/say)

::: warning Needs an operator
A copy of a chest with its items creates items out of nothing, so PLACE_BLOCK with `data` only works if the owner of the trigger block is an operator – in the world of the tutorials, you are one. On a server, the administrator can allow it for everybody with `allowBlockChanges=true` in `config/c0de.properties`, which also lets programs place and remove blocks out of nothing; without the right, PLACE_BLOCK raises PERMISSION_DENIED. That's the case even with the parameter `inventory`. Command blocks, structure blocks and jigsaw blocks only an operator may copy with their data, like with `/setblock`. GET_BLOCK always works: every program can read the text of a sign.
:::

::: info What you need

- a **trigger block** with a **button** on it, and an empty sheet for each program
- a **sign** with some text on it, and a **chest** with some items
- for the exercises: a free row of 5 blocks east of the trigger block

:::

## The idea

The ID and the block states (which way a sign faces, whether a chest stands alone) don't make a sign. Its text, the items of a chest, the name of a renamed furnace are kept in the **data** of the block. GET_BLOCK returns it in its result `data` as text, in the form that the commands `/data` and `/setblock` use (SNBT). A chest with twelve cobblestone in its first slot has, for example:

```
{Items:[{Slot:0b,count:12,id:"minecraft:cobblestone"}]}
```

The position is not part of the data, so it fits anywhere. PLACE_BLOCK takes it in its parameter `data` and gives it to the new block. Blocks without such data, like stone, have the data `""` – and PLACE_BLOCK with an empty `data` simply places the block. So the copier copies every block, with or without data.

## The program

<<< @/tutorials/programs/libraries/minecraft/copying-signs-copy.c0de

## Building and running it

1. Place the trigger block and put the button on it.
2. Write a sign and place it on the ground 2 blocks west of the trigger block. Keep the place 2 blocks east of the trigger block free.
3. Set the trigger block to `copier` and `copy`, and press the button.

The copy stands 2 blocks east, facing the same way, with the same text, and the chat shows the data that was copied. Now break the sign and put a chest there – a single one, not a double chest – with a few items. Break the copy of the sign too, and press the button again: the new chest has the same items.

<!-- screenshot: copying-signs-copy | the trigger block with its button between a written sign and its copy, the chat showing the copied data -->

## How it works

- **Three results, one block.** GET_BLOCK returns the `id`, the block states in `properties` and the `data`. PLACE_BLOCK takes all three. Without `properties`, the sign would always face south; without `data`, it would be empty.
- **Nothing to copy.** If the place 2 blocks west is empty, GET_BLOCK returns `minecraft:air`, and the program says so instead of "copying" air.
- **When it doesn't fit.** PLACE_BLOCK only places a block where there is air or something replaceable like grass, otherwise it raises INVALID_ARGUMENT. The CALL catches that in `problem`, and the program says why there is no copy instead of crashing. Without the right, `problem` is PERMISSION_DENIED.
- **Version dependent.** The data has the format of the Minecraft version it was read with; the program only passes it on, so that doesn't matter here. A text kept from an older version may not work in a newer one.
- **A sign on the wall.** A wall sign (`minecraft:oak_wall_sign`) is copied as well, but the copy hangs in the air if there is no wall behind it. Like `/setblock`, PLACE_BLOCK doesn't check that.

## Try it yourself

1. Make five copies in a row, from 2 to 6 blocks east of the trigger block.

::: details Solution
GET_BLOCK only has to read the block once; a FOR loop places the copies. If one doesn't fit, the program stops there. With an INTEGER variable item `copies`, the trigger block makes as many as you want.

<<< @/tutorials/programs/libraries/minecraft/copying-signs-row.c0de

:::

2. On a server where `allowBlockChanges` is on, the copier would copy any chest full of diamonds. Make it copy signs only.

::: details Solution
All sign IDs contain `_sign`: `minecraft:oak_sign`, `minecraft:oak_wall_sign`, `minecraft:spruce_hanging_sign` … The function `isSign` searches for it with [INSTR](/c0de/strings/instr). It needs no world, so the program runner tests it with `minecraft:oak_sign`, `minecraft:spruce_wall_hanging_sign` (both true) and `minecraft:chest` (false).

<<< @/tutorials/programs/libraries/minecraft/copying-signs-only.c0de

:::

## Read more

- The functions of this recipe: [GET_BLOCK](/c0de/minecraft/get_block), [PLACE_BLOCK](/c0de/minecraft/place_block) and [SAY](/c0de/minecraft/say)
- [Building](/tutorials/libraries/c0de/minecraft/building): PLACE_BLOCK with blocks from a chest, for everybody
- [Changing the world](/c0de/guide/libraries#changing-the-world) and [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide
- [Errors](/c0de/guide/language#errors) in the guide: catching an error in a CALL
