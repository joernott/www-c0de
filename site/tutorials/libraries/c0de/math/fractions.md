---
description: Sharing the items of a chest fairly between players with DIV and the remainder, the average of a list with TO_FLOAT and ROUND, and how ROUND, INT and FIX differ for negative numbers.
---

# Whole numbers and fractions

Three players found a chest with 100 diamonds. How many does each get, and how many are left? How many items do your chests hold on average? Integers answer the first question, FLOATs the second – and turning one into the other is where the surprises are.

**Functions:** [DIV](/c0de/math/div), [ROUND](/c0de/math/round), [TO_FLOAT](/c0de/math/to_float), [INT](/c0de/math/int) and [FIX](/c0de/math/fix)

::: info What you need
A trigger block with a button and a **display block**. For `share`, the **variable items** `items` and `players` of type INTEGER and two uninitialized items; for `average`, a variable item `counts` of type ARRAY INTEGER and two uninitialized items; for `compare`, a variable item `value` of type FLOAT and three uninitialized items.
:::

## The idea

c0de has two kinds of numbers. An INTEGER counts things that can't be split, like diamonds. A FLOAT measures things that can, like an average. The operator `/` always gives a FLOAT: 100 / 3 is 33.333…. For sharing items you need the whole-number answer instead, and that is DIV: 100 DIV 3 is 33. The operator `\` gives the remainder, 1.

Going the other way, a FLOAT becomes an INTEGER in one of three ways, and they only agree for positive numbers without a .5:

| Value  | ROUND (nearest) | INT (down) | FIX (cut off) |
| ------ | --------------- | ---------- | ------------- |
| 2.5    | 2               | 2          | 2             |
| -2.5   | -2              | -3         | -2            |
| -12.85 | -13             | -13        | -12           |

ROUND sends a .5 to the even neighbor, so 2.5 becomes 2 and 3.5 becomes 4. Over many numbers, that rounds up as often as down.

## The program

<<< @/tutorials/programs/libraries/math/fractions-share.c0de

## Building and running it

Bind the display block to the program `fairshare` and the function you want to try, and set the trigger block to the same function.

- **`share`**: with `items` = 100 and `players` = 3, the results are `each` = 33 and `rest` = 1, and the display shows `3 players get 33 each, 1 left`.
- **`average`**: with `counts` = `[12, 7, 9, 3]`, the results are `exact` = 7.75 and `rounded` = 8, and the display shows `4 chests, average 7.75, about 8`. An empty list gives 0.0 and 0.
- **`compare`**: with `value` = -12.85, the results are `rounded` = -13, `down` = -13 and `cut` = -12. Try 2.5 and -2.5, too.

With `players` = 0, `share` crashes with DIVISION_BY_ZERO: nobody can share with no one. The same happens with `/` and `\`.

## How it works

- **DIV rounds towards 0.** For positive numbers, that is the number of full shares. `rest` is what `\` leaves over, so `each * players + rest` is always `items` again.
- **TO_FLOAT makes the sum a FLOAT.** `sum` counts items, so it is an INTEGER. Strictly, `/` would turn it into a FLOAT by itself, and so would an ASSIGN to a FLOAT variable; TO_FLOAT says it explicitly. It matters where c0de doesn't convert: `⊕` writes the INTEGER 31 as `31`, the FLOAT as `31.0`.
- **The empty list.** Without the IF, `total / size` would divide by 0. RETURN leaves the function with the default values of its results, 0.0 and 0.
- **ROUND for "about".** `rounded` is the nearest whole number of items. For an average of 7.5, it would be 8, for 6.5 it would be 6 – the even neighbor.

## Try it yourself

1. 100 diamonds for 3 players leave 1 over. Give the rest to the first players, one each, so nothing is left: 34, 33 and 33.

::: details Solution
A FOR loop gives everybody `each`, and the first `rest` players one more. With 30 items for 4 players, `shares` is `[8, 8, 7, 7]`.

<<< @/tutorials/programs/libraries/math/fractions-split.c0de

:::

2. A shared account is 7 emeralds in debt: -7. Halving the debt with DIV gives -3, but INT of -7 / 2 gives -4. Which is right?

::: details Solution
Both are, for different questions. -7 / 2 is -3.5. DIV rounds towards 0 like FIX, so it says "each of two players owes 3 whole emeralds, and 1 is left". INT rounds down, so it says "the debt of each, rounded to the worse side, is 4". For counting items, DIV and `\` belong together: `-3 * 2 + -1` is -7 again.
:::

## Read more

- The handbook pages of [DIV](/c0de/math/div), [ROUND](/c0de/math/round), [TO_FLOAT](/c0de/math/to_float), [INT](/c0de/math/int) and [FIX](/c0de/math/fix)
- [Rounding](/c0de/guide/libraries#rounding) in the guide
- [Operators](/c0de/guide/language#operators) and [Expressions](/c0de/guide/language#expressions): `/` and `\`
- [Expressions and statements](/tutorials/programmers/expressions) in the path "c0de for programmers"
