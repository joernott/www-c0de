---
title: c0de – the programming language made of blocks
titleTemplate: false
description: c0de is a programming language made of blocks in Minecraft. This site has its guide, its handbooks and the documentation of its libraries.
---

# c0de

**Programming in Minecraft, one block at a time.**

c0de is a small programming language inside Minecraft. You don't type programs, you build them: every line is a row of colorful blocks on a sheet of endless greenbar paper, in a dimension of its own. Trigger blocks anywhere in your world start the programs. Their results can open doors, move items, play sounds, or ask a web server for the weather.

<img src="/images/screenshot.webp" alt="A c0de program in the c0de dimension: rows of colored blocks on green and white striped paper" width="1280" height="673" class="screenshot">

## A first program

In the documentation, programs are written as text: one word is one block, one line is one row of blocks, and four spaces mean one block further east.

```c0de
PROGRAM greeting
NOOP
NOOP
FUNCTION greet
    PARAMETER name STRING "World"
    PARAMETER mark CHAR '!'
    RESULT result STRING
BEGIN
    ASSIGN result "Hello, " ⊕ name ⊕ mark ;
END FUNCTION
```

The function `greet` joins three parts into one text. Called with the name "c0de", it returns "Hello, c0de!". The [guide](/c0de/guide/getting-started) shows how to build and run it.

## Get c0de

<ModList />

Both mods run on Minecraft 1.21.1, 1.21.11, 26.1.2, 26.2 and 26.3, with Fabric or NeoForge. They are free and open source (BSD 3-Clause License).

## In this binder

The tabs at the right edge of the page lead to the chapters: the language c0de with its guide and handbooks, and every library with one page per function. On small screens, the menu at the top of the page has them. The documentation always describes the latest release of each mod.

<TabOverview />
