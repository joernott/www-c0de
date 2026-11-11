---
description: Ein Knopf würfelt und sagt das Ergebnis im Chat an, mit einem Klang – dein erstes Programm, das Funktionen aus Bibliotheken benutzt.
---

# Bibliotheken benutzen

Für Spieleabende in Oak Hill brauchst du einen Würfel. Du könntest einen aus Holz schnitzen – oder den Computer würfeln lassen. Ein Computer kann zwar nichts werfen, aber er kann eine Zahl zufällig auswählen. Das musst du nicht selbst schreiben: c0de bringt fertige Funktionen dafür mit, und auch fürs Abspielen von Klängen und fürs Schreiben in den Chat.

::: tip Neue Wörter

- **Bibliothek**: eine Sammlung fertiger Funktionen, die jemand anderes geschrieben hat, damit du es nicht musst.
- **INCLUDE**: die Zeile, die eine Bibliothek in dein Programm lädt.
- **Zufallszahl**: eine Zahl, die zufällig ausgewählt wird, jedes Mal eine andere.

:::

::: info Was du brauchst

- ein neues, leeres Blatt in der c0de-Dimension und den Schraubenschlüssel
- einen **Auslöserblock** mit einem Knopf darauf, in deiner Basis
- die Blöcke, die du kennst (PROGRAM, NOOP, FUNCTION, BEGIN, END, VARIABLE, CALL, PARAMETER, RESULT, LABEL, LITERAL, OPERATOR, die Typblöcke INTEGER und FLOAT) und den neuen: einen **INCLUDE**-Block

:::

## Die Idee

Wenn du in Minecraft ein Haus baust, brennst du nicht jedes Mal zuerst deine eigenen Ziegel aus Ton. Du nimmst die Ziegel fertig aus einer Truhe. Programmierer machen es genauso: Dinge, die viele Programme brauchen – Rechnen, Arbeiten mit Text, die Uhr –, werden einmal geschrieben und in eine **Bibliothek** gelegt. Dein Programm sagt nur, welche Bibliothek es haben möchte, und dann kann es ihre Funktionen aufrufen.

c0de hat vier Bibliotheken:

| Bibliothek       | Was ihre Funktionen tun                                                     |
| ---------------- | --------------------------------------------------------------------------- |
| `c0de/math`      | Rechnen, Runden und Zufallszahlen                                           |
| `c0de/strings`   | Arbeiten mit Text                                                           |
| `c0de/time`      | die Uhr und der Kalender der echten Welt                                    |
| `c0de/minecraft` | die Welt rund um den Auslöserblock: Klänge, der Chat, Hebel, Türen und mehr |

Eine Bibliotheksfunktion hat einen langen Namen: die Bibliothek, einen Schrägstrich und die Funktion, zum Beispiel `c0de/math/RANDOM`. So können zwei Bibliotheken eine Funktion mit demselben Namen haben, ohne dass sie verwechselt werden.

## Das Programm

Das Programm `dice` kommt auf ein neues Blatt.

<<< @/tutorials/programs/learning/libraries-dice.c0de

<!-- screenshot: libraries-dice-sheet | the program dice on its sheet, seen from the south, with the two INCLUDE lines at the top and all line numbers dark green -->

## So baust du es

- Zeile 0: PROGRAM `dice`.
- Zeile 1: NOOP. Jedes Programm braucht es hier.
- Zeilen 2 und 3: ein **INCLUDE**-Block bei x=5 und ein LABEL. Klicke das LABEL mit leerer Hand mit rechts an: Sein Dialog zeigt alle Bibliotheken. Wähle `c0de/math` in Zeile 2 und `c0de/minecraft` in Zeile 3. INCLUDE-Zeilen kommen immer direkt nach dem NOOP in Zeile 1.
- Zeile 4: NOOP, weil eine FUNCTION direkt über sich eine NOOP-Zeile braucht.
- Zeilen 5 bis 8: FUNCTION `roll`, BEGIN und zwei Variablen: `chance` (FLOAT) für die Zufallszahl und `die` (INTEGER) für die Augenzahl des Würfels.
- Zeilen 9 und 10: ein CALL-Block bei x=6 mit einem LABEL `c0de/math/RANDOM`. In der nächsten Zeile, einen Block weiter östlich, ein RESULT-Block, ein LABEL `result` und ein LABEL `chance`.
- Zeilen 11 bis 13: CALL `c0de/math/INT`, mit einer PARAMETER-Zeile `value chance * 6 + 1 ;` und einer RESULT-Zeile `result die`.
- Zeilen 14 bis 16: CALL `c0de/minecraft/SOUND` mit zwei PARAMETER-Zeilen: `note 12 ;` und `instrument "bell" ;`.
- Zeilen 17 und 18: CALL `c0de/minecraft/SAY` mit einer PARAMETER-Zeile `message "You rolled a " ⊕ die ;`.
- Zeile 19: END FUNCTION.

## Starten

Verlasse die Dimension. Stelle den Auslöserblock auf das Programm `dice` und die Funktion `roll` ein. Der Würfel braucht keine Variablenkarten: Er hat keine Parameter und keine Ergebnisse. Drücke den Knopf.

Du hörst eine Glocke am Auslöserblock, und der Chat zeigt etwas wie:

```
[dice/0] You rolled a 4
```

Drücke den Knopf noch einmal und noch einmal. Die Zahlen ändern sich: 2, 6, 1, 4 … Jede Zahl von 1 bis 6 kommt vor, und keine ist wahrscheinlicher als die anderen.

<!-- screenshot: libraries-dice-chat | the player in the base pressing the button on the trigger block, the chat showing three lines like "[dice/0] You rolled a 4" -->

Den Anfang der Nachricht, `[dice/0]`, fügt SAY hinzu: den Namen des Programms und die Nummer seines Prozesses. So sieht jeder, welches Programm spricht. Alle Spieler im Umkreis von 64 Blöcken um den Auslöserblock bekommen die Nachricht.

## So funktioniert es

- `INCLUDE c0de/math` und `INCLUDE c0de/minecraft` laden die beiden Bibliotheken. Ohne die INCLUDE-Zeile kennt c0de die Funktionen nicht, und die CALL-Zeile wird rot.
- `CALL c0de/math/RANDOM` gibt eine zufällige Kommazahl von 0 bis unter 1 zurück, zum Beispiel 0.0, 0.3527 oder 0.9991 – aber nie 1. Eine Funktion mit einem Ergebnis nennt es `result`, also bedeutet die RESULT-Zeile `result chance`: Leg das Ergebnis in meine Variable `chance`.
- `chance * 6 + 1` macht daraus eine Zahl von 1 bis unter 7, zum Beispiel 1.0, 3.116 oder 6.9946.
- `CALL c0de/math/INT` rundet eine Zahl auf eine ganze Zahl ab: 3.116 wird 3, und 6.9946 wird 6. Also ist `die` immer 1, 2, 3, 4, 5 oder 6.
- `CALL c0de/minecraft/SOUND` spielt einen Ton wie ein Notenblock: `note` geht von 0 bis 24, wie die Klicks auf einem Notenblock, und `instrument` ist der Klang, zum Beispiel `harp`, `bass`, `bell` oder `flute`.
- `CALL c0de/minecraft/SAY` schreibt seine `message` in den Chat.

Du rufst eine Bibliotheksfunktion genauso auf wie deine eigenen Funktionen: CALL, der Name, PARAMETER-Zeilen für das, was hineingeht, RESULT-Zeilen für das, was herauskommt. Welche Parameter und Ergebnisse eine Funktion hat, schlägst du im Handbuch Funktionen nach – die Links stehen unten.

## Probier es selbst

1. Viele Spiele brauchen zwei Würfel. Würfle zwei und sag beide Zahlen und ihre Summe an, zum Beispiel „You rolled 3 and 5: 8“.

::: details Lösung
Rufe RANDOM und INT zweimal auf, einmal für jeden Würfel. Die Klammern um `first + second` sorgen dafür, dass die beiden Zahlen addiert werden, bevor sie an den Text gehängt werden.

<<< @/tutorials/programs/learning/libraries-two-dice.c0de
:::

2. Eine Sechs ist etwas Besonderes. Spiel für eine Sechs einen anderen Klang: die Flöte bei Ton 24.

::: details Lösung
Ein IF entscheidet, welches SOUND gespielt wird. Alles andere bleibt gleich.

<<< @/tutorials/programs/learning/libraries-six.c0de
:::

## Mehr dazu

- [Bibliotheken](/de/c0de/guide/libraries) in der Anleitung, mit [Bibliotheken einbinden](/de/c0de/guide/libraries#bibliotheken-einbinden) und [Musik machen](/de/c0de/guide/libraries#musik-machen)
- [INCLUDE](/de/c0de/reference/statements#include) im Handbuch Anweisungen
- Die Funktionen dieser Lektion: [RANDOM](/de/c0de/math/random), [INT](/de/c0de/math/int), [SOUND](/de/c0de/minecraft/sound) und [SAY](/de/c0de/minecraft/say)
- Alle Funktionen einer Bibliothek: [c0de/math](/de/c0de/math/) und [c0de/minecraft](/de/c0de/minecraft/)
