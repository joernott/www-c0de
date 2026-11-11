---
description: The types of c0de – simple and complex types, literals, default values, conversions and the constants every program knows.
---

# Types and values

c0de is statically typed: every variable, constant, parameter and result has exactly one type, written as a type block after its name. There is no `null`, no implicit conversion from text to numbers and only two widenings. This lesson goes through the types, their literals and default values, the conversions between them and the constants every program knows without declaring them.

::: info What you need
A creative world with cheats on (see [Tutorials](/tutorials/)), a **trigger block**, a **wrench**, a **button** and ten **uninitialized variable items**.
:::

## The types

| c0de        | Like                                               | Literal                 | Default value            |
| ----------- | -------------------------------------------------- | ----------------------- | ------------------------ |
| BOOLEAN     | `boolean`                                          | `TRUE`, `FALSE`         | false                    |
| INTEGER     | Java `long` (signed 64 bit)                        | `42`, `-7`              | 0                        |
| FLOAT       | Java `double`                                      | `3.14`, `1.0E20`        | 0.0                      |
| CHAR        | one Unicode code point                             | `'a'`                   | a space                  |
| TIME        | Unix time in milliseconds                          | `@2026-10-19T12:05:09Z` | 1970-01-01T00:00:00Z     |
| STRING      | Java `String`                                      | `"Hello"`               | `""`                     |
| ARRAY T     | a list of T, from index 0                          | –                       | empty                    |
| HASH T      | a map from STRING keys to T                        | –                       | empty                    |
| STRUCT name | a record with named elements                       | –                       | defaults of all elements |
| ERROR       | a struct with `code`, `message`, `context`, `line` | –                       | code 0                   |

The first five are the **simple** types, the others the **complex** ones:

- **STRING** may have a length limit: `STRING 16`. A longer value raises STRING_TOO_LONG. `name[0]` reads one character as a CHAR.
- **ARRAY** and **HASH** are always followed by the type of their content, like `ARRAY INTEGER` or `HASH ARRAY STRING`. They grow and shrink by themselves, up to 8 dimensions.
- **STRUCT** is followed by the name of a struct declared above, like `STRUCT point`. Its elements are reached with `spot.x`.
- **ERROR** is the type of errors (see the lesson "Errors"); your own codes start at 1000.
- **TIME** is a point in time, not a duration. `TIME + INTEGER` adds milliseconds, `TIME - TIME` gives the milliseconds between them.

Literals exist only for the simple types and STRING. Arrays, hashes and structs get their start values from an **initializer**: a code block after the VARIABLE or CONSTANT line, with literals only, no expressions.

## The program

A function that returns one value of every type:

<<< @/tutorials/programs/programmers/types-values.c0de

## Running it

Set the trigger block to the program `typetour` and the function `values`. The function has ten results and no parameters, so put ten uninitialized variable items into its input inventory, and press the button.

The output inventory then holds ten variable items. Hold one in your main hand and right-click it: the dialog shows its name, type and value.

| Item    | Type          | Value                             |
| ------- | ------------- | --------------------------------- |
| flag    | BOOLEAN       | true                              |
| count   | INTEGER       | 1728                              |
| ratio   | FLOAT         | 3.5                               |
| letter  | CHAR          | é                                 |
| moment  | TIME          | 2026-10-19T12:05:09.250Z          |
| name    | STRING        | Steve                             |
| list    | ARRAY INTEGER | [2, 3, 5, 7]                      |
| stock   | HASH INTEGER  | {diamond: 3, gold: 12}            |
| spot    | STRUCT point  | {x: 100, y: 0, z: -250}           |
| problem | ERROR         | code 1000, message "Just a value" |

## How it works

- `STRUCT point` declares a type above the function that uses it. A name is only known below its declaration.
- The initializer of `primes` lists literals, those of `chest` and `home` one key or element and one literal per line. The element `y` of `home` isn't listed, so it keeps its default 0.
- `ASSIGN ratio 7 / 2 ;` gives 3.5: `/` always gives a FLOAT, also for two integers.
- `@2026-10-19T12:05:09Z + 250` is a TIME 250 milliseconds later.
- `ASSIGN list primes ;` copies the array. Complex values are always copied, never shared: changing `list` afterwards doesn't change `primes`.
- `problem` is an ordinary variable of type ERROR. Returning it as a result doesn't raise anything; only RETURN with it or RAISE does.

## Conversions

c0de converts only in two directions by itself: an INTEGER fits into a FLOAT, and a CHAR into a STRING (in ASSIGN, initializers and literals). Everything else is a function call:

| From → to         | How                                                    | Example                                          |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------ |
| anything → STRING | `⊕` or `c0de/strings/STR`                              | `"n=" ⊕ 2.5` is `"n=2.5"`                        |
| STRING → number   | `c0de/strings/VAL`                                     | `"42"` gives the FLOAT 42.0 and `isInteger` true |
| FLOAT → INTEGER   | `c0de/math/INT` (down), `FIX` (cut), `ROUND` (to even) | -12.85 → -13, -12, -13                           |
| INTEGER → FLOAT   | `c0de/math/TO_FLOAT`, or just assign it                | 7 → 7.0                                          |

<<< @/tutorials/programs/programmers/types-convert.c0de

With the default `"-12.85"`, the results are `number` -12.85, `whole` false, `down` -13, `cut` -12, `back` -12.0, `shown` "-12.0" and `joined` "cut -12, whole false". With `" 42 "`, VAL ignores the spaces and returns 42.0 with `isInteger` true. With `"forty-two"`, VAL raises INVALID_ARGUMENT, and the process crashes with exit code 15.

Library functions are called with CALL, never inside an expression; the next lesson explains why.

## Built-in constants

Every program knows these constants without an INCLUDE:

| Constant                              | Type               | Content                                                                                                                                                  |
| ------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SHEET`                               | STRUCT SHEET_INFO  | the sheet of the program: `number`, `program`, `owner`, `x`, `y`, `z`                                                                                    |
| `PID`                                 | STRUCT PID_INFO    | the process: `pid`, `program`, `function`, `owner`, `activator` (who started it), `x`, `y`, `z` and `dimension` of the trigger block, `debug`, `started` |
| `CURSOR`                              | STRUCT CURSOR_INFO | the cursor right now: `line`, `function`, `depth`, `stack_used`, `stack_size`                                                                            |
| `C0DE_VERSION`                        | STRING             | the version of c0de, e.g. `"0.4.0"`                                                                                                                      |
| `COLOR_BLACK` … `COLOR_WHITE`         | INTEGER            | the 16 colors 0 to 15 of COLOR                                                                                                                           |
| `DIVISION_BY_ZERO`, `TYPE_MISMATCH` … | INTEGER            | the codes of the errors of the language                                                                                                                  |

SHEET and PID are filled when the process starts. CURSOR is different each time you read it.

## Differences you'll trip over

- Types are checked when the program runs, not while you write it: a line with `ASSIGN count 7 / 2 ;` for an INTEGER `count` is green on the sheet and raises TYPE_MISMATCH when it runs.
- There is no `null`. A variable without a start value holds the default of its type, a result too.
- An INTEGER doesn't wrap around like a Java `long`: `9223372036854775807 + 1` raises NUMERIC_OVERFLOW.
- A FLOAT divided by `0.0` raises DIVISION_BY_ZERO, unlike IEEE floats in Java, C or JavaScript. A FLOAT that gets too big still becomes `Infinity`.
- `"1" + 1` is a TYPE_MISMATCH, not `"11"` or `2`. Text is joined with `⊕`, and numbers are read from text with VAL.
- VAL always returns a FLOAT. FIX turns it into an INTEGER.
- A TIME literal without an offset, like `@2026-10-19T12:05:09`, is read in the time zone of the server. Write `Z` or `+02:00` to be sure.
- Arrays and hashes are values, not references: assigning or passing them copies them.

## Try it yourself

1. Change the type of the result `name` to `STRING 3` and run it again. What happens?

::: details Solution
`"Steve"` has 5 characters, so the ASSIGN raises STRING_TOO_LONG. The process crashes with exit code 15, and no result items are created: the items you put in come back unchanged in the output inventory.
:::

2. Write a function that returns the number of its sheet, the player who started it, the line and depth of the cursor, the number of the color red and the code of DIVISION_BY_ZERO.

::: details Solution
<<< @/tutorials/programs/programmers/types-constants.c0de

Started with a button, `starter` is your name. `line` is 13, the line of the ASSIGN that reads CURSOR, `depth` is 1 in the entry function, `red` is 12 and `failure` is 303. `sheet` is the number of the sheet you built it on.
:::

## Read more

- [The language: Types](/c0de/guide/language#types), [Literals](/c0de/guide/language#literals) and [Structs](/c0de/guide/language#structs): the types and the built-in constants in short
- [Data](/c0de/reference/data): every type block, VARIABLE, CONSTANT and LITERAL
- [VAL](/c0de/strings/val), [STR](/c0de/strings/str), [INT](/c0de/math/int), [FIX](/c0de/math/fix), [ROUND](/c0de/math/round), [TO_FLOAT](/c0de/math/to_float): the conversions
- [Running programs: Variable items](/c0de/guide/running-programs#variable-items): how items carry values in and out
