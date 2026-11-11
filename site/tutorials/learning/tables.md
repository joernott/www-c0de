---
description: A shop on the laptop that finds the price of an item by its name, and an offer of the day made of values that belong together.
---

# Tables and your own types

Oak Hill opens a shop. Visitors type the name of an item on the laptop, and the shop tells them the price. A list from the last lesson doesn't help here: you'd have to remember that the saddle is number 2. Today you meet a **table** that finds a value by its name. And the offer of the day gets a **type of your own** that keeps the item, its price and its stock together.

::: tip New words

- **table** (in c0de: HASH): values stored under names, like the prices in a price list.
- **key**: the name under which a value is stored in a table, like "bread".
- **struct** (in c0de: STRUCT): your own type that groups values that belong together, each with its own name.
  :::

::: info What you need

- the laptop of your base, with a trigger block and a button next to it
- a new, empty sheet in the c0de dimension
- from the creative inventory: the blocks you know and the new **HASH** and **STRUCT** type blocks
  :::

## The idea

Look at the price list on the wall of a market stall:

| Item    | Price |
| ------- | ----- |
| bread   | 2     |
| torch   | 1     |
| saddle  | 12    |
| diamond | 50    |

Nobody reads it from the top to find the saddle. You look for the name, and next to it is the price. A **table** in a program works like that: every value has a name, its **key**. You ask for the key "saddle" and get 12. In c0de, such a table is called a **HASH**.

The stall also has a sign for the offer of the day: "golden apple, 20 emeralds, only 3 left". Three values that belong together. You could keep them in three variables, but they are really one thing: an offer. A **struct** is a type you make yourself for such a thing. You give it a name, `offer`, and say what every offer has: an `item`, a `price` and a `stock`.

## The program

The program `shop` goes on a new sheet.

<<< @/tutorials/programs/learning/tables-shop.c0de

<!-- screenshot: tables-shop-sheet | the program shop on its sheet, seen from above, with the STRUCT offer declaration at the top and the two VARIABLE blocks with their start values (the price table and the offer) below -->

## Building it

The new parts:

- Lines 2 to 7: the struct type. A **STRUCT** block at x=5 and a LABEL `offer`, then BEGIN at x=5, three element lines at x=6 (a LABEL `item` and a STRING type block, a LABEL `price` and an INTEGER type block, a LABEL `stock` and an INTEGER type block), and an END block at x=5 followed by a STRUCT block.
- Line 8: a NOOP line, because the FUNCTION follows.
- Line 11: a VARIABLE block at x=6, a LABEL `price`, a **HASH** type block and an INTEGER type block: a table of whole numbers.
- Lines 12 to 17: the start values of the table: BEGIN at x=6, four lines at x=7, each with a LABEL for the key and a LITERAL for the value (`bread` and 2, `torch` and 1 …), and an END block at x=6 followed by a VARIABLE block.
- Line 18: a VARIABLE block at x=6, a LABEL `today`, a STRUCT block and a LABEL `offer`.
- Lines 19 to 23: the start values of the offer, built like the table: a LABEL with the name of the element and a LITERAL with its value.
- Line 27: in the PARAMETER line, the LABELs `today.item` and `today.price`. In the LABEL dialog, `today` is the name and `.item` the index.
- Line 35: the LABEL `price[wanted]`, with the name `price` and the index `[wanted]`.

Keys and element names are LABEL blocks, so they follow the rules for names: letters, digits and the underscore, no spaces.

## Running it

Bind the laptop to the program `shop` and the function `prices`, and set the trigger block to the same. Press the button and open the laptop:

```
Offer: golden apple for 20 emeralds
Only 3 left!
What do you want to buy?
```

Type saddle and press Enter. The laptop answers "saddle costs 12 emeralds." and the program ends. Press the button again for the next customer.

<!-- screenshot: tables-shop-laptop | the laptop terminal showing the offer of the day, the question, the typed word saddle and the answer "saddle costs 12 emeralds." -->

Now try cake. The program crashes: the trigger block plays a low note, and its dialog shows the error UNKNOWN_KEY. The table has no key "cake". Exercise 2 fixes that.

## How it works

The struct:

- `STRUCT offer` declares a new type called `offer`. It stands at x=5, outside of every function, so the whole program can use it. Like a function, it must be above the lines that use it.
- `VARIABLE today STRUCT offer` makes a variable of that type. It has three elements, and the code block below gives each of them a start value.
- `today.item` reads one element: the dot says "the element `item` of `today`". `today.price` is 20, `today.stock` is 3.

The table:

- `VARIABLE price HASH INTEGER` makes a table whose values are INTEGERs. The keys are always texts.
- `price[wanted]` looks up the value under the key in `wanted`. If you typed saddle, that's `price["saddle"]`, and the answer is 12.
- A key that isn't in the table is an error: UNKNOWN_KEY. The program crashes in line 34, the CALL PRINT that needs `price[wanted]`.
- `ASSIGN price["cake"] 5 ;` would add a new key to the table, or change the price if the key exists already. A table grows by itself, like a list.

A table and a list look alike, but you find their values differently: a list by position (0, 1, 2 …), a table by name. EACH works with tables too: it goes through the keys in alphabetical order.

## Try it yourself

1. Add a discount to the offer: a new element `discount` with the value 5. Show the price minus the discount, and how much the customer saves.

::: details Solution
The struct gets a fourth element, and the offer a fourth start value. The price is calculated in the PARAMETER line: `-` comes before `⊕`.

<<< @/tutorials/programs/learning/tables-shop-discount.c0de

The laptop shows "Offer: golden apple for 15 emeralds" and "You save 5! Only 3 left!".
:::

2. Don't crash on unknown items: answer "Sorry, we don't sell cake." instead.

::: details Solution
The built-in function **HAS_KEY** asks if a table has a key. Its result is a BOOLEAN, which an IF can use.

<<< @/tutorials/programs/learning/tables-shop-unknown.c0de

With cake, the laptop answers "Sorry, we don't sell cake.". With diamond, it answers "diamond costs 50 emeralds.".
:::

## Read more

- [Types](/c0de/guide/language#types), [Variables and constants](/c0de/guide/language#variables-and-constants) and [Structs](/c0de/guide/language#structs) in the guide
- [TYPE_HASH](/c0de/reference/data#type_hash) and [TYPE_STRUCT](/c0de/reference/data#type_struct) in the handbook Data
- [HAS_KEY](/c0de/reference/functions#has_key) in the handbook Functions
- [Crashes](/c0de/guide/running-programs#crashes): what the trigger block shows when a program crashes
