---
description: One page with Python, JavaScript and BASIC next to c0de, and the traps of the whole path.
---

# Cheat sheet

Everything of this path on one page: what you write in Python, JavaScript or BASIC, what you build in c0de, and the differences that trip up programmers. The c0de column uses the text notation; `…` stands for the lines of a code block, and `<br>` separates the lines of a statement.

## Declarations and values

|               | Python                        | JavaScript                    | BASIC            | c0de                                                                                                  |
| ------------- | ----------------------------- | ----------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| Variable      | `x = 5`                       | `let x = 5`                   | `x = 5`          | `VARIABLE x INTEGER 5`                                                                                |
| Constant      | `MAX = 10`                    | `const MAX = 10`              | `CONST MAX = 10` | `CONSTANT MAX INTEGER 10`                                                                             |
| Assignment    | `x = x + 1`                   | `x += 1`                      | `x = x + 1`      | `ASSIGN x x + 1 ;`                                                                                    |
| Types         | `bool`, `int`, `float`, `str` | `boolean`, `number`, `string` | `x%`, `x!`, `x$` | BOOLEAN, INTEGER (64 bit), FLOAT, CHAR, STRING, TIME (ms since 1970)                                  |
| No value      | `None`                        | `null`, `undefined`           | –                | none: every variable starts with the default of its type (0, 0.0, `FALSE`, `""`, a space, empty list) |
| Comment       | `# note`                      | `// note`                     | `REM note`       | a COMMENT block, `// note` in the notation                                                            |
| Program start | `if __name__ == "__main__":`  | top of the file               | first line       | the entry function set on the trigger block                                                           |

## Operators

|                                 | Python                          | JavaScript                      | BASIC                     | c0de                                              |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------------------- | ------------------------------------------------- |
| Equal, not equal                | `==`, `!=`                      | `===`, `!==`                    | `=`, `<>`                 | `=`, `≠`                                          |
| Less or equal, greater or equal | `<=`, `>=`                      | `<=`, `>=`                      | `<=`, `>=`                | `≤`, `≥`                                          |
| Division                        | `7 / 2` is 3.5                  | `7 / 2` is 3.5                  | `7 / 2` is 3.5            | `7 / 2 ;` is 3.5, always a FLOAT                  |
| Integer division                | `7 // 2`                        | `Math.trunc(7 / 2)`             | `7 \ 2`                   | `CALL c0de/math/DIV`                              |
| Remainder                       | `-7 % 2` is 1                   | `-7 % 2` is -1                  | `-7 MOD 2` is -1          | `-7 \ 2 ;` is -1                                  |
| Power                           | `2 ** 10`                       | `2 ** 10`                       | `2 ^ 10`                  | `2 ^ 10 ;`                                        |
| Logic                           | `and`, `or`, `not`              | `&&`, `\|\|`, `!`               | `AND`, `OR`, `NOT`        | `AND`, `OR`, `NOT`, `XOR` (AND and OR stop early) |
| Bits                            | `&`, `\|`, `^`, `~`, `<<`, `>>` | `&`, `\|`, `^`, `~`, `<<`, `>>` | `AND`, `OR`, `XOR`, `NOT` | `&`, `\|`, `⊻`, `¬`, `←`, `→`                     |
| Join text                       | `"a" + str(1)`                  | `"a" + 1`                       | `"a" + STR$(1)`           | `"a" ⊕ 1 ;`                                       |

## Control flow

|                 | Python                      | JavaScript                         | BASIC                    | c0de                                                |
| --------------- | --------------------------- | ---------------------------------- | ------------------------ | --------------------------------------------------- |
| If              | `if x > 0:`                 | `if (x > 0) { … }`                 | `IF x > 0 THEN … END IF` | `IF x > 0 ;`<br>`BEGIN` … `END IF`                  |
| Else            | `else:`                     | `else { … }`                       | `ELSE`                   | `BEGIN` … `END`<br>`ELSE`<br>`BEGIN` … `END IF`     |
| Else if         | `elif`                      | `else if`                          | `ELSEIF`                 | none: an IF inside the ELSE block                   |
| Counting loop   | `for i in range(1, 11, 2):` | `for (let i = 1; i <= 10; i += 2)` | `FOR i = 1 TO 10 STEP 2` | `FOR i INTEGER 1 ; 10 ; 2 ;`<br>`BEGIN` … `END FOR` |
| For each        | `for x in a:`               | `for (const x of a)`               | –                        | `EACH x a`<br>`BEGIN` … `END EACH`                  |
| While           | `while n > 0:`              | `while (n > 0)`                    | `WHILE n > 0 … WEND`     | `WHILE n > 0 ;`<br>`BEGIN` … `END WHILE`            |
| Do-while        | –                           | `do { … } while (n > 0)`           | `DO … LOOP WHILE n > 0`  | `REPEAT`<br>`BEGIN` … `END REPEAT n > 0 ;`          |
| Break           | `break`                     | `break`                            | `EXIT FOR`               | `BREAK`, or `BREAK n > 9 ;`                         |
| End the program | `sys.exit(3)`               | `process.exit(3)`                  | `END`                    | `EXIT 3 ;` (0 to 15)                                |

## Functions

|                 | Python              | JavaScript                | BASIC                 | c0de                                                                                                                       |
| --------------- | ------------------- | ------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Define          | `def area(w, h=1):` | `function area(w, h = 1)` | `FUNCTION area(w, h)` | `FUNCTION area`<br>`PARAMETER w INTEGER`<br>`PARAMETER h INTEGER 1`<br>`RESULT result INTEGER`<br>`BEGIN` … `END FUNCTION` |
| Return a value  | `return w * h`      | `return w * h`            | `area = w * h`        | `ASSIGN result w * h ;` – results are variables                                                                            |
| Return early    | `return`            | `return`                  | `EXIT FUNCTION`       | `RETURN`                                                                                                                   |
| Several results | `return a, b`       | `return [a, b]`           | –                     | several RESULT lines                                                                                                       |
| Call            | `r = area(3, h=2)`  | `const r = area(3, 2)`    | `r = area(3, 2)`      | `CALL area`<br>`PARAMETER w 3 ;`<br>`PARAMETER h 2 ;`<br>`RESULT result r`                                                 |
| Library         | `import math`       | `import … from …`         | –                     | `INCLUDE c0de/math`, then `CALL c0de/math/SQR`                                                                             |

## Errors

|                 | Python                           | JavaScript                   | BASIC                   | c0de                                                                       |
| --------------- | -------------------------------- | ---------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| Raise           | `raise ValueError("too big")`    | `throw new Error("too big")` | `ERROR 200`             | `CALL RAISE`<br>`PARAMETER code 1001 ;`<br>`PARAMETER message "too big" ;` |
| Catch           | `try: … except ValueError as e:` | `try { … } catch (e) { … }`  | `ON ERROR GOTO handler` | `CALL area problem` – an ERROR variable on the CALL line                   |
| What went wrong | `e.args`                         | `e.message`                  | `ERR`, `ERL`            | `problem.code`, `problem.message`, `problem.context`, `problem.line`       |
| Not caught      | traceback, exit 1                | uncaught exception           | error message           | the process crashes, exit code 15                                          |

## Collections

|                | Python                       | JavaScript                            | BASIC           | c0de                                                                              |
| -------------- | ---------------------------- | ------------------------------------- | --------------- | --------------------------------------------------------------------------------- |
| List           | `a = [1, 2, 3]`              | `const a = [1, 2, 3]`                 | `DIM a(2)`      | `VARIABLE a ARRAY INTEGER`<br>`BEGIN`<br>`1 2 3`<br>`END VARIABLE`                |
| Element        | `a[0]`                       | `a[0]`                                | `a(0)`          | `a[0]`                                                                            |
| Length         | `len(a)`                     | `a.length`                            | `UBOUND(a) + 1` | `CALL LEN`<br>`PARAMETER value a ;`<br>`RESULT result n`                          |
| Append         | `a.append(4)`                | `a.push(4)`                           | –               | `ASSIGN a[3] 4 ;` (index = length), or INSERT                                     |
| Insert, remove | `a.insert(0, 9)`, `del a[1]` | `a.splice(0, 0, 9)`, `a.splice(1, 1)` | –               | `CALL INSERT`, `CALL REMOVE` with `RESULT result a`                               |
| Dictionary     | `h = {"gold": 1}`            | `const h = {gold: 1}`                 | –               | `VARIABLE h HASH INTEGER`<br>`BEGIN`<br>`gold 1`<br>`END VARIABLE`                |
| Key            | `h["gold"]`, `"gold" in h`   | `h.gold`, `"gold" in h`               | –               | `h["gold"]`, `CALL HAS_KEY`                                                       |
| Record         | `@dataclass class Point`     | `{x: 1, y: 2}`                        | `TYPE Point`    | `STRUCT point`<br>`BEGIN`<br>`x INTEGER`<br>`y INTEGER`<br>`END STRUCT` and `p.x` |
| Copying        | `b = a` shares the list      | `b = a` shares the array              | –               | `ASSIGN b a ;` and parameters copy the value                                      |

## Strings and data

|                | Python                       | JavaScript                               | BASIC                | c0de                                                      |
| -------------- | ---------------------------- | ---------------------------------------- | -------------------- | --------------------------------------------------------- |
| Length         | `len(s)`                     | `s.length`                               | `LEN(s$)`            | `CALL LEN`                                                |
| Part           | `s[2:5]`                     | `s.slice(2, 5)`                          | `MID$(s$, 3, 3)`     | `c0de/strings/MID` with start 2, length 3                 |
| Find           | `s.find("x")` (-1)           | `s.indexOf("x")` (-1)                    | `INSTR(s$, "x")` (0) | `c0de/strings/INSTR` (-1)                                 |
| Upper case     | `s.upper()`                  | `s.toUpperCase()`                        | `UCASE$(s$)`         | `c0de/strings/UCASE`                                      |
| Number to text | `str(n)`                     | `String(n)`                              | `STR$(n)`            | `"" ⊕ n ;` or `c0de/strings/STR`                          |
| Text to number | `float(s)`                   | `Number(s)`                              | `VAL(s$)`            | `c0de/strings/VAL` (a FLOAT and whether it is whole)      |
| Round          | `math.floor`, `int`, `round` | `Math.floor`, `Math.trunc`, `Math.round` | `INT`, `FIX`         | `c0de/math/INT`, `FIX`, `ROUND`                           |
| JSON           | `json.dumps`, `json.loads`   | `JSON.stringify`, `JSON.parse`           | –                    | `c0de/strings/TO_JSON`, `FROM_JSON` into a typed variable |

## Input and output

|             | Python        | JavaScript       | BASIC                                     | c0de                                     |
| ----------- | ------------- | ---------------- | ----------------------------------------- | ---------------------------------------- |
| Print       | `print(x)`    | `console.log(x)` | `PRINT x`                                 | `CALL PRINT`<br>`PARAMETER value x ;`    |
| Read a line | `x = input()` | `prompt()`       | `INPUT x`                                 | `CALL INPUT`<br>`PARAMETER variable x ;` |
| Read a key  | –             | `keydown` event  | `k$ = INKEY$`                             | `CALL INKEY`<br>`RESULT result k`        |
| Screen      | curses        | –                | `CLS`, `LOCATE`, `COLOR`, `CSRLIN`, `POS` | the same names, rows and columns from 0  |

## The traps

### Layout

- Line 0 is PROGRAM, line 1 is a NOOP line, and every FUNCTION has a NOOP line right above it. A missing NOOP line is a red line.
- The first empty line ends the program.
- A name is only known below its definition. A function can only call functions above it, or itself.
- Keywords in capitals are reserved: `RESULT` is not a valid name, `result` is.
- Every BEGIN needs its END with the keyword (`END WHILE`); with ELSE, the first END stands alone. A code block may not be empty – put a NOOP line into it.
- There is no ELSE IF.

### Expressions

- Every expression ends with `;`, also a single value.
- `=` only compares. Values are stored with ASSIGN, and functions can't be called inside an expression – use CALL.
- Text is joined with `⊕`, not with `+`. `⊕` binds weaker than `+`: `"a" ⊕ 1 + 2 ;` is `"a3"`.
- `/` always gives a FLOAT. A FLOAT doesn't fit into an INTEGER (TYPE_MISMATCH): use INT, FIX or ROUND of c0de/math, or DIV.
- INT rounds down (-12.85 → -13), FIX cuts off (-12.85 → -12), ROUND rounds .5 to the even number (12.5 → 12), like Python's `round`, not like `Math.round`.
- `\` is the remainder, with the sign of the dividend: `-7 \ 2 ;` is -1, in Python it is 1. It binds weaker than `*`: `7 \ 2 * 2 ;` is 3.
- Comparisons need the same type (INTEGER with FLOAT and CHAR with STRING are fine). Texts compare by code point: `"Z" < "a"`.
- An INTEGER fits into a FLOAT and a CHAR into a STRING, nothing else converts by itself.
- Types are checked when a line runs, not when it is placed: a green line can still raise TYPE_MISMATCH.

### Control flow

- The end value of FOR is included, start, end and step are computed once, and the loop variable can't be assigned.
- REPEAT repeats **while** the condition after `END REPEAT` is true – it is not `REPEAT … UNTIL`.
- EACH over a hash goes through the keys sorted by code point: `Z` before `a`.
- EXIT takes 0 to 15. 15 means crashed.

### Functions

- Arguments are named PARAMETER lines, not positions. Every parameter without default value must be given.
- Parameters are copies, also arrays, hashes and structs. Only INPUT, FROM_JSON and FROM_YAML write into the variable you pass.
- There is no `return value`: results are variables that start at their default, and their last values go back.
- Built-in functions return new values instead of changing their arguments: `CALL INSERT` without `RESULT result list` changes nothing.
- Deep recursion fills the stack of the cursor; STACK_OVERFLOW crashes the process and can't be caught.

### Collections

- Indexes start at 0. Assigning to the index equal to the length appends; any higher index raises INDEX_OUT_OF_BOUNDS.
- Reading a missing key of a hash raises UNKNOWN_KEY. Ask HAS_KEY first.
- `ASSIGN b a ;` copies; changing `b` doesn't change `a`.
- An index is a number, a key or a variable, never an expression: `a[i - 1]` doesn't work. Compute the position into a variable first.

### Errors

- There are no exceptions to catch with a block: an ERROR variable on the CALL line catches what the called function raised, and the caller goes on.
- Own error codes start at 1000. RAISE ends the function like RETURN.
- A caught error still delivers the results: the caller gets the values they had when the function stopped. Check the error before you use them.
- An error that nobody catches crashes the process with exit code 15. Syntax errors and some others (like STACK_OVERFLOW) always crash.

### Programs in the world

- A process starts at an entry function set on a trigger block, not at the top. Arguments and results are variable items: one item per parameter without default value and enough uninitialized items for the results, or it doesn't start.
- The sheet of a running program is locked: nobody can place or break blocks on it.

### Screens and devices

- PRINT always ends the line. Rows and columns start at 0. LOCATE and PRINT don't clear the rest of a row.
- INKEY never waits and returns a STRING, `""` without a key.
- INPUT takes a matching item from a bound I/O block before it asks the laptop.
- WRITE waits until a bound I/O block has an uninitialized variable item.

### Data and the network

- JSON and YAML are read into a declared type; a document that doesn't fit raises an error and leaves the variable unchanged.
- Missing keys keep the current value, unknown keys are ignored, arrays and hashes are replaced.
- Tags are per language: a `json` tag doesn't rename the key in YAML.
- HTTP requests are sent by the game client of the player who started the process (or the owner of the trigger block). A status of 400 or higher is the error HTTP_STATUS.

## Read more

- [The language](/c0de/guide/language): all statements in short
- [Statements](/c0de/reference/statements), [Data](/c0de/reference/data) and [Functions](/c0de/reference/functions): the handbooks
- [Running programs](/c0de/guide/running-programs): trigger blocks, items, errors and devices
- [c0de_net/http](/c0de_net/http/): HTTP requests
