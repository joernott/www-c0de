---
description: Ein Laptop, der prüft, was Spieler eintippen – die Form eines Namens und von Koordinaten mit REGEX_MATCH, Text aufräumen und umformen mit REGEX_REPLACE.
---

# Eingaben prüfen

Eine Anmeldung auf einem Laptop: Sie fragt nach einem Spielernamen und nach den Koordinaten eines Zuhauses. Ein Name wie `Al` oder `Steve the Great` wird zurückgewiesen, ebenso Koordinaten wie `12 sixty -30`. Schlampig getippte Koordinaten wie `12,  64 ,-30` werden aufgeräumt, und am Ende schreibt die Anmeldung `Welcome, Steve_42! Home: x=12 y=64 z=-30`.

**Funktionen:** [REGEX_MATCH](/de/c0de/strings/regex_match) und [REGEX_REPLACE](/de/c0de/strings/regex_replace)

::: info Was du brauchst
Einen Auslöserblock mit Knopf und einen **Laptop**. Das Programm hat keine Parameter und keine Ergebnisse, der Auslöserblock braucht also keine Karten.
:::

## Die Idee

Spieler tippen alles Mögliche ein. Einen Text Zeichen für Zeichen mit INSTR und MID zu prüfen, braucht viele Zeilen; ein **regulärer Ausdruck** beschreibt die Form eines Textes in einer: `^[A-Za-z0-9_]{3,16}$` heißt „3 bis 16 Buchstaben, Ziffern oder Unterstriche und sonst nichts“. REGEX_MATCH sagt, ob ein Text diese Form hat.

REGEX_REPLACE findet die Teile eines Textes, die zu einem Muster passen, und ersetzt sie, wie der Befehl `s` von sed. Mit dem Flag `g` ersetzt es alle: `[ ,]+` macht aus jeder Folge von Leerzeichen und Kommas ein Leerzeichen. Klammern im Muster bilden **Gruppen**, und `\1`, `\2` und `\3` in der Ersetzung setzen den Text einer Gruppe wieder ein – so wird aus `12 64 -30` der Text `x=12 y=64 z=-30`.

c0de verwendet die regulären Ausdrücke von Java; die Seite von [REGEX_MATCH](/de/c0de/strings/regex_match) zählt auf, was sie können.

## Das Programm

<<< @/tutorials/programs/libraries/strings/checking-input-signup.c0de

Die Textschreibweise schreibt einen Backslash in einem Text als `\\` (siehe [Literale](/de/c0de/guide/language#literale)). Im Dialog des LITERAL-Blocks tippst du die Ersetzung als `x=\1 y=\2 z=\3`.

## So baust und startest du es

1. Platziere den Laptop, klicke ihn mit rechts an, klicke die Knöpfe, bis sie `checking` und `signup` zeigen, und klicke auf ✔.
2. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein und drücke den Knopf.
3. Öffne den Laptop. Unter dem Bildschirm zeigt die Eingabezeile `INPUT name (STRING):`, später `INPUT home (STRING):`. Tippe die Zeilen nacheinander ein und drücke nach jeder Enter:

```
Al
Steve the Great
Steve_42
12 sixty -30
12,64
12,  64 ,-30
```

Der Bildschirm zeigt jede Zeile, die du getippt hast, und darunter die Antwort:

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

Auch Leerzeichen vor oder hinter den Koordinaten stören nicht.

## So funktioniert es

- `askName` fragt, bis der Name die richtige Form hat. In `^[A-Za-z0-9_]{3,16}$` sind die eckigen Klammern eine Zeichenklasse: ein Zeichen aus den Bereichen `A` bis `Z`, `a` bis `z`, `0` bis `9` oder `_`. `{3,16}` wiederholt sie 3- bis 16-mal. `^` und `$` binden das Muster an den Anfang und das Ende des Textes. Ohne sie würde ein Teil des Textes reichen: `Steve the Great` enthält `Steve`, und das hat die richtige Form.
- `askHome` räumt zuerst auf, was der Spieler getippt hat. Das erste REGEX_REPLACE macht aus jeder Folge von Leerzeichen und Kommas (`[ ,]+`, das `+` heißt „eins oder mehr“) ein einzelnes Leerzeichen; das Flag `g` tut das für alle Treffer, nicht nur für den ersten. Das zweite entfernt ein Leerzeichen am Anfang oder am Ende: `|` heißt „oder“, und die Ersetzung ist der leere Text.
- Dann prüft REGEX_MATCH den aufgeräumten Text: `-?` ist ein Minuszeichen, das fehlen darf, `[0-9]+` sind eine oder mehr Ziffern, und die Leerzeichen dazwischen sind einfach Leerzeichen. `12 sixty -30` und `12,64` haben diese Form nicht, und die REPEAT-Schleife fragt noch einmal.
- `signup` formt die Koordinaten um. Jedes `(-?[0-9]+)` ist eine Gruppe; in der Ersetzung ist `\1` der Text der ersten Gruppe, `\2` der der zweiten und `\3` der der dritten. Das Muster passt nur einmal, darum braucht es kein Flag. `&` würde den ganzen Treffer einsetzen.
- `[0-9]` kann man auch `\d` schreiben, und `[A-Za-z0-9_]` ist dasselbe wie `\w` – in der Textschreibweise `\\d` und `\\w`. Ein Muster mit einem Fehler, etwa einer fehlenden `]`, löst INVALID_ARGUMENT aus, ebenso ein Muster, das zu lange brauchen würde.

## Probier es selbst

1. Manche Namen sind reserviert: Weise jeden Namen zurück, der `admin` enthält, in jeder Schreibweise – auch `SuperAdmin` und `admin_1`.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/checking-input-admin.c0de

Das zweite REGEX_MATCH hat kein `^` und `$`, also darf `admin` irgendwo im Namen stehen. REGEX_MATCH hat keine Flags; `(?i)` am Anfang des Musters schaltet das Ignorieren von Groß- und Kleinschreibung ein. Die Schleife wiederholt sich, solange der Name die falsche Form hat oder reserviert ist.
:::

2. Lass Spieler die Koordinaten auch so tippen, wie die Anmeldung sie schreibt: `X=12, Y = 64, Z=-30`.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/checking-input-xyz.c0de

Ein drittes REGEX_REPLACE kommt zuerst und entfernt jedes `x`, `y` oder `z` mit seinem `=` und den Leerzeichen dazwischen (`[xyz] *=`). Das Flag `g` entfernt alle drei, und `i` findet auch `X`, `Y` und `Z`. Was übrig bleibt, `12, 64, -30`, wird wie vorher aufgeräumt.
:::

## Mehr dazu

- [c0de/strings](/de/c0de/strings/): [REGEX_MATCH](/de/c0de/strings/regex_match), [REGEX_REPLACE](/de/c0de/strings/regex_replace)
- [Befehle lesen](/de/tutorials/libraries/c0de/strings/commands): eine Zeile mit INSTR und MID in Wörter zerlegen
- [Literale](/de/c0de/guide/language#literale): wie die Textschreibweise einen Backslash schreibt
- [WHILE und REPEAT](/de/c0de/guide/language#while-und-repeat)
- [INPUT](/de/c0de/reference/functions#input) und der [Laptop](/de/c0de/reference/devices#laptop)
