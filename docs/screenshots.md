# Screenshots: to-do list

The screenshots of the tutorials (task 7.1.1), taken as [tutorials.md](tutorials.md#screenshots) describes. Written by `site/scripts/screenshot-world.ts` from the marks of the pages; the same as data is in `screenshots.yaml`, with every program also in the YAML format of the c0de disk.

The world: every program is on its own sheet of the c0de dimension, built by the datapack of `contrib/screenshots/` (see its README). Sheet 0 is empty, and an empty sheet lies between two programs. North of every sheet, at z = -3 from x + 5 on: a trigger block with a stone button, a debug trigger block with a laptop, a timer block with a lever that is on (so it is paused), an I/O block, a disk drive and a gray shulker box with a stack of variable, constant and literal items and a disk; behind them, at z = -6, a display wall of 4 × 3 blocks in a frame of iron blocks. The three trigger blocks are set to the program and the function of its test.

86 screenshots, 62 programs on the sheets 2 to 124. The sheets of the programs never change; new screenshots are added at the end of this list, and their programs get the next free sheets. Not built yet: the sheets 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124; `function c0de_screenshots:build_new` builds them (contrib/screenshots/README.md).

## Before you start

`site/tutorials/learning/before-you-start.md`

### [x] before-you-start-new-world

the Minecraft "Create New World" screen with game mode Creative and Allow Cheats ON

- No program: a menu or a book of the game

### [x] before-you-start-creative-tab

the creative inventory with the c0de tab open, showing the trigger block, the wrench and the language blocks

- No program: a menu or a book of the game

### [x] before-you-start-sheet

the north end of an empty sheet in the c0de dimension, seen from the north-west: the sheet number on the black floor, the green and white stripes and the cursor rail

- The empty sheet 0, x = 0

## Your first program

`site/tutorials/learning/first-program.md`

### [x] first-program-sign

the program "sign" on its sheet, seen from above at the north end, with dark green line numbers

- Program **sign**, function `welcome` (`site/tutorials/programs/learning/first-program-sign.c0de`)
- Sheet 2, x = 64
- Other sheets also have a program sign: run `/function c0de_screenshots:activate/first-program-sign` first

```c0de
PROGRAM sign
NOOP
NOOP
FUNCTION welcome
BEGIN
    CALL CLS
    CALL PRINT
        PARAMETER value "Welcome to my base!" ;
END FUNCTION
```

### [x] first-program-result

the display wall of 2 x 1 display blocks at the entrance of the base, showing "Welcome to my base!", with the trigger block and button next to it

- Program **sign**, function `welcome` (`site/tutorials/programs/learning/first-program-sign.c0de`)
- Sheet 2, x = 64
- Other sheets also have a program sign: run `/function c0de_screenshots:activate/first-program-sign` first

```c0de
PROGRAM sign
NOOP
NOOP
FUNCTION welcome
BEGIN
    CALL CLS
    CALL PRINT
        PARAMETER value "Welcome to my base!" ;
END FUNCTION
```

## Colors and the screen

`site/tutorials/learning/colors.md`

### [x] colors-sign

the program "sign" with the COLOR and LOCATE lines on its sheet, seen from above, all line numbers dark green

- Program **sign**, function `welcome` (`site/tutorials/programs/learning/colors-sign.c0de`)
- Sheet 4, x = 128
- Other sheets also have a program sign: run `/function c0de_screenshots:activate/colors-sign` first

```c0de
PROGRAM sign
NOOP
NOOP
FUNCTION welcome
BEGIN
    CALL CLS
    CALL COLOR
        PARAMETER foreground COLOR_GOLD ;
    CALL PRINT
        PARAMETER value "================================" ;
    CALL LOCATE
        PARAMETER row 3 ;
        PARAMETER column 6 ;
    CALL COLOR
        PARAMETER foreground COLOR_YELLOW ;
        PARAMETER background COLOR_DARK_BLUE ;
    CALL PRINT
        PARAMETER value "Welcome to my base!" ;
    CALL COLOR
        PARAMETER foreground COLOR_GOLD ;
    CALL LOCATE
        PARAMETER row 6 ;
    CALL PRINT
        PARAMETER value "================================" ;
END FUNCTION
```

### [x] colors-result

the display wall at the entrance showing the welcome text in yellow on dark blue between two gold lines of equal signs

- Program **sign**, function `welcome` (`site/tutorials/programs/learning/colors-sign.c0de`)
- Sheet 4, x = 128
- Other sheets also have a program sign: run `/function c0de_screenshots:activate/colors-sign` first

```c0de
PROGRAM sign
NOOP
NOOP
FUNCTION welcome
BEGIN
    CALL CLS
    CALL COLOR
        PARAMETER foreground COLOR_GOLD ;
    CALL PRINT
        PARAMETER value "================================" ;
    CALL LOCATE
        PARAMETER row 3 ;
        PARAMETER column 6 ;
    CALL COLOR
        PARAMETER foreground COLOR_YELLOW ;
        PARAMETER background COLOR_DARK_BLUE ;
    CALL PRINT
        PARAMETER value "Welcome to my base!" ;
    CALL COLOR
        PARAMETER foreground COLOR_GOLD ;
    CALL LOCATE
        PARAMETER row 6 ;
    CALL PRINT
        PARAMETER value "================================" ;
END FUNCTION
```

## Remembering things: variables

`site/tutorials/learning/variables.md`

### [x] variables-sign

the top of the program "sign" on its sheet, seen from above: the CONSTANT lines, the VARIABLE and ASSIGN lines inside the function

- Program **sign**, function `welcome` (`site/tutorials/programs/learning/variables-sign.c0de`)
- Sheet 6, x = 192
- Other sheets also have a program sign: run `/function c0de_screenshots:activate/variables-sign` first

```c0de
PROGRAM sign
NOOP
CONSTANT BASE STRING "Oak Hill"
CONSTANT FRAME STRING "================================"
NOOP
FUNCTION welcome
BEGIN
    VARIABLE year INTEGER
    ASSIGN year 2026 ;
    CALL CLS
    CALL COLOR
        PARAMETER foreground COLOR_GOLD ;
    CALL PRINT
        PARAMETER value FRAME ;
    CALL LOCATE
        PARAMETER row 3 ;
        PARAMETER column 6 ;
    CALL COLOR
        PARAMETER foreground COLOR_YELLOW ;
        PARAMETER background COLOR_DARK_BLUE ;
    CALL PRINT
        PARAMETER value "Welcome to " ⊕ BASE ⊕ "!" ;
    CALL LOCATE
        PARAMETER row 4 ;
        PARAMETER column 8 ;
    CALL COLOR
        PARAMETER foreground COLOR_WHITE ;
    CALL PRINT
        PARAMETER value "Founded in " ⊕ year ;
    CALL COLOR
        PARAMETER foreground COLOR_GOLD ;
    CALL LOCATE
        PARAMETER row 6 ;
    CALL PRINT
        PARAMETER value FRAME ;
END FUNCTION
```

### [x] variables-result

the display wall at the entrance showing "Welcome to Oak Hill!" in yellow on blue and "Founded in 2026" in white, between the gold lines

- Program **sign**, function `welcome` (`site/tutorials/programs/learning/variables-sign.c0de`)
- Sheet 6, x = 192
- Other sheets also have a program sign: run `/function c0de_screenshots:activate/variables-sign` first

```c0de
PROGRAM sign
NOOP
CONSTANT BASE STRING "Oak Hill"
CONSTANT FRAME STRING "================================"
NOOP
FUNCTION welcome
BEGIN
    VARIABLE year INTEGER
    ASSIGN year 2026 ;
    CALL CLS
    CALL COLOR
        PARAMETER foreground COLOR_GOLD ;
    CALL PRINT
        PARAMETER value FRAME ;
    CALL LOCATE
        PARAMETER row 3 ;
        PARAMETER column 6 ;
    CALL COLOR
        PARAMETER foreground COLOR_YELLOW ;
        PARAMETER background COLOR_DARK_BLUE ;
    CALL PRINT
        PARAMETER value "Welcome to " ⊕ BASE ⊕ "!" ;
    CALL LOCATE
        PARAMETER row 4 ;
        PARAMETER column 8 ;
    CALL COLOR
        PARAMETER foreground COLOR_WHITE ;
    CALL PRINT
        PARAMETER value "Founded in " ⊕ year ;
    CALL COLOR
        PARAMETER foreground COLOR_GOLD ;
    CALL LOCATE
        PARAMETER row 6 ;
    CALL PRINT
        PARAMETER value FRAME ;
END FUNCTION
```

## Calculating

`site/tutorials/learning/calculating.md`

### [x] calculating-stacks

the program "stacks" on its sheet, seen from above, with the OPERATOR blocks of lines 14 to 23 visible

- Program **stacks**, function `calculate` (`site/tutorials/programs/learning/calculating-stacks.c0de`)
- Sheet 8, x = 256
- Other sheets also have a program stacks: run `/function c0de_screenshots:activate/calculating-stacks` first

```c0de
PROGRAM stacks
NOOP
INCLUDE c0de/math
NOOP
FUNCTION calculate
BEGIN
    VARIABLE items INTEGER 1000
    VARIABLE size INTEGER 64
    VARIABLE stacks INTEGER
    VARIABLE rest INTEGER
    CALL c0de/math/DIV
        PARAMETER dividend items ;
        PARAMETER divisor size ;
        RESULT result stacks
    ASSIGN rest items \ size ;
    CALL CLS
    CALL PRINT
        PARAMETER value items ⊕ " items" ;
    CALL PRINT
        PARAMETER value "= " ⊕ items / size ⊕ " stacks" ;
    CALL PRINT
        PARAMETER value "= " ⊕ stacks ⊕ " stacks + " ⊕ rest ⊕ " items" ;
    CALL PRINT
        PARAMETER value "Check: " ⊕ stacks * size + rest ;
END FUNCTION
```

### [x] calculating-result

the second display wall next to the storage chests showing the four lines of the stack calculator

- Program **stacks**, function `calculate` (`site/tutorials/programs/learning/calculating-stacks.c0de`)
- Sheet 8, x = 256
- Other sheets also have a program stacks: run `/function c0de_screenshots:activate/calculating-stacks` first

```c0de
PROGRAM stacks
NOOP
INCLUDE c0de/math
NOOP
FUNCTION calculate
BEGIN
    VARIABLE items INTEGER 1000
    VARIABLE size INTEGER 64
    VARIABLE stacks INTEGER
    VARIABLE rest INTEGER
    CALL c0de/math/DIV
        PARAMETER dividend items ;
        PARAMETER divisor size ;
        RESULT result stacks
    ASSIGN rest items \ size ;
    CALL CLS
    CALL PRINT
        PARAMETER value items ⊕ " items" ;
    CALL PRINT
        PARAMETER value "= " ⊕ items / size ⊕ " stacks" ;
    CALL PRINT
        PARAMETER value "= " ⊕ stacks ⊕ " stacks + " ⊕ rest ⊕ " items" ;
    CALL PRINT
        PARAMETER value "Check: " ⊕ stacks * size + rest ;
END FUNCTION
```

## Giving and getting values

`site/tutorials/learning/parameters.md`

### [x] parameters-stacks

the program "stacks" on its sheet, seen from above, with the PARAMETER and RESULT lines between FUNCTION and BEGIN

- Program **stacks**, function `calculate` (`site/tutorials/programs/learning/parameters-stacks.c0de`)
- Sheet 10, x = 320
- Other sheets also have a program stacks: run `/function c0de_screenshots:activate/parameters-stacks` first

```c0de
PROGRAM stacks
NOOP
INCLUDE c0de/math
NOOP
FUNCTION calculate
    PARAMETER items INTEGER
    RESULT stacks INTEGER
    RESULT rest INTEGER
BEGIN
    VARIABLE size INTEGER 64
    CALL c0de/math/DIV
        PARAMETER dividend items ;
        PARAMETER divisor size ;
        RESULT result stacks
    ASSIGN rest items \ size ;
END FUNCTION
```

### [x] parameters-trigger

the dialog of the trigger block with the variable item "items" and an uninitialized variable item in the input inventory

- Program **stacks**, function `calculate` (`site/tutorials/programs/learning/parameters-stacks.c0de`)
- Sheet 10, x = 320
- Other sheets also have a program stacks: run `/function c0de_screenshots:activate/parameters-stacks` first

```c0de
PROGRAM stacks
NOOP
INCLUDE c0de/math
NOOP
FUNCTION calculate
    PARAMETER items INTEGER
    RESULT stacks INTEGER
    RESULT rest INTEGER
BEGIN
    VARIABLE size INTEGER 64
    CALL c0de/math/DIV
        PARAMETER dividend items ;
        PARAMETER divisor size ;
        RESULT result stacks
    ASSIGN rest items \ size ;
END FUNCTION
```

## Asking the player

`site/tutorials/learning/asking.md`

### [x] asking-input

the open terminal of the laptop while INPUT waits: "How many items?" on the screen and the input line "INPUT items (INTEGER):" with 1000 typed

- Program **stacks**, function `calculate` (`site/tutorials/programs/learning/asking-stacks.c0de`)
- Sheet 12, x = 384
- Other sheets also have a program stacks: run `/function c0de_screenshots:activate/asking-stacks` first

```c0de
PROGRAM stacks
NOOP
INCLUDE c0de/math
NOOP
FUNCTION calculate
BEGIN
    VARIABLE items INTEGER
    VARIABLE size INTEGER 64
    VARIABLE stacks INTEGER
    VARIABLE rest INTEGER
    CALL PRINT
        PARAMETER value "How many items?" ;
    CALL INPUT
        PARAMETER variable items ;
    CALL c0de/math/DIV
        PARAMETER dividend items ;
        PARAMETER divisor size ;
        RESULT result stacks
    ASSIGN rest items \ size ;
    CALL PRINT
        PARAMETER value stacks ;
    CALL PRINT
        PARAMETER value items ⊕ " items are " ⊕ stacks ⊕ " stacks and " ⊕ rest ⊕ " items." ;
END FUNCTION
```

### [x] asking-laptop

the terminal of the laptop after the run: the prompt "How many items?", the typed 1000 and the two lines of the answer, with the input line below

- Program **stacks**, function `calculate` (`site/tutorials/programs/learning/asking-stacks.c0de`)
- Sheet 12, x = 384
- Other sheets also have a program stacks: run `/function c0de_screenshots:activate/asking-stacks` first

```c0de
PROGRAM stacks
NOOP
INCLUDE c0de/math
NOOP
FUNCTION calculate
BEGIN
    VARIABLE items INTEGER
    VARIABLE size INTEGER 64
    VARIABLE stacks INTEGER
    VARIABLE rest INTEGER
    CALL PRINT
        PARAMETER value "How many items?" ;
    CALL INPUT
        PARAMETER variable items ;
    CALL c0de/math/DIV
        PARAMETER dividend items ;
        PARAMETER divisor size ;
        RESULT result stacks
    ASSIGN rest items \ size ;
    CALL PRINT
        PARAMETER value stacks ;
    CALL PRINT
        PARAMETER value items ⊕ " items are " ⊕ stacks ⊕ " stacks and " ⊕ rest ⊕ " items." ;
END FUNCTION
```

## Making decisions

`site/tutorials/learning/decisions.md`

### [x] decisions-guard-sheet

the program guard on its sheet in the c0de dimension, seen from above at the south end, with the IF and ELSE lines in the middle and all line numbers dark green

- Program **guard**, function `check` (`site/tutorials/programs/learning/decisions-guard.c0de`)
- Sheet 14, x = 448

```c0de
PROGRAM guard
NOOP
CONSTANT BASE STRING "Oak Hill"
NOOP
FUNCTION check
BEGIN
    VARIABLE visitor STRING
    VARIABLE isOwner BOOLEAN
    ASSIGN visitor PID.activator ;
    ASSIGN isOwner visitor = SHEET.owner ;
    CALL CLS
    IF isOwner ;
    BEGIN
        CALL PRINT
            PARAMETER value "Welcome home, " ⊕ visitor ⊕ "!" ;
    END
    ELSE
    BEGIN
        CALL PRINT
            PARAMETER value "Hello, " ⊕ visitor ⊕ "!" ;
        CALL PRINT
            PARAMETER value BASE ⊕ " is closed." ;
    END IF
END FUNCTION
```

### [x] decisions-guard-wall

the display wall at the entrance of the base showing "Welcome home, Steve!", the trigger block with a button below it, the player standing in front

- Program **guard**, function `check` (`site/tutorials/programs/learning/decisions-guard.c0de`)
- Sheet 14, x = 448

```c0de
PROGRAM guard
NOOP
CONSTANT BASE STRING "Oak Hill"
NOOP
FUNCTION check
BEGIN
    VARIABLE visitor STRING
    VARIABLE isOwner BOOLEAN
    ASSIGN visitor PID.activator ;
    ASSIGN isOwner visitor = SHEET.owner ;
    CALL CLS
    IF isOwner ;
    BEGIN
        CALL PRINT
            PARAMETER value "Welcome home, " ⊕ visitor ⊕ "!" ;
    END
    ELSE
    BEGIN
        CALL PRINT
            PARAMETER value "Hello, " ⊕ visitor ⊕ "!" ;
        CALL PRINT
            PARAMETER value BASE ⊕ " is closed." ;
    END IF
END FUNCTION
```

## Doing things again: counting loops

`site/tutorials/learning/counting-loops.md`

### [x] counting-loops-countdown-sheet

the program countdown on its sheet, seen from the side, with the FOR line and its indented ASSIGN line in front

- Program **countdown**, function `launch` (`site/tutorials/programs/learning/counting-loops-countdown.c0de`)
- Sheet 16, x = 512

```c0de
PROGRAM countdown
NOOP
NOOP
FUNCTION launch
BEGIN
    VARIABLE numbers STRING
    FOR i INTEGER 10 ; 0 ; -1 ;
    BEGIN
        ASSIGN numbers numbers ⊕ i ⊕ " " ;
    END FOR
    CALL CLS
    CALL PRINT
        PARAMETER value numbers ;
    CALL PRINT
        PARAMETER value "Lift-off!" ;
END FUNCTION
```

### [x] counting-loops-countdown-wall

the display wall showing "10 9 8 7 6 5 4 3 2 1 0" and "Lift-off!" below it

- Program **countdown**, function `launch` (`site/tutorials/programs/learning/counting-loops-countdown.c0de`)
- Sheet 16, x = 512

```c0de
PROGRAM countdown
NOOP
NOOP
FUNCTION launch
BEGIN
    VARIABLE numbers STRING
    FOR i INTEGER 10 ; 0 ; -1 ;
    BEGIN
        ASSIGN numbers numbers ⊕ i ⊕ " " ;
    END FOR
    CALL CLS
    CALL PRINT
        PARAMETER value numbers ;
    CALL PRINT
        PARAMETER value "Lift-off!" ;
END FUNCTION
```

## Loops with a condition

`site/tutorials/learning/condition-loops.md`

### [x] condition-loops-halving-sheet

the program halving on its sheet, seen from the south end, showing the REPEAT block with the WHILE loop indented inside it

- Program **halving**, function `halve` (`site/tutorials/programs/learning/condition-loops-halving.c0de`)
- Sheet 18, x = 576

```c0de
PROGRAM halving
NOOP
NOOP
FUNCTION halve
BEGIN
    VARIABLE number INTEGER
    VARIABLE half FLOAT
    VARIABLE steps INTEGER
    VARIABLE again STRING
    REPEAT
    BEGIN
        CALL PRINT
            PARAMETER value "Type a number:" ;
        CALL INPUT
            PARAMETER variable number ;
        ASSIGN half number ;
        ASSIGN steps 0 ;
        WHILE half > 1 ;
        BEGIN
            ASSIGN half half / 2 ;
            ASSIGN steps steps + 1 ;
        END WHILE
        CALL PRINT
            PARAMETER value "You can halve " ⊕ number ⊕ " " ⊕ steps ⊕ " times." ;
        CALL PRINT
            PARAMETER value "Another number? (yes/no)" ;
        CALL INPUT
            PARAMETER variable again ;
    END REPEAT again = "yes" ;
    CALL PRINT
        PARAMETER value "Bye!" ;
END FUNCTION
```

### [x] condition-loops-halving-laptop

the laptop terminal after two numbers: "Type a number:", 8, "You can halve 8 3 times.", "Another number? (yes/no)", yes, "Type a number:", 1000, "You can halve 1000 10 times." and the input line waiting for the answer

- Program **halving**, function `halve` (`site/tutorials/programs/learning/condition-loops-halving.c0de`)
- Sheet 18, x = 576

```c0de
PROGRAM halving
NOOP
NOOP
FUNCTION halve
BEGIN
    VARIABLE number INTEGER
    VARIABLE half FLOAT
    VARIABLE steps INTEGER
    VARIABLE again STRING
    REPEAT
    BEGIN
        CALL PRINT
            PARAMETER value "Type a number:" ;
        CALL INPUT
            PARAMETER variable number ;
        ASSIGN half number ;
        ASSIGN steps 0 ;
        WHILE half > 1 ;
        BEGIN
            ASSIGN half half / 2 ;
            ASSIGN steps steps + 1 ;
        END WHILE
        CALL PRINT
            PARAMETER value "You can halve " ⊕ number ⊕ " " ⊕ steps ⊕ " times." ;
        CALL PRINT
            PARAMETER value "Another number? (yes/no)" ;
        CALL INPUT
            PARAMETER variable again ;
    END REPEAT again = "yes" ;
    CALL PRINT
        PARAMETER value "Bye!" ;
END FUNCTION
```

## Your own functions

`site/tutorials/learning/functions.md`

### [x] functions-frame-sheet

the program frame on its sheet, seen from above, with the two FUNCTION lines (framed and welcome), each with a NOOP line above it, and the three CALL framed lines at the south end

- Program **frame**, function `welcome` (`site/tutorials/programs/learning/functions-frame.c0de`)
- Sheet 20, x = 640

```c0de
PROGRAM frame
NOOP
CONSTANT BASE STRING "Oak Hill"
NOOP
FUNCTION framed
    PARAMETER text STRING
    PARAMETER row INTEGER 0
    PARAMETER column INTEGER 0
    RESULT width INTEGER
BEGIN
    VARIABLE border STRING
    IF text = "" ;
    BEGIN
        RETURN
    END IF
    CALL LEN
        PARAMETER value text ;
        RESULT result width
    ASSIGN width width + 4 ;
    FOR i INTEGER 1 ; width ;
    BEGIN
        ASSIGN border border ⊕ "*" ;
    END FOR
    CALL LOCATE
        PARAMETER row row ;
        PARAMETER column column ;
    CALL PRINT
        PARAMETER value border ;
    CALL LOCATE
        PARAMETER row row + 1 ;
        PARAMETER column column ;
    CALL PRINT
        PARAMETER value "* " ⊕ text ⊕ " *" ;
    CALL LOCATE
        PARAMETER row row + 2 ;
        PARAMETER column column ;
    CALL PRINT
        PARAMETER value border ;
END FUNCTION
NOOP
FUNCTION welcome
BEGIN
    VARIABLE used INTEGER
    CALL CLS
    CALL framed
        PARAMETER text "Welcome" ;
        RESULT width used
    CALL framed
        PARAMETER text BASE ;
        PARAMETER column used + 1 ;
    CALL framed
        PARAMETER text "Mind the creepers!" ;
        PARAMETER row 4 ;
END FUNCTION
```

### [x] functions-frame-wall

the display wall with the three framed texts: "Welcome" and "Oak Hill" side by side at the top, "Mind the creepers!" below

- Program **frame**, function `welcome` (`site/tutorials/programs/learning/functions-frame.c0de`)
- Sheet 20, x = 640

```c0de
PROGRAM frame
NOOP
CONSTANT BASE STRING "Oak Hill"
NOOP
FUNCTION framed
    PARAMETER text STRING
    PARAMETER row INTEGER 0
    PARAMETER column INTEGER 0
    RESULT width INTEGER
BEGIN
    VARIABLE border STRING
    IF text = "" ;
    BEGIN
        RETURN
    END IF
    CALL LEN
        PARAMETER value text ;
        RESULT result width
    ASSIGN width width + 4 ;
    FOR i INTEGER 1 ; width ;
    BEGIN
        ASSIGN border border ⊕ "*" ;
    END FOR
    CALL LOCATE
        PARAMETER row row ;
        PARAMETER column column ;
    CALL PRINT
        PARAMETER value border ;
    CALL LOCATE
        PARAMETER row row + 1 ;
        PARAMETER column column ;
    CALL PRINT
        PARAMETER value "* " ⊕ text ⊕ " *" ;
    CALL LOCATE
        PARAMETER row row + 2 ;
        PARAMETER column column ;
    CALL PRINT
        PARAMETER value border ;
END FUNCTION
NOOP
FUNCTION welcome
BEGIN
    VARIABLE used INTEGER
    CALL CLS
    CALL framed
        PARAMETER text "Welcome" ;
        RESULT width used
    CALL framed
        PARAMETER text BASE ;
        PARAMETER column used + 1 ;
    CALL framed
        PARAMETER text "Mind the creepers!" ;
        PARAMETER row 4 ;
END FUNCTION
```

## Lists

`site/tutorials/learning/lists.md`

### [x] lists-notes-sheet

the program notes on its sheet, seen from above, with the VARIABLE notes ARRAY STRING block and its start value "Feed the cats" at the top and the EACH loop in the middle

- Program **notes**, function `board` (`site/tutorials/programs/learning/lists-notes.c0de`)
- Sheet 22, x = 704

```c0de
PROGRAM notes
NOOP
NOOP
FUNCTION board
BEGIN
    VARIABLE notes ARRAY STRING
    BEGIN
        "Feed the cats"
    END VARIABLE
    VARIABLE note STRING
    VARIABLE count INTEGER
    REPEAT
    BEGIN
        CALL CLS
        EACH line notes
        BEGIN
            CALL PRINT
                PARAMETER value line ;
        END EACH
        CALL INPUT
            PARAMETER variable note ;
        BREAK note = "end" ;
        CALL LEN
            PARAMETER value notes ;
            RESULT result count
        CALL INSERT
            PARAMETER array notes ;
            PARAMETER index count ;
            PARAMETER value note ;
            RESULT result notes
    END REPEAT TRUE ;
END FUNCTION
```

### [x] lists-notes-wall

the display wall at the entrance with three notes, "Feed the cats", "Get more torches" and "Plant wheat", and the laptop next to it with its terminal open

- Program **notes**, function `board` (`site/tutorials/programs/learning/lists-notes.c0de`)
- Sheet 22, x = 704

```c0de
PROGRAM notes
NOOP
NOOP
FUNCTION board
BEGIN
    VARIABLE notes ARRAY STRING
    BEGIN
        "Feed the cats"
    END VARIABLE
    VARIABLE note STRING
    VARIABLE count INTEGER
    REPEAT
    BEGIN
        CALL CLS
        EACH line notes
        BEGIN
            CALL PRINT
                PARAMETER value line ;
        END EACH
        CALL INPUT
            PARAMETER variable note ;
        BREAK note = "end" ;
        CALL LEN
            PARAMETER value notes ;
            RESULT result count
        CALL INSERT
            PARAMETER array notes ;
            PARAMETER index count ;
            PARAMETER value note ;
            RESULT result notes
    END REPEAT TRUE ;
END FUNCTION
```

## Tables and your own types

`site/tutorials/learning/tables.md`

### [x] tables-shop-sheet

the program shop on its sheet, seen from above, with the STRUCT offer declaration at the top and the two VARIABLE blocks with their start values (the price table and the offer) below

- Program **shop**, function `prices` (`site/tutorials/programs/learning/tables-shop.c0de`)
- Sheet 24, x = 768

```c0de
PROGRAM shop
NOOP
STRUCT offer
BEGIN
    item STRING
    price INTEGER
    stock INTEGER
END STRUCT
NOOP
FUNCTION prices
BEGIN
    VARIABLE price HASH INTEGER
    BEGIN
        bread 2
        torch 1
        saddle 12
        diamond 50
    END VARIABLE
    VARIABLE today STRUCT offer
    BEGIN
        item "golden apple"
        price 20
        stock 3
    END VARIABLE
    VARIABLE wanted STRING
    CALL CLS
    CALL PRINT
        PARAMETER value "Offer: " ⊕ today.item ⊕ " for " ⊕ today.price ⊕ " emeralds" ;
    CALL PRINT
        PARAMETER value "Only " ⊕ today.stock ⊕ " left!" ;
    CALL PRINT
        PARAMETER value "What do you want to buy?" ;
    CALL INPUT
        PARAMETER variable wanted ;
    CALL PRINT
        PARAMETER value wanted ⊕ " costs " ⊕ price[wanted] ⊕ " emeralds." ;
END FUNCTION
```

### [x] tables-shop-laptop

the laptop terminal showing the offer of the day, the question, the typed word saddle and the answer "saddle costs 12 emeralds."

- Program **shop**, function `prices` (`site/tutorials/programs/learning/tables-shop.c0de`)
- Sheet 24, x = 768

```c0de
PROGRAM shop
NOOP
STRUCT offer
BEGIN
    item STRING
    price INTEGER
    stock INTEGER
END STRUCT
NOOP
FUNCTION prices
BEGIN
    VARIABLE price HASH INTEGER
    BEGIN
        bread 2
        torch 1
        saddle 12
        diamond 50
    END VARIABLE
    VARIABLE today STRUCT offer
    BEGIN
        item "golden apple"
        price 20
        stock 3
    END VARIABLE
    VARIABLE wanted STRING
    CALL CLS
    CALL PRINT
        PARAMETER value "Offer: " ⊕ today.item ⊕ " for " ⊕ today.price ⊕ " emeralds" ;
    CALL PRINT
        PARAMETER value "Only " ⊕ today.stock ⊕ " left!" ;
    CALL PRINT
        PARAMETER value "What do you want to buy?" ;
    CALL INPUT
        PARAMETER variable wanted ;
    CALL PRINT
        PARAMETER value wanted ⊕ " costs " ⊕ price[wanted] ⊕ " emeralds." ;
END FUNCTION
```

## When things go wrong

`site/tutorials/learning/errors.md`

### [x] errors-broken-sheet

the program repair with its three bugs on its sheet, seen from the south, the line number 11 dark red and all other line numbers dark green or faint

- Program **repair**, function `share` (`site/tutorials/programs/learning/errors-broken.c0de`)
- Sheet 26, x = 832

```c0de
PROGRAM repair
NOOP
NOOP
FUNCTION share
    PARAMETER rows INTEGER
    PARAMETER length INTEGER
    PARAMETER players INTEGER
    RESULT wheat INTEGER
    RESULT each FLOAT
BEGIN
    ASSIGN wheat rows + length ;
    ASSIGN each wheat / players
END FUNCTION
```

### [x] errors-debug-cursor

the red debug cursor on the cursor rail next to line 11 of the program repair, and the dialog of the cursor with the values of rows, length and wheat

- Program **repair**, function `share` (`site/tutorials/programs/learning/errors-broken.c0de`)
- Sheet 26, x = 832

```c0de
PROGRAM repair
NOOP
NOOP
FUNCTION share
    PARAMETER rows INTEGER
    PARAMETER length INTEGER
    PARAMETER players INTEGER
    RESULT wheat INTEGER
    RESULT each FLOAT
BEGIN
    ASSIGN wheat rows + length ;
    ASSIGN each wheat / players
END FUNCTION
```

### [x] errors-crash-dialog

the dialog of the trigger block after the crash, showing the error code 303 DIVISION_BY_ZERO, the message "Division by 0", the function share and the line 11

- Program **repair**, function `share` (`site/tutorials/programs/learning/errors-broken.c0de`)
- Sheet 26, x = 832

```c0de
PROGRAM repair
NOOP
NOOP
FUNCTION share
    PARAMETER rows INTEGER
    PARAMETER length INTEGER
    PARAMETER players INTEGER
    RESULT wheat INTEGER
    RESULT each FLOAT
BEGIN
    ASSIGN wheat rows + length ;
    ASSIGN each wheat / players
END FUNCTION
```

## Using libraries

`site/tutorials/learning/libraries.md`

### [x] libraries-dice-sheet

the program dice on its sheet, seen from the south, with the two INCLUDE lines at the top and all line numbers dark green

- Program **dice**, function `roll` (`site/tutorials/programs/learning/libraries-dice.c0de`)
- Sheet 28, x = 896

```c0de
PROGRAM dice
NOOP
INCLUDE c0de/math
INCLUDE c0de/minecraft
NOOP
FUNCTION roll
BEGIN
    VARIABLE chance FLOAT
    VARIABLE die INTEGER
    CALL c0de/math/RANDOM
        RESULT result chance
    CALL c0de/math/INT
        PARAMETER value chance * 6 + 1 ;
        RESULT result die
    CALL c0de/minecraft/SOUND
        PARAMETER note 12 ;
        PARAMETER instrument "bell" ;
    CALL c0de/minecraft/SAY
        PARAMETER message "You rolled a " ⊕ die ;
END FUNCTION
```

### [x] libraries-dice-chat

the player in the base pressing the button on the trigger block, the chat showing three lines like "[dice/0] You rolled a 4"

- Program **dice**, function `roll` (`site/tutorials/programs/learning/libraries-dice.c0de`)
- Sheet 28, x = 896

```c0de
PROGRAM dice
NOOP
INCLUDE c0de/math
INCLUDE c0de/minecraft
NOOP
FUNCTION roll
BEGIN
    VARIABLE chance FLOAT
    VARIABLE die INTEGER
    CALL c0de/math/RANDOM
        RESULT result chance
    CALL c0de/math/INT
        PARAMETER value chance * 6 + 1 ;
        RESULT result die
    CALL c0de/minecraft/SOUND
        PARAMETER note 12 ;
        PARAMETER instrument "bell" ;
    CALL c0de/minecraft/SAY
        PARAMETER message "You rolled a " ⊕ die ;
END FUNCTION
```

## Project: guess the number

`site/tutorials/learning/guess-the-number.md`

### [x] guess-the-number-sheet

the whole program guess on its sheet, seen from above at the south end, with the function secretNumber at the top and the REPEAT loop of the function play below it

- Program **guess**, function `play` (`site/tutorials/programs/learning/guess-the-number-guess.c0de`)
- Sheet 30, x = 960

```c0de
PROGRAM guess
NOOP
INCLUDE c0de/math
NOOP
FUNCTION secretNumber
    RESULT number INTEGER
BEGIN
    VARIABLE chance FLOAT
    CALL c0de/math/RANDOM
        RESULT result chance
    CALL c0de/math/INT
        PARAMETER value chance * 100 + 1 ;
        RESULT result number
END FUNCTION
NOOP
FUNCTION play
BEGIN
    VARIABLE secret INTEGER
    VARIABLE guess INTEGER
    VARIABLE tries INTEGER
    CALL secretNumber
        RESULT number secret
    CALL CLS
    CALL COLOR
        PARAMETER foreground COLOR_YELLOW ;
    CALL PRINT
        PARAMETER value "I am thinking of a number from 1 to 100." ;
    REPEAT
    BEGIN
        CALL INPUT
            PARAMETER variable guess ;
        ASSIGN tries tries + 1 ;
        IF guess < secret ;
        BEGIN
            CALL COLOR
                PARAMETER foreground COLOR_AQUA ;
            CALL PRINT
                PARAMETER value guess ⊕ " is too low. Go higher!" ;
        END IF
        IF guess > secret ;
        BEGIN
            CALL COLOR
                PARAMETER foreground COLOR_LIGHT_PURPLE ;
            CALL PRINT
                PARAMETER value guess ⊕ " is too high. Go lower!" ;
        END IF
    END REPEAT guess ≠ secret ;
    CALL COLOR
        PARAMETER foreground COLOR_GREEN ;
    CALL PRINT
        PARAMETER value "Right! You needed " ⊕ tries ⊕ " tries." ;
END FUNCTION
```

### [x] guess-the-number-laptop

the terminal of the laptop during a game: the yellow hello, guesses with aqua and light purple answers, and the green line "Right! You needed 5 tries."

- Program **guess**, function `play` (`site/tutorials/programs/learning/guess-the-number-guess.c0de`)
- Sheet 30, x = 960

```c0de
PROGRAM guess
NOOP
INCLUDE c0de/math
NOOP
FUNCTION secretNumber
    RESULT number INTEGER
BEGIN
    VARIABLE chance FLOAT
    CALL c0de/math/RANDOM
        RESULT result chance
    CALL c0de/math/INT
        PARAMETER value chance * 100 + 1 ;
        RESULT result number
END FUNCTION
NOOP
FUNCTION play
BEGIN
    VARIABLE secret INTEGER
    VARIABLE guess INTEGER
    VARIABLE tries INTEGER
    CALL secretNumber
        RESULT number secret
    CALL CLS
    CALL COLOR
        PARAMETER foreground COLOR_YELLOW ;
    CALL PRINT
        PARAMETER value "I am thinking of a number from 1 to 100." ;
    REPEAT
    BEGIN
        CALL INPUT
            PARAMETER variable guess ;
        ASSIGN tries tries + 1 ;
        IF guess < secret ;
        BEGIN
            CALL COLOR
                PARAMETER foreground COLOR_AQUA ;
            CALL PRINT
                PARAMETER value guess ⊕ " is too low. Go higher!" ;
        END IF
        IF guess > secret ;
        BEGIN
            CALL COLOR
                PARAMETER foreground COLOR_LIGHT_PURPLE ;
            CALL PRINT
                PARAMETER value guess ⊕ " is too high. Go lower!" ;
        END IF
    END REPEAT guess ≠ secret ;
    CALL COLOR
        PARAMETER foreground COLOR_GREEN ;
    CALL PRINT
        PARAMETER value "Right! You needed " ⊕ tries ⊕ " tries." ;
END FUNCTION
```

## Project: the guarded door

`site/tutorials/learning/guarded-door.md`

### [x] guarded-door-sheet

the whole program door on its sheet, seen from above, with the start values of plate and door at the top, the function isFriend and the function watch below it

- Program **door**, function `watch` (`site/tutorials/programs/learning/guarded-door-door.c0de`)
- Sheet 32, x = 1024

```c0de
PROGRAM door
NOOP
INCLUDE c0de/minecraft
CONSTANT BASE STRING "Oak Hill"
VARIABLE friends ARRAY STRING
BEGIN
    "Alex" "Kai"
END VARIABLE
VARIABLE plate STRUCT c0de/minecraft/POSITION
BEGIN
    x 100
    y 64
    z 198
END VARIABLE
VARIABLE door STRUCT c0de/minecraft/POSITION
BEGIN
    x 100
    y 64
    z 200
END VARIABLE
NOOP
FUNCTION isFriend
    PARAMETER name STRING
    RESULT friend BOOLEAN
BEGIN
    IF name = SHEET.owner ;
    BEGIN
        ASSIGN friend TRUE ;
    END IF
    EACH someone friends
    BEGIN
        IF someone = name ;
        BEGIN
            ASSIGN friend TRUE ;
        END IF
    END EACH
END FUNCTION
NOOP
FUNCTION watch
BEGIN
    VARIABLE visitors ARRAY STRUCT c0de/minecraft/ENTITY
    VARIABLE count INTEGER
    VARIABLE strength INTEGER
    VARIABLE known BOOLEAN
    VARIABLE letIn BOOLEAN
    CALL c0de/minecraft/FIND_ENTITIES
        PARAMETER position door ;
        PARAMETER radius 5 ;
        PARAMETER type "minecraft:player" ;
        RESULT result visitors
    CALL LEN
        PARAMETER value visitors ;
        RESULT result count
    CALL CLS
    CALL COLOR
        PARAMETER foreground COLOR_YELLOW ;
    CALL PRINT
        PARAMETER value "Welcome to " ⊕ BASE ⊕ "!" ;
    CALL COLOR
        PARAMETER foreground COLOR_WHITE ;
    CALL PRINT
        PARAMETER value "Visitors at the door: " ⊕ count ;
    CALL c0de/minecraft/GET_PRESSURE_PLATE
        PARAMETER position plate ;
        RESULT result strength
    IF strength = 0 ;
    BEGIN
        RETURN
    END IF
    EACH visitor visitors
    BEGIN
        IF visitor.position.x = plate.x AND visitor.position.y = plate.y AND visitor.position.z = plate.z ;
        BEGIN
            CALL isFriend
                PARAMETER name visitor.name ;
                RESULT friend known
            IF known ;
            BEGIN
                ASSIGN letIn TRUE ;
            END IF
        END IF
    END EACH
    CALL c0de/minecraft/SET_OPEN
        PARAMETER position door ;
        PARAMETER open letIn ;
END FUNCTION
```

### [x] guarded-door-entrance

the entrance of the base from outside: the iron door open, the player on the pressure plate one block in front of it, the display wall next to the entrance showing "Welcome to Oak Hill!" and "Visitors at the door: 1"

- Program **door**, function `watch` (`site/tutorials/programs/learning/guarded-door-door.c0de`)
- Sheet 32, x = 1024

```c0de
PROGRAM door
NOOP
INCLUDE c0de/minecraft
CONSTANT BASE STRING "Oak Hill"
VARIABLE friends ARRAY STRING
BEGIN
    "Alex" "Kai"
END VARIABLE
VARIABLE plate STRUCT c0de/minecraft/POSITION
BEGIN
    x 100
    y 64
    z 198
END VARIABLE
VARIABLE door STRUCT c0de/minecraft/POSITION
BEGIN
    x 100
    y 64
    z 200
END VARIABLE
NOOP
FUNCTION isFriend
    PARAMETER name STRING
    RESULT friend BOOLEAN
BEGIN
    IF name = SHEET.owner ;
    BEGIN
        ASSIGN friend TRUE ;
    END IF
    EACH someone friends
    BEGIN
        IF someone = name ;
        BEGIN
            ASSIGN friend TRUE ;
        END IF
    END EACH
END FUNCTION
NOOP
FUNCTION watch
BEGIN
    VARIABLE visitors ARRAY STRUCT c0de/minecraft/ENTITY
    VARIABLE count INTEGER
    VARIABLE strength INTEGER
    VARIABLE known BOOLEAN
    VARIABLE letIn BOOLEAN
    CALL c0de/minecraft/FIND_ENTITIES
        PARAMETER position door ;
        PARAMETER radius 5 ;
        PARAMETER type "minecraft:player" ;
        RESULT result visitors
    CALL LEN
        PARAMETER value visitors ;
        RESULT result count
    CALL CLS
    CALL COLOR
        PARAMETER foreground COLOR_YELLOW ;
    CALL PRINT
        PARAMETER value "Welcome to " ⊕ BASE ⊕ "!" ;
    CALL COLOR
        PARAMETER foreground COLOR_WHITE ;
    CALL PRINT
        PARAMETER value "Visitors at the door: " ⊕ count ;
    CALL c0de/minecraft/GET_PRESSURE_PLATE
        PARAMETER position plate ;
        RESULT result strength
    IF strength = 0 ;
    BEGIN
        RETURN
    END IF
    EACH visitor visitors
    BEGIN
        IF visitor.position.x = plate.x AND visitor.position.y = plate.y AND visitor.position.z = plate.z ;
        BEGIN
            CALL isFriend
                PARAMETER name visitor.name ;
                RESULT friend known
            IF known ;
            BEGIN
                ASSIGN letIn TRUE ;
            END IF
        END IF
    END EACH
    CALL c0de/minecraft/SET_OPEN
        PARAMETER position door ;
        PARAMETER open letIn ;
END FUNCTION
```

## Where to go next

`site/tutorials/learning/next-steps.md`

### [x] next-steps-handbook

the handbook Functions open in the game as a red binder, showing the page of SAY with its parameters and its example

- No program: a menu or a book of the game

## Rolling dice

`site/tutorials/libraries/c0de/math/dice.md`

### [x] dice-display

a display block next to a trigger block with a button, showing "D20: 15", "D20: 4", "D20: 6" and "Total: 25"

- Program **anydie**, function `roll` (`site/tutorials/programs/libraries/math/dice-roll.c0de`)
- Sheet 34, x = 1088

```c0de
PROGRAM anydie
NOOP
INCLUDE c0de/math
NOOP
FUNCTION roll
    PARAMETER sides INTEGER 6
    PARAMETER count INTEGER 1
    PARAMETER seed INTEGER 0
    RESULT total INTEGER
BEGIN
    VARIABLE chance FLOAT
    VARIABLE die INTEGER
    IF seed ≠ 0 ;
    BEGIN
        CALL c0de/math/RANDOMIZE
            PARAMETER seed seed ;
    END IF
    CALL CLS
    FOR i INTEGER 1 ; count ;
    BEGIN
        CALL c0de/math/RANDOM
            RESULT result chance
        CALL c0de/math/INT
            PARAMETER value chance * sides + 1 ;
            RESULT result die
        CALL PRINT
            PARAMETER value "D" ⊕ sides ⊕ ": " ⊕ die ;
        ASSIGN total total + die ;
    END FOR
    CALL PRINT
        PARAMETER value "Total: " ⊕ total ;
END FUNCTION
```

## Drawing a circle

`site/tutorials/libraries/c0de/math/circle.md`

### [x] circle-ring

a ring of stone bricks with the radius 5 on flat grass around a trigger block with a button, seen from above at an angle

- Program **ring**, function `draw` (`site/tutorials/programs/libraries/math/circle-ring.c0de`)
- Sheet 36, x = 1152

```c0de
PROGRAM ring
NOOP
INCLUDE c0de/math
INCLUDE c0de/minecraft
STRUCT offset
BEGIN
    x INTEGER
    z INTEGER
END STRUCT
NOOP
FUNCTION points
    PARAMETER radius INTEGER 3
    RESULT spots ARRAY STRUCT offset
BEGIN
    VARIABLE steps INTEGER
    VARIABLE angle FLOAT
    VARIABLE cosine FLOAT
    VARIABLE sine FLOAT
    VARIABLE spot STRUCT offset
    VARIABLE count INTEGER
    VARIABLE last INTEGER
    ASSIGN steps 8 * radius ;
    FOR i INTEGER 0 ; steps - 1 ;
    BEGIN
        ASSIGN angle 2 * c0de/math/PI * i / steps ;
        CALL c0de/math/COS
            PARAMETER value angle ;
            RESULT result cosine
        CALL c0de/math/SIN
            PARAMETER value angle ;
            RESULT result sine
        CALL c0de/math/ROUND
            PARAMETER value radius * cosine ;
            RESULT result spot.x
        CALL c0de/math/ROUND
            PARAMETER value radius * sine ;
            RESULT result spot.z
        CALL LEN
            PARAMETER value spots ;
            RESULT result count
        IF count = 0 ;
        BEGIN
            ASSIGN spots[0] spot ;
        END
        ELSE
        BEGIN
            ASSIGN last count - 1 ;
            IF spot ≠ spots[last] AND spot ≠ spots[0] ;
            BEGIN
                ASSIGN spots[count] spot ;
            END IF
        END IF
    END FOR
END FUNCTION
NOOP
FUNCTION draw
    PARAMETER radius INTEGER 5
    PARAMETER block STRING "minecraft:stone_bricks"
BEGIN
    VARIABLE spots ARRAY STRUCT offset
    VARIABLE here STRUCT c0de/minecraft/POSITION
    VARIABLE problem ERROR
    VARIABLE placed INTEGER
    VARIABLE skipped INTEGER
    CALL points
        PARAMETER radius radius ;
        RESULT spots spots
    ASSIGN here.y PID.y ;
    EACH spot spots
    BEGIN
        ASSIGN here.x PID.x + spot.x ;
        ASSIGN here.z PID.z + spot.z ;
        CALL c0de/minecraft/PLACE_BLOCK problem
            PARAMETER position here ;
            PARAMETER id block ;
        IF problem.code = 0 ;
        BEGIN
            ASSIGN placed placed + 1 ;
        END
        ELSE
        BEGIN
            ASSIGN skipped skipped + 1 ;
        END IF
    END EACH
    CALL c0de/minecraft/SAY
        PARAMETER message placed ⊕ " blocks placed, " ⊕ skipped ⊕ " spots were taken" ;
END FUNCTION
```

## Growth

`site/tutorials/libraries/c0de/math/growth.md`

### [x] growth-display

a display block showing the lines "Day 0: 1" to "Day 7: 128"

- Program **farm**, function `grow` (`site/tutorials/programs/libraries/math/growth-farm.c0de`)
- Sheet 38, x = 1216

```c0de
PROGRAM farm
NOOP
INCLUDE c0de/math
NOOP
FUNCTION grow
    PARAMETER start INTEGER 1
    PARAMETER factor FLOAT 2.0
    PARAMETER days INTEGER 7
    RESULT count INTEGER
BEGIN
    VARIABLE rate FLOAT
    VARIABLE growth FLOAT
    CALL c0de/math/LOG
        PARAMETER value factor ;
        RESULT result rate
    CALL CLS
    FOR day INTEGER 0 ; days ;
    BEGIN
        CALL c0de/math/EXP
            PARAMETER value day * rate ;
            RESULT result growth
        CALL c0de/math/ROUND
            PARAMETER value start * growth ;
            RESULT result count
        CALL PRINT
            PARAMETER value "Day " ⊕ day ⊕ ": " ⊕ count ;
    END FOR
END FUNCTION
NOOP
FUNCTION daysUntil
    PARAMETER start INTEGER 1
    PARAMETER factor FLOAT 2.0
    PARAMETER goal INTEGER 1000
    RESULT days INTEGER
BEGIN
    VARIABLE ratio FLOAT
    VARIABLE rate FLOAT
    IF goal ≤ start ;
    BEGIN
        RETURN
    END IF
    CALL c0de/math/LOG
        PARAMETER value goal / start ;
        RESULT result ratio
    CALL c0de/math/LOG
        PARAMETER value factor ;
        RESULT result rate
    CALL c0de/math/INT
        PARAMETER value 0 - ratio / rate ;
        RESULT result days
    ASSIGN days 0 - days ;
    IF start * factor ^ ( days - 1 ) ≥ goal ;
    BEGIN
        ASSIGN days days - 1 ;
    END IF
END FUNCTION
NOOP
FUNCTION digits
    PARAMETER number INTEGER
    RESULT digits INTEGER
BEGIN
    VARIABLE logarithm FLOAT
    VARIABLE ten FLOAT
    CALL c0de/math/LOG
        PARAMETER value number ;
        RESULT result logarithm
    CALL c0de/math/LOG
        PARAMETER value 10 ;
        RESULT result ten
    CALL c0de/math/INT
        PARAMETER value logarithm / ten ;
        RESULT result digits
    ASSIGN digits digits + 1 ;
    IF 10 ^ digits ≤ number ;
    BEGIN
        ASSIGN digits digits + 1 ;
    END IF
END FUNCTION
```

## A name board

`site/tutorials/libraries/c0de/strings/name-board.md`

### [x] name-board-wall

the display wall of 2 × 1 blocks with the frame of = signs, the greeting WELCOME TO THE BASE OF and the name Steve

- Program **nameboard**, function `show` (`site/tutorials/programs/libraries/strings/name-board-frame.c0de`)
- Sheet 40, x = 1280

```c0de
PROGRAM nameboard
NOOP
INCLUDE c0de/strings
INCLUDE c0de/math
NOOP
CONSTANT WIDTH INTEGER 32
NOOP
FUNCTION center
    PARAMETER text STRING
    RESULT result STRING
BEGIN
    VARIABLE inner INTEGER
    VARIABLE length INTEGER
    VARIABLE before INTEGER
    VARIABLE left STRING
    VARIABLE right STRING
    ASSIGN inner WIDTH - 2 ;
    CALL LEN
        PARAMETER value text ;
        RESULT result length
    IF length > inner ;
    BEGIN
        CALL c0de/strings/LEFT
            PARAMETER text text ;
            PARAMETER length inner - 3 ;
            RESULT result text
        ASSIGN text text ⊕ "..." ;
        ASSIGN length inner ;
    END IF
    CALL c0de/math/DIV
        PARAMETER dividend inner - length ;
        PARAMETER divisor 2 ;
        RESULT result before
    CALL c0de/strings/SPACE
        PARAMETER count before ;
        RESULT result left
    CALL c0de/strings/SPACE
        PARAMETER count inner - length - before ;
        RESULT result right
    ASSIGN result "|" ⊕ left ⊕ text ⊕ right ⊕ "|" ;
END FUNCTION
NOOP
FUNCTION show
    PARAMETER name STRING
    PARAMETER title STRING "Welcome to the base of"
BEGIN
    VARIABLE border STRING
    VARIABLE line STRING
    VARIABLE first STRING
    VARIABLE rest STRING
    VARIABLE length INTEGER
    CALL c0de/strings/FILL
        PARAMETER count WIDTH - 2 ;
        PARAMETER char '=' ;
        RESULT result border
    ASSIGN border "+" ⊕ border ⊕ "+" ;
    CALL c0de/strings/UCASE
        PARAMETER text title ;
        RESULT result title
    CALL LEN
        PARAMETER value name ;
        RESULT result length
    CALL c0de/strings/LEFT
        PARAMETER text name ;
        PARAMETER length 1 ;
        RESULT result first
    CALL c0de/strings/UCASE
        PARAMETER text first ;
        RESULT result first
    CALL c0de/strings/RIGHT
        PARAMETER text name ;
        PARAMETER length length - 1 ;
        RESULT result rest
    CALL c0de/strings/LCASE
        PARAMETER text rest ;
        RESULT result rest
    CALL CLS
    CALL PRINT
        PARAMETER value border ;
    CALL center
        PARAMETER text "" ;
        RESULT result line
    CALL PRINT
        PARAMETER value line ;
    CALL center
        PARAMETER text title ;
        RESULT result line
    CALL PRINT
        PARAMETER value line ;
    CALL center
        PARAMETER text first ⊕ rest ;
        RESULT result line
    CALL PRINT
        PARAMETER value line ;
    CALL center
        PARAMETER text "" ;
        RESULT result line
    CALL PRINT
        PARAMETER value line ;
    CALL PRINT
        PARAMETER value border ;
END FUNCTION
```

## Reading commands

`site/tutorials/libraries/c0de/strings/commands.md`

### [x] commands-laptop

the terminal of the laptop after the run: the typed commands say, sum and dance with their answers, and Bye! at the end

- Program **commands**, function `terminal` (`site/tutorials/programs/libraries/strings/commands-terminal.c0de`)
- Sheet 42, x = 1344

```c0de
PROGRAM commands
NOOP
INCLUDE c0de/strings
INCLUDE c0de/math
NOOP
FUNCTION split
    PARAMETER line STRING
    RESULT word STRING
    RESULT rest STRING
BEGIN
    VARIABLE space INTEGER
    CALL c0de/strings/INSTR
        PARAMETER text line ;
        PARAMETER search " " ;
        RESULT result space
    IF space < 0 ;
    BEGIN
        ASSIGN word line ;
        RETURN
    END IF
    CALL c0de/strings/MID
        PARAMETER text line ;
        PARAMETER start 0 ;
        PARAMETER length space ;
        RESULT result word
    CALL c0de/strings/MID
        PARAMETER text line ;
        PARAMETER start space + 1 ;
        RESULT result rest
END FUNCTION
NOOP
FUNCTION say
    PARAMETER text STRING
BEGIN
    VARIABLE found INTEGER
    CALL c0de/strings/INSTR
        PARAMETER text text ;
        PARAMETER search "creeper" ;
        RESULT result found
    WHILE found ≥ 0 ;
    BEGIN
        CALL c0de/strings/REPLACE
            PARAMETER text text ;
            PARAMETER start found ;
            PARAMETER insert "*******" ;
            RESULT result text
        CALL c0de/strings/INSTR
            PARAMETER text text ;
            PARAMETER search "creeper" ;
            PARAMETER start found ;
            RESULT result found
    END WHILE
    CALL PRINT
        PARAMETER value text ;
END FUNCTION
NOOP
FUNCTION sum
    PARAMETER numbers STRING
BEGIN
    VARIABLE first STRING
    VARIABLE second STRING
    VARIABLE a FLOAT
    VARIABLE b FLOAT
    VARIABLE wholeA BOOLEAN
    VARIABLE wholeB BOOLEAN
    VARIABLE total INTEGER
    VARIABLE answer STRING
    VARIABLE problem ERROR
    CALL split
        PARAMETER line numbers ;
        RESULT word first
        RESULT rest second
    CALL c0de/strings/VAL problem
        PARAMETER text first ;
        RESULT value a
        RESULT isInteger wholeA
    CALL c0de/strings/VAL problem
        PARAMETER text second ;
        RESULT value b
        RESULT isInteger wholeB
    IF problem.code ≠ 0 OR NOT ( wholeA AND wholeB ) ;
    BEGIN
        CALL PRINT
            PARAMETER value "? sum needs two whole numbers" ;
        RETURN
    END IF
    CALL c0de/math/FIX
        PARAMETER value a + b ;
        RESULT result total
    CALL c0de/strings/STR
        PARAMETER value total ;
        RESULT result answer
    CALL PRINT
        PARAMETER value first ⊕ " + " ⊕ second ⊕ " = " ⊕ answer ;
END FUNCTION
NOOP
FUNCTION terminal
BEGIN
    VARIABLE line STRING
    VARIABLE word STRING
    VARIABLE rest STRING
    CALL CLS
    CALL PRINT
        PARAMETER value "Commands: say <text>, sum <a> <b>, quit" ;
    REPEAT
    BEGIN
        CALL INPUT
            PARAMETER variable line ;
        CALL split
            PARAMETER line line ;
            RESULT word word
            RESULT rest rest
        IF word = "say" ;
        BEGIN
            CALL say
                PARAMETER text rest ;
        END IF
        IF word = "sum" ;
        BEGIN
            CALL sum
                PARAMETER numbers rest ;
        END IF
        IF word ≠ "say" AND word ≠ "sum" AND word ≠ "quit" ;
        BEGIN
            CALL PRINT
                PARAMETER value "? unknown command: " ⊕ word ;
        END IF
    END REPEAT word ≠ "quit" ;
    CALL PRINT
        PARAMETER value "Bye!" ;
END FUNCTION
```

## Secret messages

`site/tutorials/libraries/c0de/strings/secret-messages.md`

### [x] secret-messages-laptop

the terminal of the laptop after the run: the typed message and key, the secret text and the decoded message

- Program **caesar**, function `laptop` (`site/tutorials/programs/libraries/strings/secret-messages-caesar.c0de`)
- Sheet 44, x = 1408

```c0de
PROGRAM caesar
NOOP
INCLUDE c0de/strings
NOOP
FUNCTION shiftLetter
    PARAMETER letter CHAR
    PARAMETER key INTEGER
    RESULT result CHAR
BEGIN
    VARIABLE code INTEGER
    VARIABLE first INTEGER
    ASSIGN result letter ;
    CALL c0de/strings/ASC
        PARAMETER char letter ;
        RESULT result code
    IF code ≥ 65 AND code ≤ 90 ;
    BEGIN
        ASSIGN first 65 ;
    END IF
    IF code ≥ 97 AND code ≤ 122 ;
    BEGIN
        ASSIGN first 97 ;
    END IF
    IF first > 0 ;
    BEGIN
        CALL c0de/strings/CHR
            PARAMETER code first + ( code - first + key \ 26 + 26 ) \ 26 ;
            RESULT result result
    END IF
END FUNCTION
NOOP
FUNCTION encode
    PARAMETER text STRING
    PARAMETER key INTEGER
    RESULT result STRING
BEGIN
    VARIABLE length INTEGER
    VARIABLE letter CHAR
    CALL LEN
        PARAMETER value text ;
        RESULT result length
    FOR i INTEGER 0 ; length - 1 ;
    BEGIN
        CALL shiftLetter
            PARAMETER letter text[i] ;
            PARAMETER key key ;
            RESULT result letter
        ASSIGN result result ⊕ letter ;
    END FOR
END FUNCTION
NOOP
FUNCTION laptop
BEGIN
    VARIABLE message STRING
    VARIABLE key INTEGER
    VARIABLE secret STRING
    VARIABLE back STRING
    CALL CLS
    CALL PRINT
        PARAMETER value "Message?" ;
    CALL INPUT
        PARAMETER variable message ;
    CALL PRINT
        PARAMETER value "Key?" ;
    CALL INPUT
        PARAMETER variable key ;
    CALL encode
        PARAMETER text message ;
        PARAMETER key key ;
        RESULT result secret
    CALL encode
        PARAMETER text secret ;
        PARAMETER key - key ;
        RESULT result back
    CALL PRINT
        PARAMETER value "Secret: " ⊕ secret ;
    CALL PRINT
        PARAMETER value "Decoded: " ⊕ back ;
END FUNCTION
```

## Numbers as text

`site/tutorials/libraries/c0de/strings/numbers-as-text.md`

### [x] numbers-as-text-laptop

the terminal of the laptop with the date, the stock table in aligned columns and the total

- Program **itemtable**, function `show` (`site/tutorials/programs/libraries/strings/numbers-as-text-table.c0de`)
- Sheet 46, x = 1472

```c0de
PROGRAM itemtable
NOOP
INCLUDE c0de/strings
INCLUDE c0de/time
NOOP
FUNCTION show
BEGIN
    VARIABLE stock HASH INTEGER
    BEGIN
        cobblestone 1234
        diamond 7
        oak_log 96
        torch 320
    END VARIABLE
    VARIABLE today TIME
    VARIABLE total INTEGER
    VARIABLE line STRING
    VARIABLE part STRING
    CALL c0de/time/NOW
        RESULT result today
    CALL c0de/strings/FORMAT
        PARAMETER value today ;
        PARAMETER format "Stock on %tA, %tF at %tR" ;
        RESULT result line
    CALL CLS
    CALL PRINT
        PARAMETER value line ;
    CALL PRINT
        PARAMETER value "Item          Count  Stacks   Hex    Oct" ;
    EACH item stock
    BEGIN
        CALL c0de/strings/FORMAT
            PARAMETER value item ;
            PARAMETER format "%-12s" ;
            RESULT result line
        CALL c0de/strings/FORMAT
            PARAMETER value stock[item] ;
            PARAMETER format "%7d" ;
            RESULT result part
        ASSIGN line line ⊕ part ;
        CALL c0de/strings/FORMAT
            PARAMETER value stock[item] / 64 ;
            PARAMETER format "%8.1f" ;
            RESULT result part
        ASSIGN line line ⊕ part ;
        CALL c0de/strings/HEX
            PARAMETER value stock[item] ;
            RESULT result part
        CALL c0de/strings/FORMAT
            PARAMETER value part ;
            PARAMETER format "%6s" ;
            RESULT result part
        ASSIGN line line ⊕ part ;
        CALL c0de/strings/OCT
            PARAMETER value stock[item] ;
            RESULT result part
        CALL c0de/strings/FORMAT
            PARAMETER value part ;
            PARAMETER format "%7s" ;
            RESULT result part
        CALL PRINT
            PARAMETER value line ⊕ part ;
        ASSIGN total total + stock[item] ;
    END EACH
    CALL c0de/strings/FORMAT
        PARAMETER value total ;
        PARAMETER format "Total %,13d" ;
        RESULT result line
    CALL PRINT
        PARAMETER value line ;
END FUNCTION
```

## Saving data as text

`site/tutorials/libraries/c0de/strings/saving-data.md`

### [x] saving-data-io-block

the dialog of the I/O block after the run, with the variable item scores in its output

- Program **highscores**, function `add` (`site/tutorials/programs/libraries/strings/saving-data-highscores.c0de`)
- Sheet 48, x = 1536

```c0de
PROGRAM highscores
NOOP
INCLUDE c0de/strings
NOOP
STRUCT entry
BEGIN
    name STRING
    points INTEGER
END STRUCT
NOOP
CONSTANT PLACES INTEGER 5
NOOP
FUNCTION add
    PARAMETER scores STRING "[]"
    RESULT yaml STRING
BEGIN
    VARIABLE table ARRAY STRUCT entry
    VARIABLE player STRING
    VARIABLE points INTEGER
    VARIABLE newcomer STRUCT entry
    VARIABLE place INTEGER
    VARIABLE count INTEGER
    CALL c0de/strings/FROM_JSON
        PARAMETER source scores ;
        PARAMETER destination table ;
    CALL CLS
    CALL PRINT
        PARAMETER value "Name?" ;
    CALL INPUT
        PARAMETER variable player ;
    CALL PRINT
        PARAMETER value "Points?" ;
    CALL INPUT
        PARAMETER variable points ;
    ASSIGN newcomer.name player ;
    ASSIGN newcomer.points points ;
    EACH e table
    BEGIN
        IF e.points ≥ points ;
        BEGIN
            ASSIGN place place + 1 ;
        END IF
    END EACH
    CALL INSERT
        PARAMETER array table ;
        PARAMETER index place ;
        PARAMETER value newcomer ;
        RESULT result table
    CALL LEN
        PARAMETER value table ;
        RESULT result count
    IF count > PLACES ;
    BEGIN
        CALL REMOVE
            PARAMETER container table ;
            PARAMETER index PLACES ;
            RESULT result table
    END IF
    CALL c0de/strings/TO_JSON
        PARAMETER value table ;
        RESULT result scores
    CALL WRITE
        PARAMETER value scores ;
        PARAMETER name "scores" ;
    CALL c0de/strings/TO_YAML
        PARAMETER value table ;
        RESULT result yaml
    EACH e table
    BEGIN
        CALL PRINT
            PARAMETER value e.name ⊕ " " ⊕ e.points ;
    END EACH
END FUNCTION
```

## A clock on the wall

`site/tutorials/libraries/c0de/time/clock.md`

### [x] clock-wall

a display wall of 2 × 1 display blocks showing the time 09:05:03 in the middle, the timer block in front of it

- Program **wallclock**, function `tick` (`site/tutorials/programs/libraries/time/clock-wall.c0de`)
- Sheet 50, x = 1600

```c0de
PROGRAM wallclock
NOOP
INCLUDE c0de/time
INCLUDE c0de/strings
NOOP
FUNCTION tick
BEGIN
    VARIABLE now TIME
    VARIABLE part INTEGER
    VARIABLE text STRING
    VARIABLE digits STRING
    CALL c0de/time/NOW
        RESULT result now
    CALL c0de/time/HOUR
        PARAMETER time now ;
        RESULT result part
    CALL c0de/strings/FORMAT
        PARAMETER value part ;
        PARAMETER format "%02d" ;
        RESULT result text
    CALL c0de/time/MINUTE
        PARAMETER time now ;
        RESULT result part
    CALL c0de/strings/FORMAT
        PARAMETER value part ;
        PARAMETER format ":%02d" ;
        RESULT result digits
    ASSIGN text text ⊕ digits ;
    CALL c0de/time/SECOND
        PARAMETER time now ;
        RESULT result part
    CALL c0de/strings/FORMAT
        PARAMETER value part ;
        PARAMETER format ":%02d" ;
        RESULT result digits
    CALL LOCATE
        PARAMETER row 3 ;
        PARAMETER column 12 ;
    CALL PRINT
        PARAMETER value text ⊕ digits ;
END FUNCTION
```

## Stopwatch and reaction test

`site/tutorials/libraries/c0de/time/stopwatch.md`

### [x] stopwatch-buttons

the two trigger blocks with buttons side by side, the hopper and chest under the second one, and the display wall showing the start, stop and elapsed time

- Program **stopwatch**, function `stop` (`site/tutorials/programs/libraries/time/stopwatch-buttons.c0de`)
- Sheet 52, x = 1664

```c0de
PROGRAM stopwatch
NOOP
INCLUDE c0de/time
INCLUDE c0de/strings
NOOP
FUNCTION stamp
    PARAMETER time TIME
    RESULT text STRING
BEGIN
    VARIABLE millis INTEGER
    VARIABLE digits STRING
    CALL c0de/strings/FORMAT
        PARAMETER value time ;
        PARAMETER format "%tT" ;
        RESULT result text
    CALL c0de/time/MILLISECOND
        PARAMETER time time ;
        RESULT result millis
    CALL c0de/strings/FORMAT
        PARAMETER value millis ;
        PARAMETER format ".%03d" ;
        RESULT result digits
    ASSIGN text text ⊕ digits ;
END FUNCTION
NOOP
FUNCTION start
    RESULT started TIME
BEGIN
    CALL c0de/time/NOW
        RESULT result started
END FUNCTION
NOOP
FUNCTION stop
    PARAMETER started TIME
    RESULT seconds FLOAT
BEGIN
    VARIABLE now TIME
    VARIABLE text STRING
    CALL c0de/time/NOW
        RESULT result now
    ASSIGN seconds (now - started) / 1000 ;
    CALL CLS
    CALL stamp
        PARAMETER time started ;
        RESULT text text
    CALL PRINT
        PARAMETER value "Start " ⊕ text ;
    CALL stamp
        PARAMETER time now ;
        RESULT text text
    CALL PRINT
        PARAMETER value "Stop  " ⊕ text ;
    CALL c0de/strings/FORMAT
        PARAMETER value seconds ;
        PARAMETER format "%.3f" ;
        RESULT result text
    CALL PRINT
        PARAMETER value "Time  " ⊕ text ⊕ " s" ;
END FUNCTION
```

## Game time and real time

`site/tutorials/libraries/c0de/time/game-time.md`

### [x] game-time-bounce

a display block with the ball "o" in the middle of row 3, the trigger block with its button in front of it

- Program **bouncer**, function `bounce` (`site/tutorials/programs/libraries/time/game-time-bounce.c0de`)
- Sheet 54, x = 1728

```c0de
PROGRAM bouncer
NOOP
INCLUDE c0de/time
NOOP
FUNCTION bounce
    PARAMETER rounds INTEGER 3
    PARAMETER delay INTEGER 2
BEGIN
    CALL CLS
    FOR round INTEGER 1 ; rounds ;
    BEGIN
        FOR column INTEGER 0 ; 14 ;
        BEGIN
            CALL LOCATE
                PARAMETER row 3 ;
                PARAMETER column column ;
            CALL PRINT
                PARAMETER value " o" ;
            CALL c0de/time/SLEEP
                PARAMETER ticks delay ;
        END FOR
        FOR column INTEGER 14 ; 0 ; -1 ;
        BEGIN
            CALL LOCATE
                PARAMETER row 3 ;
                PARAMETER column column ;
            CALL PRINT
                PARAMETER value "o " ;
            CALL c0de/time/SLEEP
                PARAMETER ticks delay ;
        END FOR
    END FOR
END FUNCTION
```

## Doorbell and music

`site/tutorials/libraries/c0de/minecraft/doorbell.md`

### [x] doorbell-door

the front door of the base from outside with the trigger block and its button beside it, and the chat line with "Steve is at the front door."

- Program **doorbell**, function `ring` (`site/tutorials/programs/libraries/minecraft/doorbell-bell.c0de`)
- Sheet 56, x = 1792

```c0de
PROGRAM doorbell
NOOP
INCLUDE c0de/minecraft
NOOP
FUNCTION ring
BEGIN
    VARIABLE visitor STRING "Someone"
    IF PID.activator ≠ "" ;
    BEGIN
        ASSIGN visitor PID.activator ;
    END IF
    CALL c0de/minecraft/BEEP
    CALL c0de/minecraft/SAY
        PARAMETER message visitor ⊕ " is at the front door." ;
END FUNCTION
```

## A combination lock

`site/tutorials/libraries/c0de/minecraft/combination-lock.md`

### [x] combination-lock-levers

the four levers on the ground in front of the base, two of them on, the stone button at the end of the row, the timer block on the left and the closed iron door behind them

- Program **combolock**, function `watch` (`site/tutorials/programs/libraries/minecraft/combination-lock-lock.c0de`)
- Sheet 58, x = 1856

```c0de
PROGRAM combolock
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de/time
NOOP
VARIABLE secret ARRAY BOOLEAN
BEGIN
    TRUE FALSE TRUE TRUE
END VARIABLE
NOOP
FUNCTION near
    PARAMETER dx INTEGER
    PARAMETER dy INTEGER
    PARAMETER dz INTEGER
    RESULT spot STRUCT c0de/minecraft/POSITION
BEGIN
    ASSIGN spot.x PID.x + dx ;
    ASSIGN spot.y PID.y + dy ;
    ASSIGN spot.z PID.z + dz ;
END FUNCTION
NOOP
FUNCTION matches
    PARAMETER levers ARRAY BOOLEAN
    RESULT result BOOLEAN
BEGIN
    ASSIGN result TRUE ;
    FOR i INTEGER 0 ; 3 ;
    BEGIN
        IF levers[i] ≠ secret[i] ;
        BEGIN
            ASSIGN result FALSE ;
        END IF
    END FOR
END FUNCTION
NOOP
FUNCTION watch
BEGIN
    VARIABLE enter STRUCT c0de/minecraft/POSITION
    VARIABLE lever STRUCT c0de/minecraft/POSITION
    VARIABLE doorButton STRUCT c0de/minecraft/POSITION
    VARIABLE pressed BOOLEAN
    VARIABLE isOn BOOLEAN
    VARIABLE levers ARRAY BOOLEAN
    VARIABLE right BOOLEAN
    CALL near
        PARAMETER dx 7 ;
        PARAMETER dy 0 ;
        PARAMETER dz 0 ;
        RESULT spot enter
    CALL c0de/minecraft/GET_BUTTON
        PARAMETER position enter ;
        RESULT result pressed
    IF NOT pressed ;
    BEGIN
        RETURN
    END IF
    FOR i INTEGER 0 ; 3 ;
    BEGIN
        CALL near
            PARAMETER dx 2 + i ;
            PARAMETER dy 0 ;
            PARAMETER dz 0 ;
            RESULT spot lever
        CALL c0de/minecraft/GET_LEVER
            PARAMETER position lever ;
            RESULT result isOn
        ASSIGN levers[i] isOn ;
        CALL c0de/minecraft/SET_LEVER
            PARAMETER position lever ;
            PARAMETER on FALSE ;
    END FOR
    CALL matches
        PARAMETER levers levers ;
        RESULT result right
    IF right ;
    BEGIN
        CALL near
            PARAMETER dx 3 ;
            PARAMETER dy 1 ;
            PARAMETER dz -4 ;
            RESULT spot doorButton
        CALL c0de/minecraft/PRESS_BUTTON
            PARAMETER position doorButton ;
    END
    ELSE
    BEGIN
        CALL c0de/minecraft/SAY
            PARAMETER message "Wrong combination." ;
    END IF
    WHILE pressed ;
    BEGIN
        CALL c0de/time/SLEEP
            PARAMETER ticks 5 ;
        CALL c0de/minecraft/GET_BUTTON
            PARAMETER position enter ;
            RESULT result pressed
    END WHILE
END FUNCTION
```

## Automatic doors

`site/tutorials/libraries/c0de/minecraft/automatic-doors.md`

### [x] automatic-doors-door

the open wooden door seen from outside, the player on the outside plate two blocks in front of it, the inside plate visible through the doorway and the timer block in the foreground

- Program **autodoor**, function `watch` (`site/tutorials/programs/libraries/minecraft/automatic-doors-door.c0de`)
- Sheet 60, x = 1920

```c0de
PROGRAM autodoor
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de/time
NOOP
FUNCTION near
    PARAMETER dx INTEGER
    PARAMETER dy INTEGER
    PARAMETER dz INTEGER
    RESULT spot STRUCT c0de/minecraft/POSITION
BEGIN
    ASSIGN spot.x PID.x + dx ;
    ASSIGN spot.y PID.y + dy ;
    ASSIGN spot.z PID.z + dz ;
END FUNCTION
NOOP
FUNCTION someone
    RESULT result BOOLEAN
BEGIN
    VARIABLE plate STRUCT c0de/minecraft/POSITION
    VARIABLE outside INTEGER
    VARIABLE inside INTEGER
    CALL near
        PARAMETER dx 0 ;
        PARAMETER dy 0 ;
        PARAMETER dz -2 ;
        RESULT spot plate
    CALL c0de/minecraft/GET_PRESSURE_PLATE
        PARAMETER position plate ;
        RESULT result outside
    CALL near
        PARAMETER dx 0 ;
        PARAMETER dy 0 ;
        PARAMETER dz -6 ;
        RESULT spot plate
    CALL c0de/minecraft/GET_PRESSURE_PLATE
        PARAMETER position plate ;
        RESULT result inside
    ASSIGN result outside > 0 OR inside > 0 ;
END FUNCTION
NOOP
FUNCTION watch
BEGIN
    VARIABLE door STRUCT c0de/minecraft/POSITION
    VARIABLE isOpen BOOLEAN
    VARIABLE waiting BOOLEAN
    CALL near
        PARAMETER dx 0 ;
        PARAMETER dy 0 ;
        PARAMETER dz -4 ;
        RESULT spot door
    CALL c0de/minecraft/GET_OPEN
        PARAMETER position door ;
        RESULT result isOpen
    CALL someone
        RESULT result waiting
    IF waiting AND NOT isOpen ;
    BEGIN
        CALL c0de/minecraft/SET_OPEN
            PARAMETER position door ;
            PARAMETER open TRUE ;
    END IF
    IF isOpen AND NOT waiting ;
    BEGIN
        CALL c0de/time/SLEEP
            PARAMETER ticks 40 ;
        CALL someone
            RESULT result waiting
        IF NOT waiting ;
        BEGIN
            CALL c0de/minecraft/SET_OPEN
                PARAMETER position door ;
                PARAMETER open FALSE ;
        END IF
    END IF
END FUNCTION
```

## Watching the surroundings

`site/tutorials/libraries/c0de/minecraft/watching.md`

### [x] watching-farm

the wheat field of 4 × 4 plants, partly ripe, with the timer block beside it and the display wall showing "Wheat: 16 plants" and "Ripe: 5"

- Program **farmwatch**, function `check` (`site/tutorials/programs/libraries/minecraft/watching-farm.c0de`)
- Sheet 62, x = 1984

```c0de
PROGRAM farmwatch
NOOP
INCLUDE c0de/minecraft
NOOP
FUNCTION check
BEGIN
    VARIABLE spot STRUCT c0de/minecraft/POSITION
    VARIABLE id STRING
    VARIABLE states HASH STRING
    VARIABLE ripe INTEGER
    VARIABLE plants INTEGER
    ASSIGN spot.y PID.y ;
    FOR dx INTEGER 2 ; 5 ;
    BEGIN
        FOR dz INTEGER 0 ; 3 ;
        BEGIN
            ASSIGN spot.x PID.x + dx ;
            ASSIGN spot.z PID.z + dz ;
            CALL c0de/minecraft/GET_BLOCK
                PARAMETER position spot ;
                RESULT id id
                RESULT properties states
            IF id = "minecraft:wheat" ;
            BEGIN
                ASSIGN plants plants + 1 ;
                IF states["age"] = "7" ;
                BEGIN
                    ASSIGN ripe ripe + 1 ;
                END IF
            END IF
        END FOR
    END FOR
    CALL CLS
    CALL PRINT
        PARAMETER value "Wheat: " ⊕ plants ⊕ " plants" ;
    CALL PRINT
        PARAMETER value "Ripe: " ⊕ ripe ;
    IF ripe > 0 AND ripe = plants ;
    BEGIN
        CALL c0de/minecraft/SAY
            PARAMETER message "The wheat is ripe!" ;
    END IF
END FUNCTION
```

### [x] watching-pen

the fenced pen with sheep, cows and pigs, the timer block north of it, and the display wall listing the animals and "Animals: 9"

- Program **pencount**, function `count` (`site/tutorials/programs/libraries/minecraft/watching-pen.c0de`)
- Sheet 64, x = 2048

```c0de
PROGRAM pencount
NOOP
INCLUDE c0de/minecraft
NOOP
VARIABLE animals ARRAY STRING
BEGIN
    "sheep" "cow" "pig" "chicken"
END VARIABLE
NOOP
FUNCTION count
BEGIN
    VARIABLE pen STRUCT c0de/minecraft/POSITION
    VARIABLE found ARRAY STRUCT c0de/minecraft/ENTITY
    VARIABLE number INTEGER
    VARIABLE total INTEGER
    ASSIGN pen.x PID.x ;
    ASSIGN pen.y PID.y ;
    ASSIGN pen.z PID.z + 5 ;
    CALL CLS
    EACH animal animals
    BEGIN
        CALL c0de/minecraft/FIND_ENTITIES
            PARAMETER position pen ;
            PARAMETER radius 4 ;
            PARAMETER type "minecraft:" ⊕ animal ;
            RESULT result found
        CALL LEN
            PARAMETER value found ;
            RESULT result number
        ASSIGN total total + number ;
        CALL PRINT
            PARAMETER value animal ⊕ ": " ⊕ number ;
    END EACH
    CALL PRINT
        PARAMETER value "Animals: " ⊕ total ;
END FUNCTION
```

## Sorting the storage

`site/tutorials/libraries/c0de/minecraft/sorting.md`

### [x] sorting-chests

the row of chests seen from the side, the hopper on the input chest, the timer block to the west, and the open food chest with bread and apples

- Program **sorter**, function `sort` (`site/tutorials/programs/libraries/minecraft/sorting-sorter.c0de`)
- Sheet 66, x = 2112

```c0de
PROGRAM sorter
NOOP
INCLUDE c0de/minecraft
NOOP
VARIABLE blocks ARRAY STRING
BEGIN
    "minecraft:cobblestone" "minecraft:dirt" "minecraft:sand" "minecraft:gravel"
END VARIABLE
VARIABLE food ARRAY STRING
BEGIN
    "minecraft:bread" "minecraft:apple" "minecraft:carrot" "minecraft:potato"
END VARIABLE
NOOP
FUNCTION chestFor
    PARAMETER id STRING
    RESULT chest INTEGER
BEGIN
    EACH name blocks
    BEGIN
        IF name = id ;
        BEGIN
            ASSIGN chest 1 ;
        END IF
    END EACH
    EACH name food
    BEGIN
        IF name = id ;
        BEGIN
            ASSIGN chest 2 ;
        END IF
    END EACH
END FUNCTION
NOOP
FUNCTION sort
BEGIN
    VARIABLE input STRUCT c0de/minecraft/POSITION
    VARIABLE target STRUCT c0de/minecraft/POSITION
    VARIABLE slots ARRAY STRUCT c0de/minecraft/ITEM_STACK
    VARIABLE chest INTEGER
    VARIABLE moved INTEGER
    ASSIGN input.x PID.x + 2 ;
    ASSIGN input.y PID.y ;
    ASSIGN input.z PID.z ;
    ASSIGN target input ;
    CALL c0de/minecraft/GET_INVENTORY
        PARAMETER position input ;
        RESULT result slots
    EACH slot slots
    BEGIN
        CALL chestFor
            PARAMETER id slot.id ;
            RESULT chest chest
        IF slot.count > 0 AND chest > 0 ;
        BEGIN
            ASSIGN target.x input.x + 2 * chest ;
            CALL c0de/minecraft/MOVE_ITEMS
                PARAMETER from input ;
                PARAMETER to target ;
                PARAMETER id slot.id ;
                PARAMETER count slot.count ;
                RESULT result moved
            IF moved < slot.count ;
            BEGIN
                CALL c0de/minecraft/SAY
                    PARAMETER message "Chest " ⊕ chest ⊕ " is full." ;
            END IF
        END IF
    END EACH
END FUNCTION
```

## Building

`site/tutorials/libraries/c0de/minecraft/building.md`

### [x] building-wall

the finished wall of stone bricks, 8 blocks long and 3 high, with the trigger block and its button in front of its west end and the chest 2 blocks west of it

- Program **wallbuilder**, function `wall` (`site/tutorials/programs/libraries/minecraft/building-wall.c0de`)
- Sheet 68, x = 2176

```c0de
PROGRAM wallbuilder
NOOP
INCLUDE c0de/minecraft
NOOP
FUNCTION wall
    PARAMETER length INTEGER 8
    PARAMETER height INTEGER 3
    PARAMETER material STRING "minecraft:stone_bricks"
BEGIN
    VARIABLE chest STRUCT c0de/minecraft/POSITION
    VARIABLE spot STRUCT c0de/minecraft/POSITION
    VARIABLE problem ERROR
    ASSIGN chest.x PID.x - 2 ;
    ASSIGN chest.y PID.y ;
    ASSIGN chest.z PID.z ;
    ASSIGN spot.z PID.z ;
    FOR row INTEGER 0 ; height - 1 ;
    BEGIN
        FOR i INTEGER 0 ; length - 1 ;
        BEGIN
            ASSIGN spot.x PID.x + 2 + i ;
            ASSIGN spot.y PID.y + row ;
            CALL c0de/minecraft/PLACE_BLOCK problem
                PARAMETER position spot ;
                PARAMETER id material ;
                PARAMETER inventory chest ;
            IF problem.code ≠ 0 ;
            BEGIN
                CALL c0de/minecraft/SAY
                    PARAMETER message "The wall stops here: " ⊕ problem.message ;
                RETURN
            END IF
        END FOR
    END FOR
END FUNCTION
```

### [x] building-tower

the hollow cobblestone tower, 6 blocks high, half pulled down from the top, cobblestone items lying around it, the trigger block and the chest in front of it

- Program **towerbuilder**, function `build` (`site/tutorials/programs/libraries/minecraft/building-tower.c0de`)
- Sheet 70, x = 2240

```c0de
PROGRAM towerbuilder
NOOP
INCLUDE c0de/minecraft
NOOP
CONSTANT MATERIAL STRING "minecraft:cobblestone"
NOOP
FUNCTION build
    PARAMETER height INTEGER 6
BEGIN
    VARIABLE chest STRUCT c0de/minecraft/POSITION
    VARIABLE spot STRUCT c0de/minecraft/POSITION
    ASSIGN chest.x PID.x - 2 ;
    ASSIGN chest.y PID.y ;
    ASSIGN chest.z PID.z ;
    FOR level INTEGER 0 ; height - 1 ;
    BEGIN
        FOR dx INTEGER 0 ; 2 ;
        BEGIN
            FOR dz INTEGER 0 ; 2 ;
            BEGIN
                IF dx ≠ 1 OR dz ≠ 1 ;
                BEGIN
                    ASSIGN spot.x PID.x + 2 + dx ;
                    ASSIGN spot.y PID.y + level ;
                    ASSIGN spot.z PID.z - 1 + dz ;
                    CALL c0de/minecraft/PLACE_BLOCK
                        PARAMETER position spot ;
                        PARAMETER id MATERIAL ;
                        PARAMETER inventory chest ;
                END IF
            END FOR
        END FOR
    END FOR
END FUNCTION
NOOP
FUNCTION pullDown
    PARAMETER height INTEGER 6
BEGIN
    VARIABLE spot STRUCT c0de/minecraft/POSITION
    VARIABLE id STRING
    FOR level INTEGER height - 1 ; 0 ; -1 ;
    BEGIN
        FOR dx INTEGER 0 ; 2 ;
        BEGIN
            FOR dz INTEGER 0 ; 2 ;
            BEGIN
                ASSIGN spot.x PID.x + 2 + dx ;
                ASSIGN spot.y PID.y + level ;
                ASSIGN spot.z PID.z - 1 + dz ;
                CALL c0de/minecraft/GET_BLOCK
                    PARAMETER position spot ;
                    RESULT id id
                IF id = MATERIAL ;
                BEGIN
                    CALL c0de/minecraft/REMOVE_BLOCK
                        PARAMETER position spot ;
                        PARAMETER drop TRUE ;
                END IF
            END FOR
        END FOR
    END FOR
END FUNCTION
```

## A tunnel digger

`site/tutorials/libraries/c0de/minecraft/tunnel-digger.md`

### [x] tunnel-digger-tunnel

the entrance of the tunnel in the side of a hill, two blocks high, the trigger block in front of it, the tools chest on the left and the open drops chest on the right with cobblestone and coal

- Program **tunneldigger**, function `dig` (`site/tutorials/programs/libraries/minecraft/tunnel-digger-dig.c0de`)
- Sheet 72, x = 2304

```c0de
PROGRAM tunneldigger
NOOP
INCLUDE c0de/minecraft
NOOP
FUNCTION decide
    PARAMETER id STRING
    RESULT action STRING
BEGIN
    ASSIGN action "mine" ;
    IF id = "minecraft:air" OR id = "minecraft:cave_air" ;
    BEGIN
        ASSIGN action "skip" ;
    END IF
    IF id = "minecraft:water" OR id = "minecraft:lava" OR id = "minecraft:bedrock" ;
    BEGIN
        ASSIGN action "stop" ;
    END IF
END FUNCTION
NOOP
FUNCTION dig
    PARAMETER length INTEGER 10
BEGIN
    VARIABLE tools STRUCT c0de/minecraft/POSITION
    VARIABLE drops STRUCT c0de/minecraft/POSITION
    VARIABLE spot STRUCT c0de/minecraft/POSITION
    VARIABLE id STRING
    VARIABLE action STRING
    VARIABLE problem ERROR
    ASSIGN tools.x PID.x ;
    ASSIGN tools.y PID.y ;
    ASSIGN tools.z PID.z - 2 ;
    ASSIGN drops tools ;
    ASSIGN drops.z PID.z + 2 ;
    ASSIGN spot.z PID.z ;
    FOR i INTEGER 1 ; length ;
    BEGIN
        FOR dy INTEGER 0 ; 1 ;
        BEGIN
            ASSIGN spot.x PID.x + 1 + i ;
            ASSIGN spot.y PID.y + dy ;
            CALL c0de/minecraft/GET_BLOCK
                PARAMETER position spot ;
                RESULT id id
            CALL decide
                PARAMETER id id ;
                RESULT action action
            IF action = "stop" ;
            BEGIN
                CALL c0de/minecraft/SAY
                    PARAMETER message "Stopped after " ⊕ ( i - 1 ) ⊕ " blocks: " ⊕ id ;
                RETURN
            END IF
            IF action = "mine" ;
            BEGIN
                CALL c0de/minecraft/MINE_BLOCK problem
                    PARAMETER position spot ;
                    PARAMETER tool_inventory tools ;
                    PARAMETER output_inventory drops ;
                IF problem.code ≠ 0 ;
                BEGIN
                    CALL c0de/minecraft/SAY
                        PARAMETER message "Stopped after " ⊕ ( i - 1 ) ⊕ " blocks: " ⊕ problem.message ;
                    RETURN
                END IF
            END IF
        END FOR
    END FOR
    CALL c0de/minecraft/SAY
        PARAMETER message "The tunnel is " ⊕ length ⊕ " blocks long." ;
END FUNCTION
```

## Rewards and teleporters

`site/tutorials/libraries/c0de/minecraft/rewards.md`

### [x] rewards-pen

the fenced pen with several sheep, one of them just appeared in the middle, the trigger block with its button north of the pen and the chat line "Animal number 4 is in the pen."

- Program **animalspawner**, function `spawn` (`site/tutorials/programs/libraries/minecraft/rewards-spawner.c0de`)
- Sheet 74, x = 2368

```c0de
PROGRAM animalspawner
NOOP
INCLUDE c0de/minecraft
NOOP
FUNCTION spawn
    PARAMETER animal STRING "minecraft:sheep"
    PARAMETER most INTEGER 8
BEGIN
    VARIABLE pen STRUCT c0de/minecraft/POSITION
    VARIABLE found ARRAY STRUCT c0de/minecraft/ENTITY
    VARIABLE count INTEGER
    ASSIGN pen.x PID.x ;
    ASSIGN pen.y PID.y ;
    ASSIGN pen.z PID.z + 5 ;
    CALL c0de/minecraft/FIND_ENTITIES
        PARAMETER position pen ;
        PARAMETER radius 4 ;
        PARAMETER type animal ;
        RESULT result found
    CALL LEN
        PARAMETER value found ;
        RESULT result count
    IF count ≥ most ;
    BEGIN
        CALL c0de/minecraft/SAY
            PARAMETER message "The pen is full: " ⊕ count ⊕ " animals." ;
        RETURN
    END IF
    CALL c0de/minecraft/SPAWN_ENTITY
        PARAMETER position pen ;
        PARAMETER type animal ;
    CALL c0de/minecraft/SAY
        PARAMETER message "Animal number " ⊕ ( count + 1 ) ⊕ " is in the pen." ;
END FUNCTION
```

### [x] rewards-hub

the teleporter hub: three pressure plates in a row with signs "Farm", "Mine" and "Tower" behind them, the timer block at the west end

- Program **teleporterhub**, function `hub` (`site/tutorials/programs/libraries/minecraft/rewards-hub.c0de`)
- Sheet 76, x = 2432

```c0de
PROGRAM teleporterhub
NOOP
INCLUDE c0de/minecraft
NOOP
VARIABLE farm STRUCT c0de/minecraft/POSITION
BEGIN
    x 120
    y 64
    z 240
END VARIABLE
VARIABLE mine STRUCT c0de/minecraft/POSITION
BEGIN
    x -80
    y 12
    z 150
END VARIABLE
VARIABLE tower STRUCT c0de/minecraft/POSITION
BEGIN
    x 100
    y 90
    z 180
END VARIABLE
NOOP
FUNCTION send
    PARAMETER dx INTEGER
    PARAMETER place STRUCT c0de/minecraft/POSITION
BEGIN
    VARIABLE plate STRUCT c0de/minecraft/POSITION
    VARIABLE strength INTEGER
    VARIABLE players ARRAY STRUCT c0de/minecraft/ENTITY
    ASSIGN plate.x PID.x + dx ;
    ASSIGN plate.y PID.y ;
    ASSIGN plate.z PID.z ;
    CALL c0de/minecraft/GET_PRESSURE_PLATE
        PARAMETER position plate ;
        RESULT result strength
    IF strength = 0 ;
    BEGIN
        RETURN
    END IF
    CALL c0de/minecraft/FIND_ENTITIES
        PARAMETER position plate ;
        PARAMETER radius 1 ;
        PARAMETER type "minecraft:player" ;
        RESULT result players
    EACH player players
    BEGIN
        IF player.position.x = plate.x AND player.position.y = plate.y AND player.position.z = plate.z ;
        BEGIN
            CALL c0de/minecraft/TELEPORT
                PARAMETER uuid player.uuid ;
                PARAMETER position place ;
        END IF
    END EACH
END FUNCTION
NOOP
FUNCTION hub
BEGIN
    CALL send
        PARAMETER dx 2 ;
        PARAMETER place farm ;
    CALL send
        PARAMETER dx 4 ;
        PARAMETER place mine ;
    CALL send
        PARAMETER dx 6 ;
        PARAMETER place tower ;
END FUNCTION
```

## Reading data from the web

`site/tutorials/libraries/c0de_net/http/weather.md`

### [x] weather-wall

The display wall showing Vienna, Austria, the sky, the temperature and the wind

- Program **weatherwall**, function `show` (`site/tutorials/programs/libraries/http/weather-wall.c0de`)
- Sheet 78, x = 2496

```c0de
PROGRAM weatherwall
NOOP
INCLUDE c0de/strings
INCLUDE c0de_net/http
NOOP
STRUCT place
BEGIN
    name STRING
    country STRING
    latitude FLOAT
    longitude FLOAT
END STRUCT
NOOP
STRUCT search
BEGIN
    results ARRAY STRUCT place
END STRUCT
NOOP
STRUCT weather
BEGIN
    temperature FLOAT TAG(json: "temperature_2m")
    wind FLOAT TAG(json: "wind_speed_10m")
    code INTEGER TAG(json: "weather_code")
END STRUCT
NOOP
FUNCTION sky
    PARAMETER code INTEGER
    RESULT result STRING
BEGIN
    ASSIGN result "Clear" ;
    IF code ≥ 1 ;
    BEGIN
        ASSIGN result "Cloudy" ;
    END IF
    IF code ≥ 45 ;
    BEGIN
        ASSIGN result "Fog" ;
    END IF
    IF code ≥ 51 ;
    BEGIN
        ASSIGN result "Rain" ;
    END IF
    IF code ≥ 71 ;
    BEGIN
        ASSIGN result "Snow" ;
    END IF
    IF code ≥ 80 ;
    BEGIN
        ASSIGN result "Showers" ;
    END IF
    IF code ≥ 95 ;
    BEGIN
        ASSIGN result "Thunderstorm" ;
    END IF
END FUNCTION
NOOP
FUNCTION show
    PARAMETER city STRING "Vienna"
    RESULT found BOOLEAN
BEGIN
    VARIABLE api STRUCT c0de_net/http/HTTP_CONNECTION
    VARIABLE answer STRING
    VARIABLE places STRUCT search
    VARIABLE town STRUCT place
    VARIABLE now STRUCT weather TAG(json: "current")
    VARIABLE count INTEGER
    VARIABLE text STRING
    ASSIGN api.use_ssl TRUE ;
    ASSIGN api.server "geocoding-api.open-meteo.com" ;
    ASSIGN api.timeout 10 ;
    CALL c0de_net/http/HTTP_GET
        PARAMETER connection api ;
        PARAMETER endpoint "/v1/search?count=1&name=" ⊕ city ;
        RESULT result answer
    CALL c0de/strings/FROM_JSON
        PARAMETER source answer ;
        PARAMETER destination places ;
    CALL LEN
        PARAMETER value places.results ;
        RESULT result count
    CALL CLS
    IF count = 0 ;
    BEGIN
        CALL PRINT
            PARAMETER value "No city called " ⊕ city ;
        RETURN
    END IF
    ASSIGN found TRUE ;
    ASSIGN town places.results[0] ;
    ASSIGN api.server "api.open-meteo.com" ;
    CALL c0de_net/http/HTTP_GET
        PARAMETER connection api ;
        PARAMETER endpoint "/v1/forecast?latitude=" ⊕ town.latitude ⊕ "&longitude=" ⊕ town.longitude ⊕ "&current=temperature_2m,wind_speed_10m,weather_code" ;
        RESULT result answer
    CALL c0de/strings/FROM_JSON
        PARAMETER source answer ;
        PARAMETER destination now ;
    CALL sky
        PARAMETER code now.code ;
        RESULT result text
    CALL PRINT
        PARAMETER value town.name ⊕ ", " ⊕ town.country ;
    CALL PRINT
        PARAMETER value "" ;
    CALL PRINT
        PARAMETER value text ;
    CALL PRINT
        PARAMETER value now.temperature ⊕ " °C" ;
    CALL PRINT
        PARAMETER value "Wind " ⊕ now.wind ⊕ " km/h" ;
END FUNCTION
```

## Checking a service

`site/tutorials/libraries/c0de_net/http/checking.md`

### [x] checking-lamp

The timer block with comparator and a dark redstone lamp, the display wall showing c0de.at/ and Status 200

- Program **statuslamp**, function `check` (`site/tutorials/programs/libraries/http/checking-lamp.c0de`)
- Sheet 80, x = 2560

```c0de
PROGRAM statuslamp
NOOP
INCLUDE c0de/strings
INCLUDE c0de_net/http
NOOP
STRUCT page
BEGIN
    type STRING TAG(json: "content-type")
    changed STRING TAG(json: "last-modified")
END STRUCT
NOOP
FUNCTION check
    PARAMETER server STRING "c0de.at"
    PARAMETER endpoint STRING "/"
BEGIN
    VARIABLE status INTEGER
    VARIABLE api STRUCT c0de_net/http/HTTP_CONNECTION
    VARIABLE problem ERROR
    VARIABLE answer STRING
    VARIABLE info STRUCT page
    ASSIGN api.use_ssl TRUE ;
    ASSIGN api.server server ;
    ASSIGN api.timeout 5 ;
    CALL c0de_net/http/HTTP_HEAD problem
        PARAMETER connection api ;
        PARAMETER endpoint endpoint ;
        RESULT result answer
        RESULT status status
    CALL CLS
    CALL PRINT
        PARAMETER value server ⊕ endpoint ;
    IF problem.code ≠ 0 AND problem.code ≠ c0de_net/http/HTTP_STATUS ;
    BEGIN
        CALL PRINT
            PARAMETER value "DOWN: " ⊕ problem.message ;
        EXIT 2 ;
    END IF
    CALL c0de/strings/FROM_JSON
        PARAMETER source answer ;
        PARAMETER destination info ;
    CALL PRINT
        PARAMETER value "Status " ⊕ status ;
    CALL PRINT
        PARAMETER value info.type ;
    CALL PRINT
        PARAMETER value info.changed ;
    IF problem.code = c0de_net/http/HTTP_STATUS ;
    BEGIN
        EXIT 1 ;
    END IF
END FUNCTION
```

## Home automation

`site/tutorials/libraries/c0de_net/http/home-automation.md`

### [x] home-automation-lever

The trigger block with the lever on top, switched on, and the PID block of the running process on the sheet

- Program **lamppreview**, function `preview` (`site/tutorials/programs/libraries/http/home-automation-preview.c0de`)
- Sheet 82, x = 2624

```c0de
PROGRAM lamppreview
NOOP
INCLUDE c0de/strings
INCLUDE c0de_net/http
NOOP
STRUCT received
BEGIN
    method STRING
    path STRING
    headers HASH STRING
    body STRING
END STRUCT
NOOP
FUNCTION preview
    PARAMETER token STRING "test"
    PARAMETER on BOOLEAN TRUE
BEGIN
    VARIABLE hub STRUCT c0de_net/http/HTTP_CONNECTION
    VARIABLE state BOOLEAN TAG(json: "on")
    VARIABLE data STRING
    VARIABLE answer STRING
    VARIABLE echo STRUCT received
    ASSIGN hub.use_ssl TRUE ;
    ASSIGN hub.server "c0de.at" ;
    ASSIGN hub.base_endpoint "/api/tutorial/echo" ;
    ASSIGN hub.headers["Authorization"] "Bearer " ⊕ token ;
    ASSIGN hub.headers["Content-Type"] "application/json" ;
    ASSIGN hub.timeout 5 ;
    ASSIGN state on ;
    CALL c0de/strings/TO_JSON
        PARAMETER value state ;
        RESULT result data
    CALL c0de_net/http/HTTP_PUT
        PARAMETER connection hub ;
        PARAMETER endpoint "/lamps/kitchen" ;
        PARAMETER data data ;
        RESULT result answer
    CALL c0de/strings/FROM_JSON
        PARAMETER source answer ;
        PARAMETER destination echo ;
    CALL CLS
    CALL PRINT
        PARAMETER value echo.method ⊕ " " ⊕ echo.path ;
    CALL PRINT
        PARAMETER value "Authorization: " ⊕ echo.headers["authorization"] ;
    CALL PRINT
        PARAMETER value "Content-Type: " ⊕ echo.headers["content-type"] ;
    CALL PRINT
        PARAMETER value echo.body ;
END FUNCTION
```

## Is my c0de up to date?

`site/tutorials/libraries/c0de_net/http/up-to-date.md`

### [x] up-to-date-wall

The display wall with the two green lines c0de 0.7.1: up to date and c0de net 0.4.0: up to date

- Program **versioncheck**, function `check` (`site/tutorials/programs/libraries/http/up-to-date-check.c0de`)
- Sheet 84, x = 2688

```c0de
PROGRAM versioncheck
NOOP
INCLUDE c0de/strings
INCLUDE c0de_net/http
NOOP
STRUCT releases
BEGIN
    c0de STRING
    net STRING TAG(json: "c0de_net")
END STRUCT
NOOP
FUNCTION compare
    PARAMETER name STRING
    PARAMETER installed STRING
    PARAMETER latest STRING
    RESULT current BOOLEAN
BEGIN
    ASSIGN current installed = latest ;
    IF current ;
    BEGIN
        CALL COLOR
            PARAMETER foreground COLOR_GREEN ;
        CALL PRINT
            PARAMETER value name ⊕ " " ⊕ installed ⊕ ": up to date" ;
    END
    ELSE
    BEGIN
        CALL COLOR
            PARAMETER foreground COLOR_RED ;
        CALL PRINT
            PARAMETER value name ⊕ " " ⊕ installed ⊕ ": " ⊕ latest ⊕ " is out" ;
    END IF
    CALL COLOR
        PARAMETER foreground COLOR_WHITE ;
END FUNCTION
NOOP
FUNCTION check
    RESULT current BOOLEAN
BEGIN
    VARIABLE api STRUCT c0de_net/http/HTTP_CONNECTION
    VARIABLE answer STRING
    VARIABLE latest STRUCT releases
    VARIABLE netCurrent BOOLEAN
    ASSIGN api.use_ssl TRUE ;
    ASSIGN api.server "c0de.at" ;
    ASSIGN api.timeout 10 ;
    CALL c0de_net/http/HTTP_GET
        PARAMETER connection api ;
        PARAMETER endpoint "/api/version" ;
        RESULT result answer
    CALL c0de/strings/FROM_JSON
        PARAMETER source answer ;
        PARAMETER destination latest ;
    CALL CLS
    CALL compare
        PARAMETER name "c0de" ;
        PARAMETER installed C0DE_VERSION ;
        PARAMETER latest latest.c0de ;
        RESULT current current
    CALL compare
        PARAMETER name "c0de net" ;
        PARAMETER installed C0DE_NET_VERSION ;
        PARAMETER latest latest.net ;
        RESULT current netCurrent
    ASSIGN current current AND netCurrent ;
END FUNCTION
```

## Checking input

`site/tutorials/libraries/c0de/strings/checking-input.md`

### [x] checking-input-laptop

the screen of the laptop after the run: the rejected names and coordinates with their ? answers, and the welcome line at the end

- Program **checking**, function `signup` (`site/tutorials/programs/libraries/strings/checking-input-signup.c0de`)
- Sheet 86, x = 2752

```c0de
PROGRAM checking
NOOP
INCLUDE c0de/strings
NOOP
FUNCTION askName
    RESULT name STRING
BEGIN
    VARIABLE ok BOOLEAN
    REPEAT
    BEGIN
        CALL PRINT
            PARAMETER value "Your name:" ;
        CALL INPUT
            PARAMETER variable name ;
        CALL c0de/strings/REGEX_MATCH
            PARAMETER text name ;
            PARAMETER pattern "^[A-Za-z0-9_]{3,16}$" ;
            RESULT result ok
        IF NOT ok ;
        BEGIN
            CALL PRINT
                PARAMETER value "? 3 to 16 letters, digits or _" ;
        END IF
    END REPEAT NOT ok ;
END FUNCTION
NOOP
FUNCTION askHome
    RESULT home STRING
BEGIN
    VARIABLE ok BOOLEAN
    REPEAT
    BEGIN
        CALL PRINT
            PARAMETER value "Your home (x y z):" ;
        CALL INPUT
            PARAMETER variable home ;
        CALL c0de/strings/REGEX_REPLACE
            PARAMETER text home ;
            PARAMETER pattern "[ ,]+" ;
            PARAMETER replacement " " ;
            PARAMETER flags "g" ;
            RESULT result home
        CALL c0de/strings/REGEX_REPLACE
            PARAMETER text home ;
            PARAMETER pattern "^ | $" ;
            PARAMETER replacement "" ;
            PARAMETER flags "g" ;
            RESULT result home
        CALL c0de/strings/REGEX_MATCH
            PARAMETER text home ;
            PARAMETER pattern "^-?[0-9]+ -?[0-9]+ -?[0-9]+$" ;
            RESULT result ok
        IF NOT ok ;
        BEGIN
            CALL PRINT
                PARAMETER value "? three whole numbers, like 12 64 -30" ;
        END IF
    END REPEAT NOT ok ;
END FUNCTION
NOOP
FUNCTION signup
BEGIN
    VARIABLE name STRING
    VARIABLE home STRING
    VARIABLE coordinates STRING
    CALL CLS
    CALL askName
        RESULT name name
    CALL askHome
        RESULT home home
    CALL c0de/strings/REGEX_REPLACE
        PARAMETER text home ;
        PARAMETER pattern "(-?[0-9]+) (-?[0-9]+) (-?[0-9]+)" ;
        PARAMETER replacement "x=\\1 y=\\2 z=\\3" ;
        RESULT result coordinates
    CALL PRINT
        PARAMETER value "Welcome, " ⊕ name ⊕ "! Home: " ⊕ coordinates ;
END FUNCTION
```

## Copying signs and chests

`site/tutorials/libraries/c0de/minecraft/copying-signs.md`

### [x] copying-signs-copy

the trigger block with its button between a written sign and its copy, the chat showing the copied data

- Program **copier**, function `copy` (`site/tutorials/programs/libraries/minecraft/copying-signs-copy.c0de`)
- Sheet 88, x = 2816
- Other sheets also have a program copier: run `/function c0de_screenshots:activate/copying-signs-copy` first

```c0de
PROGRAM copier
NOOP
INCLUDE c0de/minecraft
NOOP
FUNCTION copy
BEGIN
    VARIABLE source STRUCT c0de/minecraft/POSITION
    VARIABLE target STRUCT c0de/minecraft/POSITION
    VARIABLE blockId STRING
    VARIABLE states HASH STRING
    VARIABLE data STRING
    VARIABLE problem ERROR
    ASSIGN source.x PID.x - 2 ;
    ASSIGN source.y PID.y ;
    ASSIGN source.z PID.z ;
    ASSIGN target source ;
    ASSIGN target.x PID.x + 2 ;
    CALL c0de/minecraft/GET_BLOCK
        PARAMETER position source ;
        RESULT id blockId
        RESULT properties states
        RESULT data data
    IF blockId = "minecraft:air" ;
    BEGIN
        CALL c0de/minecraft/SAY
            PARAMETER message "There is nothing to copy." ;
        RETURN
    END IF
    CALL c0de/minecraft/PLACE_BLOCK problem
        PARAMETER position target ;
        PARAMETER id blockId ;
        PARAMETER properties states ;
        PARAMETER data data ;
    IF problem.code ≠ 0 ;
    BEGIN
        CALL c0de/minecraft/SAY
            PARAMETER message "No copy: " ⊕ problem.message ;
        RETURN
    END IF
    CALL c0de/minecraft/SAY
        PARAMETER message "Copied " ⊕ blockId ⊕ " with the data " ⊕ data ;
END FUNCTION
```

## Server commands

`site/tutorials/libraries/c0de/minecraft/server-commands.md`

### [x] server-commands-morning

the trigger block with its button in the morning sun, the chat showing the good morning message of goodmorning

- Program **goodmorning**, function `morning` (`site/tutorials/programs/libraries/minecraft/server-commands-morning.c0de`)
- Sheet 90, x = 2880

```c0de
PROGRAM goodmorning
NOOP
INCLUDE c0de/minecraft
NOOP
VARIABLE commands ARRAY STRING
BEGIN
    "time set day" "weather clear"
END VARIABLE
NOOP
FUNCTION morning
BEGIN
    VARIABLE done INTEGER
    VARIABLE message STRING
    VARIABLE failed INTEGER
    EACH line commands
    BEGIN
        CALL c0de/minecraft/COMMAND
            PARAMETER command line ;
            RESULT result done
            RESULT output message
        IF done = 0 ;
        BEGIN
            CALL c0de/minecraft/SAY
                PARAMETER message "/" ⊕ line ⊕ " failed: " ⊕ message ;
            ASSIGN failed failed + 1 ;
        END IF
    END EACH
    IF failed = 0 ;
    BEGIN
        CALL c0de/minecraft/COMMAND
            PARAMETER command "say Good morning, everybody! The sun is up." ;
    END IF
END FUNCTION
```

## A door with a password

`site/tutorials/libraries/c0de/security/password-door.md`

### [x] password-door-setup

the laptop of the door after setup: "New password:", "***", "Repeat it:", "***" and "Password set."

- Program **passdoor**, function `open` (`site/tutorials/programs/libraries/security/password-door-door.c0de`)
- Sheet 92, x = 2944

```c0de
PROGRAM passdoor
NOOP
INCLUDE c0de/security
NOOP
CONSTANT NAME STRING "doorPassword"
NOOP
FUNCTION check
    RESULT right BOOLEAN
BEGIN
    SECRET doorPassword STRING
    VARIABLE typed STRING TAG(security: "sensitive")
    CALL PRINT
        PARAMETER value "Password:" ;
    CALL INPUT
        PARAMETER variable typed ;
        PARAMETER hide TRUE ;
    ASSIGN right typed = doorPassword ;
END FUNCTION
NOOP
FUNCTION setup
BEGIN
    VARIABLE password STRING TAG(security: "sensitive")
    VARIABLE again STRING TAG(security: "sensitive")
    CALL CLS
    CALL PRINT
        PARAMETER value "New password:" ;
    CALL INPUT
        PARAMETER variable password ;
        PARAMETER hide TRUE ;
    CALL PRINT
        PARAMETER value "Repeat it:" ;
    CALL INPUT
        PARAMETER variable again ;
        PARAMETER hide TRUE ;
    IF password = "" OR password ≠ again ;
    BEGIN
        CALL PRINT
            PARAMETER value "Not the same twice. Nothing changed." ;
        RETURN
    END IF
    CALL c0de/security/SET_SECRET
        PARAMETER name NAME ;
        PARAMETER value password ;
    CALL PRINT
        PARAMETER value "Password set." ;
END FUNCTION
NOOP
FUNCTION open
BEGIN
    VARIABLE known BOOLEAN
    VARIABLE right BOOLEAN
    VARIABLE problem ERROR
    CALL CLS
    CALL c0de/security/HAS_SECRET problem
        PARAMETER name NAME ;
        RESULT result known
    IF problem.code = VAULT_UNAVAILABLE ;
    BEGIN
        CALL PRINT
            PARAMETER value "This door only listens to its owner." ;
        RETURN
    END IF
    IF NOT known ;
    BEGIN
        CALL PRINT
            PARAMETER value "No password yet. Run setup first." ;
        RETURN
    END IF
    CALL check
        RESULT right right
    IF NOT right ;
    BEGIN
        CALL PRINT
            PARAMETER value "Wrong password." ;
        RETURN
    END IF
    CALL PRINT
        PARAMETER value "Welcome home!" ;
    EXIT 1 ;
END FUNCTION
NOOP
FUNCTION forget
BEGIN
    VARIABLE problem ERROR
    CALL CLS
    CALL c0de/security/DELETE_SECRET problem
        PARAMETER name NAME ;
    IF problem.code = SECRET_NOT_FOUND ;
    BEGIN
        CALL PRINT
            PARAMETER value "There is no password to forget." ;
        RETURN
    END IF
    CALL PRINT
        PARAMETER value "Password forgotten. The door stays shut." ;
END FUNCTION
```

### [x] password-door-open

the iron door open, the comparator between the trigger block and the door lit, the laptop next to it showing "Password:", "***" and "Welcome home!"

- Program **passdoor**, function `open` (`site/tutorials/programs/libraries/security/password-door-door.c0de`)
- Sheet 92, x = 2944

```c0de
PROGRAM passdoor
NOOP
INCLUDE c0de/security
NOOP
CONSTANT NAME STRING "doorPassword"
NOOP
FUNCTION check
    RESULT right BOOLEAN
BEGIN
    SECRET doorPassword STRING
    VARIABLE typed STRING TAG(security: "sensitive")
    CALL PRINT
        PARAMETER value "Password:" ;
    CALL INPUT
        PARAMETER variable typed ;
        PARAMETER hide TRUE ;
    ASSIGN right typed = doorPassword ;
END FUNCTION
NOOP
FUNCTION setup
BEGIN
    VARIABLE password STRING TAG(security: "sensitive")
    VARIABLE again STRING TAG(security: "sensitive")
    CALL CLS
    CALL PRINT
        PARAMETER value "New password:" ;
    CALL INPUT
        PARAMETER variable password ;
        PARAMETER hide TRUE ;
    CALL PRINT
        PARAMETER value "Repeat it:" ;
    CALL INPUT
        PARAMETER variable again ;
        PARAMETER hide TRUE ;
    IF password = "" OR password ≠ again ;
    BEGIN
        CALL PRINT
            PARAMETER value "Not the same twice. Nothing changed." ;
        RETURN
    END IF
    CALL c0de/security/SET_SECRET
        PARAMETER name NAME ;
        PARAMETER value password ;
    CALL PRINT
        PARAMETER value "Password set." ;
END FUNCTION
NOOP
FUNCTION open
BEGIN
    VARIABLE known BOOLEAN
    VARIABLE right BOOLEAN
    VARIABLE problem ERROR
    CALL CLS
    CALL c0de/security/HAS_SECRET problem
        PARAMETER name NAME ;
        RESULT result known
    IF problem.code = VAULT_UNAVAILABLE ;
    BEGIN
        CALL PRINT
            PARAMETER value "This door only listens to its owner." ;
        RETURN
    END IF
    IF NOT known ;
    BEGIN
        CALL PRINT
            PARAMETER value "No password yet. Run setup first." ;
        RETURN
    END IF
    CALL check
        RESULT right right
    IF NOT right ;
    BEGIN
        CALL PRINT
            PARAMETER value "Wrong password." ;
        RETURN
    END IF
    CALL PRINT
        PARAMETER value "Welcome home!" ;
    EXIT 1 ;
END FUNCTION
NOOP
FUNCTION forget
BEGIN
    VARIABLE problem ERROR
    CALL CLS
    CALL c0de/security/DELETE_SECRET problem
        PARAMETER name NAME ;
    IF problem.code = SECRET_NOT_FOUND ;
    BEGIN
        CALL PRINT
            PARAMETER value "There is no password to forget." ;
        RETURN
    END IF
    CALL PRINT
        PARAMETER value "Password forgotten. The door stays shut." ;
END FUNCTION
```

## Keeping keys

`site/tutorials/libraries/c0de/security/keeping-keys.md`

### [x] keeping-keys-create

the dialog "Create your vault" with the fields Password and Repeat filled with dots, and the buttons OK and Cancel

- Program **keys**, function `store` (`site/tutorials/programs/libraries/security/keeping-keys-keys.c0de`)
- Sheet 94, x = 3008

```c0de
PROGRAM keys
NOOP
INCLUDE c0de/security
INCLUDE c0de/strings
NOOP
CONSTANT NAME STRING "apiKey"
NOOP
FUNCTION unlock
    PARAMETER password STRING
    RESULT ready BOOLEAN
BEGIN
    VARIABLE exists BOOLEAN
    VARIABLE problem ERROR
    CALL c0de/security/IS_VAULT_OPEN
        RESULT result ready
    IF ready ;
    BEGIN
        RETURN
    END IF
    CALL c0de/security/HAS_VAULT
        RESULT result exists
    IF exists ;
    BEGIN
        CALL c0de/security/OPEN_VAULT problem
            PARAMETER password password ;
    END
    ELSE
    BEGIN
        CALL c0de/security/CREATE_VAULT problem
            PARAMETER password password ;
    END IF
    IF problem.code = VAULT_CANCELLED ;
    BEGIN
        CALL PRINT
            PARAMETER value "Cancelled. Your vault stays shut." ;
        RETURN
    END IF
    IF problem.code ≠ 0 ;
    BEGIN
        CALL PRINT
            PARAMETER value "? " ⊕ problem.message ;
        RETURN
    END IF
    IF NOT exists ;
    BEGIN
        CALL PRINT
            PARAMETER value "Your new vault is ready." ;
    END IF
    ASSIGN ready TRUE ;
END FUNCTION
NOOP
FUNCTION store
    PARAMETER password STRING ""
BEGIN
    VARIABLE ready BOOLEAN
    VARIABLE key STRING TAG(security: "sensitive")
    CALL CLS
    CALL unlock
        PARAMETER password password ;
        RESULT ready ready
    IF NOT ready ;
    BEGIN
        RETURN
    END IF
    CALL PRINT
        PARAMETER value "Key:" ;
    CALL INPUT
        PARAMETER variable key ;
        PARAMETER hide TRUE ;
    CALL c0de/security/SET_SECRET
        PARAMETER name NAME ;
        PARAMETER value key ;
        PARAMETER persistent TRUE ;
    CALL PRINT
        PARAMETER value "Key kept in your vault." ;
END FUNCTION
NOOP
FUNCTION peek
BEGIN
    SECRET apiKey STRING
    VARIABLE ending STRING
    CALL c0de/strings/RIGHT
        PARAMETER text apiKey ;
        PARAMETER length 4 ;
        RESULT result ending
    CALL PRINT
        PARAMETER value "Your key ends with ..." ⊕ ending ;
END FUNCTION
NOOP
FUNCTION show
    PARAMETER password STRING ""
BEGIN
    VARIABLE ready BOOLEAN
    VARIABLE known BOOLEAN
    CALL CLS
    CALL unlock
        PARAMETER password password ;
        RESULT ready ready
    IF NOT ready ;
    BEGIN
        RETURN
    END IF
    CALL c0de/security/HAS_SECRET
        PARAMETER name NAME ;
        RESULT result known
    IF NOT known ;
    BEGIN
        CALL PRINT
            PARAMETER value "No key in your vault. Run store first." ;
        RETURN
    END IF
    CALL peek
END FUNCTION
```

### [x] keeping-keys-open

the dialog "Open your vault" with one password field, the message "Wrong password, try again" below it

- Program **keys**, function `store` (`site/tutorials/programs/libraries/security/keeping-keys-keys.c0de`)
- Sheet 94, x = 3008

```c0de
PROGRAM keys
NOOP
INCLUDE c0de/security
INCLUDE c0de/strings
NOOP
CONSTANT NAME STRING "apiKey"
NOOP
FUNCTION unlock
    PARAMETER password STRING
    RESULT ready BOOLEAN
BEGIN
    VARIABLE exists BOOLEAN
    VARIABLE problem ERROR
    CALL c0de/security/IS_VAULT_OPEN
        RESULT result ready
    IF ready ;
    BEGIN
        RETURN
    END IF
    CALL c0de/security/HAS_VAULT
        RESULT result exists
    IF exists ;
    BEGIN
        CALL c0de/security/OPEN_VAULT problem
            PARAMETER password password ;
    END
    ELSE
    BEGIN
        CALL c0de/security/CREATE_VAULT problem
            PARAMETER password password ;
    END IF
    IF problem.code = VAULT_CANCELLED ;
    BEGIN
        CALL PRINT
            PARAMETER value "Cancelled. Your vault stays shut." ;
        RETURN
    END IF
    IF problem.code ≠ 0 ;
    BEGIN
        CALL PRINT
            PARAMETER value "? " ⊕ problem.message ;
        RETURN
    END IF
    IF NOT exists ;
    BEGIN
        CALL PRINT
            PARAMETER value "Your new vault is ready." ;
    END IF
    ASSIGN ready TRUE ;
END FUNCTION
NOOP
FUNCTION store
    PARAMETER password STRING ""
BEGIN
    VARIABLE ready BOOLEAN
    VARIABLE key STRING TAG(security: "sensitive")
    CALL CLS
    CALL unlock
        PARAMETER password password ;
        RESULT ready ready
    IF NOT ready ;
    BEGIN
        RETURN
    END IF
    CALL PRINT
        PARAMETER value "Key:" ;
    CALL INPUT
        PARAMETER variable key ;
        PARAMETER hide TRUE ;
    CALL c0de/security/SET_SECRET
        PARAMETER name NAME ;
        PARAMETER value key ;
        PARAMETER persistent TRUE ;
    CALL PRINT
        PARAMETER value "Key kept in your vault." ;
END FUNCTION
NOOP
FUNCTION peek
BEGIN
    SECRET apiKey STRING
    VARIABLE ending STRING
    CALL c0de/strings/RIGHT
        PARAMETER text apiKey ;
        PARAMETER length 4 ;
        RESULT result ending
    CALL PRINT
        PARAMETER value "Your key ends with ..." ⊕ ending ;
END FUNCTION
NOOP
FUNCTION show
    PARAMETER password STRING ""
BEGIN
    VARIABLE ready BOOLEAN
    VARIABLE known BOOLEAN
    CALL CLS
    CALL unlock
        PARAMETER password password ;
        RESULT ready ready
    IF NOT ready ;
    BEGIN
        RETURN
    END IF
    CALL c0de/security/HAS_SECRET
        PARAMETER name NAME ;
        RESULT result known
    IF NOT known ;
    BEGIN
        CALL PRINT
            PARAMETER value "No key in your vault. Run store first." ;
        RETURN
    END IF
    CALL peek
END FUNCTION
```

## Mail from the farm

`site/tutorials/libraries/c0de_net/mail/farm-mail.md`

### [x] farm-mail-laptop

the laptop next to the trigger block of farmmail with "Report sent" on its screen, the variable items server and port in the input inventory of the trigger block

- Program **farmmail**, function `report` (`site/tutorials/programs/libraries/mail/farm-mail-report.c0de`)
- Sheet 96, x = 3072

```c0de
PROGRAM farmmail
NOOP
INCLUDE c0de/strings
INCLUDE c0de_net/mail
NOOP
FUNCTION report
    PARAMETER server STRING "smtp.example.com"
    PARAMETER port INTEGER 0
    PARAMETER wheat INTEGER 64
    PARAMETER carrots INTEGER 12
    RESULT id STRING
BEGIN
    SECRET mailPassword STRING
    VARIABLE smtp STRUCT c0de_net/mail/SMTP_SERVER
    VARIABLE helpers ARRAY STRING
    BEGIN
        "alex@example.com"
    END VARIABLE
    VARIABLE text STRING
    VARIABLE nl CHAR
    ASSIGN smtp.server server ;
    ASSIGN smtp.port port ;
    ASSIGN smtp.security "tls" ;
    ASSIGN smtp.user "steve@example.com" ;
    ASSIGN smtp.password mailPassword ;
    ASSIGN smtp.from "Farm computer <steve@example.com>" ;
    CALL c0de/strings/CHR
        PARAMETER code 10 ;
        RESULT result nl
    ASSIGN text "Good morning!" ⊕ nl ⊕ nl ⊕ "In the barn today:" ⊕ nl ;
    ASSIGN text text ⊕ wheat ⊕ " wheat" ⊕ nl ⊕ carrots ⊕ " carrots" ⊕ nl ;
    ASSIGN text text ⊕ nl ⊕ "Your farm" ;
    CALL c0de_net/mail/SMTP_SEND
        PARAMETER server smtp ;
        PARAMETER to "steve@example.com" ;
        PARAMETER cc helpers ;
        PARAMETER subject "The farm today" ;
        PARAMETER text text ;
        PARAMETER reply_to "steve@example.com" ;
        RESULT result id
    CALL PRINT
        PARAMETER value "Report sent" ;
END FUNCTION
```

## The order desk

`site/tutorials/libraries/c0de_net/mail/order-desk.md`

### [x] order-desk-laptop

the laptop showing "3 of 6 messages unseen" and the two lines "New: Order: 32 wheat" and "New: Order: 12 carrots", the two trigger blocks of orders and deliver next to it

- Program **orderdesk**, function `orders` (`site/tutorials/programs/libraries/mail/order-desk-orders.c0de`)
- Sheet 98, x = 3136

```c0de
PROGRAM orderdesk
NOOP
INCLUDE c0de_net/mail
NOOP
FUNCTION orders
    PARAMETER server STRING "imap.example.com"
    PARAMETER port INTEGER 0
    RESULT count INTEGER
BEGIN
    SECRET mailPassword STRING
    VARIABLE imap STRUCT c0de_net/mail/IMAP_SERVER
    VARIABLE box STRUCT c0de_net/mail/MAILBOX
    VARIABLE uids ARRAY INTEGER
    VARIABLE letters ARRAY STRUCT c0de_net/mail/MAIL
    ASSIGN imap.server server ;
    ASSIGN imap.port port ;
    ASSIGN imap.user "steve@example.com" ;
    ASSIGN imap.password mailPassword ;
    CALL CLS
    CALL c0de_net/mail/IMAP_SELECT
        PARAMETER server imap ;
        RESULT result box
    CALL PRINT
        PARAMETER value box.unseen ⊕ " of " ⊕ box.messages ⊕ " messages unseen" ;
    CALL c0de_net/mail/IMAP_SEARCH
        PARAMETER server imap ;
        PARAMETER criteria "UNSEEN SUBJECT Order:" ;
        RESULT result uids
    CALL c0de_net/mail/IMAP_FETCH
        PARAMETER server imap ;
        PARAMETER uids uids ;
        PARAMETER text FALSE ;
        RESULT result letters
    EACH letter letters
    BEGIN
        CALL PRINT
            PARAMETER value "New: " ⊕ letter.subject ;
    END EACH
    CALL c0de_net/mail/IMAP_STORE
        PARAMETER server imap ;
        PARAMETER uids uids ;
        PARAMETER flags "\\Flagged" ;
    CALL c0de_net/mail/IMAP_MOVE
        PARAMETER server imap ;
        PARAMETER uids uids ;
        PARAMETER folder "Orders" ;
    CALL LEN
        PARAMETER value uids ;
        RESULT result count
END FUNCTION
NOOP
FUNCTION deliver
    PARAMETER server STRING "imap.example.com"
    PARAMETER port INTEGER 0
BEGIN
    SECRET mailPassword STRING
    VARIABLE imap STRUCT c0de_net/mail/IMAP_SERVER
    VARIABLE box STRUCT c0de_net/mail/MAILBOX
    VARIABLE uids ARRAY INTEGER
    VARIABLE letters ARRAY STRUCT c0de_net/mail/MAIL
    VARIABLE count INTEGER
    ASSIGN imap.server server ;
    ASSIGN imap.port port ;
    ASSIGN imap.user "steve@example.com" ;
    ASSIGN imap.password mailPassword ;
    CALL CLS
    CALL c0de_net/mail/IMAP_SELECT
        PARAMETER server imap ;
        PARAMETER folder "Orders" ;
        RESULT result box
    CALL c0de_net/mail/IMAP_SEARCH
        PARAMETER server imap ;
        PARAMETER criteria "FLAGGED UNANSWERED" ;
        RESULT result uids
    CALL LEN
        PARAMETER value uids ;
        RESULT result count
    IF count = 0 ;
    BEGIN
        CALL PRINT
            PARAMETER value "No open orders" ;
        EXIT 0 ;
    END IF
    CALL c0de_net/mail/IMAP_FETCH
        PARAMETER server imap ;
        PARAMETER uids uids[0] ;
        RESULT result letters
    CALL PRINT
        PARAMETER value letters[0].from ;
    CALL PRINT
        PARAMETER value letters[0].subject ;
    CALL PRINT
        PARAMETER value letters[0].text ;
    CALL c0de_net/mail/IMAP_STORE
        PARAMETER server imap ;
        PARAMETER uids uids[0] ;
        PARAMETER flags "\\Answered" ;
    CALL c0de_net/mail/IMAP_STORE
        PARAMETER server imap ;
        PARAMETER uids uids[0] ;
        PARAMETER flags "\\Flagged" ;
        PARAMETER mode "remove" ;
END FUNCTION
```

## Tidying the mailbox

`site/tutorials/libraries/c0de_net/mail/tidy-mailbox.md`

### [x] tidy-mailbox-laptop

the laptop after the clean-up with the four lines "Archive is now Archive 2025", "Deleted Archive 2024", "Removed 1 old news" and "INBOX: 5 messages, 3 unseen"

- Program **tidymail**, function `cleanup` (`site/tutorials/programs/libraries/mail/tidy-mailbox-cleanup.c0de`)
- Sheet 100, x = 3200

```c0de
PROGRAM tidymail
NOOP
INCLUDE c0de_net/mail
NOOP
FUNCTION cleanup
    PARAMETER server STRING "imap.example.com"
    PARAMETER port INTEGER 0
    PARAMETER year INTEGER 2026
    RESULT removed INTEGER
BEGIN
    SECRET mailPassword STRING
    VARIABLE imap STRUCT c0de_net/mail/IMAP_SERVER
    VARIABLE folders ARRAY STRING
    VARIABLE box STRUCT c0de_net/mail/MAILBOX
    VARIABLE uids ARRAY INTEGER
    VARIABLE oldest STRING
    VARIABLE last STRING
    ASSIGN imap.server server ;
    ASSIGN imap.port port ;
    ASSIGN imap.user "steve@example.com" ;
    ASSIGN imap.password mailPassword ;
    ASSIGN oldest "Archive " ⊕ ( year - 2 ) ;
    ASSIGN last "Archive " ⊕ ( year - 1 ) ;
    CALL CLS
    CALL c0de_net/mail/IMAP_LIST
        PARAMETER server imap ;
        PARAMETER pattern "Archive*" ;
        RESULT result folders
    EACH name folders
    BEGIN
        IF name = oldest ;
        BEGIN
            CALL c0de_net/mail/IMAP_DELETE
                PARAMETER server imap ;
                PARAMETER folder name ;
            CALL PRINT
                PARAMETER value "Deleted " ⊕ name ;
        END IF
        IF name = "Archive" ;
        BEGIN
            CALL c0de_net/mail/IMAP_RENAME
                PARAMETER server imap ;
                PARAMETER folder name ;
                PARAMETER new_name last ;
            CALL c0de_net/mail/IMAP_CREATE
                PARAMETER server imap ;
                PARAMETER folder "Archive" ;
            CALL PRINT
                PARAMETER value "Archive is now " ⊕ last ;
        END IF
    END EACH
    CALL c0de_net/mail/IMAP_SELECT
        PARAMETER server imap ;
        RESULT result box
    CALL c0de_net/mail/IMAP_SEARCH
        PARAMETER server imap ;
        PARAMETER criteria "SEEN SUBJECT \"Village news\"" ;
        RESULT result uids
    CALL c0de_net/mail/IMAP_STORE
        PARAMETER server imap ;
        PARAMETER uids uids ;
        PARAMETER flags "\\Deleted" ;
    CALL c0de_net/mail/IMAP_EXPUNGE
        PARAMETER server imap ;
        RESULT result removed
    CALL PRINT
        PARAMETER value "Removed " ⊕ removed ⊕ " old news" ;
    CALL c0de_net/mail/IMAP_STATUS
        PARAMETER server imap ;
        PARAMETER folder "INBOX" ;
        RESULT result box
    CALL PRINT
        PARAMETER value "INBOX: " ⊕ box.messages ⊕ " messages, " ⊕ box.unseen ⊕ " unseen" ;
END FUNCTION
```

## When mail fails

`site/tutorials/libraries/c0de_net/mail/mail-errors.md`

### [x] mail-errors-laptop

the laptop showing "Wrong user or password (an app password?)" next to the trigger block of mailcheck

- Program **mailcheck**, function `send` (`site/tutorials/programs/libraries/mail/mail-errors-send.c0de`)
- Sheet 102, x = 3264

```c0de
PROGRAM mailcheck
NOOP
INCLUDE c0de/security
INCLUDE c0de/strings
INCLUDE c0de_net/mail
NOOP
FUNCTION explain
    PARAMETER code INTEGER
    RESULT text STRING
BEGIN
    ASSIGN text "Unexpected error " ⊕ code ;
    IF code = INVALID_ARGUMENT ;
    BEGIN
        ASSIGN text "Check the server, the sender and the addresses" ;
    END IF
    IF code = PERMISSION_DENIED ;
    BEGIN
        ASSIGN text "Port 25 is blocked, use 465 or 587" ;
    END IF
    IF code = c0de_net/mail/CLIENT_UNAVAILABLE ;
    BEGIN
        ASSIGN text "Nobody with c0de net is online" ;
    END IF
    IF code = c0de_net/mail/MAIL_DISABLED ;
    BEGIN
        ASSIGN text "Mail is switched off" ;
    END IF
    IF code = c0de_net/mail/AUTHENTICATION_FAILED ;
    BEGIN
        ASSIGN text "Wrong user or password (an app password?)" ;
    END IF
    IF code = c0de_net/mail/MAIL_REJECTED ;
    BEGIN
        ASSIGN text "The mail server refused it" ;
    END IF
    IF code = c0de_net/mail/MAIL_LIMIT ;
    BEGIN
        ASSIGN text "Too much mail: send less or wait a minute" ;
    END IF
    IF code = c0de_net/mail/REQUEST_FAILED ;
    BEGIN
        ASSIGN text "The mail server can't be reached" ;
    END IF
    IF code = c0de_net/mail/REQUEST_TIMEOUT ;
    BEGIN
        ASSIGN text "The mail server is too slow" ;
    END IF
END FUNCTION
NOOP
FUNCTION account
    PARAMETER server STRING
    PARAMETER port INTEGER
    RESULT smtp STRUCT c0de_net/mail/SMTP_SERVER
BEGIN
    SECRET mailPassword STRING
    ASSIGN smtp.server server ;
    ASSIGN smtp.port port ;
    ASSIGN smtp.security "tls" ;
    ASSIGN smtp.user "steve@example.com" ;
    ASSIGN smtp.password mailPassword ;
    ASSIGN smtp.from "Farm computer <steve@example.com>" ;
    ASSIGN smtp.timeout 10 ;
END FUNCTION
NOOP
FUNCTION send
    PARAMETER server STRING "smtp.example.com"
    PARAMETER port INTEGER 0
    PARAMETER to STRING "steve@example.com"
    PARAMETER lines INTEGER 3
BEGIN
    VARIABLE known BOOLEAN
    VARIABLE smtp STRUCT c0de_net/mail/SMTP_SERVER
    VARIABLE problem ERROR
    VARIABLE text STRING
    VARIABLE message STRING
    VARIABLE nl CHAR
    CALL CLS
    CALL c0de/security/HAS_SECRET
        PARAMETER name "mailPassword" ;
        RESULT result known
    IF NOT known ;
    BEGIN
        CALL PRINT
            PARAMETER value "Put your password into the vault first" ;
        EXIT 2 ;
    END IF
    CALL account
        PARAMETER server server ;
        PARAMETER port port ;
        RESULT smtp smtp
    CALL c0de/strings/CHR
        PARAMETER code 10 ;
        RESULT result nl
    FOR i INTEGER 1 ; lines ;
    BEGIN
        ASSIGN text text ⊕ "Line " ⊕ i ⊕ ": the farm is fine." ⊕ nl ;
    END FOR
    CALL c0de_net/mail/SMTP_SEND problem
        PARAMETER server smtp ;
        PARAMETER to to ;
        PARAMETER subject "A test from the farm" ;
        PARAMETER text text ;
    IF problem.code ≠ 0 ;
    BEGIN
        CALL explain
            PARAMETER code problem.code ;
            RESULT text message
        CALL PRINT
            PARAMETER value message ;
        EXIT 1 ;
    END IF
    CALL PRINT
        PARAMETER value "Sent to " ⊕ to ;
END FUNCTION
```

## A first canvas

`site/tutorials/libraries/c0de_paint/cpaint/first-canvas.md`

### [ ] first-canvas-shed

the finished garden shed, 5 × 4 blocks and 4 high, oak planks with oak logs on all edges, its doorway in the west wall, the trigger block with its button 2 blocks west of it and the chest 2 blocks further west

- Program **shed**, function `build` (`site/tutorials/programs/libraries/paint/first-canvas-shed.c0de`)
- Sheet 104, x = 3328 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM shed
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION draw
    PARAMETER width INTEGER
    PARAMETER depth INTEGER
    PARAMETER height INTEGER
    RESULT result TYPE c0de_paint/cpaint/CANVAS
BEGIN
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE planks STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE log STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE walls TYPE c0de_paint/cpaint/STYLE
    VARIABLE posts TYPE c0de_paint/cpaint/STYLE
    VARIABLE air TYPE c0de_paint/cpaint/STYLE
    ASSIGN planks.id "oak_planks" ;
    ASSIGN log.id "oak_log" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block planks ;
        RESULT result walls
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block log ;
        RESULT result posts
    CALL c0de_paint/cpaint/STYLE_EMPTY
        RESULT result air
    ASSIGN b.x width - 1 ;
    ASSIGN b.y height - 1 ;
    ASSIGN b.z depth - 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas result ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER line_style posts ;
        PARAMETER side_style walls ;
    ASSIGN a.y 1 ;
    ASSIGN a.z 1 ;
    ASSIGN b.x 0 ;
    ASSIGN b.y 2 ;
    ASSIGN b.z 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas result ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER fill_style air ;
END FUNCTION
NOOP
FUNCTION build
    PARAMETER width INTEGER 5
    PARAMETER depth INTEGER 4
    PARAMETER height INTEGER 4
BEGIN
    VARIABLE shed TYPE c0de_paint/cpaint/CANVAS
    VARIABLE site STRUCT c0de/minecraft/POSITION
    VARIABLE chest STRUCT c0de/minecraft/POSITION
    CALL draw
        PARAMETER width width ;
        PARAMETER depth depth ;
        PARAMETER height height ;
        RESULT result shed
    ASSIGN site.x PID.x + 2 ;
    ASSIGN site.y PID.y ;
    ASSIGN site.z PID.z ;
    ASSIGN chest.x PID.x - 2 ;
    ASSIGN chest.y PID.y ;
    ASSIGN chest.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas shed ;
        PARAMETER position site ;
        PARAMETER input chest ;
END FUNCTION
NOOP
FUNCTION materials
    PARAMETER width INTEGER 5
    PARAMETER depth INTEGER 4
    PARAMETER height INTEGER 4
BEGIN
    VARIABLE shed TYPE c0de_paint/cpaint/CANVAS
    VARIABLE list HASH INTEGER
    VARIABLE voxels INTEGER
    CALL draw
        PARAMETER width width ;
        PARAMETER depth depth ;
        PARAMETER height height ;
        RESULT result shed
    CALL c0de_paint/cpaint/CANVAS_MATERIALS
        PARAMETER canvas shed ;
        RESULT result list
    CALL c0de_paint/cpaint/CANVAS_COUNT
        PARAMETER canvas shed ;
        RESULT result voxels
    CALL CLS
    CALL PRINT
        PARAMETER value "The shed needs:" ;
    EACH id list
    BEGIN
        CALL PRINT
            PARAMETER value list[id] ⊕ " " ⊕ id ;
    END EACH
    CALL PRINT
        PARAMETER value voxels ⊕ " voxels in all" ;
END FUNCTION
```

### [ ] first-canvas-list

the laptop screen with the list "The shed needs:", "36 minecraft:oak_log", "30 minecraft:oak_planks" and "68 voxels in all", the trigger block and the chest next to it

- Program **shed**, function `build` (`site/tutorials/programs/libraries/paint/first-canvas-shed.c0de`)
- Sheet 104, x = 3328 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM shed
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION draw
    PARAMETER width INTEGER
    PARAMETER depth INTEGER
    PARAMETER height INTEGER
    RESULT result TYPE c0de_paint/cpaint/CANVAS
BEGIN
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE planks STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE log STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE walls TYPE c0de_paint/cpaint/STYLE
    VARIABLE posts TYPE c0de_paint/cpaint/STYLE
    VARIABLE air TYPE c0de_paint/cpaint/STYLE
    ASSIGN planks.id "oak_planks" ;
    ASSIGN log.id "oak_log" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block planks ;
        RESULT result walls
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block log ;
        RESULT result posts
    CALL c0de_paint/cpaint/STYLE_EMPTY
        RESULT result air
    ASSIGN b.x width - 1 ;
    ASSIGN b.y height - 1 ;
    ASSIGN b.z depth - 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas result ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER line_style posts ;
        PARAMETER side_style walls ;
    ASSIGN a.y 1 ;
    ASSIGN a.z 1 ;
    ASSIGN b.x 0 ;
    ASSIGN b.y 2 ;
    ASSIGN b.z 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas result ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER fill_style air ;
END FUNCTION
NOOP
FUNCTION build
    PARAMETER width INTEGER 5
    PARAMETER depth INTEGER 4
    PARAMETER height INTEGER 4
BEGIN
    VARIABLE shed TYPE c0de_paint/cpaint/CANVAS
    VARIABLE site STRUCT c0de/minecraft/POSITION
    VARIABLE chest STRUCT c0de/minecraft/POSITION
    CALL draw
        PARAMETER width width ;
        PARAMETER depth depth ;
        PARAMETER height height ;
        RESULT result shed
    ASSIGN site.x PID.x + 2 ;
    ASSIGN site.y PID.y ;
    ASSIGN site.z PID.z ;
    ASSIGN chest.x PID.x - 2 ;
    ASSIGN chest.y PID.y ;
    ASSIGN chest.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas shed ;
        PARAMETER position site ;
        PARAMETER input chest ;
END FUNCTION
NOOP
FUNCTION materials
    PARAMETER width INTEGER 5
    PARAMETER depth INTEGER 4
    PARAMETER height INTEGER 4
BEGIN
    VARIABLE shed TYPE c0de_paint/cpaint/CANVAS
    VARIABLE list HASH INTEGER
    VARIABLE voxels INTEGER
    CALL draw
        PARAMETER width width ;
        PARAMETER depth depth ;
        PARAMETER height height ;
        RESULT result shed
    CALL c0de_paint/cpaint/CANVAS_MATERIALS
        PARAMETER canvas shed ;
        RESULT result list
    CALL c0de_paint/cpaint/CANVAS_COUNT
        PARAMETER canvas shed ;
        RESULT result voxels
    CALL CLS
    CALL PRINT
        PARAMETER value "The shed needs:" ;
    EACH id list
    BEGIN
        CALL PRINT
            PARAMETER value list[id] ⊕ " " ⊕ id ;
    END EACH
    CALL PRINT
        PARAMETER value voxels ⊕ " voxels in all" ;
END FUNCTION
```

## Shapes in any plane

`site/tutorials/libraries/c0de_paint/cpaint/shapes.md`

### [ ] shapes-window

the wall of stone bricks, 13 × 13 blocks, with the round window of light blue glass in its middle, framed by polished andesite and divided by a cross of dark oak planks, the trigger block with its button in front of its west end

- Program **roundwindow**, function `window` (`site/tutorials/programs/libraries/paint/shapes-window.c0de`)
- Sheet 106, x = 3392 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM roundwindow
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION solid
    PARAMETER id STRING
    RESULT result TYPE c0de_paint/cpaint/STYLE
BEGIN
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    ASSIGN block.id id ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result result
END FUNCTION
NOOP
FUNCTION window
    PARAMETER r INTEGER 4
BEGIN
    VARIABLE c TYPE c0de_paint/cpaint/CANVAS
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE m STRUCT c0de_paint/cpaint/POINT
    VARIABLE wall TYPE c0de_paint/cpaint/STYLE
    VARIABLE rim TYPE c0de_paint/cpaint/STYLE
    VARIABLE glass TYPE c0de_paint/cpaint/STYLE
    VARIABLE frame TYPE c0de_paint/cpaint/STYLE
    VARIABLE at STRUCT c0de/minecraft/POSITION
    CALL solid
        PARAMETER id "stone_bricks" ;
        RESULT result wall
    CALL solid
        PARAMETER id "polished_andesite" ;
        RESULT result rim
    CALL solid
        PARAMETER id "light_blue_stained_glass" ;
        RESULT result glass
    CALL solid
        PARAMETER id "dark_oak_planks" ;
        RESULT result frame
    // the wall: a rectangle standing upright
    ASSIGN b.x 2 * r + 4 ;
    ASSIGN m.y 2 * r + 4 ;
    CALL c0de_paint/cpaint/DRAW_RECTANGLE
        PARAMETER canvas c ;
        PARAMETER a a ;
        PARAMETER b b ;
        PARAMETER c m ;
        PARAMETER fill_style wall ;
    // the window: a circle in the same plane
    ASSIGN m.x r + 2 ;
    ASSIGN m.y r + 2 ;
    ASSIGN a.x 2 * r + 2 ;
    ASSIGN a.y r + 2 ;
    ASSIGN b.x r + 2 ;
    ASSIGN b.y 2 * r + 2 ;
    CALL c0de_paint/cpaint/DRAW_ELLIPSE
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER a a ;
        PARAMETER b b ;
        PARAMETER line_style rim ;
        PARAMETER fill_style glass ;
    // the cross of the window frame
    ASSIGN a.x 3 ;
    ASSIGN b.x 2 * r + 1 ;
    ASSIGN b.y r + 2 ;
    CALL c0de_paint/cpaint/DRAW_LINE
        PARAMETER canvas c ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER style frame ;
    ASSIGN a.x r + 2 ;
    ASSIGN a.y 3 ;
    ASSIGN b.x r + 2 ;
    ASSIGN b.y 2 * r + 1 ;
    CALL c0de_paint/cpaint/DRAW_LINE
        PARAMETER canvas c ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER style frame ;
    // build it 2 blocks east of the trigger block
    ASSIGN at.x PID.x + 2 ;
    ASSIGN at.y PID.y ;
    ASSIGN at.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas c ;
        PARAMETER position at ;
END FUNCTION
```

### [ ] shapes-star

the five-pointed star set into the grass, white concrete with a rim of gold blocks and a sea lantern in its middle, seen from above, the trigger block 2 blocks west of its western tip

- Program **floorstar**, function `star` (`site/tutorials/programs/libraries/paint/shapes-star.c0de`)
- Sheet 108, x = 3456 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM floorstar
NOOP
INCLUDE c0de/math
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION solid
    PARAMETER id STRING
    RESULT result TYPE c0de_paint/cpaint/STYLE
BEGIN
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    ASSIGN block.id id ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result result
END FUNCTION
NOOP
FUNCTION star
    PARAMETER r INTEGER 8
BEGIN
    VARIABLE c TYPE c0de_paint/cpaint/CANVAS
    VARIABLE p STRUCT c0de_paint/cpaint/POINT
    VARIABLE corners ARRAY STRUCT c0de_paint/cpaint/POINT
    VARIABLE gold TYPE c0de_paint/cpaint/STYLE
    VARIABLE white TYPE c0de_paint/cpaint/STYLE
    VARIABLE light TYPE c0de_paint/cpaint/STYLE
    VARIABLE at STRUCT c0de/minecraft/POSITION
    VARIABLE angle FLOAT
    VARIABLE radius FLOAT
    VARIABLE f FLOAT
    CALL solid
        PARAMETER id "gold_block" ;
        RESULT result gold
    CALL solid
        PARAMETER id "white_concrete" ;
        RESULT result white
    CALL solid
        PARAMETER id "sea_lantern" ;
        RESULT result light
    // 10 corners: tips and notches take turns
    FOR i INTEGER 0 ; 9 ;
    BEGIN
        ASSIGN radius r ;
        IF i \ 2 = 1 ;
        BEGIN
            ASSIGN radius r * 2 / 5 ;
        END IF
        ASSIGN angle ( i / 5 - 0.5 ) * c0de/math/PI ;
        CALL c0de/math/COS
            PARAMETER value angle ;
            RESULT result f
        CALL c0de/math/ROUND
            PARAMETER value radius * f ;
            RESULT result p.x
        CALL c0de/math/SIN
            PARAMETER value angle ;
            RESULT result f
        CALL c0de/math/ROUND
            PARAMETER value radius * f ;
            RESULT result p.z
        ASSIGN corners[i] p ;
    END FOR
    CALL c0de_paint/cpaint/DRAW_POLYGON
        PARAMETER canvas c ;
        PARAMETER points corners ;
        PARAMETER line_style gold ;
        PARAMETER fill_style white ;
    // a lamp in the middle
    ASSIGN p.x 0 ;
    ASSIGN p.z 0 ;
    CALL c0de_paint/cpaint/DRAW_BLOCK
        PARAMETER canvas c ;
        PARAMETER point p ;
        PARAMETER style light ;
    // into the floor, its middle r + 2 blocks east
    ASSIGN at.x PID.x + r + 2 ;
    ASSIGN at.y PID.y - 1 ;
    ASSIGN at.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas c ;
        PARAMETER position at ;
END FUNCTION
```

### [ ] shapes-staircase

the spiral staircase of oak planks with an edge of spruce planks, 12 blocks high, winding clockwise around its central column, a player on one of its upper steps

- Program **spiralstairs**, function `stairs` (`site/tutorials/programs/libraries/paint/shapes-staircase.c0de`)
- Sheet 110, x = 3520 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM spiralstairs
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION solid
    PARAMETER id STRING
    RESULT result TYPE c0de_paint/cpaint/STYLE
BEGIN
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    ASSIGN block.id id ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result result
END FUNCTION
NOOP
FUNCTION stairs
    PARAMETER r INTEGER 3
    PARAMETER h INTEGER 12
    PARAMETER elevation FLOAT 0.5
BEGIN
    VARIABLE c TYPE c0de_paint/cpaint/CANVAS
    VARIABLE m STRUCT c0de_paint/cpaint/POINT
    VARIABLE east STRUCT c0de_paint/cpaint/POINT
    VARIABLE south STRUCT c0de_paint/cpaint/POINT
    VARIABLE edge TYPE c0de_paint/cpaint/STYLE
    VARIABLE steps TYPE c0de_paint/cpaint/STYLE
    VARIABLE at STRUCT c0de/minecraft/POSITION
    CALL solid
        PARAMETER id "spruce_planks" ;
        RESULT result edge
    CALL solid
        PARAMETER id "oak_planks" ;
        RESULT result steps
    ASSIGN east.x r ;
    ASSIGN south.z r ;
    CALL c0de_paint/cpaint/DRAW_SPIRAL
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER a east ;
        PARAMETER b south ;
        PARAMETER direction "+y" ;
        PARAMETER elevation elevation ;
        PARAMETER h h ;
        PARAMETER line_style edge ;
        PARAMETER fill_style steps ;
    // the axis r + 2 blocks east of the trigger block
    ASSIGN at.x PID.x + r + 2 ;
    ASSIGN at.y PID.y ;
    ASSIGN at.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas c ;
        PARAMETER position at ;
END FUNCTION
```

## Styles

`site/tutorials/libraries/c0de_paint/cpaint/styles.md`

### [ ] styles-wall

the city wall of stone bricks with mossy and cracked bricks in random places and the gate in its middle, seen from the trigger block, with the wool sunset in its frame of logs rising behind the wall

- Program **stonewall**, function `build` (`site/tutorials/programs/libraries/paint/styles-wall.c0de`)
- Sheet 112, x = 3584 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM stonewall
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION build
    PARAMETER half INTEGER 6
    PARAMETER height INTEGER 5
BEGIN
    VARIABLE c TYPE c0de_paint/cpaint/CANVAS
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE stone STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE stones ARRAY STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE mixed TYPE c0de_paint/cpaint/STYLE
    VARIABLE air TYPE c0de_paint/cpaint/STYLE
    VARIABLE site STRUCT c0de/minecraft/POSITION
    ASSIGN stone.id "stone_bricks" ;
    ASSIGN stone.weight 6 ;
    ASSIGN stones[0] stone ;
    ASSIGN stone.id "mossy_stone_bricks" ;
    ASSIGN stone.weight 3 ;
    ASSIGN stones[1] stone ;
    ASSIGN stone.id "cracked_stone_bricks" ;
    ASSIGN stone.weight 1 ;
    ASSIGN stones[2] stone ;
    CALL c0de_paint/cpaint/STYLE_RANDOM
        PARAMETER blocks stones ;
        RESULT result mixed
    CALL c0de_paint/cpaint/STYLE_EMPTY
        RESULT result air
    ASSIGN a.x - half ;
    ASSIGN b.x half ;
    ASSIGN b.y height - 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas c ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER fill_style mixed ;
    ASSIGN a.x -1 ;
    ASSIGN b.x 1 ;
    ASSIGN b.y 2 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas c ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER fill_style air ;
    ASSIGN site.x PID.x ;
    ASSIGN site.y PID.y ;
    ASSIGN site.z PID.z - 3 ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas c ;
        PARAMETER position site ;
END FUNCTION
```

### [ ] styles-floor

the chequered floor of black and white concrete, 8 × 8 blocks, with its border of dark oak planks, set into the grass east of the trigger block, seen from above

- Program **floor**, function `lay` (`site/tutorials/programs/libraries/paint/styles-floor.c0de`)
- Sheet 114, x = 3648 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM floor
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION lay
    PARAMETER width INTEGER 8
    PARAMETER depth INTEGER 8
    PARAMETER border BOOLEAN TRUE
BEGIN
    VARIABLE tile TYPE c0de_paint/cpaint/CANVAS
    VARIABLE c TYPE c0de_paint/cpaint/CANVAS
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE black TYPE c0de_paint/cpaint/STYLE
    VARIABLE white TYPE c0de_paint/cpaint/STYLE
    VARIABLE checks TYPE c0de_paint/cpaint/STYLE
    VARIABLE edge TYPE c0de_paint/cpaint/STYLE
    VARIABLE site STRUCT c0de/minecraft/POSITION
    ASSIGN block.id "black_concrete" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result black
    ASSIGN block.id "white_concrete" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result white
    ASSIGN b.x 1 ;
    ASSIGN b.z 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas tile ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER fill_style black ;
    CALL c0de_paint/cpaint/DRAW_BLOCK
        PARAMETER canvas tile ;
        PARAMETER point a ;
        PARAMETER style white ;
    CALL c0de_paint/cpaint/DRAW_BLOCK
        PARAMETER canvas tile ;
        PARAMETER point b ;
        PARAMETER style white ;
    CALL c0de_paint/cpaint/STYLE_PATTERN
        PARAMETER pattern tile ;
        RESULT result checks
    NOOP
    IF border ;
    BEGIN
        ASSIGN block.id "dark_oak_planks" ;
        CALL c0de_paint/cpaint/STYLE_SOLID
            PARAMETER block block ;
            RESULT result edge
    END
    ELSE
    BEGIN
        CALL c0de_paint/cpaint/STYLE_NONE
            RESULT result edge
    END IF
    ASSIGN b.x width - 1 ;
    ASSIGN b.z depth - 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas c ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER line_style edge ;
        PARAMETER fill_style checks ;
    ASSIGN site.x PID.x + 2 ;
    ASSIGN site.y PID.y - 1 ;
    ASSIGN site.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas c ;
        PARAMETER position site ;
END FUNCTION
```

### [ ] styles-palette

the open chest with sandstone, smooth sandstone and terracotta in its first three slots, and the striped wall 16 blocks long beside it, sandstone fading to smooth sandstone and terracotta from west to east

- Program **palette**, function `show` (`site/tutorials/programs/libraries/paint/styles-palette.c0de`)
- Sheet 116, x = 3712 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM palette
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION show
    PARAMETER palette ARRAY STRUCT c0de_paint/cpaint/BLOCK
    PARAMETER length INTEGER 16
    PARAMETER height INTEGER 4
BEGIN
    VARIABLE c TYPE c0de_paint/cpaint/CANVAS
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE stripes TYPE c0de_paint/cpaint/STYLE
    VARIABLE site STRUCT c0de/minecraft/POSITION
    CALL c0de_paint/cpaint/STYLE_GRADIENT
        PARAMETER blocks palette ;
        PARAMETER from a ;
        PARAMETER axes "x" ;
        PARAMETER fuzzy 1 ;
        RESULT result stripes
    ASSIGN b.x length - 1 ;
    ASSIGN b.y height - 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas c ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER fill_style stripes ;
    ASSIGN site.x PID.x + 2 ;
    ASSIGN site.y PID.y ;
    ASSIGN site.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas c ;
        PARAMETER position site ;
END FUNCTION
NOOP
FUNCTION build
    PARAMETER length INTEGER 16
    PARAMETER height INTEGER 4
BEGIN
    VARIABLE chest STRUCT c0de/minecraft/POSITION
    VARIABLE blocks ARRAY STRUCT c0de_paint/cpaint/BLOCK
    ASSIGN chest.x PID.x - 2 ;
    ASSIGN chest.y PID.y ;
    ASSIGN chest.z PID.z ;
    CALL c0de_paint/cpaint/INVENTORY_BLOCKS
        PARAMETER position chest ;
        RESULT result blocks
    CALL show
        PARAMETER palette blocks ;
        PARAMETER length length ;
        PARAMETER height height ;
END FUNCTION
```

## Bodies

`site/tutorials/libraries/c0de_paint/cpaint/bodies.md`

### [ ] bodies-lighthouse

the white lighthouse, 23 blocks high, with red rings at its foot and its top, the glass lantern room with the sea lantern shining inside and the copper dome on top, seen from the side at dusk, the trigger block in front of it

- Program **lighthouse**, function `build` (`site/tutorials/programs/libraries/paint/bodies-lighthouse.c0de`)
- Sheet 118, x = 3776 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM lighthouse
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION solid
    PARAMETER id STRING
    RESULT result TYPE c0de_paint/cpaint/STYLE
BEGIN
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    ASSIGN block.id id ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result result
END FUNCTION
NOOP
FUNCTION build
    PARAMETER r INTEGER 4
    PARAMETER h INTEGER 16
BEGIN
    VARIABLE c TYPE c0de_paint/cpaint/CANVAS
    VARIABLE m STRUCT c0de_paint/cpaint/POINT
    VARIABLE white TYPE c0de_paint/cpaint/STYLE
    VARIABLE red TYPE c0de_paint/cpaint/STYLE
    VARIABLE glass TYPE c0de_paint/cpaint/STYLE
    VARIABLE copper TYPE c0de_paint/cpaint/STYLE
    VARIABLE light TYPE c0de_paint/cpaint/STYLE
    VARIABLE air TYPE c0de_paint/cpaint/STYLE
    VARIABLE at STRUCT c0de/minecraft/POSITION
    CALL solid
        PARAMETER id "white_concrete" ;
        RESULT result white
    CALL solid
        PARAMETER id "red_concrete" ;
        RESULT result red
    CALL solid
        PARAMETER id "glass" ;
        RESULT result glass
    CALL solid
        PARAMETER id "copper_block" ;
        RESULT result copper
    CALL solid
        PARAMETER id "sea_lantern" ;
        RESULT result light
    CALL c0de_paint/cpaint/STYLE_EMPTY
        RESULT result air
    // the dome: half of it sinks into the lantern room
    ASSIGN m.y h + 3 ;
    CALL c0de_paint/cpaint/DRAW_ELLIPSOID
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER rx r - 1 ;
        PARAMETER ry r - 1 ;
        PARAMETER rz r - 1 ;
        PARAMETER side_style copper ;
    // the tower: white, with red rims, hollow
    ASSIGN m.y 0 ;
    CALL c0de_paint/cpaint/DRAW_CYLINDER
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER r r ;
        PARAMETER h h ;
        PARAMETER direction "+y" ;
        PARAMETER line_style red ;
        PARAMETER side_style white ;
        PARAMETER fill_style air ;
    // the lantern room on top, made of glass
    ASSIGN m.y h ;
    CALL c0de_paint/cpaint/DRAW_CYLINDER
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER r r - 1 ;
        PARAMETER h 4 ;
        PARAMETER direction "+y" ;
        PARAMETER side_style glass ;
        PARAMETER fill_style air ;
    // the light in its middle
    ASSIGN m.y h + 1 ;
    CALL c0de_paint/cpaint/DRAW_BLOCK
        PARAMETER canvas c ;
        PARAMETER point m ;
        PARAMETER style light ;
    // the axis r + 2 blocks east of the trigger block
    ASSIGN at.x PID.x + r + 2 ;
    ASSIGN at.y PID.y ;
    ASSIGN at.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas c ;
        PARAMETER position at ;
END FUNCTION
```

### [ ] bodies-sculptures

the row of five garden sculptures on the grass: the gold frame of the tetrahedron, the glass octahedron, the glass cube with quartz edges, the full moss dodecahedron and the icosahedron with quartz edges and glass faces

- Program **sculptures**, function `garden` (`site/tutorials/programs/libraries/paint/bodies-garden.c0de`)
- Sheet 120, x = 3840 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM sculptures
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION solid
    PARAMETER id STRING
    RESULT result TYPE c0de_paint/cpaint/STYLE
BEGIN
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    ASSIGN block.id id ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result result
END FUNCTION
NOOP
FUNCTION garden
    PARAMETER r INTEGER 4
BEGIN
    VARIABLE c TYPE c0de_paint/cpaint/CANVAS
    VARIABLE m STRUCT c0de_paint/cpaint/POINT
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE gold TYPE c0de_paint/cpaint/STYLE
    VARIABLE glass TYPE c0de_paint/cpaint/STYLE
    VARIABLE quartz TYPE c0de_paint/cpaint/STYLE
    VARIABLE moss TYPE c0de_paint/cpaint/STYLE
    VARIABLE at STRUCT c0de/minecraft/POSITION
    CALL solid
        PARAMETER id "gold_block" ;
        RESULT result gold
    CALL solid
        PARAMETER id "light_blue_stained_glass" ;
        RESULT result glass
    CALL solid
        PARAMETER id "quartz_block" ;
        RESULT result quartz
    CALL solid
        PARAMETER id "moss_block" ;
        RESULT result moss
    // all corners r away from the middle
    ASSIGN m.y r ;
    // only lines: a frame of gold
    CALL c0de_paint/cpaint/DRAW_TETRAHEDRON
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER r r ;
        PARAMETER line_style gold ;
    // only sides: a hollow shell of glass
    ASSIGN m.x 3 * r ;
    CALL c0de_paint/cpaint/DRAW_OCTAHEDRON
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER r r ;
        PARAMETER side_style glass ;
    // the cube is a box, with lines and sides
    ASSIGN a.x 5 * r + 1 ;
    ASSIGN a.z 1 - r ;
    ASSIGN b.x 7 * r - 1 ;
    ASSIGN b.y 2 * r - 2 ;
    ASSIGN b.z r - 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas c ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER line_style quartz ;
        PARAMETER side_style glass ;
    // only the inside: full of moss
    ASSIGN m.x 9 * r ;
    CALL c0de_paint/cpaint/DRAW_DODECAHEDRON
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER r r ;
        PARAMETER fill_style moss ;
    // lines and sides: quartz edges, glass faces
    ASSIGN m.x 12 * r ;
    CALL c0de_paint/cpaint/DRAW_ICOSAHEDRON
        PARAMETER canvas c ;
        PARAMETER center m ;
        PARAMETER r r ;
        PARAMETER line_style quartz ;
        PARAMETER side_style glass ;
    // a row from west to east, r + 2 blocks away
    ASSIGN at.x PID.x + r + 2 ;
    ASSIGN at.y PID.y ;
    ASSIGN at.z PID.z ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas c ;
        PARAMETER position at ;
END FUNCTION
```

## Shaping canvases

`site/tutorials/libraries/c0de_paint/cpaint/shaping-canvases.md`

### [ ] shaping-canvases-street

the whole street seen from above its west end: the trigger block in the middle of the road, south of it the oak house, the brick house, the two-block-high building site, the flat façade and the big hall with its gateway, across the road the mirrored oak house, and the turned house across the east end of the road; dirt paths in front of the doors

- Program **street**, function `build` (`site/tutorials/programs/libraries/paint/shaping-canvases-street.c0de`)
- Sheet 122, x = 3904 – not built yet: `/function c0de_screenshots:build_new`

```c0de
PROGRAM street
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION house
    PARAMETER width INTEGER
    PARAMETER depth INTEGER
    PARAMETER height INTEGER
    RESULT result TYPE c0de_paint/cpaint/CANVAS
BEGIN
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE c STRUCT c0de_paint/cpaint/POINT
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE planks TYPE c0de_paint/cpaint/STYLE
    VARIABLE south TYPE c0de_paint/cpaint/STYLE
    VARIABLE north TYPE c0de_paint/cpaint/STYLE
    VARIABLE lower TYPE c0de_paint/cpaint/STYLE
    VARIABLE upper TYPE c0de_paint/cpaint/STYLE
    ASSIGN block.id "oak_planks" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result planks
    ASSIGN block.id "oak_stairs" ;
    ASSIGN block.properties["facing"] "south" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result south
    ASSIGN block.properties["facing"] "north" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result north
    ASSIGN block.id "oak_door" ;
    ASSIGN block.properties["hinge"] "left" ;
    ASSIGN block.properties["half"] "lower" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result lower
    ASSIGN block.properties["half"] "upper" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result upper
    NOOP
    ASSIGN b.x width - 1 ;
    ASSIGN b.y height - 1 ;
    ASSIGN b.z depth - 1 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas result ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER side_style planks ;
    ASSIGN a.x 1 ;
    CALL c0de_paint/cpaint/DRAW_BLOCK
        PARAMETER canvas result ;
        PARAMETER point a ;
        PARAMETER style lower ;
    ASSIGN a.y 1 ;
    CALL c0de_paint/cpaint/DRAW_BLOCK
        PARAMETER canvas result ;
        PARAMETER point a ;
        PARAMETER style upper ;
    NOOP
    ASSIGN a.x 0 ;
    ASSIGN a.y height ;
    ASSIGN b.y height ;
    WHILE a.z ≤ b.z ;
    BEGIN
        CALL c0de_paint/cpaint/DRAW_BOX
            PARAMETER canvas result ;
            PARAMETER from a ;
            PARAMETER to b ;
            PARAMETER fill_style planks ;
        IF a.z < b.z ;
        BEGIN
            ASSIGN c a ;
            ASSIGN c.x b.x ;
            CALL c0de_paint/cpaint/DRAW_LINE
                PARAMETER canvas result ;
                PARAMETER from a ;
                PARAMETER to c ;
                PARAMETER style south ;
            ASSIGN c b ;
            ASSIGN c.x 0 ;
            CALL c0de_paint/cpaint/DRAW_LINE
                PARAMETER canvas result ;
                PARAMETER from c ;
                PARAMETER to b ;
                PARAMETER style north ;
        END IF
        ASSIGN a.y a.y + 1 ;
        ASSIGN b.y b.y + 1 ;
        ASSIGN a.z a.z + 1 ;
        ASSIGN b.z b.z - 1 ;
    END WHILE
END FUNCTION
NOOP
FUNCTION addHouse
    PARAMETER street TYPE c0de_paint/cpaint/CANVAS
    PARAMETER house TYPE c0de_paint/cpaint/CANVAS
    PARAMETER z INTEGER 0
    RESULT result TYPE c0de_paint/cpaint/CANVAS
BEGIN
    VARIABLE low STRUCT c0de_paint/cpaint/POINT
    VARIABLE high STRUCT c0de_paint/cpaint/POINT
    VARIABLE offset STRUCT c0de_paint/cpaint/POINT
    VARIABLE moved TYPE c0de_paint/cpaint/CANVAS
    CALL c0de_paint/cpaint/CANVAS_MAX
        PARAMETER canvas street ;
        RESULT result high
    CALL c0de_paint/cpaint/CANVAS_MIN
        PARAMETER canvas house ;
        RESULT result low
    ASSIGN offset.x high.x + 3 - low.x ;
    ASSIGN offset.y - low.y ;
    ASSIGN offset.z z - low.z ;
    ASSIGN moved house ;
    CALL c0de_paint/cpaint/CANVAS_MOVE
        PARAMETER canvas moved ;
        PARAMETER offset offset ;
    ASSIGN result street ;
    CALL c0de_paint/cpaint/CANVAS_MERGE
        PARAMETER target result ;
        PARAMETER source moved ;
END FUNCTION
NOOP
FUNCTION paths
    PARAMETER street TYPE c0de_paint/cpaint/CANVAS
    RESULT result TYPE c0de_paint/cpaint/CANVAS
BEGIN
    VARIABLE low STRUCT c0de_paint/cpaint/POINT
    VARIABLE high STRUCT c0de_paint/cpaint/POINT
    VARIABLE p STRUCT c0de_paint/cpaint/POINT
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE path TYPE c0de_paint/cpaint/STYLE
    VARIABLE facing STRING
    VARIABLE dx HASH INTEGER
    BEGIN
        east 1
        west -1
        north 0
        south 0
    END VARIABLE
    VARIABLE dz HASH INTEGER
    BEGIN
        east 0
        west 0
        north -1
        south 1
    END VARIABLE
    ASSIGN result street ;
    ASSIGN block.id "dirt_path" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result path
    CALL c0de_paint/cpaint/CANVAS_MIN
        PARAMETER canvas street ;
        RESULT result low
    CALL c0de_paint/cpaint/CANVAS_MAX
        PARAMETER canvas street ;
        RESULT result high
    FOR x INTEGER low.x ; high.x ;
    BEGIN
        FOR z INTEGER low.z ; high.z ;
        BEGIN
            ASSIGN p.x x ;
            ASSIGN p.y 0 ;
            ASSIGN p.z z ;
            CALL c0de_paint/cpaint/CANVAS_GET
                PARAMETER canvas street ;
                PARAMETER point p ;
                RESULT result block
            IF block.id = "minecraft:oak_door" ;
            BEGIN
                ASSIGN facing block.properties["facing"] ;
                ASSIGN p.x x + dx[facing] ;
                ASSIGN p.y -1 ;
                ASSIGN p.z z + dz[facing] ;
                CALL c0de_paint/cpaint/DRAW_BLOCK
                    PARAMETER canvas result ;
                    PARAMETER point p ;
                    PARAMETER style path ;
            END IF
        END FOR
    END FOR
END FUNCTION
NOOP
FUNCTION build
    PARAMETER width INTEGER 5
    PARAMETER depth INTEGER 5
    PARAMETER height INTEGER 4
BEGIN
    VARIABLE home TYPE c0de_paint/cpaint/CANVAS
    VARIABLE street TYPE c0de_paint/cpaint/CANVAS
    VARIABLE copy TYPE c0de_paint/cpaint/CANVAS
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE bricks TYPE c0de_paint/cpaint/STYLE
    VARIABLE air TYPE c0de_paint/cpaint/STYLE
    VARIABLE at STRUCT c0de/minecraft/POSITION
    CALL house
        PARAMETER width width ;
        PARAMETER depth depth ;
        PARAMETER height height ;
        RESULT result home
    ASSIGN street home ;
    NOOP
    ASSIGN block.id "bricks" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result bricks
    ASSIGN copy home ;
    CALL c0de_paint/cpaint/CANVAS_REPLACE
        PARAMETER canvas copy ;
        PARAMETER id "oak_planks" ;
        PARAMETER style bricks ;
    CALL addHouse
        PARAMETER street street ;
        PARAMETER house copy ;
        RESULT result street
    NOOP
    ASSIGN copy home ;
    ASSIGN a.y 2 ;
    CALL c0de_paint/cpaint/CANVAS_MAX
        PARAMETER canvas copy ;
        RESULT result b
    CALL c0de_paint/cpaint/CANVAS_CLEAR
        PARAMETER canvas copy ;
        PARAMETER from a ;
        PARAMETER to b ;
    CALL addHouse
        PARAMETER street street ;
        PARAMETER house copy ;
        RESULT result street
    NOOP
    ASSIGN copy home ;
    ASSIGN a.y 0 ;
    ASSIGN b.z 0 ;
    CALL c0de_paint/cpaint/CANVAS_CROP
        PARAMETER canvas copy ;
        PARAMETER from a ;
        PARAMETER to b ;
    CALL addHouse
        PARAMETER street street ;
        PARAMETER house copy ;
        RESULT result street
    NOOP
    ASSIGN copy home ;
    CALL c0de_paint/cpaint/CANVAS_SCALE
        PARAMETER canvas copy ;
        PARAMETER x 200 ;
        PARAMETER y 200 ;
        PARAMETER z 200 ;
    CALL c0de_paint/cpaint/STYLE_EMPTY
        RESULT result air
    CALL c0de_paint/cpaint/CANVAS_REPLACE
        PARAMETER canvas copy ;
        PARAMETER id "oak_door" ;
        PARAMETER style air ;
    CALL addHouse
        PARAMETER street street ;
        PARAMETER house copy ;
        RESULT result street
    NOOP
    ASSIGN copy home ;
    CALL c0de_paint/cpaint/CANVAS_ROTATE
        PARAMETER canvas copy ;
        PARAMETER center a ;
        PARAMETER axis "y" ;
        PARAMETER degrees 90 ;
    CALL addHouse
        PARAMETER street street ;
        PARAMETER house copy ;
        PARAMETER z - width ;
        RESULT result street
    NOOP
    ASSIGN copy home ;
    CALL c0de_paint/cpaint/CANVAS_MIRROR
        PARAMETER canvas copy ;
        PARAMETER axis "z" ;
        PARAMETER position -2.0 ;
    CALL c0de_paint/cpaint/CANVAS_MERGE
        PARAMETER target street ;
        PARAMETER source copy ;
    NOOP
    CALL paths
        PARAMETER street street ;
        RESULT result street
    ASSIGN at.x PID.x + 2 ;
    ASSIGN at.y PID.y ;
    ASSIGN at.z PID.z + 2 ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas street ;
        PARAMETER position at ;
END FUNCTION
```

## Copying a building

`site/tutorials/libraries/c0de_paint/cpaint/copying-buildings.md`

### [ ] copying-buildings-copy

a small house with a door and stairs on the left, its copy turned by 90° on the right, the trigger block in front of the original with the three chests around it, the south chest open with grass and dirt in it

- Program **copier**, function `copy` (`site/tutorials/programs/libraries/paint/copying-buildings-copier.c0de`)
- Sheet 124, x = 3968 – not built yet: `/function c0de_screenshots:build_new`
- Other sheets also have a program copier: run `/function c0de_screenshots:activate/copying-buildings-copier` first

```c0de
PROGRAM copier
NOOP
INCLUDE c0de/minecraft
INCLUDE c0de_paint/cpaint
NOOP
FUNCTION place
    PARAMETER building TYPE c0de_paint/cpaint/CANVAS
    PARAMETER turn INTEGER
    PARAMETER distance INTEGER
BEGIN
    VARIABLE turned TYPE c0de_paint/cpaint/CANVAS
    VARIABLE center STRUCT c0de_paint/cpaint/POINT
    VARIABLE low STRUCT c0de_paint/cpaint/POINT
    VARIABLE at STRUCT c0de/minecraft/POSITION
    VARIABLE blocks STRUCT c0de/minecraft/POSITION
    VARIABLE tools STRUCT c0de/minecraft/POSITION
    VARIABLE rubble STRUCT c0de/minecraft/POSITION
    ASSIGN turned building ;
    CALL c0de_paint/cpaint/CANVAS_ROTATE
        PARAMETER canvas turned ;
        PARAMETER center center ;
        PARAMETER axis "y" ;
        PARAMETER degrees turn ;
    CALL c0de_paint/cpaint/CANVAS_MIN
        PARAMETER canvas turned ;
        RESULT result low
    ASSIGN at.x PID.x + 2 + distance - low.x ;
    ASSIGN at.y PID.y - low.y ;
    ASSIGN at.z PID.z - low.z ;
    ASSIGN blocks.x PID.x ;
    ASSIGN blocks.y PID.y ;
    ASSIGN blocks.z PID.z - 2 ;
    ASSIGN tools blocks ;
    ASSIGN tools.x PID.x - 2 ;
    ASSIGN tools.z PID.z ;
    ASSIGN rubble blocks ;
    ASSIGN rubble.z PID.z + 2 ;
    CALL c0de_paint/cpaint/RENDER_CANVAS
        PARAMETER canvas turned ;
        PARAMETER position at ;
        PARAMETER input blocks ;
        PARAMETER tools tools ;
        PARAMETER output rubble ;
END FUNCTION
NOOP
FUNCTION copy
    PARAMETER width INTEGER 7
    PARAMETER height INTEGER 6
    PARAMETER depth INTEGER 7
    PARAMETER turn INTEGER 0
    PARAMETER distance INTEGER 12
BEGIN
    VARIABLE from STRUCT c0de/minecraft/POSITION
    VARIABLE to STRUCT c0de/minecraft/POSITION
    VARIABLE building TYPE c0de_paint/cpaint/CANVAS
    ASSIGN from.x PID.x + 2 ;
    ASSIGN from.y PID.y ;
    ASSIGN from.z PID.z ;
    ASSIGN to.x from.x + width - 1 ;
    ASSIGN to.y from.y + height - 1 ;
    ASSIGN to.z from.z + depth - 1 ;
    CALL c0de_paint/cpaint/CANVAS_FROM_WORLD
        PARAMETER from from ;
        PARAMETER to to ;
        PARAMETER air TRUE ;
        RESULT result building
    CALL place
        PARAMETER building building ;
        PARAMETER turn turn ;
        PARAMETER distance distance ;
END FUNCTION
NOOP
FUNCTION sample
    PARAMETER turn INTEGER 0
    PARAMETER distance INTEGER 12
BEGIN
    VARIABLE hut TYPE c0de_paint/cpaint/CANVAS
    VARIABLE a STRUCT c0de_paint/cpaint/POINT
    VARIABLE b STRUCT c0de_paint/cpaint/POINT
    VARIABLE block STRUCT c0de_paint/cpaint/BLOCK
    VARIABLE stone TYPE c0de_paint/cpaint/STYLE
    VARIABLE step TYPE c0de_paint/cpaint/STYLE
    VARIABLE air TYPE c0de_paint/cpaint/STYLE
    ASSIGN block.id "cobblestone" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result stone
    ASSIGN block.id "cobblestone_stairs" ;
    ASSIGN block.properties["facing"] "south" ;
    CALL c0de_paint/cpaint/STYLE_SOLID
        PARAMETER block block ;
        RESULT result step
    CALL c0de_paint/cpaint/STYLE_EMPTY
        RESULT result air
    ASSIGN b.x 2 ;
    ASSIGN b.y 3 ;
    ASSIGN b.z 3 ;
    CALL c0de_paint/cpaint/DRAW_BOX
        PARAMETER canvas hut ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER side_style stone ;
        PARAMETER fill_style air ;
    ASSIGN a.x 1 ;
    ASSIGN a.y 1 ;
    ASSIGN b.x 1 ;
    ASSIGN b.y 2 ;
    ASSIGN b.z 0 ;
    CALL c0de_paint/cpaint/DRAW_LINE
        PARAMETER canvas hut ;
        PARAMETER from a ;
        PARAMETER to b ;
        PARAMETER style air ;
    ASSIGN a.y 0 ;
    ASSIGN a.z -1 ;
    CALL c0de_paint/cpaint/DRAW_BLOCK
        PARAMETER canvas hut ;
        PARAMETER point a ;
        PARAMETER style step ;
    CALL place
        PARAMETER building hut ;
        PARAMETER turn turn ;
        PARAMETER distance distance ;
END FUNCTION
```
