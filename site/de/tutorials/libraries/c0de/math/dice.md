---
description: Ein Würfel mit beliebig vielen Seiten auf einem Anzeigeblock – RANDOM und INT machen aus dem Zufall ganze Zahlen, RANDOMIZE sorgt bei jedem Lauf für dieselben „Zufallszahlen“, und FIX zeigt, warum negative Zahlen INT brauchen.
---

# Würfeln

Ein Würfel für jedes Spiel: ein W6 für Brettspiele, ein W20 für Abenteuer, drei auf einmal, mit den Augenzahlen und ihrer Summe auf einem Anzeigeblock. Mit einem Startwert würfelt er bei jedem Lauf dieselben Zahlen – praktisch zum Testen und für ein Spiel, in dem alle dasselbe Glück haben sollen.

**Funktionen:** [RANDOM](/de/c0de/math/random), [RANDOMIZE](/de/c0de/math/randomize), [INT](/de/c0de/math/int) und [FIX](/de/c0de/math/fix)

::: info Was du brauchst
Einen Auslöserblock mit einem Knopf, einen **Anzeigeblock** (16 Spalten und 8 Zeilen reichen) und, wenn du magst, die **Variablenkarten** `sides`, `count` und `seed` vom Typ INTEGER und eine nicht initialisierte Variablenkarte für das Ergebnis `total`. Ohne die Karten ist der Würfel ein einzelner W6.
:::

## Die Idee

RANDOM gibt ein FLOAT von 0 bis unter 1. Ein Würfel braucht eine ganze Zahl von 1 bis `sides`, jede gleich wahrscheinlich. Mal `sides` genommen, liegt die Zahl zwischen 0 und knapp unter `sides`; plus 1 zwischen 1 und knapp unter `sides + 1`. INT rundet auf die ganze Zahl darunter ab: Bei einem W6 wird alles von 1,0 bis 1,999… zu 1, alles von 6,0 bis 6,999… zu 6. Jede der sechs Zahlen bekommt ein gleich breites Stück, also ist jede gleich wahrscheinlich.

Die Zahlen von RANDOM sind nicht wirklich zufällig: Sie werden eine nach der anderen aus einem Startwert berechnet, dem **Seed**. Jeder Prozess bekommt seinen eigenen Generator mit eigenem Seed, darum ist jeder Lauf anders. Mit RANDOMIZE setzt du den Seed selbst, und von da an würfelt der Prozess jedes Mal dieselbe Folge.

## Das Programm

<<< @/tutorials/programs/libraries/math/dice-roll.c0de

## So baust und startest du es

1. Setze den Anzeigeblock, klicke ihn mit der rechten Maustaste an, klicke die Knöpfe, bis sie `anydie` und `roll` zeigen, und klicke auf ✔.
2. Stelle den Auslöserblock auf das Programm `anydie` und die Funktion `roll` ein. Lege eine nicht initialisierte Variablenkarte für `total` in sein Eingabeinventar.
3. Drück den Knopf. Der Anzeigeblock zeigt etwa `D6: 4` und `Total: 4`; drück noch einmal für eine neue Zahl.
4. Lege jetzt die Karten `sides` = 20, `count` = 3 und `seed` = 42 dazu und drück den Knopf. Der Anzeigeblock zeigt:

```
D20: 15
D20: 4
D20: 6
Total: 25
```

Starte es noch einmal mit denselben drei Karten: dieselben drei Zahlen. Genau das prüft auch der Test dieses Programms. Lass die Karte `seed` weg, und der Würfel ist wieder zufällig.

<!-- screenshot: dice-display | a display block next to a trigger block with a button, showing "D20: 15", "D20: 4", "D20: 6" and "Total: 25" -->

## So funktioniert es

- **Vorgabewerte statt Karten.** `sides`, `count` und `seed` haben Vorgabewerte, darum startet der Auslöserblock auch ohne ihre Karten. Eine Parameterkarte, wenn es eine gibt, ersetzt den Vorgabewert.
- **In diesem Programm heißt Seed 0 „wirklich zufällig“.** RANDOMIZE läuft nur, wenn `seed` nicht 0 ist. Der Seed gilt nur für den aktuellen Prozess, er ändert also weder die Würfel anderer Programme noch den nächsten Lauf ohne die Karte.
- **`chance * sides + 1`** geht direkt in INT: Eine PARAMETER-Zeile nimmt jeden Ausdruck. Das Ergebnis `die` ist ein INTEGER, fertig für den Text.
- **Warum INT und nicht ROUND?** ROUND würde 0,0 bis 0,499… zu 0 machen – eine siebte Zahl, und 1 und 6 bekämen nur ein halbes Stück. INT gibt jeder Zahl ein ganzes Stück.

### INT oder FIX?

Beide machen aus einem FLOAT einen INTEGER. INT rundet **ab**, FIX **schneidet** die Nachkommastellen **ab**. Für positive Zahlen ist das dasselbe, der Würfel könnte also beide nehmen. Unter 0 unterscheiden sie sich: INT macht aus -0,5 eine -1, FIX eine 0.

Das zählt bei einem zufälligen Schritt nach links, nirgendwohin oder nach rechts, -1, 0 oder 1: `chance * 3 - 1` liegt zwischen -1 und knapp unter 2. Dieses Programm würfelt ihn 120-mal und zählt, wie oft jeder Schritt vorkommt, einmal mit INT und einmal mit FIX:

<<< @/tutorials/programs/libraries/math/dice-steps.c0de

Stelle einen Auslöserblock auf `randomsteps` und `compare` ein und lege zwei nicht initialisierte Karten hinein; für die 120 Würfe braucht der Cursor etwa eine Minute. Mit dem Seed 42 ist `withInt` gleich `[46, 27, 47]` und `withFix` gleich `[0, 73, 47]`. Mit INT kommen alle drei Schritte etwa gleich oft vor. FIX macht alles von -1 bis 0 zu 0, also kommt -1 nie vor und 0 ist doppelt so wahrscheinlich. Nimm INT für Zufallszahlen, die negativ sein können; FIX ist zum Abschneiden von Nachkommastellen da, etwa für einen Preis ohne Cent.

## Probier es selbst

1. Eine Schatztruhe wählt eine Belohnung aus einer Liste: Diamant, Smaragd, Goldbarren, Eisenbarren oder Brot. Zeige sie auf dem Anzeigeblock.

::: details Lösung
Derselbe Trick mit der Länge der Liste statt `sides` und ohne das `+ 1`, denn Indizes beginnen bei 0: INT macht aus `chance * count` eine Zahl von 0 bis `count - 1`.

<<< @/tutorials/programs/libraries/math/dice-pick.c0de

Mit der Karte `seed` = 42 ist die Belohnung immer `iron_ingot`.
:::

2. Warum würfelt das Programm nach `RANDOMIZE` mit 42 dieselben Zahlen, obwohl jeder Prozess seinen eigenen Zufallsgenerator hat?

::: details Lösung
Jeder Generator berechnet seine Zahlen auf dieselbe Weise; nur der Startwert ist verschieden. RANDOMIZE setzt den Startwert, also berechnen zwei Prozesse mit demselben Seed dieselbe Folge: Das erste RANDOM gibt dasselbe FLOAT, also ist der erste Würfel derselbe, und so weiter. Ein anderer Seed, etwa 7, gibt eine andere Folge – wieder bei jedem Lauf dieselbe.
:::

## Mehr dazu

- Die Handbuchseiten von [RANDOM](/de/c0de/math/random), [RANDOMIZE](/de/c0de/math/randomize), [INT](/de/c0de/math/int) und [FIX](/de/c0de/math/fix) und ganz [c0de/math](/de/c0de/math/)
- [Runden](/de/c0de/guide/libraries#runden) in der Anleitung
- [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock) und [PRINT](/de/c0de/reference/functions#print)
- [Bibliotheken benutzen](/de/tutorials/learning/libraries): der erste Würfel im Pfad „Programmieren lernen“
