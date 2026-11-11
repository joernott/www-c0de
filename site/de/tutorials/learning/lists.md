---
description: Ein schwarzes Brett für die Basis – Notizen, die du am Laptop tippst, kommen in eine Liste, und die Anzeigewand zeigt sie alle.
---

# Listen

Oak Hill braucht ein schwarzes Brett: „Feed the cats“, „Get more torches“, „Plant wheat“. Du weißt nicht, wie viele Notizen es werden, also reicht eine Variable pro Notiz nicht. Heute bewahrst du alle Notizen in einer **Liste** auf. Du tippst sie am Laptop, und die Anzeigewand am Eingang zeigt die ganze Liste.

::: tip Neue Wörter

- **Liste** (in c0de: ARRAY): viele Werte desselben Typs unter einem Namen, einer nach dem anderen.
- **Element**: ein Wert in einer Liste.
- **Index**: die Nummer eines Elements in der Liste. Das erste Element hat den Index 0.
  :::

::: info Was du brauchst

- deine Anzeigewand aus 2 × 1 Anzeigeblöcken, den Laptop und einen Auslöserblock mit einem Knopf
- ein neues, leeres Blatt in der c0de-Dimension
- aus dem Kreativinventar: die Blöcke, die du kennst (mit REPEAT und BREAK), und den neuen **ARRAY**-Typblock und **EACH**-Block
  :::

## Die Idee

Denk an einen Einkaufszettel aus Papier. Er hat einen Namen, „Einkaufszettel“, aber viele Zeilen. Du kannst ihn von oben nach unten lesen, unten eine Zeile anfügen oder eine durchstreichen.

Eine **Liste** in einem Programm funktioniert genauso. Sie ist eine Variable, die viele Werte enthält, die **Elemente**, in einer festen Reihenfolge. Jedes Element hat eine Nummer, seinen **Index**. Computer beginnen bei 0 zu zählen, also ist das erste Element die Nummer 0, das zweite die Nummer 1 und so weiter. Eine Liste mit 3 Elementen hat die Indizes 0, 1 und 2.

In c0de heißt eine Liste **ARRAY**. Sie wächst von selbst, wenn du Elemente hinzufügst, und schrumpft, wenn du welche entfernst.

## Das Programm

Das Programm `notes` kommt auf ein neues Blatt. Der Laptop und die Anzeigewand gehören beide dazu.

<<< @/tutorials/programs/learning/lists-notes.c0de

<!-- screenshot: lists-notes-sheet | the program notes on its sheet, seen from above, with the VARIABLE notes ARRAY STRING block and its start value "Feed the cats" at the top and the EACH loop in the middle -->

## So baust du es

Die neuen Zeilen:

- Zeile 5: ein VARIABLE-Block bei x=6, ein LABEL `notes`, ein **ARRAY**-Typblock und ein STRING-Typblock: eine Liste von Texten.
- Zeilen 6 bis 8: die Startwerte der Liste: BEGIN bei x=6, ein LITERAL `"Feed the cats"` bei x=7 und ein END-Block bei x=6, gefolgt von einem VARIABLE-Block. Weitere LITERAL-Blöcke in Zeile 7 ergäben weitere Startnotizen.
- Zeile 14: ein **EACH**-Block bei x=7, ein LABEL `line` und ein LABEL `notes`.
- Zeilen 15 bis 18: BEGIN bei x=7, das CALL PRINT von `line` bei x=8 und x=9 und ein END-Block bei x=7, gefolgt von einem EACH-Block.
- Zeile 21: ein BREAK-Block bei x=7, ein LABEL `note`, ein OPERATOR `=`, ein LITERAL `"end"` und ein OPERATOR `;`.
- Zeilen 25 bis 29: ein CALL-Block bei x=7 mit einem LABEL `INSERT`, dann bei x=8 die PARAMETER-Zeilen `array` (LABEL `notes`), `index` (LABEL `count`) und `value` (LABEL `note`), jede mit ihrem `;`, und die RESULT-Zeile mit den LABELs `result` und `notes`.
- Zeile 30: ein END-Block bei x=6, ein REPEAT-Block, ein LITERAL `TRUE` und ein OPERATOR `;`.

## Starten

Binde die Anzeigewand und den Laptop an das Programm `notes` und die Funktion `board` und stelle den Auslöserblock genauso ein. Drück den Knopf. Die Wand zeigt die erste Notiz, „Feed the cats“.

Öffne den Laptop. Seine Eingabezeile zeigt `INPUT note (STRING):`. Tippe „Get more torches“ und drück Enter: Die Wand zeigt jetzt zwei Notizen. Tippe „Plant wheat“: drei.

```
Feed the cats
Get more torches
Plant wheat
```

<!-- screenshot: lists-notes-wall | the display wall at the entrance with three notes, "Feed the cats", "Get more torches" and "Plant wheat", and the laptop next to it with its terminal open -->

Tippe „end“, um das Programm zu beenden. Die Notizen bleiben auf der Wand, aber die Liste selbst ist weg: Eine Variable lebt nur, solange ihr Programm läuft. Der nächste Start beginnt wieder mit „Feed the cats“.

Die Wand hat 8 Zeilen. Bei mehr als 8 Notizen rollen die ersten oben hinaus.

## So funktioniert es

- `VARIABLE notes ARRAY STRING` macht eine Liste von Texten. Ihre Startwerte stehen im Codeblock darunter: hier eine Notiz, „Feed the cats“, mit dem Index 0.
- Die REPEAT-Schleife läuft für immer (`END REPEAT TRUE ;`). Ihr einziger Ausweg ist das BREAK.
- `CALL CLS` löscht die Bildschirme, dann gibt die **EACH**-Schleife die Liste aus. EACH geht vom Index 0 bis zum Ende durch die Liste. In jeder Runde enthält die Schleifenvariable `line` das nächste Element. Du musst nicht wissen, wie lang die Liste ist.
- `CALL INPUT` wartet auf die nächste Notiz vom Laptop. `BREAK note = "end" ;` verlässt die Schleife, wenn du „end“ tippst.
- `CALL LEN` zählt die Elemente der Liste. Bei einer Notiz ist `count` gleich 1.
- `CALL INSERT` setzt `note` beim Index `count` in die Liste ein. Bei einer Notiz ist das der Index 1, direkt nach dem letzten Element: Die neue Notiz kommt ans Ende. INSERT gibt die längere Liste als Ergebnis zurück, und `RESULT result notes` speichert sie wieder in `notes`.

Du kannst ein Element auch mit seinem Index lesen und ändern: `notes[0]` ist „Feed the cats“, und `ASSIGN notes[0] "Feed the dog" ;` ändert es. Der Index kann eine Zahl oder eine Variable sein, zum Beispiel `notes[i]`, aber keine Rechnung: `notes[i + 1]` funktioniert nicht. Rechne den Index zuerst in eine Variable.

## Probier es selbst

1. Zeige jede Notiz mit ihrer Nummer und lass den Spieler eine Notiz löschen: Wenn er „delete“ tippt, fragt der Laptop nach der Nummer der Notiz.

::: details Lösung
Eine FOR-Schleife von 0 bis `count - 1` gibt jede Notiz mit ihrem Index aus, `i ⊕ ": " ⊕ notes[i]`. Bei „delete“ liest ein zweites INPUT die Nummer, und **REMOVE** nimmt das Element aus der Liste. Die Elemente dahinter rücken um eins auf.

<<< @/tutorials/programs/learning/lists-notes-delete.c0de

Nach „Get more torches“, „Plant wheat“, „delete“ und 0 zeigt die Wand „0: Get more torches“ und „1: Plant wheat“. Eine Nummer, die nicht in der Liste ist, zum Beispiel 7, lässt das Programm mit INDEX_OUT_OF_BOUNDS abstürzen.
:::

2. Zeige über der Liste die Anzahl der Notizen.

::: details Lösung
Verschiebe das CALL LEN an den Anfang der Schleife und gib vor der EACH-Schleife `"Notes: " ⊕ count` aus.

<<< @/tutorials/programs/learning/lists-notes-count.c0de
:::

## Mehr dazu

- [Typen](/de/c0de/guide/language#typen), [Variablen und Konstanten](/de/c0de/guide/language#variablen-und-konstanten) und [EACH-Schleifen](/de/c0de/guide/language#each-schleifen) in der Anleitung
- [TYPE_ARRAY](/de/c0de/reference/data#type_array) im Handbuch Daten, [EACH](/de/c0de/reference/statements#each) im Handbuch Anweisungen
- [LEN](/de/c0de/reference/functions#len), [INSERT](/de/c0de/reference/functions#insert) und [REMOVE](/de/c0de/reference/functions#remove) im Handbuch Funktionen
