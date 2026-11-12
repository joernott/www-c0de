---
description: Die Gegenstände einer Truhe gerecht unter Spielern aufteilen, mit DIV und dem Rest, der Durchschnitt einer Liste mit TO_FLOAT und ROUND, und wie sich ROUND, INT und FIX bei negativen Zahlen unterscheiden.
---

# Ganze Zahlen und Brüche

Drei Spieler haben eine Truhe mit 100 Diamanten gefunden. Wie viele bekommt jeder, und wie viele bleiben übrig? Wie viele Gegenstände liegen im Durchschnitt in deinen Truhen? Die erste Frage beantworten ganze Zahlen, die zweite FLOATs – und beim Umwandeln der einen in die anderen warten die Überraschungen.

**Funktionen:** [DIV](/de/c0de/math/div), [ROUND](/de/c0de/math/round), [TO_FLOAT](/de/c0de/math/to_float), [INT](/de/c0de/math/int) und [FIX](/de/c0de/math/fix)

::: info Was du brauchst
Einen Auslöserblock mit einem Knopf und einen **Anzeigeblock**. Für `share` die **Variablenkarten** `items` und `players` vom Typ INTEGER und zwei nicht initialisierte Karten; für `average` eine Variablenkarte `counts` vom Typ ARRAY INTEGER und zwei nicht initialisierte Karten; für `compare` eine Variablenkarte `value` vom Typ FLOAT und drei nicht initialisierte Karten.
:::

## Die Idee

c0de hat zwei Arten von Zahlen. Ein INTEGER zählt Dinge, die man nicht teilen kann, wie Diamanten. Ein FLOAT misst Dinge, die man teilen kann, wie einen Durchschnitt. Der Operator `/` gibt immer ein FLOAT: 100 / 3 ist 33,333…. Zum Aufteilen von Gegenständen brauchst du stattdessen die ganzzahlige Antwort, und das ist DIV: 100 DIV 3 ist 33. Der Operator `\` gibt den Rest, 1.

In die andere Richtung wird ein FLOAT auf eine von drei Arten zum INTEGER, und die stimmen nur für positive Zahlen ohne ,5 überein:

| Wert   | ROUND (nächste) | INT (ab) | FIX (abgeschnitten) |
| ------ | --------------- | -------- | ------------------- |
| 2.5    | 2               | 2        | 2                   |
| -2.5   | -2              | -3       | -2                  |
| -12.85 | -13             | -13      | -12                 |

ROUND schickt ein ,5 zum geraden Nachbarn, also wird 2,5 zu 2 und 3,5 zu 4. Über viele Zahlen rundet das so oft auf wie ab.

## Das Programm

<<< @/tutorials/programs/libraries/math/fractions-share.c0de

## So baust und startest du es

Binde den Anzeigeblock an das Programm `fairshare` und die Funktion, die du ausprobieren willst, und stelle den Auslöserblock auf dieselbe Funktion ein.

- **`share`**: Mit `items` = 100 und `players` = 3 sind die Ergebnisse `each` = 33 und `rest` = 1, und der Anzeigeblock zeigt `3 players get 33 each, 1 left`.
- **`average`**: Mit `counts` = `[12, 7, 9, 3]` sind die Ergebnisse `exact` = 7.75 und `rounded` = 8, und der Anzeigeblock zeigt `4 chests, average 7.75, about 8`. Eine leere Liste gibt 0.0 und 0.
- **`compare`**: Mit `value` = -12.85 sind die Ergebnisse `rounded` = -13, `down` = -13 und `cut` = -12. Probier auch 2.5 und -2.5.

Mit `players` = 0 stürzt `share` mit DIVISION_BY_ZERO ab: Mit niemandem kann man nicht teilen. Dasselbe passiert mit `/` und `\`.

## So funktioniert es

- **DIV rundet in Richtung 0.** Für positive Zahlen ist das die Zahl der vollen Anteile. `rest` ist, was `\` übrig lässt, also ist `each * players + rest` immer wieder `items`.
- **TO_FLOAT macht die Summe zum FLOAT.** `sum` zählt Gegenstände, ist also ein INTEGER. Genau genommen würde `/` ihn selbst zum FLOAT machen, und ein ASSIGN an eine FLOAT-Variable auch; TO_FLOAT sagt es ausdrücklich. Es zählt dort, wo c0de nicht umwandelt: `⊕` schreibt den INTEGER 31 als `31`, das FLOAT als `31.0`.
- **Die leere Liste.** Ohne das IF würde `total / size` durch 0 teilen. RETURN verlässt die Funktion mit den Vorgabewerten ihrer Ergebnisse, 0.0 und 0.
- **ROUND für „ungefähr“.** `rounded` ist die nächste ganze Zahl von Gegenständen. Bei einem Durchschnitt von 7,5 wäre das 8, bei 6,5 wäre es 6 – der gerade Nachbar.

## Probier es selbst

1. 100 Diamanten für 3 Spieler lassen 1 übrig. Gib den Rest den ersten Spielern, je einen, sodass nichts übrig bleibt: 34, 33 und 33.

::: details Lösung
Eine FOR-Schleife gibt allen `each` und den ersten `rest` Spielern einen mehr. Mit 30 Gegenständen für 4 Spieler ist `shares` gleich `[8, 8, 7, 7]`.

<<< @/tutorials/programs/libraries/math/fractions-split.c0de

:::

2. Ein gemeinsames Konto hat 7 Smaragde Schulden: -7. Die Schulden mit DIV zu halbieren gibt -3, aber INT von -7 / 2 gibt -4. Was ist richtig?

::: details Lösung
Beides, für verschiedene Fragen. -7 / 2 ist -3,5. DIV rundet in Richtung 0 wie FIX, sagt also „jeder von zwei Spielern schuldet 3 ganze Smaragde, und 1 bleibt übrig“. INT rundet ab, sagt also „die Schulden von jedem, zur schlechteren Seite gerundet, sind 4“. Zum Zählen von Gegenständen gehören DIV und `\` zusammen: `-3 * 2 + -1` ist wieder -7.
:::

## Mehr dazu

- Die Handbuchseiten von [DIV](/de/c0de/math/div), [ROUND](/de/c0de/math/round), [TO_FLOAT](/de/c0de/math/to_float), [INT](/de/c0de/math/int) und [FIX](/de/c0de/math/fix)
- [Runden](/de/c0de/guide/libraries#runden) in der Anleitung
- [Operatoren](/de/c0de/guide/language#operatoren) und [Ausdrücke](/de/c0de/guide/language#ausdrücke): `/` und `\`
- [Ausdrücke und Anweisungen](/de/tutorials/programmers/expressions) im Pfad „c0de für Programmierer“
