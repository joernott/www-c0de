---
description: A tunnel digger that breaks a tunnel of any length with MINE_BLOCK, using the tools of one chest and putting the drops into another, and that stops before water, lava and bedrock.
---

# A tunnel digger

A program as a miner: it digs a tunnel two blocks high straight into the hill, with the pickaxes from a chest, and puts all the cobblestone and ore into another chest. It stops by itself when it hits water, lava or bedrock.

**Functions:** [MINE_BLOCK](/c0de/minecraft/mine_block), [GET_BLOCK](/c0de/minecraft/get_block), [SAY](/c0de/minecraft/say) and, in exercise 1, [PLACE_BLOCK](/c0de/minecraft/place_block)

::: info What you need

- a **trigger block** with a **button** on it, and an empty sheet for each program
- two **chests**; in one, a few **pickaxes** and **shovels**
- a hill or a cliff to dig into
- no rights: MINE_BLOCK only does what a player can do, so it works for every owner on every server

:::

## The idea

MINE_BLOCK breaks a block like a player. It picks the best tool from `tool_inventory`, a pickaxe for stone and a shovel for dirt, and the tool wears out as if a player used it. The program waits as long as a player would need to break the block. The drops go into `output_inventory`. If they don't fit, MINE_BLOCK raises INVENTORY_FULL, and the block stays.

Before each block, the program has to decide: mine it, skip it (it is air already, in a cave), or stop (water, lava, bedrock). That decision is pure computation – a block ID goes in, an action comes out – so it gets a function of its own, which you can test without a hill.

## The decision

<<< @/tutorials/programs/libraries/minecraft/tunnel-digger-rules.c0de

The program runner checks `decide` with `minecraft:stone` (`mine`), `minecraft:cave_air` (`skip`) and `minecraft:lava` (`stop`).

## The digger

<<< @/tutorials/programs/libraries/minecraft/tunnel-digger-dig.c0de

## Building and running it

1. Place the trigger block on the ground facing a hill to the east, with one free block between it and the hill. The tunnel starts 2 blocks east of the trigger block and runs east, at the height of the trigger block and one block above.
2. Place the chest with the tools 2 blocks north of the trigger block, and the empty chest for the drops 2 blocks south.
3. Set the trigger block to `tunneldigger` and `dig`, and press the button.

Block by block, the tunnel eats into the hill, and the drops chest fills with cobblestone, dirt and whatever ore was in the way. After ten blocks, the chat says `The tunnel is 10 blocks long.`

<!-- screenshot: tunnel-digger-tunnel | the entrance of the tunnel in the side of a hill, two blocks high, the trigger block in front of it, the tools chest on the left and the open drops chest on the right with cobblestone and coal -->

## How it works

- **Two blocks per step.** The outer loop counts the steps into the hill, the inner one the two heights, `dy` 0 and 1.
- **Look first.** GET_BLOCK reads the ID, and `decide` says what to do. Air is skipped, because there is nothing to mine. Water, lava and bedrock end the run: MINE_BLOCK can't mine them anyway, and a tunnel that runs into lava is better stopped.
- **When things go wrong.** The CALL of MINE_BLOCK catches errors in `problem`. A full drops chest gives INVENTORY_FULL; then the program says how far it came and stops.
- **Worn-out tools.** When the last pickaxe breaks, MINE_BLOCK goes on with bare hands. That's slow, and stone mined with bare hands drops nothing. Keep an eye on the tools chest.
- **A longer tunnel.** `length` has the default value 10. Put an INTEGER variable item `length` with 30 into the trigger block for a tunnel of 30 blocks. It takes a while: each stone block takes as long as for a player.

## Try it yourself

1. Light the tunnel: after every sixth step, place a torch from the tools chest on the floor of the tunnel.

::: details Solution
PLACE_BLOCK with `inventory tools` takes the torch from the tools chest, so it works for every owner, too. Its own ERROR variable `noTorch` catches ITEM_MISSING when the torches are used up; the tunnel goes on in the dark.

<<< @/tutorials/programs/libraries/minecraft/tunnel-digger-torches.c0de

:::

2. Make the digger also stop at gravel and sand, which could fall into the tunnel.

::: details Solution
Add another IF to `decide`: `id = "minecraft:gravel" OR id = "minecraft:sand"` gives `"stop"`. Since `decide` is a function of its own, that's the only change – and a test with `minecraft:gravel` shows it works.
:::

## Read more

- The functions of this recipe: [MINE_BLOCK](/c0de/minecraft/mine_block), [GET_BLOCK](/c0de/minecraft/get_block), [PLACE_BLOCK](/c0de/minecraft/place_block) and [SAY](/c0de/minecraft/say)
- [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide: why MINE_BLOCK works for everybody
- [Building](/tutorials/libraries/c0de/minecraft/building): PLACE_BLOCK from a chest
- [Errors](/c0de/guide/language#errors) in the guide: catching an error in a CALL
