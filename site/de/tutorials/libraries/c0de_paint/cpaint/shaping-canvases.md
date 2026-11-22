---
description: Eine ganze Straße aus einem Haus, einmal gezeichnet und dann mit den Leinwand-Operationen von c0de paint verschoben, umgefärbt, beschnitten, skaliert, gedreht und gespiegelt, mit einem Weg vor jeder Tür, die CANVAS_GET findet.
---

# Leinwände umformen

Ein Programm als Stadtplaner: Es zeichnet ein kleines Haus aus Eichenholzbrettern und macht daraus eine ganze Straße. Eine Kopie bekommt Ziegelwände, eine ist noch eine Baustelle, eine ist nur eine Fassade, eine wird zur Halle aufgeblasen, eine wird gedreht und schließt das Ende der Straße ab, und das Haus gegenüber ist ein Spiegelbild. Zum Schluss bekommt jede Tür einen Weg.

**Funktionen:** [CANVAS_MIN und CANVAS_MAX](/de/c0de_paint/cpaint/canvas_min-and-canvas_max), [CANVAS_GET](/de/c0de_paint/cpaint/canvas_get), [CANVAS_CLEAR und CANVAS_CROP](/de/c0de_paint/cpaint/canvas_clear-and-canvas_crop), [CANVAS_MOVE](/de/c0de_paint/cpaint/canvas_move), [CANVAS_REPLACE](/de/c0de_paint/cpaint/canvas_replace), [CANVAS_MERGE](/de/c0de_paint/cpaint/canvas_merge), [CANVAS_SCALE](/de/c0de_paint/cpaint/canvas_scale), [CANVAS_ROTATE](/de/c0de_paint/cpaint/canvas_rotate) und [CANVAS_MIRROR](/de/c0de_paint/cpaint/canvas_mirror), mit [DRAW_BOX](/de/c0de_paint/cpaint/draw_box), [DRAW_LINE](/de/c0de_paint/cpaint/draw_line), [DRAW_BLOCK](/de/c0de_paint/cpaint/draw_block) und [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas)

::: warning Braucht einen Operator
Die Straße braucht Eichenholzbretter, Eichentreppen, Eichentüren, Ziegel und Trampelpfade – zu viele Sorten für eine Truhe, und Trampelpfade kann man gar nicht tragen. Darum baut RENDER_CANVAS sie ohne `input`, aus dem Nichts, und ersetzt, was im Weg ist. Das funktioniert nur, wenn der Besitzer des Auslöserblocks ein Operator ist oder der Server es mit `allowBlockChanges=true` in `config/c0de.properties` erlaubt; sonst löst es PERMISSION_DENIED aus. In einer Einzelspielerwelt mit Cheats bist du Operator. Wie man aus Truhen baut, zeigt [Gebäude kopieren](/de/tutorials/libraries/c0de_paint/cpaint/copying-buildings).
:::

::: info Was du brauchst

- die Mods **c0de** und **c0de paint**
- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für das Programm
- einen ebenen Platz von etwa 45 × 18 Blöcken: Die Straße reicht 45 Blöcke östlich des Auslöserblocks, von 6 Blöcken nördlich bis 11 Blöcke südlich davon
- Operator-Rechte oder `allowBlockChanges` (siehe oben)

:::

## Die Idee

Eine Leinwand ist ein Wert wie eine Zahl: `ASSIGN copy home ;` macht eine Kopie, und wenn sich die Kopie ändert, bleibt `home`, wie es ist. Darum zeichnet das Programm das Haus nur einmal, in einer eigenen Funktion, und nimmt dann für jedes Grundstück der Straße eine frische Kopie. Die Leinwand-Operationen ändern eine Kopie, ohne etwas Neues zu zeichnen:

- [CANVAS_REPLACE](/de/c0de_paint/cpaint/canvas_replace) zeichnet jedes Voxel eines Blocks neu mit einem anderen Stil – neue Farben.
- [CANVAS_CLEAR und CANVAS_CROP](/de/c0de_paint/cpaint/canvas_clear-and-canvas_crop) setzen die Voxel innerhalb oder außerhalb eines Quaders zurück – ein halbes Haus.
- [CANVAS_SCALE](/de/c0de_paint/cpaint/canvas_scale), [CANVAS_ROTATE](/de/c0de_paint/cpaint/canvas_rotate) und [CANVAS_MIRROR](/de/c0de_paint/cpaint/canvas_mirror) machen es größer, drehen es und spiegeln es. Die Zustände der Blöcke drehen sich mit: Treppen und Türen zeigen danach in die richtige Richtung.
- [CANVAS_MOVE](/de/c0de_paint/cpaint/canvas_move) verschiebt eine Leinwand, und [CANVAS_MERGE](/de/c0de_paint/cpaint/canvas_merge) zeichnet sie in eine andere – die Straße.
- [CANVAS_MIN und CANVAS_MAX](/de/c0de_paint/cpaint/canvas_min-and-canvas_max) sagen, wo eine Leinwand anfängt und aufhört, und [CANVAS_GET](/de/c0de_paint/cpaint/canvas_get) liest ein einzelnes Voxel.

Erst ein einziges RENDER_CANVAS ganz am Ende baut die ganze Straße in der Welt.

## Das Programm

<<< @/tutorials/programs/libraries/paint/shaping-canvases-street.c0de

## Aufbauen und starten

1. Stell dich dorthin, wo die Straße beginnen soll, mit Blick nach Osten, und stell dort den Auslöserblock mit dem Knopf darauf hin. Der Auslöserblock steht in der Mitte der Fahrbahn, an ihrem westlichen Ende.
2. Stelle den Auslöserblock auf `street` und `build` ein und drück den Knopf.

Die Häuser wachsen Schicht für Schicht aus dem Boden. Südlich der Fahrbahn, von Westen nach Osten: das Eichenhaus, das Ziegelhaus, die Baustelle, die Fassade und die Halle. Gegenüber steht das Spiegelbild des Eichenhauses, und das gedrehte Haus schließt das östliche Ende der Fahrbahn ab, seine Tür blickt zurück zum Auslöserblock. Vor jeder Tür liegt ein Trampelpfad.

<!-- screenshot: shaping-canvases-street | the whole street seen from above its west end: the trigger block in the middle of the road, south of it the oak house, the brick house, the two-block-high building site, the flat façade and the big hall with its gateway, across the road the mirrored oak house, and the turned house across the east end of the road; dirt paths in front of the doors -->

## So funktioniert es

**Das Haus.** `house` zeichnet in sein Ergebnis und rührt die Welt nicht an.

- **Die Wände** sind ein Quader nur mit `side_style` von 0, 0, 0 bis `width - 1`, `height - 1`, `depth - 1`: Wände, ein Boden und eine Decke aus Brettern, innen nichts.
- **Die Tür** sind zwei Voxel bei `x` 1 auf der Nordseite, `z` 0: die untere und die obere Hälfte. Die BLOCK-Variable hat von den Treppen noch `"facing"` `"north"`, also blickt die Tür nach Norden, und `"hinge"` `"left"` sagt, auf welcher Seite sie hängt.
- **Das Dach** wächst Schicht für Schicht. In jeder Schicht füllt ein Quader aus Brettern den Dachboden von der vorderen Reihe `a.z` bis zur hinteren Reihe `b.z`, dann legen sich zwei Linien aus Treppen über die vordere und die hintere Reihe. Danach rücken beide Reihen ein Voxel nach innen und eins nach oben, bis sie sich treffen: Bei ungerader Tiefe endet das Dach mit einem First aus Brettern. Die Treppen auf der Nordseite zeigen nach Süden, die auf der Südseite nach Norden, so steigen beide zum First hin an.

**Die Straße.** `build` behält das erste Haus in `street` und fügt die anderen eins nach dem anderen hinzu.

- **Das Ziegelhaus.** [CANVAS_REPLACE](/de/c0de_paint/cpaint/canvas_replace) zeichnet jedes Voxel `oak_planks` neu mit dem Stil `bricks`: Wände, Boden, Giebel und First. Die Treppen und die Tür bleiben aus Eiche.
- **Die Baustelle.** [CANVAS_MAX](/de/c0de_paint/cpaint/canvas_min-and-canvas_max) gibt die oberste Ecke des Hauses, die Spitze des Firsts. [CANVAS_CLEAR](/de/c0de_paint/cpaint/canvas_clear-and-canvas_crop) setzt alles von Schicht 2 bis dort hinauf zurück. Zwei Schichten bleiben: der Boden und die Wände des Erdgeschosses, mit der ganzen Tür.
- **Die Fassade.** [CANVAS_CROP](/de/c0de_paint/cpaint/canvas_clear-and-canvas_crop) macht das Gegenteil: Es setzt alles außerhalb des Quaders von 0, 0, 0 bis zur Ecke `b` mit `b.z` 0 zurück. Nur die vorderste Reihe bleibt, einen Block dick, wie eine Filmkulisse.
- **Die Halle.** [CANVAS_SCALE](/de/c0de_paint/cpaint/canvas_scale) mit 200 % auf allen drei Achsen macht jedes Voxel zu 2 × 2 × 2 Voxeln. Treppen bleiben Treppen und behalten ihre Zustände, also bekommt das Dach Stufen von zwei. Eine Tür aus 4 Blöcken funktioniert in Minecraft aber nicht: CANVAS_REPLACE zeichnet die Tür mit STYLE_EMPTY neu, und die Halle bekommt stattdessen ein offenes Tor.
- **Das gedrehte Haus.** [CANVAS_ROTATE](/de/c0de_paint/cpaint/canvas_rotate) dreht es um 90° um die `y`-Achse durch 0, 0, 0. +90° dreht Norden nach Westen: Die Tür blickt nach Westen, und die Zustände der Treppen und der Tür drehen sich mit. Das Haus liegt jetzt bei negativem `z`, was egal ist – `addHouse` findet es.
- **Das Spiegelbild.** [CANVAS_MIRROR](/de/c0de_paint/cpaint/canvas_mirror) spiegelt an der Ebene `z` = -2, in der Mitte der Fahrbahn: Aus `z` 0 wird -4, die Vorderseite blickt also über die Fahrbahn auf die Vorderseite des Eichenhauses. Die Tür zeigt jetzt nach Süden, und ihr Scharnier ist rechts: Eine gespiegelte Tür geht andersherum auf. CANVAS_MERGE zeichnet die Kopie dort in die Straße, wo sie ist.

**Ein Haus auf sein Grundstück stellen.** `addHouse` setzt das nächste Haus 3 Voxel östlich der Straße hin, egal was mit ihm gemacht wurde. CANVAS_MAX gibt das östliche Ende der bisherigen Straße, [CANVAS_MIN](/de/c0de_paint/cpaint/canvas_min-and-canvas_max) die unterste Ecke des Hauses. Die Verschiebung bringt diese Ecke 2 freie Voxel hinter das Ende der Straße, auf die Höhe 0 und in die Reihe `z`: 0 für die Häuser südlich der Fahrbahn, `- width` für das gedrehte Haus, damit seine Tür in der Mitte der Fahrbahn landet. [CANVAS_MOVE](/de/c0de_paint/cpaint/canvas_move) verschiebt die Kopie, und [CANVAS_MERGE](/de/c0de_paint/cpaint/canvas_merge) zeichnet sie in die Straße. Das Zusammenführen ändert nur die Voxel, die das Haus setzt, also bleibt die Straße drumherum, wie sie ist.

**Die Wege.** `paths` sieht sich jedes Voxel der untersten Schicht der Straße mit [CANVAS_GET](/de/c0de_paint/cpaint/canvas_get) an. Seine `id` ist "" für ein Voxel, das nicht gesetzt ist, und `minecraft:oak_door` für die untere Hälfte einer Tür. Das `facing` der Tür sagt, wo es hinausgeht: Die HASHes `dx` und `dz` machen daraus einen Schritt nach Osten oder Süden. Ein Voxel weiter und eins tiefer setzt DRAW_BLOCK einen Trampelpfad in den Boden. Jede Tür bekommt ihren Weg, egal wie das Haus gedreht wurde.

**Bauen.** RENDER_CANVAS setzt das Voxel 0, 0, 0 der Straße 2 Blöcke östlich und 2 Blöcke südlich des Auslöserblocks. Die Fahrbahn zwischen den beiden Reihen ist 3 Blöcke breit: `z` -1 bis -3 in der Leinwand.

Der Programm-Runner baut die Straße mit Häusern von 3 × 3 × 3 Blöcken und vergleicht jeden Block mit einer Liste – die Türen und Treppen eingeschlossen, mit allen ihren Zuständen.

## Probier es selbst

1. Mach die andere Straßenseite zum Spiegelbild der ganzen Reihe, nicht nur des ersten Hauses.

::: details Lösung
Schieb den Teil mit CANVAS_MIRROR nach oben, direkt vor das gedrehte Haus, und spiegle die Straße statt des Hauses: `ASSIGN copy street ;`. Jetzt bekommen auch das Ziegelhaus, die Baustelle, die Fassade und die Halle ihre Spiegelbilder. Das gedrehte Haus kommt danach, also wird es nicht auf sich selbst gespiegelt, und `paths` findet die neuen Türen ohne Änderung, weil es ihr `facing` liest.
:::

2. Gib dem Eichenhaus ein Ziegeldach: Warum funktioniert CANVAS_REPLACE von `"oak_stairs"` mit einem Stil aus `"brick_stairs"` nicht?

::: details Lösung
CANVAS_REPLACE findet die Treppen, egal welche Zustände sie haben, zeichnet den neuen Block aber mit den Zuständen des Stils. Ein STYLE_SOLID aus `brick_stairs` ohne `facing` lässt alle Treppen in dieselbe Richtung zeigen. Gib `house` stattdessen einen Parameter `stairs STRING "oak_stairs"` und nimm ihn für `block.id` der Treppen; dann ruf `house` ein zweites Mal mit `"brick_stairs"` auf.
:::

3. Füg ein hohes Turmhaus hinzu: Skaliere eine Kopie nur nach oben, mit `x` 100, `y` 200 und `z` 100. Was muss mit der Tür passieren?

::: details Lösung
Dasselbe wie bei der Halle: Aus der Tür werden zwei untere und zwei obere Hälften, und das lässt Minecraft nicht zu. Ersetze `"oak_door"` nach dem Skalieren durch STYLE_EMPTY, und der Turm bekommt eine Türöffnung, 1 Block breit und 4 hoch. Füg ihn mit `addHouse` hinzu, wie die Halle.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [CANVAS_MIN und CANVAS_MAX](/de/c0de_paint/cpaint/canvas_min-and-canvas_max), [CANVAS_GET](/de/c0de_paint/cpaint/canvas_get), [CANVAS_CLEAR und CANVAS_CROP](/de/c0de_paint/cpaint/canvas_clear-and-canvas_crop), [CANVAS_MOVE](/de/c0de_paint/cpaint/canvas_move), [CANVAS_REPLACE](/de/c0de_paint/cpaint/canvas_replace), [CANVAS_MERGE](/de/c0de_paint/cpaint/canvas_merge), [CANVAS_SCALE](/de/c0de_paint/cpaint/canvas_scale), [CANVAS_ROTATE](/de/c0de_paint/cpaint/canvas_rotate), [CANVAS_MIRROR](/de/c0de_paint/cpaint/canvas_mirror) und [RENDER_CANVAS](/de/c0de_paint/cpaint/render_canvas)
- [Eine erste Leinwand](/de/tutorials/libraries/c0de_paint/cpaint/first-canvas): der Anfang mit Leinwänden, Stilen und RENDER_CANVAS
- [Gebäude kopieren](/de/tutorials/libraries/c0de_paint/cpaint/copying-buildings): die Welt in eine Leinwand und zurück, aus Truhen
- [Erste Schritte](/de/c0de_paint/cpaint/getting-started) mit c0de paint und seine [Fehler](/de/c0de_paint/cpaint/errors)
- [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung, [WHILE und REPEAT](/de/c0de/guide/language#while-und-repeat) und [Variablen und Konstanten](/de/c0de/guide/language#variablen-und-konstanten), für die HASHes mit Startwerten
