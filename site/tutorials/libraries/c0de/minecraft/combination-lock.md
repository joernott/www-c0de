---
description: Four levers and a button that open an iron door only in the right combination – the program reads the levers with GET_LEVER, switches them back with SET_LEVER, watches the button with GET_BUTTON and opens the door with PRESS_BUTTON.
---

# A combination lock

Four levers lie in front of the entrance. Set them to the secret combination and press the button next to them, and the iron door opens. Whatever you set, the levers flip back afterwards, so nobody can read the combination from them. The program opens the door like a player: it presses a button inside.

**Functions:** [GET_LEVER](/c0de/minecraft/get_lever), [SET_LEVER](/c0de/minecraft/set_lever), [GET_BUTTON](/c0de/minecraft/get_button), [PRESS_BUTTON](/c0de/minecraft/press_button), and [SLEEP](/c0de/time/sleep) of c0de/time

::: info What you need

- a **timer block** and an empty sheet
- four **levers** and two **stone buttons**
- an **iron door** in the wall of your base
- no rights: levers and buttons are what every player may use, so the lock works for every owner

:::

## The idea

A lock has two parts: the **check** (is this the right combination?) and the **mechanics** (read the levers, open the door, reset everything). The check is pure computation: it needs no world, so you can write and test it on its own. The mechanics are a few calls of c0de/minecraft around it.

The iron door can't be opened by hand, and a program may only open it with SET_OPEN if its owner has the right `allowBlockChanges`. But a button next to the door opens it by redstone, and PRESS_BUTTON presses a button like a player would. That needs no rights at all.

## The check

The secret is an array of four booleans: on, off, on, on. `matches` compares the levers with it, one by one.

<<< @/tutorials/programs/libraries/minecraft/combination-lock-check.c0de

The program runner (or a debug trigger block in the game) runs `matches` with the levers `[TRUE, FALSE, TRUE, TRUE]` and gets `TRUE`; with all four on, it gets `FALSE`.

## The lock

The program `combolock` adds the mechanics. The check is the same.

<<< @/tutorials/programs/libraries/minecraft/combination-lock-lock.c0de

## Building and running it

Positions matter here: the program finds the levers and buttons by their distance from the timer block. Stand south of the place for the timer block and look north; east is on your right.

| What                     | Where, seen from the timer block                                                        |
| ------------------------ | --------------------------------------------------------------------------------------- |
| the timer block          | on the ground, 3 blocks south of the wall with the door                                 |
| the four levers          | on the ground, 2, 3, 4 and 5 blocks east, in a row                                      |
| the enter button         | on the ground, 7 blocks east                                                            |
| the iron door            | in the wall, 4 blocks east and 3 blocks north                                           |
| the button for the door  | inside, on the wall next to the door: 3 blocks east, 1 block up, 4 blocks north         |

The levers and the enter button keep a block away from the timer block: a redstone signal next to it would pause it. The button inside also lets you out again.

<!-- screenshot: combination-lock-levers | the four levers on the ground in front of the base, two of them on, the stone button at the end of the row, the timer block on the left and the closed iron door behind them -->

Set the timer block to the program `combolock`, the function `watch` and an interval of 5 ticks. Set the levers to on, off, on, on – the first lever is the one nearest to the timer block – and press the enter button. The door opens for a moment, and all levers flip to off. Try a wrong combination: the chat says `Wrong combination.`, and the levers flip back too.

## How it works

- **Positions.** `near` turns a distance from the timer block into a `c0de/minecraft/POSITION`: `PID.x`, `PID.y` and `PID.z` are the position of the timer block. So the program keeps working when you build the lock elsewhere, as long as the distances stay the same.
- **GET_BUTTON** tells if the enter button is pressed right now. Most runs of the timer block find it unpressed and end at once with RETURN.
- **GET_LEVER and SET_LEVER.** The FOR loop reads lever `i` into `levers[i]` and switches it off at once. The array grows by one element in each round.
- **PRESS_BUTTON** presses the button inside the wall. The button gives a redstone pulse for about a second, and the door opens and closes by itself.
- **Waiting for the button.** A stone button stays pressed for 20 ticks. Without the WHILE loop at the end, the next run of the timer block would find it still pressed, read the levers – all off by now – and report a wrong combination. So the run waits with SLEEP and GET_BUTTON until the button is released.

## Try it yourself

1. A lock for practice: write a function `rightLevers` that counts how many levers are in the right position, so the lock can say `2 of 4 levers are right.`

::: details Solution
<<< @/tutorials/programs/libraries/minecraft/combination-lock-hint.c0de

With the levers off, off, on, off, two of them match the secret. In `combolock`, add the function below `matches`, call it in the ELSE block with `RESULT result hits` into a new INTEGER variable `hits`, and SAY `hits ⊕ " of 4 levers are right."` instead of the plain message. A real lock shouldn't do that, of course: it gives the combination away in a few tries.
:::

2. Make guessing slower: after a wrong combination, the lock should ignore the button for ten seconds.

::: details Solution
Add `CALL c0de/time/SLEEP` with `PARAMETER ticks 200 ;` in the ELSE block, after the SAY. While the run sleeps, the timer block starts no new one, so the button does nothing for ten seconds.
:::

## Read more

- The functions of this recipe: [GET_LEVER](/c0de/minecraft/get_lever), [SET_LEVER](/c0de/minecraft/set_lever), [GET_BUTTON](/c0de/minecraft/get_button), [PRESS_BUTTON](/c0de/minecraft/press_button) and [SLEEP](/c0de/time/sleep)
- [Three trigger blocks](/c0de/guide/running-programs#three-trigger-blocks) in the guide, and the [Timer block](/c0de/reference/triggers#timer-block) in the handbook Triggers
- [Structs](/c0de/guide/language#structs) in the guide: `PID` and the elements of a struct
- [WHILE and REPEAT](/c0de/guide/language#while-and-repeat) in the guide
