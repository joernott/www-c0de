---
description: Was du auf dem Pfad „Programmieren lernen“ gelernt hast, wie du die Handbücher liest und wie es weitergeht.
---

# Wie es weitergeht

Geschafft! Als du angefangen hast, war ein Programm ein Rätsel. Jetzt begrüßt der Computer von Oak Hill Besucher, rechnet Stapel aus, merkt sich Notizen, führt einen Laden, spielt ein Ratespiel und bewacht die Tür. Das alles hast du selbst gebaut, Block für Block. Diese letzte Lektion schaut zurück auf das, was du gelernt hast, zeigt dir, wie du selbst Antworten findest, und wie es von hier aus weitergeht.

::: tip Neue Wörter

- **Handbuch**: das Nachschlagewerk von c0de, mit einem Eintrag für jeden Block, jede Karte und jede Funktion. Du liest es nicht von vorn bis hinten; du schlägst darin nach.

:::

::: info Was du brauchst
Nichts Neues. Für die zweite Aufgabe: ein neues, leeres Blatt, einen Auslöserblock mit einem Knopf und eine nicht initialisierte Variablenkarte.
:::

## Was du gelernt hast

Jede Lektion hat eine Idee hinzugefügt. Zusammen sind das die Ideen, auf denen jede Programmiersprache aufbaut – nicht nur c0de.

| Idee                        | Was sie bedeutet                                                            | Lektion                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Programm                    | eine Liste von Anweisungen, die nacheinander ausgeführt werden              | [Dein erstes Programm](/de/tutorials/learning/first-program)                                                                  |
| Parameter                   | die Einzelheiten einer Anweisung, zum Beispiel die Farbe eines Texts        | [Farben und der Bildschirm](/de/tutorials/learning/colors)                                                                    |
| Variable                    | eine Kiste mit Namen für einen Wert                                         | [Dinge merken](/de/tutorials/learning/variables)                                                                              |
| Ausdruck                    | eine Rechnung, mit Operatoren und Klammern                                  | [Rechnen](/de/tutorials/learning/calculating)                                                                                 |
| Eingabe und Ausgabe         | Werte, die in ein Programm hineingehen, und Ergebnisse, die herauskommen    | [Werte geben und bekommen](/de/tutorials/learning/parameters), [Den Spieler fragen](/de/tutorials/learning/asking)            |
| Bedingung                   | eine Frage mit der Antwort wahr oder falsch, und IF und ELSE                | [Entscheidungen treffen](/de/tutorials/learning/decisions)                                                                    |
| Schleife                    | etwas wiederholen, zählend oder bis etwas passiert                          | [Dinge wiederholen](/de/tutorials/learning/counting-loops), [Schleifen mit Bedingung](/de/tutorials/learning/condition-loops) |
| Funktion                    | ein Teil eines Programms mit einem Namen, den du wieder benutzen kannst     | [Eigene Funktionen](/de/tutorials/learning/functions)                                                                         |
| Liste, Tabelle und Struktur | viele Werte unter einem Namen                                               | [Listen](/de/tutorials/learning/lists), [Tabellen und eigene Typen](/de/tutorials/learning/tables)                            |
| Debuggen                    | Bugs finden und Fehler abfangen                                             | [Wenn etwas schiefgeht](/de/tutorials/learning/errors)                                                                        |
| Bibliothek                  | fertige Funktionen                                                          | [Bibliotheken benutzen](/de/tutorials/learning/libraries)                                                                     |
| Planen                      | zuerst die Schritte in einfachen Worten, dann das Programm                  | [Zahlenraten](/de/tutorials/learning/guess-the-number)                                                                        |
| die Welt                    | Programme, die Minecraft lesen und verändern, gestartet von einem Zeitgeber | [Die bewachte Tür](/de/tutorials/learning/guarded-door)                                                                       |

Wenn du eines Tages eine andere Sprache lernst – Python, JavaScript, Java –, triffst du sie alle wieder. Nur die Wörter und das Aussehen sind anders.

## Wie du die Handbücher liest

Die Tutorials haben nur einen Teil von c0de gezeigt. Alles andere steht in den **Handbüchern**, und du kannst sie jetzt lesen. Sie stehen auf dieser Seite unter [c0de](/de/c0de/), und mit der Mod Patchouli sind sie auch rote Bücher im Spiel.

Es gibt Handbücher für Daten, Anweisungen, Werkzeuge, Auslöser, Geräte und Funktionen. Jeder Eintrag hat dieselben Teile:

- **eine kurze Beschreibung**: was der Block oder die Funktion tut, in ein oder zwei Sätzen,
- **das Rezept**: wie du den Block oder die Karte herstellst,
- **ein Beispiel**: ein paar Zeilen in der Textschreibweise, die du kennst.

Die Einträge der Funktionen haben einen Teil mehr, **Parameter und Ergebnisse**. Nimm [SAY](/de/c0de/minecraft/say), das du für den Würfel benutzt hast:

- `message` STRING: die Nachricht
- `player` STRING: der Name eines Spielers (optional, Standard leer für alle Spieler in der Nähe)

Jede Zeile ist eine PARAMETER-Zeile deines CALL: der Name, der hinter PARAMETER kommt, der Typ des Werts und was er bedeutet. „Optional“ heißt, dass du die Zeile weglassen kannst; dann benutzt die Funktion den Standardwert. Eine Zeile, die mit „Ergebnis“ beginnt, ist eine RESULT-Zeile: Die meisten Funktionen nennen ihr einziges Ergebnis `result`, also schreibst du `RESULT result` und den Namen deiner Variablen.

Wenn du eine Funktion suchst und ihren Namen nicht kennst, fang mit der Liste einer Bibliothek an, zum Beispiel [c0de/strings](/de/c0de/strings/): Sie nennt jede Funktion mit einem Satz darüber, was sie tut.

<!-- screenshot: next-steps-handbook | the handbook Functions open in the game as a red Patchouli book, showing the page of SAY with its parameters and its example -->

## Wie es weitergeht

- **[Bibliotheken in der Praxis](/de/tutorials/libraries/)** ist der nächste Pfad für dich. Jedes Rezept baut etwas Nützliches – eine Uhr an der Wand, ein Zahlenschloss, einen Farmwächter, einen Tunnelbohrer – und zeigt die Funktionen einer Bibliothek bei der Arbeit.
- **[Die Beispiele der Anleitung](/de/c0de/guide/examples)** sind vollständige Programme zum Bauen und Ausprobieren, zum Beispiel die Primzahlen.
- **[Die Anleitung](/de/c0de/guide/getting-started)** erklärt die ganze Sprache in kurzen Kapiteln. Lies sie einmal von vorn bis hinten: Vieles davon kennst du jetzt, und der Rest füllt die Lücken.

Und vor allem: Bau deine eigenen Ideen. Ein Quiz für deine Freunde, ein Schild, das die Uhrzeit zeigt, ein Laden, der seine Verkäufe zählt. Wenn du nicht weiterkommst, schlag nach, probier ein kleines Programm aus, lies die Fehlermeldung – genau so, wie du es gelernt hast.

## Probier es selbst

1. Schlag die Funktion UCASE von c0de/strings im Handbuch nach. Was braucht sie, und was gibt sie zurück?

::: details Lösung
[UCASE](/de/c0de/strings/ucase) hat einen Parameter, `text` vom Typ STRING, und ein Ergebnis, `result` vom Typ STRING: den Text in Großbuchstaben. Du brauchst `INCLUDE c0de/strings` und rufst sie so auf: `CALL c0de/strings/UCASE` mit den Zeilen `PARAMETER text name ;` und `RESULT result shout`, wenn deine Variablen `name` und `shout` heißen.
:::

2. Bau das Beispiel „Primzahlen“ aus der Anleitung auf einem neuen Blatt und starte es. Was ist sein Ergebnis?

::: details Lösung
Die Funktion `main` hat ein Ergebnis und keine Parameter, also braucht der Auslöserblock eine nicht initialisierte Variablenkarte. Ins Ausgabeinventar kommt die Karte `primes` mit dem Text „2 3 5 7 11 13 17 19 “: die Primzahlen bis 20. Ändere die 20 in der ersten FOR-Zeile, um mehr davon zu finden.
:::

## Mehr dazu

- [c0de](/de/c0de/): die Übersicht über die Anleitung und alle Handbücher
- [Beispiele](/de/c0de/guide/examples) in der Anleitung
- [Handbücher](/de/c0de/guide/tools#handbücher) in der Anleitung: wie du die roten Bücher im Spiel herstellst
- [Bibliotheken in der Praxis](/de/tutorials/libraries/): die Rezepte für jede Bibliothek
