---
description: An item sorter that reads an input chest with GET_INVENTORY and moves every item into the chest for its kind with MOVE_ITEMS, and a trash can that empties itself with DELETE_ITEMS.
---

# Sorting the storage

Throw everything you bring home into one chest, and a program sorts it: building blocks into one chest, food into another. What it doesn't know stays in the input chest. Next to it stands a trash can that empties itself.

**Functions:** [GET_INVENTORY](/c0de/minecraft/get_inventory), [MOVE_ITEMS](/c0de/minecraft/move_items), [DELETE_ITEMS](/c0de/minecraft/delete_items), and [SAY](/c0de/minecraft/say)

::: warning Needs an operator
MOVE_ITEMS and DELETE_ITEMS move items without a player, so they only work if the owner of the timer block is an operator. In the world of the tutorials, you are one. On a server, the administrator can allow them for everybody with `allowInventoryChanges=true` in `config/c0de.properties`; without that right, the program crashes with PERMISSION_DENIED. There is no way around it for everyone, but GET_INVENTORY always works: a program can still tell you what is in a chest, and hoppers can do simple sorting without a program.
:::

::: info What you need

- two **timer blocks** and an empty sheet for each program
- four **chests** and a **hopper**
- a few stacks of cobblestone, dirt, bread, apples, and something else, like diamonds

:::

## The idea

GET_INVENTORY gives the content of a chest as an array of ITEM_STACK structs, one per slot: each has an `id`, like `minecraft:bread`, and a `count`. An empty slot has the id `""` and the count 0.

MOVE_ITEMS moves up to `count` items with an `id` from one inventory to another and says how many it moved – fewer if the target is full. DELETE_ITEMS removes items for good.

What goes where is a decision of its own, and it's pure computation: an item ID goes in, a chest number comes out. That part is easy to test without any chest.

## The rules

<<< @/tutorials/programs/libraries/minecraft/sorting-rules.c0de

`chestFor` gives 1 for building blocks, 2 for food and 0 for everything else. The program runner checks it with `minecraft:dirt` (1), `minecraft:bread` (2) and `minecraft:diamond` (0).

## The sorter

<<< @/tutorials/programs/libraries/minecraft/sorting-sorter.c0de

## Building and running it

Put everything in a row from west to east:

| What                    | Where, seen from the timer block |
| ----------------------- | -------------------------------- |
| the input chest         | 2 blocks east                    |
| chest 1, building blocks | 4 blocks east                   |
| chest 2, food           | 6 blocks east                    |

Leave a block free between them: two chests side by side join into a double chest. The input chest doesn't touch the timer block either, or the timer block would use it as its output. Put the hopper on top of the input chest, so you can throw items in from above.

Set the timer block to `sorter` and `sort`, with an interval of 100 ticks. Throw cobblestone, bread and a diamond into the hopper: within five seconds, the cobblestone is in chest 1, the bread in chest 2, and the diamond stays in the input chest.

<!-- screenshot: sorting-chests | the row of chests seen from the side, the hopper on the input chest, the timer block to the west, and the open food chest with bread and apples -->

## How it works

- **EACH slot.** The loop goes through all 27 slots of the input chest. For an empty slot, `chestFor` gives 0, like for an unknown item, and nothing happens.
- **The target** is a copy of the input position whose `x` moves 2 blocks east per chest number: `input.x + 2 * chest`. A third chest would simply be 2 blocks further.
- **A full chest.** MOVE_ITEMS returns how many items it moved. If that's fewer than the slot held, the target is full, and the chat says so. The rest stays in the input chest and is tried again in the next run.

## The trash can

The second program is a chest that eats everything you put into it.

<<< @/tutorials/programs/libraries/minecraft/sorting-trash.c0de

Place a chest 2 blocks east of the second timer block, set the timer block to `trashcan` and `empty` with an interval of 200 ticks, and put rotten flesh into the chest. Within ten seconds it's gone, and the chat tells how many items were eaten. DELETE_ITEMS returns how many it removed, like MOVE_ITEMS.

## Try it yourself

1. Let the sorter delete rotten flesh and poisonous potatoes right away, instead of keeping them in the input chest.

::: details Solution
A third list, `junk`, for which `chestFor` gives -1. The sorter calls DELETE_ITEMS for those slots instead of MOVE_ITEMS.

<<< @/tutorials/programs/libraries/minecraft/sorting-junk.c0de

:::

2. Everything unknown should go into a chest 3, 8 blocks east of the timer block, instead of staying in the input chest.

::: details Solution
Start `chestFor` with `ASSIGN chest 3 ;`. The two lists then overwrite it for the known items. Empty slots get 3 too, but `slot.count > 0` skips them.
:::

## Read more

- The functions of this recipe: [GET_INVENTORY](/c0de/minecraft/get_inventory), [MOVE_ITEMS](/c0de/minecraft/move_items), [DELETE_ITEMS](/c0de/minecraft/delete_items) and [SAY](/c0de/minecraft/say)
- [Changing the world](/c0de/guide/libraries#changing-the-world) and [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide
- [Programs in the world](/tutorials/programmers/world): who may do what, and why a chest next to a trigger block becomes its output
- [EACH loops](/c0de/guide/language#each-loops) in the guide
