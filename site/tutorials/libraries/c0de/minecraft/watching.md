---
description: A farm monitor that reads every wheat plant with GET_BLOCK and calls you when the field is ripe, and a counter of the animals in a pen with FIND_ENTITIES.
---

# Watching the surroundings

Two programs that only look: a farm monitor that shows on a display wall how much of the wheat is ripe and calls you when the whole field is, and a counter that tells how many sheep, cows, pigs and chickens are in your pen.

**Functions:** [GET_BLOCK](/c0de/minecraft/get_block), [FIND_ENTITIES](/c0de/minecraft/find_entities), and [SAY](/c0de/minecraft/say)

::: info What you need

- two **timer blocks** and an empty sheet for each program
- a **display wall** for each program
- a wheat field of 4 × 4 plants and a fenced pen with some animals
- no rights: reading the world is allowed for every owner

:::

## The idea

GET_BLOCK reads one block: its ID, like `minecraft:wheat`, its **block states**, its redstone power and whether it has an inventory. Block states are what F3 shows on the right when you look at a block: a wheat plant has the state `age`, from 0 (just planted) to 7 (ripe). GET_BLOCK gives them as a HASH STRING, so `states["age"]` is the text `"7"` for a ripe plant.

FIND_ENTITIES looks the other way round: not at one place, but for everything that moves around a position – animals, monsters, players and items lying on the ground. Each one comes as an [ENTITY](/c0de/minecraft/position-entity-and-item_stack) struct with its `uuid`, `type`, `name` and `position`.

## The farm monitor

<<< @/tutorials/programs/libraries/minecraft/watching-farm.c0de

## Building and running it

1. Place the timer block on the ground next to the field, at the height of the plants. The field begins 2 blocks east of it: its plants are 2 to 5 blocks east and 0 to 3 blocks south of the timer block. Give the farmland water within four blocks, as usual.
2. Set the timer block to `farmwatch` and `check`, with an interval of 1200 ticks: once a minute is often enough for wheat.
3. Bind the display wall to `farmwatch` and `check`.

The wall shows `Wheat: 16 plants` and `Ripe: 5`, and the next minute a little more. When all plants are ripe, the chat says `The wheat is ripe!` – once a minute, until you harvest.

<!-- screenshot: watching-farm | the wheat field of 4 × 4 plants, partly ripe, with the timer block beside it and the display wall showing "Wheat: 16 plants" and "Ripe: 5" -->

## How it works

- **Two FOR loops** walk over the field: `dx` from 2 to 5, `dz` from 0 to 3. `spot.y` stays at the height of the timer block.
- **Only wheat counts.** A harvested or trampled spot holds air. So the program counts `plants` only for `minecraft:wheat`, and `ripe` only for those with age 7.
- **The results you need.** GET_BLOCK has four results; the CALL takes only `id` and `properties`. The others are thrown away.
- **SAY** only when all plants are ripe, and only if there are any: `ripe > 0 AND ripe = plants`. An empty field isn't ripe.

## The animal counter

<<< @/tutorials/programs/libraries/minecraft/watching-pen.c0de

The pen's center is 5 blocks south of the timer block. A pen of 7 × 7 blocks fits into the search radius of 4. Set a second timer block to `pencount` and `count`, with an interval of 200 ticks, and bind its display wall to the same program and function. The wall shows `sheep: 3`, `cow: 2` and so on, and the total.

<!-- screenshot: watching-pen | the fenced pen with sheep, cows and pigs, the timer block north of it, and the display wall listing the animals and "Animals: 9" -->

- **One search per type.** `type` narrows the search to one entity type. The program joins `"minecraft:"` and the name from the array, so it can print the short name.
- **Without `type`,** FIND_ENTITIES finds everything: also you, and the wheat seeds lying around. That's why a counter of animals should always name the type.
- **The radius** goes from 1 to 64 blocks. Keep it as small as the pen, or the animals of your neighbor count too.

## Try it yourself

1. Turn the counter into a guard: you have 12 animals. If fewer are in the pen, the chat should say how many have escaped.

::: details Solution
<<< @/tutorials/programs/libraries/minecraft/watching-escaped.c0de

The parameter `expected` has a default value, so the timer block needs no item for it. When your herd grows, change the default value in the PARAMETER line.
:::

2. How do you count the items lying on the ground in the pen, for example feathers and wool?

::: details Solution
Items are entities too, of the type `minecraft:item`. Call FIND_ENTITIES with `PARAMETER type "minecraft:item" ;` and count the result with LEN.
:::

## Read more

- The functions of this recipe: [GET_BLOCK](/c0de/minecraft/get_block), [FIND_ENTITIES](/c0de/minecraft/find_entities), [SAY](/c0de/minecraft/say) and [LEN](/c0de/reference/functions#len)
- [c0de/minecraft](/c0de/guide/libraries#c0deminecraft) in the guide
- [EACH loops](/c0de/guide/language#each-loops) and [FOR loops](/c0de/guide/language#for-loops) in the guide
- [Display block](/c0de/reference/devices#display-block) in the handbook Devices: display walls
