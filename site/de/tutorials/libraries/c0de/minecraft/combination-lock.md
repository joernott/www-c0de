---
description: Vier Hebel und ein Knopf, die eine Eisentür nur in der richtigen Kombination öffnen – das Programm liest die Hebel mit GET_LEVER, stellt sie mit SET_LEVER zurück, beobachtet den Knopf mit GET_BUTTON und öffnet die Tür mit PRESS_BUTTON.
---

# Ein Kombinationsschloss

Vor dem Eingang liegen vier Hebel. Stell sie auf die geheime Kombination und drück den Knopf daneben, dann geht die Eisentür auf. Egal was du eingestellt hast, die Hebel springen danach zurück, so kann niemand die Kombination an ihnen ablesen. Das Programm öffnet die Tür wie ein Spieler: Es drückt einen Knopf auf der Innenseite.

**Funktionen:** [GET_LEVER](/de/c0de/minecraft/get_lever), [SET_LEVER](/de/c0de/minecraft/set_lever), [GET_BUTTON](/de/c0de/minecraft/get_button), [PRESS_BUTTON](/de/c0de/minecraft/press_button) und [SLEEP](/de/c0de/time/sleep) aus c0de/time

::: info Was du brauchst

- einen **Zeitgeberblock** und ein leeres Blatt
- vier **Hebel** und zwei **Steinknöpfe**
- eine **Eisentür** in der Wand deiner Basis
- keine Rechte: Hebel und Knöpfe darf jeder Spieler benutzen, darum funktioniert das Schloss für jeden Besitzer

:::

## Die Idee

Ein Schloss hat zwei Teile: die **Prüfung** (ist das die richtige Kombination?) und die **Mechanik** (die Hebel lesen, die Tür öffnen, alles zurückstellen). Die Prüfung ist reine Rechnerei: Sie braucht keine Welt, also kannst du sie für sich schreiben und testen. Die Mechanik sind ein paar Aufrufe von c0de/minecraft drumherum.

Die Eisentür lässt sich nicht mit der Hand öffnen, und ein Programm darf sie mit SET_OPEN nur öffnen, wenn sein Besitzer das Recht `allowBlockChanges` hat. Aber ein Knopf neben der Tür öffnet sie mit Redstone, und PRESS_BUTTON drückt einen Knopf, wie ein Spieler es tun würde. Das braucht überhaupt keine Rechte.

## Die Prüfung

Das Geheimnis ist ein Array aus vier Wahrheitswerten: an, aus, an, an. `matches` vergleicht die Hebel damit, einen nach dem anderen.

<<< @/tutorials/programs/libraries/minecraft/combination-lock-check.c0de

Der Programm-Runner (oder im Spiel ein Debug-Auslöserblock) führt `matches` mit den Hebeln `[TRUE, FALSE, TRUE, TRUE]` aus und bekommt `TRUE`; sind alle vier an, bekommt er `FALSE`.

## Das Schloss

Das Programm `combolock` fügt die Mechanik hinzu. Die Prüfung ist dieselbe.

<<< @/tutorials/programs/libraries/minecraft/combination-lock-lock.c0de

## Aufbauen und starten

Hier kommt es auf die Positionen an: Das Programm findet die Hebel und Knöpfe über ihren Abstand zum Zeitgeberblock. Stell dich südlich vom Platz für den Zeitgeberblock hin und schau nach Norden; Osten ist rechts von dir.

| Was                    | Wo, vom Zeitgeberblock aus gesehen                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| der Zeitgeberblock     | auf dem Boden, 3 Blöcke südlich der Wand mit der Tür                                     |
| die vier Hebel         | auf dem Boden, 2, 3, 4 und 5 Blöcke östlich, in einer Reihe                              |
| der Eingabeknopf       | auf dem Boden, 7 Blöcke östlich                                                          |
| die Eisentür           | in der Wand, 4 Blöcke östlich und 3 Blöcke nördlich                                      |
| der Knopf für die Tür  | innen, an der Wand neben der Tür: 3 Blöcke östlich, 1 Block hoch, 4 Blöcke nördlich      |

Die Hebel und der Eingabeknopf halten einen Block Abstand zum Zeitgeberblock: Ein Redstone-Signal direkt daneben würde ihn pausieren. Mit dem Knopf innen kommst du auch wieder hinaus.

<!-- screenshot: combination-lock-levers | the four levers on the ground in front of the base, two of them on, the stone button at the end of the row, the timer block on the left and the closed iron door behind them -->

Stelle den Zeitgeberblock auf das Programm `combolock`, die Funktion `watch` und einen Abstand von 5 Ticks ein. Stell die Hebel auf an, aus, an, an – der erste Hebel ist der, der dem Zeitgeberblock am nächsten liegt – und drück den Eingabeknopf. Die Tür geht kurz auf, und alle Hebel springen auf aus. Probier eine falsche Kombination: Der Chat sagt `Wrong combination.`, und die Hebel springen auch zurück.

## So funktioniert es

- **Positionen.** `near` macht aus einem Abstand vom Zeitgeberblock eine `c0de/minecraft/POSITION`: `PID.x`, `PID.y` und `PID.z` sind die Position des Zeitgeberblocks. So funktioniert das Programm auch, wenn du das Schloss woanders baust, solange die Abstände gleich bleiben.
- **GET_BUTTON** sagt, ob der Eingabeknopf gerade gedrückt ist. Die meisten Durchläufe des Zeitgeberblocks finden ihn nicht gedrückt und enden sofort mit RETURN.
- **GET_LEVER und SET_LEVER.** Die FOR-Schleife liest Hebel `i` in `levers[i]` und schaltet ihn sofort aus. Das Array wächst in jeder Runde um ein Element.
- **PRESS_BUTTON** drückt den Knopf in der Wand. Der Knopf gibt etwa eine Sekunde lang einen Redstone-Impuls, und die Tür geht von selbst auf und wieder zu.
- **Auf den Knopf warten.** Ein Steinknopf bleibt 20 Ticks gedrückt. Ohne die WHILE-Schleife am Ende würde der nächste Durchlauf des Zeitgeberblocks ihn noch gedrückt finden, die Hebel lesen – inzwischen alle aus – und eine falsche Kombination melden. Darum wartet der Durchlauf mit SLEEP und GET_BUTTON, bis der Knopf losgelassen ist.

## Probier es selbst

1. Ein Übungsschloss: Schreib eine Funktion `rightLevers`, die zählt, wie viele Hebel richtig stehen, damit das Schloss `2 of 4 levers are right.` sagen kann.

::: details Lösung
<<< @/tutorials/programs/libraries/minecraft/combination-lock-hint.c0de

Mit den Hebeln aus, aus, an, aus stimmen zwei mit dem Geheimnis überein. Füg die Funktion in `combolock` unter `matches` ein, ruf sie im ELSE-Block mit `RESULT result hits` in eine neue INTEGER-Variable `hits` auf und sag mit SAY `hits ⊕ " of 4 levers are right."` statt der einfachen Meldung. Ein echtes Schloss sollte das natürlich nicht tun: Es verrät die Kombination nach ein paar Versuchen.
:::

2. Mach das Raten langsamer: Nach einer falschen Kombination soll das Schloss den Knopf zehn Sekunden lang nicht beachten.

::: details Lösung
Füg im ELSE-Block nach dem SAY `CALL c0de/time/SLEEP` mit `PARAMETER ticks 200 ;` ein. Solange der Durchlauf schläft, startet der Zeitgeberblock keinen neuen, also tut der Knopf zehn Sekunden lang nichts.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [GET_LEVER](/de/c0de/minecraft/get_lever), [SET_LEVER](/de/c0de/minecraft/set_lever), [GET_BUTTON](/de/c0de/minecraft/get_button), [PRESS_BUTTON](/de/c0de/minecraft/press_button) und [SLEEP](/de/c0de/time/sleep)
- [Drei Auslöserblöcke](/de/c0de/guide/running-programs#drei-auslöserblöcke) in der Anleitung und der [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock) im Handbuch Auslöser
- [Strukturen](/de/c0de/guide/language#strukturen) in der Anleitung: `PID` und die Elemente einer Struktur
- [WHILE und REPEAT](/de/c0de/guide/language#while-und-repeat) in der Anleitung
