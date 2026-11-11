---
description: Der Stapelrechner zieht auf einen Laptop um – er fragt, wie viele Gegenstände du hast, wartet auf deine Antwort und gibt Stapel und einzelne Gegenstände aus.
---

# Den Spieler fragen

Für jede Frage eine Variablenkarte auszufüllen funktioniert, ist aber langsam. Heute zieht der Stapelrechner auf einen Laptop in deinem Lagerraum um: Er fragt „How many items?“, du tippst eine Zahl, und die Antwort erscheint sofort auf dem Bildschirm.

::: tip Neue Wörter

- **Eingabeaufforderung**: die Frage, die ein Programm zeigt, wenn es etwas von dir braucht.
- **Warten**: Ein Programm kann bei einer Anweisung anhalten, bis ein Mensch etwas tut. Der Computer tut in diesem Programm so lange nichts anderes.
  :::

::: info Was du brauchst
Den Stapelrechner aus der letzten Lektion, seinen Auslöserblock mit Knopf und einen **Laptop**. Sprachblöcke: VARIABLE, CALL, PARAMETER, LABEL, LITERAL, OPERATOR und INTEGER-Typblöcke.
:::

## Die Idee

Stell dir einen Dorfbewohner vor, der mit dir handelt. Er weiß vorher nicht, was du willst. Er wartet, bis du einen Handel auswählst, dann gibt er dir die Ware.

Programme können dasselbe. Bisher war alles, was ein Programm brauchte, beim Start schon da: im Programm selbst oder auf einer Karte im Auslöserblock. Jetzt startet das Programm, zeigt eine **Eingabeaufforderung** und **wartet** dann, bis jemand eine Antwort tippt. Erst dann macht es mit der nächsten Zeile weiter.

## Das Programm

Das Programm bleibt auf dem Blatt des Stapelrechners und ersetzt ihn.

<<< @/tutorials/programs/learning/asking-stacks.c0de

## So baust du es

Die Zeilen 0 bis 3 bleiben gleich.

- Zeile 4: FUNCTION `calculate`, jetzt ohne PARAMETER- und RESULT-Zeilen darunter. Entferne sie mit dem Hammer.
- Zeile 5: BEGIN.
- Zeilen 6 bis 9: vier VARIABLE-Zeilen mit INTEGER-Typblöcken: `items`, `size` mit 64, `stacks` und `rest`, wie in der Lektion „Rechnen“.
- Zeilen 10 und 11: ein CALL `PRINT` mit dem `value` `"How many items?"`.
- Zeile 12: ein CALL bei x=6 und ein LABEL `INPUT`.
- Zeile 13: ein PARAMETER bei x=7, ein LABEL `variable`, ein LABEL `items` und ein OPERATOR `;`.
- Zeilen 14 bis 18: der CALL von `c0de/math/DIV` und das ASSIGN von `rest`, wie bisher.
- Zeilen 19 und 20: ein CALL `PRINT` mit dem `value` `stacks ;`.
- Zeilen 21 und 22: ein CALL `PRINT`, dessen `value` die Zahlen und Texte mit `⊕` zusammenfügt.
- Zeile 23: END FUNCTION.

## Starten

1. Platziere einen **Laptop** neben dem Auslöserblock des Rechners. Klicke ihn mit rechts an, um sein Terminal zu öffnen. Klicke oben auf die beiden Knöpfe, bis sie `stacks` und `calculate` zeigen, dann auf ✔. Damit ist der Laptop gebunden, und das Terminal schließt sich.
2. Nimm die Variablenkarten aus dem Auslöserblock. Dieses Programm hat keine Parameter und keine Ergebnisse, also braucht es keine Karten.
3. Drück den Knopf. Der Bildschirm des Laptops zeigt „How many items?“.
4. Klicke den Laptop mit rechts an. Unter dem Bildschirm zeigt die Eingabezeile `INPUT items (INTEGER):`. Tippe `1000` und drück Enter.

<!-- screenshot: asking-input | the open terminal of the laptop while INPUT waits: "How many items?" on the screen and the input line "INPUT items (INTEGER):" with 1000 typed -->

Der Bildschirm zeigt:

```text
How many items?
1000
15
1000 items are 15 stacks and 40 items.
```

Die Zeile `1000` ist das, was du getippt hast. Drück den Knopf noch einmal, um nach der nächsten Zahl zu fragen.

<!-- screenshot: asking-laptop | the terminal of the laptop after the run: the prompt "How many items?", the typed 1000 and the two lines of the answer, with the input line below -->

## So funktioniert es

- `CALL PRINT` mit `"How many items?"` ist die Eingabeaufforderung. Ohne sie sähe der Spieler einen leeren Bildschirm und wüsste nicht, was das Programm will.
- `CALL INPUT` mit `PARAMETER variable items ;` liest einen Wert in die Variable `items` ein. Hier **wartet** das Programm: Der Cursor bleibt in dieser Zeile, bis du am Laptop Enter drückst.
- INPUT kennt den Typ von `items`: INTEGER. Tippst du etwas, das keine ganze Zahl ist, lehnt der Laptop es ab und wartet weiter. Nur ein passender Wert kommt in die Kiste.
- Nach INPUT rechnet das Programm wie bisher, mit der Zahl, die du getippt hast.
- `CALL PRINT` mit `value stacks ;` gibt eine Zahl allein aus: 15. Du musst sie nicht erst in Text verwandeln.
- Das letzte PRINT fügt Zahlen und Texte mit `⊕` zu einer Zeile zusammen. Der Laptop hat 48 Spalten, also passt die Zeile.

Das Programm ist für jede Zahl dasselbe. Du kannst es so oft fragen, wie du willst, und musst nie zurück in die c0de-Dimension.

## Probier es selbst

1. Lass den Rechner auch nach der Stapelgröße fragen, damit er für Enderperlen und Schneebälle funktioniert (16 pro Stapel).

::: details Lösung
Entferne den Startwert von `size` und frag mit einer zweiten Eingabeaufforderung und einem zweiten INPUT danach. Die Eingabeaufforderung „How many fit into one stack?“ hat 28 Zeichen und passt auf den Bildschirm des Laptops.

<<< @/tutorials/programs/learning/asking-size.c0de

Tippe 100 und dann 16: Die Antwort ist „100 items are 6 stacks and 4 items.“
:::

2. Wenn der Rechner „How many items?“ fragt, tippe `lots` statt einer Zahl. Was passiert?

::: details Lösung
Der Laptop lehnt die Zeile ab: Er zeigt eine Zeile, die mit `? ` beginnt, und INPUT wartet weiter. `items` ist eine INTEGER-Kiste, und „lots“ ist keine ganze Zahl. Tippe eine Zahl, und das Programm macht weiter.
:::

## Mehr dazu

- [INPUT](/de/c0de/reference/functions#input) und [PRINT](/de/c0de/reference/functions#print) im Handbuch
- [Laptop](/de/c0de/reference/devices#laptop): das Terminal und die Eingabezeile
- [Mit Spielern sprechen](/de/c0de/guide/running-programs#mit-spielern-sprechen) in der Anleitung
