---
description: Funktionen in c0de – benannte Parameter mit Standardwerten, mehrere Ergebnisse, CALL statt Argumenten nach Position, Rekursion auf dem Stack des Cursors und die vollen Namen von Bibliotheksfunktionen.
---

# Funktionen und Bibliotheken

Eine Funktion in c0de sieht aus wie eine Funktion in jeder anderen Sprache, bis du sie aufrufst. Es gibt keine Argumente nach Position und keinen Rückgabewert: Jedes Argument ist eine benannte PARAMETER-Zeile, jedes Ergebnis eine benannte RESULT-Zeile, und eine Funktion kann so viele Ergebnisse haben, wie sie will. Diese Lektion zeigt, wie Aufrufe, Rekursion und Bibliotheken funktionieren und was der Stack des Cursors damit zu tun hat.

::: info Was du brauchst
Eine Kreativwelt mit erlaubten Cheats (siehe [Tutorials](/de/tutorials/)), einen **Auslöserblock**, einen **Knopf**, eine **INTEGER-Variablenkarte** mit dem Namen `n`, eine **FLOAT-Variablenkarte** mit dem Namen `radius` und drei **nicht initialisierte Variablenkarten**.
:::

## Das Modell

- **Eine Signatur ist eine Liste von Zeilen.** PARAMETER-Zeilen unter der FUNCTION-Zeile sind die Eingaben, RESULT-Zeilen die Ausgaben, beide mit Name und Typ. Ein Parameter eines einfachen Typs oder vom Typ STRING darf einen Standardwert haben.
- **Argumente haben Namen.** Ein CALL hat eine PARAMETER-Zeile pro Argument, mit dem Namen des Parameters und einem Ausdruck. Ihre Reihenfolge ist egal, und Parameter mit Standardwert können wegfallen.
- **Ergebnisse sind Variablen.** Ein Ergebnis beginnt mit dem Standardwert seines Typs und wird zugewiesen wie jede Variable. Wenn die Funktion endet, bekommt der Aufrufer die letzten Werte, aber nur die der Ergebnisse, die sein CALL in RESULT-Zeilen aufführt; die anderen werden verworfen.
- **Alles wird als Wert übergeben.** Parameter sind Kopien, auch Arrays, Hashes und Strukturen. Eine Funktion, die eine Variable ändern soll, bekommt sie als Parameter und gibt sie als Ergebnis zurück.
- **Die Reihenfolge zählt.** Eine Funktion kann sich selbst und die Funktionen über ihr aufrufen, sonst nichts.

## Die Programme

Die Fibonacci-Zahlen, rekursiv und mit einer Schleife, und eine Einstiegsfunktion `compare`, die beide ausführt:

<<< @/tutorials/programs/programmers/functions-fibonacci.c0de

Dasselbe in Python:

```python
def fib_recursive(n: int) -> int:
    if n < 2:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)

def fib_loop(n: int) -> int:
    result, next = 0, 1
    for i in range(1, n + 1):
        result, next = next, result
        next = next + result
    return result

def compare(n: int = 10) -> tuple[int, int]:
    return fib_recursive(n), fib_loop(n)
```

Eine Funktion mit drei Ergebnissen und eine Funktion, die sie zweimal aufruft:

<<< @/tutorials/programs/programmers/functions-circle.c0de

In Python würde `circle` ein Tupel zurückgeben, und `ring` würde es entpacken und zwei der Werte ignorieren:

```python
def circle(radius: float) -> tuple[float, float, float]:
    diameter = 2 * radius
    return diameter, diameter * math.pi, math.pi * radius ** 2

def ring(outer: float, inner: float = 0.0) -> float:
    _, _, area = circle(outer)
    _, _, hole = circle(inner)
    return area - hole
```

## Starten

Stelle einen Auslöserblock auf das Programm `fibonacci` und die Funktion `compare` ein. Lege die Karte `n` (Wert 20) und eine nicht initialisierte Karte in sein Eingabeinventar: `compare` hat zwei Ergebnisse, und die Karte `n` nimmt den Platz von einem davon ein. Drücke den Knopf. Im Ausgabeinventar liegen die Karten `recursive` und `iterative`, beide 6765. Ohne die Karte `n` brauchst du zwei nicht initialisierte Karten, und `n` ist 10.

Lass dir Zeit mit der rekursiven Version. Der Cursor bearbeitet eine Zeile pro Tick, 20 pro Sekunde. Für `n` = 20 zählt der Programm-Runner 109.454 Schritte für `fibRecursive` und 65 für `fibLoop`: Im Spiel läuft die Rekursion mehr als eine Stunde, die Schleife ein paar Sekunden.

Stelle den Auslöserblock dann auf das Programm `circles` und die Funktion `circle` ein und lege die Karte `radius` (Wert 3.0) und zwei nicht initialisierte Karten hinein. Die Ergebnisse sind `diameter` 6.0, `circumference` 18.84955592153876 und `area` 28.274333882308138.

## So funktioniert es

- **Ein CALL führt zuerst seine Parameter auf, dann seine Ergebnisse.** `PARAMETER n n - 1 ;` setzt den Parameter `n` der aufgerufenen Funktion auf den Wert des Ausdrucks `n - 1`, ausgewertet beim Aufrufer. `RESULT result a` kopiert das Ergebnis `result` der aufgerufenen Funktion in die Variable `a` des Aufrufers. PARAMETER-Zeilen dürfen in beliebiger Reihenfolge kommen, aber alle vor der ersten RESULT-Zeile.
- **Es gibt keinen Rückgabewert.** `fibRecursive` weist `result` zu und endet dann mit einem einfachen `RETURN`. RETURN kann eine Variable vom Typ ERROR mitnehmen (Lektion [Fehler](/de/tutorials/programmers/errors)), aber nie einen Wert.
- **Keine Aufrufe in Ausdrücken.** `fib(n - 1) + fib(n - 2)` sind zwei CALL-Anweisungen mit zwei lokalen Variablen `a` und `b` und ein ASSIGN, das sie addiert.
- **Variablen mit einer Funktion ändern.** In `fibLoop` bekommt die eingebaute Funktion SWAP `result` und `next` als Parameter und gibt sie vertauscht als Ergebnisse zurück. Dieselben Variablen als Parameter und als Ziele der Ergebnisse zu verwenden ist der Weg, wie c0de Variablen durch eine Funktion ändert.
- **Nur nehmen, was du brauchst.** `ring` ruft `circle` zweimal auf und führt nur das Ergebnis `area` auf; Durchmesser und Umfang werden verworfen. Sein Parameter `inner` hat den Standardwert 0.0, also ist `ring` nur mit `outer` die Fläche einer Kreisscheibe.

### Rekursion und der Stack

Jeder Prozess hat einen Cursor, und der Cursor hat einen Stack. Ein Aufruf legt ein Funktionselement (den Aufrufrahmen), eine Blockmarke für den Codeblock der Funktion und einen Platz für jeden Parameter und jedes Ergebnis darauf; lokale Variablen, Schleifen und andere offene Codeblöcke belegen auch Plätze. Wenn die Funktion endet, wird alles wieder entfernt.

Der Stack hat 2048 Plätze, wenn der Server in `config/c0de.properties` keine größere `stackSize` einstellt. Ein Prozess, der mehr braucht, stürzt mit STACK_OVERFLOW ab. Die eingebaute Konstante CURSOR zeigt, wo du stehst: `CURSOR.depth` ist die Zahl der Funktionen auf dem Stack, `CURSOR.stack_used` und `CURSOR.stack_size` die belegten und alle Plätze. Das Debugging-Werkzeug zeigt den Stack eines Cursors, wenn du ihn mit rechts anklickst.

## Bibliotheken

Eingebaute Funktionen wie LEN, SWAP, INSERT oder RAISE brauchen nichts. Alles andere steckt in einer Bibliothek, die du mit einer INCLUDE-Zeile lädst, direkt nach dem NOOP in Zeile 1 und vor jeder anderen Anweisung – wie `INCLUDE c0de/math` im Programm `circles`.

Es gibt kein `import … as` und keinen Namensraum, den du weglassen kannst. Funktionen, Konstanten und Strukturtypen einer Bibliothek haben immer ihren vollen Namen:

| Python                      | c0de                                           |
| --------------------------- | ---------------------------------------------- |
| `import math`               | `INCLUDE c0de/math`                            |
| `math.sqrt(2)`              | `CALL c0de/math/SQR` mit `PARAMETER value 2 ;` |
| `math.pi`                   | `c0de/math/PI` in einem Ausdruck               |
| eine Klasse aus einem Modul | `VARIABLE spot STRUCT c0de/minecraft/POSITION` |

Der LABEL-Block auf dem Blatt zeigt nur den letzten Teil eines solchen Namens, z. B. `PI`. Ohne das INCLUDE ist die Zeile rot: CALL meldet UNKNOWN_FUNCTION („is its library included?“), eine Konstante UNKNOWN_NAME.

Bibliotheksfunktionen folgen zwei Konventionen: Eine Funktion mit einem Ergebnis nennt es `result`, und Positionen in Texten und Arrays beginnen bei 0.

## Unterschiede, über die du stolpern wirst

- Es gibt keine Argumente nach Position. Jedes Argument ist eine PARAMETER-Zeile mit dem Namen des Parameters.
- In einem CALL kommen alle PARAMETER-Zeilen vor den RESULT-Zeilen. Sonst ist die Zeile rot: „PARAMETER lines must come before RESULT lines“.
- Eine Funktion gibt nichts zurück. Ergebnisse sind Variablen, und ein CALL ohne RESULT-Zeilen verwirft alle.
- Eine Funktion kann nur Funktionen aufrufen, die über ihr deklariert sind, und sich selbst. Zwei Funktionen können sich nicht gegenseitig aufrufen.
- Funktionen können nicht in einem Ausdruck aufgerufen werden. Speichere das Ergebnis zuerst in einer Variablen.
- Auch Arrays, Hashes und Strukturen werden kopiert. Um eines zu ändern, übergib es als Parameter und nimm es als Ergebnis zurück.
- Nur Parameter einfacher Typen und vom Typ STRING können einen Standardwert haben.
- Eine einfache rekursive Funktion belegt etwa fünf Plätze des Stacks pro Ebene, also ist der Standard-Stack mit 2048 Plätzen nach ein paar hundert Ebenen voll. STACK_OVERFLOW ist ein Absturz: Kein CALL kann ihn abfangen.
- Bibliotheksnamen werden immer ganz ausgeschrieben, auch bei Konstanten: `c0de/math/PI`, nie `PI`.

## Probier es selbst

1. Schreibe eine rekursive Funktion `sum`, die die Zahlen von 1 bis `n` addiert, mit einem zweiten Ergebnis `used`, das sagt, wie viele Plätze des Stacks auf der tiefsten Ebene belegt waren. Wie tief kommt sie?

::: details Lösung
<<< @/tutorials/programs/programmers/functions-sum.c0de

Für `n` = 100 ist `result` 5050 und `used` 506: Jede Ebene belegt fünf Plätze (Funktionselement, Blockmarke, `n`, `result` und `used`), und die tiefste Ebene einen mehr für den Codeblock des IF. Mit `n` = 408 ist `used` 2046. Mit `n` = 409 stürzt der Prozess mit STACK_OVERFLOW ab.
:::

2. Verschiebe in `compare` die Zeile `RESULT result iterative` über die Zeile `PARAMETER n n ;`. Was passiert?

::: details Lösung
Der CALL wird ungültig, und seine Zeilennummer wird rot: „PARAMETER lines must come before RESULT lines“. Die Reihenfolge der PARAMETER-Zeilen untereinander ist frei, die RESULT-Zeilen kommen immer zuletzt.
:::

## Mehr dazu

- [Die Sprache: Funktionen](/de/c0de/guide/language#funktionen), [CALL](/de/c0de/guide/language#call) und [RETURN](/de/c0de/guide/language#return)
- [Bibliotheken](/de/c0de/guide/libraries#aufrufen): aufrufen, [Werte ändern](/de/c0de/guide/libraries#werte-ändern), [Bibliotheken einbinden](/de/c0de/guide/libraries#bibliotheken-einbinden) und die [eingebauten Funktionen](/de/c0de/guide/libraries#eingebaute-funktionen)
- Handbuch Anweisungen: [FUNCTION](/de/c0de/reference/statements#function), [PARAMETER](/de/c0de/reference/statements#parameter), [RESULT](/de/c0de/reference/statements#result) und [CALL](/de/c0de/reference/statements#call)
- Handbuch Funktionen: [SWAP](/de/c0de/reference/functions#swap)
- [Bibliotheken: c0de/math](/de/c0de/guide/libraries#c0demath): die Bibliothek mit `c0de/math/PI`, und ihre [Funktionen](/de/c0de/math/)
