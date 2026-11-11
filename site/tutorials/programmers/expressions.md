---
description: Operators, precedence and assignments in c0de, compared with C, Java and Python – and why a function can't be called inside an expression.
---

# Expressions and statements

c0de separates statements and expressions strictly: a line is a statement, an expression is only a part of it and ends with `;`. Assignment is a statement of its own, functions are called by a statement of their own, and some operators look familiar but mean something else. This lesson compares the operators with C, Java and Python and shows where the precedence differs.

::: info What you need
A creative world with cheats on (see [Tutorials](/tutorials/)), a **trigger block**, a **wrench**, a **button** and eleven **uninitialized variable items**.
:::

## Statements and expressions

- **Every line is a statement**, and its first block is a keyword: `ASSIGN`, `CALL`, `IF` … There are no expression statements: `x + 1 ;` alone in a line isn't valid.
- **An expression ends with `;`**, an OPERATOR block. This is how c0de knows where it ends, so several expressions can share one line: `FOR i INTEGER 1 ; n ; 2 ;` has three.
- **An expression may go on in the next line**, one block further east than the first line of the statement.
- **ASSIGN is the only assignment.** `ASSIGN total total + 1 ;` – there is no `=` assignment, no `+=`, no `++`, and an assignment has no value of its own.
- **Functions are called with CALL, never inside an expression.** A CALL lists its arguments as PARAMETER lines and the variables that get its results as RESULT lines; you use the results in the next statement.

The target of an ASSIGN may have an index: `ASSIGN list[3] 10 ;`, `ASSIGN stock["gold"] 5 ;`, `ASSIGN spot.x 1 ;`. Assigning to the index right after the end of an array appends, assigning to a new key adds it to a hash.

## The operators

|                                 | C / Java                   | Python           | c0de                         |
| ------------------------------- | -------------------------- | ---------------- | ---------------------------- |
| equal, not equal                | `==` `!=`                  | `==` `!=`        | `=` `≠`                      |
| less or equal, greater or equal | `<=` `>=`                  | `<=` `>=`        | `≤` `≥`                      |
| division                        | `/` (integer for two ints) | `/`              | `/` (always FLOAT)           |
| integer division                | `/`                        | `//`             | `c0de/math/DIV` (a function) |
| remainder                       | `%`                        | `%`              | `\`                          |
| power                           | `Math.pow`, `pow`          | `**`             | `^`                          |
| join text                       | `+`                        | `+`              | `⊕`                          |
| logic                           | `&&` `\|\|` `!`            | `and` `or` `not` | `AND` `OR` `NOT`, and `XOR`  |
| bits                            | `&` `\|` `^` `~`           | `&` `\|` `^` `~` | `&` `\|` `⊻` `¬`             |
| shift                           | `<<` `>>`                  | `<<` `>>`        | `←` `→`                      |
| assignment                      | `=`                        | `=`              | the statement ASSIGN         |

The precedence, from highest to lowest:

1. `( )`
2. `¬`
3. `NOT`
4. `^` (from right to left: `2 ^ 3 ^ 2` is `2 ^ 9`)
5. unary `-`
6. `*` `/`
7. `\`
8. `+` `-`
9. `←` `→`
10. `⊕`
11. `=` `≠` `<` `>` `≤` `≥`
12. `&`
13. `⊻`
14. `|`
15. `AND`
16. `XOR`
17. `OR`

Most of it is as in C. Four places are not: `\` binds weaker than `*`, `⊕` weaker than `+`, `NOT` stronger than the comparisons, and the bit operators weaker than the comparisons (as in C, but not as in Python).

## The program

A function whose results show one rule each:

<<< @/tutorials/programs/programmers/expressions-operators.c0de

## Running it

Set the trigger block to the program `operators` and the function `operators`, put eleven uninitialized variable items into its input inventory and press the button. Right-click the result items to read them:

| Result    | Expression                   | Value      | Why                                                                      |
| --------- | ---------------------------- | ---------- | ------------------------------------------------------------------------ |
| remainder | `-7 \ 2`                     | -1         | the remainder has the sign of the dividend, as in C and Java (Python: 1) |
| power     | `2 ^ 3 ^ 2`                  | 512        | `^` is evaluated from right to left                                      |
| half      | `2 ^ -1`                     | 0.5        | a negative exponent gives a FLOAT                                        |
| order     | `7 \ 4 * 2`                  | 7          | `*` before `\`: `7 \ 8` (C and Python: 6)                                |
| joined    | `"Total: " ⊕ 2 + 3`          | "Total: 5" | `+` before `⊕` (Python, JavaScript: "Total: 23" or an error)             |
| same      | `"a" ⊕ 1 = "a1"`             | true       | `⊕` before `=`                                                           |
| before    | `"Z" < "a"`                  | true       | text is compared by Unicode code points                                  |
| flags     | `1 ← 4 \| 12 & 10`           | 24         | `←` first, then `&`, then `\|`: `16 \| 8`                                |
| inverted  | `¬ 0`                        | -1         | bitwise negation of a 64 bit integer                                     |
| safe      | `zero ≠ 0 AND 10 / zero > 1` | false      | AND stops after a false left side, so there is no division by zero       |
| total     | `1 + 2 + 3` … `+ 4 + 5`      | 15         | the expression goes on in the next line                                  |

## Integer and float arithmetic

The type of a result follows from the types of the operands: two INTEGERs give an INTEGER, a FLOAT on either side gives a FLOAT. Two operators break this rule: `/` always gives a FLOAT, and `^` gives a FLOAT for a negative exponent. `\` only takes INTEGERs.

<<< @/tutorials/programs/programmers/expressions-numbers.c0de

| `a`, `b` | quotient                    | whole (DIV) | floor (INT) | rest | check | exact |
| -------- | --------------------------- | ----------- | ----------- | ---- | ----- | ----- |
| 7, 2     | 3.5                         | 3           | 3           | 1    | true  | false |
| -7, 2    | -3.5                        | -3          | -4          | -1   | true  | false |
| 7, 0     | DIVISION_BY_ZERO in line 14 |             |             |      |       |       |

- DIV and `\` belong together like `/` and `%` in C and Java: they round towards zero, and `whole * b + rest = a` is always true. Python's `//` and `%` round down instead; INT of the quotient does that.
- DIV is a function of `c0de/math`, so it needs a CALL and a variable for its result. The same goes for INT: an expression can only combine values that are already there.
- `0.1 + 0.2 = 0.3` is false, as everywhere with binary floating point numbers.
- With `b` = 0, the first line already raises DIVISION_BY_ZERO: `/` doesn't return `Infinity`, not even for FLOATs.

## Differences you'll trip over

- `=` compares. `ASSIGN a b = c ;` stores whether `b` equals `c` in `a`.
- `^` is the power, not the bitwise XOR of C, Java and Python. That one is `⊻`.
- `7 \ 4 * 2` is 7, not 6: `\` binds weaker than `*` and `/`.
- `NOT a = b` is `( NOT a ) = b`, a TYPE_MISMATCH for numbers. Write `a ≠ b` or `NOT ( a = b )`.
- `flags & 4 = 4` is `flags & ( 4 = 4 )`, a TYPE_MISMATCH. Put brackets around bit operations: `( flags & 4 ) = 4`.
- `/` of two INTEGERs gives a FLOAT, and a FLOAT can't be assigned to an INTEGER. Use DIV, or INT, FIX or ROUND.
- There is no truthiness: an IF needs a BOOLEAN, `IF count ;` is a TYPE_MISMATCH. INTEGER and FLOAT can be compared with each other, other different types can't.
- An index is a literal or a variable, not an expression: there is no `list[i + 1]`. Calculate the index into a variable first.
- Shifting uses only the lowest 6 bits of the count, as in Java: `1 ← 64` is 1.

## Try it yourself

1. Write a function `modulo` that returns a remainder that is never negative for a positive `b`, like Python's `%`: `-7` and `2` give 1.

::: details Solution
<<< @/tutorials/programs/programmers/expressions-modulo.c0de

`-7 \ 2` is -1, plus 2 is 1, and `1 \ 2` is 1. For `-9` and `4`, the result is 3; for positive numbers, nothing changes.
:::

2. What is `NOT 1 = 2 ;`, and how do you write what was meant?

::: details Solution
NOT binds stronger than `=`, so c0de tries `NOT 1` first and raises TYPE_MISMATCH. Write `1 ≠ 2 ;` or `NOT ( 1 = 2 ) ;`, which are both true.
:::

## Read more

- [The language: Expressions](/c0de/guide/language#expressions), [Operators](/c0de/guide/language#operators) and [ASSIGN](/c0de/guide/language#assign)
- [Statements: ASSIGN](/c0de/reference/statements#assign) and [OPERATOR](/c0de/reference/statements#operator): the blocks and how to set their symbol
- [DIV](/c0de/math/div), [INT](/c0de/math/int), [FIX](/c0de/math/fix), [ROUND](/c0de/math/round): whole numbers from divisions
