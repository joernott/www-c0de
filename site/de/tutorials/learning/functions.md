---
description: Eine eigene Funktion, die einen Rahmen um jeden Text zeichnet, dreimal auf dem Willkommensschild verwendet – ein Problem in Teile zerlegen, die du wiederverwenden kannst.
---

# Eigene Funktionen

Das Willkommensschild von Oak Hill soll schick aussehen: jeder Text in einem Rahmen aus Sternen. Ein Rahmen braucht mehrere Zeilen Code: die Buchstaben zählen, eine Zeile aus Sternen bauen, drei Zeilen ausgeben. Das alles dreimal zu schreiben wäre lang und langweilig, und jeder Fehler wäre auch dreimal da. Heute schreibst du den Rahmen einmal, als eigene Funktion, und verwendest ihn, so oft du willst.

::: tip Neue Wörter

- **Funktion**: ein benanntes Stück eines Programms, das eine Aufgabe erledigt. Einstiegsfunktionen schreibst du seit deinem ersten Programm; jetzt schreibst du eine, die eine andere Funktion aufruft.
- **Aufruf**: eine Funktion mit CALL aus einer anderen Funktion heraus ausführen. Wenn sie fertig ist, kommt der Cursor zur Zeile nach dem CALL zurück.
- **Standardwert**: der Wert, den ein Parameter bekommt, wenn der Aufrufer ihn weglässt.
- **RETURN**: beendet eine Funktion vorzeitig.
  :::

::: info Was du brauchst

- deine Anzeigewand aus 2 × 1 Anzeigeblöcken und den Auslöserblock mit seinem Knopf
- ein neues, leeres Blatt in der c0de-Dimension
- aus dem Kreativinventar: die Blöcke, die du kennst (mit PARAMETER, RESULT, IF und FOR), und den neuen **RETURN**-Block
  :::

## Die Idee

Denk an ein Kochbuch. Das Rezept für einen Kuchen sagt „Teig zubereiten (siehe Seite 12)“. Seite 12 erklärt den Teig einmal, und jedes Rezept, das einen Teig braucht, verweist darauf. Findest du einen besseren Teig, änderst du eine Seite, und jeder Kuchen wird besser.

Eine **Funktion** ist so eine Seite. Sie hat einen Namen, sie erledigt eine Aufgabe, und andere Teile des Programms **rufen** sie **auf**, wenn sie diese Aufgabe brauchen. Wie ein Rezept, das „Teig für 2 Personen“ sagt, kann ein Aufruf Angaben mitgeben: die **Parameter**. Und wie der Teig, der zum Kuchen zurückkommt, kann eine Funktion **Ergebnisse** zurückgeben.

Von außen kennst du das schon: CLS, PRINT und LOCATE sind Funktionen, die c0de mitbringt, und deine Einstiegsfunktionen haben Parameter und Ergebnisse aus Variablenkarten bekommen. Heute schreibst du eine Funktion, die dein eigenes Programm aufruft.

## Das Programm

Das Programm `frame` kommt auf ein neues Blatt. Es hat zwei Funktionen: `framed` zeichnet einen Rahmen, `welcome` verwendet ihn dreimal.

<<< @/tutorials/programs/learning/functions-frame.c0de

<!-- screenshot: functions-frame-sheet | the program frame on its sheet, seen from above, with the two FUNCTION lines (framed and welcome), each with a NOOP line above it, and the three CALL framed lines at the south end -->

## So baust du es

Das Programm ist lang, aber du kennst fast jede Zeile. Die neuen Teile:

- Zeilen 4 bis 8: FUNCTION `framed` bei x=5, dann vier Zeilen bei x=6: PARAMETER `text` STRING, PARAMETER `row` INTEGER mit einem LITERAL 0 am Ende, PARAMETER `column` INTEGER mit einem LITERAL 0 und RESULT `width` INTEGER.
- Zeile 11: IF bei x=6 mit einem LABEL `text`, einem OPERATOR `=`, einem LITERAL `""` (ein leerer Text) und einem OPERATOR `;`.
- Zeile 13: ein **RETURN**-Block bei x=7, allein.
- Zeilen 15 bis 17: ein CALL-Block bei x=6 mit einem LABEL `LEN`, dann PARAMETER `value` mit LABEL `text` und `;` und RESULT mit den LABELs `result` und `width`, beide bei x=7.
- Zeile 39: eine NOOP-Zeile. Jede FUNCTION braucht direkt über sich eine.
- Zeilen 44 bis 46: ein CALL-Block bei x=6 mit einem LABEL `framed`, dann bei x=7 ein PARAMETER-Block, ein LABEL `text`, ein LITERAL `"Welcome"` und ein OPERATOR `;` und ein RESULT-Block mit den LABELs `width` und `used`.
- Zeile 49: ein PARAMETER-Block bei x=7, ein LABEL `column`, ein LABEL `used`, ein OPERATOR `+`, ein LITERAL 1 und ein OPERATOR `;`.

## Starten

Binde die Anzeigewand an das Programm `frame` und die Funktion `welcome` und stelle den Auslöserblock genauso ein. Drück den Knopf. Die Rahmen erscheinen nacheinander, und nach ein paar Sekunden zeigt die Wand:

```
*********** ************
* Welcome * * Oak Hill *
*********** ************

**********************
* Mind the creepers! *
**********************
```

<!-- screenshot: functions-frame-wall | the display wall with the three framed texts: "Welcome" and "Oak Hill" side by side at the top, "Mind the creepers!" below -->

## So funktioniert es

Die Funktion `framed`:

- Ihre PARAMETER-Zeilen sagen, was ein Aufrufer ihr geben kann: einen `text` und eine Zeile `row` und Spalte `column`, wo der Rahmen beginnt. `row` und `column` haben den **Standardwert** 0. Ein Aufrufer, der sie weglässt, bekommt die linke obere Ecke.
- Ihre RESULT-Zeile sagt, was sie zurückgibt: die Breite `width` des Rahmens. Ein Ergebnis beginnt mit dem Standardwert seines Typs, hier 0.
- `IF text = "" ;` mit `RETURN` darin: Ein leerer Text bekommt keinen Rahmen. RETURN beendet die Funktion sofort, und der Cursor geht zurück zum Aufrufer.
- `CALL LEN` zählt die Buchstaben des Texts. LEN ist eine Funktion, die c0de mitbringt, und du rufst sie auf wie deine eigene: `PARAMETER value text ;` gibt ihr den Text, `RESULT result width` legt ihr Ergebnis `result` in deine Variable `width`. „Welcome“ hat 7 Buchstaben.
- Der Rahmen ist um 4 breiter als der Text: ein Stern und ein Leerzeichen auf jeder Seite. Die FOR-Schleife baut in `border` eine Zeile mit so vielen Sternen.
- Dreimal LOCATE und PRINT: die obere Zeile, der Text zwischen `* ` und ` *` und die untere Zeile, jede eine Zeile tiefer (`row + 1`, `row + 2`).

Die Funktion `welcome` ruft sie dreimal auf:

- `CALL framed` mit `PARAMETER text "Welcome" ;` und sonst nichts: `row` und `column` sind 0. `RESULT width used` speichert das Ergebnis `width` von `framed` in der Variablen `used` von `welcome`: 11.
- Der zweite Aufruf rahmt `BASE` bei `column used + 1` ein, also in Spalte 12, neben dem ersten Rahmen.
- Der dritte Aufruf rahmt „Mind the creepers!“ in Zeile 4 ein. Sein Ergebnis wird nicht gebraucht, also hat er keine RESULT-Zeile, und das Ergebnis wird verworfen.

Jeder Aufruf bekommt eigene, frische Variablen: `border` beginnt jedes Mal leer. Und die Parameter sind Kopien, also kann `framed` die Variablen von `welcome` nicht aus Versehen ändern.

Eine Funktion kann nur Funktionen aufrufen, die auf dem Blatt über ihr liegen. Darum kommt `framed` zuerst, und der Auslöser startet `welcome`.

## Probier es selbst

1. Füge einen Parameter `mark` für das Rahmenzeichen hinzu, mit dem Standardwert `'*'`. Rahme „Oak Hill“ mit `#` und die Creeper-Warnung mit `!` ein.

::: details Lösung
`mark` ist ein CHAR, ein einzelnes Zeichen, geschrieben `'*'`. Es ersetzt jedes `"*"` in `framed`. Der erste Aufruf lässt es weg und bekommt Sterne.

<<< @/tutorials/programs/learning/functions-frame-mark.c0de

Die Wand zeigt den „Welcome“-Rahmen aus Sternen, den „Oak Hill“-Rahmen aus `#` und die Creeper-Warnung aus `!`.
:::

2. Ändere den ersten Aufruf in `PARAMETER text "" ;`. Was zeigt die Wand, und warum?

::: details Lösung
Der erste Rahmen ist weg, und der „Oak Hill“-Rahmen beginnt in Spalte 1. `framed` ist sofort zurückgekehrt, also hat sein Ergebnis `width` seinen Startwert 0 behalten, und `used + 1` ist 1.
:::

## Mehr dazu

- [Funktionen](/de/c0de/guide/language#funktionen), [CALL](/de/c0de/guide/language#call) und [RETURN](/de/c0de/guide/language#return) in der Anleitung
- [FUNCTION](/de/c0de/reference/statements#function), [PARAMETER](/de/c0de/reference/statements#parameter), [RESULT](/de/c0de/reference/statements#result), [RETURN](/de/c0de/reference/statements#return) und [CALL](/de/c0de/reference/statements#call) im Handbuch Anweisungen
- [LEN](/de/c0de/reference/functions#len) und [LOCATE](/de/c0de/reference/functions#locate) im Handbuch Funktionen
