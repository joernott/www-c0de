---
description: The welcome sign shows the name of your base from a constant and the year from a variable – named boxes for values.
---

# Remembering things: variables

Your base has a name: Oak Hill. Today the sign says "Welcome to Oak Hill!" and, below it, the year you founded the base. Both values get a name in the program, so you can change them in one place.

::: tip New words

- **Value**: a piece of data, like the number 2026 or the text "Oak Hill".
- **Variable**: a box with a name that holds one value. You can put a new value into it at any time.
- **Constant**: a box with a name whose value is fixed. It never changes while the program runs.
- **Type**: the kind of value a box holds, like whole numbers (INTEGER) or text (STRING).
  :::

::: info What you need
The sign of the last lesson. Language blocks: CONSTANT, VARIABLE, ASSIGN, NOOP, LABEL, LITERAL, OPERATOR, a STRING and an INTEGER type block, and the hammer.
:::

## The idea

Think of the chests in your storage room. Each has a sign on it: "Cobblestone", "Wood", "Food". You don't have to remember what is in each chest; you look for the name.

A **variable** is such a chest in your program. It has a name, and it holds one **value**. When the program needs the value, it uses the name. You can put a new value into it at any time; the old one is gone then.

A **constant** is a chest that is locked once it is filled. Its value is set when you build the program and stays the same.

Chests in Minecraft take any item. Boxes in c0de don't: each has a **type**, and it only takes values of that type. A box for whole numbers (INTEGER) can't hold text (STRING), just like a furnace's fuel slot doesn't take a sword.

## The program

The program stays on the same sheet and replaces the colored sign.

<<< @/tutorials/programs/learning/variables-sign.c0de

## Building it

The program is getting longer, so here are only the new and changed lines. Use the hammer to insert empty lines (right-click a line), as in the last lesson.

- Line 2: a CONSTANT block at x=5, a LABEL `BASE`, a STRING type block and a LITERAL of type STRING with the text `Oak Hill`.
- Line 3: a CONSTANT block, a LABEL `FRAME`, a STRING type block and a LITERAL with 32 equal signs.
- Line 4: the NOOP that was line 2. The FUNCTION, now in line 5, still needs it right above it.
- Line 7: a VARIABLE block at x=6, a LABEL `year` and an INTEGER type block.
- Line 8: an ASSIGN block at x=6, a LABEL `year`, a LITERAL 2026 of type INTEGER and an OPERATOR `;`.
- Lines 13 and 34: replace the LITERAL with the equal signs by a LABEL `FRAME`.
- Line 21: a PARAMETER `value`, then a LITERAL `Welcome to ` (with a space at the end), an OPERATOR `⊕`, a LABEL `BASE`, an OPERATOR `⊕`, a LITERAL `!` of type STRING and an OPERATOR `;`.
- Lines 22 to 24: a CALL `LOCATE` with `row` 4 and `column` 8.
- Lines 25 and 26: a CALL `COLOR` with `foreground` `COLOR_WHITE`.
- Lines 27 and 28: a CALL `PRINT` with the `value` `"Founded in " ⊕ year ;`.

<!-- screenshot: variables-sign | the top of the program "sign" on its sheet, seen from above: the CONSTANT lines, the VARIABLE and ASSIGN lines inside the function -->

## Running it

Press the button at the entrance. The wall shows:

```text
================================


      Welcome to Oak Hill!
        Founded in 2026

================================
```

<!-- screenshot: variables-result | the display wall at the entrance showing "Welcome to Oak Hill!" in yellow on blue and "Founded in 2026" in white, between the gold lines -->

## How it works

- `CONSTANT BASE STRING "Oak Hill"` makes a constant named `BASE`, of the type STRING (text), with the value "Oak Hill". It stands at x=5, outside the function, so the whole program can use it. Constants are usually written in capitals, so you can tell them from variables.
- `CONSTANT FRAME …` holds the line of equal signs. The program uses it twice. If you want a line of stars instead, you change it in one place only.
- `VARIABLE year INTEGER` makes a variable named `year` that holds whole numbers. It starts with 0.
- `ASSIGN year 2026 ;` puts the value 2026 into it. ASSIGN means "store". The `;` ends the value, like in a PARAMETER line.
- `"Welcome to " ⊕ BASE ⊕ "!"` builds one text from three parts. `⊕` joins values into text: the text "Welcome to ", the value of the constant `BASE` and an exclamation mark.
- `"Founded in " ⊕ year` joins a text and a number. `⊕` turns the number into text: "Founded in 2026".

The program doesn't print the word "year". It prints the value in the box with that name. That is the whole trick of variables.

## Try it yourself

1. You founded your base a year later. Change the year, and watch the sign change.

::: details Solution
Right-click the LITERAL in line 8 with an empty hand and enter 2027. Press the button: the sign says "Founded in 2027". Only one block changed; the PRINT line stays the same, because it uses the name `year`.
:::

2. Try to give the base a new name inside the function: add the line `ASSIGN BASE "Stone Hill" ;` after line 8. What happens?

::: details Solution
The line number turns dark red. A constant can't be changed. The debugging tool, right-clicked on the line, tells you so: the constant `BASE` can't be changed. To rename the base, change the LITERAL in line 2 instead, and remove the new line again.
:::

3. In line 8, change the type of the LITERAL to STRING, so it holds the text "2026" instead of the number 2026. Press the button. What happens?

::: details Solution
The trigger block plays a low note, and the sign doesn't change: the program **crashed** in line 8, before it cleared the screen. Its dialog shows the error TYPE_MISMATCH: a STRING doesn't fit into an INTEGER. The box `year` only takes whole numbers, and "2026" in quotes is text, even if it looks like a number. Set the type back to INTEGER.
:::

## Read more

- [Variables and constants](/c0de/guide/language#variables-and-constants) and [Types](/c0de/guide/language#types) in the guide
- [ASSIGN](/c0de/guide/language#assign) and the operator [⊕](/c0de/guide/language#operators)
- [VARIABLE](/c0de/reference/data#variable) and [CONSTANT](/c0de/reference/data#constant) in the handbook
