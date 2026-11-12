---
description: Wenn das Netz ausfällt – die Fehler von c0de net abfangen, eine Anfrage mit SLEEP und immer längerem Warten wiederholen, und eine freundliche Meldung für jeden Fehlercode.
---

# Wenn das Netz ausfällt

Netze fallen ständig aus: Das WLAN bricht ab, ein Server startet neu, ein Dienst ist überlastet. Ein Programm, das beim ersten Schluckauf abstürzt, nervt. Dieses Rezept baut eine Anfrage, die es noch einmal versucht und dabei jedes Mal etwas länger wartet, und die dem Spieler in einfachen Worten sagt, was schiefging, wenn sie schließlich aufgibt.

**Funktionen:** die [Fehler von c0de net](/de/c0de_net/http/errors), [HTTP_GET](/de/c0de_net/http/http_get) und [SLEEP](/de/c0de/time/sleep) aus c0de/time

::: info Was du brauchst
Die Mod **c0de net** in deinem Spiel, einen Auslöserblock mit Knopf, einen Laptop, zwei nicht initialisierte Variablenkarten und wahlweise **Variablenkarten** `server` und `endpoint` vom Typ STRING. Ohne sie fragt das Programm c0de.at nach den neuesten Versionen von c0de.
:::

## Die Idee

Jede Funktion von c0de_net/http löst einen Fehler aus, wenn die Anfrage nicht klappt. Ein CALL mit einer ERROR-Variablen fängt ihn ab, und ihr `code` sagt, was passiert ist:

| Code | Name               | Was passiert ist                                           | Nochmal versuchen?             |
| ---: | ------------------ | ---------------------------------------------------------- | ------------------------------ |
|  309 | INVALID_ARGUMENT   | die Verbindung oder der Endpunkt ist falsch                | nein, korrigiere das Programm  |
| 1000 | HTTP_STATUS        | der Server hat mit einem Status ab 400 geantwortet         | nur bei 429 und 500 – 599      |
| 1001 | CLIENT_UNAVAILABLE | der Spieler ist nicht online oder hat kein c0de net        | nein                           |
| 1002 | REQUESTS_DISABLED  | der Spieler hat Anfragen auf seinem Computer abgeschaltet  | nein                           |
| 1003 | REQUEST_FAILED     | keine Verbindung: unbekannter Host, abgewiesen, Netz weg   | ja                             |
| 1004 | REQUEST_TIMEOUT    | keine vollständige Antwort innerhalb des Timeouts          | ja                             |
| 1005 | RESPONSE_TOO_LARGE | die Antwort ist größer, als der Server erlaubt             | nein, frag nach weniger        |

Ein neuer Versuch hilft nur, wenn das Problem von selbst verschwinden kann. Und sofort nochmal zu fragen, hilft selten: Ist ein Server überlastet, machen hundert Programme, die gleichzeitig nochmal fragen, es schlimmer. Deshalb wächst die Wartezeit mit jedem Versuch – 1 Sekunde, 2, 4 –, das nennt man **exponentielles Backoff**. [SLEEP](/de/c0de/time/sleep) wartet eine Zahl von Spielticks; 20 Ticks sind eine Sekunde.

## Das Programm

<<< @/tutorials/programs/libraries/http/network-errors-retry.c0de

## Aufbauen und starten

1. Binde den Laptop an `netretry` / `fetch`.
2. Stelle den Auslöserblock auf `netretry` / `fetch`, leg zwei nicht initialisierte Variablenkarten hinein und drück den Knopf. Der Laptop zeigt die Antwort, `{"c0de":"0.5.0","c0de_net":"0.2.0"}`, und das Ergebnis `tries` ist 1.
3. Leg eine Variablenkarte `server` mit `nothing.invalid` hinein, einem Namen, den es nie gibt, und drück noch einmal. Jetzt zeigt der Laptop:

```
Try 1 failed, waiting 20 ticks
Try 2 failed, waiting 40 ticks
Try 3 failed, waiting 80 ticks
The server can't be reached
```

Der Exit-Code ist 1, also kann ein Komparator ihn anzeigen. Mit dem Server `c0de.at` und dem Endpunkt `/api/nothing` gibt es keinen neuen Versuch: Der Laptop zeigt nach dem ersten Versuch `There is nothing at this address`.

## So funktioniert es

- **`explain` macht aus einem Code Worte.** Es beginnt mit einer Meldung für unbekannte Codes und überschreibt sie für jeden Code, den es kennt. Bei HTTP_STATUS sagt der Status mehr: 404 ist eine falsche Adresse, 429 heißt „zu viele Anfragen“, ab 500 hat der Server ein Problem. `INVALID_ARGUMENT` ist eine Konstante von c0de; die Codes von c0de net stehen als Zahlen da.
- **`worthRetrying` entscheidet.** Nur REQUEST_FAILED, REQUEST_TIMEOUT und die Status 429 und ab 500 können von selbst verschwinden. Ein 404 bleibt ein 404, egal wie oft du fragst.
- **Die Schleife** läuft, solange `again` wahr ist. Jede Runde sendet die Anfrage mit `problem` in der CALL-Zeile, also lässt kein Fehler den Prozess abstürzen. Eine erfolgreiche Anfrage setzt `problem.code` wieder auf 0, und `worthRetrying` sagt `FALSE`. Nach dem vierten Versuch beendet das ELSE die Schleife ohnehin.
- **Die Wartezeit verdoppelt sich:** `wait` beginnt bei 20 Ticks und wird zu 40 und 80. SLEEP hält nur diesen Prozess an; das Spiel und andere Programme laufen weiter.
- **Aufgeben** gibt die Meldung von `explain` aus und endet mit `EXIT 1`, also meldet der Auslöserblock es ohne Absturz.
- **Wen der Fehler betrifft.** Die Anfrage wird vom Computer des Spielers gesendet, der den Knopf gedrückt hat. CLIENT_UNAVAILABLE und REQUESTS_DISABLED betreffen diesen Spieler, nicht den Server – dasselbe Programm kann bei einem Freund funktionieren.

Vorsicht bei Wiederholungen von Anfragen, die etwas ändern. Läuft bei einem POST das Timeout ab, hat der Server den Eintrag vielleicht trotzdem gespeichert, und ein neuer Versuch legt ihn ein zweites Mal an. GET, HEAD, PUT und DELETE lassen sich gefahrlos wiederholen: Zweimal fragen oder zweimal löschen hinterlässt dasselbe Ergebnis.

## Probier es selbst

1. Die Aufgabenliste von c0de.at beantwortet Fehler mit einem Grund in JSON, etwa `{"error":"no such entry"}`. Zeige die Statuszeile und diesen Grund.

::: details Lösung
<<< @/tutorials/programs/libraries/http/network-errors-reason.c0de

HTTP_GET liefert `result` auch dann, wenn es HTTP_STATUS auslöst, also lässt sich die Antwort nach dem Fehler lesen. Nicht jeder Server beantwortet Fehler in JSON, deshalb bekommt FROM_JSON eine eigene ERROR-Variable: Lässt sich die Antwort nicht lesen, zeigt das Programm nur die Statuszeile. Für den Eintrag 99 ist der Text `404 Not Found: no such entry`.
:::

2. Ein langsamer Server lässt den Spieler lange warten. Lass das Programm früher aufgeben.

::: details Lösung
Senke `api.timeout`, zum Beispiel auf 3 Sekunden. Das Timeout umfasst die ganze Anfrage bis zum letzten Byte der Antwort; mit vier Versuchen und den Wartezeiten von 1 + 2 + 4 Sekunden gibt das Programm dann nach höchstens 19 Sekunden auf statt nach 47.
:::

## Mehr dazu

- [Fehler von c0de net](/de/c0de_net/http/errors) und [Wie Anfragen gesendet werden](/de/c0de_net/http/getting-started#wie-anfragen-gesendet-werden)
- [Fehler](/de/tutorials/programmers/errors) im Pfad für Programmierer und [Fehler](/de/c0de/guide/language#fehler) in der Anleitung
- [SLEEP](/de/c0de/time/sleep)
- [Exit-Codes](/de/c0de/guide/running-programs#exit-codes)
