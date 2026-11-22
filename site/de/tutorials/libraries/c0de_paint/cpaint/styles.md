---
description: Eine Mauer aus gemischtem Stein mit STYLE_RANDOM, ein Sonnenuntergang aus Wolle mit STYLE_GRADIENT, ein Schachbrettboden mit STYLE_PATTERN, Stämme mit Blockzuständen und die Blöcke einer Truhe als Palette mit INVENTORY_BLOCKS.
---

# Stile

Ein Stil entscheidet, wie eine Form gezeichnet wird. Bisher war das ein Block. Dieses Rezept malt mit mehr: eine Stadtmauer aus Steinziegeln mit Moos und Rissen an zufälligen Stellen, ein Sonnenuntergang aus Wolle dahinter, ein Schachbrettboden und Streifen in den Farben dessen, was du in eine Truhe legst.

**Funktionen:** [STYLE_RANDOM](/de/c0de_paint/cpaint/style_random), [STYLE_GRADIENT](/de/c0de_paint/cpaint/style_gradient), [STYLE_PATTERN](/de/c0de_paint/cpaint/style_pattern), [STYLE_NONE](/de/c0de_paint/cpaint/style_none), [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty) und [INVENTORY_BLOCKS](/de/c0de_paint/cpaint/inventory_blocks) sowie Blockzustände in einem [BLOCK](/de/c0de_paint/cpaint/block)

::: warning Braucht einen Operator
Diese Programme rufen [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas) ohne `input` auf, also kommen die Blöcke aus dem Nichts und ersetzen, was im Weg ist. Das funktioniert nur, wenn der Besitzer des Auslöserblocks ein Operator ist oder der Server es mit `allowBlockChanges=true` in `config/c0de.properties` erlaubt; sonst löst RENDER_CANVAS PERMISSION_DENIED aus. In einer Einzelspielerwelt mit Cheats bist du Operator. Wie du stattdessen aus einer Truhe baust, zeigen [Eine erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas) und Aufgabe 4.
:::

::: info Was du brauchst

- die Mods **c0de** und **c0de paint**
- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für jedes Programm
- für die Palette: eine **Truhe** mit ein paar Stapeln Blöcke, etwa 64 **Sandstein**, 32 **glatten Sandstein** und 32 **Keramik**
- freien Platz: 17 Blöcke breit und 11 hoch nördlich des Auslöserblocks für die Mauer und den Sonnenuntergang, und 8 × 8 Blöcke östlich davon für den Boden

:::

## Die Idee

Jede Form hat bis zu drei Teile, jeder mit eigenem Stil: die Linien (`line_style`), die Flächen (`side_style`) und das Innere (`fill_style`). Stile sind Werte wie alle anderen: Ein Programm erzeugt sie mit den STYLE-Funktionen, hebt sie in Variablen auf und gibt sie den Zeichenfunktionen. Außer [STYLE_SOLID](/de/c0de_paint/cpaint/style_solid) gibt es:

| Stil                                                   | zeichnet                                                                           |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| [STYLE_NONE](/de/c0de_paint/cpaint/style_none)         | nichts: Die Voxel bleiben, wie sie sind                                            |
| [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty)       | Luft, die Blöcke entfernt                                                          |
| [STYLE_RANDOM](/de/c0de_paint/cpaint/style_random)     | für jedes Voxel einen zufälligen Block einer Liste                                 |
| [STYLE_GRADIENT](/de/c0de_paint/cpaint/style_gradient) | die Blöcke einer Liste nacheinander, nach dem Abstand von einem Punkt: ein Verlauf |
| [STYLE_PATTERN](/de/c0de_paint/cpaint/style_pattern)   | eine kleine Leinwand, immer wieder: ein Muster                                     |

## Die Mauer

<<< @/tutorials/programs/libraries/paint/styles-wall.c0de

## Aufbauen und starten

Stell dich hinter den Auslöserblock und schau nach Norden. Stelle ihn auf `stonewall` und `build` ein und drück den Knopf. Die Mauer wächst 3 Blöcke nördlich des Auslöserblocks: 13 Blöcke lang, mit dem Auslöserblock vor ihrer Mitte, und 5 hoch. Ein Tor, 3 Blöcke breit und 3 hoch, führt mitten hindurch.

Drück den Knopf noch einmal: Die Mauer bekommt jedes Mal neues Moos und neue Risse.

<!-- screenshot: styles-wall | the city wall of stone bricks with mossy and cracked bricks in random places and the gate in its middle, seen from the trigger block, with the wool sunset in its frame of logs rising behind the wall -->

## So funktioniert es

- **Eine Liste von Blöcken.** `stones` ist ein ARRAY von BLOCKs. Das Programm füllt einen BLOCK, `stone`, und kopiert ihn dreimal in die Liste, jedes Mal mit neuer id und neuem Gewicht.
- **Gewichte.** [STYLE_RANDOM](/de/c0de_paint/cpaint/style_random) wählt für jedes Voxel einen Block. Die Chance eines Blocks ist sein Gewicht geteilt durch die Summe: 6 von 10 Voxeln werden einfache Steinziegel, 3 bemooste und 1 rissiger – im Durchschnitt.
- **Ein voller Quader.** Die Mauer ist ein Quader, 1 Voxel dick, nur mit einem `fill_style` gezeichnet. Ein Quader ohne Linien- und Flächenstil ist voll: Linien und Flächen übernehmen den Stil des Inneren.
- **Die Leinwand geht in beide Richtungen.** Die Mauer reicht von `- half` bis `half`, also liegt das Voxel 0, 0, 0 in ihrer Mitte. RENDER_CANVAS setzt dieses Voxel an `site`, genau vor den Auslöserblock, 3 Blöcke nördlich. Negative Koordinaten sind in einer Leinwand kein Problem.
- **Das Tor** ist ein zweiter Quader von -1 bis 1, 3 hoch, gezeichnet mit [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty): Luft ersetzt dort die Steine. Luft wird gezeichnet wie ein Block – beim Bauen entfernt sie den Block in der Welt.
- **Jedes Mal neu.** Die Zufallszahlen kommen vom Prozess, wie bei RANDOM. Jeder Lauf zeichnet eine andere Mauer.

## Der Sonnenuntergang

Das zweite Programm malt ein Bild: einen Sonnenuntergang aus Wolle, 15 Blöcke breit und 9 hoch, in einem Rahmen aus Eichenstämmen.

<<< @/tutorials/programs/libraries/paint/styles-sunset.c0de

Lass den Auslöserblock, wo er ist, stelle ihn auf `sunset` und `paint` ein und drück den Knopf. Das Bild steht 4 Blöcke nördlich des Auslöserblocks, direkt hinter der Mauer: Die Sonne geht im Tor unter, und der Himmel steigt über der Mauer auf.

- **Ein Verlauf.** [STYLE_GRADIENT](/de/c0de_paint/cpaint/style_gradient) zeichnet die Blöcke der Liste nacheinander, nach dem Abstand von `from`. `from` ist die Sonne, in der Mitte der untersten Reihe des Bilds. Ohne `axes` zählt der Abstand in alle Richtungen, also bilden die Farben auf einer flachen Wand Kreise um die Sonne: gelb, orange, rot, magenta, violett und blau.
- **Die Gewichte** geben den Anteil jeder Farbe. Gelb, orange und rot haben 2, magenta und violett 1, der blaue Himmel 3. Ohne `to` endet der Verlauf am Voxel, das am weitesten von der Sonne entfernt ist, in den oberen Ecken.
- **`fuzzy 1`** verwischt die Grenzen zwischen den Farben: In der Reihe neben einer Grenze nimmt ein Voxel mit einer Chance von 50 % die Nachbarfarbe.
- **Blockzustände.** Ein Stamm hat den Zustand `axis`: `y` steht aufrecht, `x` liegt von Ost nach West. `log.properties["axis"]` setzt ihn, genau wie die Zustände bei [PLACE_BLOCK](/de/c0de/minecraft/place_block). Die `posts` haben keinen Zustand – ein aufrechter Stamm ist der Standard.
- **Der Rahmen.** Ein Quader mit nur einem `line_style` besteht nur aus seinen Kanten: Um ein flaches Bild ist das der Rand. Dann überschreiben zwei Quader die oberste und die unterste Reihe mit `beams`, außer den Ecken. [CANVAS_MATERIALS](/de/c0de_paint/cpaint/canvas_materials) würde beide Arten von Stämmen als `minecraft:oak_log` zählen: Für die Materialien spielen die Zustände keine Rolle.

## Der Boden

<<< @/tutorials/programs/libraries/paint/styles-floor.c0de

Stelle den Auslöserblock auf `floor` und `lay` ein und drück den Knopf. Der Boden ersetzt den Untergrund östlich des Auslöserblocks: 8 × 8 Blöcke ab 2 Blöcke östlich davon, in seiner Reihe beginnend und nach Süden reichend, aus schwarzem und weißem Beton mit einem Rand aus Schwarzeichenholzbrettern. Für einen Boden ohne Rand leg eine BOOLEAN-Variablenkarte `border` mit `FALSE` in den Auslöserblock.

<!-- screenshot: styles-floor | the chequered floor of black and white concrete, 8 × 8 blocks, with its border of dark oak planks, set into the grass east of the trigger block, seen from above -->

- **Die Fliese.** `tile` ist eine eigene Leinwand, 2 × 1 × 2 Voxel: ein schwarzer Quader mit zwei weißen Voxeln auf der Diagonale, gezeichnet mit [DRAW_BLOCK](/de/c0de_paint/cpaint/draw_block).
- **Das Muster.** [STYLE_PATTERN](/de/c0de_paint/cpaint/style_pattern) wiederholt die Fliese entlang aller Achsen, beginnend bei 0, 0, 0. Jedes Voxel des Bodens nimmt das Voxel der Fliese an seiner Stelle.
- **STYLE_NONE mit Absicht.** Ohne Rand wird `edge` zu [STYLE_NONE](/de/c0de_paint/cpaint/style_none). Ein Teil mit STYLE_NONE übernimmt den Stil des nächsten Teils weiter innen, also bekommen auch die Kanten des Bodens das Muster. Eine neue STYLE-Variable enthält ohnehin STYLE_NONE; der Aufruf macht es sichtbar.
- **In den Boden.** `site.y` liegt eins unter dem Auslöserblock, also liegt der Boden bündig im Untergrund und ersetzt Gras und Erde.

## Die Palette

Statt die Blöcke ins Programm zu schreiben, nimm sie aus einer Truhe. [INVENTORY_BLOCKS](/de/c0de_paint/cpaint/inventory_blocks) liest sie: in der Reihenfolge der Slots, mit der Zahl der Gegenstände als Gewicht – eine Liste, fertig für STYLE_RANDOM und STYLE_GRADIENT.

<<< @/tutorials/programs/libraries/paint/styles-palette.c0de

Stell den Auslöserblock an einen freien Platz und die Truhe 2 Blöcke westlich davon, mit 64 Sandstein im ersten Slot, 32 glattem Sandstein im zweiten und 32 Keramik im dritten. Stelle den Auslöserblock auf `palette` und `build` ein und drück den Knopf. Eine Wand, 16 Blöcke lang und 4 hoch, erscheint 2 Blöcke östlich des Auslöserblocks, in Streifen: 8 Blöcke Sandstein, 4 glatter Sandstein, 4 Keramik, mit verwischten Grenzen. Die Truhe behält ihre Blöcke; sie ist nur die Palette.

<!-- screenshot: styles-palette | the open chest with sandstone, smooth sandstone and terracotta in its first three slots, and the striped wall 16 blocks long beside it, sandstone fading to smooth sandstone and terracotta from west to east -->

- **Zwei Funktionen.** `build` liest die Truhe und gibt die Liste an `show` weiter, das zeichnet und baut. `show` funktioniert mit jeder Liste von Blöcken, also lässt es sich auch ohne Truhe ausprobieren.
- **Streifen.** `axes "x"` misst den Abstand von `a` nur entlang x, also haben alle Voxel einer Spalte denselben Abstand: Der Verlauf wird zu senkrechten Streifen. Die 128 Gegenstände teilen sich die 16 Blöcke der Wand: 64 Sandstein bekommen die Hälfte davon.
- **Deine eigene Palette.** Ändere die Reihenfolge der Slots, und die Streifen ändern ihre Reihenfolge. Wolle, Beton oder Glas in vielen Farben ergeben einen Regenbogen.

## Probier es selbst

1. Die Mauer wird alt: mehr Moos und hier und da ein Block Bruchstein.

::: details Lösung
Gib `mossy_stone_bricks` das Gewicht 5 und füge einen vierten Block hinzu:

```c0de
ASSIGN stone.id "cobblestone" ;
ASSIGN stone.weight 1 ;
ASSIGN stones[3] stone ;
```

Jetzt ergeben die Gewichte 13: 6 von 13 Voxeln sind einfache Steinziegel, 5 bemooste, 1 rissiger und 1 Bruchstein.
:::

2. Mal den Himmel in waagrechten Bändern statt in Kreisen.

::: details Lösung
Ergänze `PARAMETER axes "y" ;` bei STYLE_GRADIENT. Jetzt zählt nur die Höhe: Die Reihe der Sonne ist gelb, und die Farben folgen in Schichten bis zum Blau ganz oben.
:::

3. Ein Parkettboden: entrindete Eichenstämme, abwechselnd von Ost nach West und von Nord nach Süd liegend, wie die Felder des Schachbrettbodens.

::: details Lösung
Die Fliese hat zwei Stile desselben Blocks mit verschiedenen Zuständen: `axis` `x` liegt von Ost nach West, `z` von Nord nach Süd.

<<< @/tutorials/programs/libraries/paint/styles-parquet.c0de

:::

4. Bau die Palettenwand aus der Truhe selbst, mit STYLE_RANDOM statt des Verlaufs. Klappt das immer?

::: details Lösung
Ersetze den Aufruf von STYLE_GRADIENT durch

```c0de
CALL c0de_paint/cpaint/STYLE_RANDOM
    PARAMETER blocks palette ;
    RESULT result stripes
```

Dann gib `show` einen dritten Parameter `chest`, den `build` weiterreicht, und RENDER_CANVAS die Zeile `PARAMETER input chest ;`, wie beim Gartenhaus aus [Eine erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas). Jetzt nimmt die Wand ihre 64 Blöcke aus der Truhe. Mit 128 Gegenständen für 64 Blöcke reicht es fast immer von jedem. Füllst du die Truhe aber mit genau 64 Gegenständen, passen die zufälligen Blöcke nicht dazu: Wo die Truhe 32 Sandstein hat, will ein Lauf 35, der nächste 29. RENDER_CANVAS prüft die Truhe vor dem ersten Block und löst ITEM_MISSING aus, wenn ein Block fehlt – ohne einen einzigen zu setzen. Ein Verlauf ohne `fuzzy` kennt solche Überraschungen nicht: Seine Streifen sind immer gleich breit.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [STYLE_RANDOM](/de/c0de_paint/cpaint/style_random), [STYLE_GRADIENT](/de/c0de_paint/cpaint/style_gradient), [STYLE_PATTERN](/de/c0de_paint/cpaint/style_pattern), [STYLE_NONE](/de/c0de_paint/cpaint/style_none), [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty), [INVENTORY_BLOCKS](/de/c0de_paint/cpaint/inventory_blocks), [DRAW_BOX](/de/c0de_paint/cpaint/draw_box), [DRAW_BLOCK](/de/c0de_paint/cpaint/draw_block) und [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas)
- Die Typen [STYLE](/de/c0de_paint/cpaint/style) und [BLOCK](/de/c0de_paint/cpaint/block), mit Gewichten und Blockzuständen
- [Eine erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas): aus einer Truhe bauen, für jeden Spieler
- [Erste Schritte](/de/c0de_paint/cpaint/getting-started) mit c0de paint und seine [Fehler](/de/c0de_paint/cpaint/errors)
- [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern) und [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung
