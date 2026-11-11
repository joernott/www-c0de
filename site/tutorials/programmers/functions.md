---
description: Functions in c0de – named parameters with defaults, several results, CALL instead of positional arguments, recursion on the stack of the cursor, and the full names of library functions.
---

# Functions and libraries

A c0de function looks like a function in any other language, until you call it. There are no positional arguments and no return value: every argument is a named PARAMETER line, every result a named RESULT line, and a function can have as many results as it likes. This lesson shows how calls, recursion and libraries work, and what the stack of the cursor has to do with it.

::: info What you need
A creative world with cheats on (see [Tutorials](/tutorials/)), a **trigger block**, a **button**, an **INTEGER variable item** named `n`, a **FLOAT variable item** named `radius` and three **uninitialized variable items**.
:::

## The model

- **A signature is a list of lines.** PARAMETER lines below the FUNCTION line are the inputs, RESULT lines the outputs, both with name and type. A parameter of a simple type or STRING may have a default value.
- **Arguments are named.** A CALL has one PARAMETER line per argument, with the name of the parameter and an expression. Their order doesn't matter, and parameters with a default value can be left out.
- **Results are variables.** A result starts with the default value of its type and is assigned like any variable. When the function ends, the caller gets the last values, but only of the results its CALL lists in RESULT lines; the others are thrown away.
- **Everything is passed by value.** Parameters are copies, also arrays, hashes and structs. A function that should change a variable gets it as a parameter and gives it back as a result.
- **Order matters.** A function can call itself and the functions declared above it, nothing else.

## The programs

The Fibonacci numbers, recursive and with a loop, and an entry function `compare` that runs both:

<<< @/tutorials/programs/programmers/functions-fibonacci.c0de

The same in Python:

```python
def fib_recursive(n: int) -> int:
    if n < 2:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)

def fib_loop(n: int) -> int:
    result, next = 0, 1
    for i in range(1, n + 1):
        result, next = next, result
        next = next + result
    return result

def compare(n: int = 10) -> tuple[int, int]:
    return fib_recursive(n), fib_loop(n)
```

A function with three results, and a function that calls it twice:

<<< @/tutorials/programs/programmers/functions-circle.c0de

In Python, `circle` would return a tuple, and `ring` would unpack it and ignore two of the values:

```python
def circle(radius: float) -> tuple[float, float, float]:
    diameter = 2 * radius
    return diameter, diameter * math.pi, math.pi * radius ** 2

def ring(outer: float, inner: float = 0.0) -> float:
    _, _, area = circle(outer)
    _, _, hole = circle(inner)
    return area - hole
```

## Running them

Set a trigger block to the program `fibonacci` and the function `compare`. Put the item `n` (value 20) and one uninitialized item into its input inventory: `compare` has two results, and the item `n` takes the place of one of them. Press the button. The output holds the items `recursive` and `iterative`, both 6765. Without the item `n`, you need two uninitialized items, and `n` is 10.

Take your time with the recursive version. The cursor processes one line per tick, 20 per second. For `n` = 20, the program runner counts 109,454 steps for `fibRecursive` and 65 for `fibLoop`: in the game, the recursion runs for more than an hour, the loop for a few seconds.

Then set the trigger block to the program `circles` and the function `circle`, and put the item `radius` (value 3.0) and two uninitialized items into it. The results are `diameter` 6.0, `circumference` 18.84955592153876 and `area` 28.274333882308138.

## How it works

- **A CALL lists its parameters first, then its results.** `PARAMETER n n - 1 ;` sets the parameter `n` of the called function to the value of the expression `n - 1`, evaluated in the caller. `RESULT result a` copies the result `result` of the called function into the variable `a` of the caller. PARAMETER lines may come in any order, but all of them before the first RESULT line.
- **There is no return value.** `fibRecursive` assigns `result` and then ends with a plain `RETURN`. RETURN can carry a variable of type ERROR (lesson [Errors](/tutorials/programmers/errors)), but never a value.
- **No calls in expressions.** `fib(n - 1) + fib(n - 2)` is two CALL statements with two local variables `a` and `b`, and an ASSIGN that adds them.
- **Changing variables with a function.** In `fibLoop`, the built-in function SWAP gets `result` and `next` as parameters and gives them back swapped as results. Using the same variables as parameters and as result targets is how c0de changes variables through a function.
- **Taking only what you need.** `ring` calls `circle` twice and lists only the result `area`; the diameter and the circumference are thrown away. Its parameter `inner` has the default value 0.0, so `ring` with only `outer` is the area of a disc.

### Recursion and the stack

Every process has one cursor, and the cursor has a stack. A call pushes a function item (the call frame), a block marker for the code block of the function and one slot for every parameter and result; local variables, loops and other open code blocks take slots too. When the function ends, all of it is removed again.

The stack has 2048 slots, unless the server sets a larger `stackSize` in `config/c0de.properties`. A process that needs more crashes with STACK_OVERFLOW. The built-in constant CURSOR shows where you are: `CURSOR.depth` is the number of functions on the stack, `CURSOR.stack_used` and `CURSOR.stack_size` the used and all slots. The debugging tool shows the stack of a cursor when you right-click it.

## Libraries

Built-in functions such as LEN, SWAP, INSERT or RAISE need nothing. Everything else is in a library that you load with an INCLUDE line, right after the NOOP in line 1, before any other statement – like `INCLUDE c0de/math` in the program `circles`.

There is no `import … as` and no namespace you can leave out. Functions, constants and struct types of a library always have their full name:

| Python                | c0de                                            |
| --------------------- | ----------------------------------------------- |
| `import math`         | `INCLUDE c0de/math`                             |
| `math.sqrt(2)`        | `CALL c0de/math/SQR` with `PARAMETER value 2 ;` |
| `math.pi`             | `c0de/math/PI` in an expression                 |
| a class from a module | `VARIABLE spot STRUCT c0de/minecraft/POSITION`  |

The LABEL block on the sheet shows only the last part of such a name, e.g. `PI`. Without the INCLUDE, the line is red: CALL reports UNKNOWN_FUNCTION ("is its library included?"), a constant UNKNOWN_NAME.

Library functions follow two conventions: a function with one result calls it `result`, and positions in texts and arrays start at 0.

## Differences you'll trip over

- There are no positional arguments. Every argument is a PARAMETER line with the name of the parameter.
- In a CALL, all PARAMETER lines come before the RESULT lines. Otherwise the line is red: "PARAMETER lines must come before RESULT lines".
- A function returns nothing. Results are variables, and a CALL without RESULT lines throws all of them away.
- A function can only call functions declared above it, and itself. Two functions can't call each other.
- Functions can't be called inside an expression. Store the result in a variable first.
- Arrays, hashes and structs are copied too. To change one, pass it as a parameter and take it back as a result.
- Only parameters of simple types and STRING can have a default value.
- A simple recursive function uses about five slots of the stack per level, so the default stack of 2048 slots ends after a few hundred levels. STACK_OVERFLOW is a crash: no CALL can catch it.
- Library names are always written out in full, also for constants: `c0de/math/PI`, never `PI`.

## Try it yourself

1. Write a recursive function `sum` that adds the numbers from 1 to `n`, with a second result `used` that tells how many slots of the stack were used at the deepest level. How deep can it go?

::: details Solution
<<< @/tutorials/programs/programmers/functions-sum.c0de

For `n` = 100, `result` is 5050 and `used` 506: every level takes five slots (function item, block marker, `n`, `result` and `used`), and the deepest level has one more for the code block of the IF. With `n` = 408, `used` is 2046. With `n` = 409, the process crashes with STACK_OVERFLOW.
:::

2. In `compare`, move the line `RESULT result iterative` above the line `PARAMETER n n ;`. What happens?

::: details Solution
The CALL becomes invalid and its line number turns red: "PARAMETER lines must come before RESULT lines". The order of the PARAMETER lines among themselves is free, the RESULT lines always come last.
:::

## Read more

- [The language: Functions](/c0de/guide/language#functions), [CALL](/c0de/guide/language#call) and [RETURN](/c0de/guide/language#return)
- [Libraries](/c0de/guide/libraries#calling-them): calling them, [changing values](/c0de/guide/libraries#changing-values), [including libraries](/c0de/guide/libraries#including-libraries) and the [built-in functions](/c0de/guide/libraries#built-in-functions)
- Handbook Statements: [FUNCTION](/c0de/reference/statements#function), [PARAMETER](/c0de/reference/statements#parameter), [RESULT](/c0de/reference/statements#result) and [CALL](/c0de/reference/statements#call)
- Handbook Functions: [SWAP](/c0de/reference/functions#swap)
- [Libraries: c0de/math](/c0de/guide/libraries#c0demath): the library with `c0de/math/PI`, and its [functions](/c0de/math/)
