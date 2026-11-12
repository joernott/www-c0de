---
description: Ist mein c0de aktuell? Eine Anzeige, die die installierten Versionen von c0de und c0de net, C0DE_VERSION und C0DE_NET_VERSION, mit den neuesten Releases von c0de.at/api/version vergleicht.
---

# Ist mein c0de aktuell?

Eine Anzeige neben deinen Blättern, die dir sagt, ob eine neue Version von c0de oder c0de net erschienen ist. Das Programm fragt c0de.at nach den neuesten Releases und vergleicht sie mit den Versionen, die auf deinem Server installiert sind.

**Funktionen:** [HTTP_GET](/de/c0de_net/http/http_get) und [FROM_JSON](/de/c0de/strings/from_json) aus c0de/strings sowie die Konstanten `C0DE_VERSION` und `C0DE_NET_VERSION`

::: info Was du brauchst
Die Mod **c0de net** in deinem Spiel, einen Auslöserblock mit Knopf, eine **Anzeigewand** aus 2 × 1 Anzeigeblöcken und eine nicht initialisierte Variablenkarte.
:::

## Die Idee

Jedes Programm kennt die Versionen, auf denen es läuft: Die Konstante `C0DE_VERSION` enthält die Version von c0de als Text, etwa `"0.4.0"`, und c0de net fügt `C0DE_NET_VERSION` hinzu, etwa `"0.2.0"`. Sie brauchen kein INCLUDE.

Die neuesten veröffentlichten Versionen stehen im Web. c0de.at liest sie aus den Releases auf GitHub und beantwortet `https://c0de.at/api/version` mit einem kleinen JSON-Objekt:

```json
{ "c0de": "0.4.0", "c0de_net": "0.2.0" }
```

Das Programm braucht also ein GET, ein FROM_JSON und zwei Vergleiche. Die Anfrage kommt vom Computer des Spielers, der den Knopf drückt, und jeder Spieler kann Anfragen für seinen eigenen Computer abschalten. Die installierten Versionen sind dagegen die des Servers: Die Konstanten sagen, worauf das Blatt läuft.

## Das Programm

<<< @/tutorials/programs/libraries/http/up-to-date-check.c0de

## Aufbauen und starten

1. Baue die Anzeigewand und binde sie an `versioncheck` / `check`.
2. Stelle den Auslöserblock auf `versioncheck` / `check`, leg eine nicht initialisierte Variablenkarte hinein und drück den Knopf.

Ist alles aktuell, zeigt die Wand zwei grüne Zeilen, und das Ergebnis `current` ist `TRUE`:

```
c0de 0.4.0: up to date
c0de net 0.2.0: up to date
```

<!-- screenshot: up-to-date-wall | The display wall with the two green lines c0de 0.4.0: up to date and c0de net 0.2.0: up to date -->

Ist eine neue Version erschienen, ist ihre Zeile rot, etwa `c0de 0.3.1: 0.4.0 is out`, und `current` ist `FALSE`.

## So funktioniert es

- **Die Struktur ist die Antwort.** `releases` hat ein Element pro Schlüssel der Antwort. `c0de` ist ein gültiger Name, weil er mit einem Buchstaben beginnt. `c0de_net` wäre es auch, aber das Element heißt `net`, und `TAG(json: "c0de_net")` ordnet es dem Schlüssel zu.
- **`compare` macht die Arbeit zweimal.** Es bekommt einen Namen, die installierte und die neueste Version, gibt eine Zeile in Grün oder Rot aus und liefert, ob beide gleich sind. `=` vergleicht zwei Texte Zeichen für Zeichen.
- **Farben.** COLOR legt die Farbe des folgenden Textes fest; `compare` setzt sie am Ende auf Weiß zurück, damit die nächste Zeile sauber beginnt.
- **Beide müssen aktuell sein.** `current` aus dem ersten CALL und `netCurrent` aus dem zweiten werden mit AND verknüpft.
- **Fragen kostet wenig.** c0de.at fragt GitHub höchstens einmal pro Stunde und behält die Antwort dazwischen, also darfst du den Knopf so oft drücken, wie du willst. Ist GitHub nicht erreichbar und sind die Versionen unbekannt, ist die Antwort der Status 503, und der Prozess stürzt mit HTTP_STATUS ab.

## Probier es selbst

1. Eine Version, die nicht gleich der neuesten ist, ist nicht immer älter: Eine Testversion von c0de kann neuer sein als das neueste Release. Schreib eine Funktion, die sagt, ob eine Version älter ist als eine andere.

::: details Lösung
<<< @/tutorials/programs/libraries/http/up-to-date-order.c0de

`number` zerlegt die Version mit INSTR und MID an ihren Punkten, macht aus jedem Teil mit VAL eine Zahl und setzt sie zu einer Zahl zusammen: Aus `0.4.0` wird 4000, aus `0.10.0` wird 10000. Die Texte zu vergleichen, wäre hier falsch: `"0.10.0"` kommt im Alphabet vor `"0.9.0"`, aber 0.10.0 ist die neuere Version. Um sie in `versioncheck` zu nutzen, kopiere beide Funktionen über `compare` und rufe `outdated` auf, statt mit `=` zu vergleichen.
:::

2. Lass die Anzeige `can't check` zeigen, statt abzustürzen, wenn die Anfrage fehlschlägt.

::: details Lösung
Gib `check` eine Variable `problem` vom Typ ERROR und setz sie in die CALL-Zeile: `CALL c0de_net/http/HTTP_GET problem`. Prüfe gleich danach `IF problem.code ≠ 0 ;`, gib in seinem Block `can't check: ` mit `problem.message` aus und beende die Funktion mit RETURN. Ein Spieler ohne c0de net sieht dann `can't check: …` statt eines Absturzes; siehe [Wenn das Netz ausfällt](/de/tutorials/libraries/c0de_net/http/network-errors).
:::

## Mehr dazu

- [HTTP_GET](/de/c0de_net/http/http_get), [FROM_JSON](/de/c0de/strings/from_json) und [TAG](/de/c0de/reference/data#tag)
- [Erste Schritte](/de/c0de_net/http/getting-started) mit `C0DE_NET_VERSION` und [die Konstanten jedes Programms](/de/c0de/reference/data#constant)
- [COLOR](/de/c0de/reference/functions#color)
- Die Releases von [c0de](https://github.com/joernott/minecraft-c0de/releases) und [c0de net](https://github.com/joernott/minecraft-c0de-net/releases)
