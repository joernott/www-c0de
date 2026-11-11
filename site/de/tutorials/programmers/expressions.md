---
description: Operatoren, Vorrang und Zuweisungen in c0de, verglichen mit C, Java und Python – und warum man in einem Ausdruck keine Funktion aufrufen kann.
---

# Ausdrücke und Anweisungen

c0de trennt Anweisungen und Ausdrücke streng: Eine Zeile ist eine Anweisung, ein Ausdruck ist nur ein Teil davon und endet mit `;`. Die Zuweisung ist eine eigene Anweisung, Funktionen werden mit einer eigenen Anweisung aufgerufen, und manche Operatoren sehen vertraut aus, bedeuten aber etwas anderes. Diese Lektion vergleicht die Operatoren mit C, Java und Python und zeigt, wo der Vorrang anders ist.

::: info Was du brauchst
Eine Kreativwelt mit erlaubten Cheats (siehe [Tutorials](/de/tutorials/)), einen **Auslöserblock**, einen **Schraubenschlüssel**, einen **Knopf** und elf **nicht initialisierte Variablenkarten**.
:::

## Anweisungen und Ausdrücke

- **Jede Zeile ist eine Anweisung**, und ihr erster Block ist ein Schlüsselwort: `ASSIGN`, `CALL`, `IF` … Es gibt keine Ausdrucksanweisungen: `x + 1 ;` allein in einer Zeile ist nicht gültig.
- **Ein Ausdruck endet mit `;`**, einem OPERATOR-Block. Daran erkennt c0de sein Ende, also können sich mehrere Ausdrücke eine Zeile teilen: `FOR i INTEGER 1 ; n ; 2 ;` hat drei.
- **Ein Ausdruck darf in der nächsten Zeile weitergehen**, einen Block weiter östlich als die erste Zeile der Anweisung.
- **ASSIGN ist die einzige Zuweisung.** `ASSIGN total total + 1 ;` – es gibt keine Zuweisung mit `=`, kein `+=`, kein `++`, und eine Zuweisung hat selbst keinen Wert.
- **Funktionen werden mit CALL aufgerufen, nie in einem Ausdruck.** Ein CALL führt seine Argumente als PARAMETER-Zeilen auf und die Variablen, die seine Ergebnisse bekommen, als RESULT-Zeilen; die Ergebnisse verwendest du in der nächsten Anweisung.

Das Ziel eines ASSIGN kann einen Index haben: `ASSIGN list[3] 10 ;`, `ASSIGN stock["gold"] 5 ;`, `ASSIGN spot.x 1 ;`. Eine Zuweisung an den Index direkt nach dem Ende eines Arrays hängt an, eine Zuweisung an einen neuen Schlüssel fügt ihn einem Hash hinzu.

## Die Operatoren

|                               | C / Java                       | Python           | c0de                            |
| ----------------------------- | ------------------------------ | ---------------- | ------------------------------- |
| gleich, ungleich              | `==` `!=`                      | `==` `!=`        | `=` `≠`                         |
| kleiner gleich, größer gleich | `<=` `>=`                      | `<=` `>=`        | `≤` `≥`                         |
| Division                      | `/` (ganzzahlig bei zwei ints) | `/`              | `/` (immer FLOAT)               |
| ganzzahlige Division          | `/`                            | `//`             | `c0de/math/DIV` (eine Funktion) |
| Rest                          | `%`                            | `%`              | `\`                             |
| Potenz                        | `Math.pow`, `pow`              | `**`             | `^`                             |
| Text verbinden                | `+`                            | `+`              | `⊕`                             |
| Logik                         | `&&` `\|\|` `!`                | `and` `or` `not` | `AND` `OR` `NOT` und `XOR`      |
| Bits                          | `&` `\|` `^` `~`               | `&` `\|` `^` `~` | `&` `\|` `⊻` `¬`                |
| Verschieben                   | `<<` `>>`                      | `<<` `>>`        | `←` `→`                         |
| Zuweisung                     | `=`                            | `=`              | die Anweisung ASSIGN            |

Der Vorrang, vom höchsten zum niedrigsten:

1. `( )`
2. `¬`
3. `NOT`
4. `^` (von rechts nach links: `2 ^ 3 ^ 2` ist `2 ^ 9`)
5. unäres `-`
6. `*` `/`
7. `\`
8. `+` `-`
9. `←` `→`
10. `⊕`
11. `=` `≠` `<` `>` `≤` `≥`
12. `&`
13. `⊻`
14. `|`
15. `AND`
16. `XOR`
17. `OR`

Das meiste ist wie in C. An vier Stellen nicht: `\` bindet schwächer als `*`, `⊕` schwächer als `+`, `NOT` stärker als die Vergleiche, und die Bitoperatoren schwächer als die Vergleiche (wie in C, aber nicht wie in Python).

## Das Programm

Eine Funktion, deren Ergebnisse je eine Regel zeigen:

<<< @/tutorials/programs/programmers/expressions-operators.c0de

## Starten

Stelle den Auslöserblock auf das Programm `operators` und die Funktion `operators` ein, lege elf nicht initialisierte Variablenkarten in sein Eingabeinventar und drücke den Knopf. Klicke mit rechts auf die Ergebniskarten, um sie zu lesen:

| Ergebnis  | Ausdruck                     | Wert       | Warum                                                                                 |
| --------- | ---------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| remainder | `-7 \ 2`                     | -1         | der Rest hat das Vorzeichen des Dividenden, wie in C und Java (Python: 1)             |
| power     | `2 ^ 3 ^ 2`                  | 512        | `^` wird von rechts nach links ausgewertet                                            |
| half      | `2 ^ -1`                     | 0.5        | ein negativer Exponent ergibt ein FLOAT                                               |
| order     | `7 \ 4 * 2`                  | 7          | `*` vor `\`: `7 \ 8` (C und Python: 6)                                                |
| joined    | `"Total: " ⊕ 2 + 3`          | "Total: 5" | `+` vor `⊕` (Python, JavaScript: "Total: 23" oder ein Fehler)                         |
| same      | `"a" ⊕ 1 = "a1"`             | true       | `⊕` vor `=`                                                                           |
| before    | `"Z" < "a"`                  | true       | Text wird nach Unicode-Codepoints verglichen                                          |
| flags     | `1 ← 4 \| 12 & 10`           | 24         | zuerst `←`, dann `&`, dann `\|`: `16 \| 8`                                            |
| inverted  | `¬ 0`                        | -1         | bitweise Negation einer 64-Bit-Ganzzahl                                               |
| safe      | `zero ≠ 0 AND 10 / zero > 1` | false      | AND hört nach einer falschen linken Seite auf, also gibt es keine Division durch null |
| total     | `1 + 2 + 3` … `+ 4 + 5`      | 15         | der Ausdruck geht in der nächsten Zeile weiter                                        |

## Ganzzahl- und Gleitkommarechnung

Der Typ eines Ergebnisses folgt aus den Typen der Operanden: Zwei INTEGER ergeben einen INTEGER, ein FLOAT auf einer der beiden Seiten ergibt ein FLOAT. Zwei Operatoren brechen diese Regel: `/` ergibt immer ein FLOAT, und `^` ergibt bei einem negativen Exponenten ein FLOAT. `\` nimmt nur INTEGER.

<<< @/tutorials/programs/programmers/expressions-numbers.c0de

| `a`, `b` | quotient                     | whole (DIV) | floor (INT) | rest | check | exact |
| -------- | ---------------------------- | ----------- | ----------- | ---- | ----- | ----- |
| 7, 2     | 3.5                          | 3           | 3           | 1    | true  | false |
| -7, 2    | -3.5                         | -3          | -4          | -1   | true  | false |
| 7, 0     | DIVISION_BY_ZERO in Zeile 14 |             |             |      |       |       |

- DIV und `\` gehören zusammen wie `/` und `%` in C und Java: Sie runden in Richtung null, und `whole * b + rest = a` ist immer wahr. Pythons `//` und `%` runden stattdessen ab; das macht INT des Quotienten.
- DIV ist eine Funktion von `c0de/math`, also braucht es ein CALL und eine Variable für sein Ergebnis. Dasselbe gilt für INT: Ein Ausdruck kann nur Werte verknüpfen, die schon da sind.
- `0.1 + 0.2 = 0.3` ist falsch, wie überall mit binären Gleitkommazahlen.
- Mit `b` = 0 löst schon die erste Zeile DIVISION_BY_ZERO aus: `/` gibt kein `Infinity` zurück, auch nicht bei FLOATs.

## Unterschiede, über die du stolpern wirst

- `=` vergleicht. `ASSIGN a b = c ;` speichert in `a`, ob `b` gleich `c` ist.
- `^` ist die Potenz, nicht das bitweise XOR von C, Java und Python. Das ist `⊻`.
- `7 \ 4 * 2` ist 7, nicht 6: `\` bindet schwächer als `*` und `/`.
- `NOT a = b` ist `( NOT a ) = b`, bei Zahlen ein TYPE_MISMATCH. Schreibe `a ≠ b` oder `NOT ( a = b )`.
- `flags & 4 = 4` ist `flags & ( 4 = 4 )`, ein TYPE_MISMATCH. Setze Klammern um Bitoperationen: `( flags & 4 ) = 4`.
- `/` von zwei INTEGER ergibt ein FLOAT, und ein FLOAT kann keinem INTEGER zugewiesen werden. Verwende DIV oder INT, FIX oder ROUND.
- Es gibt kein „truthy“: Ein IF braucht ein BOOLEAN, `IF count ;` ist ein TYPE_MISMATCH. INTEGER und FLOAT lassen sich miteinander vergleichen, andere unterschiedliche Typen nicht.
- Ein Index ist ein Literal oder eine Variable, kein Ausdruck: Es gibt kein `list[i + 1]`. Berechne den Index zuerst in eine Variable.
- Beim Verschieben zählen nur die untersten 6 Bits der Anzahl, wie in Java: `1 ← 64` ist 1.

## Probier es selbst

1. Schreibe eine Funktion `modulo`, die einen Rest zurückgibt, der bei positivem `b` nie negativ ist, wie Pythons `%`: `-7` und `2` ergeben 1.

::: details Lösung
<<< @/tutorials/programs/programmers/expressions-modulo.c0de

`-7 \ 2` ist -1, plus 2 ist 1, und `1 \ 2` ist 1. Für `-9` und `4` ist das Ergebnis 3; bei positiven Zahlen ändert sich nichts.
:::

2. Was ist `NOT 1 = 2 ;`, und wie schreibst du, was gemeint war?

::: details Lösung
NOT bindet stärker als `=`, also versucht c0de zuerst `NOT 1` und löst TYPE_MISMATCH aus. Schreibe `1 ≠ 2 ;` oder `NOT ( 1 = 2 ) ;`, die beide wahr sind.
:::

## Mehr dazu

- [Die Sprache: Ausdrücke](/de/c0de/guide/language#ausdrücke), [Operatoren](/de/c0de/guide/language#operatoren) und [ASSIGN](/de/c0de/guide/language#assign)
- [Anweisungen: ASSIGN](/de/c0de/reference/statements#assign) und [OPERATOR](/de/c0de/reference/statements#operator): die Blöcke und wie du ihr Symbol einstellst
- [DIV](/de/c0de/math/div), [INT](/de/c0de/math/int), [FIX](/de/c0de/math/fix), [ROUND](/de/c0de/math/round): ganze Zahlen aus Divisionen
