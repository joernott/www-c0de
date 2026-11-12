---
description: Ein Ring aus Blöcken mit beliebigem Radius um den Auslöserblock – COS und SIN machen aus einem Winkel einen Punkt auf dem Kreis, ROUND macht daraus einen Block, und PLACE_BLOCK baut ihn.
---

# Einen Kreis zeichnen

Ein runder Turm, ein Brunnen, ein Ring aus Fackeln um den Spawn: Minecraft besteht aus Quadraten, aber ein Programm kann einen Kreis aus Blöcken mit beliebigem Radius um den Auslöserblock zeichnen. Es geht in kleinen Schritten einmal um den Kreis, macht mit COS und SIN aus jedem Winkel einen Punkt und setzt auf jeden Punkt einen Block.

**Funktionen:** [SIN](/de/c0de/math/sin), [COS](/de/c0de/math/cos), [ROUND](/de/c0de/math/round) und die Konstante [PI](/de/c0de/math/pi), mit [PLACE_BLOCK](/de/c0de/minecraft/place_block) und [SAY](/de/c0de/minecraft/say) aus c0de/minecraft

::: warning Braucht einen Operator
PLACE_BLOCK ohne `inventory` setzt Blöcke aus dem Nichts in die Welt, darum muss der Besitzer des Auslöserblocks ein Operator sein. In der Welt der Tutorials bist du einer. Auf einem Server kann der Administrator es mit `allowBlockChanges=true` in `config/c0de.properties` für alle erlauben; ohne dieses Recht stürzt das Programm mit PERMISSION_DENIED ab. Die Alternative für alle ist PLACE_BLOCK mit `inventory`: Es nimmt die Blöcke aus einer Truhe, wie ein Spieler – siehe die erste Übung.
:::

::: info Was du brauchst
Einen Auslöserblock mit einem Knopf auf ebenem Boden, mit etwas Platz drumherum. Wahlweise die **Variablenkarten** `radius` vom Typ INTEGER und `block` vom Typ STRING (eine Block-ID wie `minecraft:oak_planks`); ohne sie hat der Ring den Radius 5 und ist aus Steinziegeln.
:::

## Die Idee

Ein Punkt auf einem Kreis mit dem Radius `r` um die Mitte ist `x = r · cos(Winkel)` und `z = r · sin(Winkel)`. Wenn der Winkel von 0 bis zu einer vollen Drehung läuft, geht der Punkt einmal um den Kreis. Der Winkel ist im Bogenmaß, und eine volle Drehung ist 2 × PI.

Blöcke haben ganze Koordinaten, darum schiebt ROUND jeden Punkt auf den nächsten Block. Daraus folgen zwei Dinge:

- **Genug Schritte.** Der Kreis ist 2 × PI × r lang, etwa 6,3 × r Blöcke. Mit 8 × r Schritten liegen zwei Punkte weniger als einen Block auseinander, also hat der Ring keine Lücken.
- **Kein Block doppelt.** Bei so vielen Schritten landen benachbarte Punkte oft auf demselben Block. PLACE_BLOCK setzt einen Block nur in Luft (oder Gras, Wasser und andere ersetzbare Blöcke) und löst sonst INVALID_ARGUMENT aus, darum wird ein Punkt übersprungen, der derselbe ist wie der davor.

## Die Rechnung

Die Funktion `points` rechnet nur, darum lässt sie sich ohne die Welt testen: Für den Radius 3 gibt sie 20 Abstände von der Mitte, von `x: 3, z: 0` einmal herum bis `x: 3, z: -1`; für den Radius 1 die 8 Blöcke um die Mitte.

<<< @/tutorials/programs/libraries/math/circle-points.c0de

## Der Ring in der Welt

Das Programm `ring` hat dieselbe Struktur und Funktion und dazu eine Funktion `draw`, die auf jeden Punkt einen Block setzt:

<<< @/tutorials/programs/libraries/math/circle-ring.c0de

## So baust und startest du es

1. Setze den Auslöserblock auf ebenen Boden und einen Knopf daran.
2. Stelle ihn auf das Programm `ring` und die Funktion `draw` ein. Wenn du magst, lege die Karten `radius` und `block` in sein Eingabeinventar.
3. Drück den Knopf. Block für Block wächst ein Ring aus Steinziegeln um den Auslöserblock, von oben gesehen im Uhrzeigersinn, angefangen im Osten. Am Ende sagt der Chat `40 blocks placed, 0 spots were taken`.

<!-- screenshot: circle-ring | a ring of stone bricks with the radius 5 on flat grass around a trigger block with a button, seen from above at an angle -->

Der Ring steht auf der Höhe des Auslöserblocks. Eine Stelle, an der schon ein Block steht, etwa ein Baum, wird übersprungen und gezählt.

## So funktioniert es

- **`angle`** ist `2 * c0de/math/PI * i / steps`: ein Bruchteil einer vollen Drehung. `/` gibt ein FLOAT, wie COS und SIN es brauchen.
- **COS und SIN** geben eine Zahl von -1 bis 1; mal `radius` ist das der Abstand von der Mitte. ROUND schreibt ihn direkt in die Elemente `spot.x` und `spot.z` der Struktur.
- **Doppelte überspringen.** Der neue Punkt wird mit dem letzten in der Liste verglichen und mit dem ersten, denn die letzten Schritte des Kreises kommen dort an, wo er angefangen hat. Strukturen werden Element für Element verglichen.
- **Die ERROR-Variable in der CALL-Zeile** fängt den Fehler von PLACE_BLOCK ab, damit eine besetzte Stelle das Programm nicht abstürzen lässt. Nach einem CALL ohne Fehler ist `problem.code` wieder 0.
- **Nicht ganz symmetrisch.** ROUND schickt ein ,5 zum geraden Nachbarn, und ein FLOAT liegt oft ein winziges Stück neben einem ,5. Manche Punkte eines kleinen Rings landen auf einem anderen Block als ihr Spiegelbild – geschlossen ist der Ring trotzdem.

## Probier es selbst

1. Baue den Ring ohne Operatorrechte: Nimm die Blöcke aus einer Truhe oben auf dem Auslöserblock.

::: details Lösung
Der Parameter `inventory` von PLACE_BLOCK nennt die Truhe, eine POSITION einen Block über dem Auslöserblock. Füll die Truhe mit Steinziegeln (40 für den Radius 5) und setze den Knopf an eine Seite des Auslöserblocks. Wenn die Truhe leer ist, löst PLACE_BLOCK ITEM_MISSING aus, und die Stelle zählt als übersprungen.

<<< @/tutorials/programs/libraries/math/circle-chest.c0de

:::

2. Was passiert mit `4 * radius` Schritten statt `8 * radius`?

::: details Lösung
Der Kreis ist etwa 6,3 × r Blöcke lang, also liegen 4 × r Schritte etwa 1,6 Blöcke auseinander. Bei einem kleinen Radius trifft ROUND noch benachbarte Blöcke, bei einem größeren bekommt der Ring Lücken, wo ein Schritt über einen Block springt. Mehr Schritte kosten Zeit – eine Zeile pro Tick –, machen aber nie eine Lücke.
:::

## Mehr dazu

- Die Handbuchseiten von [SIN](/de/c0de/math/sin), [COS](/de/c0de/math/cos) und [ROUND](/de/c0de/math/round), und der Konstante [PI](/de/c0de/math/pi)
- [PLACE_BLOCK](/de/c0de/minecraft/place_block), [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern) und [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen)
- [Fehler](/de/c0de/guide/language#fehler): einen Fehler mit einer ERROR-Variable abfangen
- [Programme in der Welt](/de/tutorials/programmers/world): wer die Welt verändern darf
