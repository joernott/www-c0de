---
title: c0de – die Programmiersprache aus Blöcken
titleTemplate: false
description: c0de ist eine Programmiersprache aus Blöcken in Minecraft. Hier stehen die Anleitung, die Handbücher und die Dokumentation der Bibliotheken.
---

# c0de

**Programmieren in Minecraft, Block für Block.**

c0de ist eine kleine Programmiersprache in Minecraft. Programme werden nicht getippt, sondern gebaut: Jede Zeile ist eine Reihe bunter Blöcke auf einem Bogen Endlospapier, in einer eigenen Dimension. Auslöser-Blöcke irgendwo in der Welt starten die Programme. Ihre Ergebnisse können Türen öffnen, Gegenstände bewegen, Töne spielen oder einen Webserver nach dem Wetter fragen.

<img src="/images/screenshot.webp" alt="Ein c0de-Programm in der c0de-Dimension: Reihen bunter Blöcke auf grün-weiß gestreiftem Papier" width="1280" height="673" class="screenshot">

## Ein erstes Programm

In der Dokumentation werden Programme als Text geschrieben: Ein Wort ist ein Block, eine Zeile ist eine Reihe von Blöcken, und vier Leerzeichen bedeuten einen Block weiter östlich.

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

Die Funktion `greet` fügt drei Teile zu einem Text zusammen. Mit dem Namen „c0de“ aufgerufen, gibt sie „Hello, c0de!“ zurück. Die [Anleitung](/de/c0de/guide/getting-started) zeigt, wie man sie baut und startet.

## c0de herunterladen

<ModList />

Beide Mods laufen mit Minecraft 1.21.1, 1.21.11, 26.1.2, 26.2 und 26.3, mit Fabric oder NeoForge. Sie sind kostenlos und quelloffen (BSD-3-Clause-Lizenz).

## In diesem Ordner

Die Reiter am rechten Rand der Seite führen zu den Kapiteln: zur Sprache c0de mit Anleitung und Handbüchern und zu jeder Bibliothek mit einer Seite pro Funktion. Auf kleinen Bildschirmen stehen sie im Menü oben auf der Seite. Die Dokumentation beschreibt immer die neueste Version jeder Mod. Sie ist noch nicht ins Deutsche übersetzt.

<TabOverview />
