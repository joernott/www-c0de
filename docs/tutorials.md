# Tutorials

This document plans the tutorials of c0de.at in detail. It builds on the section [Tutorials](concept.md#tutorials) of the concept, which defines three paths:

| Path | Readers | Goal |
|---|---|---|
| **Learning to program** (Beginner) | People who have never programmed | Learn the basic ideas of programming, one at a time, and how c0de expresses each of them. |
| **c0de for programmers** | People who already program in another language | Get an overview of the concepts and language elements of c0de, and of what is different from the languages they know. |
| **Libraries in practice** | Everyone who knows the language | Learn how to use the library functions, with practical examples from the game. |

The paths don't depend on each other: a beginner reads the first path and then the third, a programmer the second and then the third. Lessons link to the guide and the handbooks for details instead of repeating them; the tutorials explain *why* and *how to combine*, the handbooks list *what exists*.

The [decisions](#decisions) at the end answer the open questions of this plan (2026-11-11). The tasks are in the [implementation plan](implementation_plan.md), sprints 6 to 9.

## Common format

### A lesson

Every lesson is one page and has the same parts:

1. **What you'll learn**: two or three sentences, and for the beginner path the new words (program, variable, loop …).
2. **What you need**: the blocks, devices and items to craft or take from the creative inventory, and whether the lesson needs a world where you are an operator.
3. **The idea**: the concept, explained without c0de first in the beginner path, in comparison with other languages in the programmer path, and with the problem it solves in the library path.
4. **The program**: a complete program in a ` ```c0de ` block, written in the text notation of the guide ("Reading the examples"). Every program in a tutorial is complete and runs as it is; there are no fragments that can't be built. Each program is a file in `site/tutorials/programs/` (`<<< @/tutorials/programs/<path>/<name>.c0de`), which the page includes and the tests run: `<name>.options.yaml` beside it sets the function, the parameters and the input of the test, `<name>.expected.yaml` the results, screen output or error it must produce; further cases are `<name>.<case>.options.yaml` with `<name>.<case>.expected.yaml` (`npm run test-programs`, task 6.5). Beside the text, the reader can switch to a 3D model of the program as it lies on the sheet (from sprint 8 on).
5. **Building and running it**: how to set up the trigger block or the device, which variable items to put in, what to watch (the cursor, the screen, the world).
6. **How it works**: the program explained line by line (beginner path) or by its interesting parts (other paths).
7. **Try it yourself**: one to three exercises that change the program. Each has a solution, folded away (`<details>`, which needs no JavaScript).
8. **Read more**: links to the chapters of the guide and the handbooks that the lesson used.

The pages of the tutorials and the order of the lessons are listed in `site/tutorials/tutorials.yaml`; the overview page of a path shows its lessons (`<LessonList />`). The boxes are the containers of VitePress: `::: info What you need`, `::: warning Needs an operator`, `::: details Solution`.

Lessons of the beginner path are short (one new idea per lesson). Lessons of the programmer path cover more ground and are dense. Recipes of the library path start with what they build ("A clock on the wall") and list the library functions they use at the top.

### A running thread

The beginner path follows one story: the reader builds the **computer of their base**. It starts as a sign that greets visitors and grows, lesson by lesson, into a guarded door with a visitor counter, a notice board and a game. So every new idea solves a problem the reader can see in the game, and the last lessons combine the earlier ones.

### The world of the tutorials

The tutorials assume a **single-player world in creative mode with cheats on**, so the reader has every block at hand and is an operator. This is said explicitly on the overview page `/tutorials/` and in lesson 1.0 "Before you start". Lessons and recipes that need the operator (world-changing functions of c0de/minecraft, teleporting players) are marked; they also explain what the server's `config/c0de.properties` must allow on a multiplayer server, and show the alternative for everyone where there is one.

### Pictures

Example programs are shown as text and, from sprint 8 on, as 3D models: c0de exports every block as a glTF model with its release, the site builds a scene of the sheet from the text of the program and shows it with `<model-viewer>`, which the reader turns and zooms. Screenshots remain the fallback (no WebGL, no JavaScript, the poster while the model loads) and show what can't be built from a program: screens, the chat, the world around a program. Path 1 shows every program and its result; paths 2 and 3 only where the world matters.

### Programs in 3D

Every complete program of the site (a file of the tutorials, or a ` ```c0de ` block of any page that starts with `PROGRAM`) gets a switch "Text / 3D" above its code. Nothing has to be written for it:

- `npm run content` collects the programs and names each after a hash of its text (`.vitepress/programs.ts`). It downloads `c0de-models-<version>.zip` of the c0de tag in `sources.yaml`, lets the program runner print the layout of every program (`--layout`, cached in `site/.cache/layouts/`) and builds one GLB file per program (`scripts/import/scene.ts`): the floor of the sheet with the cursor rail, the line numbers in the colors of the game, and the blocks with the texts the game shows on them (names, values, languages of tags; task 9.0). The game's font can't be published, so the texts use the glyphs of GNU Unifont in `scripts/import/unifont/` (OFL 1.1). The scenes, with the texts of their blocks in a JSON file, and the textures go to `site/public/models/<version>/`.
- The Markdown renderer wraps every code block whose program has a scene in `ProgramView.vue`. The text comes first and is all there is without JavaScript or WebGL. The 3D view loads `<model-viewer>` (its own chunk of about 1 MB) only when the reader switches to it; the choice is kept in the browser for the next pages. Pointing at a block shows its text, pointing at a line number the line.
- The poster while the model loads is the screenshot with the name of the program file (`first-program-sign.c0de` → `first-program-sign.webp`), if it exists.
- A program that the runner can't lay out keeps its text only; `npm run content` names it.

### Screenshots

A lesson marks a screenshot with a comment on a line of its own, in both languages at the same place: `<!-- screenshot: <id> | <what it shows> -->`. As soon as `site/public/tutorials/screenshots/<id>.webp` exists, the page shows the image there, with its width and height and the description as alternative text; until then the mark is invisible. `npm run screenshots` writes the list of all marks with their pages and whether the file exists to `site/tutorials/screenshots.yaml`; the lint fails if the list is out of date.

The screenshots are taken in the game by hand, all the same way, so they can be taken again after visual changes of the mod:

- Minecraft 1.21.1 with the newest c0de and c0de net, Fabric, no other mods or resource packs (the default textures), in the tutorial world (creative, cheats on).
- Window 1920 × 1080, GUI scale 2, field of view 70, brightness "Moody", daylight.
- The HUD hidden with F1, unless the screenshot is of a dialog or the chat.
- Programs on their sheet: seen from the south, about 6 blocks behind and 4 blocks above the last line, looking down at the sheet, so all lines and the line numbers are in the picture.
- Devices (display walls, laptops) and dialogs: straight in front, the device or dialog filling most of the picture.
- Cropped to the interesting part at 16:9 or 4:3, scaled to 1280 pixels wide, saved as WebP with quality 85 (e.g. `cwebp -q 85 -resize 1280 0`).

### Languages

Every lesson is written in English and German in this repository (`site/tutorials/…` and `site/de/tutorials/…`). Names in programs (labels, texts in literals) stay English in both languages, so the programs are the same and are tested once; the comments (`//`) and the explanations are translated.

## Path 1: Learning to program

URL: `/tutorials/learning/…`. Readers have played Minecraft but never programmed. Every lesson introduces one idea, names it, and shows it in c0de.

| # | Lesson | Ideas of programming | c0de | The program (the base computer) | Exercises |
|---|---|---|---|---|---|
| 1.0 | Before you start | What a computer and a program are; that a program does exactly what it says | The c0de dimension, sheets, lines, the text notation of the examples | none: a tour of the dimension, crafting the first blocks | Find your sheet number |
| 1.1 | Your first program | A program is a list of instructions, carried out one after the other | PROGRAM, NOOP, FUNCTION, BEGIN/END, CALL PRINT, CLS; display block; the cursor | **Welcome sign**: a display block shows "Welcome to my base!" | Two lines of text; your own name |
| 1.2 | Colors and the screen | Instructions have details (parameters); order matters | COLOR, LOCATE, color constants | The sign in colors, with a frame line | A flag made of colored spaces |
| 1.3 | Remembering things: variables | A variable is a named box for a value; values have types | VARIABLE, CONSTANT, ASSIGN, `;`, INTEGER, STRING, `⊕` | The sign shows the name of the base from a constant and the year from a variable | Change the value, watch the sign change |
| 1.4 | Calculating | Expressions, operators, the order of operations; whole and decimal numbers | `+ - * / ^ \`, brackets, INTEGER and FLOAT | **Stack calculator**: how many stacks and single items are 1000 cobblestone? | Ender pearls (stacks of 16); a shulker box full of stacks |
| 1.5 | Giving and getting values | Input, processing, output; a function's parameters and results | PARAMETER, RESULT, the trigger block, variable items | The stack calculator gets the number as a variable item and returns two results | A default value for the stack size |
| 1.6 | Asking the player | Programs that wait for a person | Laptop, INPUT, PRINT of numbers | The stack calculator on a laptop: type a number, get the answer | Ask for the stack size too |
| 1.7 | Making decisions | Conditions, true and false, choosing between two ways | IF, ELSE, BOOLEAN, `= ≠ < > ≤ ≥`, AND, OR, NOT | **Door guard**: greets the owner of the sheet by name and tells everybody else that the base is closed (`PID.activator`, `SHEET.owner`) | Greet a list of friends too; a different text for the operator |
| 1.8 | Doing things again: counting loops | Repetition, a loop variable, counting up and down | FOR with step | **Countdown** on the display: 10 to 0, then "Lift-off!" | Count in steps of 5; a multiplication table |
| 1.9 | Loops with a condition | Repeating until something happens; endless loops and how to avoid them | WHILE, REPEAT, BREAK | **Halving**: how often can you halve a number until it is 1? A laptop asks until the answer is "yes" | Keep asking until the player types a number between 1 and 10 |
| 1.10 | Your own functions | Splitting a problem into parts, reusing them; parameters and results | FUNCTION, CALL with PARAMETER and RESULT, default values, RETURN | **Framed text**: a function that prints any text with a frame, used three times on the sign | A parameter for the frame character |
| 1.11 | Lists | Many values under one name; an index that starts at 0 | ARRAY, `[ ]`, EACH, LEN, INSERT, REMOVE | **Notice board**: a laptop adds notes to a list, the display shows them all | Delete a note by its number; show the number of notes |
| 1.12 | Tables and your own types | Looking up a value by a name; grouping values that belong together | HASH, HAS_KEY, STRUCT, `.` | **Shop price list**: the price of an item by its name; a struct for an offer (item, price, stock) | Add a discount; refuse unknown items |
| 1.13 | When things go wrong | Bugs, finding them, errors that happen while a program runs | Line colors, debugging tool, debug trigger block, ERROR, catching errors on CALL, RAISE | **Repairing a broken program**: a prepared program with three mistakes (red line, wrong result, division by zero) | Catch the error and print a friendly message |
| 1.14 | Using libraries | Not writing everything yourself; random numbers | INCLUDE, `c0de/math/RANDOM`, `c0de/minecraft/SAY`, `SOUND` | **Dice**: a button rolls a die, the result goes to the chat with a sound | Two dice; a different sound for a six |
| 1.15 | Project: guess the number | Planning a program, putting all ideas together | everything so far, `c0de/math/INT` | **Guess the number** on a laptop: random number, "higher" / "lower", count of tries, colored messages | High score of the session; a limit of 7 tries |
| 1.16 | Project: the guarded door | Programs that act in the world, repeated by a timer | Timer block, `c0de/minecraft` GET_PRESSURE_PLATE, FIND_ENTITIES, SET_OPEN, display | **Guarded door**: opens for the owner and friends, counts visitors, shows the count on the welcome sign | Close the door again after five seconds |
| 1.17 | Where to go next | What has been learned; how to read the handbooks | — | — | Links to path 3 and the guide examples |

## Path 2: c0de for programmers

URL: `/tutorials/programmers/…`. Readers know at least one language (Python, JavaScript, Java, C, BASIC). The lessons explain the model and the rules quickly, compare them with familiar languages and point out the traps. Every lesson ends with a short list "Differences you'll trip over".

| # | Lesson | Content | Programs |
|---|---|---|---|
| 2.1 | c0de in ten minutes | The model: code as blocks, one line per row on a sheet, indentation as nesting, the text notation; the layout rules of a program (PROGRAM, NOOP lines, INCLUDE, functions); a trigger block starts a process at an entry function; arguments and results are variable items | Hello world with a parameter and a result; the same as `def greet(name="World"): return …` side by side |
| 2.2 | Types and values | Static types; simple (BOOLEAN, INTEGER, FLOAT, CHAR, TIME) and complex (STRING with length limit, ARRAY T, HASH T, STRUCT, ERROR) types; literals; TIME in milliseconds; conversions (`⊕` to text, VAL, STR, TO_FLOAT, INT, FIX); the predefined constants SHEET, PID, CURSOR, colors and error codes | A function that returns one value of every type, inspected with variable items |
| 2.3 | Expressions and statements | The operators compared with C/Python (`=` only compares, `≠ ≤ ≥`, `\` remainder, `^` power, `⊕` join, bit operators `& \| ⊻ ¬ ← →`), precedence, the `;` that ends an expression; ASSIGN as the only assignment; functions can't be called inside an expression | Expression examples with their results; integer vs. float arithmetic |
| 2.4 | Control flow | IF/ELSE; FOR (end included, step, bounds computed once, loop variable read-only); EACH over arrays and hashes (keys in alphabetical order); WHILE and REPEAT (condition after `END REPEAT`); BREAK; RETURN; EXIT and exit codes | FizzBuzz; the primes example of the guide, revisited |
| 2.5 | Functions and libraries | Named parameters with defaults, several results, CALL with PARAMETER and RESULT lines (not positional); recursion and the stack of the cursor (`CURSOR.stack_used`); INCLUDE and the names of library functions, constants and structs (`c0de/math/PI`, `c0de/minecraft/POSITION`) | Fibonacci, recursive and iterative; a function with three results |
| 2.6 | Collections and structs | ARRAY and HASH operations (index, LEN, INSERT, REMOVE, CLEAR, SWAP, HAS_KEY), STRUCT declarations and nested elements, how values are passed and copied | Bubble sort; word count with a HASH; a struct for a 3D point |
| 2.7 | Errors | Errors instead of exceptions: they move up the calls until a CALL with an ERROR variable catches them; the elements code, message, context and line; own errors with codes from 1000, RAISE; a crash ends the process with an exit code, which a comparator reads | Input validation that raises an own error and a caller that handles it |
| 2.8 | Programs in the world | Processes, PIDs and the cursor; trigger, timer and debug trigger blocks; variable and constant items as the interface; chaining with hoppers; a sheet can't change while its program runs; owner, permissions (`config/c0de.properties`), protected programs, disks | A pipeline of two trigger blocks connected with a hopper |
| 2.9 | Screens, keyboards and I/O blocks | PRINT, CLS, LOCATE, CSRLIN, POS, COLOR on display walls, laptops and tablets; INPUT and INKEY; WRITE to I/O blocks; who reads what (INPUT takes items from an I/O block first) | A small menu on a laptop with INKEY |
| 2.10 | Data and the network | JSON and YAML with TO_JSON, FROM_JSON, TO_YAML, FROM_YAML and how they map to structs and hashes; c0de net: requests are sent by the client of the player who started the process, its settings and limits | Reading a JSON configuration into a struct; a GET request |
| 2.11 | Cheat sheet | One page: a table from Python, JavaScript and BASIC to c0de (declarations, loops, functions, errors, collections, strings), and the list of traps from all lessons | — |

## Path 3: Libraries in practice

URL: `/tutorials/libraries/<library>/…`, in the order of the main tabs. Every recipe builds something useful, uses several functions of one library (and some of others), and is linked from the handbook pages of the functions it uses ("Used in the tutorials"). The table [Coverage](#coverage) makes sure that every function of every library appears in at least one recipe.

Recipes marked **(op)** change the world with functions that need an operator or a permission in `config/c0de.properties`; they say so at the top and show the alternative for everyone (PLACE_BLOCK with `inventory`, MINE_BLOCK) where there is one.

### c0de/math

| # | Recipe | Functions | What it builds |
|---|---|---|---|
| 3.1 | Rolling dice | RANDOM, RANDOMIZE, INT, FIX | A die of any size on a display; with RANDOMIZE, the same "random" numbers on every run, for testing |
| 3.2 | Whole numbers and fractions | DIV, ROUND, TO_FLOAT, INT, FIX | Sharing the items of a chest fairly between players, with the rest; the average of a list; how ROUND, INT and FIX differ for negative numbers |
| 3.3 | Distance and direction | ABS, SGN, SQR | The distance from the trigger block to a player (Pythagoras), and a step towards them along each axis |
| 3.4 | Drawing a circle **(op)** | SIN, COS, ROUND, PI | A ring of blocks of any radius around the trigger block, with PLACE_BLOCK |
| 3.5 | Angles and ramps | TAN, ATN | The height of a ramp for a given angle, and the angle of an existing slope |
| 3.6 | Growth | EXP, LOG | How a farm grows when it doubles every day, and how many days until it reaches 1000; the number of digits of a number |

### c0de/strings

| # | Recipe | Functions | What it builds |
|---|---|---|---|
| 3.7 | A name board | UCASE, LCASE, LEFT, RIGHT, SPACE, FILL | Text centered and framed on a display wall; names cut to the width of the screen |
| 3.8 | Reading commands | INSTR, MID, REPLACE, VAL, STR | A laptop that understands commands like `say hello` or `sum 3 4` |
| 3.9 | Secret messages | ASC, CHR | A Caesar cipher: encode and decode a message on a laptop |
| 3.10 | Numbers as text | FORMAT, HEX, OCT, STR | A table of item counts with aligned columns; numbers in hexadecimal and octal; dates and decimals with FORMAT |
| 3.11 | Saving data as text | TO_JSON, FROM_JSON, TO_YAML, FROM_YAML | A high-score table that is kept as JSON in a variable item between runs; the same data as YAML to read it |

### c0de/time

| # | Recipe | Functions | What it builds |
|---|---|---|---|
| 3.12 | A clock on the wall | NOW, HOUR, MINUTE, SECOND, FORMAT | A digital clock on a display wall, updated by a timer block every second |
| 3.13 | A calendar | DAY, MONTH, YEAR, WEEK, WEEKDAY | Today's date with the weekday and week; the days until an event |
| 3.14 | Stopwatch and reaction test | TIMER, MILLISECOND, TIME arithmetic | A stopwatch started and stopped with buttons; a reaction test on a laptop with INKEY |
| 3.15 | Game time and real time | SLEEP, `c0de/minecraft/TICKS` | An animation on a display with SLEEP; day or night in the game from TICKS |

### c0de/minecraft

| # | Recipe | Functions | What it builds |
|---|---|---|---|
| 3.16 | Doorbell and music | BEEP, SOUND, SAY | A doorbell that rings and writes to the chat; a melody played from an array of notes and instruments |
| 3.17 | A combination lock | GET_LEVER, SET_LEVER, GET_BUTTON, PRESS_BUTTON | Four levers that open a door only in the right combination and reset themselves; a button pressed from a program |
| 3.18 | Automatic doors | GET_PRESSURE_PLATE, GET_OPEN, SET_OPEN | A door that opens on a pressure plate and closes after a delay; a report of all open doors |
| 3.19 | Watching the surroundings | GET_BLOCK, FIND_ENTITIES | A farm monitor that tells when the wheat is ripe; a counter of animals in a pen |
| 3.20 | Sorting the storage **(op)** | GET_INVENTORY, MOVE_ITEMS, DELETE_ITEMS | An item sorter that moves items from an input chest into chests by type, and a trash can |
| 3.21 | Building **(op)** | PLACE_BLOCK, REMOVE_BLOCK | A wall and a tower built from a chest (works for everyone), and pulled down again |
| 3.22 | A tunnel digger | MINE_BLOCK | A tunnel of any length, mined with the tools of a chest; the drops go into another chest |
| 3.23 | Rewards and teleporters **(op)** | SPAWN_ITEM, SPAWN_ENTITY, TELEPORT | A reward dispenser for the guessing game, an animal spawner and a teleporter hub |

### c0de_net/http

| # | Recipe | Functions | What it builds |
|---|---|---|---|
| 3.24 | Reading data from the web | HTTP_CONNECTION, HTTP_GET, FROM_JSON | The weather of a city on a display wall |
| 3.25 | Talking to a REST service | HTTP_POST, HTTP_PUT, HTTP_PATCH, HTTP_DELETE, TO_JSON | A shared to-do list: add, change, complete and delete entries on a server |
| 3.26 | Checking a service | HTTP_HEAD, HTTP_OPTIONS, HTTP_TRACE | A status lamp that shows if a web site is up, and what a server allows |
| 3.27 | When the network fails | the errors of c0de net, SLEEP | Retrying a request with a growing wait; friendly messages for every error code |
| 3.28 | Home automation | HTTP_PUT, constant items | A lever in the game switches a lamp at home; the token stays in a constant item |
| 3.29 | Is my c0de up to date? | HTTP_GET, FROM_JSON | Asks `c0de.at/api/version` for the latest released versions of c0de and c0de net and compares them with the installed ones (the constants C0DE_VERSION and C0DE_NET_VERSION, c0de task 14.9 and c0de net task 6.5) on a display |

The services of these recipes: the weather comes from a free public API without a key (Open-Meteo); echo, to-do list and version check are a small API of c0de.at itself (`/api/tutorial/echo`, `/api/tutorial/todo`, in memory and emptied daily, and `/api/version`, read from the GitHub releases). Recipe 3.28 uses a placeholder address, because every home automation is different. The requests come from the computer of the player who runs the program.

### Coverage

Every library function and the recipes that use it. A function that gets added to a library must get a recipe too; the build checks this list (task 9.7).

| Library | Function → recipe |
|---|---|
| c0de/math | ABS 3.3 · SGN 3.3 · SQR 3.3 · EXP 3.6 · LOG 3.6 · SIN 3.4 · COS 3.4 · TAN 3.5 · ATN 3.5 · INT 3.1, 3.2 · FIX 3.1, 3.2 · ROUND 3.2, 3.4 · TO_FLOAT 3.2 · DIV 3.2 · RANDOM 3.1 · RANDOMIZE 3.1 |
| c0de/strings | LEFT 3.7 · RIGHT 3.7 · MID 3.8 · REPLACE 3.8 · INSTR 3.8 · UCASE 3.7 · LCASE 3.7 · SPACE 3.7 · FILL 3.7 · ASC 3.9 · CHR 3.9 · STR 3.8, 3.10 · FORMAT 3.10, 3.12 · VAL 3.8 · HEX 3.10 · OCT 3.10 · TO_JSON 3.11, 3.25 · TO_YAML 3.11 · FROM_JSON 3.11, 3.24 · FROM_YAML 3.11 |
| c0de/time | NOW 3.12 · MILLISECOND 3.14 · SECOND 3.12 · MINUTE 3.12 · HOUR 3.12 · DAY 3.13 · MONTH 3.13 · YEAR 3.13 · WEEKDAY 3.13 · WEEK 3.13 · TIMER 3.14 · SLEEP 3.15, 3.27 |
| c0de/minecraft | TICKS 3.15 · BEEP 3.16 · SOUND 3.16 · SAY 3.16 · GET_BLOCK 3.19 · GET_INVENTORY 3.20 · GET_LEVER 3.17 · SET_LEVER 3.17 · GET_BUTTON 3.17 · PRESS_BUTTON 3.17 · GET_PRESSURE_PLATE 3.18 · GET_OPEN 3.18 · SET_OPEN 3.18 · MOVE_ITEMS 3.20 · DELETE_ITEMS 3.20 · PLACE_BLOCK 3.4, 3.21 · REMOVE_BLOCK 3.21 · MINE_BLOCK 3.22 · SPAWN_ITEM 3.23 · SPAWN_ENTITY 3.23 · FIND_ENTITIES 3.19 · TELEPORT 3.23 |
| c0de_net/http | HTTP_CONNECTION 3.24 · HTTP_GET 3.24, 3.29 · HTTP_HEAD 3.26 · HTTP_OPTIONS 3.26 · HTTP_TRACE 3.26 · HTTP_DELETE 3.25 · HTTP_PATCH 3.25 · HTTP_POST 3.25 · HTTP_PUT 3.25, 3.28 |

The built-in functions (LEN, HAS_KEY, REMOVE, INSERT, CLEAR, SWAP, RAISE, and the input and output functions) belong to the language and are taught in paths 1 and 2.

## Size

| Path | Pages | Programs (about) |
|---|---|---|
| Learning to program | 18 | 30 |
| c0de for programmers | 11 | 20 |
| Libraries in practice | 29 and one overview per library | 40 |

That is about 60 pages per language. They are written in this order:

1. Sprint 6: the pages and navigation of the tutorials, the tests of their programs, and path 2 (the shortest, and it makes the gaps of the guide visible).
2. Sprint 7: path 1, with screenshots.
3. Sprint 8: the 3D models of the programs, once c0de releases its block models.
4. Sprint 9: the API of c0de.at and path 3.

The mods prepare their part in a sprint "Documentation" each (c0de sprint 14, c0de net sprint 6): the program runner for the tests, the 3D models of the blocks, and the German translation of their documentation.

## Decisions

The open questions of this plan, answered on 2026-11-11 (also in the [Decisions](implementation_plan.md#decisions) of the implementation plan).

| # | Question | Decision |
|---|---|---|
| T1 | **Navigation.** Chapter tabs are one per page elsewhere, but 60 tabs under one main tab are too many. | As proposed: the main tab "Tutorials" leads to an overview of the three paths. Its chapter tabs are the three paths (and, for path 3, one per library). A path's first page lists its lessons; lessons are turned with the previous and next links at the bottom, and the tab of their path stays selected. |
| T2 | **Names of the paths** in English and German. | As proposed: "Learning to program" / "Programmieren lernen", "c0de for programmers" / "c0de für Programmierer", "Libraries in practice" / "Bibliotheken in der Praxis". |
| T3 | **Testing the programs against new versions of c0de.** The guide's examples come from the mod's test suite; the tutorials are in this repository. | As proposed: every program of a tutorial is a file in `site/tutorials/programs/` with its expected results, and the page includes it from there. c0de gets a program runner that its releases attach (c0de task 14.1), c0de net a library for it (c0de net task 6.1); the CI of this repository runs the programs with the runner of the tag in `sources.yaml`, so a Renovate update of the tag fails if a tutorial breaks. Both mods get a sprint "Documentation" for this, which also translates their documentation into German. |
| T4 | **Screenshots.** Beginners need to see blocks on the sheet and the devices; the text notation is abstract. | c0de exports every block as a 3D model (glTF) with its releases (c0de tasks 14.7, 14.8), and the site shows example programs as 3D models with `<model-viewer>` (sprint 8). Screenshots remain the fallback and show outputs: path 1 every program and its result, paths 2 and 3 where the world matters. They are taken in the game by hand, as WebP, and listed in a file so they can be retaken. |
| T5 | **Servers for c0de net.** The recipes 3.24–3.28 need real web services. The requests come from the player's computer. | As proposed: Open-Meteo for the weather, a small API of c0de.at for echo and to-do list, recipe 3.28 with a placeholder address. In addition, c0de.at answers the latest released versions of c0de and c0de net, read from their GitHub releases (`/api/version`, task 9.2), which recipe 3.29 uses. |
| T6 | **Worlds and permissions.** Several recipes need an operator. | As proposed, and said explicitly on the overview page and in lesson 1.0 (see [The world of the tutorials](#the-world-of-the-tutorials)). |
| T7 | **Gaps in the mod.** Some recipes need functions that may not exist (e.g. the name of an item in an inventory slot for 3.20, a lamp state for 3.26). | As proposed: each recipe is checked against the handbook when it is written; a missing function becomes a task in the mod's plan, and the recipe waits or changes. |
