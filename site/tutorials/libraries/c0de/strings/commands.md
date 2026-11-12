---
description: A laptop that understands typed commands like "say hello" and "sum 3 4" – splitting a line with INSTR and MID, numbers from text with VAL and STR, and a word filter with REPLACE.
---

# Reading commands

A terminal on a laptop that understands commands: `say hello` writes `hello`, `sum 3 4` writes `3 + 4 = 7`, and `quit` ends it. Along the way, `say` hides every `creeper` behind stars, and a command it doesn't know gets a friendly `?`.

**Functions:** [INSTR](/c0de/strings/instr), [MID](/c0de/strings/mid), [REPLACE](/c0de/strings/replace), [VAL](/c0de/strings/val), [STR](/c0de/strings/str), and [FIX](/c0de/math/fix) of c0de/math

::: info What you need
A trigger block with a button and a **laptop**. The program has no parameters and no results, so the trigger block needs no items.
:::

## The idea

INPUT reads a whole line into a STRING. To understand it, the program cuts it into words: the first word is the command, the rest are its arguments. INSTR finds the first space, and MID takes the text in front of it and the text behind it.

Numbers arrive as text, too: `"3"` is not 3. VAL reads a number from a text and says whether it is a whole number; STR goes the other way and turns a number into a text again. A text that is no number at all makes VAL raise an error, which the program catches to answer with a `?` instead of crashing.

## The program

<<< @/tutorials/programs/libraries/strings/commands-terminal.c0de

## Building and running it

1. Place the laptop, right-click it, click the buttons until they show `commands` and `terminal`, and click ✔.
2. Set the trigger block to the same program and function and press the button.
3. Open the laptop. Below the screen, the input line shows `INPUT line (STRING):`. Type the commands one by one and press Enter after each:

```
say hello
say a creeper and another creeper
sum 3 4
sum 3 four
dance
quit
```

The screen shows each line you typed and the answer below it:

```
Commands: say <text>, sum <a> <b>, quit
say hello
hello
say a creeper and another creeper
a ******* and another *******
sum 3 4
3 + 4 = 7
sum 3 four
? sum needs two whole numbers
dance
? unknown command: dance
quit
Bye!
```

<!-- screenshot: commands-laptop | the terminal of the laptop after the run: the typed commands say, sum and dance with their answers, and Bye! at the end -->

`sum 2.5 1` and `sum 12` get the same `?` as `sum 3 four`.

## How it works

- `split` is the heart of the program. INSTR returns the position of the first space, or -1 if there is none – then the whole line is the word. Otherwise MID with `start` 0 and `length space` gives the word, and MID with `start space + 1` and no `length` gives the rest of the line. Positions start at 0, so the position of the space is also the length of the word in front of it.
- The main loop calls `split` once and compares the word. There is no ELSE IF, so a third IF catches everything that is neither `say` nor `sum` nor `quit`.
- `say` looks for `creeper` with INSTR. REPLACE overwrites the 7 characters at that position with 7 stars; it never changes the length of a text, so the positions after it stay the same. The next INSTR starts the search at `found`, and when it returns -1, the WHILE loop ends.
- `sum` uses `split` again to cut its arguments into two numbers. VAL gives a FLOAT `value` and a BOOLEAN `isInteger`. `"four"` is no number: VAL raises INVALID_ARGUMENT, and the error variable `problem` on the CALL line catches it. `sum 12` has no second number, and VAL of the empty text fails the same way. `2.5` is a number, but `isInteger` is false.
- VAL always gives a FLOAT, so FIX of c0de/math turns the sum into an INTEGER. STR then makes it a text – the same text that `⊕` would make, but in a variable of its own, which you can measure with LEN, cut with LEFT or pass to any function that wants a STRING.
## Try it yourself

1. Accept commands in any case: `SAY Hello` and `Sum 3 4` should work too.

::: details Solution
<<< @/tutorials/programs/libraries/strings/commands-case.c0de

LCASE of the [name board](/tutorials/libraries/c0de/strings/name-board) turns the word into small letters right after `split`. The rest of the line keeps its case, so `SAY Hello` writes `Hello`.
:::

2. Let `sum` add any number of numbers: `sum 1 2 3 4` writes `= 10`.

::: details Solution
<<< @/tutorials/programs/libraries/strings/commands-sum.c0de

The loop splits off one number after the other until `numbers` is empty: `split` puts the first number into `number` and the rest back into `numbers`. `sum 1 x 3` answers `? not a whole number: x`.
:::

## Read more

- [c0de/strings](/c0de/strings/): [INSTR](/c0de/strings/instr), [MID](/c0de/strings/mid), [REPLACE](/c0de/strings/replace), [VAL](/c0de/strings/val), [STR](/c0de/strings/str)
- [FIX](/c0de/math/fix) of c0de/math
- [Errors](/c0de/guide/language#errors): catching an error with an ERROR variable on the CALL line
- [INPUT](/c0de/reference/functions#input) and the [laptop](/c0de/reference/devices#laptop)
