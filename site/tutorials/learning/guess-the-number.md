---
description: Your first project – a guessing game on the laptop that puts together everything you have learned, planned step by step before it is built.
---

# Project: guess the number

Time for a game! The laptop of Oak Hill thinks of a secret number from 1 to 100. You guess, and it tells you "higher" or "lower" until you find it. At the end, it says how many tries you needed. This lesson has no new blocks. It is about something else: how to **plan** a program before you build it, and how the ideas of all the lessons fit together.

::: tip New words

- **planning**: writing down the steps of a program in your own words, before you build it.
- **game loop**: the part of a game that repeats until the game is over: ask, check, answer, and again.

:::

::: info What you need

- a new, empty sheet in the c0de dimension, and the wrench
- your **laptop** and a **trigger block** with a button next to it
- the blocks you know, among them INCLUDE, REPEAT and IF

:::

## The idea

Before you build a big house in Minecraft, you think about it first: where does the door go, how many floors, which blocks? A program is the same. Before you place the first block, write the steps down in plain words, like a recipe:

1. Think of a secret number from 1 to 100.
2. Show a hello.
3. Ask the player for a guess.
4. Count the try.
5. If the guess is too small, say "higher". If it is too big, say "lower".
6. If the guess isn't right, go back to step 3.
7. Say "right" and how many tries it took.

Now go through the plan and ask for every step: which part of c0de does this?

| Step | What c0de uses                                | Learned in                                                                                            |
| ---- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1    | a function `secretNumber` with RANDOM and INT | [Your own functions](/tutorials/learning/functions), [Using libraries](/tutorials/learning/libraries) |
| 2    | CLS, COLOR and PRINT                          | [Colors and the screen](/tutorials/learning/colors)                                                   |
| 3    | INPUT on the laptop                           | [Asking the player](/tutorials/learning/asking)                                                       |
| 4    | a variable `tries` and ASSIGN                 | [Remembering things](/tutorials/learning/variables)                                                   |
| 5    | two IFs                                       | [Making decisions](/tutorials/learning/decisions)                                                     |
| 6    | a REPEAT loop                                 | [Loops with a condition](/tutorials/learning/condition-loops)                                         |
| 7    | COLOR and PRINT again                         | [Colors and the screen](/tutorials/learning/colors)                                                   |

Steps 3 to 6 are the **game loop**: they repeat until the guess is right. Step 3 has to happen at least once, so REPEAT fits better than WHILE: REPEAT runs its block first and checks its condition at the end.

## The program

The program `guess` goes on a new sheet.

<<< @/tutorials/programs/learning/guess-the-number-guess.c0de

<!-- screenshot: guess-the-number-sheet | the whole program guess on its sheet, seen from above at the south end, with the function secretNumber at the top and the REPEAT loop of the function play below it -->

## Building it

Every line uses blocks you know. Build the program part by part, along the plan:

- Lines 0 to 3: PROGRAM `guess`, NOOP, `INCLUDE c0de/math` and the NOOP for the first function.
- Lines 4 to 13 (step 1): the function `secretNumber` with one RESULT `number`. It works like the die of the last lesson, with 100 instead of 6.
- Lines 14 to 19: NOOP, FUNCTION `play`, BEGIN and three INTEGER variables: `secret`, `guess` and `tries`.
- Lines 20 and 21: CALL `secretNumber`, with the RESULT line `number secret`: the result `number` goes into the variable `secret`.
- Lines 22 to 26 (step 2): clear the screen and print the hello in yellow.
- Line 27: a **REPEAT** block at x=6, and in line 28 its BEGIN.
- Lines 29 to 31 (steps 3 and 4): INPUT into `guess`, and `ASSIGN tries tries + 1 ;`.
- Lines 32 to 45 (step 5): two IF blocks, each with its own BEGIN and END IF.
- Line 46 (step 6): END at x=6, a REPEAT block, then `guess ≠ secret ;`.
- Lines 47 to 50 (step 7): the green message.
- Line 51: END FUNCTION.

Take your time with the indentation: the lines inside the REPEAT are one block further east than the REPEAT, and the lines inside each IF one more. The line numbers tell you if something is wrong.

## Running it

Open the laptop and click Program and Function until they show `guess` and `play`, then ✔. Set the trigger block to the same program and function, and press the button.

The laptop shows the hello, and the input line below the screen asks `INPUT guess (INTEGER):`. Type a number and press Enter. A game can look like this:

```
I am thinking of a number from 1 to 100.
50
50 is too low. Go higher!
75
75 is too low. Go higher!
90
90 is too high. Go lower!
85
85 is too low. Go higher!
89
Right! You needed 5 tries.
```

The lines you type appear on the screen too. "Too low" is aqua, "too high" is light purple, and the last line is green.

<!-- screenshot: guess-the-number-laptop | the terminal of the laptop during a game: the yellow hello, guesses with aqua and light purple answers, and the green line "Right! You needed 5 tries." -->

If you type something that isn't a whole number, like `abc` or `4.5`, the laptop answers with a line starting with `?` and waits for a new try. INPUT only takes values that fit the type of the variable.

## How it works

- **The secret number.** RANDOM gives a number from 0 up to below 1. Times 100 plus 1 makes it a number from 1 up to below 101. INT rounds it down, so `number` is a whole number from 1 to 100. Because this is a function of its own, `play` only needs one CALL line for it – and the plan's step 1 is one clear piece of the program.
- **The game loop.** REPEAT runs its block, then checks `guess ≠ secret ;` after END REPEAT. As long as that is true – the guess is wrong – it runs the block again. When you find the number, the condition is false, and the cursor goes on below the loop.
- **Counting.** `tries` starts at 0. Each run of the loop adds 1, so after the loop it holds the number of guesses.
- **Two IFs.** A guess is either too small, too big or right. The first IF handles "too small", the second "too big". If the guess is right, neither runs, and the loop ends.
- **Colors.** Each message gets its color right before it is printed, so the player sees at a glance what happened.

The plan was worth it: every step became a few lines, and when something goes wrong, you know which part to look at.

## Try it yourself

1. Play several games in a row, and keep a **high score**: the fewest tries of all games since you pressed the button. After each game, ask "Play again?" and start a new game if the player types `yes`.

::: details Solution
The game becomes a function `round`, which returns the number of tries. `play` calls it in a second REPEAT loop around it, keeps the best result in `best`, and asks with an INPUT into a STRING variable whether to play again. `best` starts at 0, which means "no game yet".

<<< @/tutorials/programs/learning/guess-the-number-highscore.c0de

After a first game with 5 tries and a second with 4, the laptop shows "High score: 4 tries". When you type `no`, the program ends. The high score only lives as long as the program runs: the next button press starts with a new one.
:::

2. Make the game harder: the player has only 7 tries. After the seventh wrong guess, the laptop says "No tries left." and tells the secret number.

::: details Solution
The loop goes on only while the guess is wrong **and** fewer than 7 tries were used. After the loop, an IF decides whether the player won or ran out of tries.

<<< @/tutorials/programs/learning/guess-the-number-limit.c0de

With a clever plan, 7 tries are always enough: guess the middle (50), then the middle of the half that is left (25 or 75), and so on. Each guess halves the numbers that are left – just like in the lesson about halving.
:::

## Read more

- [WHILE and REPEAT](/c0de/guide/language#while-and-repeat) and [IF and ELSE](/c0de/guide/language#if-and-else) in the guide
- [Talking to players](/c0de/guide/running-programs#talking-to-players) in the guide
- [INPUT](/c0de/reference/functions#input), [PRINT](/c0de/reference/functions#print) and [COLOR](/c0de/reference/functions#color) in the handbook Functions, and the [Laptop](/c0de/reference/devices#laptop) in the handbook Devices
- [RANDOM](/c0de/math/random) and [INT](/c0de/math/int)
