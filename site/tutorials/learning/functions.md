---
description: A function of your own that draws a frame around any text, used three times on the welcome sign – splitting a problem into parts you can reuse.
---

# Your own functions

The welcome sign of Oak Hill should look fancy: every text in a frame of stars. A frame takes several lines of code: count the letters, build a line of stars, print three rows. Writing all that three times would be long and boring, and every mistake would be there three times too. Today you write the frame once, as your own function, and use it as often as you like.

::: tip New words

- **function**: a named piece of a program that does one job. You have written entry functions since your first program; now you write one that another function calls.
- **call**: running a function from another function with CALL. When it is done, the cursor comes back to the line after the CALL.
- **default value**: the value a parameter gets when the caller leaves it out.
- **RETURN**: ends a function early.
  :::

::: info What you need

- your display wall of 2 × 1 display blocks and the trigger block with its button
- a new, empty sheet in the c0de dimension
- from the creative inventory: the blocks you know (with PARAMETER, RESULT, IF and FOR) and the new **RETURN** block
  :::

## The idea

Think of a recipe book. The recipe for a cake says "make a dough (see page 12)". Page 12 explains the dough once, and every recipe that needs a dough points to it. If you find a better dough, you change one page, and every cake gets better.

A **function** is such a page. It has a name, it does one job, and other parts of the program **call** it when they need that job done. Like a recipe that says "dough for 2 people", a call can pass details: the **parameters**. And like the dough that comes back to the cake, a function can hand back **results**.

You know this from the outside already: CLS, PRINT and LOCATE are functions that come with c0de, and your entry functions got parameters and results from variable items. Today you write a function that your own program calls.

## The program

The program `frame` goes on a new sheet. It has two functions: `framed` draws one frame, `welcome` uses it three times.

<<< @/tutorials/programs/learning/functions-frame.c0de

<!-- screenshot: functions-frame-sheet | the program frame on its sheet, seen from above, with the two FUNCTION lines (framed and welcome), each with a NOOP line above it, and the three CALL framed lines at the south end -->

## Building it

The program is long, but you know almost every line. The new parts:

- Lines 4 to 8: FUNCTION `framed` at x=5, then four lines at x=6: PARAMETER `text` STRING, PARAMETER `row` INTEGER with a LITERAL 0 at the end, PARAMETER `column` INTEGER with a LITERAL 0, and RESULT `width` INTEGER.
- Line 11: IF at x=6 with a LABEL `text`, an OPERATOR `=`, a LITERAL `""` (an empty text) and an OPERATOR `;`.
- Line 13: a **RETURN** block at x=7, alone.
- Lines 15 to 17: a CALL block at x=6 with a LABEL `LEN`, then PARAMETER `value` with LABEL `text` and `;`, and RESULT with the LABELs `result` and `width`, both at x=7.
- Line 39: a NOOP line. Every FUNCTION needs one right above it.
- Lines 44 to 46: a CALL block at x=6 with a LABEL `framed`, then at x=7 a PARAMETER block, a LABEL `text`, a LITERAL `"Welcome"` and an OPERATOR `;`, and a RESULT block with the LABELs `width` and `used`.
- Line 49: a PARAMETER block at x=7, a LABEL `column`, a LABEL `used`, an OPERATOR `+`, a LITERAL 1 and an OPERATOR `;`.

## Running it

Bind the display wall to the program `frame` and the function `welcome`, and set the trigger block to the same. Press the button. The frames appear one after the other, and after a few seconds the wall shows:

```
*********** ************
* Welcome * * Oak Hill *
*********** ************

**********************
* Mind the creepers! *
**********************
```

<!-- screenshot: functions-frame-wall | the display wall with the three framed texts: "Welcome" and "Oak Hill" side by side at the top, "Mind the creepers!" below -->

## How it works

The function `framed`:

- Its PARAMETER lines say what a caller can give it: a `text`, and a `row` and `column` where the frame starts. `row` and `column` have the **default value** 0. A caller who leaves them out gets the top left corner.
- Its RESULT line says what it gives back: the `width` of the frame. A result starts with the default value of its type, here 0.
- `IF text = "" ;` with `RETURN` inside: an empty text gets no frame. RETURN ends the function at once, and the cursor goes back to the caller.
- `CALL LEN` counts the letters of the text. LEN is a function that comes with c0de, and you call it like your own: `PARAMETER value text ;` gives it the text, `RESULT result width` puts its result `result` into your variable `width`. "Welcome" has 7 letters.
- The frame is 4 wider than the text: a star and a space on each side. The FOR loop builds a line of that many stars in `border`.
- Three times LOCATE and PRINT: the top line, the text between `* ` and ` *`, and the bottom line, each one row lower (`row + 1`, `row + 2`).

The function `welcome` calls it three times:

- `CALL framed` with `PARAMETER text "Welcome" ;` and nothing else: `row` and `column` are 0. `RESULT width used` stores the result `width` of `framed` in the variable `used` of `welcome`: 11.
- The second call frames `BASE` at `column used + 1`, that is column 12, next to the first frame.
- The third call frames "Mind the creepers!" at row 4. Its result isn't needed, so it has no RESULT line, and the result is thrown away.

Every call gets its own fresh variables: `border` starts empty each time. And the parameters are copies, so `framed` can't change the variables of `welcome` by accident.

A function can only call functions that are above it on the sheet. That's why `framed` comes first, and the trigger starts `welcome`.

## Try it yourself

1. Add a parameter `mark` for the frame character, with the default value `'*'`. Frame "Oak Hill" with `#` and the creeper warning with `!`.

::: details Solution
`mark` is a CHAR, a single character, written `'*'`. It replaces every `"*"` in `framed`. The first call leaves it out and gets stars.

<<< @/tutorials/programs/learning/functions-frame-mark.c0de

The wall shows the "Welcome" frame in stars, the "Oak Hill" frame in `#` and the creeper warning in `!`.
:::

2. Change the first call to `PARAMETER text "" ;`. What does the wall show, and why?

::: details Solution
The first frame is gone, and the "Oak Hill" frame starts at column 1. `framed` returned at once, so its result `width` kept its start value 0, and `used + 1` is 1.
:::

## Read more

- [Functions](/c0de/guide/language#functions), [CALL](/c0de/guide/language#call) and [RETURN](/c0de/guide/language#return) in the guide
- [FUNCTION](/c0de/reference/statements#function), [PARAMETER](/c0de/reference/statements#parameter), [RESULT](/c0de/reference/statements#result), [RETURN](/c0de/reference/statements#return) and [CALL](/c0de/reference/statements#call) in the handbook Statements
- [LEN](/c0de/reference/functions#len) and [LOCATE](/c0de/reference/functions#locate) in the handbook Functions
