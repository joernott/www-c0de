---
description: IF and ELSE, the loops FOR, EACH, WHILE and REPEAT, BREAK, RETURN and EXIT in c0de – with FizzBuzz and the prime numbers of the guide.
---

# Control flow

c0de has one condition and four loops, all made of a keyword line and a code block between BEGIN and END. They look like the statements of BASIC or Pascal, but the details differ: there is no ELSE IF, FOR includes its end value, and REPEAT goes on while its condition is true. This lesson writes FizzBuzz, goes through a hash, and revisits the prime numbers of the guide.

::: info What you need
A creative world with cheats on (see [Tutorials](/tutorials/)), a **trigger block**, a **wrench**, a **button**, a few **uninitialized variable items**, a variable item named `n` of type INTEGER, one named `limit` of type INTEGER, and a **comparator** with a **redstone lamp**.
:::

## The statements

| c0de                               | Python                            | Notes                                                 |
| ---------------------------------- | --------------------------------- | ----------------------------------------------------- |
| `IF c ;` … `END` `ELSE` … `END IF` | `if c:` … `else:`                 | no ELSE IF: nest another IF in the ELSE block         |
| `FOR i INTEGER 1 ; n ;`            | `for i in range(1, n + 1):`       | the end value is included                             |
| `FOR x FLOAT 0 ; 1 ; 0.25 ;`       | –                                 | the third value is the step, 1 if left out            |
| `EACH item list`                   | `for item in list:`               | for a hash: the keys, sorted                          |
| `WHILE c ;`                        | `while c:`                        | checks before the block                               |
| `REPEAT` … `END REPEAT c ;`        | `while True:` … `if not c: break` | checks after the block, runs while `c` is **true**    |
| `BREAK` / `BREAK c ;`              | `break` / `if c: break`           | leaves the innermost loop                             |
| `RETURN`                           | `return`                          | ends the function; its results keep their values      |
| `EXIT 3 ;`                         | `sys.exit(3)`                     | ends the whole process with an exit code from 0 to 15 |

Each of them is followed by a code block. Its END names the statement again: `END FOR`, `END EACH`, `END WHILE`. Only the first block of an IF with ELSE ends with a bare `END`. A code block can't be empty; NOOP fills one that has nothing to do.

## FizzBuzz

<<< @/tutorials/programs/programmers/control-flow-fizzbuzz.c0de

Set the trigger block to the program `fizzbuzz` and the function `fizzbuzz`. With one uninitialized item, `output` is `"1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz "`. Put in the item `n` with another value to count further; with 0, the loop doesn't run and `output` stays empty.

- The FOR loop counts from 1 to `n`, both included. Its start, end and step are evaluated once, before the first round: changing `n` inside the loop doesn't change how often it runs.
- Without ELSE IF, every further case is an IF inside the ELSE block of the one before, one level deeper each time. The first END of each IF stands alone, the last one is `END IF`.
- An IF needs a BOOLEAN. `IF i \ 3 ;` would raise TYPE_MISMATCH: write `IF i \ 3 = 0 ;`.

## Going through a hash

EACH goes through a copy of an array or a hash. For an array, the loop variable gets the elements in order; for a hash, it gets the keys, sorted by their Unicode code points, and you read the value with the key as index.

<<< @/tutorials/programs/programmers/control-flow-stock.c0de

The result is `"Diamond=3 apple=12 torch=64 "`: capital letters come before small ones, and `coal` is left out by the IF. The order is the same every time, unlike the order of a `dict` or a `HashMap` that you shouldn't rely on.

## Prime numbers, revisited

The guide finds the primes up to 20 with two FOR loops. This version takes the limit as a parameter, stops testing at the square root, and returns the primes as an array:

<<< @/tutorials/programs/programmers/control-flow-primes.c0de

Set the trigger block to the program `primesrevisited` and the function `primes`, put in two uninitialized items and press the button. `found` is `[2, 3, 5, 7, 11, 13, 17, 19]` and `count` is 8. With an item `limit` = 100, `count` is 25.

- `IF limit < 2 ;` ends the whole process with `EXIT 1 ;`. A comparator next to the trigger block then gives a signal of strength 1, and the lamp lights up; after a normal end, the exit code is 0. EXIT still writes the results of the entry function as they are at that moment: an empty array and 0.
- The inner loop is a WHILE, because its end, `divisor * divisor ≤ candidate`, changes with `divisor`. A FOR would evaluate its end only once.
- `BREAK NOT prime ;` is a BREAK with a condition: it leaves the WHILE loop only if the condition is true, like `if not prime: break`.
- `VARIABLE prime BOOLEAN TRUE` is in the code block of the FOR loop, so every round starts with a new `prime` that is true. Variables of a code block are forgotten when it ends.
- `ASSIGN found[count] candidate ;` appends: `count` is always the length of the array, and assigning to the index right after the end adds an element.

## Differences you'll trip over

- `FOR i INTEGER 1 ; 10 ;` runs ten times, including 10 – unlike `range(1, 10)`.
- `FOR i INTEGER 10 ; 1 ;` doesn't run at all. Counting down needs a negative step: `FOR i INTEGER 10 ; 1 ; -1 ;`. A step of 0 raises INVALID_LOOP_STEP.
- The loop variable of FOR and EACH can't be changed (a red line), and it doesn't exist after the loop.
- REPEAT runs **while** its condition is true. It is not the REPEAT … UNTIL of Pascal and many BASICs: `END REPEAT i ≤ n ;` goes on as long as `i ≤ n`.
- There is no ELSE IF, no CONTINUE, no labeled BREAK, no switch and no GOTO. BREAK leaves only the innermost loop.
- Changing an array or hash inside an EACH over it doesn't change the loop: it goes through a copy.
- EXIT ends the process, not the function, and only takes 0 to 15. 15 is also the code of a crash; a value outside raises INVALID_EXIT_CODE.

## Try it yourself

1. Write FizzBuzz with a REPEAT loop instead of FOR. What does it return for `n` = 0?

::: details Solution
<<< @/tutorials/programs/programmers/control-flow-fizzbuzz-repeat.c0de

For 15, the result is the same as before. For 0, it is `"1 "`: REPEAT checks its condition only after the first round. This version also builds each word with three IFs instead of nesting them: `word` is new in every round, so it starts empty.
:::

2. Add a result `sum` to the primes that adds them up with an EACH loop.

::: details Solution
<<< @/tutorials/programs/programmers/control-flow-primes-sum.c0de

The sum of the primes up to 20 is 77. The function now has three results, so it needs three uninitialized items.
:::

3. You start the primes with `limit` = 1. Which exit code does the comparator read, and which items come out?

::: details Solution
Exit code 1, so the comparator gives a signal of strength 1. EXIT ends the process normally, it isn't a crash: the item `limit` and one uninitialized item go in, and the result items `found` (an empty array) and `count` (0) come out.
:::

## Read more

- [The language](/c0de/guide/language): [IF and ELSE](/c0de/guide/language#if-and-else), [FOR loops](/c0de/guide/language#for-loops), [EACH loops](/c0de/guide/language#each-loops), [WHILE and REPEAT](/c0de/guide/language#while-and-repeat), [BREAK](/c0de/guide/language#break), [RETURN](/c0de/guide/language#return), [EXIT](/c0de/guide/language#exit)
- [Statements: Conditions](/c0de/reference/statements#conditions) and [Loops](/c0de/reference/statements#loops): the blocks and their recipes
- [Examples: Prime numbers](/c0de/guide/examples#prime-numbers): the original
- [Running programs: Exit codes](/c0de/guide/running-programs#exit-codes): what the comparator reads
