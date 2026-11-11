---
description: Dein erstes Projekt – ein Ratespiel auf dem Laptop, das alles zusammenbringt, was du gelernt hast, Schritt für Schritt geplant, bevor es gebaut wird.
---

# Projekt: Zahlenraten

Zeit für ein Spiel! Der Laptop von Oak Hill denkt sich eine geheime Zahl von 1 bis 100 aus. Du rätst, und er sagt dir „höher“ oder „niedriger“, bis du sie gefunden hast. Am Ende sagt er, wie viele Versuche du gebraucht hast. Diese Lektion hat keine neuen Blöcke. Es geht um etwas anderes: wie du ein Programm **planst**, bevor du es baust, und wie die Ideen aller Lektionen zusammenpassen.

::: tip Neue Wörter

- **Planen**: die Schritte eines Programms in deinen eigenen Worten aufschreiben, bevor du es baust.
- **Spielschleife**: der Teil eines Spiels, der sich wiederholt, bis das Spiel vorbei ist: fragen, prüfen, antworten, und wieder von vorn.

:::

::: info Was du brauchst

- ein neues, leeres Blatt in der c0de-Dimension und den Schraubenschlüssel
- deinen **Laptop** und daneben einen **Auslöserblock** mit einem Knopf
- die Blöcke, die du kennst, darunter INCLUDE, REPEAT und IF

:::

## Die Idee

Bevor du in Minecraft ein großes Haus baust, denkst du zuerst darüber nach: Wo kommt die Tür hin, wie viele Stockwerke, welche Blöcke? Bei einem Programm ist es genauso. Bevor du den ersten Block setzt, schreib die Schritte in einfachen Worten auf, wie ein Rezept:

1. Denk dir eine geheime Zahl von 1 bis 100 aus.
2. Zeig eine Begrüßung.
3. Frag den Spieler nach einem Tipp.
4. Zähl den Versuch.
5. Wenn der Tipp zu klein ist, sag „höher“. Wenn er zu groß ist, sag „niedriger“.
6. Wenn der Tipp nicht stimmt, geh zurück zu Schritt 3.
7. Sag „richtig“ und wie viele Versuche es gebraucht hat.

Geh jetzt den Plan durch und frag bei jedem Schritt: Welcher Teil von c0de macht das?

| Schritt | Was c0de benutzt                                | Gelernt in                                                                                                       |
| ------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1       | eine Funktion `secretNumber` mit RANDOM und INT | [Eigene Funktionen](/de/tutorials/learning/functions), [Bibliotheken benutzen](/de/tutorials/learning/libraries) |
| 2       | CLS, COLOR und PRINT                            | [Farben und der Bildschirm](/de/tutorials/learning/colors)                                                       |
| 3       | INPUT auf dem Laptop                            | [Den Spieler fragen](/de/tutorials/learning/asking)                                                              |
| 4       | eine Variable `tries` und ASSIGN                | [Dinge merken](/de/tutorials/learning/variables)                                                                 |
| 5       | zwei IFs                                        | [Entscheidungen treffen](/de/tutorials/learning/decisions)                                                       |
| 6       | eine REPEAT-Schleife                            | [Schleifen mit Bedingung](/de/tutorials/learning/condition-loops)                                                |
| 7       | noch einmal COLOR und PRINT                     | [Farben und der Bildschirm](/de/tutorials/learning/colors)                                                       |

Die Schritte 3 bis 6 sind die **Spielschleife**: Sie wiederholen sich, bis der Tipp stimmt. Schritt 3 muss mindestens einmal passieren, darum passt REPEAT besser als WHILE: REPEAT führt seinen Block zuerst aus und prüft seine Bedingung am Ende.

## Das Programm

Das Programm `guess` kommt auf ein neues Blatt.

<<< @/tutorials/programs/learning/guess-the-number-guess.c0de

<!-- screenshot: guess-the-number-sheet | the whole program guess on its sheet, seen from above at the south end, with the function secretNumber at the top and the REPEAT loop of the function play below it -->

## So baust du es

Jede Zeile benutzt Blöcke, die du kennst. Bau das Programm Teil für Teil, am Plan entlang:

- Zeilen 0 bis 3: PROGRAM `guess`, NOOP, `INCLUDE c0de/math` und das NOOP für die erste Funktion.
- Zeilen 4 bis 13 (Schritt 1): die Funktion `secretNumber` mit einem RESULT `number`. Sie funktioniert wie der Würfel der letzten Lektion, mit 100 statt 6.
- Zeilen 14 bis 19: NOOP, FUNCTION `play`, BEGIN und drei INTEGER-Variablen: `secret`, `guess` und `tries`.
- Zeilen 20 und 21: CALL `secretNumber`, mit der RESULT-Zeile `number secret`: Das Ergebnis `number` kommt in die Variable `secret`.
- Zeilen 22 bis 26 (Schritt 2): den Bildschirm löschen und die Begrüßung in Gelb schreiben.
- Zeile 27: ein **REPEAT**-Block bei x=6, und in Zeile 28 sein BEGIN.
- Zeilen 29 bis 31 (Schritte 3 und 4): INPUT in `guess` und `ASSIGN tries tries + 1 ;`.
- Zeilen 32 bis 45 (Schritt 5): zwei IF-Blöcke, jeder mit eigenem BEGIN und END IF.
- Zeile 46 (Schritt 6): END bei x=6, ein REPEAT-Block, dann `guess ≠ secret ;`.
- Zeilen 47 bis 50 (Schritt 7): die grüne Meldung.
- Zeile 51: END FUNCTION.

Lass dir Zeit mit der Einrückung: Die Zeilen im REPEAT stehen einen Block weiter östlich als das REPEAT, und die Zeilen in jedem IF noch einen weiter. Die Zeilennummern sagen dir, wenn etwas nicht stimmt.

## Starten

Öffne den Laptop und klicke auf die Knöpfe Programm und Funktion, bis sie `guess` und `play` zeigen, dann auf ✔. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein und drücke den Knopf.

Der Laptop zeigt die Begrüßung, und die Eingabezeile unter dem Bildschirm fragt `INPUT guess (INTEGER):`. Tippe eine Zahl und drücke Enter. Ein Spiel kann so aussehen:

```
I am thinking of a number from 1 to 100.
50
50 is too low. Go higher!
75
75 is too low. Go higher!
90
90 is too high. Go lower!
85
85 is too low. Go higher!
89
Right! You needed 5 tries.
```

Die Zeilen, die du tippst, erscheinen auch auf dem Bildschirm. „Zu niedrig“ ist aquamarin, „zu hoch“ ist hellviolett, und die letzte Zeile ist grün.

<!-- screenshot: guess-the-number-laptop | the terminal of the laptop during a game: the yellow hello, guesses with aqua and light purple answers, and the green line "Right! You needed 5 tries." -->

Wenn du etwas tippst, das keine ganze Zahl ist, zum Beispiel `abc` oder `4.5`, antwortet der Laptop mit einer Zeile, die mit `?` beginnt, und wartet auf einen neuen Versuch. INPUT nimmt nur Werte, die zum Typ der Variablen passen.

## So funktioniert es

- **Die geheime Zahl.** RANDOM gibt eine Zahl von 0 bis unter 1. Mal 100 plus 1 wird daraus eine Zahl von 1 bis unter 101. INT rundet sie ab, also ist `number` eine ganze Zahl von 1 bis 100. Weil das eine eigene Funktion ist, braucht `play` nur eine CALL-Zeile dafür – und Schritt 1 des Plans ist ein klares Stück des Programms.
- **Die Spielschleife.** REPEAT führt seinen Block aus und prüft dann nach END REPEAT `guess ≠ secret ;`. Solange das wahr ist – der Tipp falsch ist –, führt es den Block noch einmal aus. Wenn du die Zahl findest, ist die Bedingung falsch, und der Cursor macht unter der Schleife weiter.
- **Zählen.** `tries` beginnt bei 0. Jeder Durchlauf der Schleife zählt 1 dazu, also steht nach der Schleife die Zahl der Tipps darin.
- **Zwei IFs.** Ein Tipp ist entweder zu klein, zu groß oder richtig. Das erste IF kümmert sich um „zu klein“, das zweite um „zu groß“. Wenn der Tipp stimmt, läuft keins von beiden, und die Schleife endet.
- **Farben.** Jede Meldung bekommt ihre Farbe direkt bevor sie geschrieben wird, so sieht der Spieler auf einen Blick, was passiert ist.

Der Plan hat sich gelohnt: Jeder Schritt wurde zu ein paar Zeilen, und wenn etwas schiefgeht, weißt du, welchen Teil du dir ansehen musst.

## Probier es selbst

1. Spiel mehrere Spiele hintereinander und führe einen **Rekord**: die wenigsten Versuche aller Spiele, seit du den Knopf gedrückt hast. Frag nach jedem Spiel „Play again?“ und starte ein neues Spiel, wenn der Spieler `yes` tippt.

::: details Lösung
Das Spiel wird zu einer Funktion `round`, die die Zahl der Versuche zurückgibt. `play` ruft sie in einer zweiten REPEAT-Schleife darum herum auf, hebt das beste Ergebnis in `best` auf und fragt mit einem INPUT in eine STRING-Variable, ob noch einmal gespielt wird. `best` beginnt bei 0, das heißt „noch kein Spiel“.

<<< @/tutorials/programs/learning/guess-the-number-highscore.c0de

Nach einem ersten Spiel mit 5 Versuchen und einem zweiten mit 4 zeigt der Laptop „High score: 4 tries“. Wenn du `no` tippst, endet das Programm. Der Rekord lebt nur so lange, wie das Programm läuft: Der nächste Druck auf den Knopf beginnt mit einem neuen.
:::

2. Mach das Spiel schwerer: Der Spieler hat nur 7 Versuche. Nach dem siebten falschen Tipp sagt der Laptop „No tries left.“ und verrät die geheime Zahl.

::: details Lösung
Die Schleife läuft nur weiter, solange der Tipp falsch ist **und** weniger als 7 Versuche verbraucht sind. Nach der Schleife entscheidet ein IF, ob der Spieler gewonnen hat oder keine Versuche mehr hat.

<<< @/tutorials/programs/learning/guess-the-number-limit.c0de

Mit einem klugen Plan reichen 7 Versuche immer: Rate die Mitte (50), dann die Mitte der Hälfte, die übrig ist (25 oder 75), und so weiter. Jeder Tipp halbiert die Zahlen, die übrig sind – genau wie in der Lektion übers Halbieren.
:::

## Mehr dazu

- [WHILE und REPEAT](/de/c0de/guide/language#while-und-repeat) und [IF und ELSE](/de/c0de/guide/language#if-und-else) in der Anleitung
- [Mit Spielern sprechen](/de/c0de/guide/running-programs#mit-spielern-sprechen) in der Anleitung
- [INPUT](/de/c0de/reference/functions#input), [PRINT](/de/c0de/reference/functions#print) und [COLOR](/de/c0de/reference/functions#color) im Handbuch Funktionen und der [Laptop](/de/c0de/reference/devices#laptop) im Handbuch Geräte
- [RANDOM](/de/c0de/math/random) und [INT](/de/c0de/math/int)
