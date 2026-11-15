---
description: Ein „Guten Morgen“-Knopf für Operatoren, der mit COMMAND /time set day und /weather clear ausführt, Ergebnis und Ausgabe jedes Befehls prüft und alle mit /say begrüßt.
---

# Serverbefehle

Schon wieder Nacht, und dazu noch Regen? In deiner eigenen Welt macht ein Knopf den Morgen: Ein Programm führt `/time set day` und `/weather clear` aus, prüft, dass beide geklappt haben, und wünscht allen einen guten Morgen. Ein zweiter Knopf schaltet die Nacht wieder ein.

**Funktionen:** [COMMAND](/de/c0de/minecraft/command) und [SAY](/de/c0de/minecraft/say)

::: warning Braucht einen Operator – immer
COMMAND führt einen Befehl aus wie ein Befehlsblock, und Befehlsblöcke sind nur für Operatoren. Darum funktioniert COMMAND nur, wenn der Besitzer des Auslöserblocks ein Operator ist, und wenn ein Spieler den Knopf drückt, muss auch dieser Spieler ein Operator sein: Drückt jemand anderes, stürzt der Prozess mit PERMISSION_DENIED ab, statt die Zeit zu ändern. Keine Einstellung in `config/c0de.properties` erlaubt es für alle; dort kann der Administrator COMMAND mit `enableCommand=false` nur für alle abschalten. Außerdem müssen Befehlsblöcke auf dem Server erlaubt sein: In einer Einzelspielerwelt sind sie es immer, auf einem dedizierten Server mit `enable-command-block=true` in `server.properties` (seit Minecraft 1.21.11 mit der Spielregel „Befehlsblöcke aktivieren“). In der Welt der Tutorials bist du ein Operator, und alles ist bereit.
:::

::: info Was du brauchst

- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für das Programm
- für die Übungen: einen zweiten **Auslöserblock** mit einem **Knopf**

:::

## Die Idee

COMMAND nimmt einen Befehl als Text, mit oder ohne `/`, und führt ihn wie ein Befehlsblock am Auslöserblock aus. Es gibt zwei Ergebnisse zurück:

- `result`: wie oft der Befehl erfolgreich war, die Zahl, die ein Komparator aus einem Befehlsblock liest. 0 heißt, er ist fehlgeschlagen.
- `output`: die letzte Meldung des Befehls, etwa „Set the time to 1000“ – oder warum er fehlgeschlagen ist.

Ein Befehl, der fehlschlägt, ist kein Fehler des Programms: Ein Tippfehler in einem Befehl lässt es nicht abstürzen, das Programm sieht nur `result` 0. Darum muss das Programm jeden Befehl selbst prüfen – und genau das tut dieses hier.

## Das Programm

<<< @/tutorials/programs/libraries/minecraft/server-commands-morning.c0de

## Aufbauen und starten

1. Stell den Auslöserblock auf und setz den Knopf darauf.
2. Stelle ihn auf `goodmorning` und `morning` ein.
3. Warte auf die Nacht (oder mach sie mit `/time set night`) und drück den Knopf.

Die Sonne geht auf, der Regen hört auf, und im Chat steht `[goodmorning/3] Good morning, everybody! The sun is up.` – der Name in eckigen Klammern ist das Programm mit seiner PID, wie der Name eines Befehlsblocks. Als Operator siehst du vielleicht auch, was die Befehle gemeldet haben, in Grau: Das ist die Spielregel `commandBlockOutput`, dieselbe wie für Befehlsblöcke. Jeder Befehl wird außerdem mit Programm und PID ins Log des Servers geschrieben, so sieht der Administrator, wer was getan hat.

<!-- screenshot: server-commands-morning | the trigger block with its button in the morning sun, the chat showing the good morning message of goodmorning -->

## So funktioniert es

- **Eine Liste von Befehlen.** Die Befehle sind ein ARRAY STRING, und EACH führt sie nacheinander aus. Ein dritter Befehl ist ein weiterer Text in der Liste.
- **`result` und `output`.** Gibt ein Befehl `result` 0 zurück, schreibt das Programm den Befehl und seinen `output` mit SAY in den Chat. Probier es aus: Mach aus `"weather clear"` ein `"weather sunny"`, und der Chat sagt dir, was das Spiel davon hält.
- **Der Gruß.** `/say` ist auch ein Befehl: Er schreibt an alle Spieler auf dem Server, während SAY nur die Spieler im Umkreis von 64 Blöcken um den Auslöserblock erreicht. Das Programm grüßt nur, wenn kein Befehl fehlgeschlagen ist.
- **Wo die Befehle laufen.** COMMAND läuft in der Mitte des Auslöserblocks, in seiner Dimension, aber ohne Spieler: `@s` wählt niemanden aus, und `~ ~ ~` ist der Auslöserblock. `/give @p minecraft:bread` gibt dem Spieler Brot, der dem Knopf am nächsten ist.

## Probier es selbst

1. Bau einen „Gute Nacht“-Knopf: eine zweite Einstiegsfunktion `evening`, die `/time set night` ausführt und gute Nacht sagt. Beide Funktionen sollen dieselbe Schleife benutzen.

::: details Lösung
Die Schleife wandert in eine Funktion `runAll` mit einem ARRAY-STRING-Parameter, und jede Liste bekommt ihre eigene Variable. Der Gruß ist einfach der letzte Befehl der Liste; `runAll` hört beim ersten Befehl auf, der fehlschlägt. Stelle den zweiten Auslöserblock auf `daynight` und `evening` ein, den ersten auf `daynight` und `morning`.

<<< @/tutorials/programs/libraries/minecraft/server-commands-night.c0de

:::

2. Bevor das Programm die Zeit ändert, soll es das Spiel fragen, wie spät es war, und die Antwort in den Gruß schreiben.

::: details Lösung
`/time query daytime` ändert nichts; sein `output` ist die Antwort, etwa „The time is 13000“. Das Programm merkt sie sich in `before` und setzt sie in den Gruß. Hier wird `result` nicht gebraucht, darum nimmt der CALL nur `output`.

<<< @/tutorials/programs/libraries/minecraft/server-commands-clock.c0de

:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [COMMAND](/de/c0de/minecraft/command) und [SAY](/de/c0de/minecraft/say)
- [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung: warum nur Operatoren Befehle ausführen dürfen
- [EACH-Schleifen](/de/c0de/guide/language#each-schleifen) in der Anleitung
- [Programme in der Welt](/de/tutorials/programmers/world): wem ein Auslöserblock gehört und wer einen Prozess gestartet hat
