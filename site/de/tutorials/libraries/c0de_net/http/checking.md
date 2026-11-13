---
description: Eine Statuslampe, die leuchtet, wenn eine Website ausgefallen ist, mit HTTP_HEAD und einem Zeitgeberblock, und ein Blick darauf, was ein Server erlaubt, mit HTTP_OPTIONS und HTTP_TRACE.
---

# Einen Dienst prüfen

Eine Lampe in deiner Basis, die aufleuchtet, wenn deine Lieblings-Website ausgefallen ist, und eine Anzeige, die sagt, warum. Und für Neugierige: einen Server fragen, welche Methoden er erlaubt und wie eine Anfrage aussieht, wenn sie ankommt.

**Funktionen:** [HTTP_HEAD](/de/c0de_net/http/http_head), [HTTP_OPTIONS](/de/c0de_net/http/http_options), [HTTP_TRACE](/de/c0de_net/http/http_trace) und [FROM_JSON](/de/c0de/strings/from_json) aus c0de/strings

::: info Was du brauchst
Die Mod **c0de net** in deinem Spiel, einen **Zeitgeberblock**, einen **Komparator** und eine **Redstone-Lampe**, eine **Anzeigewand** aus 2 × 1 Anzeigeblöcken und wahlweise **Variablenkarten** `server` und `endpoint` vom Typ STRING, um eine andere Seite als c0de.at zu prüfen. Für das zweite Programm: einen Auslöserblock mit Knopf, einen Laptop und zwei nicht initialisierte Variablenkarten.
:::

## Die Idee

Um zu sehen, ob eine Seite erreichbar ist, brauchst du nicht die ganze Seite. [HTTP_HEAD](/de/c0de_net/http/http_head) fragt wie GET, aber der Server schickt nur die Header seiner Antwort: den Status, den Typ, das Datum der letzten Änderung. Das geht schnell und kostet den Server fast nichts, also kann ein Zeitgeberblock jede Minute fragen.

Das Programm teilt es der Welt über seinen **Exit-Code** mit: 0, wenn die Seite geantwortet hat, 1, wenn sie mit einem Fehlerstatus wie 404 oder 503 geantwortet hat, 2, wenn gar keine Antwort kam. Ein Komparator neben dem Zeitgeberblock macht aus dem Exit-Code ein Redstone-Signal, und die Lampe leuchtet, sobald er nicht 0 ist.

[HTTP_OPTIONS](/de/c0de_net/http/http_options) und [HTTP_TRACE](/de/c0de_net/http/http_trace) sind Werkzeuge, um einen Server zu erkunden: OPTIONS fragt, welche Methoden ein Endpunkt erlaubt, TRACE bittet den Server, die Anfrage so zurückzuschicken, wie sie angekommen ist.

## Das Programm

<<< @/tutorials/programs/libraries/http/checking-lamp.c0de

## Aufbauen und starten

1. Setze den Zeitgeberblock, einen Komparator, der von ihm weg zeigt, und die Redstone-Lampe vor den Komparator.
2. Binde die Anzeigewand an `statuslamp` / `check`.
3. Stelle den Zeitgeberblock auf `statuslamp` / `check` und einen Abstand von 1200 Ticks (eine Minute) ein. Leg die Karten `server` und `endpoint` hinein, wenn du eine andere Seite prüfen willst.

Die Wand zeigt die Seite und ihre Antwort, und die Lampe bleibt dunkel:

```
c0de.at/
Status 200
text/html; charset=utf-8
Thu, 12 Nov 2026 07:28:38 GMT
```

<!-- screenshot: checking-lamp | The timer block with comparator and a dark redstone lamp, the display wall showing c0de.at/ and Status 200 -->

Mit dem Endpunkt `/api/nothing` zeigt die Wand `Status 404` und `application/json; charset=utf-8`, und die Lampe leuchtet mit Signalstärke 1. Für einen Server, den es nicht gibt, zeigt sie `DOWN:` und den Grund, und das Signal ist 2.

Den Prozess eines Zeitgeberblocks startet niemand, also kommen die Anfragen vom Computer seines Besitzers. Ist der Besitzer offline, schlägt die Anfrage mit CLIENT_UNAVAILABLE fehl, und die Lampe leuchtet auch – das Programm kann nicht unterscheiden, ob die Seite ausgefallen ist oder niemand fragen kann. Dasselbe passiert, wenn der Besitzer die Anfragen auf seinem Computer abgeschaltet hat.

## So funktioniert es

- **HEAD liefert die Header doppelt.** `headers` ist ein HASH, und `result` enthält – nur bei HEAD – dieselben Header als JSON-Objekt, etwa `{"content-type":"text/html; charset=utf-8","last-modified":"…",…}`. FROM_JSON liest es in die Struktur `page`, deren Tags die zwei Header auswählen, die das Programm zeigt. Fehlt ein Header, bleibt sein Element leer.
- **Der Fehler bestimmt den Exit-Code.** Der CALL fängt jeden Fehler in `problem` ab. Der Code `c0de_net/http/HTTP_STATUS` (1000) heißt: Der Server hat mit einem Status ab 400 geantwortet – er läuft, aber etwas stimmt nicht. Jeder andere Code heißt, dass es keine Antwort zu lesen gibt, und das Programm zeigt die Meldung, etwa einen unbekannten Host, und endet mit `EXIT 2`.
- **EXIT ist das Signal.** `EXIT 1` und `EXIT 2` beenden den Prozess mit diesem Code. Ohne EXIT endet die Funktion normal mit dem Code 0.
- **Kurzes Timeout.** `timeout` 5 heißt: Eine Seite, die länger als fünf Sekunden braucht, gilt als ausgefallen.

## Was ein Server erlaubt

Dieses Programm fragt die Aufgabenliste von c0de.at (siehe [Mit einem REST-Dienst sprechen](/de/tutorials/libraries/c0de_net/http/todo-list)), was sie erlaubt, und probiert dann TRACE daran aus:

<<< @/tutorials/programs/libraries/http/checking-allowed.c0de

Binde einen Laptop an `methodcheck` / `ask` und starte es mit einem Auslöserblock. Der Laptop zeigt:

```
Allowed: GET, HEAD, POST, OPTIONS
TRACE refused: 405 Method Not Allowed
```

- **OPTIONS** antwortet im Header `allow`. Nicht jeder Server schickt ihn, deshalb prüft HAS_KEY zuerst; ein fehlender Schlüssel würde UNKNOWN_KEY auslösen.
- **TRACE wird oft abgelehnt.** Es steht nicht in der Liste, also antwortet der Server mit 405, und HTTP_TRACE löst HTTP_STATUS aus. Das Programm fängt das ab und zeigt die Meldung, statt abzustürzen. `traced`, der Status, ist 405.
- **Ein Server, der TRACE erlaubt,** schickt die Anfrage zurück; das Programm liest ihre Methode und ihren Pfad. Viele Server tun das nicht, weil das Echo Header wie Cookies verraten könnte. c0de.at auch nicht: Probier den Endpunkt `/api/tutorial/echo`, der auf jede Methode antwortet – OPTIONS nennt dort auch TRACE, aber der Webserver davor lehnt TRACE mit 405 ab, bevor die Anfrage das Echo erreicht. Genau dafür ist TRACE da: zu sehen, was die Rechner zwischen dir und dem Dienst mit einer Anfrage machen.

## Probier es selbst

1. Prüfe mehrere Seiten mit einem Zeitgeberblock und zeige jede in einer eigenen Zeile. Der Exit-Code ist die Zahl der Seiten, die nicht antworten.

::: details Lösung
<<< @/tutorials/programs/libraries/http/checking-many.c0de

Die Server stehen in einem Array, und EACH fragt einen nach dem anderen, mit derselben Verbindung und einem neuen `server`. Hier gilt eine Seite als erreichbar, wenn sie überhaupt antwortet, auch mit einem Fehlerstatus: `api.open-meteo.com` antwortet für `/` mit 404, ist aber da. Sind zwei Seiten ausgefallen, bekommt die Lampe Signalstärke 2.
:::

2. Baue eine zweite Lampe dazu, die leuchtet, solange die Seite erreichbar ist.

::: details Lösung
Setze eine Redstone-Fackel an die Seite eines Blocks, den der Komparator mit Strom versorgt, und die zweite Lampe neben die Fackel. Die Fackel kehrt das Signal um: Sie ist an, solange der Komparator aus ist, also solange der Exit-Code 0 ist. Das Programm ändert sich nicht.
:::

## Mehr dazu

- [c0de_net/http](/de/c0de_net/http/): [HTTP_HEAD](/de/c0de_net/http/http_head), [HTTP_OPTIONS](/de/c0de_net/http/http_options), [HTTP_TRACE](/de/c0de_net/http/http_trace), [Fehler](/de/c0de_net/http/errors), [Wie Anfragen gesendet werden](/de/c0de_net/http/getting-started#wie-anfragen-gesendet-werden)
- [Exit-Codes](/de/c0de/guide/running-programs#exit-codes) und [EXIT](/de/c0de/guide/language#exit)
- [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock)
- [HAS_KEY](/de/c0de/reference/functions#has_key)
