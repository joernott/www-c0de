---
description: Eine Stoppuhr, die zwei Knöpfe starten und anhalten, und ein Reaktionstest auf einem Laptop – mit TIMER, MILLISECOND und Rechnungen mit TIME-Werten.
---

# Stoppuhr und Reaktionstest

Eine Stoppuhr für Rennen in deiner Welt: Ein Knopf startet sie, ein anderer hält sie an, und eine Anzeigewand zeigt die Zeit auf die Millisekunde genau. Danach ein Reaktionstest auf einem Laptop: Wie schnell drückst du eine Taste, wenn „GO!“ erscheint?

Funktionen: [TIMER](/de/c0de/time/timer), [MILLISECOND](/de/c0de/time/millisecond) und Rechnungen mit TIME-Werten, dazu [NOW](/de/c0de/time/now), [SLEEP](/de/c0de/time/sleep) und [FORMAT](/de/c0de/strings/format).

::: info Was du brauchst
Für die Stoppuhr: zwei **Auslöserblöcke** mit je einem **Knopf**, eine **Anzeigewand** aus 2 × 1 Anzeigeblöcken, einen **Trichter**, eine **Truhe** und ein paar **nicht initialisierte Variablenkarten**. Für den Reaktionstest: einen Auslöserblock mit Knopf und einen **Laptop**.
:::

## Die Idee

Zeit messen heißt, zweimal auf die Uhr zu schauen und abzuziehen. c0de hat dafür zwei Uhren:

- [NOW](/de/c0de/time/now) gibt einen TIME-Wert zurück, einen Zeitpunkt in Millisekunden. Zwei TIME-Werte voneinander abgezogen ergeben einen INTEGER, die Millisekunden dazwischen. Ein TIME-Wert kann als Variablenkarte reisen, also kann ein Prozess die Stoppuhr starten und ein anderer sie anhalten.
- [TIMER](/de/c0de/time/timer) gibt die Sekunden seit Mitternacht als FLOAT zurück, etwa `32703.25`. Das ist praktisch innerhalb eines Prozesses: keine TIME-Werte, nur eine Subtraktion zweier Zahlen.

## Die Stoppuhr

<<< @/tutorials/programs/libraries/time/stopwatch-buttons.c0de

### Aufbauen und starten

1. Setze Auslöserblock **A** und stelle ihn auf `stopwatch` / `start` ein. Lege ein paar nicht initialisierte Variablenkarten in seine Eingabe: Jeder Start braucht eine für sein Ergebnis `started`.
2. Setze Auslöserblock **B** direkt neben A und stelle ihn auf `stopwatch` / `stop` ein. B ist der einzige Block mit Inventar, der A berührt, also geht die Ausgabe von A von selbst in B.
3. Setze unter B einen Trichter, der in die Truhe führt.
4. Setze an jeden Auslöserblock einen Knopf und binde die Anzeigewand an `stopwatch` / `stop`.

Drücke den Knopf an A: Die Karte `started` geht in B. Drücke den Knopf an B: Die Wand zeigt

```
Start 09:04:50.655
Stop  09:05:03.000
Time  12.345 s
```

und die Karte `seconds` mit dem Wert 12.345 fällt in die Truhe – eine Liste all deiner Zeiten.

<!-- screenshot: stopwatch-buttons | the two trigger blocks with buttons side by side, the hopper and chest under the second one, and the display wall showing the start, stop and elapsed time -->

### So funktioniert es

- **Die Zeit reist als Karte.** `start` gibt nur NOW als `started` zurück. `stop` nimmt sie als Parameter; die beiden Prozesse teilen also nichts außer dieser Karte. Drückst du A zweimal, warten zwei Karten in B: Der nächste Lauf nimmt eine für seinen Parameter und reicht die andere in die Truhe weiter.
- **Zeiten abziehen.** `now - started` ist die Zahl der Millisekunden. Mit `/` durch 1000 geteilt, wird daraus ein FLOAT in Sekunden, und `%.3f` schreibt ihn mit drei Nachkommastellen.
- **MILLISECOND.** `%tT` schreibt eine Uhrzeit auf die Sekunde genau. `stamp` hängt mit [MILLISECOND](/de/c0de/time/millisecond) die Millisekunden an, 0 bis 999, von `.%03d` auf drei Stellen aufgefüllt.
- **Wie genau ist sie?** NOW ist auf die Millisekunde genau, aber ein Prozess startet zu einem Tick, und der Cursor geht eine Zeile pro Tick weiter. Eine Stoppuhr im Spiel ist also auf etwa eine Zwanzigstelsekunde genau. Beide Knöpfe warten auf dieselbe Weise, deshalb hebt sich der Fehler größtenteils auf.

## Der Reaktionstest

<<< @/tutorials/programs/libraries/time/stopwatch-reaction.c0de

### Aufbauen und starten

Binde den Laptop an `reaction` / `react`, stelle den Auslöserblock genauso ein und drücke seinen Knopf. Öffne den Laptop und drücke eine Taste, um zu beginnen. Nach zwei bis fünf Sekunden erscheint „GO!“: Drücke so schnell du kannst eine Taste. Der Laptop zeigt deine Zeit und ein Urteil.

### So funktioniert es

- **Eine zufällige Wartezeit.** [RANDOM](/de/c0de/math/random) und [INT](/de/c0de/math/int) wählen zwischen 40 und 99 Ticks, und [SLEEP](/de/c0de/time/sleep) wartet so lange, damit du nicht erraten kannst, wann „GO!“ kommt.
- **TIMER um die Schleife.** TIMER wird direkt nach „GO!“ und direkt nach der Taste gelesen. Die Schleife fragt INKEY, bis eine Taste da ist, also ist der Unterschied deine Reaktionszeit – plus ein oder zwei Ticks des Cursors.
- **Mitternacht.** TIMER beginnt um Mitternacht wieder bei 0. Ist `stop` kleiner als `start`, lief der Test über Mitternacht, und ein Tag mit 86 400 Sekunden wird addiert.
- **`rate` ist eine eigene Funktion.** Sie nimmt die Sekunden als Parameter und lässt sich deshalb mit festen Werten wie 0,25 oder 0,8 testen, ohne auf eine echte Reaktion zu warten.

## Probier es selbst

1. Tasten, die vor „GO!“ gedrückt werden, warten auf INKEY; wer zu früh drückt, bekommt also eine perfekte Zeit. Erwische die Schummler: Wartet direkt nach dem SLEEP schon eine Taste, schreibe „Too early!“ und hör auf.

::: details Lösung
<<< @/tutorials/programs/libraries/time/stopwatch-early.c0de

Ein INKEY nach dem SLEEP genügt: Eine zu frühe Taste wartet dort noch. `RETURN` beendet `react`.
:::

2. Ein Rennen durch deinen Parkour dauert Minuten. Zeige die Zeit als `2:05.300` statt `125.300 s`.

::: details Lösung
<<< @/tutorials/programs/libraries/time/stopwatch-minutes.c0de

DIV ergibt die ganzen Minuten der Millisekunden, der Rest `\ 60000` den Rest der letzten Minute. `%06.3f` schreibt die Sekunden sechs Zeichen breit mit drei Nachkommastellen und führender Null, etwa `05.300`.
:::

## Mehr dazu

- Handbuch [c0de/time](/de/c0de/time/), [FORMAT](/de/c0de/strings/format), [RANDOM](/de/c0de/math/random) und [DIV](/de/c0de/math/div)
- [Bibliotheken: c0de/time](/de/c0de/guide/libraries#c0detime) und [FORMAT](/de/c0de/guide/libraries#format)
- [TYPE_TIME](/de/c0de/reference/data#type_time)
- [Verketten](/de/c0de/guide/running-programs#verketten) und [Mit Spielern sprechen](/de/c0de/guide/running-programs#mit-spielern-sprechen)
- [Laptop](/de/c0de/reference/devices#laptop) und [INKEY](/de/c0de/reference/functions#inkey)
