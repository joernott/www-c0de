---
description: Text on display walls, laptops and tablets, the keyboard with INPUT and INKEY, values out through I/O blocks – and which device answers which function.
---

# Screens, keyboards and I/O blocks

A c0de program has no stdin and stdout. It talks to players through devices that you bind to a program and a function: screens show what PRINT writes, laptops and tablets take keys and typed lines, and I/O blocks pass values in and out as items. The screen functions come from AmigaBASIC, so if you know `LOCATE` and `INKEY$`, you know most of this lesson.

::: info What you need
A trigger block with a button, a **laptop** (or a tablet) and an uninitialized **variable item** for the result. Optionally a **display wall** of 2 × 1 display blocks, which shows the same screen. For the exercises: an **I/O block** and a few more uninitialized variable items.
:::

## The model

- **Devices are bound, not opened.** Right-click a display block, laptop or I/O block (or left-click with a tablet), pick the program and the function with the two buttons and click ✔. A process works with every device bound to its program and its entry function. There are no handles or file descriptors.
- **One output, many screens.** PRINT, CLS, LOCATE and COLOR act on all bound screens at once, each in its own size: a display block has 16 × 8 characters, a laptop 48 × 20. Several processes of the same program and function share the devices.
- **Rows and columns start at 0.** At the end of a row, text continues in the next one; below the last row, the screen scrolls up.
- **The device bound first answers.** CSRLIN and POS return the cursor of the screen of the device bound first (0 without a screen).
- **Without devices, nothing breaks.** Without a bound screen, PRINT does nothing, and INKEY always returns the empty string.

| Function                  | Does                                                            | Devices                                    |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------ |
| PRINT, CLS, LOCATE, COLOR | write, clear, move the cursor, set the colors                   | display walls, laptops, tablets            |
| CSRLIN, POS               | the row and column of the cursor                                | the screen bound first                     |
| INKEY                     | the oldest key typed while no INPUT waits, or `""`; never waits | laptops, tablets                           |
| INPUT                     | reads one value into a variable; waits                          | I/O blocks first, then laptops and tablets |
| WRITE                     | puts a value into an I/O block as a variable item; waits        | I/O blocks only                            |

## The program

A counter with a keyboard menu: `+` adds one, `-` takes one, `q` quits and returns the count.

<<< @/tutorials/programs/programmers/screens-menu.c0de

The same in BASIC:

```basic
CLS
COLOR 14 : PRINT "== Counter =="
COLOR 15 : PRINT "+ add one, - take one, q quit"
row = CSRLIN
DO
  IF k$ = "+" THEN count = count + 1
  IF k$ = "-" THEN count = count - 1
  LOCATE row, 1 : PRINT "Count: "; count; "   "
  DO : k$ = INKEY$ : LOOP WHILE k$ = ""
LOOP WHILE k$ <> "q"
```

## Running it

Bind the laptop (and the display wall, if you built one) to the program `counter` and the function `menu`. Set the trigger block to the same program and function, put the uninitialized variable item into it and press the button.

Open the laptop and type `+`, `+`, `+`, `-`, `+` and `q`. The screen shows the menu and `Count: 3`, then `Bye!` in gray, and the output inventory of the trigger block gets the item `count` with the value 3. Keys that the menu doesn't know, like `x`, only redraw the count.

## How it works

- `CALL CSRLIN` remembers the row below the menu, so the count goes there however long the menu gets. PRINT always ends the line, so the cursor is at column 0 of the next row.
- `LOCATE` moves the cursor back to that row before every PRINT. PRINT overwrites only the characters it writes; the three spaces after the count wipe out the rest of a longer number, like the `0` of `10` when it becomes `9`.
- INKEY doesn't wait. The inner REPEAT loop asks for a key until there is one. The cursor moves one line per tick, so this loop doesn't block the server; it keeps the process busy until a key comes.
- REPEAT runs its block once and repeats it **while** the condition after `END REPEAT` is true – it is a do-while, not BASIC's `REPEAT … UNTIL`.
- `count` is a result, so it starts at 0 and goes to the output inventory when the function ends.

## Who reads what

**INPUT** reads one value into a variable. It looks for it in this order:

1. The input inventories of the bound I/O blocks, in the order they were bound: a variable or constant item with the name and the type of the variable, or a literal item of its type (whatever the variable is called).
2. A line typed on a bound laptop or tablet. The input line only works while an INPUT waits and shows what it asks for, like `INPUT count (INTEGER):`. The text is read like the value of a LITERAL block, and as JSON for arrays, hashes and structs. Text that doesn't fit the type is refused with a line starting with `? `, and INPUT keeps waiting.

The used item moves to the output inventory of the I/O block: a variable item uninitialized, a constant item unchanged, a literal item without its value.

**INKEY** gets the keys typed on a laptop or tablet _while no INPUT waits_, the oldest first. Enter arrives as CHR 13. Keys typed into the input line of a waiting INPUT belong to INPUT.

**WRITE** gives a value to every bound I/O block that has an uninitialized variable item in its input inventory: the item is taken, and a variable item with the value goes into the output. The item is named after the parameter `name`, else after the variable (`PARAMETER value count ;` gives `count`), else `output`. If no bound I/O block has an uninitialized item, the cursor waits on the CALL line until a player puts one in. Laptops and tablets don't take part in WRITE.

## Differences you'll trip over

- PRINT always ends the line; there is no `PRINT a;` to stay on it – the `;` ends the expression. Join values with `⊕`, or use LOCATE.
- Rows and columns start at 0, not at 1 as in BASIC.
- LOCATE and PRINT don't clear the rest of the row. Pad with spaces, or CLS and draw everything again.
- INKEY returns a STRING, not a CHAR, and `""` when no key is waiting. A loop that waits for a key is your job.
- INPUT has no prompt parameter: PRINT the question first. Its parameter is the variable itself, by reference – a single name without index, not a constant or loop variable.
- INPUT asks the I/O blocks first. A matching item that is still lying in a bound I/O block answers before the player can type.
- WRITE waits for an uninitialized variable item. Without a bound I/O block that has one, the process hangs on that line.
- All bound screens get the same output. Binding a device again clears its screen.
- COLOR takes 0 to 15 (the constants `COLOR_BLACK` to `COLOR_WHITE`); anything else raises INVALID_ARGUMENT. Background 0 is the color of the screen.

## Try it yourself

1. Add a key `s` that sets the count: the program waits for a number from the laptop's input line (or a variable item `count` in a bound I/O block).

::: details Solution
<<< @/tutorials/programs/programmers/screens-set.c0de

INPUT writes into `count` directly. With the keys `+`, `s`, the line `41` and the keys `+`, `q`, the result is 42.
:::

2. When the player quits, also put the count into an I/O block as an item named `total`.

::: details Solution
<<< @/tutorials/programs/programmers/screens-write.c0de

Bind an I/O block to `counter` / `menu` and put an uninitialized variable item into its input. After `+`, `+`, `q`, its output holds `total` = 2. Without the item, the process waits on the WRITE line and doesn't print `Bye!`.
:::

3. Start the program with no laptop bound. What happens?

::: details Solution
INKEY always returns `""`, so the inner loop never ends. The process runs until you abort it: shift-right-click its PID block with the debugging tool.
:::

## Read more

- [Devices](/c0de/reference/devices): display blocks, laptops, tablets, I/O blocks and literal items
- [Input and output](/c0de/reference/functions#input-and-output): PRINT, WRITE, INPUT and the screen functions
- [Talking to players](/c0de/guide/running-programs#talking-to-players) and [Aborting a process](/c0de/guide/running-programs#aborting-a-process)
