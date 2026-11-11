---
description: Arrays, Hashes und Strukturen in c0de – Indizes, die eingebauten Funktionen LEN, INSERT, REMOVE, CLEAR, SWAP und HAS_KEY, verschachtelte Strukturen und warum jede Zuweisung kopiert.
---

# Sammlungen und Strukturen

c0de hat drei Wege, Werte zusammenzufassen: Das ARRAY ist eine Liste, der HASH ein Wörterbuch mit Textschlüsseln, der STRUCT ein Datensatz mit benannten Elementen. Sie fühlen sich an wie Listen, Dicts und Dataclasses in Python, mit einem großen Unterschied: Sie sind Werte. Jede Zuweisung, jeder Parameter und jedes Ergebnis ist eine Kopie, und es gibt keine Referenzen, kein Aliasing und kein null.

::: info Was du brauchst
Eine Kreativwelt mit erlaubten Cheats (siehe [Tutorials](/de/tutorials/)), einen **Auslöserblock**, einen **Knopf**, eine **ARRAY-Variablenkarte** mit dem Untertyp INTEGER und dem Namen `numbers`, eine **STRING-Variablenkarte** mit dem Namen `text`, zwei **STRUCT-Variablenkarten** mit den Namen `a` und `b` und ein paar **nicht initialisierte Variablenkarten**.
:::

## Das Modell

- **ARRAY T** ist eine Liste von Werten des Typs T, von 0 an nummeriert. Es wächst und schrumpft von selbst; du deklarierst nie eine Größe. Arrays von Arrays (`ARRAY ARRAY INTEGER`) sind möglich, bis zu 8 Dimensionen.
- **HASH T** speichert Werte des Typs T unter Schlüsseln, die immer STRINGs sind. EACH geht seine Schlüssel in alphabetischer Reihenfolge durch, nicht in der Reihenfolge, in der sie hinzugefügt wurden.
- **STRUCT** deklariert einen Typ mit benannten Elementen, im globalen Teil des Programms und über allem, was ihn verwendet. Ein Element kann eine vorher deklarierte Struktur sein; nur so lassen sich Strukturen verschachteln. Eine Struktur hat keine Methoden.
- **Werte, keine Referenzen.** `ASSIGN copy original ;` kopiert das ganze Array, den ganzen Hash oder die ganze Struktur. Eine Änderung an `copy` ändert nie `original`, und eine Funktion ändert nie die Variablen ihres Aufrufers.

| Python                   | c0de                                               |
| ------------------------ | -------------------------------------------------- |
| `a = []`                 | `VARIABLE a ARRAY INTEGER`                         |
| `a[i]`                   | `a[i]`                                             |
| `len(a)`                 | `CALL LEN` mit `PARAMETER value a ;`               |
| `a.append(x)`            | `ASSIGN a[n] x ;`, wobei `n` die Länge von `a` ist |
| `a.insert(i, x)`         | `CALL INSERT`                                      |
| `del a[i]`, `del d[k]`   | `CALL REMOVE` mit `index` oder `key`               |
| `a.clear()`              | `CALL CLEAR`                                       |
| `d = {}`                 | `VARIABLE d HASH INTEGER`                          |
| `k in d`                 | `CALL HAS_KEY`                                     |
| `for k in sorted(d)`     | `EACH k d`                                         |
| `a, b = b, a`            | `CALL SWAP`                                        |
| `@dataclass class Point` | `STRUCT point`                                     |
| `p.x`                    | `p.x`                                              |

## Indizes

Ein Index ist Teil eines LABELs: `numbers[0]`, `counts[word]`, `stock["gold"]`, `path.from.x`. Er hat bis zu 8 Einträge, und **jeder Eintrag ist ein Literal oder der Name einer Variablen oder Konstanten** – nie ein Ausdruck. `sorted[next]` geht, `sorted[i + 1]` nicht; berechne die Position zuerst in eine Variable.

- Das Lesen einer Position außerhalb des Arrays löst INDEX_OUT_OF_BOUNDS aus; es gibt keine negativen Positionen vom Ende her. Das Lesen eines Schlüssels, den der Hash nicht hat, löst UNKNOWN_KEY aus.
- Eine Zuweisung an die Position direkt nach dem letzten Element hängt eines an; eine Position weiter draußen löst INDEX_OUT_OF_BOUNDS aus. Eine Zuweisung an einen neuen Schlüssel fügt ihn dem Hash hinzu.
- Ein STRING kann Zeichen für Zeichen gelesen werden, `text[i]` ist ein CHAR. Er kann nicht über einen Index geändert werden, und EACH geht nicht durch einen STRING.

Arrays, Hashes und Strukturen können Startwerte in einem Codeblock nach ihrer VARIABLE- oder CONSTANT-Zeile bekommen, mit einer Zeile pro Eintrag, etwa `y 64` für das Element `y` einer Struktur. Dort sind nur Literale erlaubt, keine Ausdrücke.

## Die Programme

Bubblesort, das das sortierte Array und die Zahl der Vertauschungen zurückgibt:

<<< @/tutorials/programs/programmers/collections-sort.c0de

Dasselbe in Python:

```python
def bubble_sort(numbers: list[int]) -> tuple[list[int], int]:
    sorted, swaps = numbers.copy(), 0
    last, swapped = len(sorted), True
    while swapped:
        swapped = False
        last -= 1
        for i in range(0, last):
            if sorted[i] > sorted[i + 1]:
                sorted[i], sorted[i + 1] = sorted[i + 1], sorted[i]
                swapped = True
                swaps += 1
    return sorted, swaps
```

Wörter zählen mit einem HASH:

<<< @/tutorials/programs/programmers/collections-words.c0de

Zwei Strukturen für Punkte und Linien in der Welt:

<<< @/tutorials/programs/programmers/collections-points.c0de

## Starten

**Bubblesort:** Stelle den Auslöserblock auf das Programm `sorting` und die Funktion `bubbleSort` ein. Lege die Karte `numbers` mit den Werten 5, 3, 8, 1, 9, 2 und eine nicht initialisierte Karte hinein. Die Ergebnisse sind `sorted` mit 1, 2, 3, 5, 8, 9 und `swaps` 8. Ein leeres Array kommt leer zurück, mit 0 Vertauschungen.

**Wörter zählen:** die Funktion `countWords` des Programms `words`, mit der Karte `text` = `"The creeper saw the  pig and the creeper ran"` und einer nicht initialisierten Karte. Das Ergebnis `counts` ist der Hash `and` 1, `creeper` 2, `pig` 1, `ran` 1, `saw` 1, `the` 3, und `words` ist 9.

**Punkte:** die Funktion `measure` des Programms `points`. Variablenkarten können Strukturen eines Programms enthalten: Tippe `STRUCT point` in das Typfeld des Kartendialogs. Lege `a` = (x 0, y 64, z 0), `b` = (x 3, y 68, z 12) und eine nicht initialisierte Karte in den Auslöserblock. `path` ist die Linie von `a` nach `b`, `distance` ist 13.0, und `above` ist (x 0, y 74, z 0).

## So funktioniert es

- **Die Kopie gibt es umsonst.** `ASSIGN sorted numbers ;` kopiert den Parameter in das Ergebnis; `numbers` ist ohnehin eine Kopie des Arrays des Aufrufers. Das Sortieren arbeitet nur mit `sorted`.
- **Keine Ausdrücke in Indizes.** Deshalb hat `bubbleSort` die Variable `next` = `i + 1` und vergleicht `sorted[i]` mit `sorted[next]`.
- **Elemente vertauschen.** SWAP bekommt `sorted[i]` und `sorted[next]` als Parameter und gibt sie vertauscht in dieselben zwei Elemente zurück. Auch Ziele von Ergebnissen können einen Index haben.
- **Zeichen lesen.** `countWords` hängt ein Leerzeichen an, damit auch das letzte Wort gezählt wird, und geht den Text mit FOR und `text[i]` durch, weil EACH nur mit Arrays und Hashes funktioniert. Die Prüfung `word ≠ ""` überspringt doppelte Leerzeichen.
- **Erst der Schlüssel, dann lesen.** Bevor `counts[word] + 1` den Schlüssel liest, prüft HAS_KEY, ob es ihn gibt, und ein neues Wort beginnt bei 0. Der Schlüssel ist der Wert der Variablen `word`.
- **Verschachtelte Strukturen.** `line` hat zwei Elemente vom Typ `point`, also wird `point` zuerst deklariert. `path.to.x` ist ein Index mit zwei Einträgen: dem Element `to`, dann dessen Element `x`.
- **Wieder Kopien.** `ASSIGN above a ;` kopiert `a`, und `ASSIGN above.y above.y + 10 ;` ändert nur die Kopie: `path.from`, auch eine Kopie von `a`, hat immer noch y 64. `length` bekommt seine eigene Kopie von `path`.

## Unterschiede, über die du stolpern wirst

- Ein Index ist ein Literal oder eine Variable, nie ein Ausdruck: `list[i + 1]` gibt es nicht.
- Einen fehlenden Schlüssel oder eine fehlende Position zu lesen ist ein Fehler, nicht `None` oder `undefined`. Verwende vorher HAS_KEY oder LEN.
- `ASSIGN b a ;` kopiert das ganze Array, den ganzen Hash oder die ganze Struktur. Es gibt keine Referenzen, auch nicht in eine Funktion hinein. `=` vergleicht zwei Arrays nach ihrem Inhalt.
- LEN, INSERT, REMOVE, CLEAR und SWAP geben den geänderten Wert als Ergebnis zurück. Um eine Variable zu ändern, verwende sie als Parameter und als Ziel des Ergebnisses.
- Neue Elemente kommen nur direkt hinter das letzte. Es gibt keine Lücken, und Position -1 ist ein Fehler, nicht das letzte Element.
- Hash-Schlüssel sind immer STRINGs, und EACH sortiert sie alphabetisch.
- Ein STRING ist über seinen Index nur lesbar, und EACH geht nicht durch ihn.
- Strukturtypen werden global deklariert, über ihrer ersten Verwendung. Elemente ohne Startwert haben den Standardwert ihres Typs.
- Startwerte von Sammlungen sind nur Literale; alles Berechnete braucht ASSIGN.

## Probier es selbst

1. Schreibe eine Funktion `repeated`, die die Wörter eines Texts zurückgibt, die mehr als einmal vorkommen, als ARRAY STRING in alphabetischer Reihenfolge. Verwende `countWords`.

::: details Lösung
<<< @/tutorials/programs/programmers/collections-repeated.c0de

Für `"The creeper saw the  pig and the creeper ran"` ist `words` `creeper`, `the`. EACH liefert die Schlüssel in alphabetischer Reihenfolge, und `next` ist immer die Länge von `words`, also hängt `words[next]` an.
:::

2. Entferne den Aufruf von HAS_KEY und das IF danach aus `countWords`. Was passiert?

::: details Lösung
Der Prozess stürzt beim ersten Wort mit UNKNOWN_KEY ab: `counts[word] + 1` liest einen Schlüssel, den es noch nicht gibt. Ein Hash hat keinen Standardwert für fehlende Schlüssel.
:::

## Mehr dazu

- [Die Sprache: Typen](/de/c0de/guide/language#typen), [Variablen und Konstanten](/de/c0de/guide/language#variablen-und-konstanten), [Strukturen](/de/c0de/guide/language#strukturen), [ASSIGN](/de/c0de/guide/language#assign) und [EACH-Schleifen](/de/c0de/guide/language#each-schleifen)
- [Bibliotheken: Werte ändern](/de/c0de/guide/libraries#werte-ändern)
- Handbuch Funktionen: [LEN](/de/c0de/reference/functions#len), [HAS_KEY](/de/c0de/reference/functions#has_key), [REMOVE](/de/c0de/reference/functions#remove), [INSERT](/de/c0de/reference/functions#insert), [CLEAR](/de/c0de/reference/functions#clear) und [SWAP](/de/c0de/reference/functions#swap)
- Handbuch Daten: [TYPE_ARRAY](/de/c0de/reference/data#type_array), [TYPE_HASH](/de/c0de/reference/data#type_hash) und [TYPE_STRUCT](/de/c0de/reference/data#type_struct)
