---
description: Ein Laptop, der eingetippte Befehle wie „say hello“ und „sum 3 4“ versteht – eine Zeile mit INSTR und MID zerlegen, Zahlen aus Text mit VAL und STR und ein Wortfilter mit REPLACE.
---

# Befehle lesen

Ein Terminal auf einem Laptop, das Befehle versteht: `say hello` schreibt `hello`, `sum 3 4` schreibt `3 + 4 = 7`, und `quit` beendet es. Nebenbei versteckt `say` jeden `creeper` hinter Sternchen, und ein Befehl, den es nicht kennt, bekommt ein freundliches `?`.

**Funktionen:** [INSTR](/de/c0de/strings/instr), [MID](/de/c0de/strings/mid), [REPLACE](/de/c0de/strings/replace), [VAL](/de/c0de/strings/val), [STR](/de/c0de/strings/str) und [FIX](/de/c0de/math/fix) aus c0de/math

::: info Was du brauchst
Einen Auslöserblock mit Knopf und einen **Laptop**. Das Programm hat keine Parameter und keine Ergebnisse, der Auslöserblock braucht also keine Karten.
:::

## Die Idee

INPUT liest eine ganze Zeile in einen STRING. Um sie zu verstehen, zerlegt das Programm sie in Wörter: Das erste Wort ist der Befehl, der Rest sind seine Argumente. INSTR findet das erste Leerzeichen, und MID nimmt den Text davor und den Text dahinter.

Auch Zahlen kommen als Text an: `"3"` ist nicht 3. VAL liest eine Zahl aus einem Text und sagt, ob sie ganz ist; STR geht den umgekehrten Weg und macht aus einer Zahl wieder einen Text. Ein Text, der gar keine Zahl ist, lässt VAL einen Fehler auslösen, den das Programm abfängt, um mit einem `?` zu antworten, statt abzustürzen.

## Das Programm

<<< @/tutorials/programs/libraries/strings/commands-terminal.c0de

## So baust und startest du es

1. Platziere den Laptop, klicke ihn mit rechts an, klicke die Knöpfe, bis sie `commands` und `terminal` zeigen, und klicke auf ✔.
2. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein und drücke den Knopf.
3. Öffne den Laptop. Unter dem Bildschirm zeigt die Eingabezeile `INPUT line (STRING):`. Tippe die Befehle nacheinander ein und drücke nach jedem Enter:

```
say hello
say a creeper and another creeper
sum 3 4
sum 3 four
dance
quit
```

Der Bildschirm zeigt jede Zeile, die du getippt hast, und darunter die Antwort:

```
Commands: say <text>, sum <a> <b>, quit
say hello
hello
say a creeper and another creeper
a ******* and another *******
sum 3 4
3 + 4 = 7
sum 3 four
? sum needs two whole numbers
dance
? unknown command: dance
quit
Bye!
```

<!-- screenshot: commands-laptop | the terminal of the laptop after the run: the typed commands say, sum and dance with their answers, and Bye! at the end -->

`sum 2.5 1` und `sum 12` bekommen dasselbe `?` wie `sum 3 four`.

## So funktioniert es

- `split` ist das Herz des Programms. INSTR gibt die Position des ersten Leerzeichens zurück, oder -1, wenn es keins gibt – dann ist die ganze Zeile das Wort. Sonst liefert MID mit `start` 0 und `length space` das Wort, und MID mit `start space + 1` und ohne `length` den Rest der Zeile. Positionen beginnen bei 0, also ist die Position des Leerzeichens zugleich die Länge des Wortes davor.
- Die Hauptschleife ruft `split` einmal auf und vergleicht das Wort. Es gibt kein ELSE IF, darum fängt ein drittes IF alles ab, was weder `say` noch `sum` noch `quit` ist.
- `say` sucht mit INSTR nach `creeper`. REPLACE überschreibt die 7 Zeichen an dieser Position mit 7 Sternchen; es ändert nie die Länge eines Textes, die Positionen dahinter bleiben also gleich. Das nächste INSTR beginnt die Suche bei `found`, und wenn es -1 zurückgibt, endet die WHILE-Schleife.
- `sum` zerlegt seine Argumente wieder mit `split` in zwei Zahlen. VAL liefert einen FLOAT `value` und ein BOOLEAN `isInteger`. `"four"` ist keine Zahl: VAL löst INVALID_ARGUMENT aus, und die Fehlervariable `problem` in der CALL-Zeile fängt den Fehler ab. `sum 12` hat keine zweite Zahl, und VAL des leeren Textes scheitert genauso. `2.5` ist eine Zahl, aber `isInteger` ist falsch.
- VAL liefert immer einen FLOAT, darum macht FIX aus c0de/math die Summe zu einem INTEGER. STR macht daraus dann einen Text – denselben Text, den `⊕` machen würde, aber in einer eigenen Variablen, die du mit LEN messen, mit LEFT kürzen oder an jede Funktion übergeben kannst, die einen STRING will.

## Probier es selbst

1. Nimm Befehle in jeder Schreibweise an: Auch `SAY Hello` und `Sum 3 4` sollen funktionieren.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/commands-case.c0de

LCASE aus dem [Namensschild](/de/tutorials/libraries/c0de/strings/name-board) macht das Wort direkt nach `split` klein. Der Rest der Zeile behält seine Schreibweise, `SAY Hello` schreibt also `Hello`.
:::

2. Lass `sum` beliebig viele Zahlen addieren: `sum 1 2 3 4` schreibt `= 10`.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/commands-sum.c0de

Die Schleife trennt eine Zahl nach der anderen ab, bis `numbers` leer ist: `split` legt die erste Zahl in `number` und den Rest wieder in `numbers`. `sum 1 x 3` antwortet `? not a whole number: x`.
:::

## Mehr dazu

- [c0de/strings](/de/c0de/strings/): [INSTR](/de/c0de/strings/instr), [MID](/de/c0de/strings/mid), [REPLACE](/de/c0de/strings/replace), [VAL](/de/c0de/strings/val), [STR](/de/c0de/strings/str)
- [FIX](/de/c0de/math/fix) aus c0de/math
- [Fehler](/de/c0de/guide/language#fehler): einen Fehler mit einer ERROR-Variablen in der CALL-Zeile abfangen
- [INPUT](/de/c0de/reference/functions#input) und der [Laptop](/de/c0de/reference/devices#laptop)
