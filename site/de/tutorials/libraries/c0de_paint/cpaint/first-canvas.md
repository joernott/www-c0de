---
description: Ein Gartenhaus, mit DRAW_BOX in eine Leinwand gezeichnet und mit RENDER_CANVAS aus den Blöcken einer Truhe gebaut, und die Liste der Blöcke, die es braucht, mit CANVAS_MATERIALS und CANVAS_COUNT.
---

# Eine erste Leinwand

Ein Programm als Architekt: Es zeichnet ein Gartenhaus aus Eichenholzbrettern mit Pfosten aus Eichenstämmen und baut es dann aus den Blöcken einer Truhe, für jeden Spieler. Bevor du die Truhe füllst, sagt dir ein Laptop, was das Gartenhaus braucht.

**Funktionen:** [DRAW_BOX](/de/c0de_paint/cpaint/draw_box), [STYLE_SOLID](/de/c0de_paint/cpaint/style_solid), [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas), [CANVAS_MATERIALS](/de/c0de_paint/cpaint/canvas_materials) und [CANVAS_COUNT](/de/c0de_paint/cpaint/canvas_count), mit den Typen [CANVAS](/de/c0de_paint/cpaint/canvas), [POINT](/de/c0de_paint/cpaint/point), [BLOCK](/de/c0de_paint/cpaint/block) und [STYLE](/de/c0de_paint/cpaint/style)

::: info Was du brauchst

- die Mods **c0de** und **c0de paint**
- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für das Programm
- eine **Truhe** mit **36 Eichenstämmen** und **30 Eichenholzbrettern**
- einen **Laptop** für die Liste der Blöcke
- einen ebenen Platz von 5 × 4 Blöcken ohne hohes Gras und Blumen
- keine Rechte: Das Gartenhaus wird aus der Truhe gebaut, so wie ein Spieler aus seinem Inventar baut

:::

## Die Idee

Die Funktionen von c0de/minecraft setzen einen Block nach dem anderen. c0de paint arbeitet stattdessen wie ein Malprogramm: Du zeichnest in eine **Leinwand**, ein dreidimensionales Raster aus Voxeln, und die Leinwand wird in einem Rutsch in der Welt gebaut. Die Leinwand gibt es nur im Programm – in der Welt passiert nichts bis RENDER_CANVAS.

Vier Arten von Werten zeichnen:

- eine [CANVAS](/de/c0de_paint/cpaint/canvas) enthält die Zeichnung. Eine neue Variable enthält eine leere Leinwand, und sie wächst mit allem, was du zeichnest.
- ein [POINT](/de/c0de_paint/cpaint/point) ist ein Voxel der Leinwand, mit `x` (Osten), `y` (oben) und `z` (Süden). Ein neuer POINT ist 0, 0, 0.
- ein [BLOCK](/de/c0de_paint/cpaint/block) nennt einen Minecraft-Block mit seiner `id`, etwa `"oak_planks"`.
- ein [STYLE](/de/c0de_paint/cpaint/style), ein Stil, legt fest, wie etwas gezeichnet wird. [STYLE_SOLID](/de/c0de_paint/cpaint/style_solid) macht einen: immer derselbe Block.

[DRAW_BOX](/de/c0de_paint/cpaint/draw_box) zeichnet einen Quader zwischen zwei Ecken. Er hat drei Stile: `line_style` für seine 12 Kanten, `side_style` für seine sechs Flächen und `fill_style` für das Innere. Ein Gartenhaus ist ein Quader mit Brettern auf den Flächen, Stämmen auf den Kanten und nichts im Inneren.

## Das Gartenhaus

<<< @/tutorials/programs/libraries/paint/first-canvas-shed.c0de

## Aufbauen und starten

1. Stell den Auslöserblock mit dem Knopf 2 Blöcke westlich der Stelle auf, an der das Gartenhaus stehen soll.
2. Stell die Truhe 2 Blöcke westlich des Auslöserblocks auf und leg die Eichenstämme und -holzbretter hinein.
3. Stelle den Auslöserblock auf `shed` und `build` ein und drück den Knopf.

Das Gartenhaus belegt die 5 × 4 Blöcke von 2 bis 6 Blöcke östlich des Auslöserblocks und von seiner Reihe bis 3 Blöcke südlich davon. Es ist 4 Blöcke hoch, mit einem Boden aus Brettern, und seine Türöffnung in der Westwand zeigt zum Auslöserblock. Danach ist die Truhe leer.

<!-- screenshot: first-canvas-shed | the finished garden shed, 5 × 4 blocks and 4 high, oak planks with oak logs on all edges, its doorway in the west wall, the trigger block with its button 2 blocks west of it and the chest 2 blocks further west -->

## So funktioniert es

- **`draw` zeichnet nur.** Es bekommt die Größe, gibt die Leinwand als `result` zurück und rührt die Welt nicht an. `build` baut die Leinwand, `materials` zählt sie – beide rufen `draw` auf, also sind sie sich beim Gartenhaus immer einig.
- **Die zwei Stile.** Jedes STYLE_SOLID bekommt einen BLOCK. Die id `"oak_planks"` hat keinen Namensraum, also wird sie zu `minecraft:oak_planks`.
- **Der Quader.** `a` bleibt 0, 0, 0; `b` ist die gegenüberliegende Ecke, `width - 1` nach Osten, `height - 1` nach oben und `depth - 1` nach Süden. Ein Quader von 0 bis 4 ist 5 Voxel lang. Es gibt keinen `fill_style`, also wird das Innere gar nicht gezeichnet: Was in der Welt dort ist, bleibt.
- **Die Zeichenfunktionen ändern die Leinwand.** DRAW_BOX bekommt `canvas result`, die Leinwand von `draw`, und zeichnet hinein, so wie INPUT in seine Variable speichert.
- **Die Türöffnung** ist ein zweiter Quader, 1 Voxel breit und 2 hoch, in der Westwand, gezeichnet mit [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty): Luft. Sie überschreibt die Bretter dort. Beim Bauen heißt Luft „hier kein Block“.
- **Bauen.** [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas) setzt das Voxel 0, 0, 0 der Leinwand an `site`, 2 Blöcke östlich des Auslöserblocks. Mit `input` nimmt es die Blöcke aus der Truhe. Vor dem ersten Block prüft es, ob die Truhe alle hat, damit ein fehlendes Brett kein halbes Gartenhaus hinterlässt: Das Programm stürzt mit ITEM_MISSING ab, und nichts wird gebaut. Blöcke, die schon an ihrem Platz sind, werden übersprungen, also schadet ein zweiter Druck auf den Knopf nicht.
- **Ohne `input`** erschafft RENDER_CANVAS die Blöcke aus dem Nichts und ersetzt, was im Weg ist. Dafür braucht es `allowBlockChanges` auf dem Server oder einen Operator als Besitzer, wie REMOVE_BLOCK.

## Die Liste der Blöcke

Wie viele Stämme, wie viele Bretter? Du musst nicht zählen: Die zweite Funktion des Programms, `materials`, schreibt die Liste auf einen Laptop. Binde den Laptop an `shed` / `materials`, stell den Auslöserblock auf dieselbe Funktion um und drück den Knopf. Der Laptop zeigt

```
The shed needs:
36 minecraft:oak_log
30 minecraft:oak_planks
68 voxels in all
```

<!-- screenshot: first-canvas-list | the laptop screen with the list "The shed needs:", "36 minecraft:oak_log", "30 minecraft:oak_planks" and "68 voxels in all", the trigger block and the chest next to it -->

- **[CANVAS_MATERIALS](/de/c0de_paint/cpaint/canvas_materials)** liefert einen HASH von Block-id zu Anzahl: genau das, was die Truhe enthalten muss. EACH geht seine Schlüssel in alphabetischer Reihenfolge durch.
- **[CANVAS_COUNT](/de/c0de_paint/cpaint/canvas_count)** zählt die gesetzten Voxel: 68, aber die Liste ergibt nur 66. Die zwei fehlenden Voxel sind die Luft der Türöffnung – gesetzte Voxel, aber keine Blöcke, die du brauchst. CANVAS_MATERIALS lässt Luft weg.

## Probier es selbst

1. Setz ein Fenster aus Glas in die Ostwand, gegenüber der Tür: 2 Blöcke auf Augenhöhe.

::: details Lösung
Ein dritter Quader, von `width - 1`, 2, 1 bis `width - 1`, 2, `depth - 2`, mit einem STYLE_SOLID aus Glas. Er überschreibt zwei Bretter, also braucht die Truhe 2 Glas und nur 28 Bretter.

<<< @/tutorials/programs/libraries/paint/first-canvas-window.c0de

:::

2. Dein Pferd will einen Stall: Mach das Gartenhaus 7 Blöcke breit, 5 tief und 5 hoch. Wie viele Stämme und Bretter braucht es?

::: details Lösung
Kein neuer Code: Leg die INTEGER-Variablenkarten `width` 7, `depth` 5 und `height` 5 in den Auslöserblock, für `materials` und danach für `build`. Der Laptop sagt 52 Eichenstämme und 76 Eichenholzbretter, 130 Voxel insgesamt.
:::

3. Nimm 5 Bretter aus der Truhe und drück den Knopf. Was passiert – und was bleibt in der Welt?

::: details Lösung
Das Programm stürzt mit ITEM_MISSING ab, und der Dialog des Auslöserblocks zeigt den Fehler. Kein einziger Block wird gesetzt: RENDER_CANVAS prüft die Truhe vor dem ersten Block. Leg die Bretter zurück und drück noch einmal.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [DRAW_BOX](/de/c0de_paint/cpaint/draw_box), [STYLE_SOLID](/de/c0de_paint/cpaint/style_solid), [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty), [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas), [CANVAS_MATERIALS](/de/c0de_paint/cpaint/canvas_materials) und [CANVAS_COUNT](/de/c0de_paint/cpaint/canvas_count)
- Die Typen [CANVAS](/de/c0de_paint/cpaint/canvas), [POINT](/de/c0de_paint/cpaint/point), [BLOCK](/de/c0de_paint/cpaint/block) und [STYLE](/de/c0de_paint/cpaint/style)
- [Erste Schritte](/de/c0de_paint/cpaint/getting-started) mit c0de paint und seine [Fehler](/de/c0de_paint/cpaint/errors)
- [Stile](/de/tutorials/libraries/c0de_paint/cpaint/styles): zufällige Blöcke, Verläufe und Muster
- [Bauen](/de/tutorials/libraries/c0de/minecraft/building): eine Mauer Block für Block mit PLACE_BLOCK
- [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung, [EACH-Schleifen](/de/c0de/guide/language#each-schleifen) und der [Laptop](/de/c0de/reference/devices#laptop)
