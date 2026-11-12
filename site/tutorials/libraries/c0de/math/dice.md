---
description: A die with any number of sides on a display – RANDOM and INT turn chance into whole numbers, RANDOMIZE makes the same "random" numbers on every run, and FIX shows why negative numbers need INT.
---

# Rolling dice

A die for every game: a D6 for board games, a D20 for adventures, three of them at once, with the numbers and their total on a display. With a seed, the die rolls the same numbers on every run – handy for testing, and for a game that everybody should play with the same luck.

**Functions:** [RANDOM](/c0de/math/random), [RANDOMIZE](/c0de/math/randomize), [INT](/c0de/math/int) and [FIX](/c0de/math/fix)

::: info What you need
A trigger block with a button, a **display block** (16 columns and 8 rows are enough) and, if you like, the **variable items** `sides`, `count` and `seed` of type INTEGER and an uninitialized variable item for the result `total`. Without the items, the die is a single D6.
:::

## The idea

RANDOM gives a FLOAT from 0 up to below 1. A die needs a whole number from 1 to `sides`, each equally likely. Multiply by `sides`, and the number is from 0 up to below `sides`; add 1, and it is from 1 up to below `sides + 1`. INT cuts it down to the whole number below: for a D6, everything from 1.0 to 1.999… becomes 1, everything from 6.0 to 6.999… becomes 6. Each of the six numbers gets a slice of the same width, so each is equally likely.

The numbers of RANDOM aren't really random: they are computed one after the other from a start value, the **seed**. Each process gets its own generator with its own seed, so every run is different. RANDOMIZE sets the seed yourself, and from then on the process rolls the same sequence every time.

## The program

<<< @/tutorials/programs/libraries/math/dice-roll.c0de

## Building and running it

1. Place the display block, right-click it, click the buttons until they show `anydie` and `roll`, and click ✔.
2. Set the trigger block to the program `anydie` and the function `roll`. Put an uninitialized variable item into its input inventory for `total`.
3. Press the button. The display shows something like `D6: 4` and `Total: 4`; press again for a new number.
4. Now add the items `sides` = 20, `count` = 3 and `seed` = 42 and press the button. The display shows:

```
D20: 15
D20: 4
D20: 6
Total: 25
```

Run it again with the same three items: the same three numbers. That is what the test of this program checks, too. Leave out the item `seed`, and the die is random again.

<!-- screenshot: dice-display | a display block next to a trigger block with a button, showing "D20: 15", "D20: 4", "D20: 6" and "Total: 25" -->

## How it works

- **Defaults instead of items.** `sides`, `count` and `seed` have default values, so the trigger block starts without their items. A parameter item, if there is one, overrides the default.
- **In this program, seed 0 means "really random".** RANDOMIZE only runs if `seed` isn't 0. The seed only affects the current process, so it doesn't change the dice of other programs or of the next run without the item.
- **`chance * sides + 1`** goes into INT directly: a PARAMETER line takes any expression. The result `die` is an INTEGER, ready for the text.
- **Why INT and not ROUND?** ROUND would turn 0.0 to 0.499… into 0 – a seventh number, and 1 and 6 would get only half a slice each. INT gives every number a full slice.

### INT or FIX?

Both turn a FLOAT into an INTEGER. INT rounds **down**, FIX **cuts off** the decimals. For positive numbers that's the same, so the die could use either. They differ below 0: INT turns -0.5 into -1, FIX into 0.

That matters for a random step to the left, nowhere or to the right, -1, 0 or 1: `chance * 3 - 1` is from -1 up to below 2. This program rolls it 120 times and counts how often each step comes up, once with INT and once with FIX:

<<< @/tutorials/programs/libraries/math/dice-steps.c0de

Set a trigger block to `randomsteps` and `compare` and put two uninitialized items into it; the 120 rolls take the cursor about a minute. With the seed 42, `withInt` is `[46, 27, 47]` and `withFix` is `[0, 73, 47]`. With INT, all three steps come up about equally often. FIX turns everything from -1 up to 0 into 0, so -1 never comes up and 0 is twice as likely. Use INT for random numbers that can be negative; FIX is for cutting off decimals, like a price without its cents.

## Try it yourself

1. A treasure chest picks one reward from a list: diamond, emerald, gold ingot, iron ingot or bread. Show it on the display.

::: details Solution
The same trick with the length of the list instead of `sides`, and without the `+ 1`, because indexes start at 0: INT turns `chance * count` into 0 to `count - 1`.

<<< @/tutorials/programs/libraries/math/dice-pick.c0de

With the item `seed` = 42, the reward is always `iron_ingot`.
:::

2. Why does the program roll the same numbers after `RANDOMIZE` with 42 although every process has its own random number generator?

::: details Solution
Every generator computes its numbers the same way; only the start value differs. RANDOMIZE sets the start value, so two processes with the same seed compute the same sequence: the first RANDOM gives the same FLOAT, so the first die is the same, and so on. A different seed, like 7, gives a different sequence – again the same on every run.
:::

## Read more

- The handbook pages of [RANDOM](/c0de/math/random), [RANDOMIZE](/c0de/math/randomize), [INT](/c0de/math/int) and [FIX](/c0de/math/fix), and all of [c0de/math](/c0de/math/)
- [Rounding](/c0de/guide/libraries#rounding) in the guide
- [Display block](/c0de/reference/devices#display-block) and [PRINT](/c0de/reference/functions#print)
- [Using libraries](/tutorials/learning/libraries): the first die, in the path "Learning to program"
