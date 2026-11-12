---
description: Eine Animation auf einer Anzeige, die mit SLEEP wartet, und eine Anzeige, die mit TICKS Tag und Nacht unterscheidet – die Spielzeit von Minecraft im Vergleich mit der echten Zeit.
---

# Spielzeit und echte Zeit

Ein Ball, der über eine Anzeige hüpft, und eine Anzeige, die den Tag und die Uhrzeit der Minecraft-Welt zeigt: Sonnenaufgang, Tag, Sonnenuntergang oder Nacht.

Funktionen: [SLEEP](/de/c0de/time/sleep) und [TICKS](/de/c0de/minecraft/ticks) aus c0de/minecraft.

::: info Was du brauchst
Einen **Auslöserblock** mit Knopf, einen **Zeitgeberblock** und zwei **Anzeigeblöcke**.
:::

## Die Idee

Die anderen Rezepte von c0de/time lesen die **echte Zeit**, die Uhr des Servers. Minecraft hat eine zweite Uhr, die **Spielzeit**, gezählt in Ticks. Wenn der Server mitkommt, hat eine Sekunde 20 Ticks, und ein Minecraft-Tag mit 24 000 Ticks dauert 20 Minuten.

- [SLEEP](/de/c0de/time/sleep) hält ein Programm für eine Zahl von Ticks an, 1 bis 72 000 (eine Stunde). So wartet ein Programm: auf das nächste Bild einer Animation, darauf, dass eine Tür schließt, auf den nächsten Versuch.
- [TICKS](/de/c0de/minecraft/ticks) gibt die Spielzeit der Welt zurück, die Ticks seit ihrer Erschaffung. Der Rest `\ 24000` ist die Tageszeit: 0 ist der Sonnenaufgang um 6:00, 6000 Mittag, 12 000 Sonnenuntergang und 18 000 Mitternacht.

## Eine Animation

<<< @/tutorials/programs/libraries/time/game-time-bounce.c0de

Binde einen Anzeigeblock an das Programm `bouncer` und die Funktion `bounce`, stelle den Auslöserblock genauso ein und drücke seinen Knopf. Ein Ball läuft dreimal durch Zeile 3 der Anzeige hin und zurück.

<!-- screenshot: game-time-bounce | a display block with the ball "o" in the middle of row 3, the trigger block with its button in front of it -->

### So funktioniert es

- **Ein Bild, ein SLEEP.** Jeder Durchlauf der inneren Schleifen zeichnet ein Bild und wartet dann `delay` Ticks.
- **Über den alten Ball zeichnen.** Auf dem Weg nach rechts schreibt PRINT `" o"`: Das Leerzeichen löscht den Ball des letzten Bildes eine Spalte weiter links. Auf dem Rückweg löscht `"o "` den rechts daneben. Kein CLS, kein Flackern.
- **Die Zeilen zählen mit.** Der Cursor braucht für jede Zeile einen Tick, also dauert ein Bild etwa vier Ticks plus das SLEEP. Ein Programm läuft nie schneller als eine Zeile pro Tick.
- **Parameter mit Standardwerten.** `rounds` und `delay` haben Standardwerte, also braucht der Auslöserblock keine Karten. Lege eine INTEGER-Variablenkarte `delay` mit 5 hinein, dann wird der Ball langsamer. Mit 0 löst SLEEP INVALID_ARGUMENT aus, und der Prozess stürzt ab.

## Tag und Nacht

<<< @/tutorials/programs/libraries/time/game-time-daynight.c0de

Binde den zweiten Anzeigeblock an `daynight` / `show`, stelle den Zeitgeberblock genauso und auf einen Abstand von 100 Ticks ein. Die Anzeige zeigt die Nummer des Minecraft-Tages, die Uhrzeit der Welt und was der Himmel gerade tut:

```
Day 3
18:30
Sunset
```

### So funktioniert es

- **Von Ticks zur Uhrzeit.** Eine Minecraft-Stunde hat 1000 Ticks, und Tick 0 ist 6:00 Uhr morgens. Die Stunde ist also die Zahl der ganzen Tausender plus 6, und die Minute der Rest von tausend Ticks mal 60 / 1000.
- **Die Tageszählung.** Alle 24 000 Ticks beginnt ein neuer Tag; `phase` zählt ab Tag 1.
- **Die Phasen** werden von der frühesten zur spätesten verglichen: Day, dann Sunset ab 12 000, Night ab 13 000 und Sunrise ab 23 000. Ein späteres IF überschreibt ein früheres.
- **TICKS ist nicht die Tageszeit.** TICKS zählt jeden Tick der Welt. Schlafen im Bett oder `/time set` verändern die Sonne, aber nicht TICKS. In einer Welt, in der jemand geschlafen hat, zeigt die Anzeige die falsche Phase; in einer Welt, in der niemand schläft, stimmt sie.
- **TICKS braucht das Spiel.** Programme mit c0de/minecraft laufen nur in Minecraft, deshalb nimmt `phase` die Ticks als Parameter: Probier es mit einem Auslöserblock, der auf `phase` eingestellt ist, einer INTEGER-Variablenkarte `ticks` mit 12 500 und zwei nicht initialisierten Karten aus (die Parameterkarte macht Platz für das dritte Ergebnis). Die Ergebnisse sind 1, `18:30` und `Sunset`.

## Probier es selbst

1. Setze `delay` auf 1. Warum ist der Ball nicht doppelt so schnell wie mit 2?

::: details Lösung
Ein Bild braucht etwa vier Ticks für die Zeilen der Schleife und `delay` Ticks SLEEP: sechs Ticks mit 2, fünf Ticks mit 1. Nur das SLEEP wird kürzer. Für einen schnelleren Ball bewege ihn zwei Spalten pro Bild.
:::

2. SLEEP 20 ist nur dann eine Sekunde, wenn der Server mitkommt. Miss, wie viele Ticks deine Welt wirklich pro Sekunde läuft: Lies TICKS und NOW, schlafe 200 Ticks und lies beide noch einmal.

::: details Lösung
<<< @/tutorials/programs/libraries/time/game-time-speed.c0de

Die Ticks zwischen den beiden Messungen geteilt durch die Sekunden dazwischen. Ein gesunder Server zeigt 20.0, ein ausgelasteter weniger – und dann dauert jedes SLEEP und jedes Programm in echter Zeit länger.
:::

## Mehr dazu

- Handbuch [SLEEP](/de/c0de/time/sleep), [TICKS](/de/c0de/minecraft/ticks) und [NOW](/de/c0de/time/now)
- [Bibliotheken: c0de/time](/de/c0de/guide/libraries#c0detime) und [c0de/minecraft](/de/c0de/guide/libraries#c0deminecraft)
- [Der Cursor](/de/c0de/guide/running-programs#der-cursor)
- [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock), [Auslöserblock](/de/c0de/reference/triggers#auslöserblock) und [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock)
