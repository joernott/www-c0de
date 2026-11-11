---
description: The model of c0de for programmers – code made of blocks, the layout of a program, and how a trigger block runs a function.
---

# c0de in ten minutes

You know how to program. This lesson shows how c0de is different from the languages you know: programs are rows of blocks, a few layout rules replace the boilerplate of other languages, and a function gets its arguments from items and returns its results as items.

::: info What you need
A creative world with cheats on (see [Tutorials](/tutorials/)), a **trigger block**, a **wrench**, a **button** and two **variable items**: one named `name` of type STRING, one uninitialized.
:::

## The model

- **Code is made of blocks.** You place language blocks on the floor of the c0de dimension. The first block of a row is the keyword block (`FUNCTION`, `ASSIGN`, `IF` …); names are LABEL blocks, values LITERAL blocks, symbols OPERATOR blocks.
- **One row is one line.** A program starts at the north end of a sheet and runs south. Line 0 is the PROGRAM line.
- **Indentation is position.** A block one step further east is one level deeper. There are no braces: `BEGIN` and `END` around a code block, and the indentation of the lines in between, mark it.
- **The text notation** of the guide and these tutorials writes one row as one line of text, with four spaces per step east. It is not a source file; you build it with blocks.

## The program

<<< @/tutorials/programs/programmers/greet.c0de

The same in Python:

```python
def greet(name: str = "World") -> str:
    greeting = "Hello, " + name + "!"
    return greeting
```

## The layout rules

- **Line 0** is `PROGRAM` with the name of the program.
- **Line 1** is a NOOP line. INCLUDE lines for libraries follow it, then global declarations.
- **Every FUNCTION has a NOOP line right above it.** That's why the program has two NOOP lines before `FUNCTION greet`.
- **Parameters and results** are declared in the lines after `FUNCTION`, one per line, before `BEGIN`. A parameter with a value after its type has a default value.
- **The first empty line ends the program.** Everything south of it belongs to nobody.

The line numbers on the floor tell you whether a line is right: dark green is correct, dark yellow is unfinished (a `BEGIN` without its `END`), dark red is wrong. The debugging tool tells you why.

## Running it

A process starts at an entry function, not at the top of the file. Set the trigger block to the program `hello` and the function `greet`. Put the variable item `name` (type STRING, value `"Steve"`) and the uninitialized item into its input inventory, and press the button.

The output inventory then holds a variable item `greeting` with the value `"Hello, Steve!"`. Without the item `name`, the default value is used, and the result is `"Hello, World!"`.

## How it works

- `FUNCTION greet` declares the function. Its signature is the PARAMETER and RESULT lines below it.
- `ASSIGN greeting "Hello, " ⊕ name ⊕ "!" ;` sets the result. `⊕` joins values into text, and `;` ends the expression.
- A result is a variable of the function. There is no `return value`: when the function ends, the values of its results go back to the caller – or, for the entry function, into the output inventory as items.

## Differences you'll trip over

- `NOOP` lines aren't optional. A FUNCTION without a NOOP line above it is a red line.
- Every expression ends with `;`, also when it is a single value.
- `=` compares, it never assigns. Assignments are always `ASSIGN`.
- Text is joined with `⊕`, not with `+`.
- Keywords in capitals are reserved: a variable can't be called `END` or `RESULT`, but `result` is fine.
- The trigger block needs one item per parameter without default value, and enough uninitialized items for the results; otherwise it doesn't start.

## Try it yourself

1. Add a second parameter `mark` of type CHAR with the default value `'!'`, and use it instead of the `"!"` at the end.

::: details Solution
<<< @/tutorials/programs/programmers/greet-mark.c0de

With the items `name` = `"c0de"` and `mark` = `'?'`, the result is `"Hello, c0de?"`.
:::

2. Take the item `name` out of the input inventory and run it again. What is the result?

::: details Solution
`"Hello, World!"`: the parameter gets its default value. The trigger block still needs the uninitialized item for the result.
:::

## Read more

- [Getting started](/c0de/guide/getting-started): the dimension, sheets and your first program, step by step
- [The language](/c0de/guide/language): all statements of the language
- [Running programs](/c0de/guide/running-programs): trigger blocks, items and results
