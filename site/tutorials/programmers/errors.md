---
description: Errors in c0de – no exceptions and no try, but errors that travel up the calls until a CALL with an ERROR variable catches them; own errors with RAISE; crashes and exit codes.
---

# Errors

c0de has no exceptions, no `try` and no `catch` block. Still, errors behave much like exceptions: a function that fails stops, and its error travels up the calls until a caller catches it. The catching happens at the CALL, with a variable of type ERROR. If nobody catches it, the process crashes, and the trigger block shows the error.

::: info What you need
A creative world with cheats on (see [Tutorials](/tutorials/)), a **trigger block**, a **button**, a **STRING variable item** named `input`, an **uninitialized variable item**, and for the exit code a **comparator** and a **redstone lamp**.
:::

## The model

- **Raising an error ends the function.** A division by zero, a missing key or a RAISE ends the current function as if it had executed `RETURN` with that error.
- **The caller decides.** If its CALL has an ERROR variable after the function name (`CALL parseAge problem`), the error goes into that variable and the caller goes on. Otherwise the error is raised again in the caller, which ends too, and so on up the calls.
- **The entry function is the last stop.** An error that reaches it crashes the process: exit code 15, no results, and all items that went in come out unchanged.
- **Some errors can't be caught.** Mistakes in the program itself (a red line, codes 100 to 114) and the errors of the cursor (codes 200 to 206, e.g. STACK_OVERFLOW, a missing parameter or an unknown function) crash the process at once.

An error is a predefined struct with four elements:

| Element   | Type    | Content                             |
| --------- | ------- | ----------------------------------- |
| `code`    | INTEGER | 0 if there was no error             |
| `message` | STRING  | the text of the error               |
| `context` | STRING  | the function in which it was raised |
| `line`    | INTEGER | the line in which it was raised     |

The codes of the language are below 1000 and have names, which are built-in constants. These are the ones a CALL can catch:

|      Code | Name                                                              | When                                        |
| --------: | ----------------------------------------------------------------- | ------------------------------------------- |
|       300 | UNKNOWN_NAME                                                      | a name that isn't in scope                  |
|       301 | UNKNOWN_STRUCT_ENTITY                                             | an element the struct doesn't have          |
|       302 | TYPE_MISMATCH                                                     | a value of the wrong type                   |
|       303 | DIVISION_BY_ZERO                                                  | `/` or `\` by 0                             |
|       304 | NUMERIC_OVERFLOW                                                  | an INTEGER beyond 64 bits                   |
|       305 | INDEX_OUT_OF_BOUNDS                                               | a position outside an array or string       |
|       306 | UNKNOWN_KEY                                                       | a key the hash doesn't have                 |
|       307 | STRING_TOO_LONG                                                   | a value longer than the limit of its STRING |
|       308 | INVALID_LOOP_STEP                                                 | a FOR loop with the step 0                  |
|       309 | INVALID_ARGUMENT                                                  | a parameter value a function can't use      |
| 310 – 313 | CHUNK_NOT_LOADED, PERMISSION_DENIED, INVENTORY_FULL, ITEM_MISSING | errors of c0de/minecraft                    |

Your own errors use codes from 1000 on.

In Python, the program of this lesson would look like this:

```python
class AgeError(Exception): ...

def parse_age(text: str) -> int:
    number = float(text)               # ValueError for "abc"
    if not number.is_integer():
        raise AgeError(1001, "not a whole number: " + text)
    age = int(number)
    if age < 0 or age > 150:
        raise AgeError(1002, "out of range: " + str(age))
    return age

def signup(input: str) -> str:
    try:
        parse_age(input)
        return "Welcome!"
    except Exception as problem:
        return "Error: " + str(problem)
```

## The program

<<< @/tutorials/programs/programmers/errors-signup.c0de

## Running it

Set the trigger block to the program `signup` and the function `signup`. Put the item `input` and an uninitialized item into it, and place a comparator that reads the trigger block, with a lamp behind it.

| `input` | `message`                                                  | `age` | Exit code |
| ------- | ---------------------------------------------------------- | ----- | --------- |
| `"42"`  | `Welcome!`                                                 | 42    | 0         |
| `"4.5"` | `Error 1001: not a whole number: 4.5 (parseAge, line 19)`  | 0     | 1         |
| `"200"` | `Error 1002: out of range: 200 (parseAge, line 28)`        | 200   | 1         |
| `"abc"` | `Error 309: Not a number: abc (c0de/strings/VAL, line 13)` | 0     | 1         |

With exit code 1, the comparator puts out a signal of strength 1, and the lamp lights up until the next process starts.

Now set the trigger block to the function `parseAge` and rename the item `input` to `text`, with the value `"200"`. Nobody catches the error: the process crashes with exit code 15, the trigger block plays a low note, and its dialog shows code 1002, the message `out of range: 200`, the context `parseAge` and line 28. The items `text` and the uninitialized one come out unchanged.

## How it works

- **Own errors with RAISE.** `CALL RAISE` with a `code` from 1000 on and a `message` hands an error to its caller, `parseAge`. That CALL has no ERROR variable, so the error is raised in `parseAge`, which ends at once. RAISE fills in `context` and `line` with the function and the line of the CALL. A code below 1000 raises INVALID_ARGUMENT instead.
- **Constants for the codes.** The global constants `AGE_NOT_WHOLE` and `AGE_OUT_OF_RANGE` give the codes names, like the built-in names of the language's errors. A caller can compare `problem.code = AGE_OUT_OF_RANGE ;`.
- **Errors of library functions.** VAL raises INVALID_ARGUMENT for `"abc"`. `parseAge` doesn't catch it, so it travels on to `signup`. It keeps its `context` and `line`: they always describe where the error happened first, here the library function `c0de/strings/VAL` called in line 13.
- **Catching.** `CALL parseAge problem` puts the error into `problem`. The variable gets the error of every call, with code 0 if there was none, so `IF problem.code = 0 ;` is the success check.
- **Results survive.** For `"200"`, `age` is 200 although `parseAge` failed: the caller gets the values the results had when the function stopped. Check the error before you use them.
- **Exit codes for redstone.** `EXIT 1 ;` ends the process with exit code 1. Unlike a crash, the results are written to the output inventory as usual. EXIT takes 0 to 15; 15 is the code of a crash.

## Differences you'll trip over

- There is no `try` block. To catch an error, the code that can fail must be in a function of its own, called with an ERROR variable.
- A CALL without an ERROR variable passes every error on. One forgotten variable, and the whole process crashes.
- Errors aren't typed. Tell them apart by `code`, not by a class.
- Results are assigned even when the function failed. Don't trust them before you checked `code`.
- RAISE fills in `context` and `line`; an ERROR variable that you fill and return with `RETURN problem` keeps them empty unless you set them.
- Syntax errors, STACK_OVERFLOW, a missing parameter and the other errors with codes below 300 can't be caught.
- A crash loses all results. If redstone should react to a handled problem, use EXIT with a code from 1 to 14.

## Try it yourself

1. Replace the RAISE of the range check in `parseAge` with an ERROR variable and `RETURN`. What does the message for `"200"` look like now?

::: details Solution
<<< @/tutorials/programs/programmers/errors-return.c0de

The message is `Error 1002: out of range: 200 (, line 0)`: an error you build yourself has an empty `context` and the line 0, unless you assign them. RAISE fills them in for you.
:::

2. Write a function `report` with the parameters `total` and `count` that returns the text `average: …`, or `no values yet` if `count` is 0. Let the division fail and catch DIVISION_BY_ZERO.

::: details Solution
<<< @/tutorials/programs/programmers/errors-average.c0de

With `total` = 7 and `count` = 2, the text is `average: 3.5`; with `count` = 0, it is `no values yet`. The division needs a function of its own, because only a CALL can catch an error.
:::

## Read more

- [The language: Errors](/c0de/guide/language#errors), [Your own errors](/c0de/guide/language#your-own-errors), [RETURN](/c0de/guide/language#return) and [EXIT](/c0de/guide/language#exit)
- [Running programs: Exit codes](/c0de/guide/running-programs#exit-codes) and [Crashes](/c0de/guide/running-programs#crashes)
- Handbook Functions: [RAISE](/c0de/reference/functions#raise)
- Handbook Data: [TYPE_ERROR](/c0de/reference/data#type_error)
- Handbook Statements: [RETURN](/c0de/reference/statements#return), [CALL](/c0de/reference/statements#call) and [EXIT](/c0de/reference/statements#exit)
