---
description: Ein Zahlenraten, das mit SPAWN_ITEM Diamanten auszahlt, ein Tierspawner mit SPAWN_ENTITY, der das Gehege nicht überfüllt, und ein Teleporter-Knoten, dessen Druckplatten Spieler mit TELEPORT zur Farm, zur Mine und zum Turm schicken.
---

# Belohnungen und Teleporter

Drei Programme, die Dinge erschaffen und bewegen: Das Zahlenraten zahlt Diamanten aus – je weniger Versuche, desto mehr. Ein Tierspawner füllt das Gehege, aber nie zu sehr. Und ein Teleporter-Knoten schickt dich zur Farm, in die Mine oder auf den Turm, je nachdem, auf welche Druckplatte du trittst.

**Funktionen:** [SPAWN_ITEM](/de/c0de/minecraft/spawn_item), [SPAWN_ENTITY](/de/c0de/minecraft/spawn_entity), [TELEPORT](/de/c0de/minecraft/teleport) sowie [FIND_ENTITIES](/de/c0de/minecraft/find_entities), [GET_PRESSURE_PLATE](/de/c0de/minecraft/get_pressure_plate) und [SAY](/de/c0de/minecraft/say)

::: warning Braucht einen Operator
Diese Funktionen machen Dinge aus dem Nichts oder bewegen sie ohne einen Spieler, darum funktionieren sie nur, wenn der Besitzer des Auslöserblocks ein Operator ist – in der Welt der Tutorials bist du einer. Auf einem Server kann der Administrator SPAWN_ITEM und SPAWN_ENTITY mit `allowSpawning=true` für alle erlauben und TELEPORT von Tieren und Gegenständen mit `allowTeleporting=true` in `config/c0de.properties`. Spieler teleportieren können nur Programme eines Operators; keine Einstellung erlaubt das. Ohne das Recht stürzt das Programm mit PERMISSION_DENIED ab. Für alle geht es mit einem Werfer voller Diamanten oder Spawn-Eier: PRESS_BUTTON drückt seinen Knopf (Aufgabe 1).
:::

::: info Was du brauchst

- einen **Auslöserblock** mit einem **Knopf**, deinen **Laptop**, einen **Zeitgeberblock** und ein leeres Blatt für jedes Programm
- ein eingezäuntes Gehege wie in [Die Umgebung beobachten](/de/tutorials/libraries/c0de/minecraft/watching)
- drei **Druckplatten** und die Positionen von drei Orten, die du erreichen willst

:::

## Die Idee

SPAWN_ITEM lässt 1 bis 64 Gegenstände an einer Position auf dem Boden erscheinen, SPAWN_ENTITY ein Objekt, etwa ein Schaf. Beide geben die UUID dessen zurück, was sie erschaffen haben: einen Text, der genau dieses eine Objekt in der ganzen Welt benennt. TELEPORT bewegt ein Objekt, angegeben durch seine UUID, an eine Position – die UUIDs kommen auch von FIND_ENTITIES.

Wie viele Diamanten ein Spiel wert ist, ist eine Entscheidung, die keine Welt braucht. Sie bekommt eine eigene Funktion, die der Programm-Runner testet.

## Der Preis

<<< @/tutorials/programs/libraries/minecraft/rewards-prize.c0de

Fünf Versuche oder weniger geben 5 Diamanten, bis zu sieben 3, bis zu zehn 1 und mehr als zehn nichts. Der Runner prüft 6 Versuche (3), 4 Versuche (5) und 12 Versuche (0). Die IFs gehen vom schlechtesten zum besten Ergebnis, so gewinnt das letzte, das passt.

## Der Belohnungsautomat

Das Zahlenraten aus der Lektion [Projekt: Zahlenraten](/de/tutorials/learning/guess-the-number), kürzer, mit dem Preis am Ende.

<<< @/tutorials/programs/libraries/minecraft/rewards-game.c0de

Stelle den Laptop und den Auslöserblock wie in der Lektion auf `rewardgame` und `play` ein und drück den Knopf. Rate die Zahl auf dem Laptop: Wenn du sie findest, sagt der Laptop, was du gewonnen hast, und die Diamanten springen oben auf dem Auslöserblock heraus.

- **SPAWN_ITEM** braucht eine Position, die `id` des Gegenstands und die Anzahl `count`. `count` muss 1 bis 64 sein, darum kehrt ein Preis von 0 zurück, bevor SPAWN_ITEM aufgerufen wird.
- **Die UUID** wird hier nicht gebraucht, also hat der CALL keine RESULT-Zeile, und die UUID wird weggeworfen.

## Der Tierspawner

<<< @/tutorials/programs/libraries/minecraft/rewards-spawner.c0de

Stell den Auslöserblock 5 Blöcke nördlich der Mitte des Geheges auf, wie den Zeitgeberblock des Tierzählers, stelle ihn auf `animalspawner` und `spawn` ein und drück den Knopf: In der Mitte des Geheges erscheint ein Schaf. Für Schweine leg eine STRING-Variablenkarte `animal` mit `minecraft:pig` in den Auslöserblock.

<!-- screenshot: rewards-pen | the fenced pen with several sheep, one of them just appeared in the middle, the trigger block with its button north of the pen and the chat line "Animal number 4 is in the pen." -->

- **Erst zählen, dann erschaffen.** FIND_ENTITIES zählt die Tiere dieses Typs im Gehege. Bei 8 oder mehr sagt das Programm, dass das Gehege voll ist, und erschafft nichts.
- **SPAWN_ENTITY** löst INVALID_ARGUMENT für einen Typ aus, den es nicht gibt, etwa `minecraft:unicorn`.

## Der Teleporter-Knoten

<<< @/tutorials/programs/libraries/minecraft/rewards-hub.c0de

## Aufbauen und starten

1. Geh zu jedem Ort, den du erreichen willst – die Farm, die Mine, die Spitze des Turms –, drück F3 und schreib x, y und z des Blocks auf, auf dem du stehst. Trag sie statt der Zahlen aus dem Beispiel in die Startwerte von `farm`, `mine` und `tower` ein. Nimm den Block, in dem deine Füße sind, und achte darauf, dass dort Luft ist, mit Luft darüber.
2. Stell den Zeitgeberblock auf und drei Druckplatten auf den Boden, 2, 4 und 6 Blöcke östlich davon. Die Platten halten einen Block Abstand zum Zeitgeberblock und zueinander.
3. Stelle den Zeitgeberblock auf `teleporterhub` und `hub` ein, mit einem Abstand von 10 Ticks. Stell neben jede Platte ein Schild mit ihrem Ziel.

Tritt auf die erste Platte: Eine halbe Sekunde später stehst du auf der Farm.

<!-- screenshot: rewards-hub | the teleporter hub: three pressure plates in a row with signs "Farm", "Mine" and "Tower" behind them, the timer block at the west end -->

- **`send`** kümmert sich um eine Platte und ihr Ziel; `hub` ruft es dreimal auf. Eine vierte Platte ist ein CALL und eine Variable mehr.
- **Wer steht auf der Platte?** GET_PRESSURE_PLATE sagt, ob jemand darauf steht; FIND_ENTITIES mit dem Radius 1 findet die Spieler in der Nähe der Platte. Nur die, deren Position die der Platte ist, reisen: Ein Spieler auf der Platte daneben ist auch im Umkreis von 1 Block.
- **TELEPORT** nimmt die `uuid` aus dem ENTITY und das Ziel. Spieler teleportieren können nur Programme eines Operators, siehe den Kasten oben.

## Probier es selbst

1. Zahl die Belohnung für alle aus, ohne `allowSpawning`: aus einem Werfer voller Diamanten, mit einem Steinknopf obendrauf.

::: details Lösung
Stell den Werfer 2 Blöcke nördlich des Auslöserblocks auf, nach Süden gerichtet, und den Knopf obendrauf. Das Programm drückt den Knopf einmal pro Diamant. Ein Steinknopf bleibt 20 Ticks gedrückt, darum wartet SLEEP 30 Ticks bis zum nächsten Drücken.

<<< @/tutorials/programs/libraries/minecraft/rewards-dispenser.c0de

:::

2. Schick auch Tiere durch den Teleporter, zum Beispiel eine Kuh zur Farm.

::: details Lösung
Lass in `send` die Zeile `PARAMETER type "minecraft:player" ;` weg: Dann findet FIND_ENTITIES jedes Objekt in der Nähe der Platte. Steindruckplatten reagieren auf Spieler und Mobs, also startet eine Kuh auf der Platte die Reise. Ohne den Typ würden auch Gegenstände verschickt, die auf der Platte liegen – das schadet nicht.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [SPAWN_ITEM](/de/c0de/minecraft/spawn_item), [SPAWN_ENTITY](/de/c0de/minecraft/spawn_entity), [TELEPORT](/de/c0de/minecraft/teleport), [FIND_ENTITIES](/de/c0de/minecraft/find_entities), [GET_PRESSURE_PLATE](/de/c0de/minecraft/get_pressure_plate), [PRESS_BUTTON](/de/c0de/minecraft/press_button) und [SAY](/de/c0de/minecraft/say)
- [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern) und [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung
- [Programme in der Welt](/de/tutorials/programmers/world): Besitzer und die Einstellungen von `config/c0de.properties`
- [Projekt: Zahlenraten](/de/tutorials/learning/guess-the-number) und [Projekt: die bewachte Tür](/de/tutorials/learning/guarded-door)
