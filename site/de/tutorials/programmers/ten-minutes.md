---
description: Das Modell von c0de für Programmierer – Code aus Blöcken, der Aufbau eines Programms und wie ein Auslöserblock eine Funktion startet.
---

# c0de in zehn Minuten

Du kannst programmieren. Diese Lektion zeigt, worin sich c0de von den Sprachen unterscheidet, die du kennst: Programme sind Reihen aus Blöcken, ein paar Regeln für den Aufbau ersetzen den Rahmencode anderer Sprachen, und eine Funktion bekommt ihre Argumente aus Karten und gibt ihre Ergebnisse als Karten zurück.

::: info Was du brauchst
Eine Kreativwelt mit erlaubten Cheats (siehe [Tutorials](/de/tutorials/)), einen **Auslöserblock**, einen **Schraubenschlüssel**, einen **Knopf** und zwei **Variablenkarten**: eine mit dem Namen `name` vom Typ STRING und eine nicht initialisierte.
:::

## Das Modell

- **Code besteht aus Blöcken.** Du legst Sprachblöcke auf den Boden der c0de-Dimension. Der erste Block einer Reihe ist der Schlüsselwortblock (`FUNCTION`, `ASSIGN`, `IF` …); Namen sind LABEL-Blöcke, Werte LITERAL-Blöcke, Symbole OPERATOR-Blöcke.
- **Eine Reihe ist eine Zeile.** Ein Programm beginnt am Nordende eines Blatts und verläuft nach Süden. Zeile 0 ist die PROGRAM-Zeile.
- **Einrückung ist Position.** Ein Block einen Schritt weiter östlich ist eine Ebene tiefer. Es gibt keine geschweiften Klammern: `BEGIN` und `END` um einen Codeblock und die Einrückung der Zeilen dazwischen kennzeichnen ihn.
- **Die Textschreibweise** der Anleitung und dieser Tutorials schreibt eine Reihe als eine Textzeile, mit vier Leerzeichen pro Schritt nach Osten. Sie ist keine Quelldatei; du baust sie aus Blöcken.

## Das Programm

<<< @/tutorials/programs/programmers/greet.c0de

Dasselbe in Python:

```python
def greet(name: str = "World") -> str:
    greeting = "Hello, " + name + "!"
    return greeting
```

## Die Regeln für den Aufbau

- **Zeile 0** ist `PROGRAM` mit dem Namen des Programms.
- **Zeile 1** ist eine NOOP-Zeile. Danach folgen die INCLUDE-Zeilen für Bibliotheken, dann globale Deklarationen.
- **Jede FUNCTION hat direkt über sich eine NOOP-Zeile.** Darum hat das Programm vor `FUNCTION greet` zwei NOOP-Zeilen.
- **Parameter und Ergebnisse** werden in den Zeilen nach `FUNCTION` deklariert, einer pro Zeile, vor `BEGIN`. Ein Parameter mit einem Wert hinter seinem Typ hat einen Standardwert.
- **Die erste leere Zeile beendet das Programm.** Alles südlich davon gehört zu keinem Programm.

Die Zeilennummern auf dem Boden zeigen dir, ob eine Zeile stimmt: Dunkelgrün ist richtig, Dunkelgelb ist unfertig (ein `BEGIN` ohne sein `END`), Dunkelrot ist falsch. Das Debugging-Werkzeug sagt dir, warum.

## Starten

Ein Prozess beginnt bei einer Einstiegsfunktion, nicht am Anfang der Datei. Stelle den Auslöserblock auf das Programm `hello` und die Funktion `greet` ein. Lege die Variablenkarte `name` (Typ STRING, Wert `"Steve"`) und die nicht initialisierte Karte in sein Eingabeinventar und drücke den Knopf.

Im Ausgabeinventar liegt dann eine Variablenkarte `greeting` mit dem Wert `"Hello, Steve!"`. Ohne die Karte `name` wird der Standardwert verwendet, und das Ergebnis ist `"Hello, World!"`.

## So funktioniert es

- `FUNCTION greet` deklariert die Funktion. Ihre Signatur sind die PARAMETER- und RESULT-Zeilen darunter.
- `ASSIGN greeting "Hello, " ⊕ name ⊕ "!" ;` setzt das Ergebnis. `⊕` fügt Werte zu Text zusammen, und `;` beendet den Ausdruck.
- Ein Ergebnis ist eine Variable der Funktion. Es gibt kein `return wert`: Wenn die Funktion endet, gehen die Werte ihrer Ergebnisse an den Aufrufer zurück – bei der Einstiegsfunktion als Karten ins Ausgabeinventar.

## Unterschiede, über die du stolpern wirst

- `NOOP`-Zeilen sind nicht optional. Eine FUNCTION ohne NOOP-Zeile darüber ist eine rote Zeile.
- Jeder Ausdruck endet mit `;`, auch wenn er nur aus einem Wert besteht.
- `=` vergleicht, es weist nie zu. Zuweisungen sind immer `ASSIGN`.
- Text wird mit `⊕` zusammengefügt, nicht mit `+`.
- Schlüsselwörter in Großbuchstaben sind reserviert: Eine Variable darf nicht `END` oder `RESULT` heißen, `result` ist aber in Ordnung.
- Der Auslöserblock braucht eine Karte für jeden Parameter ohne Standardwert und genug nicht initialisierte Karten für die Ergebnisse; sonst startet er nicht.

## Probier es selbst

1. Füge einen zweiten Parameter `mark` vom Typ CHAR mit dem Standardwert `'!'` hinzu und verwende ihn statt des `"!"` am Ende.

::: details Lösung
<<< @/tutorials/programs/programmers/greet-mark.c0de

Mit den Karten `name` = `"c0de"` und `mark` = `'?'` ist das Ergebnis `"Hello, c0de?"`.
:::

2. Nimm die Karte `name` aus dem Eingabeinventar und starte noch einmal. Was ist das Ergebnis?

::: details Lösung
`"Hello, World!"`: Der Parameter bekommt seinen Standardwert. Der Auslöserblock braucht trotzdem die nicht initialisierte Karte für das Ergebnis.
:::

## Mehr dazu

- [Erste Schritte](/de/c0de/guide/getting-started): die Dimension, Blätter und dein erstes Programm, Schritt für Schritt
- [Die Sprache](/de/c0de/guide/language): alle Anweisungen der Sprache
- [Programme ausführen](/de/c0de/guide/running-programs): Auslöserblöcke, Karten und Ergebnisse
