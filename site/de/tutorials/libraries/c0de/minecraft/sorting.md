---
description: Ein Sortierer, der eine Eingangstruhe mit GET_INVENTORY liest und jeden Gegenstand mit MOVE_ITEMS in die Truhe für seine Art verschiebt, und ein Mülleimer, der sich mit DELETE_ITEMS selbst leert.
---

# Das Lager sortieren

Wirf alles, was du nach Hause bringst, in eine Truhe, und ein Programm sortiert es: Baublöcke in eine Truhe, Essen in eine andere. Was es nicht kennt, bleibt in der Eingangstruhe. Daneben steht ein Mülleimer, der sich selbst leert.

**Funktionen:** [GET_INVENTORY](/de/c0de/minecraft/get_inventory), [MOVE_ITEMS](/de/c0de/minecraft/move_items), [DELETE_ITEMS](/de/c0de/minecraft/delete_items) und [SAY](/de/c0de/minecraft/say)

::: warning Braucht einen Operator – zum Teil
Der Sortierer funktioniert für jeden Besitzer, auf jedem Server: MOVE_ITEMS tut nur, was ein Spieler tut, der die Gegenstände von Truhe zu Truhe trägt, darum muss der Besitzer des Zeitgeberblocks nur beide Truhen öffnen können – sie dürfen nicht verschlossen sein und nicht im Spawnschutz stehen. Beim Mülleimer ist es anders: DELETE_ITEMS lässt Gegenstände verschwinden, darum funktioniert es nur, wenn der Besitzer ein Operator ist – in der Welt der Tutorials bist du einer – oder wenn der Server es mit `allowInventoryChanges=true` in `config/c0de.properties` für alle erlaubt; sonst stürzt das Programm mit PERMISSION_DENIED ab. Dasselbe gilt für Übung 1. Ein Server kann MOVE_ITEMS mit `enableMoveItems=false` auch für alle abschalten.
:::

::: info Was du brauchst

- ein leeres Blatt für jedes Programm
- für den Sortierer: einen **Zeitgeberblock**, drei **Truhen** und einen **Trichter**, dazu etwas Bruchstein, Brot und einen Diamanten
- für den Mülleimer: einen zweiten **Zeitgeberblock**, eine vierte **Truhe** und etwas verrottetes Fleisch
- für die Übungen: verrottetes Fleisch, giftige Kartoffeln, ein paar Erze, Roheisen oder Diamanten und eine fünfte **Truhe**

:::

## Die Idee

GET_INVENTORY gibt den Inhalt einer Truhe als Array von [ITEM_STACK](/de/c0de/minecraft/position-entity-and-item_stack)-Strukturen, eine pro Platz: Jede hat eine `id`, etwa `minecraft:bread`, und eine Anzahl `count`. Ein leerer Platz hat die ID `""` und die Anzahl 0.

MOVE_ITEMS verschiebt bis zu `count` Gegenstände mit einer `id` von einem Inventar in ein anderes und sagt, wie viele es verschoben hat – weniger, wenn das Ziel voll ist. Wie ein Spieler braucht es dafür einen Moment: Das Programm wartet für jeden Stapel, den es trägt, einen Tick. DELETE_ITEMS entfernt Gegenstände für immer.

Was wohin kommt, ist eine Entscheidung für sich, und es ist reine Rechnerei: Eine Gegenstands-ID geht hinein, eine Truhennummer kommt heraus. Diesen Teil kannst du leicht ohne jede Truhe testen.

## Die Regeln

<<< @/tutorials/programs/libraries/minecraft/sorting-rules.c0de

`chestFor` gibt 1 für Baublöcke, 2 für Essen und 0 für alles andere. Der Programm-Runner prüft es mit `minecraft:dirt` (1), `minecraft:bread` (2) und `minecraft:diamond` (0).

## Der Sortierer

<<< @/tutorials/programs/libraries/minecraft/sorting-sorter.c0de

## Aufbauen und starten

Stell alles in eine Reihe von Westen nach Osten:

| Was                     | Wo, vom Zeitgeberblock aus gesehen |
| ----------------------- | ---------------------------------- |
| die Eingangstruhe       | 2 Blöcke östlich                   |
| Truhe 1, Baublöcke      | 4 Blöcke östlich                   |
| Truhe 2, Essen          | 6 Blöcke östlich                   |

Lass einen Block zwischen ihnen frei: Zwei Truhen nebeneinander werden zu einer großen Truhe. Auch die Eingangstruhe berührt den Zeitgeberblock nicht, sonst würde er sie als seine Ausgabe nehmen. Setz den Trichter oben auf die Eingangstruhe, dann kannst du Gegenstände von oben hineinwerfen.

Stelle den Zeitgeberblock auf `sorter` und `sort` ein, mit einem Abstand von 100 Ticks. Wirf Bruchstein, Brot und einen Diamanten in den Trichter: Innerhalb von fünf Sekunden ist der Bruchstein in Truhe 1, das Brot in Truhe 2, und der Diamant bleibt in der Eingangstruhe.

<!-- screenshot: sorting-chests | the row of chests seen from the side, the hopper on the input chest, the timer block to the west, and the open food chest with bread and apples -->

## So funktioniert es

- **EACH slot.** Die Schleife geht durch alle 27 Plätze der Eingangstruhe. Für einen leeren Platz gibt `chestFor` 0, wie für einen unbekannten Gegenstand, und nichts passiert.
- **Das Ziel** ist eine Kopie der Eingangsposition, deren `x` pro Truhennummer 2 Blöcke nach Osten rückt: `input.x + 2 * chest`. Eine dritte Truhe stünde einfach 2 Blöcke weiter.
- **Tragen braucht Zeit.** Jedes MOVE_ITEMS wartet für jeden verschobenen Stapel einen Tick, solange die Truhen weniger als 128 Blöcke auseinander stehen. Eine volle Eingangstruhe ist in gut einer Sekunde sortiert – weit innerhalb der 100 Ticks des Zeitgebers.
- **Eine volle Truhe.** MOVE_ITEMS gibt zurück, wie viele Gegenstände es verschoben hat. Sind das weniger, als der Platz hatte, ist das Ziel voll, und der Chat sagt es. Der Rest bleibt in der Eingangstruhe und wird im nächsten Durchlauf wieder versucht.

## Der Mülleimer

Das zweite Programm ist eine Truhe, die alles frisst, was du hineinlegst.

<<< @/tutorials/programs/libraries/minecraft/sorting-trash.c0de

Stell eine Truhe 2 Blöcke östlich des zweiten Zeitgeberblocks auf, stelle den Zeitgeberblock auf `trashcan` und `empty` ein, mit einem Abstand von 200 Ticks, und leg verrottetes Fleisch in die Truhe. Innerhalb von zehn Sekunden ist es weg, und der Chat sagt, wie viele Gegenstände gefressen wurden. DELETE_ITEMS gibt wie MOVE_ITEMS zurück, wie viele es entfernt hat.

## Probier es selbst

1. Lass den Sortierer verrottetes Fleisch und giftige Kartoffeln sofort löschen, statt sie in der Eingangstruhe zu lassen.

::: details Lösung
Eine dritte Liste, `junk`, für die `chestFor` -1 gibt. Der Sortierer ruft für diese Plätze DELETE_ITEMS statt MOVE_ITEMS auf.

<<< @/tutorials/programs/libraries/minecraft/sorting-junk.c0de

:::

2. Alles Unbekannte soll in eine Truhe 3 kommen, 8 Blöcke östlich des Zeitgeberblocks, statt in der Eingangstruhe zu bleiben.

::: details Lösung
Fang `chestFor` mit `ASSIGN chest 3 ;` an. Die beiden Listen überschreiben das dann für die bekannten Gegenstände. Leere Plätze bekommen auch 3, aber `slot.count > 0` überspringt sie.
:::

3. Verschiebe vor dem Sortieren alle Erze, Rohmetalle, Diamanten und Smaragde in eine Truhe 3, 8 Blöcke östlich des Zeitgeberblocks – mit einem einzigen MOVE_ITEMS, ohne die Plätze anzuschauen. (Wenn du Übung 2 gemacht hast, landen dort auch die unbekannten Gegenstände, und das ist in Ordnung.)

::: details Lösung
Statt `id` nimmt MOVE_ITEMS einen Filter `filter`: eine Gegenstands-ID oder eine Suche wie im Suchfeld von JEI. `$ores` passt auf alle Gegenstände mit einem Tag, der „ores“ enthält, etwa `minecraft:iron_ores` – die Erzblöcke aller Mods, die sie so markieren. `&raw_` passt auf alle Gegenstände, deren ID `raw_` enthält, wie `minecraft:raw_iron`. Ein Array von Filtern passt auf jeden Gegenstand, auf den einer davon passt, darum ergänzen die zwei Gegenstands-IDs die Liste. Mit `count` -1 nimmt MOVE_ITEMS alle passenden Gegenstände aus allen Plätzen auf einmal.

<<< @/tutorials/programs/libraries/minecraft/sorting-ores.c0de

Jetzt bleibt auch der Diamant nicht mehr in der Eingangstruhe. Weitere Wörter des Filters: `@create` für alle Gegenstände der Mod Create, `-wort` für Gegenstände, die nicht passen dürfen, und `|` zwischen Alternativen: `"$ores | &raw_"` ist dasselbe wie die ersten beiden Elemente des Arrays.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [GET_INVENTORY](/de/c0de/minecraft/get_inventory), [MOVE_ITEMS](/de/c0de/minecraft/move_items), [DELETE_ITEMS](/de/c0de/minecraft/delete_items) und [SAY](/de/c0de/minecraft/say)
- [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern) und [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung
- [Programme in der Welt](/de/tutorials/programmers/world): wer was darf, und warum eine Truhe neben einem Auslöserblock seine Ausgabe wird
- [EACH-Schleifen](/de/c0de/guide/language#each-schleifen) in der Anleitung
