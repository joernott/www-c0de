---
description: Wie weit ist jeder Spieler weg, und in welcher Richtung? Pythagoras mit SQR, die Entfernung zu Fuß mit ABS und ein Schritt auf den Spieler zu entlang jeder Achse mit SGN.
---

# Entfernung und Richtung

Ein Spielerfinder am Tor deiner Basis: Drück den Knopf, und der Chat sagt dir, wo jeder Spieler in der Nähe ist – „Alex is 7 blocks away, north-east, higher up“. Das Programm misst die gerade Entfernung, die Entfernung zu Fuß und die Richtung als einen Schritt entlang jeder Achse.

**Funktionen:** [SQR](/de/c0de/math/sqr), [ABS](/de/c0de/math/abs) und [SGN](/de/c0de/math/sgn), mit [ROUND](/de/c0de/math/round) aus c0de/math und [FIND_ENTITIES](/de/c0de/minecraft/find_entities) und [SAY](/de/c0de/minecraft/say) aus c0de/minecraft

::: info Was du brauchst
Einen Auslöserblock mit einem Knopf. Um die Rechnung allein auszuprobieren: die **Variablenkarten** `dx`, `dy` und `dz` vom Typ FLOAT und sechs nicht initialisierte Karten. Für den Finder in der Welt: sonst nichts, und einen Freund (oder ein zweites Konto) zum Finden.
:::

## Die Idee

Minecraft zählt x nach Osten, z nach Süden und y nach oben. Der Unterschied zweier Positionen, `dx`, `dy` und `dz`, sagt alles über den Weg zwischen ihnen:

- **Die gerade Entfernung** ist die Diagonale eines Quaders mit den Seiten `dx`, `dy` und `dz`. Nach Pythagoras ist ihr Quadrat `dx² + dy² + dz²`, und SQR, die Quadratwurzel, macht daraus wieder Blöcke.
- **Die Entfernung zu Fuß**, wenn du nur entlang der Achsen gehen kannst, addiert die Längen der drei Seiten. Eine Seite ist eine Länge, auch wenn sie negativ ist – 6 Blöcke nach Norden sind `dz` = -6 –, darum lässt ABS zuerst das Vorzeichen weg.
- **Die Richtung** ist das Vorzeichen jeder Seite: SGN gibt -1, 0 oder 1. Diese drei Zahlen sind auch ein Schritt von einem Block auf den anderen zu: `x + stepX`, `y + stepY`, `z + stepZ`.

## Die Rechnung

Zuerst die Rechnung allein, damit du sie mit Variablenkarten testen kannst:

<<< @/tutorials/programs/libraries/math/distance-compass.c0de

Mit `dx` = 3, `dy` = 2 und `dz` = -6 sind die Ergebnisse `distance` = 7.0 (die Wurzel aus 9 + 4 + 36), `walk` = 11.0, die Schritte 1, 1 und -1 und `direction` = `north-east`. Mit `dx` = -4.5 und den anderen 0 sind es 4.5, 4.5 und `west`.

## Der Finder in der Welt

Die Funktion `measure` kommt unverändert in ein Programm mit c0de/minecraft. `find` sucht Spieler um den Auslöserblock herum und fragt `measure` nach jedem von ihnen:

<<< @/tutorials/programs/libraries/math/distance-player.c0de

## So baust und startest du es

1. Stelle den Auslöserblock auf das Programm `playerfinder` und die Funktion `find` ein. Er braucht keine Karten: `radius` hat den Vorgabewert 32.
2. Geh ein Stück weg, oder bitte einen Freund darum, und drück den Knopf (oder lass deinen Freund drücken).
3. Der Chat zeigt eine Zeile pro Spieler innerhalb von 32 Blöcken, etwa `[playerfinder/0] Alex is 7 blocks away, north-east, higher up`. Du stehst auch auf der Liste, als der Spieler direkt neben dem Auslöserblock.

## So funktioniert es

- **`PID.x`, `PID.y` und `PID.z`** sind die Position des Auslöserblocks. `here` ist eine POSITION-Struktur mit ihnen, die Mitte für FIND_ENTITIES.
- **Die Unterschiede gehen direkt in die PARAMETER-Zeilen**: `player.position.x - here.x`. `measure` nimmt FLOATs, und ein INTEGER passt von selbst in ein FLOAT.
- **`dx ^ 2`** quadriert einen Wert; die Summe ist nie negativ, darum löst SQR hier nie INVALID_ARGUMENT aus. Ohne das Quadrat würde es ein negativer Wert tun.
- **ABS und SGN zusammen** zerlegen eine Zahl in ihre Größe und ihr Vorzeichen: `size * sign` ist wieder die Zahl.
- **Der Richtungstext** setzt Norden oder Süden zuerst, dann Osten oder Westen, mit einem Strich nur, wenn es beides gibt. Für einen Spieler genau über oder unter dem Auslöserblock gibt es keine Himmelsrichtung.
- **RESULT-Zeilen wählen Ergebnisse aus.** `find` braucht von `measure` nur `distance`, `stepY` und `direction`; die anderen werden weggeworfen.

## Probier es selbst

1. Eine Wachzone ist ein Würfel, keine Kugel: Ein Spieler ist drinnen, wenn er entlang jeder Achse höchstens `size` Blöcke weg ist. Schreib eine Funktion `inside` mit ABS.

::: details Lösung
Jede der drei Entfernungen muss höchstens `size` sein. Mit `dx` = -8, `dy` = 3, `dz` = 10 und der vorgegebenen Größe 10 ist `inside` TRUE; mit `dz` = -11 ist es FALSE.

<<< @/tutorials/programs/libraries/math/distance-zone.c0de

:::

2. Warum ist `walk` (11 Blöcke) im Beispiel länger als `distance` (7 Blöcke) – und wann sind beide gleich?

::: details Lösung
`distance` ist die gerade Linie durch die Luft, die Diagonale; `walk` geht an den Kanten des Quaders entlang, und das ist immer mindestens so lang. Gleich sind sie, wenn zwei der drei Unterschiede 0 sind, wie bei `dx` = -4.5 allein: Dann ist der Weg eine gerade Linie entlang einer Achse.
:::

## Mehr dazu

- Die Handbuchseiten von [SQR](/de/c0de/math/sqr), [ABS](/de/c0de/math/abs) und [SGN](/de/c0de/math/sgn)
- [FIND_ENTITIES](/de/c0de/minecraft/find_entities) und [SAY](/de/c0de/minecraft/say) aus [c0de/minecraft](/de/c0de/minecraft/)
- [Strukturen](/de/c0de/guide/language#strukturen) in der Anleitung: die Konstante `PID`
- [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern): die Struktur POSITION
