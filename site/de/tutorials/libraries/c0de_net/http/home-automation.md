---
description: Ein Hebel in Minecraft schaltet eine echte Lampe zu Hause – HTTP_PUT an die Hausautomation, das Token in einer Konstantenkarte, und die Anfrage vorher am Echo von c0de.at ausprobiert.
---

# Hausautomation

Leg in deiner Basis einen Hebel um, und die Lampe in deiner echten Küche geht an; leg ihn zurück, und sie geht aus. Das Programm schickt den neuen Zustand der Lampe mit HTTP_PUT an deine Hausautomation. Ihr Token – das Passwort der Hausautomation – steht nicht auf dem Blatt, sondern kommt aus einer Konstantenkarte im Auslöserblock.

**Funktionen:** [HTTP_PUT](/de/c0de_net/http/http_put), [HTTP_CONNECTION](/de/c0de_net/http/http_connection), [TO_JSON](/de/c0de/strings/to_json) aus c0de/strings, [SLEEP](/de/c0de/time/sleep) aus c0de/time und [GET_LEVER](/de/c0de/minecraft/get_lever) aus c0de/minecraft

::: info Was du brauchst
Die Mod **c0de net** in deinem Spiel, eine Hausautomation mit HTTP-API in deinem Heimnetz und ein Token dafür, einen Auslöserblock mit einem **Hebel** obendrauf und eine **Konstantenkarte** `token` vom Typ STRING mit dem Token. Um die Anfrage vorher auszuprobieren: einen zweiten Auslöserblock mit Knopf und einen Laptop.
:::

## Die Idee

Die meisten Hausautomationen – eine Zentrale, eine Bridge, eine smarte Steckdose – lassen sich über HTTP schalten. Jede hat ihre eigene API, aber sie ähneln sich: eine Adresse in deinem Heimnetz, ein Endpunkt für die Lampe, der neue Zustand als JSON und ein Token im Header `Authorization`. Dieses Rezept nimmt eine ausgedachte Zentrale unter `homehub.local`, Port 8080, die `PUT /api/lamps/kitchen` mit `{"on":true}` versteht. Schlag die Adresse, den Endpunkt, die Daten und die Art des Tokens deines eigenen Systems in seiner Dokumentation nach und ändere das Programm entsprechend.

Zwei Dinge machen das möglich, und sicher:

- **Die Anfrage kommt von deinem Computer.** c0de net sendet sie vom Computer des Spielers, der den Hebel umlegt, nicht vom Minecraft-Server. Deshalb erreicht sie dein Heimnetz, wenn du zu Hause spielst – auch auf einem Server weit weg. Ein Freund, der den Hebel umlegt, sendet sie von seinem Computer, und dort gibt es `homehub.local` nicht. Jeder Spieler kann Anfragen für seinen eigenen Computer abschalten.
- **Das Token steht nicht auf dem Blatt.** Jeder, der das Blatt sieht, kann seine Literale lesen. Das Token kommt stattdessen in eine **Konstantenkarte**, die sich nicht mehr ändern lässt, sobald sie einen Wert hat, in einem Auslöserblock, den nur du ändern kannst.

## Das Programm

<<< @/tutorials/programs/libraries/http/home-automation-lamp.c0de

## Erst die Anfrage ausprobieren

Du siehst nicht, was deine Zentrale bekommt, und ein Fehler in den Daten bewirkt einfach nichts. Schick dieselbe Anfrage deshalb zuerst an das Echo von c0de.at, das mit der Anfrage antwortet, so wie sie angekommen ist:

<<< @/tutorials/programs/libraries/http/home-automation-preview.c0de

Binde den Laptop an `lamppreview` / `preview` und starte es mit einem Auslöserblock. Er zeigt:

```
PUT /api/tutorial/echo/lamps/kitchen
Authorization: Bearer test
Content-Type: application/json
{"on":true}
```

Nimm hier das Token `test`, nicht dein echtes: Das Echo zeigt alles, was es bekommt. Mit einer Variablenkarte `on` auf `FALSE` ist die letzte Zeile `{"on":false}`.

## Aufbauen und starten

1. Ändere die Adresse, den Port, den Endpunkt und die Daten von `send` auf die deiner Hausautomation.
2. Stelle den Auslöserblock auf `homelamp` / `switch` und setz den Hebel obendrauf.
3. Stelle eine Konstantenkarte her: Name `token`, Typ STRING, dein Token als Wert. Leg sie in das Eingabeinventar des Auslöserblocks. Stelle seinen Knopf **Starten durch** auf *Nur mich*.
4. Leg den Hebel um: Die Lampe zu Hause geht an. Leg ihn zurück: Nach einer halben Sekunde geht die Lampe aus.

<!-- screenshot: home-automation-lever | The trigger block with the lever on top, switched on, and the PID block of the running process on the sheet -->

## So funktioniert es

- **Der Hebel startet es.** Den Hebel einzuschalten, gibt dem Auslöserblock einen Redstone-Impuls, und der Block weiß, wer ihn umgelegt hat. Ausschalten startet nichts, also bleibt der Prozess am Leben, solange die Lampe an ist: Er fragt den Hebel alle 10 Ticks mit GET_LEVER ab und sendet „aus“, wenn der Hebel aus ist. Solange ist sein Blatt gesperrt.
- **Wo der Hebel ist.** `PID.x`, `PID.y` und `PID.z` sind die Position des Auslöserblocks, also ist der Hebel obendrauf bei `PID.y + 1`.
- **Die Daten.** `VARIABLE state BOOLEAN TAG(json: "on")` setzt den Wert an den Schlüssel `on`, also schreibt TO_JSON `{"on":true}` oder `{"on":false}`.
- **Die Verbindung.** `use_ssl` bleibt FALSE, weil die meisten Zentralen im Heimnetz einfaches http sprechen; `port` 8080 und `base_endpoint` `/api` ergänzen die Adresse zu `http://homehub.local:8080/api/lamps/kitchen`. Das Token kommt als `Bearer <token>` in den Header `Authorization`, der `user` und `password` ersetzt.
- **Das Token ist ein Parameter.** `switch` bekommt es aus der Konstantenkarte und gibt es an `send` weiter. Nichts Geheimes steht auf dem Blatt.
- **Wenn es fehlschlägt.** Ist die Zentrale nicht erreichbar, löst HTTP_PUT REQUEST_FAILED aus, und der Prozess stürzt ab; der Auslöserblock zeigt den Fehler. Die Anfrage „aus“ sendet der Spieler, der die Lampe eingeschaltet hat, also muss er noch online sein.

## Probier es selbst

1. Schalte mehrere Lampen mit demselben Programm.

::: details Lösung
Gib `switch` und `send` einen Parameter `lamp` STRING mit dem Standardwert `"kitchen"` und nimm den Endpunkt `"/lamps/" ⊕ lamp`. Jede Lampe bekommt ihren eigenen Auslöserblock mit Hebel und einer Variablenkarte `lamp`, etwa `garden`; die Konstantenkarte `token` ist für alle dieselbe.
:::

2. Ein Freund legt deinen Hebel um, während du online bist. Was passiert?

::: details Lösung
Mit *Nur mich* am Knopf **Starten durch**: nichts, der Auslöserblock startet nicht. Mit *Spieler* startet der Prozess und sendet die Anfrage vom Computer deines Freundes. Wenn er nicht in deinem Heimnetz ist, kennt sein Computer `homehub.local` nicht, und der Prozess stürzt mit REQUEST_FAILED (1003) ab. Deine Lampe und dein Token bleiben sicher.
:::

## Mehr dazu

- [HTTP_PUT](/de/c0de_net/http/http_put), [HTTP_CONNECTION](/de/c0de_net/http/http_connection) und das Beispiel [Eine Lampe schalten](/de/c0de_net/http/examples#eine-lampe-schalten)
- [Wie Anfragen gesendet werden](/de/c0de_net/http/getting-started#wie-anfragen-gesendet-werden)
- [Konstantenkarten](/de/c0de/guide/tools#konstantenkarten) und [Auslöserblock](/de/c0de/reference/triggers#auslöserblock)
- [GET_LEVER](/de/c0de/minecraft/get_lever) und [SLEEP](/de/c0de/time/sleep)
