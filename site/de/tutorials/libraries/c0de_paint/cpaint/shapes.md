---
description: Ein rundes Fenster, ein Torbogen, ein Stern im Boden und eine Wendeltreppe, gezeichnet mit den flachen Formen von c0de paint, die in jeder Ebene liegen, die drei Punkte festlegen.
---

# Formen in jeder Ebene

Ein Quader ist erst der Anfang. Dieses Rezept zeichnet flache Formen: eine Mauer mit einem runden Fenster und einem Kreuz aus Schwarzeiche, ein Tor mit einem Rundbogen, einen goldenen Stern im Boden und eine Wendeltreppe, die sich um ihre eigene Achse nach oben windet. Dieselben Funktionen zeichnen aufrecht, liegend oder schräg – die Punkte entscheiden.

**Funktionen:** [DRAW_BLOCK](/de/c0de_paint/cpaint/draw_block), [DRAW_LINE](/de/c0de_paint/cpaint/draw_line), [DRAW_RECTANGLE](/de/c0de_paint/cpaint/draw_rectangle), [DRAW_POLYGON](/de/c0de_paint/cpaint/draw_polygon), [DRAW_ELLIPSE](/de/c0de_paint/cpaint/draw_ellipse), [DRAW_ARC](/de/c0de_paint/cpaint/draw_arc) und [DRAW_SPIRAL](/de/c0de_paint/cpaint/draw_spiral), mit [STYLE_SOLID](/de/c0de_paint/cpaint/style_solid), [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty) und [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas)

::: warning Braucht einen Operator
Diese Programme rufen RENDER_CANVAS ohne `input` auf: Die Blöcke kommen aus dem Nichts, und was im Weg ist, wird ersetzt – das Tor schneidet sogar seinen Durchgang aus der Mauer, der Stern ersetzt den Boden. Das funktioniert nur, wenn der Besitzer des Auslöserblocks ein Operator ist oder der Server es mit `allowBlockChanges=true` in `config/c0de.properties` erlaubt; sonst löst RENDER_CANVAS PERMISSION_DENIED aus. Wie du stattdessen aus einer Truhe baust, für jeden Spieler, zeigt [Eine erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas).
:::

::: info Was du brauchst

- die Mods **c0de** und **c0de paint** und die [erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas) als Einstieg
- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für jedes Programm
- Operator-Rechte oder `allowBlockChanges` auf dem Server (siehe oben)
- einen ebenen Platz von etwa 15 × 20 Blöcken; die Treppe und das Fenster werden bis zu 13 Blöcke hoch

:::

## Die Idee

Eine flache Form liegt in einer Ebene, und drei Punkte legen diese Ebene fest. Ein Rechteck von 0,0,0 bis 9,0,0, das bis 0,4,0 hinaufreicht, steht aufrecht wie eine Mauer; mit 0,0,4 als drittem Punkt liegt es flach wie ein Teppich. Sonst ändert sich nichts: Es gibt keine eigenen Funktionen für Wände und Böden.

Flache Formen haben zwei Teile, jeder mit eigenem Stil: den Umriss (`line_style`) und die Fläche darin (`fill_style`). Ohne Linienstil nimmt der Umriss den Füllstil. Und was du später zeichnest, überschreibt, was schon da ist: Ein Fenster ist ein Kreis, der in eine Mauer gezeichnet wird.

Alle vier Programme teilen sich eine kleine Hilfsfunktion, `solid`, die aus einer Block-ID einen STYLE_SOLID macht, damit die Zeichenfunktionen nicht in BLOCK-Variablen ertrinken.

## Das runde Fenster

<<< @/tutorials/programs/libraries/paint/shapes-window.c0de

## Aufbauen und starten

1. Stell den Auslöserblock dort auf, wo die Mauer beginnen soll, und setz den Knopf darauf.
2. Stelle den Auslöserblock auf `roundwindow` und `window` ein und drück den Knopf.

Eine Mauer aus Steinziegeln, 13 Blöcke breit und 13 hoch, wächst von 2 bis 14 Blöcke östlich des Auslöserblocks empor, in seiner Reihe. In ihrer Mitte sitzt ein rundes Fenster aus hellblauem Glas mit einem Rand aus poliertem Andesit, 9 Blöcke im Durchmesser, geteilt von einem Kreuz aus Schwarzeichenholzbrettern.

<!-- screenshot: shapes-window | the wall of stone bricks, 13 × 13 blocks, with the round window of light blue glass in its middle, framed by polished andesite and divided by a cross of dark oak planks, the trigger block with its button in front of its west end -->

## So funktioniert es

- **Aufrecht, wegen der Punkte.** DRAW_RECTANGLE bekommt `a` bei 0,0,0 und `b` bei 2r + 4,0,0, eine Seite am Boden entlang; `c` bei 0,2r + 4,0 liegt genau über `a`, also läuft die andere Seite nach oben. Das `z` aller Punkte ist 0: Alles liegt in einer aufrechten Ebene.
- **Der Kreis.** [DRAW_ELLIPSE](/de/c0de_paint/cpaint/draw_ellipse) bekommt einen Mittelpunkt `center` und zwei Punkte: Der Abstand von `a` ist der erste Radius, der Abstand von `b` zur Geraden durch `center` und `a` der zweite. Beide sind `r`, also ist es ein Kreis. `b` über dem Mittelpunkt legt den Kreis außerdem in die Ebene der Mauer.
- **Umriss und Fläche.** Der Rand bekommt `line_style rim`, das Innere `fill_style glass`. Sie überschreiben die Ziegel der Mauer – die Reihenfolge zählt.
- **Das Kreuz.** [DRAW_LINE](/de/c0de_paint/cpaint/draw_line) zeichnet von `from` nach `to`, hier einmal quer und einmal hinauf durch das Fenster. Eine Linie kann in jede Richtung gehen; ihre Voxel hängen über Kanten und Ecken zusammen.
- **Variablen werden wiederverwendet.** `a`, `b` und `m` sind nur Werte: Nach dem Rechteck setzt das Programm ihre Elemente neu für den Kreis und die Linien. Die Leinwand hat die Formen schon gespeichert.
- **Die Größe.** `r` hat den Standardwert 4. Für einen anderen Radius genügt eine INTEGER-Variablenkarte `r` im Auslöserblock: Mauer, Fenster und Kreuz wachsen mit.

## Der Torbogen

Als Nächstes kommt eine Mauer mit einem Tor: ein Durchgang, mit Luft herausgeschnitten, und ein Rundbogen darüber.

<<< @/tutorials/programs/libraries/paint/shapes-gate.c0de

Stell den Auslöserblock an einen freien Platz, stelle ihn auf `archgate` und `gate` ein und drück den Knopf. Eine Bruchsteinmauer, 11 Blöcke breit und 8 hoch, steht 2 Blöcke östlich des Auslöserblocks. Ihr Tor ist 5 Blöcke breit und in der Mitte 5 hoch, eingefasst von einem Bogen aus gemeißelten Steinziegeln.

- **Ausschneiden.** Der Durchgang ist ein zweites Rechteck mit [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty). Seine Voxel werden auf Luft gesetzt, also überschreiben sie den Bruchstein, und in der Welt entfernen sie, was dort ist.
- **Ein halber Kreis.** [DRAW_ARC](/de/c0de_paint/cpaint/draw_arc) zeichnet den Teil einer Ellipse von `start` bis `end`, in Grad, gezählt von `a` in Richtung `b`. Von 0 bis 180 ist die obere Hälfte: `a` liegt östlich des Mittelpunkts, `b` darüber.
- **Bogen und Öffnung.** Die Linie des Bogens ist der Bogen aus gemeißelten Steinziegeln. Sein `fill_style air` ist das Tortenstück innerhalb des Bogens, das das Tor bis zum Bogen öffnet. Es beginnt in der obersten Schicht des Durchgangs, so treffen sich beide Öffnungen.

## Ein Stern im Boden

Ein Stern ist ein Vieleck mit 10 Ecken: 5 Spitzen und 5 Kerben dazwischen. Das Programm berechnet sie mit COS und SIN auf einem Kreis und legt den Stern flach in den Boden.

<<< @/tutorials/programs/libraries/paint/shapes-star.c0de

Stelle den Auslöserblock auf `floorstar` und `star` ein und drück den Knopf. Ein Stern aus weißem Beton mit goldenem Umriss ersetzt den Boden östlich des Auslöserblocks, seine Mitte 10 Blöcke entfernt, mit einer Seelaterne im Zentrum. Seine Spitzen sind 8 Blöcke von der Mitte entfernt, und eine davon zeigt nach Norden.

<!-- screenshot: shapes-star | the five-pointed star set into the grass, white concrete with a rim of gold blocks and a sea lantern in its middle, seen from above, the trigger block 2 blocks west of its western tip -->

- **Die Ecken.** Die Schleife geht in Schritten von 36° um den Kreis, das ist `c0de/math/PI / 5`. Die geraden Ecken sind Spitzen mit dem Radius `r`, die ungeraden Kerben mit 2/5 davon. [COS](/de/c0de/math/cos) liefert den Anteil in `x`, SIN den Anteil in `z`, und ROUND macht ganze Voxel daraus. Das `- 0.5` dreht die erste Spitze nach Norden.
- **Ein ARRAY aus POINTs.** `ASSIGN corners[i] p ;` hängt eine Kopie von `p` an das Array an, so kann `p` für die nächste Ecke wiederverwendet werden.
- **Flach liegend.** Alle Ecken haben `y` 0, also findet [DRAW_POLYGON](/de/c0de_paint/cpaint/draw_polygon) eine waagrechte Ebene. Das Vieleck schließt sich selbst von der letzten Ecke zurück zur ersten.
- **Ein Voxel.** [DRAW_BLOCK](/de/c0de_paint/cpaint/draw_block) setzt ein einzelnes Voxel: die Seelaterne in der Mitte, zuletzt gezeichnet, damit sie den Beton überschreibt.
- **In den Boden.** RENDER_CANVAS legt das Voxel 0,0,0 einen Block unter den Auslöserblock, so ersetzt der Stern den Boden und liegt eben mit ihm.

## Die Wendeltreppe

Eine Wendeltreppe ist ein einziger Aufruf: [DRAW_SPIRAL](/de/c0de_paint/cpaint/draw_spiral) zeichnet eine Spirale eine Achse hinauf, und ihr Füllstil füllt die Stufen zwischen der Achse und der Spirale.

<<< @/tutorials/programs/libraries/paint/shapes-staircase.c0de

Stelle den Auslöserblock auf `spiralstairs` und `stairs` ein und drück den Knopf. Die Treppe windet sich um eine Achse 5 Blöcke östlich des Auslöserblocks nach oben: Stufen aus Eichenholzbrettern mit einer Kante aus Fichtenholzbrettern, 7 Blöcke im Durchmesser und 12 hoch. Sie beginnt östlich der Achse und dreht sich im Uhrzeigersinn, zuerst nach Süden, anderthalbmal herum.

<!-- screenshot: shapes-staircase | the spiral staircase of oak planks with an edge of spruce planks, 12 blocks high, winding clockwise around its central column, a player on one of its upper steps -->

- **Der Kreis der Spirale.** `center`, `a` und `b` wirken wie bei DRAW_ELLIPSE: Die Spirale beginnt bei `a`, östlich der Achse, und dreht sich in Richtung `b`, nach Süden. `direction "+y"` lässt sie steigen. Der Kreis liegt quer zur Richtung: Alle drei Punkte haben `y` 0.
- **`elevation`** sagt, wie viele Schichten jedes Voxel der Spirale über dem vorigen liegt, abgerundet. 0.5 steigt bei jedem zweiten Voxel: Jede Stufe ist am Rand zwei Blöcke lang und einen Block höher als die vorige – man kann hinaufgehen.
- **`h`** ist die Höhe in Schichten: Die Spirale endet unter der Schicht 12, wie ein Zylinder der Höhe 12.
- **Linie und Füllung.** Die Linie ist die Spirale selbst, die äußere Kante der Stufen. Die Füllung ist die Rampe von der Achse zur Spirale, und die Achse wird in jeder Schicht gezeichnet: die Mittelsäule der Treppe.

## Probier es selbst

1. Mach die Treppe steiler: Was passiert mit einer `elevation` von 1, und was mit 2?

::: details Lösung
Kein neuer Code: Leg eine FLOAT-Variablenkarte `elevation` in den Auslöserblock. Mit 1 liegt jedes Voxel der Kante eine Schicht höher als das vorige; die Stufen sind am Rand nur einen Block lang, aber man kommt noch hinauf, und 12 Schichten sind nur eine Dreivierteldrehung. Mit 2 steigt jedes Voxel zwei Schichten, also bleibt zwischen den Stufen eine Schicht Lücke – eine Verzierung, aber keine Treppe mehr.
:::

2. Stell den Stern aufrecht, wie einen Stern an einer Wand, mit der Spitze nach oben.

::: details Lösung
Nur die Ebene ändert sich: Die Ecken bekommen `y` statt `z`. Das `+ 0.5` dreht die erste Spitze nach oben, und RENDER_CANVAS hebt den Stern um `r` an, damit seine unteren Spitzen über dem Boden bleiben.

<<< @/tutorials/programs/libraries/paint/shapes-upright.c0de

:::

3. Leg eine INTEGER-Variablenkarte `r` mit 0 in den Auslöserblock des Sterns. Was passiert? Lass das Programm stattdessen „No star: r is too small“ sagen.

::: details Lösung
Mit `r` 0 sind alle Ecken 0,0,0. Sie liegen auf einer Geraden – sogar auf einem Punkt –, legen also keine Ebene fest, und DRAW_POLYGON löst [NOT_A_PLANE](/de/c0de_paint/cpaint/errors) aus: Das Programm stürzt ab. Fang den Fehler im CALL auf und vergleiche seinen Code mit der Konstanten `c0de_paint/cpaint/NOT_A_PLANE`.

<<< @/tutorials/programs/libraries/paint/shapes-safestar.c0de

:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [DRAW_BLOCK](/de/c0de_paint/cpaint/draw_block), [DRAW_LINE](/de/c0de_paint/cpaint/draw_line), [DRAW_RECTANGLE](/de/c0de_paint/cpaint/draw_rectangle), [DRAW_POLYGON](/de/c0de_paint/cpaint/draw_polygon), [DRAW_ELLIPSE](/de/c0de_paint/cpaint/draw_ellipse), [DRAW_ARC](/de/c0de_paint/cpaint/draw_arc) und [DRAW_SPIRAL](/de/c0de_paint/cpaint/draw_spiral)
- [Erste Schritte](/de/c0de_paint/cpaint/getting-started) mit c0de paint und seine [Fehler](/de/c0de_paint/cpaint/errors)
- [Eine erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas): aus einer Truhe bauen, für jeden Spieler
- [Körper](/de/tutorials/libraries/c0de_paint/cpaint/bodies): Zylinder, Kuppeln und die platonischen Körper
- [COS](/de/c0de/math/cos) und [PI](/de/c0de/math/pi) von c0de/math, und [Einen Kreis zeichnen](/de/tutorials/libraries/c0de/math/circle) Block für Block
- [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) und [Fehler](/de/c0de/guide/language#fehler) in der Anleitung
