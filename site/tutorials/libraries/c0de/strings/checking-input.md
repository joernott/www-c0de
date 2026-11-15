---
description: A laptop that checks what players type – the form of a name and of coordinates with REGEX_MATCH, cleaning and reformatting text with REGEX_REPLACE.
---

# Checking input

A sign-up desk on a laptop: it asks for a player name and the coordinates of a home. A name like `Al` or `Steve the Great` is sent back, and so are coordinates like `12 sixty -30`. Coordinates typed sloppily, like `12,  64 ,-30`, are tidied up, and at the end the desk writes `Welcome, Steve_42! Home: x=12 y=64 z=-30`.

**Functions:** [REGEX_MATCH](/c0de/strings/regex_match) and [REGEX_REPLACE](/c0de/strings/regex_replace)

::: info What you need
A trigger block with a button and a **laptop**. The program has no parameters and no results, so the trigger block needs no items.
:::

## The idea

Players type all kinds of things. Checking a text character by character with INSTR and MID takes many lines; a **regular expression** describes the form of a text in one: `^[A-Za-z0-9_]{3,16}$` means "3 to 16 letters, digits or underscores, and nothing else". REGEX_MATCH says whether a text has that form.

REGEX_REPLACE finds the parts of a text that match a pattern and replaces them, like the command `s` of sed. With the flag `g`, it replaces all of them: `[ ,]+` turns every row of spaces and commas into one space. Parentheses in the pattern make **groups**, and `\1`, `\2` and `\3` in the replacement put the text of a group back in – that's how `12 64 -30` becomes `x=12 y=64 z=-30`.

c0de uses the regular expressions of Java; the page of [REGEX_MATCH](/c0de/strings/regex_match) lists what they can do.

## The program

<<< @/tutorials/programs/libraries/strings/checking-input-signup.c0de

The text notation writes a backslash in a text as `\\` (see [literals](/c0de/guide/language#literals)). In the dialog of the LITERAL block, you type the replacement as `x=\1 y=\2 z=\3`.

## Building and running it

1. Place the laptop, right-click it, click the buttons until they show `checking` and `signup`, and click ✔.
2. Set the trigger block to the same program and function and press the button.
3. Open the laptop. Below the screen, the input line shows `INPUT name (STRING):`, later `INPUT home (STRING):`. Type the lines one by one and press Enter after each:

```
Al
Steve the Great
Steve_42
12 sixty -30
12,64
12,  64 ,-30
```

The screen shows each line you typed and the answer below it:

```
Your name:
Al
? 3 to 16 letters, digits or _
Your name:
Steve the Great
? 3 to 16 letters, digits or _
Your name:
Steve_42
Your home (x y z):
12 sixty -30
? three whole numbers, like 12 64 -30
Your home (x y z):
12,64
? three whole numbers, like 12 64 -30
Your home (x y z):
12,  64 ,-30
Welcome, Steve_42! Home: x=12 y=64 z=-30
```

<!-- screenshot: checking-input-laptop | the screen of the laptop after the run: the rejected names and coordinates with their ? answers, and the welcome line at the end -->

Spaces in front of or behind the coordinates don't matter either.

## How it works

- `askName` asks until the name has the right form. In `^[A-Za-z0-9_]{3,16}$`, the brackets are a character class: one character out of the ranges `A` to `Z`, `a` to `z`, `0` to `9`, or `_`. `{3,16}` repeats it 3 to 16 times. `^` and `$` tie the pattern to the start and the end of the text. Without them, a part of the text would be enough: `Steve the Great` contains `Steve`, which has the right form.
- `askHome` first cleans up what the player typed. The first REGEX_REPLACE turns every row of spaces and commas (`[ ,]+`, the `+` means "one or more") into a single space; the flag `g` does it for all matches, not only the first. The second one removes a space at the start or at the end: `|` means "or", and the replacement is the empty text.
- Then REGEX_MATCH checks the cleaned text: `-?` is an optional minus sign, `[0-9]+` one or more digits, and the spaces between them are just spaces. `12 sixty -30` and `12,64` don't have this form, and the REPEAT loop asks again.
- `signup` reformats the coordinates. Each `(-?[0-9]+)` is a group; in the replacement, `\1` is the text of the first group, `\2` of the second and `\3` of the third. The pattern matches only once, so no flag is needed. `&` would put in the whole match.
- `[0-9]` could also be written `\d`, and `[A-Za-z0-9_]` is the same as `\w` – in the text notation `\\d` and `\\w`. A pattern with a mistake, like a missing `]`, raises INVALID_ARGUMENT, and so does a pattern that would take too long.

## Try it yourself

1. Some names are reserved: refuse every name that contains `admin`, in any case – `SuperAdmin` and `admin_1` too.

::: details Solution
<<< @/tutorials/programs/libraries/strings/checking-input-admin.c0de

The second REGEX_MATCH has no `^` and `$`, so `admin` may be anywhere in the name. REGEX_MATCH has no flags; `(?i)` at the start of the pattern switches on ignoring the case. The loop repeats while the name has the wrong form or is reserved.
:::

2. Let players also type the coordinates the way the desk writes them: `X=12, Y = 64, Z=-30`.

::: details Solution
<<< @/tutorials/programs/libraries/strings/checking-input-xyz.c0de

A third REGEX_REPLACE comes first and removes every `x`, `y` or `z` with its `=`, and the spaces in between (`[xyz] *=`). The flag `g` removes all three, and `i` also finds `X`, `Y` and `Z`. What remains, `12, 64, -30`, is cleaned up as before.
:::

## Read more

- [c0de/strings](/c0de/strings/): [REGEX_MATCH](/c0de/strings/regex_match), [REGEX_REPLACE](/c0de/strings/regex_replace)
- [Reading commands](/tutorials/libraries/c0de/strings/commands): cutting a line into words with INSTR and MID
- [Literals](/c0de/guide/language#literals): how the text notation writes a backslash
- [WHILE and REPEAT](/c0de/guide/language#while-and-repeat)
- [INPUT](/c0de/reference/functions#input) and the [laptop](/c0de/reference/devices#laptop)
