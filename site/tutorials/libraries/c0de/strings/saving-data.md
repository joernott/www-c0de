---
description: A high-score table that survives between runs – kept as JSON in a variable item with TO_JSON and FROM_JSON, shown as YAML with TO_YAML, and started from a typed YAML list with FROM_YAML.
---

# Saving data as text

A high-score table for your games: after every game, the player types their name and points on a laptop, and the table shows the best five. The table is kept between runs as a JSON text in a variable item named `scores`, and each run also gives you the table as YAML, which is easier to read.

**Functions:** [TO_JSON](/c0de/strings/to_json), [FROM_JSON](/c0de/strings/from_json), [TO_YAML](/c0de/strings/to_yaml), [FROM_YAML](/c0de/strings/from_yaml)

::: info What you need
A trigger block with a button, a **laptop**, an **I/O block** and a few uninitialized **variable items**: one for the trigger block and one for the I/O block for every game.
:::

## The idea

A variable lives only while its program runs. What must survive has to leave the process as an item. A text is the most useful form for it: you can read and change it in the dialog of the item, copy it into a book or send it to a web service, and a later version of the program can still read it after its struct got a new element – a key missing in the text simply keeps its default.

JSON turns any value into a text and back. TO_JSON writes the table as `[{"name":"Kai","points":150}]`, a STRING that fits into a variable item. At the next start, FROM_JSON reads that text back into an array of the same type. YAML does the same in a form that is easier for people to read and write; c0de has both, TO_YAML and FROM_YAML.

One more thing: the item must come out with the name `scores`, so that it can go straight back into the trigger block. A result can't have the same name as a parameter, but WRITE can give its item any name.

## The program

<<< @/tutorials/programs/libraries/strings/saving-data-highscores.c0de

## Building and running it

1. Place the laptop and the I/O block. Bind both to the program `highscores` and the function `add`: right-click, click the buttons until they show the program and the function, and click ✔.
2. Set the trigger block to the same program and function. Put an uninitialized variable item into the trigger block (for the result `yaml`) and one into the I/O block (for `scores`).
3. Press the button. The laptop asks `Name?`: type `Kai` and press Enter, then `150` for `Points?`. The screen shows `Kai 150`.
4. The output of the I/O block now holds the item `scores` with the text `[{"name":"Kai","points":150}]`, and the output of the trigger block the item `yaml`:

```yaml
- name: Kai
  points: 150
```

5. For the next game, put the `scores` item into the input of the trigger block, an uninitialized item each into the trigger block and the I/O block, and press the button again.

With five entries in the table – Alex 300, Steve 200, Kai 150, Zoe 90, Sam 40 – and a new score of Mia with 200, the laptop shows:

```
Name?
Mia
Points?
200
Alex 300
Steve 200
Mia 200
Kai 150
Zoe 90
```

Sam has dropped out.

<!-- screenshot: saving-data-io-block | the dialog of the I/O block after the run, with the variable item scores in its output -->

## How it works

- The parameter `scores` has the default `"[]"`, an empty JSON array. In the first game there is no item yet, and the table starts empty.
- FROM_JSON reads the text into `table`. The type of the variable decides how the document is read: an `ARRAY STRUCT entry` reads an array of objects with the keys `name` and `points`. `destination` is the variable itself, passed by reference, so FROM_JSON has no result.
- The two INPUTs fill `player` and `points`, and the struct `newcomer` gets both.
- The table is sorted from the best score down. EACH counts the entries with at least as many points as the newcomer; that is the place where INSERT puts the new entry. A tie goes behind the older entry, so Mia comes after Steve.
- With more than `PLACES` entries, REMOVE drops the last one, at index 5.
- TO_JSON writes the table into one line of JSON, in the order of the struct elements. WRITE puts it into the I/O block as a variable item named `scores`. Without an uninitialized item in a bound I/O block, the process waits on the WRITE line.
- TO_YAML writes the same table in block style, one key per line, for the result `yaml`.

## Try it yourself

1. Someone has edited the `scores` item and broken it: `[{"name":"Alex","points":"lots"}]`. Instead of crashing, the program should say so and start a new table.

::: details Solution
<<< @/tutorials/programs/libraries/strings/saving-data-safe.c0de

The error variable `problem` on the CALL line catches the error: `"lots"` is no INTEGER, so FROM_JSON raises TYPE_MISMATCH. On an error, FROM_JSON leaves `table` unchanged, so it is still the empty array. The laptop shows `? Unreadable scores, new table`, and the new `scores` item holds only the new entry.
:::

2. Start a table from a list you type by hand. YAML is easier to type than JSON, because it needs no quotes: write a program that reads a YAML list from a parameter `list` and puts it into the I/O block as the `scores` item.

::: details Solution
<<< @/tutorials/programs/libraries/strings/saving-data-yaml.c0de

Bind an I/O block to `highscoresyaml` and `load`, with an uninitialized variable item in it. Give the trigger block a variable item `list` of type STRING with this text – a YAML list in one line:

```yaml
[{name: Alex, points: 300}, {name: Steve, points: 200}]
```

FROM_YAML reads it into the same array type as in `highscores`, and TO_JSON writes it as JSON. The I/O block gets the item `scores` with `[{"name":"Alex","points":300},{"name":"Steve","points":200}]`, ready for the trigger block of `highscores`.
:::

## Read more

- [c0de/strings](/c0de/strings/): [TO_JSON](/c0de/strings/to_json), [FROM_JSON](/c0de/strings/from_json), [TO_YAML](/c0de/strings/to_yaml), [FROM_YAML](/c0de/strings/from_yaml)
- [JSON and YAML](/c0de/guide/libraries#json-and-yaml) in the guide, and [Data and the network](/tutorials/programmers/data) for tags and defaults
- [WRITE](/c0de/reference/functions#write) and the [I/O block](/c0de/reference/devices#io-block)
- [Variable items](/c0de/guide/running-programs#variable-items) and [Results](/c0de/guide/running-programs#results)
