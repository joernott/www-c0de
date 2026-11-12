---
description: A guessing game that pays out diamonds with SPAWN_ITEM, an animal spawner with SPAWN_ENTITY that keeps the pen from overflowing, and a teleporter hub whose pressure plates send players to the farm, the mine and the tower with TELEPORT.
---

# Rewards and teleporters

Three programs that create things and move them: the guessing game pays out diamonds – the fewer tries, the more. An animal spawner fills the pen, but never too much. And a teleporter hub sends you to the farm, the mine or the top of the tower, depending on the pressure plate you step on.

**Functions:** [SPAWN_ITEM](/c0de/minecraft/spawn_item), [SPAWN_ENTITY](/c0de/minecraft/spawn_entity), [TELEPORT](/c0de/minecraft/teleport), and [FIND_ENTITIES](/c0de/minecraft/find_entities), [GET_PRESSURE_PLATE](/c0de/minecraft/get_pressure_plate), [SAY](/c0de/minecraft/say)

::: warning Needs an operator
These functions make things out of nothing or move them without a player, so they only work if the owner of the trigger block is an operator – in the world of the tutorials, you are one. On a server, the administrator can allow SPAWN_ITEM and SPAWN_ENTITY for everybody with `allowSpawning=true`, and TELEPORT of animals and items with `allowTeleporting=true` in `config/c0de.properties`. Players can only be teleported by programs of an operator; no setting allows that. Without the right, the program crashes with PERMISSION_DENIED. For everyone, a dispenser full of diamonds or spawn eggs does it: PRESS_BUTTON presses its button (exercise 1).
:::

::: info What you need

- a **trigger block** with a **button**, your **laptop**, a **timer block**, and an empty sheet for each program
- a fenced pen, like in [Watching the surroundings](/tutorials/libraries/c0de/minecraft/watching)
- three **pressure plates**, and the positions of three places you want to reach

:::

## The idea

SPAWN_ITEM lets 1 to 64 items appear on the ground at a position, SPAWN_ENTITY one entity, such as a sheep. Both return the UUID of what they created: a text that names this one entity in the whole world. TELEPORT moves an entity, given by its UUID, to a position – the UUIDs also come from FIND_ENTITIES.

How many diamonds a game is worth is a decision that needs no world. It gets a function of its own, which the program runner tests.

## The prize

<<< @/tutorials/programs/libraries/minecraft/rewards-prize.c0de

Five tries or fewer give 5 diamonds, up to seven 3, up to ten 1, and more than ten nothing. The runner checks 6 tries (3), 4 tries (5) and 12 tries (0). The IFs go from the worst to the best result, so the last one that fits wins.

## The reward dispenser

The guessing game of the lesson [Guess the number](/tutorials/learning/guess-the-number), shorter, with the prize at the end.

<<< @/tutorials/programs/libraries/minecraft/rewards-game.c0de

Set the laptop and the trigger block to `rewardgame` and `play`, as in the lesson, and press the button. Guess the number on the laptop: when you find it, the laptop says what you've won, and the diamonds pop out on top of the trigger block.

- **SPAWN_ITEM** needs a position, the item `id` and the `count`. `count` must be 1 to 64, so a prize of 0 returns before SPAWN_ITEM is called.
- **The UUID** isn't needed here, so the CALL has no RESULT line, and the UUID is thrown away.

## The animal spawner

<<< @/tutorials/programs/libraries/minecraft/rewards-spawner.c0de

Put the trigger block 5 blocks north of the center of the pen, like the timer block of the animal counter, set it to `animalspawner` and `spawn`, and press the button: a sheep appears in the middle of the pen. For pigs, put a STRING variable item `animal` with `minecraft:pig` into the trigger block.

<!-- screenshot: rewards-pen | the fenced pen with several sheep, one of them just appeared in the middle, the trigger block with its button north of the pen and the chat line "Animal number 4 is in the pen." -->

- **First count, then spawn.** FIND_ENTITIES counts the animals of this type in the pen. At 8 or more, the program says that the pen is full, and spawns nothing.
- **SPAWN_ENTITY** raises INVALID_ARGUMENT for a type that doesn't exist, such as `minecraft:unicorn`.

## The teleporter hub

<<< @/tutorials/programs/libraries/minecraft/rewards-hub.c0de

## Building and running it

1. Go to each place you want to reach – the farm, the mine, the top of the tower –, press F3 and write down x, y and z of the block you stand on. Put them into the start values of `farm`, `mine` and `tower`, instead of the numbers of the example. Take the block where your feet are, and make sure it is air, with air above.
2. Place the timer block, and three pressure plates on the ground 2, 4 and 6 blocks east of it. The plates keep a block away from the timer block and from each other.
3. Set the timer block to `teleporterhub` and `hub`, with an interval of 10 ticks. Put a sign next to each plate with its destination.

Step on the first plate: half a second later, you stand on the farm.

<!-- screenshot: rewards-hub | the teleporter hub: three pressure plates in a row with signs "Farm", "Mine" and "Tower" behind them, the timer block at the west end -->

- **`send`** handles one plate and its destination; `hub` calls it three times. A fourth plate is one more CALL and one more variable.
- **Who is on the plate?** GET_PRESSURE_PLATE tells if anybody is; FIND_ENTITIES with radius 1 finds the players near the plate. Only those whose position is the plate's go: a player on the plate next to it is also within 1 block.
- **TELEPORT** takes the `uuid` from the ENTITY and the destination. Players can only be teleported by an operator's program, see the box at the top.

## Try it yourself

1. Pay out the reward for everyone, without `allowSpawning`: from a dispenser full of diamonds, with a stone button on top.

::: details Solution
Put the dispenser 2 blocks north of the trigger block, facing south, and the button on top of it. The program presses the button once per diamond. A stone button stays pressed for 20 ticks, so SLEEP waits 30 ticks before the next press.

<<< @/tutorials/programs/libraries/minecraft/rewards-dispenser.c0de

:::

2. Send animals through the teleporter too, for example to bring a cow to the farm.

::: details Solution
Leave out `PARAMETER type "minecraft:player" ;` in `send`: then FIND_ENTITIES finds every entity near the plate. Stone pressure plates react to players and mobs, so a cow on the plate starts the transport. Without the type, items lying on the plate would be sent too – that's no harm.
:::

## Read more

- The functions of this recipe: [SPAWN_ITEM](/c0de/minecraft/spawn_item), [SPAWN_ENTITY](/c0de/minecraft/spawn_entity), [TELEPORT](/c0de/minecraft/teleport), [FIND_ENTITIES](/c0de/minecraft/find_entities), [GET_PRESSURE_PLATE](/c0de/minecraft/get_pressure_plate), [PRESS_BUTTON](/c0de/minecraft/press_button) and [SAY](/c0de/minecraft/say)
- [Changing the world](/c0de/guide/libraries#changing-the-world) and [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide
- [Programs in the world](/tutorials/programmers/world): owners and the settings of `config/c0de.properties`
- [Guess the number](/tutorials/learning/guess-the-number) and [Project: the guarded door](/tutorials/learning/guarded-door)
