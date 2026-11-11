---
description: JSON und YAML in typisierte Variablen und Strukturen mit Tags einlesen, und HTTP-Anfragen mit c0de net, die der Spielclient eines Spielers sendet.
---

# Daten und das Netzwerk

c0de hat keinen dynamischen Typ – kein `dict`, kein `any`, kein `Object`. JSON und YAML werden in Variablen eines deklarierten Typs gelesen, und der Typ bestimmt, wie das Dokument gelesen wird, ganz ähnlich wie `encoding/json` in Go. Diese Lektion liest eine Konfiguration in eine Struktur und holt JSON mit c0de net aus dem Web, dessen Anfragen vom Computer eines Spielers kommen, nicht vom Server.

::: info Was du brauchst
Einen Auslöserblock mit Knopf, eine **Variablenkarte** `source` vom Typ STRING mit dem JSON-Text und vier nicht initialisierte Variablenkarten. Für die Anfrage: die Mod **c0de net**, einen an das Programm gebundenen Bildschirm (siehe [Bildschirme, Tastaturen und E/A-Blöcke](/de/tutorials/programmers/screens)) und eine nicht initialisierte Variablenkarte.
:::

## Das Modell

- **Der Typ der Variablen ist das Schema.** FROM_JSON und FROM_YAML aus c0de/strings lesen ein Dokument in eine vorhandene Variable. Eine Struktur liest ein Objekt, ein HASH ein Objekt mit beliebigen Schlüsseln, ein ARRAY ein Array; jeder Wert muss zum Typ an seiner Stelle passen.
- **Der aktuelle Wert ist der Standardwert.** Elemente einer Struktur, die im Dokument fehlen oder `null` sind, behalten ihren Wert. Initialisiere die Variable mit den Standardwerten und lies dann das Dokument darüber. Schlüssel, die die Struktur nicht hat, werden ignoriert. Arrays und Hashes werden vollständig ersetzt.
- **Alles oder nichts.** Ein Wert vom falschen Typ löst TYPE_MISMATCH aus, ein fehlerhaftes Dokument INVALID_ARGUMENT, ein zu langer STRING STRING_TOO_LONG – und die Variable bleibt ganz unverändert.
- **Tags bilden Namen ab.** Ein TAG-Block am Ende eines Strukturelements legt dessen Schlüssel für eine Sprache fest, `json` oder `yaml`: `TAG(json: "close_after")`. Der Name `-` überspringt das Element. Ein Tag in einer VARIABLE-Zeile ist dagegen ein Pfad: `TAG(json: "current.temperature_2m")` liest nur den Wert an diesem Pfad.
- **Schreiben.** TO_JSON (in einer Zeile oder mit `indent` 1 bis 16 eingerückt) und TO_YAML (im Blockstil) schreiben Elemente in der Reihenfolge ihrer Deklaration und die Schlüssel von Hashes aufsteigend sortiert.

| c0de                    | JSON / YAML                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| BOOLEAN, INTEGER, FLOAT | `true`/`false`, Zahlen (ein INTEGER kann `1.5` nicht lesen; ein FLOAT liest `1`)                 |
| CHAR, STRING            | String (ein CHAR genau ein Zeichen)                                                              |
| TIME                    | ISO-8601-String in UTC, etwa `2026-10-19T12:05:09.250Z`; beim Lesen auch Millisekunden seit 1970 |
| ARRAY, HASH, STRUCT     | Array / Sequenz, Objekt / Mapping                                                                |
| ERROR                   | Objekt mit `code`, `message`, `context` und `line`                                               |

## Das Programm

Eine Konfiguration für die Basis mit Standardwerten, einer verschachtelten Struktur, einem Array, einem Hash und einem Feld, das das Programm nie verlässt:

<<< @/tutorials/programs/programmers/data-config.c0de

Dasselbe in Python, ohne die Typprüfungen:

```python
import json

def load(source: str):
    c = {"title": "My base", "color": 14,
         "entrance": {"delay": 100, "friends": []}, "prices": {}, "secret": ""}
    doc = json.loads(source)
    c["title"] = doc.get("title", c["title"])
    c["color"] = doc.get("color", c["color"])
    entrance = doc.get("entrance", {})
    c["entrance"]["delay"] = entrance.get("close_after", c["entrance"]["delay"])
    c["entrance"]["friends"] = entrance.get("friends", c["entrance"]["friends"])
    c["prices"] = doc.get("prices", c["prices"])
    return c["title"], c["entrance"]["delay"], len(c["entrance"]["friends"])
```

## Starten

Stelle den Auslöserblock auf das Programm `settings` und die Funktion `load` ein. Lege die Variablenkarte `source` mit diesem Text und die vier nicht initialisierten Karten in sein Eingabeinventar:

```json
{
  "title": "Steve's base",
  "entrance": { "close_after": 60, "friends": ["Alex", "Kai"] },
  "prices": { "diamond": 5, "apple": 1 },
  "secret": "x",
  "owner": "Steve"
}
```

Die Ergebnisse sind `title` = `"Steve's base"`, `delay` = 60, `friends` = 2 und `yaml`:

```yaml
title: Steve's base
color: 14
entrance:
  delay: 60
  friends:
    - Alex
    - Kai
prices:
  apple: 1
  diamond: 5
secret: ''
```

Mit dem Text `{}` behält alles seinen Standardwert: `"My base"`, 100 und 0.

## So funktioniert es

- Der Codeblock unter `VARIABLE c STRUCT config` setzt die Standardwerte: `title`, `color` und das verschachtelte `entrance.delay`. FROM_JSON überschreibt dann, was das Dokument enthält. `color` steht nicht im Dokument und bleibt 14; `owner` gibt es in der Struktur nicht, es wird ignoriert.
- `destination c` wird als Referenz übergeben, wie die `variable` von INPUT; alle anderen Parameter sind Kopien. Es muss ein einzelner Variablenname ohne Index sein, keine Konstante und keine Schleifenvariable. FROM_JSON hat kein Ergebnis.
- `TAG(json: "close_after")` liest den Schlüssel `close_after` in das Element `delay`. Der Tag gilt nur für JSON, darum schreibt TO_YAML `delay`.
- `TAG(json: "-")` hält `secret` in beiden Richtungen aus JSON heraus: Das `"x"` des Dokuments wird nicht gelesen. In YAML hat das Element keinen Tag und wird als `secret: ''` geschrieben.
- Der Hash `prices` wird mit sortierten Schlüsseln geschrieben: `apple` vor `diamond`.

## Das Netzwerk

Die Bibliothek c0de_net/http der Mod c0de net sendet HTTP-Anfragen. Eine Struktur `c0de_net/http/HTTP_CONNECTION` beschreibt den Server, und es gibt eine Funktion pro Methode (HTTP_GET, HTTP_POST, HTTP_PUT …), die jeweils die Rohdaten der Antwort, ihren Status und ihre Header zurückgibt. Dieses Programm fragt Open-Meteo, eine öffentliche Wetter-API ohne Schlüssel, nach der Temperatur in Wien:

<<< @/tutorials/programs/programmers/data-weather.c0de

`VARIABLE current FLOAT TAG(json: "current.temperature_2m")` liest nur die eine Zahl aus der ganzen Antwort. Binde einen Bildschirm an `weather` / `vienna` und starte es mit einem Auslöserblock: Der Bildschirm zeigt die Temperatur, und die Karte `temperature` enthält sie.

Was anders ist als bei einer Anfrage in anderen Sprachen:

- **Der Client sendet sie.** Der Minecraft-Server sendet keine Anfragen. Das tut der Spielclient des Spielers, der den Prozess gestartet hat – mit einem Knopf, Hebel oder einer Druckplatte am Auslöserblock – oder, wenn niemand ihn gestartet hat (ein Timerblock, ein Redstone-Takt), der Besitzer des Auslöserblocks. Dieser Spieler muss online sein und c0de net installiert haben. Eine Anfrage erreicht, was der Computer dieses Spielers erreicht, auch sein Heimnetz.
- **CALL wartet.** Die CALL-Zeile wartet, bis die Antwort eintrifft, ein Fehler auftritt oder das Timeout der Verbindung abläuft (`timeout`, 1 bis 300 Sekunden, 0 für 60). Andere Prozesse laufen inzwischen weiter. Endet der Prozess, wird die Anfrage abgebrochen; nach einem Neustart des Servers sendet ein wiederhergestellter Prozess sie erneut – denk daran bei POST und DELETE.
- **Status sind Fehler.** Ein Status ab 400 löst HTTP_STATUS (Code 1000) aus, und `result`, `status` und `headers` werden trotzdem geliefert. Ohne Client ist der Code CLIENT_UNAVAILABLE (1001); die anderen Fehler sind REQUESTS_DISABLED, REQUEST_FAILED, REQUEST_TIMEOUT und RESPONSE_TOO_LARGE.
- **Grenzen.** Die Datei `config/c0de_net.properties` des Servers legt `maxResponseSize` (Standard 1 MiB) und `maxRequestsPerPlayer` fest (Standard 8 gleichzeitig; weitere warten). Ein Spieler, der in `config/c0de_net-client.properties` `allowRequests=false` setzt, sendet keine Anfragen.
- **Geheimnisse stehen auf dem Blatt.** Jeder, der das Blatt lesen kann, kann ein Passwort oder Token im Programm lesen. Übergib sie als Parameter, aus einer Konstantenkarte im Auslöserblock.

## Unterschiede, über die du stolpern wirst

- Es gibt kein `json.loads`, das „irgendetwas“ zurückgibt. Deklariere zuerst den Typ; ein Dokument, das nicht passt, löst einen Fehler aus.
- FROM_JSON und FROM_YAML haben kein Ergebnis: Das Ziel ist eine Variable, die als Referenz übergeben wird.
- Fehlende Schlüssel leeren keine Elemente, sie behalten den aktuellen Wert. Arrays und Hashes werden ersetzt, nicht zusammengeführt.
- Unbekannte Schlüssel werden stillschweigend ignoriert – ein Tippfehler in einem Schlüssel des Dokuments ist kein Fehler.
- Ein Tag gehört zu einer Sprache. Eine Struktur, die aus JSON und YAML mit denselben Schlüsseln gelesen wird, braucht zwei Tags.
- Ein INTEGER liest kein `1.5`, und ein FLOAT kann weder Unendlich noch NaN schreiben.
- Ein Fehler lässt die ganze Variable unverändert, auch die Elemente, die ohne Problem gelesen wurden.
- HTTP-Anfragen kommen vom Computer eines Spielers und brauchen diesen Spieler online mit c0de net. Ein Status ab 400 ist ein Fehler, kein normales Ergebnis.

## Probier es selbst

1. Fange eine kaputte Konfiguration ab: Behalte die Standardwerte, gib den Fehlercode zurück und gib die Meldung aus.

::: details Lösung
<<< @/tutorials/programs/programmers/data-safe.c0de

Mit `{"title": "Steve's base", "color": "yellow"}` ist `code` 302 (TYPE_MISMATCH), und `title` bleibt `"My base"` – auch der gültige Titel wird nicht übernommen. Eine fehlende `}` ergibt 309 (INVALID_ARGUMENT). Vergleiche mit den Konstanten: `IF problem.code = TYPE_MISMATCH ;`.
:::

2. Lies die Konfiguration aus YAML, auch dort mit dem Schlüssel `close_after`, und gib sie als JSON zurück.

::: details Lösung
<<< @/tutorials/programs/programmers/data-yaml.c0de

Die Elemente bekommen neben dem `json`-Tag einen `yaml`-Tag. Mit dieser Quelle ist das Ergebnis `json` gleich `{"title":"Steve's base","color":14,"entrance":{"close_after":60,"friends":["Alex","Kai"]},"prices":{"apple":1,"diamond":5}}`:

```yaml
title: Steve's base
entrance:
  close_after: 60
  friends: [Alex, Kai]
prices:
  diamond: 5
  apple: 1
secret: x
```

:::

## Mehr dazu

- [JSON und YAML](/de/c0de/guide/libraries#json-und-yaml), [FROM_JSON](/de/c0de/strings/from_json), [TO_JSON](/de/c0de/strings/to_json), [FROM_YAML](/de/c0de/strings/from_yaml), [TO_YAML](/de/c0de/strings/to_yaml)
- [TAG](/de/c0de/reference/data#tag): Tags von Strukturelementen und Variablen
- [c0de_net/http](/de/c0de_net/http/): [Erste Schritte](/de/c0de_net/http/getting-started), [HTTP_CONNECTION](/de/c0de_net/http/http_connection), [HTTP_GET](/de/c0de_net/http/http_get), [Fehler](/de/c0de_net/http/errors)
