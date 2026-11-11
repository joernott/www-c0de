---
description: Ein Countdown von 10 bis 0 auf der Anzeigewand, geschrieben mit einer Schleife statt mit elf Zeilen – das Programm tut dasselbe immer wieder.
---

# Dinge wiederholen: Zählschleifen

Jeder Raketenstart beginnt mit einem Countdown: 10, 9, 8 … 0, Start! Du könntest dafür elf PRINT-Zeilen schreiben. Aber Programmierer sind auf gute Art faul: Sie sagen dem Computer, dass er eine Sache immer wieder tun soll, und lassen ihn zählen. Heute zählt die Anzeigewand von Oak Hill für dich rückwärts.

::: tip Neue Wörter

- **Schleife**: Zeilen, die das Programm immer wieder ausführt.
- **Schleifenvariable**: eine Variable, die die Schleife in jeder Runde von selbst ändert, wie ein Zähler.
- **Schrittweite**: um wie viel sich die Schleifenvariable von einer Runde zur nächsten ändert.
  :::

::: info Was du brauchst

- deine Anzeigewand aus 2 × 1 Anzeigeblöcken und den Auslöserblock mit seinem Knopf
- ein neues, leeres Blatt in der c0de-Dimension
- aus dem Kreativinventar: die Blöcke, die du kennst, und den neuen **FOR**-Block
  :::

## Die Idee

Stell dir vor, du baust eine Treppe mit zehn Stufen. Du denkst nicht zehnmal „Block setzen, Block setzen, Block setzen …“. Du denkst: „Für jede Stufe von 1 bis 10: einen Block setzen.“ Du zählst beim Arbeiten mit und hörst auf, wenn du bei 10 bist.

Das ist eine **Schleife**. Sie hat einen Zähler, die **Schleifenvariable**. Sie beginnt bei einem Wert, endet bei einem anderen und ändert sich in jeder Runde um die **Schrittweite**. Ein Countdown zählt von 10 bis 0, also ist seine Schrittweite -1: In jeder Runde wird die Zahl um eins kleiner.

## Das Programm

Das Programm `countdown` kommt auf ein neues Blatt.

<<< @/tutorials/programs/learning/counting-loops-countdown.c0de

## So baust du es

- Zeilen 0 bis 3: PROGRAM `countdown`, zwei NOOP-Zeilen und FUNCTION `launch` bei x=5.
- Zeile 4: BEGIN bei x=5.
- Zeile 5: ein VARIABLE-Block bei x=6, ein LABEL `numbers` und ein STRING-Typblock.
- Zeile 6: ein **FOR**-Block bei x=6, ein LABEL `i`, ein INTEGER-Typblock und dann drei Werte, jeder mit einem OPERATOR `;` am Ende: ein LITERAL 10 und `;`, ein LITERAL 0 und `;`, ein LITERAL -1 und `;`.
- Zeile 7: BEGIN bei x=6.
- Zeile 8: ein ASSIGN-Block bei x=7, ein LABEL `numbers`, ein LABEL `numbers`, ein OPERATOR `⊕`, ein LABEL `i`, ein OPERATOR `⊕`, ein LITERAL `" "` (ein Text mit einem Leerzeichen) und ein OPERATOR `;`.
- Zeile 9: ein END-Block bei x=6, gefolgt von einem FOR-Block.
- Zeilen 10 bis 14: CALL CLS, dann zwei CALL-PRINT-Zeilen mit ihren PARAMETER-Zeilen, bei x=6 und x=7.
- Zeile 15: END FUNCTION bei x=5.

<!-- screenshot: counting-loops-countdown-sheet | the program countdown on its sheet, seen from the side, with the FOR line and its indented ASSIGN line in front -->

## Starten

Binde die Anzeigewand an das Programm `countdown` und die Funktion `launch` (klicke ✔ in ihrem Dialog) und stelle den Auslöserblock genauso ein. Drück den Knopf. Die Wand zeigt:

```
10 9 8 7 6 5 4 3 2 1 0
Lift-off!
```

<!-- screenshot: counting-loops-countdown-wall | the display wall showing "10 9 8 7 6 5 4 3 2 1 0" and "Lift-off!" below it -->

Das Programm ist in ein, zwei Sekunden fertig. Beobachte den Cursor auf dem Blatt, während es läuft: Er geht hinunter zur ASSIGN-Zeile und wieder hinauf zu FOR, elfmal.

## So funktioniert es

- `VARIABLE numbers STRING` beginnt als leerer Text. Die Schleife sammelt die Zahlen darin.
- `FOR i INTEGER 10 ; 0 ; -1 ;` startet die Schleife. `i` ist die Schleifenvariable, ihr Typ ist INTEGER. Sie beginnt bei 10, endet bei 0, und die Schrittweite ist -1.
- In der ersten Runde ist `i` gleich 10. Die Zeile `ASSIGN numbers numbers ⊕ i ⊕ " " ;` hängt „10 “ an das Ende von `numbers` an.
- Bei `END FOR` geht der Cursor zurück zu FOR. `i` wird um eins kleiner, und die nächste Runde hängt „9 “ an.
- Der Endwert ist eingeschlossen: Die letzte Runde läuft mit `i` = 0. Dann ist die Schleife vorbei, und der Cursor macht nach `END FOR` weiter.
- Jetzt ist `numbers` gleich „10 9 8 7 6 5 4 3 2 1 0 “, und die zwei PRINT-Zeilen zeigen es und „Lift-off!“.

Ein paar Regeln von FOR:

- Ohne Schrittweite ist die Schrittweite 1: `FOR i INTEGER 1 ; 10 ;` zählt 1, 2, 3 … 10.
- Die Schrittweite darf nicht 0 sein. Eine negative Schrittweite zählt rückwärts.
- Du kannst `i` in der Schleife lesen, aber nicht mit ASSIGN ändern. Nur die Schleife ändert es.
- Liegt der Start schon hinter dem Ende, wie bei `FOR i INTEGER 1 ; 0 ;`, läuft die Schleife gar nicht.

Warum nicht jede Zahl einzeln mit PRINT ausgeben? Die Wand hat 8 Zeilen. Zwölf Zeilen passen nicht darauf, und die ersten würden hinausrollen.

## Probier es selbst

1. Zähle in Fünferschritten von 50 bis 0 rückwärts.

::: details Lösung
Nur die FOR-Zeile ändert sich: `FOR i INTEGER 50 ; 0 ; -5 ;`. Die Wand zeigt „50 45 40 35 30 25 20 15 10 5 0“.

<<< @/tutorials/programs/learning/counting-loops-fives.c0de
:::

2. Zeige die Siebenerreihe: 7, 14, 21 … 70.

::: details Lösung
Zähle von 1 bis 10 und hänge `i * 7` statt `i` an. `*` wird vor `⊕` berechnet, also hängt das Programm das Ergebnis der Multiplikation an.

<<< @/tutorials/programs/learning/counting-loops-table.c0de

Die Wand zeigt „The 7 times table:“ und „7 14 21 28 35 42 49 56 63 70“.
:::

## Mehr dazu

- [FOR-Schleifen](/de/c0de/guide/language#for-schleifen) in der Anleitung
- [FOR](/de/c0de/reference/statements#for) im Handbuch Anweisungen
