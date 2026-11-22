---
description: Ein Kopiergerät für Gebäude, das ein Gebäude mit CANVAS_FROM_WORLD in eine Leinwand liest und es mit RENDER_CANVAS weiter weg noch einmal baut, auf Wunsch gedreht, aus den Blöcken einer Truhe, mit den Werkzeugen einer zweiten und einer dritten Truhe für das, was im Weg ist.
---

# Gebäude kopieren

Ein Programm als Kopiergerät: Es liest ein Gebäude Block für Block in eine Leinwand und baut es ein zweites Mal, 12 Blöcke weiter östlich – in dieselbe Richtung oder gedreht. Die Blöcke für die Kopie kommen aus einer Truhe, was im Weg ist, wird mit den Werkzeugen aus einer zweiten Truhe abgebaut, und alles landet in einer dritten. So würde es ein Spieler machen, also funktioniert es für jeden Spieler auf jedem Server.

**Funktionen:** [CANVAS_FROM_WORLD](/de/c0de_paint/cpaint/canvas_from_world) und [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas) mit `input`, `tools` und `output`, mit [CANVAS_ROTATE](/de/c0de_paint/cpaint/canvas_rotate), [CANVAS_MIN](/de/c0de_paint/cpaint/canvas_min-and-canvas_max) und in Aufgabe 1 [CANVAS_MATERIALS](/de/c0de_paint/cpaint/canvas_materials)

::: info Was du brauchst

- die Mods **c0de** und **c0de paint**
- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für jedes Programm
- ein kleines **Gebäude** zum Kopieren, bis zu 7 × 7 Blöcke und 6 hoch – eine Hütte, einen Brunnen, eine Statue
- drei **Truhen**: eine für die **Blöcke** der Kopie, eine mit **Werkzeugen** (eine Spitzhacke, eine Schaufel und eine Axt) und eine leere für das, was abgebaut wird
- für den Probelauf: **42 Bruchstein** und **1 Bruchsteintreppe**
- freien Boden von 7 × 7 Blöcken für die Kopie, von 14 bis 20 Blöcke östlich des Auslöserblocks
- keine Rechte: Mit `input` tut RENDER_CANVAS nur, was ein Spieler auch kann

:::

## Die Idee

[CANVAS_FROM_WORLD](/de/c0de_paint/cpaint/canvas_from_world) ist das Gegenstück zu RENDER_CANVAS: Es liest die Blöcke der Welt zwischen zwei Ecken in eine neue Leinwand, mit ihren Zuständen – die Treppen behalten ihr `facing`, die Türen ihr Scharnier. Die Ecke `from` wird zum Voxel 0, 0, 0. Mit `air TRUE` wird Luft in der Leinwand zu Luft, nicht zu einem nicht gesetzten Voxel. Dann räumt die Kopie auch das Innere des Gebäudes frei.

Danach kann die Leinwand überallhin: [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas) setzt ihr Voxel 0, 0, 0 bei `position`. Mit `input` erschafft es keine Blöcke aus dem Nichts:

- die Blöcke kommen zuerst aus dem Inventar `output`, dann aus `input`;
- ein Block im Weg wird mit den Werkzeugen aus `tools` abgebaut, die dabei abnutzen, und was er fallen lässt, kommt nach `output`;
- vor dem ersten Block prüft RENDER_CANVAS alles: die Chunks (CHUNK_NOT_LOADED), die Blöcke in den Truhen (ITEM_MISSING) und ein Werkzeug für jeden Block, der eines braucht. Ein fehlender Block hinterlässt keine halbe Kopie.

Die Welt lesen geht nur im Spiel: Der Programm-Runner hat keine Welt. Darum hat das Programm zwei Teile. `place` dreht eine Leinwand, findet ihre Ecke und baut sie – woher die Leinwand kommt, ist ihm egal. `copy` liest die Leinwand aus der Welt und gibt sie an `place`. Und `sample` zeichnet eine kleine Hütte und gibt sie auch an `place`: ein Probelauf für die Truhen und für den Programm-Runner.

## Das Kopiergerät

<<< @/tutorials/programs/libraries/paint/copying-buildings-copier.c0de

Der Programm-Runner prüft `copy`, das bei CANVAS_FROM_WORLD mit INVALID_ARGUMENT anhält, und `sample` ohne und mit `turn` 90: Er vergleicht jeden Block der Hütte mit einer Liste, die Stufe eingeschlossen.

## Aufbauen und starten

1. Such dir ein Gebäude aus. Stell den Auslöserblock mit dem Knopf 2 Blöcke westlich seiner Nordwestecke auf denselben Boden. Das Programm kopiert die 7 × 7 Blöcke von 2 bis 8 Blöcke östlich des Auslöserblocks und von seiner Reihe bis 6 Blöcke südlich davon, von der Höhe des Auslöserblocks bis 5 Blöcke darüber.
2. Stell die drei Truhen auf: die für die Blöcke 2 Blöcke nördlich des Auslöserblocks, die mit den Werkzeugen 2 Blöcke westlich, die leere 2 Blöcke südlich.
3. Zuerst der Probelauf: Leg den Bruchstein und die Bruchsteintreppe in die Truhe für die Blöcke. Stelle den Auslöserblock auf `copier` und `sample` ein und drück den Knopf. 14 Blöcke östlich des Auslöserblocks erscheint eine kleine Hütte aus Bruchstein, mit einer Stufe vor ihrer Türöffnung auf der Nordseite.
4. Lass die Hütte stehen: Sie steht da, wo die Kopie stehen wird, also baut die Kopie sie ab, und ihr Bruchstein landet in der Truhe im Süden.
5. Jetzt das Gebäude: Füll die Truhe für die Blöcke mit allem, woraus das Gebäude besteht (Aufgabe 1 sagt dir, was das ist). Stell die Funktion auf `copy` um und drück den Knopf.

Die Kopie wächst von unten nach oben. Was im Weg ist – die Probehütte, hohes Gras, eine Blume –, wird abgebaut und landet in der Truhe im Süden. Für eine gedrehte Kopie leg eine INTEGER-Variablenkarte `turn` mit 90, 180 oder 270 in den Auslöserblock.

<!-- screenshot: copying-buildings-copy | a small house with a door and stairs on the left, its copy turned by 90° on the right, the trigger block in front of the original with the three chests around it, the south chest open with grass and dirt in it -->

## So funktioniert es

- **Der Bereich.** `copy` berechnet die beiden Ecken vom Auslöserblock aus: `from` 2 Blöcke östlich davon auf seiner Höhe, `to` `width - 1`, `height - 1` und `depth - 1` weiter. `width`, `height` und `depth` haben Standardwerte, für ein größeres Gebäude brauchst du also nur Variablenkarten mit denselben Namen.
- **Auch Luft.** `air TRUE` kopiert auch die Luft des Bereichs. Luft-Voxel lassen RENDER_CANVAS abbauen, was der Kopie im Weg steht – auch im Inneren des Gebäudes. Ohne das würde die Kopie nur Blöcke hinzufügen, und das Gras im Inneren bliebe stehen.
- **Was nicht kopiert wird.** CANVAS_FROM_WORLD kopiert Blöcke und ihre Zustände, aber nicht den Inhalt von Truhen und andere Blockdaten: Eine Truhe im Gebäude wird leer kopiert und ein Schild ohne seinen Text. `from` wird zum Voxel 0, 0, 0, und eine Leinwand endet standardmäßig beim Voxel 127 (die Einstellung `canvasMax`), also löst ein Bereich von mehr als 128 Blöcken auf einer Achse CANVAS_LIMIT aus.
- **Drehen.** `place` dreht eine Kopie der Leinwand mit [CANVAS_ROTATE](/de/c0de_paint/cpaint/canvas_rotate) um die `y`-Achse durch 0, 0, 0. Treppen, Türen, Fackeln an Wänden und Stämme drehen sich mit. Mit `turn` 0 ändert sich nichts.
- **Zurück in die Ecke.** Nach dem Drehen liegt das Gebäude bei negativem `x` oder `z`. [CANVAS_MIN](/de/c0de_paint/cpaint/canvas_min-and-canvas_max) gibt seine unterste Ecke `low`, und das Programm zieht sie von der Position ab: Egal wie es gedreht ist, die unterste Ecke landet `distance` Blöcke östlich der Ecke des Originals.
- **Die drei Truhen.** `blocks`, `tools` und `rubble` sind die Positionen der Truhen, 2 Blöcke nördlich, westlich und südlich des Auslöserblocks. RENDER_CANVAS nimmt die Blöcke zuerst aus `rubble`, dann aus `blocks`: Ein abgebauter Erdblock kann gleich wieder in die Kopie wandern.
- **Wenn etwas schiefgeht.** Das Programm fängt keine Fehler auf: Der Dialog des Auslöserblocks zeigt sie. ITEM_MISSING sagt, welcher Block fehlt, und noch ist nichts gebaut. Ein Werkzeug, das zerbricht, oder eine volle Truhe `rubble` (INVENTORY_FULL) hält die Kopie mittendrin an; die Meldung sagt, wie viele Blöcke gesetzt wurden, und ein neuer Druck auf den Knopf macht weiter, weil Blöcke, die schon an ihrem Platz sind, übersprungen werden. Grundgestein im Weg, der Spawnschutz oder ein Blatt lösen PERMISSION_DENIED aus.

## Probier es selbst

1. Bevor du die Truhe füllst: Lass ein zweites Programm im Chat sagen, welche Blöcke die Kopie braucht und wie viele.

::: details Lösung
[CANVAS_MATERIALS](/de/c0de_paint/cpaint/canvas_materials) gibt einen HASH von Block-id zu Anzahl, ohne Luft. Das Programm liest denselben Bereich wie `copy`, also stell es auf ein zweites Blatt und seinen Auslöserblock dorthin, wo der Auslöserblock des Kopiergeräts steht – oder stell den Auslöserblock des Kopiergeräts einfach kurz auf `copylist` und `list` um.

<<< @/tutorials/programs/libraries/paint/copying-buildings-list.c0de

:::

2. Mach ein Spiegelbild des Gebäudes statt einer gedrehten Kopie.

::: details Lösung
Ersetze CANVAS_ROTATE in `place` durch [CANVAS_MIRROR](/de/c0de_paint/cpaint/canvas_mirror) mit `axis "x"`. Ohne `position` spiegelt es in der Mitte der Grenzen, die Leinwand bleibt also, wo sie ist. Türen bekommen ihr Scharnier auf der anderen Seite, und Treppen, die nach Osten zeigten, zeigen nach Westen.
:::

3. Stell eine Truhe mit ein paar Gegenständen in das Gebäude und kopiere es. Was ist in der kopierten Truhe?

::: details Lösung
Nichts: CANVAS_FROM_WORLD kopiert den Truhenblock mit seinem `facing`, aber nicht, was darin ist. Ein Kopiergerät für Gegenstände wäre ein bisschen zu gut.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [CANVAS_FROM_WORLD](/de/c0de_paint/cpaint/canvas_from_world), [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas), [CANVAS_ROTATE](/de/c0de_paint/cpaint/canvas_rotate), [CANVAS_MIN und CANVAS_MAX](/de/c0de_paint/cpaint/canvas_min-and-canvas_max), [CANVAS_MATERIALS](/de/c0de_paint/cpaint/canvas_materials) und [CANVAS_MIRROR](/de/c0de_paint/cpaint/canvas_mirror)
- [Leinwände umformen](/de/tutorials/libraries/c0de_paint/cpaint/shaping-canvases): eine Leinwand verschieben, drehen, spiegeln und skalieren
- [Eine erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas): der Anfang mit Leinwänden und das Bauen aus einer Truhe
- [Erste Schritte](/de/c0de_paint/cpaint/getting-started) mit c0de paint, seine Einstellungen und seine [Fehler](/de/c0de_paint/cpaint/errors)
- [Ein Tunnelgräber](/de/tutorials/libraries/c0de/minecraft/tunnel-digger): Werkzeuge aus einer Truhe, Drops in eine andere, mit MINE_BLOCK
- [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung: warum `input` für alle funktioniert
