---
description: A framed name board on a display wall – text in capitals, names with a capital first letter, centered with spaces and cut to the width of the screen.
---

# A name board

A board at the entrance of your base: a frame of `=` signs on a display wall, a greeting in capitals and the name of the owner in the middle. However the name is typed – `sTEVE`, `steve` or `STEVE` – the board shows `Steve`, and a name that is too long is cut off with `...`.

**Functions:** [UCASE](/c0de/strings/ucase), [LCASE](/c0de/strings/lcase), [LEFT](/c0de/strings/left), [RIGHT](/c0de/strings/right), [SPACE](/c0de/strings/space), [FILL](/c0de/strings/fill), and [DIV](/c0de/math/div) of c0de/math

::: info What you need
A trigger block with a button, a **display wall** of 2 × 1 display blocks (32 columns and 8 rows) and a **variable item** `name` of type STRING with the name, for example `sTEVE`. Optionally a second variable item `title` of type STRING for another greeting.
:::

## The idea

A screen is a grid of characters, and every row has the same width. To put a text in the middle, you need as many spaces in front of it as behind it; to draw a line, you need the same character many times. c0de/strings makes both texts for you: SPACE gives a number of spaces, FILL a number of copies of one character.

The name needs two more things. UCASE and LCASE change the case of a whole text, so a name gets its capital first letter in two parts: LEFT takes the first letter for UCASE, RIGHT the rest for LCASE. And LEFT also cuts a name that doesn't fit, so it never wraps into the next row and breaks the frame.

## The program

<<< @/tutorials/programs/libraries/strings/name-board-frame.c0de

## Building and running it

1. Build the display wall from two display blocks side by side. Right-click one of them, click the buttons until they show `nameboard` and `show`, and click ✔. The whole wall is bound.
2. Set the trigger block to the program `nameboard` and the function `show`, and put the variable item `name` into its input inventory.
3. Press the button. The wall shows:

```
+==============================+
|                              |
|    WELCOME TO THE BASE OF    |
|            Steve             |
|                              |
+==============================+
```

<!-- screenshot: name-board-wall | the display wall of 2 × 1 blocks with the frame of = signs, the greeting WELCOME TO THE BASE OF and the name Steve -->

With the name `alexander_the_great_redstone_builder` and the title `Hello`, the name row becomes `|Alexander_the_great_redston...|`.

## How it works

- `WIDTH` is the width of the wall. Everything else is computed from it, so a wall of 3 × 1 blocks needs only `WIDTH` 48.
- FILL makes the 30 `=` of the border, and `⊕` adds the corners. FILL takes a CHAR (`'='` in single quotes), not a STRING.
- UCASE turns the whole title into capitals. The result goes back into the parameter `title`, which is a copy, so the caller's value doesn't change.
- For the name, LEFT with `length` 1 gives the first letter and RIGHT with `length - 1` all the others. UCASE and LCASE treat each part, and `first ⊕ rest` joins them again.
- `center` frames one row. A text longer than the 30 inner columns is cut by LEFT to 27 characters, and `...` fills the rest. The free space is split in two with DIV of c0de/math, because `/` always gives a FLOAT. When the space is odd, the extra space goes behind the text.
- SPACE makes the gaps. With `count` 0 it gives the empty text, so a text that fills the row exactly needs no special case.
- Each row is exactly 32 characters wide and ends at the edge of the wall, so PRINT starts the next one in the row below without an empty row.

## Try it yourself

1. Let the player choose the character of the frame with a variable item `edge` of type CHAR, for example `*`.

::: details Solution
<<< @/tutorials/programs/libraries/strings/name-board-border.c0de

The parameter `edge` has the default `'='`, so the board still works without the item. With `*`, the top and bottom rows are `+******************************+`.
:::

2. A door sign: show `Room of` and the name in capitals at the right edge of the wall, without a frame.

::: details Solution
<<< @/tutorials/programs/libraries/strings/name-board-right.c0de

RIGHT can align, too: put 32 spaces in front of the text and take the last 32 characters. For `Alex` the second row is `ALEX` with 28 spaces in front.
:::

## Read more

- [c0de/strings](/c0de/strings/): [UCASE](/c0de/strings/ucase), [LCASE](/c0de/strings/lcase), [LEFT](/c0de/strings/left), [RIGHT](/c0de/strings/right), [SPACE](/c0de/strings/space), [FILL](/c0de/strings/fill)
- [DIV](/c0de/math/div) of c0de/math
- [Display block](/c0de/reference/devices#display-block): the size of display walls
- [PRINT](/c0de/reference/functions#print) and [CLS](/c0de/reference/functions#cls)
