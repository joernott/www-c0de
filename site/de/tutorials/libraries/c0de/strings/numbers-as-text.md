---
description: Eine Tabelle mit Gegenstandszahlen in sauberen Spalten auf einem Laptop – Zahlen, Dezimalzahlen und Daten mit FORMAT, und dieselben Zahlen hexadezimal und oktal.
---

# Zahlen als Text

Eine Lagerliste auf einem Laptop: eine Zeile pro Gegenstand mit seiner Anzahl, der Zahl der Stapel mit einer Nachkommastelle und der Anzahl hexadezimal und oktal, alles in sauberen Spalten. Darüber Datum und Uhrzeit, darunter die Summe mit Tausendertrennzeichen.

**Funktionen:** [FORMAT](/de/c0de/strings/format), [HEX](/de/c0de/strings/hex), [OCT](/de/c0de/strings/oct), [STR](/de/c0de/strings/str) und [NOW](/de/c0de/time/now) aus c0de/time

::: info Was du brauchst
Einen Auslöserblock mit Knopf und einen **Laptop** (48 Spalten). Das Programm hat keine Parameter und keine Ergebnisse.
:::

## Die Idee

`⊕` und STR machen aus einer Zahl einen Text, aber immer auf dieselbe Art: Aus `1234 / 64` wird `19.28125`, und 7 ist ein Zeichen breit, 1234 dagegen vier. Eine Tabelle braucht mehr: Jede Zahl einer Spalte muss gleich breit sein, und eine Dezimalzahl braucht eine feste Zahl von Nachkommastellen.

FORMAT erledigt das mit einem **Formatstring**, wie `printf` in anderen Sprachen. Eine Umwandlung beginnt mit `%`: `%7d` schreibt eine ganze Zahl rechtsbündig in 7 Spalten, `%8.1f` eine Dezimalzahl mit einer Nachkommastelle in 8 Spalten, `%-12s` einen beliebigen Wert linksbündig in 12 Spalten. Dieselbe Funktion formatiert Daten: `%tF` ist das Datum, `%tR` die Uhrzeit in Stunden und Minuten, `%tA` der Wochentag.

HEX und OCT schreiben eine Zahl zur Basis 16 und zur Basis 8, so wie Programmierer Farben und Bitmuster schreiben.

## Das Programm

<<< @/tutorials/programs/libraries/strings/numbers-as-text-table.c0de

## So baust und startest du es

1. Platziere den Laptop, klicke ihn mit rechts an, klicke die Knöpfe, bis sie `itemtable` und `show` zeigen, und klicke auf ✔.
2. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein und drücke den Knopf.

Am 12. November 2026 um 18:30 Uhr (in der Zeitzone des Servers) zeigt der Laptop:

```
Stock on Thursday, 2026-11-12 at 18:30
Item          Count  Stacks   Hex    Oct
cobblestone    1234    19.3   4D2   2322
diamond           7     0.1     7      7
oak_log          96     1.5    60    140
torch           320     5.0   140    500
Total         1,657
```

<!-- screenshot: numbers-as-text-laptop | the terminal of the laptop with the date, the stock table in aligned columns and the total -->

## So funktioniert es

- NOW aus c0de/time liefert die aktuelle TIME. FORMAT nimmt einen Wert, aber sein Formatstring darf ihn mehrmals verwenden: `%tA`, `%tF` und `%tR` lesen alle dieselbe Zeit.
- Die Kopfzeile ist ein einfacher Text, passend zu den Breiten der Spalten geschrieben: 12 für den Namen, 7 für die Anzahl, 8 für die Stapel, 6 und 7 für hexadezimal und oktal.
- EACH geht in alphabetischer Reihenfolge durch die Schlüssel des Hashs. Jede Spalte wird für sich formatiert und mit `⊕` an `line` gehängt.
- `%-12s` füllt den Namen rechts mit Leerzeichen auf; das Minus bedeutet „linksbündig“. `%7d` füllt die Anzahl links auf. `stock[item] / 64` ist ein FLOAT, weil `/` immer einen ergibt, und `%8.1f` rundet ihn auf eine Nachkommastelle: Aus 19.28125 wird `19.3`.
- HEX liefert für 1234 den Text `4D2` (4 × 256 + 13 × 16 + 2), mit Großbuchstaben; OCT liefert `2322`. Beide sind Texte, also richten `%6s` und `%7s` sie aus wie jeden anderen Text. Ein voller Stapel, 64, ist hexadezimal `40` und oktal `100`.
- `%,13d` schreibt die Summe mit einem Komma zwischen den Tausendern. Text im Formatstring rund um die Umwandlung, wie `Total `, wird unverändert übernommen.
- Eine Umwandlung, die nicht zum Wert passt, etwa `%d` für einen STRING, löst TYPE_MISMATCH aus; ein kaputter Formatstring löst INVALID_ARGUMENT aus.

## Probier es selbst

1. Schreib die Spalte mit der Anzahl ohne FORMAT, wie im alten BASIC: mit STR und RIGHT.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/numbers-as-text-str.c0de

STR macht aus der Anzahl einen Text, 7 Leerzeichen kommen davor, und RIGHT behält die letzten 7 Zeichen. Die Tabelle sieht genauso aus – FORMAT spart nur die beiden zusätzlichen Aufrufe.
:::

2. Schreib das Datum auf Deutsch: `Stock on 12.11.2026`.

::: details Lösung
Ändere den Formatstring in `"Stock on %td.%tm.%tY"`. `%td` ist der Tag und `%tm` der Monat, beide zweistellig, und `%tY` das Jahr mit vier Stellen.
:::

## Mehr dazu

- [c0de/strings](/de/c0de/strings/): [FORMAT](/de/c0de/strings/format), [HEX](/de/c0de/strings/hex), [OCT](/de/c0de/strings/oct), [STR](/de/c0de/strings/str)
- [FORMAT](/de/c0de/guide/libraries#format) in der Anleitung: Breiten, Nullen und Nachkommastellen
- [NOW](/de/c0de/time/now) aus c0de/time
- [EACH-Schleifen](/de/c0de/guide/language#each-schleifen): die Schlüssel eines Hashs in alphabetischer Reihenfolge
