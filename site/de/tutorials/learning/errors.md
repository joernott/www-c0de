---
description: Ein Programm, das die Weizenernte verteilt, hat drei Fehler – du findest sie mit den Farben der Zeilennummern, dem Debugging-Werkzeug und dem Debug-Auslöserblock und reparierst sie.
---

# Wenn etwas schiefgeht

Jeder Programmierer macht Fehler, jeden Tag. Einen guten Programmierer erkennt man daran, dass er weiß, wie er sie findet. Heute bekommt der Computer von Oak Hill ein kleines Programm, das die Ernte der Weizenfarm unter den Spielern der Basis verteilt. Jemand hat es in Eile gebaut: Es hat drei Fehler. Du findest sie einen nach dem anderen, mit den Werkzeugen, die c0de dir gibt, und reparierst das Programm.

::: tip Neue Wörter

- **Bug**: ein Fehler in einem Programm. Das Programm läuft nicht, oder es tut etwas, das du nicht gemeint hast.
- **Debuggen**: Bugs finden und entfernen.
- **Fehler** (zur Laufzeit): ein Problem, das ein Programm anhält, während es läuft, zum Beispiel eine Division durch null.
- einen Fehler **abfangen**: ihn bemerken und darauf reagieren, statt das Programm anhalten zu lassen.

:::

::: info Was du brauchst

- ein neues, leeres Blatt in der c0de-Dimension und den Schraubenschlüssel
- einen **Auslöserblock** mit einem Knopf und einen **Debug-Auslöserblock**
- das **Debugging-Werkzeug** (es sieht aus wie eine Fliegenklatsche)
- drei INTEGER-**Variablenkarten** mit den Namen `rows`, `length` und `players`
- die Blöcke, die du kennst: PROGRAM, NOOP, FUNCTION, PARAMETER, RESULT, BEGIN, END, ASSIGN, IF, LABEL, LITERAL, OPERATOR und die Typblöcke INTEGER und FLOAT

:::

## Die Idee

Stell dir ein Rezept für einen Kuchen vor. Drei Dinge können daran falsch sein:

1. **Ein Wort ist falsch geschrieben.** „Gib 200 g Mhel dazu.“ Das merkst du sofort, wenn du das Rezept liest. In c0de wird die Zeilennummer beim Bauen **rot**.
2. **Das Rezept ist falsch.** Es sagt „ein Löffel Salz“, wo Zucker gemeint ist. Du folgst ihm genau, und der Kuchen schmeckt furchtbar. Nichts warnt dich; du merkst es erst am Ergebnis. In c0de läuft das Programm, aber sein Ergebnis ist falsch.
3. **Das Rezept verlangt etwas Unmögliches.** „Verteile den Kuchen gerecht unter allen Gästen“ – aber es sind keine Gäste da. In c0de ist das ein **Fehler** während das Programm läuft: Das Programm hält an, und man sagt, es **stürzt ab**.

Für jede Art von Bug gibt es ein eigenes Werkzeug, um ihn zu finden.

## Das Programm

So hat dein eiliger Freund das Programm gebaut. Es bekommt die Größe des Weizenfelds (`rows`, die Reihen, und `length`, die Länge) und die Zahl der Spieler (`players`) und gibt zurück, wie viel Weizen es gibt und wie viel jeder Spieler bekommt. Bau es genau so, mit den Fehlern.

<<< @/tutorials/programs/learning/errors-broken.c0de

## So baust du es

Das Programm kommt auf ein neues Blatt. Bau es Zeile für Zeile, wie die Programme davor:

- Zeilen 0 bis 3: PROGRAM `repair`, zwei NOOP-Zeilen, FUNCTION `share`.
- Zeilen 4 bis 6: drei PARAMETER-Zeilen bei x=6, jede mit einem LABEL und einem INTEGER-Typblock.
- Zeilen 7 und 8: zwei RESULT-Zeilen: `wheat` mit INTEGER und `each` mit FLOAT, weil ein Anteil eine Kommazahl sein kann.
- Zeile 9: BEGIN bei x=5.
- Zeile 10: ASSIGN bei x=6, LABEL `wheat`, LABEL `rows`, OPERATOR `+`, LABEL `length`, OPERATOR `;`.
- Zeile 11: ASSIGN bei x=6, LABEL `each`, LABEL `wheat`, OPERATOR `/`, LABEL `players` – und kein `;` am Ende.
- Zeile 12: END FUNCTION bei x=5.

## Starten

### Bug 1: die rote Zeile

Sieh dir die Zeilennummern bei x=2 an. Alle sind dunkelgrün oder blass – außer Zeile 11, die ist **dunkelrot**. Eine rote Zeilennummer bedeutet: Diese Zeile ist falsch, so kann das Programm nicht laufen.

<!-- screenshot: errors-broken-sheet | the program repair with its three bugs on its sheet, seen from the south, the line number 11 dark red and all other line numbers dark green or faint -->

Aber was ist falsch? Klicke mit dem Debugging-Werkzeug mit rechts auf einen Block von Zeile 11. Sein Dialog sagt dir, dass der Ausdruck nicht mit `;` endet. Jede Rechnung in c0de endet mit dem OPERATOR `;`, und diese nicht.

Repariere es: Setze einen OPERATOR-Block mit `;` ans Ende von Zeile 11. Die Zeilennummer wird dunkelgrün.

### Bug 2: das falsche Ergebnis

Jetzt läuft das Programm. Verlasse die Dimension und stelle den Auslöserblock auf das Programm `repair` und die Funktion `share` ein. Lege drei Karten hinein: `rows` mit dem Wert 3, `length` mit 10 und `players` mit 2. Eine nicht initialisierte Karte brauchst du diesmal nicht: Drei Karten gehen hinein, also kommen drei Karten heraus. Drücke den Knopf.

Im Ausgabeinventar liegen `wheat` mit dem Wert 13 und `each` mit 6.5. Aber ein Feld mit 3 Reihen zu je 10 Weizen hat 30 Weizen, nicht 13! Nichts wurde rot, nichts ist abgestürzt. Das Programm hat genau getan, was dasteht – es steht nur das Falsche da.

Um zu sehen, wo es schiefgeht, schau dem Programm bei der Arbeit zu, eine Zeile nach der anderen:

1. Stelle den **Debug-Auslöserblock** auf den schwarzen Boden neben dem Blatt. Stelle ihn auf dasselbe Programm und dieselbe Funktion ein und lege dieselben drei Karten hinein.
2. Schlage mit dem Debugging-Werkzeug auf den Debug-Auslöserblock. Auf der Cursorschiene des Blatts erscheint ein **roter Cursor**. Er wartet.
3. Klicke den roten Cursor mit dem Debugging-Werkzeug mit links an. Er geht eine Zeile weiter, und dein Chat zeigt die Zeile, in der er jetzt steht. Klicke, bis er Zeile 10 hinter sich hat.
4. Klicke den Cursor mit rechts an. Der Dialog zeigt die Werte auf seinem Stack: `rows` ist 3, `length` ist 10 – und `wheat` ist 13.

<!-- screenshot: errors-debug-cursor | the red debug cursor on the cursor rail next to line 11 of the program repair, and the dialog of the cursor with the values of rows, length and wheat -->

Zeile 10 ist also schuld: `rows + length` addiert die Zahlen, aber die Fläche eines Felds ist Reihen **mal** Länge. Repariere es: Ersetze den OPERATOR `+` in Zeile 10 durch `*`. Starte es noch einmal: Jetzt ist `wheat` 30 und `each` 15.0.

### Bug 3: der Absturz

Deine Freunde sind unterwegs. Setze die Karte `players` auf 0 und drücke den Knopf noch einmal. Der Auslöserblock spielt einen tiefen Ton: Das Programm ist **abgestürzt**. Öffne seinen Dialog. Er zeigt den Fehler:

- den Code 303, DIVISION_BY_ZERO, mit der Meldung „Division by 0“,
- die Funktion `share` und die Zeile 11, in der es passiert ist.

<!-- screenshot: errors-crash-dialog | the dialog of the trigger block after the crash, showing the error code 303 DIVISION_BY_ZERO, the message "Division by 0", the function share and the line 11 -->

Niemand kann 30 Weizen unter 0 Spielern verteilen – auch kein Computer. Ein abgestürztes Programm liefert keine Ergebnisse. Deine drei Karten kommen unverändert ins Ausgabeinventar zurück, damit du es noch einmal versuchen kannst.

Repariere es: Teile nur, wenn jemand zum Teilen da ist. Das ist das reparierte Programm:

<<< @/tutorials/programs/learning/errors-repair.c0de

Zeile 11 ist jetzt ein IF, das fragt: `players > 0 ;`. Die Division rückt einen Block weiter nach Osten in einen eigenen Codeblock, in Zeile 13. Mit 0 Spielern ist `wheat` 30, und `each` bleibt 0.0.

## So funktioniert es

- **Die Farben der Zeilennummern** prüfen jede Zeile, während du baust: Dunkelgrün ist richtig, Dunkelgelb ist unfertig, Dunkelrot ist falsch. Ein Programm mit einer roten Zeile kann nicht laufen. Das Debugging-Werkzeug sagt dir, was falsch ist.
- **Ein falsches Ergebnis** ist ein Bug, den nur du finden kannst, denn nur du weißt, was das Programm tun soll. Rechne ein Beispiel von Hand aus und vergleiche es mit dem Ergebnis. Mit dem Debug-Auslöserblock kannst du nach jeder Zeile anhalten und dir die Werte ansehen.
- **Ein Fehler** hält die Funktion an der Stelle an, an der er passiert. Wenn ihn nichts abfängt, stürzt das ganze Programm ab: Der Auslöserblock spielt einen tiefen Ton, behält den Fehler in seinem Dialog und gibt die Karten unverändert zurück. Der Dialog sagt dir, was passiert ist, in welcher Funktion und in welcher Zeile.
- **Den Fehler vermeiden** ist oft die einfachste Reparatur: Ein IF prüft, ob die Werte sinnvoll sind, bevor du sie benutzt.

Bugs sind keine Katastrophe. Lies die Meldung, finde die Zeile, ändere eine Sache, versuch es noch einmal.

## Probier es selbst

1. Ein IF kann einen Fehler vermeiden, aber du kannst ihn auch **abfangen**. Nimm das IF wieder aus `share` heraus, damit die Division fehlschlagen kann. Schreib dann eine zweite Funktion `harvest` mit denselben drei Parametern. Sie ruft `share` auf und schreibt das Ergebnis auf deinen Laptop – oder „Nobody to share with!“, wenn `share` fehlgeschlagen ist.

::: details Lösung
Um einen Fehler abzufangen, gibst du der CALL-Zeile hinter dem Funktionsnamen eine Variable vom Typ ERROR: `CALL share problem`. Wenn `share` fehlschlägt, stürzt das Programm nicht ab. Stattdessen kommt der Fehler in `problem`, und `harvest` macht weiter. `problem.code` ist 0, wenn alles gut gegangen ist.

<<< @/tutorials/programs/learning/errors-catch.c0de

Binde deinen Laptop an `repair` und `harvest` und stelle den Auslöserblock auf `harvest` ein. Mit 2 Spielern zeigt der Laptop „Harvest: 30 wheat“ und „Each player gets 15.0“. Mit 0 Spielern zeigt er „Harvest: 30 wheat“ und „Nobody to share with!“. Der Weizen wird trotzdem gezählt, weil Zeile 10 lief, bevor die Division fehlschlug.
:::

2. Dein Programm kann ein Problem auch selbst melden. Ändere `share` so, dass es einen eigenen Fehler mit dem Code 1001 und der Meldung „Nobody to share with“ **auslöst**, wenn `players` kleiner als 1 ist. Was zeigt der Auslöserblock bei 0 Spielern?

::: details Lösung
Die eingebaute Funktion RAISE löst einen eigenen Fehler aus. Sein Code muss 1000 oder höher sein; kleinere Codes gehören den Fehlern von c0de.

<<< @/tutorials/programs/learning/errors-raise.c0de

Mit 0 Spielern stürzt das Programm ab, und der Dialog des Auslöserblocks zeigt den Code 1001, die Meldung „Nobody to share with“, die Funktion `share` und die Zeile 13. Deine eigene Meldung sagt dem Spieler viel besser, was schiefgegangen ist, als „Division by 0“. Von `harvest` aus Aufgabe 1 aufgerufen, würde der Fehler abgefangen wie jeder andere.
:::

## Mehr dazu

- [Zeilennummern](/de/c0de/guide/getting-started#zeilennummern) in der Anleitung
- [Debugging-Werkzeug](/de/c0de/guide/tools#debugging-werkzeug) in der Anleitung und [Debug-Auslöserblock](/de/c0de/reference/triggers#debug-auslöserblock) im Handbuch Auslöser
- [Fehler](/de/c0de/guide/language#fehler) und [Eigene Fehler](/de/c0de/guide/language#eigene-fehler) in der Anleitung
- [Abstürze](/de/c0de/guide/running-programs#abstürze) in der Anleitung und das Beispiel [Ein absichtlicher Absturz](/de/c0de/guide/examples#ein-absichtlicher-absturz)
- [RAISE](/de/c0de/reference/functions#raise) im Handbuch Funktionen und [TYPE_ERROR](/de/c0de/reference/data#type_error) im Handbuch Daten
