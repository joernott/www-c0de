---
description: Eine Farm, die sich jeden Tag verdoppelt – EXP berechnet das Wachstum, LOG, wie viele Tage es bis 1000 dauert, und dasselbe LOG zählt die Ziffern einer Zahl, mit einer Prüfung gegen die winzigen Fehler von FLOATs.
---

# Wachstum

Zwei Hühner, zwei Kühe, ein paar Kaninchen: Tiere, die sich vermehren, wachsen immer schneller. Wenn sich deine Farm jeden Tag verdoppelt, wie viele Tiere hast du nach einer Woche? Wie viele Tage dauert es bis 1000? Und wie viele Ziffern hat diese Zahl, damit sie auf den Anzeigeblock passt? EXP und LOG beantworten alle drei Fragen.

**Funktionen:** [EXP](/de/c0de/math/exp) und [LOG](/de/c0de/math/log), mit [ROUND](/de/c0de/math/round) und [INT](/de/c0de/math/int)

::: info Was du brauchst
Einen Auslöserblock mit einem Knopf und einen **Anzeigeblock**. Die Funktionen haben Vorgabewerte, laufen also ohne Karten. Zum Ändern: die **Variablenkarten** `start`, `days`, `goal` und `number` vom Typ INTEGER und `factor` vom Typ FLOAT, und eine nicht initialisierte Karte für das Ergebnis.
:::

## Die Idee

Eine Farm, die mit `start` Tieren beginnt und jeden Tag um den Faktor `factor` wächst, hat nach `days` Tagen `start × factor^days` Tiere. Verdoppeln heißt Faktor 2: 1, 2, 4, 8 … 128 nach einer Woche.

EXP und LOG sind die zwei Hälften dieser Potenz:

- **LOG**, der natürliche Logarithmus, macht aus Malnehmen Addieren: LOG(2) ist das Wachstum eines Tages, und `days × LOG(2)` das Wachstum aller Tage zusammen.
- **EXP** macht aus dieser Summe wieder einen Faktor: `factor^days` ist `EXP(days × LOG(factor))`. So rechnet der Computer Potenzen sowieso.

Der eigentliche Nutzen von LOG ist die Frage rückwärts: Wie viele Tage dauert es, bis die Farm `goal` Tiere hat? Die Farm muss um `goal / start` wachsen, und jeder Tag bringt LOG(`factor`) Wachstum, also dauert es `LOG(goal / start) / LOG(factor)` Tage. Mit demselben Trick zählt LOG die Ziffern einer Zahl: Eine Zahl mit 4 Ziffern ist mindestens 10³ und kleiner als 10⁴, also liegt `LOG(number) / LOG(10)` zwischen 3 und 4.

## Das Programm

<<< @/tutorials/programs/libraries/math/growth-farm.c0de

## So baust und startest du es

Binde den Anzeigeblock an das Programm `farm` und die Funktion, die du willst, und stelle den Auslöserblock auf dieselbe Funktion ein.

- **`grow`** ohne Karten: Der Anzeigeblock zeigt `Day 0: 1` bis `Day 7: 128`, und `count` ist 128.
- **`daysUntil`** ohne Karten: `days` ist 10. Nach 9 Tagen hat die Farm 512 Tiere, nach 10 sind es 1024, die erste Zahl von mindestens 1000.
- **`digits`** mit `number` = 1000: 4. Mit 999 ist es 3.

<!-- screenshot: growth-display | a display block showing the lines "Day 0: 1" to "Day 7: 128" -->

## So funktioniert es

- **LOG einmal, EXP jeden Tag.** `rate` ist LOG(`factor`), berechnet vor der Schleife. Jeden Tag gibt EXP von `day * rate` das Wachstum seit Tag 0. EXP gibt ein FLOAT wie 127.99999999999997, darum macht ROUND ganze Tiere daraus. Mit dem Operator `^` gäbe `start * factor ^ day` dieselben Zahlen.
- **Aufrunden mit INT.** Aus 9,97 Tagen müssen 10 Tage werden: Die Farm erreicht 1000 erst an Tag 10. INT rundet ab, also rundet das Programm `-9.97` auf -10 ab und dreht das Vorzeichen zurück: Das ist Aufrunden.
- **Die Prüfung nach LOG.** Ein FLOAT liegt oft ein winziges Stück daneben. LOG(1000) / LOG(10) gibt 2.9999999999999996 statt 3, und INT macht daraus 2: Ohne die Prüfung würde `digits` sagen, 1000 hat 3 Ziffern. Das IF vergleicht mit der genauen INTEGER-Potenz `10 ^ digits` und korrigiert es. `daysUntil` prüft genauso, ob ein Tag weniger schon reicht.
- **Was LOG nicht kann.** LOG nimmt nur Zahlen größer als 0: `digits` mit 0 stürzt mit INVALID_ARGUMENT ab. Ein Faktor von 1 wächst gar nicht; sein LOG ist 0, und `daysUntil` würde durch 0 teilen. Ein `goal`, das die Farm schon erreicht hat, gibt 0 Tage ganz ohne LOG.

## Probier es selbst

1. Eine Kaninchenfarm mit 10 Kaninchen wächst jeden Tag um die Hälfte (Faktor 1,5). An welchem Tag hat sie mehr als 100 Kaninchen?

::: details Lösung
Kein neues Programm: Starte `daysUntil` mit `start` = 10, `factor` = 1.5 und `goal` = 100. `days` ist 6: 10 × 1,5⁵ ist etwa 76, 10 × 1,5⁶ etwa 114. `grow` mit demselben `start` und `factor` und `days` = 6 zeigt die Kaninchen Tag für Tag.
:::

2. Entferne das IF aus `digits` und probier die Zahlen 99, 100, 999 und 1000. Welche Antworten sind falsch?

::: details Lösung
99 und 999 geben weiter 2 und 3, und 100 gibt 3, weil LOG(100) / LOG(10) zufällig genau 2.0 ist. 1000 gibt 3 statt 4: LOG(1000) / LOG(10) ist 2.9999999999999996. Ob ein FLOAT ein winziges Stück daneben liegt, sieht man vorher nicht, darum braucht eine Rechnung mit LOG, die eine genaue ganze Zahl ergeben muss, eine Prüfung mit ganzen Zahlen.
:::

## Mehr dazu

- Die Handbuchseiten von [EXP](/de/c0de/math/exp), [LOG](/de/c0de/math/log), [ROUND](/de/c0de/math/round) und [INT](/de/c0de/math/int)
- [Operatoren](/de/c0de/guide/language#operatoren): `^` für Potenzen
- [Ganze Zahlen und Brüche](/de/tutorials/libraries/c0de/math/fractions): ROUND, INT und FIX
