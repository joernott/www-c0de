---
description: Die Typen von c0de – einfache und komplexe Typen, Literale, Standardwerte, Umwandlungen und die Konstanten, die jedes Programm kennt.
---

# Typen und Werte

c0de ist statisch typisiert: Jede Variable, Konstante, jeder Parameter und jedes Ergebnis hat genau einen Typ, geschrieben als Typblock hinter seinem Namen. Es gibt kein `null`, keine automatische Umwandlung von Text in Zahlen und nur zwei Erweiterungen. Diese Lektion geht die Typen durch, ihre Literale und Standardwerte, die Umwandlungen zwischen ihnen und die Konstanten, die jedes Programm kennt, ohne sie zu deklarieren.

::: info Was du brauchst
Eine Kreativwelt mit erlaubten Cheats (siehe [Tutorials](/de/tutorials/)), einen **Auslöserblock**, einen **Schraubenschlüssel**, einen **Knopf** und zehn **nicht initialisierte Variablenkarten**.
:::

## Die Typen

| c0de        | Wie                                                    | Literal                 | Standardwert                 |
| ----------- | ------------------------------------------------------ | ----------------------- | ---------------------------- |
| BOOLEAN     | `boolean`                                              | `TRUE`, `FALSE`         | false                        |
| INTEGER     | Java `long` (64 Bit mit Vorzeichen)                    | `42`, `-7`              | 0                            |
| FLOAT       | Java `double`                                          | `3.14`, `1.0E20`        | 0.0                          |
| CHAR        | ein Unicode-Codepoint                                  | `'a'`                   | ein Leerzeichen              |
| TIME        | Unix-Zeit in Millisekunden                             | `@2026-10-19T12:05:09Z` | 1970-01-01T00:00:00Z         |
| STRING      | Java `String`                                          | `"Hello"`               | `""`                         |
| ARRAY T     | eine Liste von T, ab Index 0                           | –                       | leer                         |
| HASH T      | eine Map von STRING-Schlüsseln auf T                   | –                       | leer                         |
| STRUCT name | ein Datensatz mit benannten Elementen                  | –                       | Standardwerte aller Elemente |
| ERROR       | eine Struktur mit `code`, `message`, `context`, `line` | –                       | Code 0                       |

Die ersten fünf sind die **einfachen** Typen, die anderen die **komplexen**:

- **STRING** kann eine Längenbegrenzung haben: `STRING 16`. Ein längerer Wert löst STRING_TOO_LONG aus. `name[0]` liest ein Zeichen als CHAR.
- Auf **ARRAY** und **HASH** folgt immer der Typ ihres Inhalts, zum Beispiel `ARRAY INTEGER` oder `HASH ARRAY STRING`. Sie wachsen und schrumpfen von selbst, bis zu 8 Dimensionen.
- Auf **STRUCT** folgt der Name einer weiter oben deklarierten Struktur, zum Beispiel `STRUCT point`. Ihre Elemente erreichst du mit `spot.x`.
- **ERROR** ist der Typ der Fehler (siehe die Lektion „Fehler“); deine eigenen Codes beginnen bei 1000.
- **TIME** ist ein Zeitpunkt, keine Dauer. `TIME + INTEGER` addiert Millisekunden, `TIME - TIME` ergibt die Millisekunden dazwischen.

Literale gibt es nur für die einfachen Typen und STRING. Arrays, Hashes und Strukturen bekommen ihre Startwerte aus einem **Initialisierer**: einem Codeblock nach der VARIABLE- oder CONSTANT-Zeile, nur mit Literalen, ohne Ausdrücke.

## Das Programm

Eine Funktion, die einen Wert jedes Typs zurückgibt:

<<< @/tutorials/programs/programmers/types-values.c0de

## Starten

Stelle den Auslöserblock auf das Programm `typetour` und die Funktion `values` ein. Die Funktion hat zehn Ergebnisse und keine Parameter, also lege zehn nicht initialisierte Variablenkarten in sein Eingabeinventar und drücke den Knopf.

Im Ausgabeinventar liegen dann zehn Variablenkarten. Nimm eine in die Haupthand und klicke mit rechts: Der Dialog zeigt ihren Namen, Typ und Wert.

| Karte   | Typ           | Wert                              |
| ------- | ------------- | --------------------------------- |
| flag    | BOOLEAN       | true                              |
| count   | INTEGER       | 1728                              |
| ratio   | FLOAT         | 3.5                               |
| letter  | CHAR          | é                                 |
| moment  | TIME          | 2026-10-19T12:05:09.250Z          |
| name    | STRING        | Steve                             |
| list    | ARRAY INTEGER | [2, 3, 5, 7]                      |
| stock   | HASH INTEGER  | {diamond: 3, gold: 12}            |
| spot    | STRUCT point  | {x: 100, y: 0, z: -250}           |
| problem | ERROR         | Code 1000, Meldung "Just a value" |

## So funktioniert es

- `STRUCT point` deklariert einen Typ über der Funktion, die ihn verwendet. Ein Name ist erst unterhalb seiner Deklaration bekannt.
- Der Initialisierer von `primes` listet Literale auf, die von `chest` und `home` einen Schlüssel oder ein Element und ein Literal pro Zeile. Das Element `y` von `home` ist nicht aufgeführt, also behält es seinen Standardwert 0.
- `ASSIGN ratio 7 / 2 ;` ergibt 3.5: `/` ergibt immer ein FLOAT, auch bei zwei ganzen Zahlen.
- `@2026-10-19T12:05:09Z + 250` ist eine TIME 250 Millisekunden später.
- `ASSIGN list primes ;` kopiert das Array. Komplexe Werte werden immer kopiert, nie geteilt: Wenn du danach `list` änderst, ändert sich `primes` nicht.
- `problem` ist eine gewöhnliche Variable vom Typ ERROR. Sie als Ergebnis zurückzugeben löst nichts aus; das tun nur RETURN mit ihr oder RAISE.

## Umwandlungen

c0de wandelt von selbst nur in zwei Richtungen um: Ein INTEGER passt in ein FLOAT und ein CHAR in einen STRING (in ASSIGN, Initialisierern und Literalen). Alles andere ist ein Funktionsaufruf:

| Von → nach      | Wie                                                                         | Beispiel                                          |
| --------------- | --------------------------------------------------------------------------- | ------------------------------------------------- |
| alles → STRING  | `⊕` oder `c0de/strings/STR`                                                 | `"n=" ⊕ 2.5` ist `"n=2.5"`                        |
| STRING → Zahl   | `c0de/strings/VAL`                                                          | `"42"` ergibt das FLOAT 42.0 und `isInteger` true |
| FLOAT → INTEGER | `c0de/math/INT` (abrunden), `FIX` (abschneiden), `ROUND` (zur geraden Zahl) | -12.85 → -13, -12, -13                            |
| INTEGER → FLOAT | `c0de/math/TO_FLOAT` oder einfach zuweisen                                  | 7 → 7.0                                           |

<<< @/tutorials/programs/programmers/types-convert.c0de

Mit dem Standardwert `"-12.85"` sind die Ergebnisse `number` -12.85, `whole` false, `down` -13, `cut` -12, `back` -12.0, `shown` "-12.0" und `joined` "cut -12, whole false". Mit `" 42 "` ignoriert VAL die Leerzeichen und gibt 42.0 mit `isInteger` true zurück. Mit `"forty-two"` löst VAL INVALID_ARGUMENT aus, und der Prozess stürzt mit Exit-Code 15 ab.

Bibliotheksfunktionen werden mit CALL aufgerufen, nie in einem Ausdruck; die nächste Lektion erklärt, warum.

## Eingebaute Konstanten

Jedes Programm kennt diese Konstanten ohne INCLUDE:

| Konstante                             | Typ                | Inhalt                                                                                                                                                        |
| ------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SHEET`                               | STRUCT SHEET_INFO  | das Blatt des Programms: `number`, `program`, `owner`, `x`, `y`, `z`                                                                                          |
| `PID`                                 | STRUCT PID_INFO    | der Prozess: `pid`, `program`, `function`, `owner`, `activator` (wer ihn gestartet hat), `x`, `y`, `z` und `dimension` des Auslöserblocks, `debug`, `started` |
| `CURSOR`                              | STRUCT CURSOR_INFO | der Cursor im Moment: `line`, `function`, `depth`, `stack_used`, `stack_size`                                                                                 |
| `C0DE_VERSION`                        | STRING             | die Version von c0de, z. B. `"0.5.0"`                                                                                                                         |
| `COLOR_BLACK` … `COLOR_WHITE`         | INTEGER            | die 16 Farben 0 bis 15 von COLOR                                                                                                                              |
| `DIVISION_BY_ZERO`, `TYPE_MISMATCH` … | INTEGER            | die Codes der Fehler der Sprache                                                                                                                              |

SHEET und PID werden gefüllt, wenn der Prozess startet. CURSOR ist bei jedem Lesen anders.

## Unterschiede, über die du stolpern wirst

- Typen werden geprüft, wenn das Programm läuft, nicht beim Schreiben: Eine Zeile `ASSIGN count 7 / 2 ;` für einen INTEGER `count` ist auf dem Blatt grün und löst beim Ausführen TYPE_MISMATCH aus.
- Es gibt kein `null`. Eine Variable ohne Startwert enthält den Standardwert ihres Typs, ein Ergebnis auch.
- Ein INTEGER läuft nicht über wie ein Java-`long`: `9223372036854775807 + 1` löst NUMERIC_OVERFLOW aus.
- Ein FLOAT geteilt durch `0.0` löst DIVISION_BY_ZERO aus, anders als IEEE-Gleitkommazahlen in Java, C oder JavaScript. Ein FLOAT, das zu groß wird, wird trotzdem `Infinity`.
- `"1" + 1` ist ein TYPE_MISMATCH, nicht `"11"` oder `2`. Text wird mit `⊕` zusammengefügt, und Zahlen werden mit VAL aus Text gelesen.
- VAL gibt immer ein FLOAT zurück. FIX macht daraus einen INTEGER.
- Ein TIME-Literal ohne Versatz, wie `@2026-10-19T12:05:09`, wird in der Zeitzone des Servers gelesen. Schreibe `Z` oder `+02:00`, um sicherzugehen.
- Arrays und Hashes sind Werte, keine Referenzen: Zuweisen oder Übergeben kopiert sie.

## Probier es selbst

1. Ändere den Typ des Ergebnisses `name` in `STRING 3` und starte noch einmal. Was passiert?

::: details Lösung
`"Steve"` hat 5 Zeichen, also löst das ASSIGN STRING_TOO_LONG aus. Der Prozess stürzt mit Exit-Code 15 ab, und es entstehen keine Ergebniskarten: Die Karten, die du hineingelegt hast, kommen unverändert ins Ausgabeinventar zurück.
:::

2. Schreibe eine Funktion, die die Nummer ihres Blatts zurückgibt, den Spieler, der sie gestartet hat, Zeile und Tiefe des Cursors, die Nummer der Farbe Rot und den Code von DIVISION_BY_ZERO.

::: details Lösung
<<< @/tutorials/programs/programmers/types-constants.c0de

Mit einem Knopf gestartet, ist `starter` dein Name. `line` ist 13, die Zeile des ASSIGN, das CURSOR liest, `depth` ist 1 in der Einstiegsfunktion, `red` ist 12 und `failure` ist 303. `sheet` ist die Nummer des Blatts, auf dem du es gebaut hast.
:::

## Mehr dazu

- [Die Sprache: Typen](/de/c0de/guide/language#typen), [Literale](/de/c0de/guide/language#literale) und [Strukturen](/de/c0de/guide/language#strukturen): die Typen und die eingebauten Konstanten in Kürze
- [Daten](/de/c0de/reference/data): jeder Typblock, VARIABLE, CONSTANT und LITERAL
- [VAL](/de/c0de/strings/val), [STR](/de/c0de/strings/str), [INT](/de/c0de/math/int), [FIX](/de/c0de/math/fix), [ROUND](/de/c0de/math/round), [TO_FLOAT](/de/c0de/math/to_float): die Umwandlungen
- [Programme ausführen: Variablenkarten](/de/c0de/guide/running-programs#variablenkarten): wie Karten Werte hinein- und heraustragen
