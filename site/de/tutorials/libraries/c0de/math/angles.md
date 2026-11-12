---
description: Wie hoch kommt eine Rampe von 10 Blöcken bei 30 Grad, und wie steil ist ein Hang, den du schon gebaut hast? TAN macht aus einem Winkel eine Steigung, ATN aus einer Steigung wieder einen Winkel.
---

# Winkel und Rampen

Eine Rampe hinauf zu deiner Burg, eine Rutsche einen Berg hinab, ein Dach: Du weißt, wie lang es sein und wie steil es aussehen soll, aber wie viele Blöcke hoch geht es? Und umgekehrt: Wie steil ist der Hügel hinter deinem Haus? Zwei Funktionen beantworten das, TAN und ihr Gegenstück ATN.

**Funktionen:** [TAN](/de/c0de/math/tan) und [ATN](/de/c0de/math/atn), mit [ROUND](/de/c0de/math/round) und der Konstante `c0de/math/PI`

::: info Was du brauchst
Einen Auslöserblock mit einem Knopf und einen **Anzeigeblock**. Für `height` die **Variablenkarten** `length` vom Typ INTEGER und `degrees` vom Typ FLOAT (wahlweise: Die Vorgabewerte sind 10 Blöcke und 30 Grad) und zwei nicht initialisierte Karten; für `slope` die Variablenkarten `run` und `rise` vom Typ INTEGER und eine nicht initialisierte Karte.
:::

## Die Idee

Wie steil eine Rampe ist, sagt ihre **Steigung**: wie viele Blöcke sie pro Block nach vorn steigt. Treppen steigen 1 pro 1, eine Rampe aus Stufen 1 pro 2. Der Tangens des Winkels ist genau diese Steigung:

- **TAN** macht aus einem Winkel eine Steigung: `rise = length × tan(Winkel)`.
- **ATN**, der Arkustangens, macht aus einer Steigung wieder einen Winkel: `Winkel = atn(rise / run)`.

Die Funktionen von c0de/math rechnen im Bogenmaß, in dem eine volle Drehung 2 × PI ist. Menschen denken in Grad, wo es 360 sind. Darum rechnet das Programm um: Grad × PI / 180 gibt Bogenmaß, Bogenmaß × 180 / PI gibt Grad.

## Das Programm

<<< @/tutorials/programs/libraries/math/angles-ramp.c0de

## So baust und startest du es

Binde den Anzeigeblock an das Programm `ramps` und die Funktion, die du willst, und stelle den Auslöserblock auf dieselbe Funktion ein.

- **`height`** ohne Karten: Eine Rampe von 10 Blöcken bei 30 Grad steigt 5,77 Blöcke; `blocks` ist 6, und der Anzeigeblock zeigt `10 long at 30.0°: 6 blocks high`. Mit `length` = 8 und `degrees` = 45 steigt sie 8 Blöcke – wie eine Treppe.
- **`slope`** mit `run` = 2 und `rise` = 1, einer Rampe aus Stufen: `degrees` ist 27, und der Anzeigeblock zeigt `1 up over 2: 27°`. Mit `rise` = -1 und `run` = 4 geht der Hang abwärts: -14°. Mit `run` = 0 ist er eine Wand: 90°.

## So funktioniert es

- **Bogenmaß hinein, FLOAT heraus.** TAN bekommt `degrees * c0de/math/PI / 180`. Sein Ergebnis ist ein FLOAT, und `rise` auch: Für 45 Grad ist es 7.999999999999999, nicht 8, denn PI und der Tangens sind nur fast genau. ROUND macht daraus die 8 Blöcke, die du bauen kannst.
- **`rise / run`** gibt ein FLOAT, denn `/` tut das immer, auch für zwei INTEGER. ATN nimmt es und gibt den Winkel im Bogenmaß, den `angle * 180 / c0de/math/PI` in Grad umrechnet.
- **Die Wand.** Ein `run` von 0 würde durch null teilen und DIVISION_BY_ZERO auslösen. Das IF antwortet vorher 90 Grad und verlässt die Funktion mit RETURN, noch vor dem PRINT.
- **Negative Steigungen** geben negative Winkel: ATN behält das Vorzeichen. Sein Ergebnis liegt immer zwischen -90 und 90 Grad.
- **Die Konstante `c0de/math/PI`** kommt mit `INCLUDE c0de/math`, wie die Funktionen. Eine CONSTANT braucht einen Literalwert, darum schreibt das Programm die Umrechnung in die Ausdrücke statt in eine eigene Konstante.

## Probier es selbst

1. Das Tor deiner Burg liegt 5 Blöcke über dem Boden. Wie lang muss eine Rampe bei 30 Grad sein, um es zu erreichen?

::: details Lösung
Das Gegenteil von `height`: `length = height / tan(Winkel)`. Für 5 Blöcke bei 30 Grad ist `blocks` gleich 9 (8,66, gerundet).

<<< @/tutorials/programs/libraries/math/angles-length.c0de

Bei 0 Grad ist der Tangens 0, und das Programm stürzt mit DIVISION_BY_ZERO ab: Eine flache Rampe kommt nirgendwo hin.
:::

2. Was sagt `height` für 90 Grad, und warum?

::: details Lösung
Eine riesige Zahl: TAN von 90 Grad ist in der Theorie unendlich, aber `90 * PI / 180` ist ein winziges Stück weniger als ein rechter Winkel, also gibt TAN etwa 16 Billiarden, und der Anzeigeblock sagt `10 long at 90.0°: 163312393531953696 blocks high`. ROUND kann daraus noch einen INTEGER machen, aber so hoch ist keine Rampe: Bei 90 Grad ist es eine Wand. Halte die Winkel von Rampen deutlich unter 90 Grad, und miss steile Hänge mit ATN, das dieses Problem nie hat.
:::

## Mehr dazu

- Die Handbuchseiten von [TAN](/de/c0de/math/tan), [ATN](/de/c0de/math/atn) und [ROUND](/de/c0de/math/round)
- [Bibliotheken: c0de/math](/de/c0de/guide/libraries#c0demath): die Konstante `c0de/math/PI`
- [Einen Kreis zeichnen](/de/tutorials/libraries/c0de/math/circle): SIN und COS, die anderen Funktionen mit Winkeln
