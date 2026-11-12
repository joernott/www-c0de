---
description: Eine Kalendertafel, die das heutige Datum mit Wochentag und Kalenderwoche zeigt und die Tage bis zu einem Ereignis herunterzählt – mit DAY, MONTH, YEAR, WEEK und WEEKDAY.
---

# Ein Kalender

Eine Tafel für deine Basis, die das heutige Datum mit Wochentag und Kalenderwoche zeigt und wie lange es noch bis zur nächsten Party dauert.

Funktionen: [DAY](/de/c0de/time/day), [MONTH](/de/c0de/time/month), [YEAR](/de/c0de/time/year), [WEEK](/de/c0de/time/week) und [WEEKDAY](/de/c0de/time/weekday), dazu [NOW](/de/c0de/time/now) und [DIV](/de/c0de/math/div) aus c0de/math.

::: info Was du brauchst
Einen **Auslöserblock** mit Knopf und eine **Anzeigewand** aus 3 × 1 Anzeigeblöcken (48 Spalten) oder einen **Laptop**. Wahlweise einen **Zeitgeberblock** statt des Knopfs, damit sich die Tafel von selbst auffrischt.
:::

## Die Idee

Ein TIME-Wert kennt die genaue Millisekunde, aber Menschen lesen Daten: „Thursday, 12 November 2026“. Die Funktionen von c0de/time zerlegen einen TIME-Wert in die Zahlen des Kalenders, in der Zeitzone des Servers: DAY (1 bis 31), MONTH (1 bis 12), YEAR, WEEKDAY (1 für Montag bis 7 für Sonntag) und WEEK, die Kalenderwoche, wie man sie in Europa zählt. Arrays machen aus den Zahlen Namen.

Für den Countdown brauchst du den Kalender gar nicht. Zwei TIME-Werte voneinander abgezogen ergeben die Millisekunden dazwischen, und ein Tag hat 86 400 000 davon.

## Das Programm

<<< @/tutorials/programs/libraries/time/calendar-board.c0de

## Aufbauen und starten

Binde die Anzeigewand an das Programm `calendar` und die Funktion `board`. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein und drücke den Knopf. Am 12. November 2026 um 9 Uhr zeigt die Tafel:

```
Today is Thursday, 12 November 2026 (week 46)
Winter party:
Saturday, 19 December 2026 (week 51)
37 days and 8 hours to go
```

Ändere die Konstanten `EVENT_NAME` und `EVENT` für dein eigenes Ereignis. Damit die Tafel aktuell bleibt, nimm statt des Knopfs einen Zeitgeberblock mit einem Abstand von 1200 Ticks (einer Minute).

## So funktioniert es

- **`describe` nimmt einen TIME-Wert.** Es funktioniert für jeden Zeitpunkt, nicht nur für jetzt: `board` ruft es für `now` und für `EVENT` auf. Jede Bibliotheksfunktion bekommt dasselbe `time`, also gehören alle Teile zum selben Augenblick.
- **Arrays beginnen bei 0, der Kalender bei 1.** WEEKDAY und MONTH beginnen bei 1, also beginnen beide Arrays mit einem leeren Eintrag, und `weekdays[weekday]` braucht keine Rechnung. Ein Index kann nur eine Zahl oder eine Variable sein, kein Ausdruck wie `weekday - 1`.
- **Zeiten abziehen.** `to - from` ist ein INTEGER in Millisekunden. [DIV](/de/c0de/math/div) teilt ohne Nachkommastellen: die ganzen Tage und vom Rest (`\` ist der Rest einer Division) die ganzen Stunden. `/` ergäbe einen FLOAT.
- **Wochen sind ISO-Wochen.** Woche 1 ist die Woche mit dem ersten Donnerstag des Jahres, und Wochen beginnen am Montag. Der 1. Januar 2027, ein Freitag, gehört deshalb noch zur Woche 53 von 2026 – während YEAR 2027 sagt.
- **Die Zeitzone zählt.** `EVENT` ist 18:00 UTC, in Berlin also 19:00. Kurz vor Mitternacht können DAY und WEEKDAY desselben TIME-Werts von Server zu Server verschieden sein.

## Probier es selbst

1. Nach dem Beginn der Party zählt die Tafel negative Tage. Zeige stattdessen „It has started!“.

::: details Lösung
<<< @/tutorials/programs/libraries/time/calendar-past.c0de

TIME-Werte lassen sich wie Zahlen vergleichen. `RETURN` beendet `board` früher, sodass der Countdown nicht erscheint.
:::

2. Welche Woche meldet `describe` für den 31. Dezember 2024, einen Dienstag? Probier es aus: Führe `describe` mit dem Programm-Runner aus, oder lege eine TIME-Variablenkarte `time` mit diesem Datum in einen Auslöserblock, der auf `describe` eingestellt ist. Eine nicht initialisierte Karte braucht es nicht: Das Ergebnis `text` nimmt den Platz der Parameterkarte ein.

::: details Lösung
`Tuesday, 31 December 2024 (week 1)`. Die Woche von Montag, 30. Dezember 2024, bis Sonntag, 5. Januar 2025, enthält den ersten Donnerstag von 2025, also ist sie Woche 1 von 2025. Zeige das Jahr zur Woche mit Vorsicht an: Um Neujahr ist es nicht immer YEAR.
:::

## Mehr dazu

- Handbuch [c0de/time](/de/c0de/time/) und [DIV](/de/c0de/math/div)
- [Bibliotheken: c0de/time](/de/c0de/guide/libraries#c0detime)
- [TYPE_TIME](/de/c0de/reference/data#type_time) und [TYPE_ARRAY](/de/c0de/reference/data#type_array)
- [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock) und [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock)
