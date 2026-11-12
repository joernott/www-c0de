---
description: Eine Mauer und ein Turm, mit PLACE_BLOCK aus den Blöcken einer Truhe gebaut, was für jeden Spieler funktioniert, und der Turm mit REMOVE_BLOCK wieder abgerissen.
---

# Bauen

Ein Programm als Baumeister: Es nimmt Steinziegel aus einer Truhe und zieht eine Mauer beliebiger Länge und Höhe hoch, Schicht für Schicht. Ein zweites Programm baut einen hohlen Turm – und reißt ihn wieder ab.

**Funktionen:** [PLACE_BLOCK](/de/c0de/minecraft/place_block), [REMOVE_BLOCK](/de/c0de/minecraft/remove_block), [GET_BLOCK](/de/c0de/minecraft/get_block) und [SAY](/de/c0de/minecraft/say)

::: warning Braucht einen Operator – zum Teil
PLACE_BLOCK mit dem Parameter `inventory` nimmt jeden Block aus einer Truhe, so wie ein Spieler Blöcke aus seinem Inventar setzt. Das funktioniert für jeden Besitzer auf jedem Server: Mauer und Turm werden für alle gebaut. REMOVE_BLOCK lässt Blöcke ohne einen Spieler verschwinden, darum funktioniert es nur, wenn der Besitzer des Auslöserblocks ein Operator ist oder der Server es mit `allowBlockChanges=true` in `config/c0de.properties` erlaubt; sonst löst es PERMISSION_DENIED aus. Für alle reißt MINE_BLOCK den Turm stattdessen ab (Aufgabe 2).
:::

::: info Was du brauchst

- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für jedes Programm
- eine **Truhe** mit zwei Stapeln **Steinziegel** und eine mit einem Stapel **Bruchstein**
- einen ebenen Platz von etwa 10 × 5 Blöcken

:::

## Die Idee

PLACE_BLOCK setzt einen Block mit einer `id` an eine Position, an der Luft oder etwas Ersetzbares wie Gras ist. Ohne `inventory` kommt der Block aus dem Nichts – darum braucht es das Recht. Mit `inventory` wird er aus der Truhe genommen, und hat die Truhe keinen mehr, löst PLACE_BLOCK ITEM_MISSING aus.

Eine Mauer ist ein Rechteck aus Positionen: eine Schleife über die Schichten und darin eine Schleife die Mauer entlang.

## Die Mauer

<<< @/tutorials/programs/libraries/minecraft/building-wall.c0de

## Aufbauen und starten

1. Stell den Auslöserblock dort auf, wo die Mauer anfangen soll, und setz den Knopf darauf.
2. Stell die Truhe mit den Steinziegeln 2 Blöcke westlich davon auf.
3. Stelle den Auslöserblock auf `wallbuilder` und `wall` ein und drück den Knopf.

Die Mauer wächst ab 2 Blöcke östlich des Auslöserblocks, 8 Blöcke lang und 3 hoch, ein Block alle paar Ticks.

<!-- screenshot: building-wall | the finished wall of stone bricks, 8 blocks long and 3 high, with the trigger block and its button in front of its west end and the chest 2 blocks west of it -->

## So funktioniert es

- **Parameter mit Standardwerten.** `length`, `height` und `material` haben Standardwerte, also braucht der Auslöserblock keine Karten. Für eine andere Mauer leg eine INTEGER-Variablenkarte `length` oder eine STRING-Variablenkarte `material` in den Auslöserblock.
- **Die Schleifen.** Die äußere Schleife zählt die Schichten von unten, die innere die Blöcke die Mauer entlang. `spot.z` ändert sich nie: Die Mauer läuft gerade nach Osten.
- **Wenn etwas schiefgeht.** Wird die Truhe leer, löst PLACE_BLOCK ITEM_MISSING aus; ist etwas im Weg, INVALID_ARGUMENT. Der CALL fängt den Fehler in `problem` auf. Statt abzustürzen, sagt das Programm, was passiert ist, und hört mit RETURN auf – die Mauer bleibt, so weit sie gekommen ist.

## Der Turm

Das zweite Programm hat zwei Einstiegsfunktionen: `build` baut einen hohlen Turm aus Bruchstein, 3 × 3 Blöcke und 6 hoch, und `pullDown` entfernt ihn wieder.

<<< @/tutorials/programs/libraries/minecraft/building-tower.c0de

Wieder steht die Truhe 2 Blöcke westlich des Auslöserblocks; der Turm belegt die 3 × 3 Blöcke von 2 bis 4 Blöcke östlich und von 1 Block nördlich bis 1 Block südlich. Stelle den Auslöserblock auf `towerbuilder` und `build` ein und drück den Knopf. Zum Abreißen stellst du die Funktion im Dialog auf `pullDown` um und drückst den Knopf noch einmal.

<!-- screenshot: building-tower | the hollow cobblestone tower, 6 blocks high, half pulled down from the top, cobblestone items lying around it, the trigger block and the chest in front of it -->

- **Der Ring.** Drei Schleifen gehen durch die Schichten und die 3 × 3 Positionen jeder Schicht. `dx ≠ 1 OR dz ≠ 1` lässt die Mitte aus, so ist der Turm hohl.
- **Von oben.** `pullDown` zählt die Schichten mit der Schrittweite -1 abwärts. Ein Turm, der zuerst seinen Fuß verliert, sähe eine Weile seltsam aus.
- **Nur seine eigenen Blöcke.** Vor REMOVE_BLOCK prüft GET_BLOCK, dass dort Bruchstein ist. Wenn du eine Tür in den Turm baust, lässt das Programm sie in Ruhe.
- **`drop TRUE`:** Jeder entfernte Block fällt als Gegenstand auf den Boden, als wäre er abgebaut worden. Mit `FALSE` verschwindet er einfach.
- **Hier wird nichts aufgefangen.** Wird die Truhe leer, stürzt `build` mit ITEM_MISSING ab – der Dialog des Auslöserblocks zeigt den Fehler. Vergleich das mit der Mauer, die ihn auffängt.

## Probier es selbst

1. Gib der Mauer Fenster: Lass in der mittleren Schicht jeden dritten Block aus.

::: details Lösung
`i \ 3 ≠ 1` ist für alle Blöcke wahr außer dem 2., 5., 8. …; in der mittleren Schicht (`row` 1) bekommen nur diese einen Block.

<<< @/tutorials/programs/libraries/minecraft/building-windows.c0de

:::

2. Reiß den Turm ohne jedes Recht ab: Bau ihn mit MINE_BLOCK und einer Spitzhacke aus der Truhe ab und leg den Bruchstein zurück in die Truhe.

::: details Lösung
Leg eine Spitzhacke in die Truhe. MINE_BLOCK nimmt sie als `tool_inventory` und legt die Drops als `output_inventory` in dieselbe Truhe. Es dauert so lange, wie ein Spieler brauchen würde, und die Spitzhacke nutzt sich ab.

<<< @/tutorials/programs/libraries/minecraft/building-mine.c0de

:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [PLACE_BLOCK](/de/c0de/minecraft/place_block), [REMOVE_BLOCK](/de/c0de/minecraft/remove_block), [GET_BLOCK](/de/c0de/minecraft/get_block), [MINE_BLOCK](/de/c0de/minecraft/mine_block) und [SAY](/de/c0de/minecraft/say)
- [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern) und [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung
- [Einen Kreis zeichnen](/de/tutorials/libraries/c0de/math/circle), ein weiterer Baumeister mit PLACE_BLOCK
- [Fehler](/de/c0de/guide/language#fehler) in der Anleitung: einen Fehler im CALL auffangen
