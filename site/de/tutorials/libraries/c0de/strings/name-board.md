---
description: Ein umrahmtes Namensschild auf einer Anzeigewand – Text in Großbuchstaben, Namen mit großem Anfangsbuchstaben, mit Leerzeichen zentriert und auf die Breite des Bildschirms gekürzt.
---

# Ein Namensschild

Ein Schild am Eingang deiner Basis: ein Rahmen aus `=`-Zeichen auf einer Anzeigewand, ein Gruß in Großbuchstaben und in der Mitte der Name des Besitzers. Egal, wie der Name eingetippt ist – `sTEVE`, `steve` oder `STEVE` –, das Schild zeigt `Steve`, und ein zu langer Name wird mit `...` abgeschnitten.

**Funktionen:** [UCASE](/de/c0de/strings/ucase), [LCASE](/de/c0de/strings/lcase), [LEFT](/de/c0de/strings/left), [RIGHT](/de/c0de/strings/right), [SPACE](/de/c0de/strings/space), [FILL](/de/c0de/strings/fill) und [DIV](/de/c0de/math/div) aus c0de/math

::: info Was du brauchst
Einen Auslöserblock mit Knopf, eine **Anzeigewand** aus 2 × 1 Anzeigeblöcken (32 Spalten und 8 Zeilen) und eine **Variablenkarte** `name` vom Typ STRING mit dem Namen, zum Beispiel `sTEVE`. Wahlweise eine zweite Variablenkarte `title` vom Typ STRING für einen anderen Gruß.
:::

## Die Idee

Ein Bildschirm ist ein Raster aus Zeichen, und jede Zeile ist gleich breit. Um einen Text in die Mitte zu setzen, brauchst du vor ihm so viele Leerzeichen wie hinter ihm; um eine Linie zu zeichnen, brauchst du dasselbe Zeichen viele Male. c0de/strings macht dir beide Texte: SPACE liefert eine Anzahl Leerzeichen, FILL eine Anzahl Kopien eines Zeichens.

Der Name braucht noch zwei Dinge. UCASE und LCASE ändern die Schreibweise eines ganzen Textes, also bekommt ein Name seinen großen Anfangsbuchstaben in zwei Teilen: LEFT nimmt den ersten Buchstaben für UCASE, RIGHT den Rest für LCASE. Und LEFT kürzt auch einen Namen, der nicht passt, damit er nie in die nächste Zeile umbricht und den Rahmen zerstört.

## Das Programm

<<< @/tutorials/programs/libraries/strings/name-board-frame.c0de

## So baust und startest du es

1. Baue die Anzeigewand aus zwei Anzeigeblöcken nebeneinander. Klicke einen davon mit rechts an, klicke die Knöpfe, bis sie `nameboard` und `show` zeigen, und klicke auf ✔. Damit ist die ganze Wand gebunden.
2. Stelle den Auslöserblock auf das Programm `nameboard` und die Funktion `show` ein und lege die Variablenkarte `name` in sein Eingabeinventar.
3. Drücke den Knopf. Die Wand zeigt:

```
+==============================+
|                              |
|    WELCOME TO THE BASE OF    |
|            Steve             |
|                              |
+==============================+
```

<!-- screenshot: name-board-wall | the display wall of 2 × 1 blocks with the frame of = signs, the greeting WELCOME TO THE BASE OF and the name Steve -->

Mit dem Namen `alexander_the_great_redstone_builder` und dem Titel `Hello` wird die Namenszeile zu `|Alexander_the_great_redston...|`.

## So funktioniert es

- `WIDTH` ist die Breite der Wand. Alles andere wird daraus berechnet, eine Wand aus 3 × 1 Blöcken braucht also nur `WIDTH` 48.
- FILL macht die 30 `=` des Rahmens, und `⊕` fügt die Ecken an. FILL nimmt ein CHAR (`'='` in einfachen Anführungszeichen), keinen STRING.
- UCASE macht aus dem ganzen Titel Großbuchstaben. Das Ergebnis geht zurück in den Parameter `title`, der eine Kopie ist; der Wert des Aufrufers ändert sich also nicht.
- Für den Namen liefert LEFT mit `length` 1 den ersten Buchstaben und RIGHT mit `length - 1` alle anderen. UCASE und LCASE bearbeiten je einen Teil, und `first ⊕ rest` fügt sie wieder zusammen.
- `center` rahmt eine Zeile. Einen Text, der länger als die 30 inneren Spalten ist, kürzt LEFT auf 27 Zeichen, und `...` füllt den Rest. Der freie Platz wird mit DIV aus c0de/math in zwei Hälften geteilt, weil `/` immer ein FLOAT ergibt. Ist der Platz ungerade, kommt das zusätzliche Leerzeichen hinter den Text.
- SPACE macht die Lücken. Mit `count` 0 liefert es den leeren Text, ein Text, der die Zeile genau füllt, braucht also keinen Sonderfall.
- Jede Zeile ist genau 32 Zeichen breit und endet am Rand der Wand, darum beginnt PRINT die nächste in der Zeile darunter, ohne Leerzeile.

## Probier es selbst

1. Lass den Spieler das Zeichen des Rahmens mit einer Variablenkarte `edge` vom Typ CHAR wählen, zum Beispiel `*`.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/name-board-border.c0de

Der Parameter `edge` hat den Standardwert `'='`, das Schild funktioniert also auch ohne die Karte. Mit `*` sind die oberste und die unterste Zeile `+******************************+`.
:::

2. Ein Türschild: Zeige `Room of` und den Namen in Großbuchstaben am rechten Rand der Wand, ohne Rahmen.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/name-board-right.c0de

RIGHT kann auch ausrichten: Setze 32 Leerzeichen vor den Text und nimm die letzten 32 Zeichen. Für `Alex` ist die zweite Zeile `ALEX` mit 28 Leerzeichen davor.
:::

## Mehr dazu

- [c0de/strings](/de/c0de/strings/): [UCASE](/de/c0de/strings/ucase), [LCASE](/de/c0de/strings/lcase), [LEFT](/de/c0de/strings/left), [RIGHT](/de/c0de/strings/right), [SPACE](/de/c0de/strings/space), [FILL](/de/c0de/strings/fill)
- [DIV](/de/c0de/math/div) aus c0de/math
- [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock): die Größe von Anzeigewänden
- [PRINT](/de/c0de/reference/functions#print) und [CLS](/de/c0de/reference/functions#cls)
