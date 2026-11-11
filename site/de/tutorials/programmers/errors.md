---
description: Fehler in c0de – keine Exceptions und kein try, aber Fehler, die die Aufrufe hinaufwandern, bis ein CALL mit einer ERROR-Variablen sie abfängt; eigene Fehler mit RAISE; Abstürze und Exit-Codes.
---

# Fehler

c0de hat keine Exceptions, keinen `try`- und keinen `catch`-Block. Trotzdem verhalten sich Fehler ganz ähnlich wie Exceptions: Eine Funktion, die scheitert, hält an, und ihr Fehler wandert die Aufrufe hinauf, bis ein Aufrufer ihn abfängt. Das Abfangen passiert beim CALL, mit einer Variablen vom Typ ERROR. Fängt ihn niemand ab, stürzt der Prozess ab, und der Auslöserblock zeigt den Fehler.

::: info Was du brauchst
Eine Kreativwelt mit erlaubten Cheats (siehe [Tutorials](/de/tutorials/)), einen **Auslöserblock**, einen **Knopf**, eine **STRING-Variablenkarte** mit dem Namen `input`, eine **nicht initialisierte Variablenkarte** und für den Exit-Code einen **Komparator** und eine **Redstone-Lampe**.
:::

## Das Modell

- **Ein ausgelöster Fehler beendet die Funktion.** Eine Division durch null, ein fehlender Schlüssel oder ein RAISE beendet die aktuelle Funktion, als hätte sie `RETURN` mit diesem Fehler ausgeführt.
- **Der Aufrufer entscheidet.** Hat sein CALL eine ERROR-Variable hinter dem Funktionsnamen (`CALL parseAge problem`), kommt der Fehler in diese Variable, und der Aufrufer macht weiter. Sonst wird der Fehler im Aufrufer erneut ausgelöst, der damit auch endet, und so weiter die Aufrufe hinauf.
- **Die Einstiegsfunktion ist die letzte Station.** Ein Fehler, der sie erreicht, lässt den Prozess abstürzen: Exit-Code 15, keine Ergebnisse, und alle Karten, die hineingegangen sind, kommen unverändert heraus.
- **Manche Fehler lassen sich nicht abfangen.** Fehler im Programm selbst (eine rote Zeile, Codes 100 bis 114) und die Fehler des Cursors (Codes 200 bis 206, z. B. STACK_OVERFLOW, ein fehlender Parameter oder eine unbekannte Funktion) lassen den Prozess sofort abstürzen.

Ein Fehler ist eine vordefinierte Struktur mit vier Elementen:

| Element   | Typ     | Inhalt                                  |
| --------- | ------- | --------------------------------------- |
| `code`    | INTEGER | 0, wenn es keinen Fehler gab            |
| `message` | STRING  | der Text des Fehlers                    |
| `context` | STRING  | die Funktion, in der er ausgelöst wurde |
| `line`    | INTEGER | die Zeile, in der er ausgelöst wurde    |

Die Codes der Sprache liegen unter 1000 und haben Namen, die eingebaute Konstanten sind. Das sind die, die ein CALL abfangen kann:

|      Code | Name                                                              | Wann                                                          |
| --------: | ----------------------------------------------------------------- | ------------------------------------------------------------- |
|       300 | UNKNOWN_NAME                                                      | ein Name, der nicht im Gültigkeitsbereich ist                 |
|       301 | UNKNOWN_STRUCT_ENTITY                                             | ein Element, das die Struktur nicht hat                       |
|       302 | TYPE_MISMATCH                                                     | ein Wert vom falschen Typ                                     |
|       303 | DIVISION_BY_ZERO                                                  | `/` oder `\` durch 0                                          |
|       304 | NUMERIC_OVERFLOW                                                  | ein INTEGER über 64 Bit hinaus                                |
|       305 | INDEX_OUT_OF_BOUNDS                                               | eine Position außerhalb eines Arrays oder Strings             |
|       306 | UNKNOWN_KEY                                                       | ein Schlüssel, den der Hash nicht hat                         |
|       307 | STRING_TOO_LONG                                                   | ein Wert, der länger ist als die Grenze seines STRINGs        |
|       308 | INVALID_LOOP_STEP                                                 | eine FOR-Schleife mit der Schrittweite 0                      |
|       309 | INVALID_ARGUMENT                                                  | ein Parameterwert, mit dem eine Funktion nichts anfangen kann |
| 310 – 313 | CHUNK_NOT_LOADED, PERMISSION_DENIED, INVENTORY_FULL, ITEM_MISSING | Fehler von c0de/minecraft                                     |

Deine eigenen Fehler verwenden Codes ab 1000.

In Python sähe das Programm dieser Lektion so aus:

```python
class AgeError(Exception): ...

def parse_age(text: str) -> int:
    number = float(text)               # ValueError für "abc"
    if not number.is_integer():
        raise AgeError(1001, "not a whole number: " + text)
    age = int(number)
    if age < 0 or age > 150:
        raise AgeError(1002, "out of range: " + str(age))
    return age

def signup(input: str) -> str:
    try:
        parse_age(input)
        return "Welcome!"
    except Exception as problem:
        return "Error: " + str(problem)
```

## Das Programm

<<< @/tutorials/programs/programmers/errors-signup.c0de

## Starten

Stelle den Auslöserblock auf das Programm `signup` und die Funktion `signup` ein. Lege die Karte `input` und eine nicht initialisierte Karte hinein und stelle einen Komparator auf, der den Auslöserblock ausliest, mit einer Lampe dahinter.

| `input` | `message`                                                  | `age` | Exit-Code |
| ------- | ---------------------------------------------------------- | ----- | --------- |
| `"42"`  | `Welcome!`                                                 | 42    | 0         |
| `"4.5"` | `Error 1001: not a whole number: 4.5 (parseAge, line 19)`  | 0     | 1         |
| `"200"` | `Error 1002: out of range: 200 (parseAge, line 28)`        | 200   | 1         |
| `"abc"` | `Error 309: Not a number: abc (c0de/strings/VAL, line 13)` | 0     | 1         |

Bei Exit-Code 1 gibt der Komparator ein Signal der Stärke 1 aus, und die Lampe leuchtet, bis der nächste Prozess startet.

Stelle den Auslöserblock jetzt auf die Funktion `parseAge` ein und benenne die Karte `input` in `text` um, mit dem Wert `"200"`. Niemand fängt den Fehler ab: Der Prozess stürzt mit Exit-Code 15 ab, der Auslöserblock spielt einen tiefen Ton, und sein Dialog zeigt den Code 1002, die Meldung `out of range: 200`, den Kontext `parseAge` und die Zeile 28. Die Karte `text` und die nicht initialisierte kommen unverändert heraus.

## So funktioniert es

- **Eigene Fehler mit RAISE.** `CALL RAISE` mit einem `code` ab 1000 und einer `message` gibt einen Fehler an seinen Aufrufer `parseAge`. Dieser CALL hat keine ERROR-Variable, also wird der Fehler in `parseAge` ausgelöst, das sofort endet. RAISE füllt `context` und `line` mit der Funktion und der Zeile des CALL. Ein Code unter 1000 löst stattdessen INVALID_ARGUMENT aus.
- **Konstanten für die Codes.** Die globalen Konstanten `AGE_NOT_WHOLE` und `AGE_OUT_OF_RANGE` geben den Codes Namen, wie die eingebauten Namen der Fehler der Sprache. Ein Aufrufer kann `problem.code = AGE_OUT_OF_RANGE ;` vergleichen.
- **Fehler von Bibliotheksfunktionen.** VAL löst für `"abc"` INVALID_ARGUMENT aus. `parseAge` fängt ihn nicht ab, also wandert er weiter zu `signup`. Er behält seinen `context` und seine `line`: Sie beschreiben immer, wo der Fehler zuerst aufgetreten ist, hier die Bibliotheksfunktion `c0de/strings/VAL`, aufgerufen in Zeile 13.
- **Abfangen.** `CALL parseAge problem` legt den Fehler in `problem`. Die Variable bekommt den Fehler jedes Aufrufs, mit Code 0, wenn es keinen gab, also ist `IF problem.code = 0 ;` die Erfolgsprüfung.
- **Ergebnisse überleben.** Für `"200"` ist `age` 200, obwohl `parseAge` gescheitert ist: Der Aufrufer bekommt die Werte, die die Ergebnisse hatten, als die Funktion anhielt. Prüfe den Fehler, bevor du sie verwendest.
- **Exit-Codes für Redstone.** `EXIT 1 ;` beendet den Prozess mit Exit-Code 1. Anders als bei einem Absturz werden die Ergebnisse wie gewohnt ins Ausgabeinventar geschrieben. EXIT nimmt 0 bis 15; 15 ist der Code eines Absturzes.

## Unterschiede, über die du stolpern wirst

- Es gibt keinen `try`-Block. Um einen Fehler abzufangen, muss der Code, der scheitern kann, in einer eigenen Funktion stehen, die mit einer ERROR-Variablen aufgerufen wird.
- Ein CALL ohne ERROR-Variable reicht jeden Fehler weiter. Eine vergessene Variable, und der ganze Prozess stürzt ab.
- Fehler haben keine Typen. Unterscheide sie am `code`, nicht an einer Klasse.
- Ergebnisse werden auch zugewiesen, wenn die Funktion gescheitert ist. Vertraue ihnen nicht, bevor du `code` geprüft hast.
- RAISE füllt `context` und `line` aus; eine ERROR-Variable, die du selbst füllst und mit `RETURN problem` zurückgibst, lässt sie leer, wenn du sie nicht setzt.
- Syntaxfehler, STACK_OVERFLOW, ein fehlender Parameter und die anderen Fehler mit Codes unter 300 lassen sich nicht abfangen.
- Ein Absturz verliert alle Ergebnisse. Wenn Redstone auf ein behandeltes Problem reagieren soll, verwende EXIT mit einem Code von 1 bis 14.

## Probier es selbst

1. Ersetze das RAISE der Bereichsprüfung in `parseAge` durch eine ERROR-Variable und `RETURN`. Wie sieht die Meldung für `"200"` jetzt aus?

::: details Lösung
<<< @/tutorials/programs/programmers/errors-return.c0de

Die Meldung ist `Error 1002: out of range: 200 (, line 0)`: Ein Fehler, den du selbst baust, hat einen leeren `context` und die Zeile 0, wenn du sie nicht zuweist. RAISE füllt sie für dich aus.
:::

2. Schreibe eine Funktion `report` mit den Parametern `total` und `count`, die den Text `average: …` zurückgibt oder `no values yet`, wenn `count` 0 ist. Lass die Division scheitern und fange DIVISION_BY_ZERO ab.

::: details Lösung
<<< @/tutorials/programs/programmers/errors-average.c0de

Mit `total` = 7 und `count` = 2 ist der Text `average: 3.5`; mit `count` = 0 ist er `no values yet`. Die Division braucht eine eigene Funktion, weil nur ein CALL einen Fehler abfangen kann.
:::

## Mehr dazu

- [Die Sprache: Fehler](/de/c0de/guide/language#fehler), [Eigene Fehler](/de/c0de/guide/language#eigene-fehler), [RETURN](/de/c0de/guide/language#return) und [EXIT](/de/c0de/guide/language#exit)
- [Programme ausführen: Exit-Codes](/de/c0de/guide/running-programs#exit-codes) und [Abstürze](/de/c0de/guide/running-programs#abstürze)
- Handbuch Funktionen: [RAISE](/de/c0de/reference/functions#raise)
- Handbuch Daten: [TYPE_ERROR](/de/c0de/reference/data#type_error)
- Handbuch Anweisungen: [RETURN](/de/c0de/reference/statements#return), [CALL](/de/c0de/reference/statements#call) und [EXIT](/de/c0de/reference/statements#exit)
