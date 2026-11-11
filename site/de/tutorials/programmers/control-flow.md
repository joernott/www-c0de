---
description: IF und ELSE, die Schleifen FOR, EACH, WHILE und REPEAT, BREAK, RETURN und EXIT in c0de – mit FizzBuzz und den Primzahlen der Anleitung.
---

# Kontrollfluss

c0de hat eine Bedingung und vier Schleifen, alle aus einer Schlüsselwortzeile und einem Codeblock zwischen BEGIN und END. Sie sehen aus wie die Anweisungen von BASIC oder Pascal, aber die Einzelheiten sind anders: Es gibt kein ELSE IF, FOR schließt seinen Endwert ein, und REPEAT macht weiter, solange seine Bedingung wahr ist. Diese Lektion schreibt FizzBuzz, geht durch einen Hash und nimmt sich noch einmal die Primzahlen der Anleitung vor.

::: info Was du brauchst
Eine Kreativwelt mit erlaubten Cheats (siehe [Tutorials](/de/tutorials/)), einen **Auslöserblock**, einen **Schraubenschlüssel**, einen **Knopf**, ein paar **nicht initialisierte Variablenkarten**, eine Variablenkarte mit dem Namen `n` vom Typ INTEGER, eine mit dem Namen `limit` vom Typ INTEGER und einen **Komparator** mit einer **Redstone-Lampe**.
:::

## Die Anweisungen

| c0de                               | Python                            | Hinweise                                                      |
| ---------------------------------- | --------------------------------- | ------------------------------------------------------------- |
| `IF c ;` … `END` `ELSE` … `END IF` | `if c:` … `else:`                 | kein ELSE IF: Setze ein weiteres IF in den ELSE-Block         |
| `FOR i INTEGER 1 ; n ;`            | `for i in range(1, n + 1):`       | der Endwert ist eingeschlossen                                |
| `FOR x FLOAT 0 ; 1 ; 0.25 ;`       | –                                 | der dritte Wert ist die Schrittweite, 1, wenn du ihn weglässt |
| `EACH item list`                   | `for item in list:`               | bei einem Hash: die Schlüssel, sortiert                       |
| `WHILE c ;`                        | `while c:`                        | prüft vor dem Block                                           |
| `REPEAT` … `END REPEAT c ;`        | `while True:` … `if not c: break` | prüft nach dem Block, läuft, solange `c` **wahr** ist         |
| `BREAK` / `BREAK c ;`              | `break` / `if c: break`           | verlässt die innerste Schleife                                |
| `RETURN`                           | `return`                          | beendet die Funktion; ihre Ergebnisse behalten ihre Werte     |
| `EXIT 3 ;`                         | `sys.exit(3)`                     | beendet den ganzen Prozess mit einem Exit-Code von 0 bis 15   |

Auf jede von ihnen folgt ein Codeblock. Sein END nennt die Anweisung noch einmal: `END FOR`, `END EACH`, `END WHILE`. Nur der erste Block eines IF mit ELSE endet mit einem einzelnen `END`. Ein Codeblock darf nicht leer sein; NOOP füllt einen, der nichts zu tun hat.

## FizzBuzz

<<< @/tutorials/programs/programmers/control-flow-fizzbuzz.c0de

Stelle den Auslöserblock auf das Programm `fizzbuzz` und die Funktion `fizzbuzz` ein. Mit einer nicht initialisierten Karte ist `output` gleich `"1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz "`. Lege die Karte `n` mit einem anderen Wert hinein, um weiter zu zählen; mit 0 läuft die Schleife nicht, und `output` bleibt leer.

- Die FOR-Schleife zählt von 1 bis `n`, beide eingeschlossen. Ihr Start, Ende und ihre Schrittweite werden einmal ausgewertet, vor der ersten Runde: Wenn du `n` in der Schleife änderst, ändert das nicht, wie oft sie läuft.
- Ohne ELSE IF ist jeder weitere Fall ein IF im ELSE-Block des vorigen, jedes Mal eine Ebene tiefer. Das erste END jedes IF steht allein, das letzte ist `END IF`.
- Ein IF braucht ein BOOLEAN. `IF i \ 3 ;` würde TYPE_MISMATCH auslösen: Schreibe `IF i \ 3 = 0 ;`.

## Durch einen Hash gehen

EACH geht durch eine Kopie eines Arrays oder Hashs. Bei einem Array bekommt die Schleifenvariable die Elemente der Reihe nach; bei einem Hash bekommt sie die Schlüssel, sortiert nach ihren Unicode-Codepoints, und du liest den Wert mit dem Schlüssel als Index.

<<< @/tutorials/programs/programmers/control-flow-stock.c0de

Das Ergebnis ist `"Diamond=3 apple=12 torch=64 "`: Großbuchstaben kommen vor Kleinbuchstaben, und `coal` lässt das IF weg. Die Reihenfolge ist jedes Mal dieselbe, anders als die Reihenfolge eines `dict` oder einer `HashMap`, auf die du dich nicht verlassen solltest.

## Primzahlen, noch einmal

Die Anleitung findet die Primzahlen bis 20 mit zwei FOR-Schleifen. Diese Version nimmt die Grenze als Parameter, hört bei der Quadratwurzel mit dem Testen auf und gibt die Primzahlen als Array zurück:

<<< @/tutorials/programs/programmers/control-flow-primes.c0de

Stelle den Auslöserblock auf das Programm `primesrevisited` und die Funktion `primes` ein, lege zwei nicht initialisierte Karten hinein und drücke den Knopf. `found` ist `[2, 3, 5, 7, 11, 13, 17, 19]` und `count` ist 8. Mit einer Karte `limit` = 100 ist `count` gleich 25.

- `IF limit < 2 ;` beendet mit `EXIT 1 ;` den ganzen Prozess. Ein Komparator neben dem Auslöserblock gibt dann ein Signal der Stärke 1 aus, und die Lampe leuchtet; nach einem normalen Ende ist der Exit-Code 0. EXIT schreibt trotzdem die Ergebnisse der Einstiegsfunktion, so wie sie in diesem Moment sind: ein leeres Array und 0.
- Die innere Schleife ist ein WHILE, weil sich ihr Ende, `divisor * divisor ≤ candidate`, mit `divisor` ändert. Ein FOR würde sein Ende nur einmal auswerten.
- `BREAK NOT prime ;` ist ein BREAK mit Bedingung: Es verlässt die WHILE-Schleife nur, wenn die Bedingung wahr ist, wie `if not prime: break`.
- `VARIABLE prime BOOLEAN TRUE` steht im Codeblock der FOR-Schleife, also beginnt jede Runde mit einem neuen `prime`, das wahr ist. Variablen eines Codeblocks werden vergessen, wenn er endet.
- `ASSIGN found[count] candidate ;` hängt an: `count` ist immer die Länge des Arrays, und eine Zuweisung an den Index direkt nach dem Ende fügt ein Element hinzu.

## Unterschiede, über die du stolpern wirst

- `FOR i INTEGER 1 ; 10 ;` läuft zehnmal, einschließlich 10 – anders als `range(1, 10)`.
- `FOR i INTEGER 10 ; 1 ;` läuft gar nicht. Rückwärtszählen braucht eine negative Schrittweite: `FOR i INTEGER 10 ; 1 ; -1 ;`. Eine Schrittweite von 0 löst INVALID_LOOP_STEP aus.
- Die Schleifenvariable von FOR und EACH kann nicht geändert werden (eine rote Zeile), und nach der Schleife gibt es sie nicht mehr.
- REPEAT läuft, **solange** seine Bedingung wahr ist. Es ist nicht das REPEAT … UNTIL von Pascal und vielen BASICs: `END REPEAT i ≤ n ;` macht weiter, solange `i ≤ n` gilt.
- Es gibt kein ELSE IF, kein CONTINUE, kein BREAK mit Sprungmarke, kein switch und kein GOTO. BREAK verlässt nur die innerste Schleife.
- Wenn du ein Array oder einen Hash in einem EACH darüber änderst, ändert das die Schleife nicht: Sie geht durch eine Kopie.
- EXIT beendet den Prozess, nicht die Funktion, und nimmt nur 0 bis 15. 15 ist auch der Code eines Absturzes; ein Wert außerhalb löst INVALID_EXIT_CODE aus.

## Probier es selbst

1. Schreibe FizzBuzz mit einer REPEAT-Schleife statt FOR. Was gibt es für `n` = 0 zurück?

::: details Lösung
<<< @/tutorials/programs/programmers/control-flow-fizzbuzz-repeat.c0de

Für 15 ist das Ergebnis dasselbe wie vorher. Für 0 ist es `"1 "`: REPEAT prüft seine Bedingung erst nach der ersten Runde. Diese Version baut außerdem jedes Wort mit drei IFs, statt sie zu verschachteln: `word` ist in jeder Runde neu, also beginnt es leer.
:::

2. Füge den Primzahlen ein Ergebnis `sum` hinzu, das sie mit einer EACH-Schleife addiert.

::: details Lösung
<<< @/tutorials/programs/programmers/control-flow-primes-sum.c0de

Die Summe der Primzahlen bis 20 ist 77. Die Funktion hat jetzt drei Ergebnisse, also braucht sie drei nicht initialisierte Karten.
:::

3. Du startest die Primzahlen mit `limit` = 1. Welchen Exit-Code liest der Komparator, und welche Karten kommen heraus?

::: details Lösung
Exit-Code 1, also gibt der Komparator ein Signal der Stärke 1 aus. EXIT beendet den Prozess normal, es ist kein Absturz: Die Karte `limit` und eine nicht initialisierte Karte gehen hinein, und die Ergebniskarten `found` (ein leeres Array) und `count` (0) kommen heraus.
:::

## Mehr dazu

- [Die Sprache](/de/c0de/guide/language): [IF und ELSE](/de/c0de/guide/language#if-und-else), [FOR-Schleifen](/de/c0de/guide/language#for-schleifen), [EACH-Schleifen](/de/c0de/guide/language#each-schleifen), [WHILE und REPEAT](/de/c0de/guide/language#while-und-repeat), [BREAK](/de/c0de/guide/language#break), [RETURN](/de/c0de/guide/language#return), [EXIT](/de/c0de/guide/language#exit)
- [Anweisungen: Bedingungen](/de/c0de/reference/statements#bedingungen) und [Schleifen](/de/c0de/reference/statements#schleifen): die Blöcke und ihre Rezepte
- [Beispiele: Primzahlen](/de/c0de/guide/examples#primzahlen): das Original
- [Programme ausführen: Exit-Codes](/de/c0de/guide/running-programs#exit-codes): was der Komparator liest
