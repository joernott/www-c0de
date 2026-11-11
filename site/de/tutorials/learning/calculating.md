---
description: Ein Stapelrechner auf einer Anzeigewand – wie viele Stapel und einzelne Gegenstände sind 1000 Bruchstein? Ausdrücke, Operatoren und ganze Zahlen und Kommazahlen.
---

# Rechnen

Du hast 1000 Bruchstein für eine Mauer um Oak Hill. Wie viele Stapel sind das, und wie viele einzelne Gegenstände bleiben übrig? Dein Basiscomputer bekommt eine zweite Anzeigewand neben dem Lagerraum und ein neues Programm: den Stapelrechner.

::: tip Neue Wörter

- **Ausdruck**: eine Rechnung wie `items * 64 + 3`. Der Computer rechnet sie zu einem Wert aus.
- **Operator**: ein Zeichen für einen Rechenschritt, zum Beispiel `+` oder `*`.
- **Ganze Zahl** und **Kommazahl**: c0de hält sie auseinander. INTEGER enthält ganze Zahlen wie 15, FLOAT enthält Kommazahlen wie 15.625 (mit einem Punkt statt Komma geschrieben).
  :::

::: info Was du brauchst
Zwei weitere **Anzeigeblöcke**, einen weiteren **Auslöserblock** mit einem **Knopf** und ein freies Blatt. Sprachblöcke: PROGRAM, NOOP, INCLUDE, FUNCTION, BEGIN, END, VARIABLE, ASSIGN, CALL, PARAMETER, RESULT, LABEL, LITERAL, OPERATOR und INTEGER-Typblöcke.
:::

## Die Idee

Ein Stapel fasst 64 Bruchstein. Um herauszufinden, wie viele Stapel 1000 Bruchstein sind, teilst du: 1000 ÷ 64 = 15,625. Das sind 15 volle Stapel und ein bisschen. Das bisschen ist der **Rest**: 15 Stapel sind 960 Gegenstände, also bleiben 40 übrig.

Du kannst es prüfen: 15 × 64 + 40 = 1000. Dabei verwendest du schon eine Regel aus der Schule: Punkt vor Strich, erst malnehmen, dann addieren. Sonst bekämst du 15 × 104 = 1560. Willst du zuerst addieren, nimmst du Klammern: (2 + 3) × 4 = 20, aber 2 + 3 × 4 = 14.

Ein Computer rechnet genauso. Eine Rechnung in einem Programm heißt **Ausdruck**, und die Zeichen `+`, `-`, `*`, `/` sind **Operatoren**.

## Das Programm

Der Stapelrechner ist ein neues Programm auf einem neuen Blatt.

<<< @/tutorials/programs/learning/calculating-stacks.c0de

## So baust du es

Platziere den neuen Auslöserblock in deiner Basis neben dem Lagerraum und klicke ihn mit dem Schraubenschlüssel mit rechts an. Da er noch nicht eingerichtet ist, landest du vor dem nächsten freien Blatt.

- Zeile 0: PROGRAM und ein LABEL `stacks`.
- Zeile 1: NOOP.
- Zeile 2: ein INCLUDE-Block bei x=5 und ein LABEL `c0de/math`. Es gibt dem Programm die Mathe-Helfer von c0de; einen davon brauchst du weiter unten.
- Zeile 3: NOOP.
- Zeile 4: FUNCTION und ein LABEL `calculate`.
- Zeile 5: BEGIN.
- Zeilen 6 bis 9: vier VARIABLE-Zeilen bei x=6, jede mit einem LABEL und einem INTEGER-Typblock: `items` mit einem LITERAL 1000, `size` mit einem LITERAL 64, und `stacks` und `rest` ohne Startwert.
- Zeile 10: ein CALL bei x=6 und ein LABEL `c0de/math/DIV`.
- Zeilen 11 und 12: zwei PARAMETER-Zeilen bei x=7: `dividend` bekommt das LABEL `items`, `divisor` das LABEL `size`, jeweils gefolgt von einem OPERATOR `;`.
- Zeile 13: ein RESULT-Block bei x=7, ein LABEL `result` und ein LABEL `stacks`.
- Zeile 14: ein ASSIGN bei x=6, ein LABEL `rest`, ein LABEL `items`, ein OPERATOR `\`, ein LABEL `size` und ein OPERATOR `;`.
- Zeile 15: ein CALL `CLS`.
- Zeilen 16 bis 23: vier CALL-`PRINT`-Zeilen, jede mit ihrem PARAMETER `value`. Die Texte sind LITERALe vom Typ STRING, `⊕`, `/`, `*` und `+` sind OPERATORen.
- Zeile 24: END FUNCTION.

<!-- screenshot: calculating-stacks | the program "stacks" on its sheet, seen from above, with the OPERATOR blocks of lines 14 to 23 visible -->

## Starten

Baue neben dem Lagerraum eine Anzeigewand aus zwei Anzeigeblöcken. Binde sie an das Programm `stacks` und die Funktion `calculate`, und richte den Auslöserblock genauso ein. Setze einen Knopf an den Auslöserblock und drück ihn. Die Wand zeigt:

```text
1000 items
= 15.625 stacks
= 15 stacks + 40 items
Check: 1000
```

<!-- screenshot: calculating-result | the second display wall next to the storage chests showing the four lines of the stack calculator -->

## So funktioniert es

- Die Zeilen 6 bis 9 machen vier Kisten für ganze Zahlen (INTEGER): die Zahl der Gegenstände, die Größe eines Stapels und zwei Kisten für die Antworten.
- `items / size` teilt. In c0de ergibt `/` immer eine Kommazahl (FLOAT), auch wenn die Division aufgeht: 64 / 64 ist 1.0, nicht 1. Darum gibt Zeile 19 15.625 aus.
- Ein FLOAT passt nicht in eine INTEGER-Kiste: `ASSIGN stacks items / size ;` würde das Programm abstürzen lassen. Für ganze Stapel fragen die Zeilen 10 bis 13 einen Helfer: `c0de/math/DIV` teilt zwei ganze Zahlen und lässt den Teil nach dem Punkt weg. Seine PARAMETER-Zeilen geben ihm die beiden Zahlen, und seine RESULT-Zeile sagt, wohin die Antwort kommt: in `stacks`. Mehr über solche Helfer lernst du später in diesem Pfad.
- `items \ size` ist der **Rest** der Division: was übrig bleibt, wenn du so viele volle Stapel wie möglich herausnimmst. 1000 \ 64 ist 40.
- `"Check: " ⊕ stacks * size + rest` rechnet zuerst `stacks * size` (960), addiert dann `rest` (1000) und fügt erst danach die Zahl an den Text an. Wie in der Schule kommen `*` und `/` vor `+` und `-`; `⊕` kommt zuletzt.

Die Operatoren von c0de für Zahlen:

| Operator | Bedeutet                        | Beispiel        | Wert   |
| -------- | ------------------------------- | --------------- | ------ |
| `+`      | plus                            | `15 + 40`       | 55     |
| `-`      | minus                           | `1000 - 40`     | 960    |
| `*`      | mal                             | `15 * 64`       | 960    |
| `/`      | geteilt durch (immer ein FLOAT) | `1000 / 64`     | 15.625 |
| `\`      | Rest                            | `1000 \ 64`     | 40     |
| `^`      | hoch                            | `2 ^ 10`        | 1024   |
| `( )`    | das zuerst rechnen              | `( 2 + 3 ) * 4` | 20     |

## Probier es selbst

1. Enderperlen stapeln sich bis 16. Wie viele Stapel sind 100 Enderperlen?

::: details Lösung
Ändere die LITERALe in Zeile 6 auf 100 und in Zeile 7 auf 16. Die Wand zeigt „= 6.25 stacks“ und „= 6 stacks + 4 items“.

<<< @/tutorials/programs/learning/calculating-pearls.c0de
:::

2. Eine Shulkerkiste hat 27 Plätze. Wie viel Bruchstein passt in eine Shulkerkiste voller Stapel? Lass das Programm die Zahl der Gegenstände ausrechnen.

::: details Lösung
Entferne den Startwert von `items` und füge nach den VARIABLE-Zeilen `ASSIGN items 27 * size ;` ein. Die Wand zeigt „1728 items“. Auch die Probe stimmt: 27 Stapel und 0 Gegenstände. Und 1728 / 64 ist 27.0, ein FLOAT, obwohl die Division aufgeht.

<<< @/tutorials/programs/learning/calculating-shulker.c0de
:::

## Mehr dazu

- [Ausdrücke](/de/c0de/guide/language#ausdrücke) und [Operatoren](/de/c0de/guide/language#operatoren) in der Anleitung
- [Typen](/de/c0de/guide/language#typen): INTEGER und FLOAT
- [DIV](/de/c0de/math/div): ganze Zahlen teilen
- [OPERATOR](/de/c0de/reference/statements#operator) im Handbuch
