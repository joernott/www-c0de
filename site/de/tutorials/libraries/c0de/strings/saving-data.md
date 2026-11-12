---
description: Eine Bestenliste, die zwischen den Läufen erhalten bleibt – als JSON in einer Variablenkarte mit TO_JSON und FROM_JSON, als YAML mit TO_YAML angezeigt und mit FROM_YAML aus einer getippten YAML-Liste begonnen.
---

# Daten als Text speichern

Eine Bestenliste für deine Spiele: Nach jedem Spiel tippt der Spieler seinen Namen und seine Punkte auf einem Laptop ein, und die Liste zeigt die besten fünf. Zwischen den Läufen bleibt die Liste als JSON-Text in einer Variablenkarte namens `scores` erhalten, und jeder Lauf liefert dir die Liste zusätzlich als YAML, das leichter zu lesen ist.

**Funktionen:** [TO_JSON](/de/c0de/strings/to_json), [FROM_JSON](/de/c0de/strings/from_json), [TO_YAML](/de/c0de/strings/to_yaml), [FROM_YAML](/de/c0de/strings/from_yaml)

::: info Was du brauchst
Einen Auslöserblock mit Knopf, einen **Laptop**, einen **E/A-Block** und ein paar nicht initialisierte **Variablenkarten**: für jedes Spiel eine für den Auslöserblock und eine für den E/A-Block.
:::

## Die Idee

Eine Variable lebt nur, solange ihr Programm läuft. Was bleiben soll, muss den Prozess als Karte verlassen. Ein Text ist dafür die nützlichste Form: Du kannst ihn im Dialog der Karte lesen und ändern, in ein Buch kopieren oder an einen Webdienst schicken, und eine spätere Version des Programms kann ihn noch lesen, wenn ihre Struktur ein neues Element bekommen hat – ein Schlüssel, der im Text fehlt, behält einfach seinen Standardwert.

JSON macht aus jedem Wert einen Text und wieder zurück. TO_JSON schreibt die Liste als `[{"name":"Kai","points":150}]`, einen STRING, der in eine Variablenkarte passt. Beim nächsten Start liest FROM_JSON diesen Text zurück in ein Array desselben Typs. YAML macht dasselbe in einer Form, die Menschen leichter lesen und schreiben; c0de hat beides, TO_YAML und FROM_YAML.

Noch etwas: Die Karte muss mit dem Namen `scores` herauskommen, damit sie direkt wieder in den Auslöserblock kann. Ein Ergebnis darf nicht so heißen wie ein Parameter, aber WRITE kann seiner Karte jeden Namen geben.

## Das Programm

<<< @/tutorials/programs/libraries/strings/saving-data-highscores.c0de

## So baust und startest du es

1. Platziere den Laptop und den E/A-Block. Binde beide an das Programm `highscores` und die Funktion `add`: Klicke mit rechts, klicke die Knöpfe, bis sie das Programm und die Funktion zeigen, und klicke auf ✔.
2. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein. Lege eine nicht initialisierte Variablenkarte in den Auslöserblock (für das Ergebnis `yaml`) und eine in den E/A-Block (für `scores`).
3. Drücke den Knopf. Der Laptop fragt `Name?`: Tippe `Kai` und drücke Enter, dann `150` für `Points?`. Der Bildschirm zeigt `Kai 150`.
4. In der Ausgabe des E/A-Blocks liegt jetzt die Karte `scores` mit dem Text `[{"name":"Kai","points":150}]`, und in der Ausgabe des Auslöserblocks die Karte `yaml`:

```yaml
- name: Kai
  points: 150
```

5. Für das nächste Spiel legst du die Karte `scores` in die Eingabe des Auslöserblocks, je eine nicht initialisierte Karte in den Auslöserblock und den E/A-Block, und drückst wieder den Knopf.

Mit fünf Einträgen in der Liste – Alex 300, Steve 200, Kai 150, Zoe 90, Sam 40 – und einem neuen Ergebnis von Mia mit 200 zeigt der Laptop:

```
Name?
Mia
Points?
200
Alex 300
Steve 200
Mia 200
Kai 150
Zoe 90
```

Sam ist herausgefallen.

<!-- screenshot: saving-data-io-block | the dialog of the I/O block after the run, with the variable item scores in its output -->

## So funktioniert es

- Der Parameter `scores` hat den Standardwert `"[]"`, ein leeres JSON-Array. Im ersten Spiel gibt es noch keine Karte, und die Liste beginnt leer.
- FROM_JSON liest den Text in `table`. Der Typ der Variablen bestimmt, wie das Dokument gelesen wird: Ein `ARRAY STRUCT entry` liest ein Array von Objekten mit den Schlüsseln `name` und `points`. `destination` ist die Variable selbst, als Referenz übergeben, darum hat FROM_JSON kein Ergebnis.
- Die beiden INPUTs füllen `player` und `points`, und die Struktur `newcomer` bekommt beides.
- Die Liste ist vom besten Ergebnis abwärts sortiert. EACH zählt die Einträge mit mindestens so vielen Punkten wie der Neue; das ist die Stelle, an der INSERT den neuen Eintrag einfügt. Bei Gleichstand kommt er hinter den älteren Eintrag, darum steht Mia nach Steve.
- Bei mehr als `PLACES` Einträgen wirft REMOVE den letzten heraus, bei Index 5.
- TO_JSON schreibt die Liste in eine Zeile JSON, in der Reihenfolge der Strukturelemente. WRITE legt sie als Variablenkarte namens `scores` in den E/A-Block. Ohne nicht initialisierte Karte in einem gebundenen E/A-Block wartet der Prozess in der WRITE-Zeile.
- TO_YAML schreibt dieselbe Liste im Blockstil, ein Schlüssel pro Zeile, für das Ergebnis `yaml`.

## Probier es selbst

1. Jemand hat die Karte `scores` bearbeitet und kaputt gemacht: `[{"name":"Alex","points":"lots"}]`. Statt abzustürzen, soll das Programm das melden und eine neue Liste beginnen.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/saving-data-safe.c0de

Die Fehlervariable `problem` in der CALL-Zeile fängt den Fehler ab: `"lots"` ist kein INTEGER, also löst FROM_JSON TYPE_MISMATCH aus. Bei einem Fehler lässt FROM_JSON `table` unverändert, es ist also noch das leere Array. Der Laptop zeigt `? Unreadable scores, new table`, und die neue Karte `scores` enthält nur den neuen Eintrag.
:::

2. Beginne eine Liste, die du von Hand tippst. YAML ist leichter zu tippen als JSON, weil es keine Anführungszeichen braucht: Schreib ein Programm, das eine YAML-Liste aus einem Parameter `list` liest und sie als Karte `scores` in den E/A-Block legt.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/saving-data-yaml.c0de

Binde einen E/A-Block an `highscoresyaml` und `load`, mit einer nicht initialisierten Variablenkarte darin. Gib dem Auslöserblock eine Variablenkarte `list` vom Typ STRING mit diesem Text – einer YAML-Liste in einer Zeile:

```yaml
[{name: Alex, points: 300}, {name: Steve, points: 200}]
```

FROM_YAML liest sie in denselben Array-Typ wie in `highscores`, und TO_JSON schreibt sie als JSON. Der E/A-Block bekommt die Karte `scores` mit `[{"name":"Alex","points":300},{"name":"Steve","points":200}]`, fertig für den Auslöserblock von `highscores`.
:::

## Mehr dazu

- [c0de/strings](/de/c0de/strings/): [TO_JSON](/de/c0de/strings/to_json), [FROM_JSON](/de/c0de/strings/from_json), [TO_YAML](/de/c0de/strings/to_yaml), [FROM_YAML](/de/c0de/strings/from_yaml)
- [JSON und YAML](/de/c0de/guide/libraries#json-und-yaml) in der Anleitung, und [Daten und das Netzwerk](/de/tutorials/programmers/data) für Tags und Standardwerte
- [WRITE](/de/c0de/reference/functions#write) und der [E/A-Block](/de/c0de/reference/devices#ea-block)
- [Variablenkarten](/de/c0de/guide/running-programs#variablenkarten) und [Ergebnisse](/de/c0de/guide/running-programs#ergebnisse)
