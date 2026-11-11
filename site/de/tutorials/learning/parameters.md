---
description: Der Stapelrechner bekommt die Zahl der Gegenstände als Variablenkarte und gibt Stapel und einzelne Gegenstände als zwei Ergebnisse zurück – Eingabe, Verarbeitung und Ausgabe.
---

# Werte geben und bekommen

Der Stapelrechner zählt immer 1000 Bruchstein. Um etwas anderes zu zählen, musstest du in die c0de-Dimension gehen und das Programm ändern. Heute nimmt der Rechner die Zahl von einer Karte, die du in den Auslöserblock legst, und gibt dir die Antwort als zwei Karten zurück.

::: tip Neue Wörter

- **Eingabe**: die Werte, die in ein Programm hineingehen.
- **Ausgabe**: die Werte, die herauskommen.
- **Ergebnis**: ein Wert, den eine Funktion zurückgibt, wenn sie endet.
- **Variablenkarte**: eine Karte, die einen Wert mit einem Namen und einem Typ in ein Programm hinein- oder aus ihm herausträgt.
  :::

::: info Was du brauchst
Den Stapelrechner aus der letzten Lektion. Sprachblöcke: PARAMETER und RESULT (ein PARAMETER-Block wird im Handwerksraster zu einem RESULT-Block), LABEL und INTEGER-Typblöcke. Aus dem Kreativinventar: zwei **Variablenkarten**.
:::

## Die Idee

Denk an einen Ofen. Du legst Roheisen und Kohle hinein: die **Eingabe**. Der Ofen tut seine Arbeit. Dann nimmst du Eisenbarren heraus: die **Ausgabe**. Der Ofen arbeitet jedes Mal gleich, aber mit anderer Eingabe bekommst du eine andere Ausgabe.

Fast jedes Programm funktioniert so: Eingabe, Verarbeitung, Ausgabe.

Eine Funktion lässt sich wie ein Ofen bauen. Ihre **Parameter** sind die Plätze für die Eingabe: Jeder hat einen Namen und einen Typ, zum Beispiel „items, eine ganze Zahl“. Ihre **Ergebnisse** sind die Plätze für die Ausgabe. Der Funktion ist egal, woher die Eingabe kommt. Sie arbeitet mit dem Wert, der gerade im Platz liegt.

## Das Programm

Das Programm bleibt auf dem Blatt des Stapelrechners und ersetzt ihn.

<<< @/tutorials/programs/learning/parameters-stacks.c0de

## So baust du es

Die Zeilen 0 bis 4 bleiben gleich.

- Zeile 5: ein PARAMETER-Block bei x=6, ein LABEL `items` und ein INTEGER-Typblock.
- Zeilen 6 und 7: ein RESULT-Block bei x=6, ein LABEL `stacks` und ein INTEGER-Typblock; dann dasselbe mit `rest`.
- Zeile 8: das BEGIN.
- Zeile 9: die VARIABLE `size` mit ihrem Startwert 64.
- Zeilen 10 bis 14: der CALL von `c0de/math/DIV` und das ASSIGN von `rest`, wie bisher.
- Zeile 15: END FUNCTION.

Entferne die VARIABLE-Zeilen von `items`, `stacks` und `rest`: Sie sind jetzt Parameter und Ergebnisse. Entferne auch die CLS- und PRINT-Zeilen. Klicke eine Zeile mit dem Hammer mit links an, um sie zu löschen.

<!-- screenshot: parameters-stacks | the program "stacks" on its sheet, seen from above, with the PARAMETER and RESULT lines between FUNCTION and BEGIN -->

## Starten

Die Antwort kommt jetzt als Karten, darum braucht dieses Programm die Anzeigewand nicht.

1. Nimm eine Variablenkarte aus dem Kreativinventar. Halte sie in deiner Haupthand und klicke mit rechts. Gib in ihrem Dialog den Namen `items` ein, wähle den Typ INTEGER und gib den Wert 1000 ein. Speichere mit dem grünen Häkchen.
2. Nimm eine zweite Variablenkarte und lass sie, wie sie ist: **nicht initialisiert**, ohne Namen, Typ und Wert. Das Programm schreibt ein Ergebnis hinein.
3. Klicke den Auslöserblock des Rechners mit leerer Hand mit rechts an und lege beide Karten in sein Eingabeinventar.
4. Drück den Knopf.

Im Ausgabeinventar liegen jetzt zwei Variablenkarten. Nimm sie heraus, halte jede und klicke mit rechts: Eine heißt `stacks` und hat den Wert 15, die andere `rest` mit dem Wert 40.

<!-- screenshot: parameters-trigger | the dialog of the trigger block with the variable item "items" and an uninitialized variable item in the input inventory -->

Ändere den Wert von `items` auf 500 und starte noch einmal: Die Antwort ist 7 Stapel und 52 Gegenstände.

## So funktioniert es

- `PARAMETER items INTEGER` sagt: Diese Funktion braucht eine ganze Zahl namens `items`, um zu arbeiten. Die Parameterzeilen stehen zwischen FUNCTION und BEGIN, einen Block weiter östlich.
- Wenn der Auslöserblock die Funktion startet, sucht er in seinem Eingabeinventar eine Variablenkarte mit demselben Namen, `items`, und demselben Typ. Ihr Wert kommt in den Parameter. In der Funktion verhält sich `items` wie eine Variable.
- `RESULT stacks INTEGER` und `RESULT rest INTEGER` sind die Ausgaben. Auch sie verhalten sich wie Variablen und beginnen mit 0. Der CALL von DIV legt die Stapel in `stacks`, das ASSIGN legt den Rest in `rest`.
- Wenn die Funktion endet, kommt jedes Ergebnis als Variablenkarte ins Ausgabeinventar, mit dem Namen, dem Typ und dem Wert des Ergebnisses.
- Warum zwei Karten für einen Eingabewert? Die Funktion hat zwei Ergebnisse. Die Karte `items` nimmt auf dem Weg nach draußen eines davon auf; die nicht initialisierte Karte trägt das andere. Eine Funktion braucht eine nicht initialisierte Karte für jedes Ergebnis, dessen Platz keine Parameterkarte einnimmt.

## Probier es selbst

1. Gib der Funktion einen zweiten Parameter `size` für die Stapelgröße, damit sie auch Enderperlen zählen kann (Stapel zu 16). Ohne eine Karte `size` soll sie in Stapeln zu 64 zählen.

::: details Lösung
Ein Parameter kann einen **Standardwert** haben: ein LITERAL hinter seinem Typ. Liegt im Eingabeinventar keine Karte mit dem Namen `size`, bekommt der Parameter 64. Die VARIABLE-Zeile von `size` wird nicht mehr gebraucht.

<<< @/tutorials/programs/learning/parameters-size.c0de

Nur mit der Karte `items` (1000) sind die Ergebnisse 15 und 40, wie bisher. Füge eine INTEGER-Variablenkarte mit dem Namen `size` und dem Wert 16 hinzu und setze `items` auf 100: Die Ergebnisse sind 6 Stapel und 4 Enderperlen. Da es jetzt zwei Parameterkarten für zwei Ergebnisse gibt, brauchst du keine nicht initialisierte Karte.
:::

2. Nimm beim ersten Programm die nicht initialisierte Karte aus dem Eingabeinventar, lass nur `items` darin und drück den Knopf. Was passiert?

::: details Lösung
Nichts. Der Auslöserblock startet das Programm nicht, weil eine nicht initialisierte Karte für das zweite Ergebnis fehlt. Leg sie zurück, und es funktioniert wieder.
:::

## Mehr dazu

- [Funktionen](/de/c0de/guide/language#funktionen) in der Anleitung: Parameter, Ergebnisse und Standardwerte
- [Variablenkarten](/de/c0de/guide/running-programs#variablenkarten), [Nicht initialisierte Karten](/de/c0de/guide/running-programs#nicht-initialisierte-karten) und [Ergebnisse](/de/c0de/guide/running-programs#ergebnisse)
- [Wenn er nicht startet](/de/c0de/guide/running-programs#wenn-er-nicht-startet)
- [PARAMETER](/de/c0de/reference/statements#parameter) und [RESULT](/de/c0de/reference/statements#result) im Handbuch
