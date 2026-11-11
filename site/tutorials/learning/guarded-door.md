---
description: The final project – a timer block runs a guard every second that opens the iron door of the base for you and your friends and shows the visitors on the welcome sign.
---

# Project: the guarded door

In the lesson [Making decisions](/tutorials/learning/decisions), your door guard could only greet people. Now it gets real power: it opens the door. The entrance of Oak Hill gets an iron door that nobody can open by hand. In front of it lies a pressure plate. When you or one of your friends steps on it, the door opens. Strangers stay outside. And the welcome sign shows how many visitors are standing at the door.

::: tip New words

- **timer**: something that starts a program again and again, at a fixed interval – here every second.
- **world**: everything around the program in Minecraft: blocks, doors, players. This program reads the world and changes it.

:::

::: info What you need

- a new, empty sheet in the c0de dimension, and the wrench
- an **iron door** in the wall of your base, a **pressure plate**, a **button** and a **lever**
- a **timer block**
- your display wall at the entrance (the welcome sign)
- the blocks you know, among them INCLUDE, EACH, IF, RETURN and the type blocks ARRAY, STRUCT and BOOLEAN

:::

::: warning Needs an operator
Iron doors can't be opened by hand, so a program may only open them if the owner of the timer block is an operator. In the world of the tutorials, you are an operator, so it works. On a server, the administrator can allow it for everybody with `allowBlockChanges=true` in `config/c0de.properties`. Without that right, the program crashes with PERMISSION_DENIED. A wooden door works for everybody – but then anybody can open it by hand, and the guard can only greet.
:::

## The idea

Think of a guard at the gate of a castle. Every few moments, he looks around: Who is standing on the doormat? Is it the lord of the castle or one of his friends? Then he opens the gate. Is it a stranger? Then the gate stays shut. Then he waits a moment and looks again.

The guard doesn't decide once; he checks again and again. That's what a **timer** does: a **timer block** starts your program every second. Each run looks at the world, decides and acts – and is over after a moment. One second later, the next run starts.

Each run starts fresh. Like a guard who forgets everything at the end of his round, a run doesn't know what the run before it saw. That's why the sign shows who is at the door right now: the program counts the players near the door in every run.

## The program

The program `door` goes on a new sheet.

<<< @/tutorials/programs/learning/guarded-door-door.c0de

<!-- screenshot: guarded-door-sheet | the whole program door on its sheet, seen from above, with the start values of plate and door at the top, the function isFriend and the function watch below it -->

## Building it

First, build the door, so you can read its position:

1. Put an iron door into the entrance of your base.
2. Outside, leave one block free in front of the door, and put the pressure plate on the next block. The plate must not touch the door: a pressure plate right in front of an iron door opens it by redstone – for everybody.
3. Inside, put a button on the wall next to the door. It opens the door by redstone, so you can go out.
4. Press F3 and look at the pressure plate. The debug screen shows its position under "Targeted Block", three numbers x, y and z. Write them down. Do the same for the lower half of the door.

Now build the program. Lines 0 to 3 and the NOOP lines are like before. New are:

- Lines 4 to 7: the list `friends`, like the notes of the lesson [Lists](/tutorials/learning/lists): VARIABLE `friends`, the type blocks ARRAY and STRING, and between BEGIN and END VARIABLE one line with two LITERAL blocks, `"Alex"` and `"Kai"`. Put in the names of your friends.
- Lines 8 to 13: the position of the pressure plate. VARIABLE `plate`, a STRUCT type block and a LABEL `c0de/minecraft/POSITION`: that's a struct type of the library c0de/minecraft, with the elements x, y and z. Between BEGIN and END VARIABLE, one line per element, like the offer of the lesson [Tables and your own types](/tutorials/learning/tables): a LABEL `x` and a LITERAL with your number, then `y` and `z`. Use your numbers, not the ones in the example.
- Lines 14 to 19: the same for `door`, with the position of the lower half of the door.
- Lines 21 to 36: the function `isFriend`. It answers true for the owner of the sheet and for every name in `friends`.
- Lines 38 to 85: the function `watch`, which does the work in every run. The new functions of c0de/minecraft are explained below.

## Running it

1. Place the timer block somewhere near the entrance, where neither the pressure plate nor the button touches it – a redstone signal pauses a timer block. Put the lever right next to it, switched off.
2. Open the dialog of the timer block. Set it to the program `door` and the function `watch`, and the interval to 20 ticks: one second.
3. Open the dialog of your display wall, and bind it to `door` and `watch`. The wall now belongs to the door instead of the sign.

Within a second, the sign shows:

```
Welcome to Oak Hill!
Visitors at the door: 1
```

If you stand near the door, the one visitor is you. Step on the pressure plate: the door opens. Walk in. Inside, press the button to go out again.

<!-- screenshot: guarded-door-entrance | the entrance of the base from outside: the iron door open, the player on the pressure plate one block in front of it, the display wall next to the entrance showing "Welcome to Oak Hill!" and "Visitors at the door: 1" -->

When anybody else steps on the plate – on a server, a player who isn't on your list, or simply a pig – the door closes: there is no friend on the plate.

To change the program, switch the lever on first. It pauses the timer block, and when the last run is over, you can change the sheet. While a process runs, its sheet is locked – and with a timer every second, that's almost always.

## How it works

- **The timer block** starts `watch` every 20 ticks. A new run only starts when the last one has ended.
- **Positions.** The functions of c0de/minecraft need to know where something is. A `c0de/minecraft/POSITION` is a struct with x, y and z. `plate` and `door` hold the positions you read with F3.
- **Who is there?** FIND_ENTITIES (lines 45 to 49) looks for everything within `radius` blocks around a position. With `type "minecraft:player"`, it only finds players. Its result is a list of ENTITY structs. Each has a `name`, a `type` and a `position`, which is a POSITION itself.
- **Counting.** LEN (lines 50 to 52) gives the number of elements of the list: the players within 5 blocks of the door. The sign shows it in lines 53 to 61.
- **The pressure plate.** GET_PRESSURE_PLATE (lines 62 to 64) gives the signal strength of the plate: 0 if nobody stands on it. Then there is nothing to do, and RETURN ends the run in line 67. The door stays as it is.
- **Who is on the plate?** The EACH loop goes through all players near the door. A player stands on the plate if their position is the position of the plate: x, y and z must all be equal. `visitor.position.x` reads the element `x` of the element `position` of `visitor`.
- **Friend or stranger?** For each player on the plate, `isFriend` checks the name. If one of them is a friend, `letIn` becomes true.
- **The door.** SET_OPEN (lines 82 to 84) opens the door if `letIn` is true and closes it if it is false. So a friend opens it, and a stranger on the plate closes it again.

The program acts on behalf of the owner of the timer block – you. That's why it may open an iron door, see the box at the top.

## Try it yourself

1. The door stays open after a friend has gone in, until a stranger steps on the plate. Close it again after five seconds.

::: details Solution
After the door has opened, the program waits 100 ticks – five seconds – with SLEEP from the library c0de/time, and then closes the door. The program needs a third INCLUDE line for it.

<<< @/tutorials/programs/learning/guarded-door-close.c0de

While the program sleeps, the run isn't over, so the timer block starts no new run, and the sign isn't updated. After the five seconds, everything goes on as before.
:::

## Read more

- [Three trigger blocks](/c0de/guide/running-programs#three-trigger-blocks) in the guide, and the [Timer block](/c0de/reference/triggers#timer-block) in the handbook Triggers
- [c0de/minecraft](/c0de/guide/libraries#c0deminecraft), [Changing the world](/c0de/guide/libraries#changing-the-world) and [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide
- The functions of this lesson: [FIND_ENTITIES](/c0de/minecraft/find_entities), [GET_PRESSURE_PLATE](/c0de/minecraft/get_pressure_plate), [SET_OPEN](/c0de/minecraft/set_open), [LEN](/c0de/reference/functions#len) and [SLEEP](/c0de/time/sleep)
- [Protected programs](/c0de/guide/running-programs#protected-programs) in the guide: why the sheet is locked while the program runs
