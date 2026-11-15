---
description: A "good morning" button for operators that runs /time set day and /weather clear with COMMAND, checks the result and the output of every command, and greets everybody with /say.
---

# Server commands

Night again, and rain on top of it? On your own world, one button makes it morning: a program runs `/time set day` and `/weather clear`, checks that both worked, and wishes everybody a good morning. A second button turns night back on.

**Functions:** [COMMAND](/c0de/minecraft/command) and [SAY](/c0de/minecraft/say)

::: warning Needs an operator – always
COMMAND runs a command like a command block, and command blocks are only for operators. So COMMAND only works if the owner of the trigger block is an operator, and if a player presses the button, that player must be an operator too: if anybody else presses it, the process crashes with PERMISSION_DENIED instead of changing the time. No setting in `config/c0de.properties` allows it for everybody; there the administrator can only switch COMMAND off for everyone with `enableCommand=false`. Command blocks must also be enabled on the server: in a single-player world they always are, on a dedicated server it's `enable-command-block=true` in `server.properties` (since Minecraft 1.21.11 the game rule "Enable Command Blocks"). In the world of the tutorials, you are an operator and everything is ready.
:::

::: info What you need

- a **trigger block** with a **button** on it, and an empty sheet for the program
- for the exercises: a second **trigger block** with a **button**

:::

## The idea

COMMAND takes a command as text, with or without `/`, and runs it like a command block at the trigger block. It gives back two results:

- `result`: how often the command succeeded, the number a comparator reads from a command block. 0 means it failed.
- `output`: the last message of the command, e.g. "Set the time to 1000" – or why it failed.

A command that fails is not an error of the program: a typo in a command doesn't crash it, the program only sees `result` 0. So it's up to the program to check every command – that's what this one does.

## The program

<<< @/tutorials/programs/libraries/minecraft/server-commands-morning.c0de

## Building and running it

1. Place the trigger block and put the button on it.
2. Set it to `goodmorning` and `morning`.
3. Wait for the night (or make it with `/time set night`), and press the button.

The sun comes up, the rain stops, and the chat shows `[goodmorning/3] Good morning, everybody! The sun is up.` – the name in brackets is the program and its PID, like the name of a command block. As an operator, you may also see what the commands said, in grey: that's the game rule `commandBlockOutput`, the same as for command blocks. Every command is also written to the log of the server, with the program and the PID, so the administrator can see who did what.

<!-- screenshot: server-commands-morning | the trigger block with its button in the morning sun, the chat showing the good morning message of goodmorning -->

## How it works

- **A list of commands.** The commands are an ARRAY STRING, and EACH runs them one after the other. A third command is one more text in the list.
- **`result` and `output`.** If a command returns `result` 0, the program writes the command and its `output` to the chat with SAY. Try it: change `"weather clear"` into `"weather sunny"`, and the chat tells you what the game thinks of it.
- **The greeting.** `/say` is a command too: it writes to every player on the server, while SAY only reaches the players within 64 blocks of the trigger block. The program only greets if no command failed.
- **Where the commands run.** COMMAND runs at the center of the trigger block, in its dimension, but without a player: `@s` selects nobody, and `~ ~ ~` is the trigger block. `/give @p minecraft:bread` gives bread to the player nearest to the button.

## Try it yourself

1. Add a "good night" button: a second entry function `evening` that runs `/time set night` and says good night. Both functions should use the same loop.

::: details Solution
The loop moves into a function `runAll` with an ARRAY STRING parameter, and each list gets its own variable. The greeting is just the last command of the list; `runAll` stops at the first command that fails. Set the second trigger block to `daynight` and `evening`, the first to `daynight` and `morning`.

<<< @/tutorials/programs/libraries/minecraft/server-commands-night.c0de

:::

2. Before the program changes the time, it should ask the game what time it was, and put the answer into the greeting.

::: details Solution
`/time query daytime` changes nothing; its `output` is the answer, e.g. "The time is 13000". The program keeps it in `before` and uses it in the greeting. Here, `result` is not needed, so the CALL only takes `output`.

<<< @/tutorials/programs/libraries/minecraft/server-commands-clock.c0de

:::

## Read more

- The functions of this recipe: [COMMAND](/c0de/minecraft/command) and [SAY](/c0de/minecraft/say)
- [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide: why only operators may run commands
- [EACH loops](/c0de/guide/language#each-loops) in the guide
- [Programs in the world](/tutorials/programmers/world): who owns a trigger block, and who started a process
