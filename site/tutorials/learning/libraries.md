---
description: A button rolls a die and tells the result in the chat, with a sound – your first program that uses functions from libraries.
---

# Using libraries

For game nights in Oak Hill, you need a die. You could carve one out of wood – or let the computer roll it. A computer can't really throw anything, but it can pick a number by chance. You don't have to write that yourself: c0de comes with ready-made functions for it, and for playing sounds and writing to the chat, too.

::: tip New words

- **library**: a collection of ready-made functions that somebody else wrote, so you don't have to.
- **INCLUDE**: the line that loads a library into your program.
- **random number**: a number picked by chance, different every time.

:::

::: info What you need

- a new, empty sheet in the c0de dimension, and the wrench
- a **trigger block** with a button on it, in your base
- the blocks you know (PROGRAM, NOOP, FUNCTION, BEGIN, END, VARIABLE, CALL, PARAMETER, RESULT, LABEL, LITERAL, OPERATOR, the type blocks INTEGER and FLOAT) and the new one: an **INCLUDE** block

:::

## The idea

When you build a house in Minecraft, you don't make your own bricks from clay first, every single time. You take the bricks from a chest where they are ready. Programmers do the same: things that many programs need – calculating, working with text, the clock – are written once and put into a **library**. Your program only says which library it wants, and then it can call its functions.

c0de has four libraries:

| Library          | What its functions do                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| `c0de/math`      | calculating, rounding and random numbers                                     |
| `c0de/strings`   | working with text                                                            |
| `c0de/time`      | the clock and the calendar of the real world                                 |
| `c0de/minecraft` | the world around the trigger block: sounds, the chat, levers, doors and more |

A library function has a long name: the library, a slash and the function, like `c0de/math/RANDOM`. That way, two libraries can have a function with the same name without mixing them up.

## The program

The program `dice` goes on a new sheet.

<<< @/tutorials/programs/learning/libraries-dice.c0de

<!-- screenshot: libraries-dice-sheet | the program dice on its sheet, seen from the south, with the two INCLUDE lines at the top and all line numbers dark green -->

## Building it

- Line 0: PROGRAM `dice`.
- Line 1: NOOP. Every program needs it here.
- Lines 2 and 3: an **INCLUDE** block at x=5 and a LABEL. Right-click the LABEL with an empty hand: its dialog lists all libraries. Pick `c0de/math` in line 2 and `c0de/minecraft` in line 3. INCLUDE lines always come right after the NOOP in line 1.
- Line 4: NOOP, because a FUNCTION needs a NOOP line right above it.
- Lines 5 to 8: FUNCTION `roll`, BEGIN, and two variables: `chance` (FLOAT) for the random number and `die` (INTEGER) for the number of the die.
- Lines 9 and 10: a CALL block at x=6 with a LABEL `c0de/math/RANDOM`. In the next line, one block further east, a RESULT block, a LABEL `result` and a LABEL `chance`.
- Lines 11 to 13: CALL `c0de/math/INT`, with a PARAMETER line `value chance * 6 + 1 ;` and a RESULT line `result die`.
- Lines 14 to 16: CALL `c0de/minecraft/SOUND` with two PARAMETER lines: `note 12 ;` and `instrument "bell" ;`.
- Lines 17 and 18: CALL `c0de/minecraft/SAY` with a PARAMETER line `message "You rolled a " ⊕ die ;`.
- Line 19: END FUNCTION.

## Running it

Leave the dimension. Set the trigger block to the program `dice` and the function `roll`. The die needs no variable items: it has no parameters and no results. Press the button.

You hear a bell at the trigger block, and the chat shows something like:

```
[dice/0] You rolled a 4
```

Press the button again, and again. The numbers change: 2, 6, 1, 4 … Every number from 1 to 6 comes up, and none is more likely than the others.

<!-- screenshot: libraries-dice-chat | the player in the base pressing the button on the trigger block, the chat showing three lines like "[dice/0] You rolled a 4" -->

The beginning of the message, `[dice/0]`, is added by SAY: the name of the program and the number of its process. So everybody sees which program is talking. All players within 64 blocks of the trigger block get the message.

## How it works

- `INCLUDE c0de/math` and `INCLUDE c0de/minecraft` load the two libraries. Without the INCLUDE line, c0de doesn't know the functions, and the CALL line turns red.
- `CALL c0de/math/RANDOM` gives back a random decimal number from 0 up to below 1, like 0.0, 0.3527 or 0.9991 – but never 1. A function with one result calls it `result`, so the RESULT line `result chance` means: put the result into my variable `chance`.
- `chance * 6 + 1` turns it into a number from 1 up to below 7, like 1.0, 3.116 or 6.9946.
- `CALL c0de/math/INT` rounds a number down to a whole number: 3.116 becomes 3, and 6.9946 becomes 6. So `die` is always 1, 2, 3, 4, 5 or 6.
- `CALL c0de/minecraft/SOUND` plays a note like a note block: `note` goes from 0 to 24, like the clicks on a note block, and `instrument` is the sound, like `harp`, `bass`, `bell` or `flute`.
- `CALL c0de/minecraft/SAY` writes its `message` to the chat.

You call a library function exactly like your own functions: CALL, the name, PARAMETER lines for what goes in, RESULT lines for what comes out. To find out which parameters and results a function has, look it up in the handbook Functions – the links are below.

## Try it yourself

1. Many games need two dice. Roll two and tell both numbers and their sum, like "You rolled 3 and 5: 8".

::: details Solution
Call RANDOM and INT twice, once for each die. The brackets around `first + second` make sure the two numbers are added before they are joined to the text.

<<< @/tutorials/programs/learning/libraries-two-dice.c0de
:::

2. A six is special. Play a different sound for a six: the flute at note 24.

::: details Solution
An IF decides which SOUND to play. Everything else stays the same.

<<< @/tutorials/programs/learning/libraries-six.c0de
:::

## Read more

- [Libraries](/c0de/guide/libraries) in the guide, with [Including libraries](/c0de/guide/libraries#including-libraries) and [Making music](/c0de/guide/libraries#making-music)
- [INCLUDE](/c0de/reference/statements#include) in the handbook Statements
- The functions of this lesson: [RANDOM](/c0de/math/random), [INT](/c0de/math/int), [SOUND](/c0de/minecraft/sound) and [SAY](/c0de/minecraft/say)
- All functions of a library: [c0de/math](/c0de/math/) and [c0de/minecraft](/c0de/minecraft/)
