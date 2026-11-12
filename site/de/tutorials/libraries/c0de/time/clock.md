---
description: Eine Digitaluhr auf einer Anzeigewand, die ein Zeitgeberblock jede Sekunde auffrischt – mit NOW, HOUR, MINUTE, SECOND und FORMAT.
---

# Eine Uhr an der Wand

Eine Digitaluhr auf einer Anzeigewand, die die echte Uhrzeit zeigt und jede Sekunde weiterspringt. Ein Zeitgeberblock startet das Programm immer wieder; jeder Lauf liest die Zeit einmal und schreibt sie auf den Bildschirm.

Funktionen: [NOW](/de/c0de/time/now), [HOUR](/de/c0de/time/hour), [MINUTE](/de/c0de/time/minute), [SECOND](/de/c0de/time/second) und [FORMAT](/de/c0de/strings/format) aus c0de/strings.

::: info Was du brauchst
Einen **Zeitgeberblock** und eine **Anzeigewand** aus 2 × 1 Anzeigeblöcken (32 Spalten, 8 Zeilen). Keine Variablenkarten: Das Programm hat keine Parameter und keine Ergebnisse.
:::

## Die Idee

Ein Programm kann nicht dasitzen und auf die Uhr schauen: Es läuft, erledigt seine Arbeit und endet. Für etwas, das sich ständig ändert, startet ein **Zeitgeberblock** dieselbe Funktion immer wieder, hier alle 20 Ticks, also etwa einmal pro Sekunde. Jeder Lauf fragt [NOW](/de/c0de/time/now) nach der aktuellen Zeit, zerlegt sie mit HOUR, MINUTE und SECOND und schreibt `09:05:03` auf den Bildschirm.

Ein TIME-Wert ist ein Zeitpunkt, gezählt in Millisekunden seit Anfang 1970. HOUR, MINUTE und SECOND machen daraus die Zahlen, die du kennst, in der Zeitzone des Servers. [FORMAT](/de/c0de/strings/format) füllt sie dann mit einer führenden Null auf, damit 9 Uhr als `09` erscheint und nicht als `9`.

## Das Programm

<<< @/tutorials/programs/libraries/time/clock-wall.c0de

## Aufbauen und starten

1. Baue die Anzeigewand: zwei Anzeigeblöcke nebeneinander, die in dieselbe Richtung zeigen.
2. Binde sie an das Programm `wallclock` und die Funktion `tick` (Anzeigeblock mit rechts anklicken, Programm und Funktion wählen, auf ✔ klicken).
3. Setze einen Zeitgeberblock und stelle ihn auf `wallclock` / `tick` und einen Abstand von 20 Ticks ein.

Die Uhr erscheint in der Mitte der Wand und zählt die Sekunden. Um das Programm zu ändern, halte den Zeitgeberblock zuerst mit einem Hebel an: Ein laufender Prozess sperrt das Blatt.

<!-- screenshot: clock-wall | a display wall of 2 × 1 display blocks showing the time 09:05:03 in the middle, the timer block in front of it -->

## So funktioniert es

- **Ein NOW, viele Teile.** Das Programm fragt die Zeit einmal ab und gibt `now` an HOUR, MINUTE und SECOND weiter. Ohne `time` würde jede von ihnen selbst auf die Uhr schauen – und um 09:59:59,990 könnte HOUR noch 9 sagen, während MINUTE schon 0 sagt: eine Uhr, die für eine Sekunde auf 09:00:00 zurückspringt.
- **FORMAT füllt die Zahlen auf.** `%02d` schreibt eine ganze Zahl mindestens zwei Stellen breit und füllt sie mit Nullen auf. Das Format `:%02d` setzt den Doppelpunkt gleich mit davor.
- **LOCATE statt CLS.** Die neue Zeit überschreibt die alte in Zeile 3, Spalte 12. Den Bildschirm vorher zu löschen, würde ihn flackern lassen.
- **Auch der Cursor braucht Zeit.** Er geht eine Zeile pro Tick weiter, und `tick` braucht etwa 18 Zeilen. Bei einem Abstand von 20 Ticks endet ein Lauf, bevor der nächste fällig ist. Ein Zeitgeberblock startet einen neuen Prozess erst, wenn der letzte beendet ist; ein langsameres Programm würde also Sekunden auslassen.
- **Die Zeitzone ist die des Servers.** Auf einem Server in Berlin wird 23:59:59 UTC als `00:59:59` angezeigt.

## Probier es selbst

1. Zeige unter der Uhrzeit das Datum, etwa `2026-11-12`.

::: details Lösung
<<< @/tutorials/programs/libraries/time/clock-date.c0de

Für TIME-Werte kennt FORMAT eigene Codes: `%tT` ist die Uhrzeit und `%tF` das Datum. Je ein Aufruf ersetzt HOUR, MINUTE, SECOND und das Auffüllen. Die Einzelteile lohnen sich, wenn du mit den Zahlen rechnen willst, wie in der nächsten Übung.
:::

2. Begrüße die Spieler: „Good morning“ vor zwölf Uhr, „Good afternoon“ vor 18 Uhr, „Good evening“ danach und „Good night“ vor 6 Uhr.

::: details Lösung
<<< @/tutorials/programs/libraries/time/clock-greeting.c0de

Der Tag hat vier Viertel zu sechs Stunden, und [DIV](/de/c0de/math/div) aus c0de/math macht aus der Stunde die Nummer ihres Viertels, 0 bis 3, die den Gruß aus dem Array auswählt. Die Grüße sind auf dieselbe Länge aufgefüllt, damit ein kürzerer einen längeren ganz überschreibt.
:::

## Mehr dazu

- Handbuch [c0de/time](/de/c0de/time/) und [FORMAT](/de/c0de/strings/format)
- [Bibliotheken: c0de/time](/de/c0de/guide/libraries#c0detime) und [FORMAT](/de/c0de/guide/libraries#format)
- [TYPE_TIME](/de/c0de/reference/data#type_time)
- [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock) und [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock)
- [Der Cursor](/de/c0de/guide/running-programs#der-cursor)
