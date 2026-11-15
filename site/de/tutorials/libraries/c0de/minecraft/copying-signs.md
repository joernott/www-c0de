---
description: Ein Kopierer, der einen Block mit GET_BLOCK samt seinen Daten liest – den Text eines Schilds, die Gegenstände einer Truhe – und mit PLACE_BLOCK und seinem Parameter data eine genaue Kopie woanders hinsetzt.
---

# Schilder und Truhen kopieren

Ein Schild mit einem langen Text, von Hand geschrieben – und du brauchst es fünfmal, für jeden Eingang deiner Basis. Oder eine Truhe mit einer Grundausstattung für jeden neuen Spieler. Ein Kopierer liest den Block mit allem, was darin ist, und setzt eine Kopie: das Schild mit seinem Text, die Truhe mit ihren Gegenständen.

**Funktionen:** [GET_BLOCK](/de/c0de/minecraft/get_block), [PLACE_BLOCK](/de/c0de/minecraft/place_block) und [SAY](/de/c0de/minecraft/say)

::: warning Braucht einen Operator
Eine Kopie einer Truhe mit ihren Gegenständen macht Gegenstände aus dem Nichts, darum funktioniert PLACE_BLOCK mit `data` nur, wenn der Besitzer des Auslöserblocks ein Operator ist – in der Welt der Tutorials bist du einer. Auf einem Server kann der Administrator es mit `allowBlockChanges=true` in `config/c0de.properties` für alle erlauben, was Programmen auch erlaubt, Blöcke aus dem Nichts zu setzen und zu entfernen; ohne das Recht löst PLACE_BLOCK PERMISSION_DENIED aus. Das gilt auch mit dem Parameter `inventory`. Befehlsblöcke, Konstruktionsblöcke und Verbundblöcke darf nur ein Operator mit ihren Daten kopieren, wie mit `/setblock`. GET_BLOCK funktioniert immer: Jedes Programm kann den Text eines Schilds lesen.
:::

::: info Was du brauchst

- einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für jedes Programm
- ein **Schild** mit etwas Text darauf und eine **Truhe** mit ein paar Gegenständen
- für die Übungen: eine freie Reihe von 5 Blöcken östlich des Auslöserblocks

:::

## Die Idee

ID und Blockzustände (in welche Richtung ein Schild schaut, ob eine Truhe allein steht) machen noch kein Schild. Sein Text, die Gegenstände einer Truhe, der Name eines umbenannten Ofens stehen in den **Daten** des Blocks. GET_BLOCK gibt sie in seinem Ergebnis `data` als Text zurück, in der Form, die auch die Befehle `/data` und `/setblock` benutzen (SNBT). Eine Truhe mit zwölf Bruchstein im ersten Platz hat zum Beispiel:

```
{Items:[{Slot:0b,count:12,id:"minecraft:cobblestone"}]}
```

Die Position gehört nicht zu den Daten, darum passen sie überall hin. PLACE_BLOCK nimmt sie in seinem Parameter `data` und gibt sie dem neuen Block. Blöcke ohne solche Daten, etwa Stein, haben die Daten `""` – und PLACE_BLOCK mit leerem `data` setzt einfach den Block. So kopiert der Kopierer jeden Block, mit oder ohne Daten.

## Das Programm

<<< @/tutorials/programs/libraries/minecraft/copying-signs-copy.c0de

## Aufbauen und starten

1. Stell den Auslöserblock auf und setz den Knopf darauf.
2. Beschrifte ein Schild und stell es 2 Blöcke westlich des Auslöserblocks auf den Boden. Lass den Platz 2 Blöcke östlich des Auslöserblocks frei.
3. Stelle den Auslöserblock auf `copier` und `copy` ein und drück den Knopf.

Die Kopie steht 2 Blöcke östlich, schaut in dieselbe Richtung, trägt denselben Text, und der Chat zeigt die kopierten Daten. Bau jetzt das Schild ab und stell dort eine Truhe hin – eine einzelne, keine große Truhe – mit ein paar Gegenständen. Bau auch die Kopie des Schilds ab und drück den Knopf noch einmal: Die neue Truhe hat dieselben Gegenstände.

<!-- screenshot: copying-signs-copy | the trigger block with its button between a written sign and its copy, the chat showing the copied data -->

## So funktioniert es

- **Drei Ergebnisse, ein Block.** GET_BLOCK gibt die `id`, die Blockzustände in `properties` und die Daten in `data` zurück. PLACE_BLOCK nimmt alle drei. Ohne `properties` würde das Schild immer nach Süden schauen, ohne `data` wäre es leer.
- **Nichts zu kopieren.** Ist der Platz 2 Blöcke westlich leer, gibt GET_BLOCK `minecraft:air` zurück, und das Programm sagt das, statt Luft zu „kopieren“.
- **Wenn es nicht passt.** PLACE_BLOCK setzt einen Block nur dorthin, wo Luft oder etwas Ersetzbares wie Gras ist, sonst löst es INVALID_ARGUMENT aus. Der CALL fängt das in `problem` auf, und das Programm sagt, warum es keine Kopie gibt, statt abzustürzen. Ohne das Recht ist `problem` PERMISSION_DENIED.
- **Abhängig von der Version.** Die Daten haben das Format der Minecraft-Version, mit der sie gelesen wurden; das Programm reicht sie nur weiter, darum spielt das hier keine Rolle. Ein Text, den du aus einer älteren Version aufgehoben hast, funktioniert in einer neueren vielleicht nicht.
- **Ein Schild an der Wand.** Ein Wandschild (`minecraft:oak_wall_sign`) wird auch kopiert, aber die Kopie hängt in der Luft, wenn keine Wand dahinter ist. Wie `/setblock` prüft PLACE_BLOCK das nicht.

## Probier es selbst

1. Mach fünf Kopien in einer Reihe, von 2 bis 6 Blöcke östlich des Auslöserblocks.

::: details Lösung
GET_BLOCK muss den Block nur einmal lesen; eine FOR-Schleife setzt die Kopien. Passt eine nicht, hört das Programm dort auf. Mit einer INTEGER-Variablenkarte `copies` macht der Auslöserblock so viele, wie du willst.

<<< @/tutorials/programs/libraries/minecraft/copying-signs-row.c0de

:::

2. Auf einem Server, auf dem `allowBlockChanges` an ist, würde der Kopierer jede Truhe voller Diamanten kopieren. Lass ihn nur Schilder kopieren.

::: details Lösung
Alle Schild-IDs enthalten `_sign`: `minecraft:oak_sign`, `minecraft:oak_wall_sign`, `minecraft:spruce_hanging_sign` … Die Funktion `isSign` sucht danach mit [INSTR](/de/c0de/strings/instr). Sie braucht keine Welt, darum testet der Programm-Runner sie mit `minecraft:oak_sign`, `minecraft:spruce_wall_hanging_sign` (beide wahr) und `minecraft:chest` (falsch).

<<< @/tutorials/programs/libraries/minecraft/copying-signs-only.c0de

:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [GET_BLOCK](/de/c0de/minecraft/get_block), [PLACE_BLOCK](/de/c0de/minecraft/place_block) und [SAY](/de/c0de/minecraft/say)
- [Bauen](/de/tutorials/libraries/c0de/minecraft/building): PLACE_BLOCK mit Blöcken aus einer Truhe, für alle
- [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern) und [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung
- [Fehler](/de/c0de/guide/language#fehler) in der Anleitung: einen Fehler in einem CALL auffangen
