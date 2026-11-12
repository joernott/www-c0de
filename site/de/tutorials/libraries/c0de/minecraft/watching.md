---
description: Ein Feldwächter, der jede Weizenpflanze mit GET_BLOCK liest und dich ruft, wenn das Feld reif ist, und ein Zähler der Tiere in einem Gehege mit FIND_ENTITIES.
---

# Die Umgebung beobachten

Zwei Programme, die nur schauen: ein Feldwächter, der auf einer Anzeigewand zeigt, wie viel vom Weizen reif ist, und dich ruft, wenn das ganze Feld reif ist, und ein Zähler, der sagt, wie viele Schafe, Kühe, Schweine und Hühner in deinem Gehege sind.

**Funktionen:** [GET_BLOCK](/de/c0de/minecraft/get_block), [FIND_ENTITIES](/de/c0de/minecraft/find_entities) und [SAY](/de/c0de/minecraft/say)

::: info Was du brauchst

- zwei **Zeitgeberblöcke** und ein leeres Blatt für jedes Programm
- eine **Anzeigewand** für jedes Programm
- ein Weizenfeld mit 4 × 4 Pflanzen und ein eingezäuntes Gehege mit ein paar Tieren
- keine Rechte: Die Welt zu lesen ist jedem Besitzer erlaubt

:::

## Die Idee

GET_BLOCK liest einen Block: seine ID, etwa `minecraft:wheat`, seine **Blockzustände**, die Redstone-Energie, die er bekommt, und ob er ein Inventar hat. Blockzustände sind das, was F3 rechts anzeigt, wenn du einen Block anschaust: Eine Weizenpflanze hat den Zustand `age`, von 0 (gerade gepflanzt) bis 7 (reif). GET_BLOCK gibt sie als HASH STRING, also ist `states["age"]` bei einer reifen Pflanze der Text `"7"`.

FIND_ENTITIES schaut andersherum: nicht auf einen Ort, sondern nach allem, was sich um eine Position herum bewegt – Tiere, Monster, Spieler und Gegenstände, die auf dem Boden liegen. Jedes kommt als ENTITY-Struktur mit seiner `uuid`, seinem `type`, seinem `name` und seiner `position`.

## Der Feldwächter

<<< @/tutorials/programs/libraries/minecraft/watching-farm.c0de

## Aufbauen und starten

1. Stell den Zeitgeberblock neben dem Feld auf den Boden, auf die Höhe der Pflanzen. Das Feld beginnt 2 Blöcke östlich davon: Seine Pflanzen stehen 2 bis 5 Blöcke östlich und 0 bis 3 Blöcke südlich des Zeitgeberblocks. Gib dem Ackerboden wie üblich Wasser im Umkreis von vier Blöcken.
2. Stelle den Zeitgeberblock auf `farmwatch` und `check` ein, mit einem Abstand von 1200 Ticks: Einmal pro Minute reicht für Weizen.
3. Binde die Anzeigewand an `farmwatch` und `check`.

Die Wand zeigt `Wheat: 16 plants` und `Ripe: 5`, und in der nächsten Minute etwas mehr. Wenn alle Pflanzen reif sind, sagt der Chat `The wheat is ripe!` – einmal pro Minute, bis du erntest.

<!-- screenshot: watching-farm | the wheat field of 4 × 4 plants, partly ripe, with the timer block beside it and the display wall showing "Wheat: 16 plants" and "Ripe: 5" -->

## So funktioniert es

- **Zwei FOR-Schleifen** laufen über das Feld: `dx` von 2 bis 5, `dz` von 0 bis 3. `spot.y` bleibt auf der Höhe des Zeitgeberblocks.
- **Nur Weizen zählt.** Eine abgeerntete oder zertrampelte Stelle enthält Luft. Darum zählt das Programm `plants` nur für `minecraft:wheat` und `ripe` nur für die mit dem Alter 7.
- **Die Ergebnisse, die du brauchst.** GET_BLOCK hat vier Ergebnisse; der CALL nimmt nur `id` und `properties`. Die anderen werden weggeworfen.
- **SAY** nur, wenn alle Pflanzen reif sind, und nur, wenn es überhaupt welche gibt: `ripe > 0 AND ripe = plants`. Ein leeres Feld ist nicht reif.

## Der Tierzähler

<<< @/tutorials/programs/libraries/minecraft/watching-pen.c0de

Die Mitte des Geheges liegt 5 Blöcke südlich des Zeitgeberblocks. Ein Gehege von 7 × 7 Blöcken passt in den Suchradius von 4. Stelle einen zweiten Zeitgeberblock auf `pencount` und `count` ein, mit einem Abstand von 200 Ticks, und binde seine Anzeigewand an dasselbe Programm und dieselbe Funktion. Die Wand zeigt `sheep: 3`, `cow: 2` und so weiter, und die Summe.

<!-- screenshot: watching-pen | the fenced pen with sheep, cows and pigs, the timer block north of it, and the display wall listing the animals and "Animals: 9" -->

- **Eine Suche pro Typ.** `type` beschränkt die Suche auf einen Objekttyp. Das Programm hängt den Namen aus dem Array an `"minecraft:"` an, so kann es den kurzen Namen ausgeben.
- **Ohne `type`** findet FIND_ENTITIES alles: auch dich und die Weizenkörner, die herumliegen. Darum sollte ein Tierzähler immer den Typ nennen.
- **Der Radius** geht von 1 bis 64 Blöcken. Halte ihn so klein wie das Gehege, sonst zählen die Tiere deines Nachbarn mit.

## Probier es selbst

1. Mach aus dem Zähler einen Wächter: Du hast 12 Tiere. Sind weniger im Gehege, soll der Chat sagen, wie viele ausgebüxt sind.

::: details Lösung
<<< @/tutorials/programs/libraries/minecraft/watching-escaped.c0de

Der Parameter `expected` hat einen Standardwert, also braucht der Zeitgeberblock keine Karte dafür. Wenn deine Herde wächst, änderst du den Standardwert in der PARAMETER-Zeile.
:::

2. Wie zählst du die Gegenstände, die im Gehege auf dem Boden liegen, zum Beispiel Federn und Wolle?

::: details Lösung
Gegenstände sind auch Objekte, vom Typ `minecraft:item`. Ruf FIND_ENTITIES mit `PARAMETER type "minecraft:item" ;` auf und zähl das Ergebnis mit LEN.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [GET_BLOCK](/de/c0de/minecraft/get_block), [FIND_ENTITIES](/de/c0de/minecraft/find_entities), [SAY](/de/c0de/minecraft/say) und [LEN](/de/c0de/reference/functions#len)
- [c0de/minecraft](/de/c0de/guide/libraries#c0deminecraft) in der Anleitung
- [EACH-Schleifen](/de/c0de/guide/language#each-schleifen) und [FOR-Schleifen](/de/c0de/guide/language#for-schleifen) in der Anleitung
- [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock) im Handbuch Geräte: Anzeigewände
