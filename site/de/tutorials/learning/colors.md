---
description: Das Begrüßungsschild bekommt Farben und einen Rahmen – Anweisungen mit Einzelheiten, und warum ihre Reihenfolge wichtig ist.
---

# Farben und der Bildschirm

Weißer Text auf einem dunklen Bildschirm funktioniert, aber ein Schild am Eingang deiner Basis soll ins Auge fallen. Heute bekommt dein Schild gelbe Buchstaben auf blauem Hintergrund, eingerahmt von zwei goldenen Linien oben und unten.

::: tip Neue Wörter

- **Parameter**: eine Einzelheit einer Anweisung, zum Beispiel die Farbe bei „ändere die Farbe“. Ein **optionaler** Parameter darf wegbleiben; dann hat er einen Wert, der für dich gewählt ist.
- **Zeile** und **Spalte** des Bildschirms: Der Bildschirm ist ein Raster aus Zeichen. Zeilen zählen von oben, Spalten von links, beide beginnen bei 0.
  :::

::: info Was du brauchst
Das Schild aus der letzten Lektion. Sprachblöcke: CALL, PARAMETER, LABEL, LITERAL und OPERATOR, und einen **Hammer**, um Zeilen einzufügen.
:::

## Die Idee

„Streich die Wand an“ reicht einem Baumeister nicht. Welche Wand? In welcher Farbe? Die meisten Anweisungen brauchen solche Einzelheiten. Beim Programmieren heißen sie **Parameter**.

Und die Reihenfolge ist noch wichtiger als bisher. Stell dir vor, du sagst einem Baumeister: „Leg die Blöcke. Nimm dann Goldblöcke.“ Die erste Reihe ist schon fertig, aus den Blöcken, die er gerade zur Hand hatte. Du musst „nimm Goldblöcke“ _vor_ „leg die Blöcke“ sagen.

Auf dem Bildschirm ist es genauso. Du wählst zuerst eine Farbe, dann schreibst du. Alles, was danach geschrieben wird, hat diese Farbe, bis du eine andere wählst.

## Das Programm

Das Programm bleibt auf demselben Blatt. Es ersetzt das Schild aus der letzten Lektion.

<<< @/tutorials/programs/learning/colors-sign.c0de

## So baust du es

Die Zeilen 0 bis 5 bleiben, wie sie sind. Das alte PRINT (Zeilen 6 und 7 der letzten Lektion) rückt nach unten in die Zeilen 16 und 17. Um Platz zu machen, klicke Zeile 6 zehnmal mit dem **Hammer** mit rechts an: Jeder Klick fügt davor eine leere Zeile ein. Fülle dann die leeren Zeilen und füge die neuen Zeilen nach dem alten PRINT an. Solange eine Zeile leer ist, sind die Zeilennummern danach dunkelrot, weil die erste leere Zeile das Programm beendet. Sie werden wieder grün, wenn die Lücke gefüllt ist.

- Zeile 6: ein CALL-Block bei x=6, dann ein LABEL mit dem Namen `COLOR`.
- Zeile 7: ein PARAMETER-Block bei x=7, ein LABEL `foreground`, ein LABEL `COLOR_GOLD` und ein OPERATOR `;`.
- Zeilen 8 und 9: ein CALL `PRINT` mit dem PARAMETER `value`, wie in der letzten Lektion. Das LITERAL enthält 32 Gleichheitszeichen `================================`.
- Zeile 10: ein CALL-Block bei x=6, dann ein LABEL mit dem Namen `LOCATE`.
- Zeile 11: ein PARAMETER bei x=7, ein LABEL `row`, ein LITERAL 3 (Typ INTEGER) und ein OPERATOR `;`.
- Zeile 12: ein PARAMETER bei x=7, ein LABEL `column`, ein LITERAL 6 und ein OPERATOR `;`.
- Zeilen 13 bis 15: ein CALL `COLOR` mit zwei PARAMETER-Zeilen: `foreground` ist `COLOR_YELLOW`, `background` ist `COLOR_DARK_BLUE`.
- Zeilen 16 und 17: das alte PRINT von „Welcome to my base!“.
- Zeilen 18 und 19: ein CALL `COLOR` nur mit `foreground` `COLOR_GOLD`.
- Zeilen 20 und 21: ein CALL `LOCATE` nur mit `row` 6.
- Zeilen 22 und 23: ein PRINT der 32 Gleichheitszeichen, wie in den Zeilen 8 und 9.
- Zeile 24: das END FUNCTION.

<!-- screenshot: colors-sign | the program "sign" with the COLOR and LOCATE lines on its sheet, seen from above, all line numbers dark green -->

## Starten

Die Anzeigewand und der Auslöserblock bleiben an `sign` und `welcome` gebunden, denn die Namen haben sich nicht geändert. Drück den Knopf. Die Wand zeigt:

```text
================================


      Welcome to my base!


================================
```

Die Linien sind golden, der Begrüßungstext ist gelb auf dunkelblauem Hintergrund.

<!-- screenshot: colors-result | the display wall at the entrance showing the welcome text in yellow on dark blue between two gold lines of equal signs -->

## So funktioniert es

- `CALL COLOR` ändert die Farben von allem, was **ab jetzt** ausgegeben wird. Sein Parameter `foreground` ist die Farbe der Buchstaben. `COLOR_GOLD` ist einer von 16 Namen für die Farben von Minecraft-Text, von `COLOR_BLACK` bis `COLOR_WHITE`.
- Das erste PRINT schreibt 32 Gleichheitszeichen. Die Wand ist 32 Spalten breit, also füllt die Linie genau eine Zeile.
- `CALL LOCATE` bewegt den Cursor des Bildschirms, die Stelle, an der der nächste Text erscheint. Zeile 3, Spalte 6 ist die vierte Zeile von oben und die siebte Spalte von links, denn beide zählen ab 0. Der Begrüßungstext hat 19 Zeichen, also steht er ungefähr in der Mitte.
- Das zweite COLOR hat zwei Parameter: gelbe Buchstaben auf dunkelblauem Hintergrund.
- Das dritte COLOR hat nur `foreground`. `background` ist ein **optionaler** Parameter: Lässt du ihn weg, ist er 0, die Farbe des Bildschirms selbst. Darum hat die untere Linie keinen blauen Hintergrund.
- Das zweite LOCATE hat nur `row`. Auch `column` ist optional und ist 0, wenn du es weglässt: Die Linie beginnt am linken Rand.
- Warum Zeile 6 und nicht Zeile 7, die letzte Zeile? PRINT beginnt nach seinem Text eine neue Zeile. In der letzten Zeile schiebt die neue Zeile den ganzen Bildschirm um eine Zeile nach oben, und die oberste Linie verschwindet.

## Probier es selbst

1. Mach eine Flagge: drei Streifen aus farbigen Leerzeichen, je zwei Zeilen hoch. Ein Leerzeichen zeigt nur seine Hintergrundfarbe.

::: details Lösung
Jeder Streifen ist ein COLOR mit gleicher Vorder- und Hintergrundfarbe und zwei PRINTs mit 32 Leerzeichen. Das ist die Flagge Österreichs, rot, weiß und rot:

<<< @/tutorials/programs/learning/colors-flag.c0de

Für andere Flaggen wählst du andere Farben. Schwarz sieht man nicht, denn Hintergrund 0 ist die Farbe des Bildschirms.
:::

2. Vertausche im Programm die Zeilen 13 bis 15 (das gelbe COLOR) mit den Zeilen 16 und 17 (dem PRINT des Begrüßungstexts). Was ändert sich auf dem Schild?

::: details Lösung
Der Begrüßungstext ist golden auf der Farbe des Bildschirms, nicht gelb auf blau. Als er ausgegeben wird, war das letzte COLOR das Gold der oberen Linie. Das Gelb kommt danach und wird sofort vom Gold der Zeilen 18 und 19 ersetzt, bevor irgendetwas anderes ausgegeben wird. Die Reihenfolge ist wichtig!
:::

## Mehr dazu

- [COLOR](/de/c0de/reference/functions#color): die Parameter und die 16 Farbnamen
- [LOCATE](/de/c0de/reference/functions#locate) und [CLS](/de/c0de/reference/functions#cls)
- [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock): Zeilen und Spalten von Anzeigewänden
- [Mit Spielern sprechen](/de/c0de/guide/running-programs#mit-spielern-sprechen)
- [Hammer](/de/c0de/guide/tools#hammer): Zeilen einfügen und löschen
