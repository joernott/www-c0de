---
description: Arrays, hashes and structs in c0de – indexes, the built-in functions LEN, INSERT, REMOVE, CLEAR, SWAP and HAS_KEY, nested structs, and why every assignment copies.
---

# Collections and structs

c0de has three ways to group values: the ARRAY is a list, the HASH a dictionary with text keys, the STRUCT a record with named elements. They feel like Python's lists, dicts and dataclasses, with one big difference: they are values. Every assignment, every parameter and every result is a copy, and there are no references, no aliasing and no null.

::: info What you need
A creative world with cheats on (see [Tutorials](/tutorials/)), a **trigger block**, a **button**, an **ARRAY variable item** with the subtype INTEGER named `numbers`, a **STRING variable item** named `text`, two **STRUCT variable items** named `a` and `b` and a few **uninitialized variable items**.
:::

## The model

- **ARRAY T** is a list of values of the type T, numbered from 0. It grows and shrinks by itself; you never declare a size. Arrays of arrays (`ARRAY ARRAY INTEGER`) are possible, up to 8 dimensions.
- **HASH T** stores values of the type T under keys, which are always STRINGs. EACH goes through its keys in alphabetical order, not in the order they were added.
- **STRUCT** declares a type with named elements, in the global part of the program and above everything that uses it. An element can be a struct declared before, which is the only way to nest structs. A struct has no methods.
- **Values, not references.** `ASSIGN copy original ;` copies the whole array, hash or struct. Changing `copy` never changes `original`, and a function never changes the variables of its caller.

| Python                   | c0de                                             |
| ------------------------ | ------------------------------------------------ |
| `a = []`                 | `VARIABLE a ARRAY INTEGER`                       |
| `a[i]`                   | `a[i]`                                           |
| `len(a)`                 | `CALL LEN` with `PARAMETER value a ;`            |
| `a.append(x)`            | `ASSIGN a[n] x ;` where `n` is the length of `a` |
| `a.insert(i, x)`         | `CALL INSERT`                                    |
| `del a[i]`, `del d[k]`   | `CALL REMOVE` with `index` or `key`              |
| `a.clear()`              | `CALL CLEAR`                                     |
| `d = {}`                 | `VARIABLE d HASH INTEGER`                        |
| `k in d`                 | `CALL HAS_KEY`                                   |
| `for k in sorted(d)`     | `EACH k d`                                       |
| `a, b = b, a`            | `CALL SWAP`                                      |
| `@dataclass class Point` | `STRUCT point`                                   |
| `p.x`                    | `p.x`                                            |

## Indexes

An index is part of a LABEL: `numbers[0]`, `counts[word]`, `stock["gold"]`, `path.from.x`. It has up to 8 entries, and **each entry is a literal or the name of a variable or constant** – never an expression. `sorted[next]` is fine, `sorted[i + 1]` is not; compute the position into a variable first.

- Reading a position outside the array raises INDEX_OUT_OF_BOUNDS; there are no negative positions from the end. Reading a key that the hash doesn't have raises UNKNOWN_KEY.
- Assigning to the position right after the last element appends one; a position further out raises INDEX_OUT_OF_BOUNDS. Assigning to a new key adds it to the hash.
- A STRING can be read character by character, `text[i]` is a CHAR. It can't be changed through an index, and EACH doesn't go through a STRING.

Arrays, hashes and structs can get start values in a code block after their VARIABLE or CONSTANT line, with one line per entry, like `y 64` for the element `y` of a struct. Only literals are allowed there, no expressions.

## The programs

Bubble sort, which returns the sorted array and the number of swaps:

<<< @/tutorials/programs/programmers/collections-sort.c0de

The same in Python:

```python
def bubble_sort(numbers: list[int]) -> tuple[list[int], int]:
    sorted, swaps = numbers.copy(), 0
    last, swapped = len(sorted), True
    while swapped:
        swapped = False
        last -= 1
        for i in range(0, last):
            if sorted[i] > sorted[i + 1]:
                sorted[i], sorted[i + 1] = sorted[i + 1], sorted[i]
                swapped = True
                swaps += 1
    return sorted, swaps
```

Counting words with a HASH:

<<< @/tutorials/programs/programmers/collections-words.c0de

Two structs for points and lines in the world:

<<< @/tutorials/programs/programmers/collections-points.c0de

## Running them

**Bubble sort:** set the trigger block to the program `sorting` and the function `bubbleSort`. Put the item `numbers` with the values 5, 3, 8, 1, 9, 2 and one uninitialized item into it. The results are `sorted` with 1, 2, 3, 5, 8, 9 and `swaps` 8. An empty array comes back empty, with 0 swaps.

**Word count:** the function `countWords` of the program `words`, with the item `text` = `"The creeper saw the  pig and the creeper ran"` and one uninitialized item. The result `counts` is the hash `and` 1, `creeper` 2, `pig` 1, `ran` 1, `saw` 1, `the` 3, and `words` is 9.

**Points:** the function `measure` of the program `points`. Variable items can hold structs of a program: type `STRUCT point` into the type field of the item dialog. Put `a` = (x 0, y 64, z 0), `b` = (x 3, y 68, z 12) and one uninitialized item into the trigger block. `path` is the line from `a` to `b`, `distance` is 13.0, and `above` is (x 0, y 74, z 0).

## How it works

- **The copy comes free.** `ASSIGN sorted numbers ;` copies the parameter into the result; `numbers` is a copy of the caller's array anyway. The sort works on `sorted` only.
- **No expressions in indexes.** That's why `bubbleSort` has the variable `next` = `i + 1` and compares `sorted[i]` with `sorted[next]`.
- **Swapping elements.** SWAP gets `sorted[i]` and `sorted[next]` as parameters and gives them back swapped into the same two elements. Result targets can have an index too.
- **Reading characters.** `countWords` adds a space at the end, so the last word is counted too, and goes through the text with FOR and `text[i]`, because EACH only works on arrays and hashes. The check `word ≠ ""` skips double spaces.
- **Keys first, then read.** Before `counts[word] + 1` reads the key, HAS_KEY checks that it exists, and a new word starts at 0. The key is the value of the variable `word`.
- **Nested structs.** `line` has two elements of the type `point`, so `point` is declared first. `path.to.x` is an index with two entries: the element `to`, then its element `x`.
- **Copies again.** `ASSIGN above a ;` copies `a`, and `ASSIGN above.y above.y + 10 ;` changes only the copy: `path.from`, also a copy of `a`, still has y 64. `length` gets its own copy of `path`.

## Differences you'll trip over

- An index is a literal or a variable, never an expression: `list[i + 1]` doesn't exist.
- Reading a missing key or position is an error, not `None` or `undefined`. Use HAS_KEY or LEN first.
- `ASSIGN b a ;` copies the whole array, hash or struct. There are no references, also not into a function. `=` compares two arrays by their content.
- LEN, INSERT, REMOVE, CLEAR and SWAP return the changed value as a result. To change a variable, use it as parameter and as result target.
- New elements go only right after the last one. There are no gaps, and position -1 is an error, not the last element.
- Hash keys are always STRINGs, and EACH sorts them alphabetically.
- A STRING is read-only through its index, and EACH doesn't go through it.
- Struct types are declared globally, above their first use. Elements without a start value have the default value of their type.
- Start values of collections are literals only; anything computed needs ASSIGN.

## Try it yourself

1. Write a function `repeated` that returns the words of a text that occur more than once, as an ARRAY STRING in alphabetical order. Use `countWords`.

::: details Solution
<<< @/tutorials/programs/programmers/collections-repeated.c0de

For `"The creeper saw the  pig and the creeper ran"`, `words` is `creeper`, `the`. EACH delivers the keys in alphabetical order, and `next` is always the length of `words`, so `words[next]` appends.
:::

2. Remove the HAS_KEY call and the IF after it from `countWords`. What happens?

::: details Solution
The process crashes with UNKNOWN_KEY at the first word: `counts[word] + 1` reads a key that doesn't exist yet. A hash has no default value for missing keys.
:::

## Read more

- [The language: Types](/c0de/guide/language#types), [Variables and constants](/c0de/guide/language#variables-and-constants), [Structs](/c0de/guide/language#structs), [ASSIGN](/c0de/guide/language#assign) and [EACH loops](/c0de/guide/language#each-loops)
- [Libraries: Changing values](/c0de/guide/libraries#changing-values)
- Handbook Functions: [LEN](/c0de/reference/functions#len), [HAS_KEY](/c0de/reference/functions#has_key), [REMOVE](/c0de/reference/functions#remove), [INSERT](/c0de/reference/functions#insert), [CLEAR](/c0de/reference/functions#clear) and [SWAP](/c0de/reference/functions#swap)
- Handbook Data: [TYPE_ARRAY](/c0de/reference/data#type_array), [TYPE_HASH](/c0de/reference/data#type_hash) and [TYPE_STRUCT](/c0de/reference/data#type_struct)
