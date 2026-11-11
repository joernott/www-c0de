---
description: Text auf Anzeigewänden, Laptops und Tablets, die Tastatur mit INPUT und INKEY, Werte über E/A-Blöcke – und welches Gerät welcher Funktion antwortet.
---

# Bildschirme, Tastaturen und E/A-Blöcke

Ein c0de-Programm hat kein stdin und stdout. Es spricht mit Spielern über Geräte, die du an ein Programm und eine Funktion bindest: Bildschirme zeigen, was PRINT schreibt, Laptops und Tablets nehmen Tasten und eingetippte Zeilen entgegen, und E/A-Blöcke bringen Werte als Karten hinein und hinaus. Die Bildschirmfunktionen stammen aus AmigaBASIC; wenn du `LOCATE` und `INKEY$` kennst, kennst du den Großteil dieser Lektion.

::: info Was du brauchst
Einen Auslöserblock mit Knopf, einen **Laptop** (oder ein Tablet) und eine nicht initialisierte **Variablenkarte** für das Ergebnis. Wahlweise eine **Anzeigewand** aus 2 × 1 Anzeigeblöcken, die denselben Bildschirm zeigt. Für die Übungen: einen **E/A-Block** und ein paar weitere nicht initialisierte Variablenkarten.
:::

## Das Modell

- **Geräte werden gebunden, nicht geöffnet.** Klicke einen Anzeigeblock, Laptop oder E/A-Block mit rechts an (oder klicke mit einem Tablet mit links), wähle mit den beiden Knöpfen Programm und Funktion und klicke auf ✔. Ein Prozess arbeitet mit jedem Gerät, das an sein Programm und seine Einstiegsfunktion gebunden ist. Es gibt keine Handles oder Dateideskriptoren.
- **Eine Ausgabe, viele Bildschirme.** PRINT, CLS, LOCATE und COLOR wirken auf alle gebundenen Bildschirme zugleich, jeden in seiner eigenen Größe: Ein Anzeigeblock hat 16 × 8 Zeichen, ein Laptop 48 × 20. Mehrere Prozesse desselben Programms und derselben Funktion teilen sich die Geräte.
- **Zeilen und Spalten beginnen bei 0.** Am Ende einer Zeile geht der Text in der nächsten weiter; unter der letzten Zeile rollt der Bildschirm nach oben.
- **Das zuerst gebundene Gerät antwortet.** CSRLIN und POS geben den Cursor des Bildschirms des zuerst gebundenen Geräts zurück (0 ohne Bildschirm).
- **Ohne Geräte geht nichts kaputt.** Ohne gebundenen Bildschirm macht PRINT nichts, und INKEY gibt immer den leeren String zurück.

| Funktion                  | Macht                                                                                   | Geräte                                      |
| ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------- |
| PRINT, CLS, LOCATE, COLOR | schreiben, löschen, den Cursor setzen, die Farben setzen                                | Anzeigewände, Laptops, Tablets              |
| CSRLIN, POS               | Zeile und Spalte des Cursors                                                            | der zuerst gebundene Bildschirm             |
| INKEY                     | die älteste Taste, die gedrückt wurde, während kein INPUT wartet, oder `""`; wartet nie | Laptops, Tablets                            |
| INPUT                     | liest einen Wert in eine Variable; wartet                                               | zuerst E/A-Blöcke, dann Laptops und Tablets |
| WRITE                     | legt einen Wert als Variablenkarte in einen E/A-Block; wartet                           | nur E/A-Blöcke                              |

## Das Programm

Ein Zähler mit Tastaturmenü: `+` zählt eins dazu, `-` zieht eins ab, `q` beendet und gibt den Zählerstand zurück.

<<< @/tutorials/programs/programmers/screens-menu.c0de

Dasselbe in BASIC:

```basic
CLS
COLOR 14 : PRINT "== Counter =="
COLOR 15 : PRINT "+ add one, - take one, q quit"
row = CSRLIN
DO
  IF k$ = "+" THEN count = count + 1
  IF k$ = "-" THEN count = count - 1
  LOCATE row, 1 : PRINT "Count: "; count; "   "
  DO : k$ = INKEY$ : LOOP WHILE k$ = ""
LOOP WHILE k$ <> "q"
```

## Starten

Binde den Laptop (und die Anzeigewand, wenn du eine gebaut hast) an das Programm `counter` und die Funktion `menu`. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein, lege die nicht initialisierte Variablenkarte hinein und drücke den Knopf.

Öffne den Laptop und tippe `+`, `+`, `+`, `-`, `+` und `q`. Der Bildschirm zeigt das Menü und `Count: 3`, dann `Bye!` in Grau, und im Ausgabeinventar des Auslöserblocks liegt die Karte `count` mit dem Wert 3. Tasten, die das Menü nicht kennt, wie `x`, zeichnen nur den Zählerstand neu.

## So funktioniert es

- `CALL CSRLIN` merkt sich die Zeile unter dem Menü, damit der Zählerstand dort steht, egal wie lang das Menü wird. PRINT beendet immer die Zeile, also steht der Cursor in Spalte 0 der nächsten Zeile.
- `LOCATE` setzt den Cursor vor jedem PRINT zurück in diese Zeile. PRINT überschreibt nur die Zeichen, die es schreibt; die drei Leerzeichen nach der Zahl löschen den Rest einer längeren Zahl, etwa die `0` von `10`, wenn daraus `9` wird.
- INKEY wartet nicht. Die innere REPEAT-Schleife fragt nach einer Taste, bis eine da ist. Der Cursor rückt pro Tick eine Zeile weiter, darum blockiert diese Schleife den Server nicht; sie hält nur den Prozess beschäftigt, bis eine Taste kommt.
- REPEAT führt seinen Block einmal aus und wiederholt ihn, **solange** die Bedingung nach `END REPEAT` wahr ist – es ist ein do-while, nicht das `REPEAT … UNTIL` von BASIC.
- `count` ist ein Ergebnis; es beginnt also bei 0 und kommt ins Ausgabeinventar, wenn die Funktion endet.

## Wer liest was

**INPUT** liest einen Wert in eine Variable. Es sucht ihn in dieser Reihenfolge:

1. In den Eingabeinventaren der gebundenen E/A-Blöcke, in der Reihenfolge, in der sie gebunden wurden: eine Variablen- oder Konstantenkarte mit dem Namen und dem Typ der Variablen oder eine Literalkarte ihres Typs (egal, wie die Variable heißt).
2. Eine Zeile, die auf einem gebundenen Laptop oder Tablet eingetippt wird. Die Eingabezeile funktioniert nur, während ein INPUT wartet, und zeigt, was es abfragt, zum Beispiel `INPUT count (INTEGER):`. Der Text wird wie der Wert eines LITERAL-Blocks gelesen, bei Arrays, Hashes und Strukturen als JSON. Text, der nicht zum Typ passt, wird mit einer Zeile abgelehnt, die mit `? ` beginnt, und INPUT wartet weiter.

Die verwendete Karte wandert ins Ausgabeinventar des E/A-Blocks: eine Variablenkarte nicht initialisiert, eine Konstantenkarte unverändert, eine Literalkarte ohne ihren Wert.

**INKEY** bekommt die Tasten, die auf einem Laptop oder Tablet gedrückt werden, _während kein INPUT wartet_, die älteste zuerst. Enter kommt als CHR 13 an. Tasten, die in die Eingabezeile eines wartenden INPUT getippt werden, gehören INPUT.

**WRITE** gibt einen Wert an jeden gebundenen E/A-Block, der eine nicht initialisierte Variablenkarte in seinem Eingabeinventar hat: Die Karte wird genommen, und eine Variablenkarte mit dem Wert kommt in die Ausgabe. Die Karte heißt wie der Parameter `name`, sonst wie die Variable (`PARAMETER value count ;` ergibt `count`), sonst `output`. Hat kein gebundener E/A-Block eine nicht initialisierte Karte, wartet der Cursor in der CALL-Zeile, bis ein Spieler eine hineinlegt. Laptops und Tablets nehmen an WRITE nicht teil.

## Unterschiede, über die du stolpern wirst

- PRINT beendet immer die Zeile; es gibt kein `PRINT a;`, um darin zu bleiben – das `;` beendet den Ausdruck. Verbinde Werte mit `⊕` oder verwende LOCATE.
- Zeilen und Spalten beginnen bei 0, nicht bei 1 wie in BASIC.
- LOCATE und PRINT löschen den Rest der Zeile nicht. Fülle mit Leerzeichen auf, oder lösche mit CLS und zeichne alles neu.
- INKEY gibt einen STRING zurück, kein CHAR, und `""`, wenn keine Taste wartet. Eine Schleife, die auf eine Taste wartet, musst du selbst schreiben.
- INPUT hat keinen Parameter für eine Eingabeaufforderung: Gib die Frage vorher mit PRINT aus. Sein Parameter ist die Variable selbst, als Referenz – ein einzelner Name ohne Index, keine Konstante und keine Schleifenvariable.
- INPUT fragt zuerst die E/A-Blöcke. Eine passende Karte, die noch in einem gebundenen E/A-Block liegt, antwortet, bevor der Spieler tippen kann.
- WRITE wartet auf eine nicht initialisierte Variablenkarte. Ohne gebundenen E/A-Block mit einer solchen Karte bleibt der Prozess in dieser Zeile hängen.
- Alle gebundenen Bildschirme bekommen dieselbe Ausgabe. Wenn du ein Gerät neu bindest, wird sein Bildschirm gelöscht.
- COLOR nimmt 0 bis 15 (die Konstanten `COLOR_BLACK` bis `COLOR_WHITE`); alles andere löst INVALID_ARGUMENT aus. Hintergrund 0 ist die Farbe des Bildschirms.

## Probier es selbst

1. Füge eine Taste `s` hinzu, die den Zählerstand setzt: Das Programm wartet auf eine Zahl aus der Eingabezeile des Laptops (oder auf eine Variablenkarte `count` in einem gebundenen E/A-Block).

::: details Lösung
<<< @/tutorials/programs/programmers/screens-set.c0de

INPUT schreibt direkt in `count`. Mit den Tasten `+`, `s`, der Zeile `41` und den Tasten `+`, `q` ist das Ergebnis 42.
:::

2. Wenn der Spieler beendet, lege den Zählerstand zusätzlich als Karte namens `total` in einen E/A-Block.

::: details Lösung
<<< @/tutorials/programs/programmers/screens-write.c0de

Binde einen E/A-Block an `counter` / `menu` und lege eine nicht initialisierte Variablenkarte in seine Eingabe. Nach `+`, `+`, `q` liegt in seiner Ausgabe `total` = 2. Ohne die Karte wartet der Prozess in der WRITE-Zeile und gibt `Bye!` nicht aus.
:::

3. Starte das Programm, ohne dass ein Laptop gebunden ist. Was passiert?

::: details Lösung
INKEY gibt immer `""` zurück, also endet die innere Schleife nie. Der Prozess läuft, bis du ihn abbrichst: Klicke seinen PID-Block mit dem Debugging-Werkzeug bei gedrückter Umschalttaste mit rechts an.
:::

## Mehr dazu

- [Geräte](/de/c0de/reference/devices): Anzeigeblöcke, Laptops, Tablets, E/A-Blöcke und Literalkarten
- [Eingabe und Ausgabe](/de/c0de/reference/functions#eingabe-und-ausgabe): PRINT, WRITE, INPUT und die Bildschirmfunktionen
- [Mit Spielern sprechen](/de/c0de/guide/running-programs#mit-spielern-sprechen) und [Einen Prozess abbrechen](/de/c0de/guide/running-programs#einen-prozess-abbrechen)
