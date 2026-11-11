---
description: Eine Seite mit Python, JavaScript und BASIC neben c0de und den Fallen des ganzen Pfads.
---

# Spickzettel

Alles aus diesem Pfad auf einer Seite: was du in Python, JavaScript oder BASIC schreibst, was du in c0de baust, und die Unterschiede, über die Programmierer stolpern. Die c0de-Spalte verwendet die Textschreibweise; `…` steht für die Zeilen eines Codeblocks, und `<br>` trennt die Zeilen einer Anweisung.

## Deklarationen und Werte

|               | Python                        | JavaScript                    | BASIC            | c0de                                                                                                                |
| ------------- | ----------------------------- | ----------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| Variable      | `x = 5`                       | `let x = 5`                   | `x = 5`          | `VARIABLE x INTEGER 5`                                                                                              |
| Konstante     | `MAX = 10`                    | `const MAX = 10`              | `CONST MAX = 10` | `CONSTANT MAX INTEGER 10`                                                                                           |
| Zuweisung     | `x = x + 1`                   | `x += 1`                      | `x = x + 1`      | `ASSIGN x x + 1 ;`                                                                                                  |
| Typen         | `bool`, `int`, `float`, `str` | `boolean`, `number`, `string` | `x%`, `x!`, `x$` | BOOLEAN, INTEGER (64 Bit), FLOAT, CHAR, STRING, TIME (ms seit 1970)                                                 |
| Kein Wert     | `None`                        | `null`, `undefined`           | –                | keiner: Jede Variable beginnt mit dem Standardwert ihres Typs (0, 0.0, `FALSE`, `""`, ein Leerzeichen, leere Liste) |
| Kommentar     | `# note`                      | `// note`                     | `REM note`       | ein COMMENT-Block, `// note` in der Schreibweise                                                                    |
| Programmstart | `if __name__ == "__main__":`  | Anfang der Datei              | erste Zeile      | die Einstiegsfunktion, die am Auslöserblock eingestellt ist                                                         |

## Operatoren

|                               | Python                          | JavaScript                      | BASIC                     | c0de                                                  |
| ----------------------------- | ------------------------------- | ------------------------------- | ------------------------- | ----------------------------------------------------- |
| Gleich, ungleich              | `==`, `!=`                      | `===`, `!==`                    | `=`, `<>`                 | `=`, `≠`                                              |
| Kleiner gleich, größer gleich | `<=`, `>=`                      | `<=`, `>=`                      | `<=`, `>=`                | `≤`, `≥`                                              |
| Division                      | `7 / 2` ist 3.5                 | `7 / 2` ist 3.5                 | `7 / 2` ist 3.5           | `7 / 2 ;` ist 3.5, immer ein FLOAT                    |
| Ganzzahldivision              | `7 // 2`                        | `Math.trunc(7 / 2)`             | `7 \ 2`                   | `CALL c0de/math/DIV`                                  |
| Rest                          | `-7 % 2` ist 1                  | `-7 % 2` ist -1                 | `-7 MOD 2` ist -1         | `-7 \ 2 ;` ist -1                                     |
| Potenz                        | `2 ** 10`                       | `2 ** 10`                       | `2 ^ 10`                  | `2 ^ 10 ;`                                            |
| Logik                         | `and`, `or`, `not`              | `&&`, `\|\|`, `!`               | `AND`, `OR`, `NOT`        | `AND`, `OR`, `NOT`, `XOR` (AND und OR hören früh auf) |
| Bits                          | `&`, `\|`, `^`, `~`, `<<`, `>>` | `&`, `\|`, `^`, `~`, `<<`, `>>` | `AND`, `OR`, `XOR`, `NOT` | `&`, `\|`, `⊻`, `¬`, `←`, `→`                         |
| Text verbinden                | `"a" + str(1)`                  | `"a" + 1`                       | `"a" + STR$(1)`           | `"a" ⊕ 1 ;`                                           |

## Kontrollfluss

|                  | Python                      | JavaScript                         | BASIC                    | c0de                                                |
| ---------------- | --------------------------- | ---------------------------------- | ------------------------ | --------------------------------------------------- |
| Wenn             | `if x > 0:`                 | `if (x > 0) { … }`                 | `IF x > 0 THEN … END IF` | `IF x > 0 ;`<br>`BEGIN` … `END IF`                  |
| Sonst            | `else:`                     | `else { … }`                       | `ELSE`                   | `BEGIN` … `END`<br>`ELSE`<br>`BEGIN` … `END IF`     |
| Sonst wenn       | `elif`                      | `else if`                          | `ELSEIF`                 | keins: ein IF im ELSE-Block                         |
| Zählschleife     | `for i in range(1, 11, 2):` | `for (let i = 1; i <= 10; i += 2)` | `FOR i = 1 TO 10 STEP 2` | `FOR i INTEGER 1 ; 10 ; 2 ;`<br>`BEGIN` … `END FOR` |
| Für jedes        | `for x in a:`               | `for (const x of a)`               | –                        | `EACH x a`<br>`BEGIN` … `END EACH`                  |
| Solange          | `while n > 0:`              | `while (n > 0)`                    | `WHILE n > 0 … WEND`     | `WHILE n > 0 ;`<br>`BEGIN` … `END WHILE`            |
| Do-while         | –                           | `do { … } while (n > 0)`           | `DO … LOOP WHILE n > 0`  | `REPEAT`<br>`BEGIN` … `END REPEAT n > 0 ;`          |
| Abbrechen        | `break`                     | `break`                            | `EXIT FOR`               | `BREAK` oder `BREAK n > 9 ;`                        |
| Programm beenden | `sys.exit(3)`               | `process.exit(3)`                  | `END`                    | `EXIT 3 ;` (0 bis 15)                               |

## Funktionen

|                    | Python              | JavaScript                | BASIC                 | c0de                                                                                                                       |
| ------------------ | ------------------- | ------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Definieren         | `def area(w, h=1):` | `function area(w, h = 1)` | `FUNCTION area(w, h)` | `FUNCTION area`<br>`PARAMETER w INTEGER`<br>`PARAMETER h INTEGER 1`<br>`RESULT result INTEGER`<br>`BEGIN` … `END FUNCTION` |
| Wert zurückgeben   | `return w * h`      | `return w * h`            | `area = w * h`        | `ASSIGN result w * h ;` – Ergebnisse sind Variablen                                                                        |
| Früh zurückkehren  | `return`            | `return`                  | `EXIT FUNCTION`       | `RETURN`                                                                                                                   |
| Mehrere Ergebnisse | `return a, b`       | `return [a, b]`           | –                     | mehrere RESULT-Zeilen                                                                                                      |
| Aufrufen           | `r = area(3, h=2)`  | `const r = area(3, 2)`    | `r = area(3, 2)`      | `CALL area`<br>`PARAMETER w 3 ;`<br>`PARAMETER h 2 ;`<br>`RESULT result r`                                                 |
| Bibliothek         | `import math`       | `import … from …`         | –                     | `INCLUDE c0de/math`, dann `CALL c0de/math/SQR`                                                                             |

## Fehler

|                  | Python                           | JavaScript                   | BASIC                   | c0de                                                                       |
| ---------------- | -------------------------------- | ---------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| Auslösen         | `raise ValueError("too big")`    | `throw new Error("too big")` | `ERROR 200`             | `CALL RAISE`<br>`PARAMETER code 1001 ;`<br>`PARAMETER message "too big" ;` |
| Abfangen         | `try: … except ValueError as e:` | `try { … } catch (e) { … }`  | `ON ERROR GOTO handler` | `CALL area problem` – eine ERROR-Variable in der CALL-Zeile                |
| Was schiefging   | `e.args`                         | `e.message`                  | `ERR`, `ERL`            | `problem.code`, `problem.message`, `problem.context`, `problem.line`       |
| Nicht abgefangen | Traceback, Exit 1                | nicht abgefangene Exception  | Fehlermeldung           | der Prozess stürzt ab, Exit-Code 15                                        |

## Sammlungen

|                     | Python                       | JavaScript                            | BASIC           | c0de                                                                              |
| ------------------- | ---------------------------- | ------------------------------------- | --------------- | --------------------------------------------------------------------------------- |
| Liste               | `a = [1, 2, 3]`              | `const a = [1, 2, 3]`                 | `DIM a(2)`      | `VARIABLE a ARRAY INTEGER`<br>`BEGIN`<br>`1 2 3`<br>`END VARIABLE`                |
| Element             | `a[0]`                       | `a[0]`                                | `a(0)`          | `a[0]`                                                                            |
| Länge               | `len(a)`                     | `a.length`                            | `UBOUND(a) + 1` | `CALL LEN`<br>`PARAMETER value a ;`<br>`RESULT result n`                          |
| Anhängen            | `a.append(4)`                | `a.push(4)`                           | –               | `ASSIGN a[3] 4 ;` (Index = Länge) oder INSERT                                     |
| Einfügen, entfernen | `a.insert(0, 9)`, `del a[1]` | `a.splice(0, 0, 9)`, `a.splice(1, 1)` | –               | `CALL INSERT`, `CALL REMOVE` mit `RESULT result a`                                |
| Wörterbuch          | `h = {"gold": 1}`            | `const h = {gold: 1}`                 | –               | `VARIABLE h HASH INTEGER`<br>`BEGIN`<br>`gold 1`<br>`END VARIABLE`                |
| Schlüssel           | `h["gold"]`, `"gold" in h`   | `h.gold`, `"gold" in h`               | –               | `h["gold"]`, `CALL HAS_KEY`                                                       |
| Datensatz           | `@dataclass class Point`     | `{x: 1, y: 2}`                        | `TYPE Point`    | `STRUCT point`<br>`BEGIN`<br>`x INTEGER`<br>`y INTEGER`<br>`END STRUCT` und `p.x` |
| Kopieren            | `b = a` teilt die Liste      | `b = a` teilt das Array               | –               | `ASSIGN b a ;` und Parameter kopieren den Wert                                    |

## Strings und Daten

|                | Python                       | JavaScript                               | BASIC                | c0de                                                            |
| -------------- | ---------------------------- | ---------------------------------------- | -------------------- | --------------------------------------------------------------- |
| Länge          | `len(s)`                     | `s.length`                               | `LEN(s$)`            | `CALL LEN`                                                      |
| Teil           | `s[2:5]`                     | `s.slice(2, 5)`                          | `MID$(s$, 3, 3)`     | `c0de/strings/MID` mit Start 2, Länge 3                         |
| Suchen         | `s.find("x")` (-1)           | `s.indexOf("x")` (-1)                    | `INSTR(s$, "x")` (0) | `c0de/strings/INSTR` (-1)                                       |
| Großbuchstaben | `s.upper()`                  | `s.toUpperCase()`                        | `UCASE$(s$)`         | `c0de/strings/UCASE`                                            |
| Zahl zu Text   | `str(n)`                     | `String(n)`                              | `STR$(n)`            | `"" ⊕ n ;` oder `c0de/strings/STR`                              |
| Text zu Zahl   | `float(s)`                   | `Number(s)`                              | `VAL(s$)`            | `c0de/strings/VAL` (ein FLOAT und ob er ganz ist)               |
| Runden         | `math.floor`, `int`, `round` | `Math.floor`, `Math.trunc`, `Math.round` | `INT`, `FIX`         | `c0de/math/INT`, `FIX`, `ROUND`                                 |
| JSON           | `json.dumps`, `json.loads`   | `JSON.stringify`, `JSON.parse`           | –                    | `c0de/strings/TO_JSON`, `FROM_JSON` in eine typisierte Variable |

## Eingabe und Ausgabe

|             | Python        | JavaScript         | BASIC                                     | c0de                                     |
| ----------- | ------------- | ------------------ | ----------------------------------------- | ---------------------------------------- |
| Ausgeben    | `print(x)`    | `console.log(x)`   | `PRINT x`                                 | `CALL PRINT`<br>`PARAMETER value x ;`    |
| Zeile lesen | `x = input()` | `prompt()`         | `INPUT x`                                 | `CALL INPUT`<br>`PARAMETER variable x ;` |
| Taste lesen | –             | `keydown`-Ereignis | `k$ = INKEY$`                             | `CALL INKEY`<br>`RESULT result k`        |
| Bildschirm  | curses        | –                  | `CLS`, `LOCATE`, `COLOR`, `CSRLIN`, `POS` | dieselben Namen, Zeilen und Spalten ab 0 |

## Die Fallen

### Aufbau

- Zeile 0 ist PROGRAM, Zeile 1 eine NOOP-Zeile, und jede FUNCTION hat direkt über sich eine NOOP-Zeile. Eine fehlende NOOP-Zeile ist eine rote Zeile.
- Die erste leere Zeile beendet das Programm.
- Ein Name ist erst unterhalb seiner Definition bekannt. Eine Funktion kann nur Funktionen über sich aufrufen, oder sich selbst.
- Schlüsselwörter in Großbuchstaben sind reserviert: `RESULT` ist kein gültiger Name, `result` schon.
- Jedes BEGIN braucht sein END mit dem Schlüsselwort (`END WHILE`); mit ELSE steht das erste END allein. Ein Codeblock darf nicht leer sein – setze eine NOOP-Zeile hinein.
- Es gibt kein ELSE IF.

### Ausdrücke

- Jeder Ausdruck endet mit `;`, auch ein einzelner Wert.
- `=` vergleicht nur. Werte werden mit ASSIGN gespeichert, und Funktionen können nicht in einem Ausdruck aufgerufen werden – verwende CALL.
- Text wird mit `⊕` verbunden, nicht mit `+`. `⊕` bindet schwächer als `+`: `"a" ⊕ 1 + 2 ;` ist `"a3"`.
- `/` ergibt immer einen FLOAT. Ein FLOAT passt nicht in einen INTEGER (TYPE_MISMATCH): Verwende INT, FIX oder ROUND aus c0de/math, oder DIV.
- INT rundet ab (-12.85 → -13), FIX schneidet ab (-12.85 → -12), ROUND rundet .5 zur geraden Zahl (12.5 → 12), wie `round` in Python, nicht wie `Math.round`.
- `\` ist der Rest, mit dem Vorzeichen des Dividenden: `-7 \ 2 ;` ist -1, in Python ist es 1. Es bindet schwächer als `*`: `7 \ 2 * 2 ;` ist 3.
- Vergleiche brauchen denselben Typ (INTEGER mit FLOAT und CHAR mit STRING gehen). Texte werden nach Codepunkt verglichen: `"Z" < "a"`.
- Ein INTEGER passt in einen FLOAT und ein CHAR in einen STRING, sonst wird nichts von selbst umgewandelt.
- Typen werden geprüft, wenn eine Zeile läuft, nicht wenn sie gelegt wird: Auch eine grüne Zeile kann TYPE_MISMATCH auslösen.

### Kontrollfluss

- Der Endwert von FOR ist eingeschlossen, Start, Ende und Schrittweite werden einmal berechnet, und der Schleifenvariablen kann nichts zugewiesen werden.
- REPEAT wiederholt, **solange** die Bedingung nach `END REPEAT` wahr ist – es ist kein `REPEAT … UNTIL`.
- EACH über einen Hash geht die Schlüssel nach Codepunkt sortiert durch: `Z` vor `a`.
- EXIT nimmt 0 bis 15. 15 bedeutet abgestürzt.

### Funktionen

- Argumente sind benannte PARAMETER-Zeilen, keine Positionen. Jeder Parameter ohne Standardwert muss angegeben werden.
- Parameter sind Kopien, auch Arrays, Hashes und Strukturen. Nur INPUT, FROM_JSON und FROM_YAML schreiben in die Variable, die du übergibst.
- Es gibt kein `return wert`: Ergebnisse sind Variablen, die mit ihrem Standardwert beginnen, und ihre letzten Werte gehen zurück.
- Eingebaute Funktionen geben neue Werte zurück, statt ihre Argumente zu ändern: `CALL INSERT` ohne `RESULT result list` ändert nichts.
- Tiefe Rekursion füllt den Stack des Cursors; STACK_OVERFLOW lässt den Prozess abstürzen und kann nicht abgefangen werden.

### Sammlungen

- Indizes beginnen bei 0. Eine Zuweisung an den Index, der gleich der Länge ist, hängt an; jeder höhere Index löst INDEX_OUT_OF_BOUNDS aus.
- Das Lesen eines fehlenden Schlüssels eines Hashs löst UNKNOWN_KEY aus. Frag vorher HAS_KEY.
- `ASSIGN b a ;` kopiert; wenn du `b` änderst, ändert sich `a` nicht.
- Ein Index ist eine Zahl, ein Schlüssel oder eine Variable, nie ein Ausdruck: `a[i - 1]` geht nicht. Berechne die Position vorher in eine Variable.

### Fehler

- Es gibt keine Exceptions, die ein Block abfängt: Eine ERROR-Variable in der CALL-Zeile fängt, was die aufgerufene Funktion ausgelöst hat, und der Aufrufer macht weiter.
- Eigene Fehlercodes beginnen bei 1000. RAISE beendet die Funktion wie RETURN.
- Ein abgefangener Fehler liefert trotzdem die Ergebnisse: Der Aufrufer bekommt die Werte, die sie hatten, als die Funktion abbrach. Prüfe den Fehler, bevor du sie verwendest.
- Ein Fehler, den niemand abfängt, lässt den Prozess mit Exit-Code 15 abstürzen. Syntaxfehler und einige andere (wie STACK_OVERFLOW) führen immer zum Absturz.

### Programme in der Welt

- Ein Prozess beginnt bei einer Einstiegsfunktion, die am Auslöserblock eingestellt ist, nicht am Anfang. Argumente und Ergebnisse sind Variablenkarten: eine Karte pro Parameter ohne Standardwert und genug nicht initialisierte Karten für die Ergebnisse, sonst startet er nicht.
- Das Blatt eines laufenden Programms ist gesperrt: Niemand kann darauf Blöcke setzen oder abbauen.

### Bildschirme und Geräte

- PRINT beendet immer die Zeile. Zeilen und Spalten beginnen bei 0. LOCATE und PRINT löschen den Rest einer Zeile nicht.
- INKEY wartet nie und gibt einen STRING zurück, `""` ohne Taste.
- INPUT nimmt eine passende Karte aus einem gebundenen E/A-Block, bevor es den Laptop fragt.
- WRITE wartet, bis ein gebundener E/A-Block eine nicht initialisierte Variablenkarte hat.

### Daten und das Netzwerk

- JSON und YAML werden in einen deklarierten Typ gelesen; ein Dokument, das nicht passt, löst einen Fehler aus und lässt die Variable unverändert.
- Fehlende Schlüssel behalten den aktuellen Wert, unbekannte Schlüssel werden ignoriert, Arrays und Hashes werden ersetzt.
- Tags gelten pro Sprache: Ein `json`-Tag benennt den Schlüssel in YAML nicht um.
- HTTP-Anfragen sendet der Spielclient des Spielers, der den Prozess gestartet hat (oder des Besitzers des Auslöserblocks). Ein Status ab 400 ist der Fehler HTTP_STATUS.

## Mehr dazu

- [Die Sprache](/de/c0de/guide/language): alle Anweisungen in Kürze
- [Anweisungen](/de/c0de/reference/statements), [Daten](/de/c0de/reference/data) und [Funktionen](/de/c0de/reference/functions): die Handbücher
- [Programme ausführen](/de/c0de/guide/running-programs): Auslöserblöcke, Karten, Fehler und Geräte
- [c0de_net/http](/de/c0de_net/http/): HTTP-Anfragen
