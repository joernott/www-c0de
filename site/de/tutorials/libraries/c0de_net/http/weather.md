---
description: Das aktuelle Wetter einer beliebigen Stadt auf einer Anzeigewand – zwei Anfragen an die kostenlose Open-Meteo-API mit HTTP_GET, mit FROM_JSON in Strukturen gelesen.
---

# Daten aus dem Web lesen

Eine Wetterstation für deine Basis: Gib den Namen einer Stadt ein, drück den Knopf, und eine Anzeigewand zeigt den Himmel, die Temperatur und den Wind dort, genau jetzt. Die Daten kommen von [Open-Meteo](https://open-meteo.com/), einem kostenlosen Wetterdienst, der weder ein Konto noch einen Schlüssel braucht.

**Funktionen:** [HTTP_CONNECTION](/de/c0de_net/http/http_connection), [HTTP_GET](/de/c0de_net/http/http_get) und [FROM_JSON](/de/c0de/strings/from_json) aus c0de/strings

::: info Was du brauchst
Die Mod **c0de net** in deinem Spiel, einen Auslöserblock mit Knopf, eine **Anzeigewand** aus 2 × 1 Anzeigeblöcken (32 Spalten und 8 Zeilen), eine nicht initialisierte Variablenkarte und wahlweise eine **Variablenkarte** `city` vom Typ STRING mit dem Namen einer Stadt, zum Beispiel `Berlin`. Ohne sie zeigt das Programm Wien.
:::

## Die Idee

Eine Web-API ist eine Webseite für Programme: Statt mit HTML antwortet sie mit JSON. Open-Meteo hat zwei davon. Die Geocoding-API macht aus einem Namen einen Ort mit seinen Koordinaten, und die Vorhersage-API nennt das Wetter an Koordinaten. Das Programm fragt also zweimal: zuerst „Wo liegt Berlin?“, dann „Wie ist das Wetter bei 52.52, 13.41?“.

c0de_net/http sendet die Anfragen. Eine Struktur [HTTP_CONNECTION](/de/c0de_net/http/http_connection) sagt, welcher Server gefragt wird und wie; [HTTP_GET](/de/c0de_net/http/http_get) fragt nach einem Endpunkt, einem Pfad mit Abfrage, und gibt die Antwort als Text zurück. [FROM_JSON](/de/c0de/strings/from_json) liest diesen Text in Variablen deiner eigenen Typen. Du deklarierst nur die Teile der Antwort, die du brauchst; den Rest ignoriert FROM_JSON.

Die Anfragen kommen nicht vom Minecraft-Server, sondern vom Computer des Spielers, der den Knopf drückt, und dort muss c0de net installiert sein. Jeder Spieler kann das für seinen eigenen Computer abschalten.

## Das Programm

<<< @/tutorials/programs/libraries/http/weather-wall.c0de

## Aufbauen und starten

1. Baue die Anzeigewand aus zwei Anzeigeblöcken nebeneinander. Klicke einen davon mit rechts an, klicke die Knöpfe, bis sie `weatherwall` und `show` zeigen, und klicke auf ✔.
2. Stelle den Auslöserblock auf das Programm `weatherwall` und die Funktion `show`. Leg eine nicht initialisierte Variablenkarte in sein Eingabeinventar, und die Karte `city`, wenn du eine andere Stadt als Wien willst.
3. Drück den Knopf. Nach einem Moment zeigt die Wand:

```
Vienna, Austria

Cloudy
6.2 °C
Wind 7.7 km/h
```

<!-- screenshot: weather-wall | The display wall showing Vienna, Austria, the sky, the temperature and the wind -->

Die Ergebniskarte `found` ist `TRUE`. Für einen Namen, den Open-Meteo nicht kennt, etwa `Xyzzyqx`, zeigt die Wand `No city called Xyzzyqx`, und `found` ist `FALSE`.

## So funktioniert es

- **Eine Verbindung, zwei Server.** `api` wird einmal eingerichtet: `use_ssl` für https, ein `timeout` von 10 Sekunden statt 60. Für die zweite Anfrage ändert sich nur `server`. Der Endpunkt ist alles hinter dem Servernamen, auch die Abfrage nach dem `?`.
- **Die Geocoding-Antwort** sieht aus wie `{"results": [{"name": "Vienna", "latitude": 48.20849, "longitude": 16.37208, "country": "Austria", …}]}`, mit vielen weiteren Schlüsseln. Die Struktur `search` hat das eine Element `results`, ein Array aus `place`, und `place` hat nur die vier Elemente, die das Programm braucht.
- **Kein Treffer ist kein Fehler.** Für eine unbekannte Stadt hat die Antwort gar kein `results`. FROM_JSON behält dann den Startwert des Elements, ein leeres Array, und LEN sagt 0. (Ein Tag in einer VARIABLE-Zeile, wie `TAG(json: "results")`, würde stattdessen UNKNOWN_KEY auslösen.)
- **Tags benennen um.** Die Vorhersage nennt ihre Werte `temperature_2m`, `wind_speed_10m` und `weather_code`. Die Tags in der Struktur `weather` bilden sie auf kürzere Namen ab. Der Tag in `VARIABLE now STRUCT weather TAG(json: "current")` ist ein Pfad: FROM_JSON liest nur das Objekt `current` der Antwort.
- **Zahlen in den Endpunkt.** `⊕` macht aus den Koordinaten Text, so wird der Endpunkt zu `/v1/forecast?latitude=48.20849&longitude=16.37208&current=…`.
- **Der Wettercode** ist eine Zahl der WMO: 0 ist ein klarer Himmel, 1 bis 3 Wolken, 45 Nebel, 51 bis 67 Regen, 71 bis 77 Schnee, 80 bis 82 Schauer, ab 95 Gewitter. `sky` prüft die Grenzen von unten nach oben, also gewinnt die letzte, die passt.
- **Fehler.** Hat der Spieler kein c0de net oder antwortet Open-Meteo nicht, löst der CALL einen Fehler von c0de net aus, und der Prozess stürzt ab; der Auslöserblock zeigt ihn an. [Wenn das Netz ausfällt](/de/tutorials/libraries/c0de_net/http/network-errors) zeigt, wie du sie abfängst.

## Probier es selbst

1. Zeige die niedrigste und die höchste Temperatur von morgen in Wien. Open-Meteo liefert Tageswerte mit `daily=temperature_2m_min,temperature_2m_max`.

::: details Lösung
<<< @/tutorials/programs/libraries/http/weather-tomorrow.c0de

`forecast_days=2` fragt nach heute und morgen, und jeder Tageswert kommt als Array mit einer Zahl pro Tag: `{"daily": {"temperature_2m_min": [3.1, 4.0], …}}`. Die Tags in den VARIABLE-Zeilen sind Pfade in die Antwort; Index 1 ist morgen. Eine Antwort lässt sich zweimal lesen, in verschiedene Variablen.
:::

2. Halte die Wand aktuell, ohne den Knopf zu drücken.

::: details Lösung
Nimm statt des Auslöserblocks einen **Zeitgeberblock** mit demselben Programm, derselben Funktion und einem Abstand von 18000 Ticks (15 Minuten; Open-Meteo aktualisiert seine aktuellen Werte alle 15 Minuten). Den Prozess eines Zeitgeberblocks startet niemand, also kommen die Anfragen vom Besitzer des Zeitgeberblocks, der online sein muss. Jede Sekunde zu fragen, brächte nichts und belastete nur den kostenlosen Dienst.
:::

3. Probier die Stadt `New York`. Was passiert, und wie behebst du es?

::: details Lösung
Der Prozess stürzt mit INVALID_ARGUMENT ab: `Not a valid URL … (Illegal character in query)`. Eine URL darf keine Leerzeichen enthalten. Schreib die Stadt als `New+York`; in einer Abfrage steht `+` für ein Leerzeichen.
:::

## Mehr dazu

- [c0de_net/http](/de/c0de_net/http/): [Erste Schritte](/de/c0de_net/http/getting-started), [HTTP_CONNECTION](/de/c0de_net/http/http_connection), [HTTP_GET](/de/c0de_net/http/http_get), [Fehler](/de/c0de_net/http/errors)
- [FROM_JSON](/de/c0de/strings/from_json) und [JSON und YAML](/de/c0de/guide/libraries#json-und-yaml)
- [Daten und das Netzwerk](/de/tutorials/programmers/data): Typen, Tags und FROM_JSON im Detail
- [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock) und [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock)
- Die [Dokumentation von Open-Meteo](https://open-meteo.com/en/docs) nennt alle Werte, die die Vorhersage liefern kann
