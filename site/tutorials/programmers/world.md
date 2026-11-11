---
description: How c0de programs live in the world – processes, PIDs and the cursor, trigger, timer and debug trigger blocks, items as the interface, pipelines with hoppers, locked sheets, owners, permissions and disks.
---

# Programs in the world

A c0de program has no `main`, no command line and no files. It lies on a sheet and waits until a trigger block starts one of its functions. The arguments come in as items, the results go out as items, and hoppers carry them on to the next trigger block. This lesson connects two trigger blocks to a small pipeline and explains what runs where, who may do what, and how programs move between worlds.

::: info What you need
A creative world with cheats on (see [Tutorials](/tutorials/)), a **trigger block**, a **timer block**, a **button**, two **hoppers**, a **chest**, an **INTEGER variable item** named `count`, a **STRING variable item** named `item` and an **uninitialized variable item**.
:::

## The model

- **A process is one run of one function.** A trigger block starts a process of its program at the function you picked in its dialog, the entry function. A program can run in several processes at once, one per trigger block, and each has its own cursor and its own variables, also its own copy of the global ones. Processes share nothing but items.
- **The PID is a height.** When a process starts, a PID block appears on the cursor rail of the sheet, next to line 0. Its y coordinate is the PID, the first free height counted up from 0. The cursor, a glowing pillar on the rail, then works through the program one line per tick.
- **Three ways to start.** The **trigger block** starts a process on a redstone pulse, the **timer block** every few ticks (20 ticks are a second; a redstone signal pauses it), and the **debug trigger block** starts a red debug cursor that you move line by line with the debugging tool.
- **Items are the interface.** Every parameter of the entry function gets the variable or constant item with its name from the input inventory. Every result goes into the output inventory as a variable item. Initialized items that no parameter takes pass through unchanged.
- **The program knows where it runs.** The built-in constants `PID` (e.g. `PID.pid`, `PID.owner`, `PID.activator`, the position `PID.x`, `PID.y`, `PID.z` of the trigger block), `SHEET` (e.g. `SHEET.number`, `SHEET.owner`) and `CURSOR` describe the process, the sheet and the cursor.

Compared with a shell, a trigger block is a command with named arguments, the output inventory its standard output, the exit code its exit status, and a hopper the pipe.

## The program

Two functions for a storage room. `pack` counts how many full stacks of 64 and how many single items a number of items makes; `describe` turns that into a label.

<<< @/tutorials/programs/programmers/world-storage.c0de

## Building the pipeline

1. Place a trigger block **A** with a button on it, and set it to the program `storage` and the function `pack`.
2. Place a hopper under A, pointing sideways. A hopper below a trigger block empties its output.
3. Place a timer block **B** where that hopper points, and set it to the function `describe` and an interval of 20 ticks. A hopper beside a trigger block fills its input.
4. Place a second hopper under B, pointing into a chest.
5. Put three items into the input inventory of A: `count` = 200, `item` = `"cobblestone"` and one uninitialized item. Press the button.

| Step              | Takes                                                                                       | Gives                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| A runs `pack`     | `count`; one uninitialized item, because `pack` has two results and gets one parameter item | `stacks` = 3, `rest` = 8, and `item`, passed through                  |
| the hopper        | everything from the output of A                                                             | everything into the input of B                                        |
| B runs `describe` | `item`, `stacks`, `rest`                                                                    | `text` = `"cobblestone: 3 stacks and 8"` and two empty variable items |
| the second hopper | everything from the output of B                                                             | everything into the chest                                             |

The timer block only starts `describe` when its input holds an item for every parameter, so it waits until all three items have arrived. The two empty items at the end make up for the parameters that had no result: as many items come out of a process as go in. Put them back into A for the next run.

You can test both functions without the pipeline: the program runner runs `pack` with `count` = 200 and `describe` with the three values above, and the debug trigger block runs them step by step in the game.

## How it works

- **Pass-through makes the chain.** `pack` doesn't know `item`. Because no parameter takes it, it goes through to the output and on to `describe`. In longer chains, every process takes what it needs and passes on the rest; the end of the chain collects everything.
- **Automatic output.** If exactly one block with an inventory touches a trigger block, the output goes there by itself; another trigger block counts too, a hopper pointing into the trigger block doesn't. So two trigger blocks side by side form a chain without a hopper.
- **When a trigger block won't start.** It has no program or function, its last process is still running, an item for a parameter without default value is missing, an uninitialized item for a result is missing, or the output inventory has too few free slots. A timer block simply tries again at the next interval.
- **Exit codes.** A comparator reads the exit code of the last process from the trigger block: 0 after a normal end, the value of EXIT, or 15 after a crash. After a crash, all items the process took go to the output unchanged, and the trigger block's dialog shows the error.

## Locked sheets, owners and permissions

- **A running program can't be changed.** While a process runs, nobody can place or break blocks on its sheet, not even pistons or explosions; the wrench, the hammer and the pliers don't work there, and the dialogs of its blocks open read-only. Pause a fast timer block with a lever before you edit its program. A stuck process is ended by shift-right-clicking its PID block with the debugging tool; it crashes with PROCESS_ABORTED.
- **Sheets have owners.** The first player who builds on an empty sheet owns it. Only the owner and administrators can change it.
- **Trigger blocks have owners.** The player who configured a trigger block last owns it, and its programs act on behalf of this player. The button **Run** in its dialog decides who may start it: _Only me_, _Players_, _Mobs_ or _Everyone_ (also plain redstone).
- **Changing the world needs rights.** The functions of c0de/minecraft that move items, place or remove blocks, spawn things or teleport only work if the owner is an administrator, or if the server allows them in `config/c0de.properties`:

| Setting                 | Functions                                       |
| ----------------------- | ----------------------------------------------- |
| `allowInventoryChanges` | MOVE_ITEMS, DELETE_ITEMS                        |
| `allowBlockChanges`     | PLACE_BLOCK (without `inventory`), REMOVE_BLOCK |
| `allowSpawning`         | SPAWN_ITEM, SPAWN_ENTITY                        |
| `allowTeleporting`      | TELEPORT                                        |

All four are off by default. Without the right, the function raises PERMISSION_DENIED; if a player who isn't an administrator started the process, it crashes instead. The rights of an administrator only count for programs on sheets that belong to an administrator or to nobody, so nobody can run their own program with an administrator's trigger block.

## Disks

A **c0de disk** carries one program. Right-click the PROGRAM block with it to copy the program, which also works while it runs. Right-click the floor at the start of an empty sheet (x=5, line 0) to build it again; a program with the same name must not exist yet. A **disk drive** saves the program of a disk as a file in the folder `c0de` of your Minecraft, next to `saves`, and loads such files onto a disk. That's how you back up programs and give them to friends.

## Differences you'll trip over

- There is no `main`. Any function can be an entry function; the trigger block decides which one.
- Every process has its own variables. Two processes of the same program, even two runs of the same trigger block, share no globals; only items travel between them.
- A trigger block starts nothing while its last process runs. One trigger block is one process at a time.
- Parameter items are consumed. A result with the same name doesn't exist (names are unique in a function), so a value that a later stage needs must pass through instead.
- Missing items don't raise an error: the trigger block just doesn't start. Check the dialog.
- The sheet is locked while the program runs. A timer block that starts a process every tick keeps it locked.
- The cursor does one line per tick. Programs are slow; a loop of a thousand lines takes almost a minute.
- Programs act with the rights of the trigger block's owner, not of the player who pressed the button – but a player who isn't an administrator can make a restricted function crash the process.

## Try it yourself

1. Let `pack` end with exit code 1 if `count` is 0, and put a comparator with a lamp next to trigger block A.

::: details Solution
<<< @/tutorials/programs/programmers/world-empty.c0de

With `count` = 0, the process ends with exit code 1 and the lamp lights up. EXIT still writes the results, `stacks` and `rest` are 0, so `describe` reports `cobblestone: 0 stacks and 0`. With `count` = 130, the exit code is 0, and the results are 2 and 2.
:::

2. Both trigger blocks run the program `storage`. Could `pack` store the item name in a global variable for `describe`?

::: details Solution
No. Each process has its own cursor with its own stack, and its global variables live there. `describe` would see the start value of the global, not what `pack` assigned. Values travel between processes only as items.
:::

## Read more

- [Running programs](/c0de/guide/running-programs): [Three trigger blocks](/c0de/guide/running-programs#three-trigger-blocks), [What a process takes](/c0de/guide/running-programs#what-a-process-takes), [Chaining](/c0de/guide/running-programs#chaining), [Protected programs](/c0de/guide/running-programs#protected-programs) and [PID blocks](/c0de/guide/running-programs#pid-blocks)
- [Libraries: Owner and permissions](/c0de/guide/libraries#owner-and-permissions)
- Handbook Triggers: [Trigger block](/c0de/reference/triggers#trigger-block), [Timer block](/c0de/reference/triggers#timer-block), [Debug trigger block](/c0de/reference/triggers#debug-trigger-block) and [PID block](/c0de/reference/triggers#pid-block)
- Handbook Tools: [c0de disk](/c0de/reference/tools#c0de-disk), [Disk drive](/c0de/reference/tools#disk-drive) and [Variable item](/c0de/reference/tools#variable-item)
