---
description: Ein Leuchtturm mit einer Kupferkuppel, die platonischen Körper als Gartenskulpturen und ein Baum aus Blättern, gezeichnet mit den Körpern von c0de paint und ihren Linien-, Flächen- und Füllstilen.
---

# Körper

Kugeln, Zylinder, Kegel, Pyramiden und die fünf platonischen Körper brauchen je einen Aufruf. Dieses Rezept baut einen weißen Leuchtturm mit roten Ringen, einem Laternenraum aus Glas und einer Kupferkuppel, eine Reihe von Gartenskulpturen – eine für jeden platonischen Körper, jede anders gezeichnet – und einen kleinen Formschnittgarten aus Fichtenblättern.

**Funktionen:** [DRAW_ELLIPSOID](/de/c0de_paint/cpaint/draw_ellipsoid), [DRAW_CYLINDER](/de/c0de_paint/cpaint/draw_cylinder), [DRAW_CONE](/de/c0de_paint/cpaint/draw_cone), [DRAW_PYRAMID](/de/c0de_paint/cpaint/draw_pyramid) und die [platonischen Körper](/de/c0de_paint/cpaint/platonic-solids) [DRAW_TETRAHEDRON](/de/c0de_paint/cpaint/platonic-solids), [DRAW_OCTAHEDRON](/de/c0de_paint/cpaint/platonic-solids), [DRAW_DODECAHEDRON](/de/c0de_paint/cpaint/platonic-solids) und [DRAW_ICOSAHEDRON](/de/c0de_paint/cpaint/platonic-solids), mit [DRAW_BOX](/de/c0de_paint/cpaint/draw_box), [DRAW_BLOCK](/de/c0de_paint/cpaint/draw_block), [STYLE_SOLID](/de/c0de_paint/cpaint/style_solid), [STYLE_EMPTY](/de/c0de_paint/cpaint/style_empty) und [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas)

::: warning Braucht einen Operator
Diese Programme rufen RENDER_CANVAS ohne `input` auf: Die Blöcke kommen aus dem Nichts, und was im Weg ist, wird ersetzt. Das funktioniert nur, wenn der Besitzer des Auslöserblocks ein Operator ist oder der Server es mit `allowBlockChanges=true` in `config/c0de.properties` erlaubt; sonst löst RENDER_CANVAS PERMISSION_DENIED aus. Wie du stattdessen aus einer Truhe baust, für jeden Spieler, zeigt [Eine erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas).
:::

::: info Was du brauchst

- die Mods **c0de** und **c0de paint** und die [erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas) und die [Formen](/de/tutorials/libraries/c0de_paint/cpaint/shapes) als Einstieg
- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für jedes Programm
- Operator-Rechte oder `allowBlockChanges` auf dem Server (siehe oben)
- freien Platz: etwa 11 × 11 Blöcke und 23 hoch für den Leuchtturm, eine Reihe von etwa 60 Blöcken für die Skulpturen
- für die Übungen: einen **Hügel** zum Durchgraben

:::

## Die Idee

Ein Körper hat drei Teile, jeder mit eigenem Stil, wie der Quader der ersten Leinwand: seine Kanten oder Ränder (`line_style`), seine Oberfläche (`side_style`) und sein Inneres (`fill_style`). Ein Teil ohne Stil nimmt den Stil des nächsten Teils weiter innen. So entscheiden die Stile, die du angibst, wie ein Körper aussieht:

| Stile                                  | Der Körper                                      |
| -------------------------------------- | ----------------------------------------------- |
| nur `fill_style`                       | voll                                            |
| nur `side_style`                       | eine hohle Hülle, das Innere bleibt, wie es ist |
| `side_style` und `fill_style` aus Luft | eine hohle Hülle, die ihr Inneres leert         |
| nur `line_style`                       | ein Rahmen aus Kanten, sonst nichts             |
| `line_style` und `side_style`          | eine Hülle mit Kanten aus einem zweiten Block   |

Körper liegen nicht wie flache Formen in einer beliebigen Ebene. Sie sind an den Achsen ausgerichtet, und Zylinder, Kegel und Pyramiden wachsen in eine von sechs Richtungen: "+x" (Osten), "-x", "+y" (oben), "-y", "+z" (Süden) und "-z".

## Der Leuchtturm

<<< @/tutorials/programs/libraries/paint/bodies-lighthouse.c0de

## Aufbauen und starten

1. Stell den Auslöserblock mit dem Knopf auf freien Boden, 2 Blöcke westlich der Stelle, an der der Leuchtturm stehen soll.
2. Stelle den Auslöserblock auf `lighthouse` und `build` ein und drück den Knopf.

Der Leuchtturm steht um eine Achse 6 Blöcke östlich des Auslöserblocks: ein Turm aus weißem Beton, 9 Blöcke im Durchmesser und 16 hoch, mit einem roten Ring an seinem Fuß und oben. Darauf sitzt ein Laternenraum aus Glas, 7 Blöcke im Durchmesser und 4 hoch, mit einer Seelaterne in der Mitte, und obendrauf eine Kuppel aus Kupfer. Der ganze Leuchtturm ist 23 Blöcke hoch. Mit den Tagen wird das Kupfer grün.

<!-- screenshot: bodies-lighthouse | the white lighthouse, 23 blocks high, with red rings at its foot and its top, the glass lantern room with the sea lantern shining inside and the copper dome on top, seen from the side at dusk, the trigger block in front of it -->

## So funktioniert es

- **Der Turm.** [DRAW_CYLINDER](/de/c0de_paint/cpaint/draw_cylinder) zeichnet eine Scheibe mit dem Radius `r` um `center` und lässt sie `h` Voxel in Richtung `direction` wachsen. Seine Linien sind die Ränder beider Enden – die roten Ringe. Seine Flächen sind die Wand, der Boden und die Decke, in Weiß. Die Füllung ist Luft: Der Turm ist innen hohl, und was dort war, ist weg.
- **Der Laternenraum** ist ein zweiter, dünnerer Zylinder auf dem Turm, der in der Schicht `h` beginnt. Seine Flächen sind aus Glas – auch Boden und Dach.
- **Die Kuppel.** [DRAW_ELLIPSOID](/de/c0de_paint/cpaint/draw_ellipsoid) zeichnet einen Körper um `center` mit drei Radien; gleiche Radien ergeben eine Kugel. Sie hat nur einen Flächenstil, ist also eine hohle Hülle. Ihre Mitte liegt im Dach des Laternenraums, also würde ihre untere Hälfte in den Raum ragen.
- **Die Reihenfolge.** Darum kommt die Kuppel zuerst. Der Laternenraum wird später gezeichnet und überschreibt die untere Hälfte: Sein Glas und seine Luft gewinnen, weil sie zuletzt kommen. Nur die obere Hälfte der Kuppel bleibt.
- **Das Licht.** [DRAW_BLOCK](/de/c0de_paint/cpaint/draw_block) setzt die Seelaterne in die Luft des Laternenraums, eine Schicht über seinem Boden.
- **Die Größe.** `r` und `h` haben Standardwerte. INTEGER-Variablenkarten `r` und `h` im Auslöserblock ergeben einen größeren Leuchtturm; Laternenraum und Kuppel wachsen mit `r`.

## Die Skulpturen

[Die platonischen Körper](/de/c0de_paint/cpaint/platonic-solids) sind die fünf Körper, deren Flächen alle dasselbe regelmäßige Vieleck sind: das Tetraeder (4 Dreiecke), der Würfel (6 Quadrate), das Oktaeder (8 Dreiecke), das Dodekaeder (12 Fünfecke) und das Ikosaeder (20 Dreiecke). c0de paint hat für jeden eine Funktion, mit den Ecken im Abstand `r` von `center` – und der Würfel ist DRAW_BOX. Dieser Garten zeigt jeden in einem anderen Stil.

<<< @/tutorials/programs/libraries/paint/bodies-garden.c0de

Stell den Auslöserblock an das westliche Ende einer freien Reihe, stelle ihn auf `sculptures` und `garden` ein und drück den Knopf. Fünf Skulpturen stehen in einer Reihe nach Osten, 12 Blöcke voneinander entfernt, die erste 6 Blöcke vom Auslöserblock:

<!-- screenshot: bodies-sculptures | the row of five garden sculptures on the grass: the gold frame of the tetrahedron, the glass octahedron, the glass cube with quartz edges, the full moss dodecahedron and the icosahedron with quartz edges and glass faces -->

- **[DRAW_TETRAHEDRON](/de/c0de_paint/cpaint/platonic-solids)** mit nur einem Linienstil: ein Rahmen aus goldenen Kanten. Seine Ecken liegen in jeder zweiten Ecke eines Würfels, darum schwebt seine unterste Kante ein wenig über dem Boden.
- **[DRAW_OCTAHEDRON](/de/c0de_paint/cpaint/platonic-solids)** mit nur einem Flächenstil: eine hohle Hülle aus Glas. Seine Ecken liegen auf den Achsen, also steht es auf seiner untersten Spitze.
- **Der Würfel** ist ein [DRAW_BOX](/de/c0de_paint/cpaint/draw_box) von Ecke zu Ecke, 2r − 1 Blöcke breit, mit Kanten aus Quarz und Flächen aus Glas.
- **[DRAW_DODECAHEDRON](/de/c0de_paint/cpaint/platonic-solids)** mit nur einem Füllstil: Flächen und Kanten nehmen ihn auch, also ist es voll Moos.
- **[DRAW_ICOSAHEDRON](/de/c0de_paint/cpaint/platonic-solids)** mit einem Linien- und einem Flächenstil: 30 Kanten aus Quarz und 20 Flächen aus Glas.
- **Kleine Körper sind grob.** Ein Voxel ist ein großer Schritt für einen kleinen Körper: Unter `r` 4 ragen einzelne Voxel der Kanten aus den Flächen. `r` 8 ergibt feine Skulpturen, in einer Reihe von 100 Blöcken. Aber eine Leinwand endet auf jeder Achse bei 127 (die Einstellung `canvasMax`): Mit `r` 10 würde das Ikosaeder bis 128 reichen, und DRAW_ICOSAHEDRON löst [CANVAS_LIMIT](/de/c0de_paint/cpaint/errors) aus – nichts wird gebaut.

Jeder Körper hat eine feste Ausrichtung. Um einen zu drehen, zeichnest du ihn in eine eigene Leinwand und drehst sie mit CANVAS_ROTATE – mehr dazu in [Leinwände umformen](/de/tutorials/libraries/c0de_paint/cpaint/shaping-canvases).

## Der Formschnittgarten

Zum Schluss ein Baum und eine Hecke, in Form geschnitten: ein Kegel aus Blättern auf einem Stamm und daneben eine Pyramide aus Blättern.

<<< @/tutorials/programs/libraries/paint/bodies-topiary.c0de

Stelle den Auslöserblock auf `topiary` und `hedges` ein und drück den Knopf. Eine Fichte, 10 Blöcke hoch, wächst 5 Blöcke östlich des Auslöserblocks, und eine Pyramidenhecke von 7 × 7 Blöcken und 4 hoch steht 14 Blöcke östlich davon.

- **Der Stamm** ist ein Zylinder mit dem Radius 0: eine einzelne Säule aus Fichtenstämmen, 2 hoch.
- **Die Krone.** [DRAW_CONE](/de/c0de_paint/cpaint/draw_cone) zeichnet einen Kegel auf der Grundfläche eines Zylinders; seine Spitze liegt `h` Voxel von der Grundfläche entfernt in Richtung `direction`. Mit `r` 3 und `h` 7 ist es ein schlanker Baum.
- **Die Hecke.** [DRAW_PYRAMID](/de/c0de_paint/cpaint/draw_pyramid) hat eine quadratische Grundfläche, deren Seiten 2r + 1 Voxel lang sind, und ihre Spitze liegt `h` Voxel darüber.
- **Blätter, die bleiben.** Blätter ohne einen Baum in der Nähe zerfallen in Minecraft. Der Blockzustand `persistent` "true" lässt sie bleiben, wie Blätter, die ein Spieler setzt. Der BLOCK der Blätter bekommt ihn in seinen `properties`, darum genügt `solid` hier nicht.

## Probier es selbst

1. Der Leuchtturm hat keine Tür. Schneide eine in seine Westwand, zum Auslöserblock hin: 1 Block breit und 2 hoch, über dem Boden.

::: details Lösung
Ein [DRAW_BOX](/de/c0de_paint/cpaint/draw_box) aus Luft von `- r`,1,0 bis `- r`,2,0, nach dem Turm gezeichnet, überschreibt dort den weißen Beton. In der mittleren Reihe ist die Wand nur einen Block dick.

<<< @/tutorials/programs/libraries/paint/bodies-door.c0de

:::

2. Grab einen Tunnel durch einen Hügel: eine runde Röhre aus Steinziegeln, 7 Blöcke im Durchmesser und 12 lang, die nach Osten läuft und 2 Blöcke östlich des Auslöserblocks beginnt.

::: details Lösung
Ein liegender Zylinder, mit `direction "+x"`. Aber die Flächen eines Zylinders umfassen auch seine beiden Enden, also wäre die Röhre geschlossen. Ein zweiter, dünnerer Zylinder aus Luft, so lang wie der erste, leert das Innere und öffnet beide Enden. Die Achse liegt 2 über dem Auslöserblock, also ist der Boden des Tunnels 1 Block darunter.

<<< @/tutorials/programs/libraries/paint/bodies-tunnel.c0de

:::

3. Gib dem Leuchtturm eine flachere Kuppel.

::: details Lösung
Ändere eine Zeile: Der Radius `ry` von DRAW_ELLIPSOID ist die Höhe der Kuppel. Mit `PARAMETER ry 2 ;` statt `r - 1` ist die Kuppel niedriger als breit. Die Radien `rx` und `rz` bleiben, also passt sie weiter auf den Laternenraum.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [DRAW_ELLIPSOID](/de/c0de_paint/cpaint/draw_ellipsoid), [DRAW_CYLINDER](/de/c0de_paint/cpaint/draw_cylinder), [DRAW_CONE](/de/c0de_paint/cpaint/draw_cone), [DRAW_PYRAMID](/de/c0de_paint/cpaint/draw_pyramid), die [platonischen Körper](/de/c0de_paint/cpaint/platonic-solids) und [DRAW_BOX](/de/c0de_paint/cpaint/draw_box)
- [Formen in jeder Ebene](/de/tutorials/libraries/c0de_paint/cpaint/shapes): Fenster, Bögen und eine Wendeltreppe
- [Stile](/de/tutorials/libraries/c0de_paint/cpaint/styles): Streifen, Verläufe und zufällige Blöcke statt einfachem Weiß
- [Leinwände umformen](/de/tutorials/libraries/c0de_paint/cpaint/shaping-canvases): Körper drehen, spiegeln und skalieren
- [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung
