---
description: Eine Aufgabenliste, die alle Spieler teilen und die auf einem Server liegt – Einträge mit HTTP_POST anlegen, mit HTTP_PUT ersetzen, mit HTTP_PATCH erledigen und mit HTTP_DELETE löschen, die Daten mit TO_JSON gebaut.
---

# Mit einem REST-Dienst sprechen

Eine Aufgabenliste für dein Team, die nicht in der Welt liegt, sondern auf einem Server: Ein Spieler trägt mit einem Auslöserblock „Feed the cats“ ein, ein anderer hakt es ab, und eine Anzeige zeigt allen die Liste. Der Server ist die Tutorial-API von c0de.at, die die Liste im Speicher hält und jede Nacht leert.

**Funktionen:** [HTTP_POST](/de/c0de_net/http/http_post), [HTTP_PUT](/de/c0de_net/http/http_put), [HTTP_PATCH](/de/c0de_net/http/http_patch), [HTTP_DELETE](/de/c0de_net/http/http_delete), [HTTP_GET](/de/c0de_net/http/http_get) sowie [TO_JSON](/de/c0de/strings/to_json) und [FROM_JSON](/de/c0de/strings/from_json) aus c0de/strings

::: info Was du brauchst
Die Mod **c0de net** in deinem Spiel, fünf Auslöserblöcke mit Knöpfen (einen für jede Funktion), eine **Anzeigewand** oder einen Laptop für die Liste, **Variablenkarten** `title` vom Typ STRING und `id` vom Typ INTEGER sowie nicht initialisierte Variablenkarten für die Ergebnisse.
:::

## Die Idee

Ein REST-Dienst speichert Dinge – hier die Einträge einer Liste –, und jeder Eintrag hat seine eigene Adresse. Die HTTP-Methode sagt, was damit geschehen soll:

| Was                         | Methode | Endpunkt                  | Daten           | Antwort                                  |
| --------------------------- | ------- | ------------------------- | --------------- | ---------------------------------------- |
| die Liste lesen             | GET     | `/api/tutorial/todo`      |                 | `[{"id":1,"title":"…","done":false}, …]` |
| einen Eintrag anlegen       | POST    | `/api/tutorial/todo`      | `{"title":"…"}` | 201 und der neue Eintrag mit seiner `id` |
| einen Eintrag ersetzen      | PUT     | `/api/tutorial/todo/<id>` | `{"title":"…"}` | der Eintrag                              |
| einen Teil davon ändern     | PATCH   | `/api/tutorial/todo/<id>` | `{"done":true}` | der Eintrag                              |
| einen Eintrag löschen       | DELETE  | `/api/tutorial/todo/<id>` |                 | 204, keine Daten                         |

Die Daten sind JSON. JSON von Hand zu schreiben heißt Anführungszeichen in einem Text, und da passieren leicht Fehler; [TO_JSON](/de/c0de/strings/to_json) baut es stattdessen aus einer Struktur oder einer Variablen. Der Header `Content-Type: application/json` sagt dem Server, was er bekommt.

Die Liste ist für jeden Spieler in jeder Welt dieselbe, also sei nett: Sie fasst höchstens 100 Einträge mit Titeln bis zu 100 Zeichen, nimmt 60 Anfragen pro Minute von einem Computer an und wird um 00:00 UTC geleert. Die Anfragen kommen vom Computer des Spielers, der den Knopf drückt; jeder Spieler kann sie für seinen eigenen Computer abschalten.

## Das Programm

<<< @/tutorials/programs/libraries/http/todo-list-api.c0de

## Aufbauen und starten

1. Stelle für jede Funktion des Programms `todolist` einen Auslöserblock auf: `add`, `rename`, `complete`, `remove` und `show`. Beschrifte sie mit Schildern.
2. Binde die Anzeigewand oder den Laptop an `todolist` / `show`.
3. `add`: Leg eine Variablenkarte `title` mit `Feed the cats` und eine nicht initialisierte Karte in den Auslöserblock und drück seinen Knopf. Die Ergebniskarte `id` enthält die Nummer des neuen Eintrags, zum Beispiel 1. Trag `Build a farm` genauso ein (2).
4. `complete`: Leg eine Karte `id` mit 1 hinein. Das Ergebnis `answer` ist die Antwort des Servers: `{"id":1,"title":"Feed the cats","done":true}`.
5. `rename`: Karten `id` 2 und `title` `Build a big farm`. Die Antwort ist `{"id":2,"title":"Build a big farm","done":false}`.
6. `remove`: eine Karte `id`. Das Ergebnis `status` ist 204: gelöscht, nichts zu antworten.
7. `show` gibt die Liste aus und liefert die Zahl der Einträge:

```
[x] 1 Feed the cats
[ ] 2 Build a big farm
```

Andere Spieler sehen dieselbe Liste – und die Nummern anderer Einträge, denn alle teilen sie.

## So funktioniert es

- **Eine Verbindung für alle.** `connect` liefert eine fertige HTTP_CONNECTION, so stehen der Server, der Basis-Endpunkt `/api/tutorial/todo` und der Header nur einmal da. Jede Anfrage hängt ihren Endpunkt an die Basis an: nichts für die Liste, `"/" ⊕ id` für einen Eintrag.
- **POST legt an.** `add` füllt die Struktur `change` und lässt TO_JSON sie schreiben: `{"title":"Feed the cats"}`. Der Server antwortet mit 201 und dem neuen Eintrag, und FROM_JSON liest ihn in `created`, ein `todo` mit `id`, `title` und `done`.
- **Zwei Strukturen.** Der Server lehnt Schlüssel ab, die er nicht kennt, und er vergibt die `id` jedes Eintrags selbst. Deshalb haben die Daten, die hinausgehen (`change`), nur einen Titel, und die Antwort, die hereinkommt (`todo`), alle drei Elemente.
- **PUT ersetzt, PATCH ändert.** PUT sendet den ganzen Eintrag und setzt alles, was fehlt, auf den Standardwert: Ein umbenannter Eintrag ist nicht mehr erledigt. PATCH sendet nur, was sich ändert. `VARIABLE done BOOLEAN TRUE TAG(json: "done")` ergibt mit TO_JSON genau `{"done":true}`: Ein Tag in einer VARIABLE-Zeile ist der Pfad, an den TO_JSON den Wert setzt.
- **DELETE antwortet mit einem Status.** Es gibt keine Daten zu lesen, also liefert `remove` den `status`, 204 („No Content“).
- **Falsche Anfragen sind Fehler.** Eine `id`, die es nicht gibt, ergibt 404, ein leerer Titel 400, eine volle Liste 409. Jeder davon löst HTTP_STATUS (Code 1000) aus, und der Prozess stürzt ab. [Wenn das Netz ausfällt](/de/tutorials/libraries/c0de_net/http/network-errors) zeigt, wie du sie abfängst und den Grund liest, den der Server nennt.

## Probier es selbst

1. Schreib eine Funktion, die alle erledigten Einträge löscht und zurückgibt, wie viele sie gelöscht hat.

::: details Lösung
<<< @/tutorials/programs/libraries/http/todo-list-cleanup.c0de

GET liest die ganze Liste, EACH geht sie durch, und jeder Eintrag mit `done` bekommt sein eigenes DELETE. Ohne RESULT-Zeile wirft der CALL alle Ergebnisse weg. Nach den Schritten oben ist `removed` gleich 1.
:::

2. Hake den Eintrag 99 ab, den es nicht gibt. Was zeigt der Auslöserblock?

::: details Lösung
Der Prozess stürzt mit dem Fehler 1000 ab, HTTP_STATUS, und der Meldung `404 Not Found`. Alle Karten kommen unverändert aus dem Auslöserblock. Der Server sagt auch, warum, in seiner Antwort `{"error":"no such entry"}`; die erste Übung von [Wenn das Netz ausfällt](/de/tutorials/libraries/c0de_net/http/network-errors) liest sie.
:::

## Mehr dazu

- [c0de_net/http](/de/c0de_net/http/): [HTTP_POST](/de/c0de_net/http/http_post), [HTTP_PUT](/de/c0de_net/http/http_put), [HTTP_PATCH](/de/c0de_net/http/http_patch), [HTTP_DELETE](/de/c0de_net/http/http_delete), [HTTP_CONNECTION](/de/c0de_net/http/http_connection)
- [TO_JSON](/de/c0de/strings/to_json), [FROM_JSON](/de/c0de/strings/from_json) und [TAG](/de/c0de/reference/data#tag)
- [Daten und das Netzwerk](/de/tutorials/programmers/data)
- [Variablenkarten](/de/c0de/guide/running-programs#variablenkarten) und [Ergebnisse](/de/c0de/guide/running-programs#ergebnisse)
