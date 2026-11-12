---
description: Ein Tunnelgräber, der mit MINE_BLOCK einen Tunnel beliebiger Länge gräbt, mit den Werkzeugen aus einer Truhe und den Drops in einer anderen, und der vor Wasser, Lava und Grundgestein anhält.
---

# Ein Tunnelgräber

Ein Programm als Bergmann: Es gräbt einen zwei Blöcke hohen Tunnel geradeaus in den Hügel, mit den Spitzhacken aus einer Truhe, und legt allen Bruchstein und alle Erze in eine andere Truhe. Es hält von selbst an, wenn es auf Wasser, Lava oder Grundgestein stößt.

**Funktionen:** [MINE_BLOCK](/de/c0de/minecraft/mine_block), [GET_BLOCK](/de/c0de/minecraft/get_block), [SAY](/de/c0de/minecraft/say) und in Aufgabe 1 [PLACE_BLOCK](/de/c0de/minecraft/place_block)

::: info Was du brauchst

- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für jedes Programm
- zwei **Truhen**; in einer ein paar **Spitzhacken** und **Schaufeln**
- einen Hügel oder eine Felswand zum Hineingraben
- keine Rechte: MINE_BLOCK tut nur, was ein Spieler auch kann, darum funktioniert es für jeden Besitzer auf jedem Server

:::

## Die Idee

MINE_BLOCK baut einen Block ab wie ein Spieler. Es sucht das beste Werkzeug aus `tool_inventory` aus, eine Spitzhacke für Stein und eine Schaufel für Erde, und das Werkzeug nutzt sich ab, als hätte ein Spieler es benutzt. Das Programm wartet so lange, wie ein Spieler zum Abbauen brauchen würde. Die Drops kommen in `output_inventory`. Passen sie nicht hinein, löst MINE_BLOCK INVENTORY_FULL aus, und der Block bleibt.

Vor jedem Block muss das Programm entscheiden: abbauen, überspringen (in einer Höhle ist schon Luft) oder anhalten (Wasser, Lava, Grundgestein). Diese Entscheidung ist reine Rechnerei – eine Block-ID geht hinein, eine Aktion kommt heraus –, also bekommt sie eine eigene Funktion, die du ohne Hügel testen kannst.

## Die Entscheidung

<<< @/tutorials/programs/libraries/minecraft/tunnel-digger-rules.c0de

Der Programm-Runner prüft `decide` mit `minecraft:stone` (`mine`), `minecraft:cave_air` (`skip`) und `minecraft:lava` (`stop`).

## Der Gräber

<<< @/tutorials/programs/libraries/minecraft/tunnel-digger-dig.c0de

## Aufbauen und starten

1. Stell den Auslöserblock vor einem Hügel im Osten auf den Boden, mit einem freien Block zwischen ihm und dem Hügel. Der Tunnel beginnt 2 Blöcke östlich des Auslöserblocks und läuft nach Osten, auf der Höhe des Auslöserblocks und einen Block darüber.
2. Stell die Truhe mit den Werkzeugen 2 Blöcke nördlich des Auslöserblocks auf und die leere Truhe für die Drops 2 Blöcke südlich.
3. Stelle den Auslöserblock auf `tunneldigger` und `dig` ein und drück den Knopf.

Block für Block frisst sich der Tunnel in den Hügel, und die Truhe für die Drops füllt sich mit Bruchstein, Erde und den Erzen, die im Weg waren. Nach zehn Blöcken sagt der Chat `The tunnel is 10 blocks long.`

<!-- screenshot: tunnel-digger-tunnel | the entrance of the tunnel in the side of a hill, two blocks high, the trigger block in front of it, the tools chest on the left and the open drops chest on the right with cobblestone and coal -->

## So funktioniert es

- **Zwei Blöcke pro Schritt.** Die äußere Schleife zählt die Schritte in den Hügel, die innere die beiden Höhen, `dy` 0 und 1.
- **Erst schauen.** GET_BLOCK liest die ID, und `decide` sagt, was zu tun ist. Luft wird übersprungen, weil es nichts abzubauen gibt. Wasser, Lava und Grundgestein beenden den Durchlauf: MINE_BLOCK kann sie sowieso nicht abbauen, und ein Tunnel, der in Lava läuft, hält besser an.
- **Wenn etwas schiefgeht.** Der CALL von MINE_BLOCK fängt Fehler in `problem` auf. Eine volle Truhe für die Drops gibt INVENTORY_FULL; dann sagt das Programm, wie weit es gekommen ist, und hört auf.
- **Abgenutzte Werkzeuge.** Wenn die letzte Spitzhacke zerbricht, macht MINE_BLOCK mit bloßen Händen weiter. Das ist langsam, und Stein, mit bloßen Händen abgebaut, lässt nichts fallen. Behalte die Werkzeugtruhe im Auge.
- **Ein längerer Tunnel.** `length` hat den Standardwert 10. Leg eine INTEGER-Variablenkarte `length` mit 30 in den Auslöserblock, für einen Tunnel von 30 Blöcken. Das dauert eine Weile: Jeder Steinblock dauert so lange wie für einen Spieler.

## Probier es selbst

1. Beleuchte den Tunnel: Setz nach jedem sechsten Schritt eine Fackel aus der Werkzeugtruhe auf den Boden des Tunnels.

::: details Lösung
PLACE_BLOCK mit `inventory tools` nimmt die Fackel aus der Werkzeugtruhe, also funktioniert das auch für jeden Besitzer. Seine eigene ERROR-Variable `noTorch` fängt ITEM_MISSING auf, wenn die Fackeln aufgebraucht sind; der Tunnel geht im Dunkeln weiter.

<<< @/tutorials/programs/libraries/minecraft/tunnel-digger-torches.c0de

:::

2. Lass den Gräber auch bei Kies und Sand anhalten, die in den Tunnel fallen könnten.

::: details Lösung
Füg in `decide` ein weiteres IF ein: `id = "minecraft:gravel" OR id = "minecraft:sand"` gibt `"stop"`. Weil `decide` eine eigene Funktion ist, ist das die einzige Änderung – und ein Test mit `minecraft:gravel` zeigt, dass sie funktioniert.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [MINE_BLOCK](/de/c0de/minecraft/mine_block), [GET_BLOCK](/de/c0de/minecraft/get_block), [PLACE_BLOCK](/de/c0de/minecraft/place_block) und [SAY](/de/c0de/minecraft/say)
- [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung: warum MINE_BLOCK für alle funktioniert
- [Bauen](/de/tutorials/libraries/c0de/minecraft/building): PLACE_BLOCK aus einer Truhe
- [Fehler](/de/c0de/guide/language#fehler) in der Anleitung: einen Fehler im CALL auffangen
