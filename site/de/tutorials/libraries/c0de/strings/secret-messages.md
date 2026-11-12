---
description: Eine Caesar-Verschlüsselung auf einem Laptop – Buchstaben werden mit ASC zu Zahlen, verschoben und mit CHR wieder zu Buchstaben.
---

# Geheimbotschaften

Ein Laptop, der Nachrichten mit der Caesar-Verschlüsselung verschlüsselt: Jeder Buchstabe rückt im Alphabet ein paar Stellen weiter, mit dem Schlüssel 3 wird also aus `Meet me at the Nether portal!` die Nachricht `Phhw ph dw wkh Qhwkhu sruwdo!`. Dein Freund entschlüsselt sie mit demselben Schlüssel auf seinem Laptop.

**Funktionen:** [ASC](/de/c0de/strings/asc), [CHR](/de/c0de/strings/chr)

::: info Was du brauchst
Einen Auslöserblock mit Knopf und einen **Laptop**. Das Programm hat keine Parameter und keine Ergebnisse.
:::

## Die Idee

Für einen Computer ist ein Zeichen eine Zahl: sein **Codepunkt**. ASC liefert den Codepunkt eines Zeichens, CHR das Zeichen zu einem Codepunkt. Die Großbuchstaben `A` bis `Z` sind 65 bis 90, die Kleinbuchstaben `a` bis `z` 97 bis 122, einer nach dem anderen.

Einen Buchstaben um 3 weiterzurücken ist also Rechnen: Zieh den Code von `A` ab, um seine Stelle im Alphabet zu bekommen (0 bis 25), zähle 3 dazu, nimm den Rest der Division durch 26, damit `Z` wieder bei `C` landet, und zähle den Code von `A` wieder dazu. Alles, was kein Buchstabe ist – Leerzeichen, Ziffern, `!` –, bleibt, wie es ist. Entschlüsseln geht genauso mit dem umgedrehten Schlüssel: -3.

## Das Programm

<<< @/tutorials/programs/libraries/strings/secret-messages-caesar.c0de

## So baust und startest du es

1. Platziere den Laptop, klicke ihn mit rechts an, klicke die Knöpfe, bis sie `caesar` und `laptop` zeigen, und klicke auf ✔.
2. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein und drücke den Knopf.
3. Öffne den Laptop. Tippe `Meet me at the Nether portal!` in die Eingabezeile und drücke Enter, dann den Schlüssel `3`.

Der Bildschirm zeigt:

```
Message?
Meet me at the Nether portal!
Key?
3
Secret: Phhw ph dw wkh Qhwkhu sruwdo!
Decoded: Meet me at the Nether portal!
```

<!-- screenshot: secret-messages-laptop | the terminal of the laptop after the run: the typed message and key, the secret text and the decoded message -->

Um eine Nachricht von einem Freund zu lesen, starte das Programm noch einmal und tippe den geheimen Text und den Schlüssel mit Minus: `Phhw ph dw wkh Qhwkhu sruwdo!` und `-3` ergeben `Secret: Meet me at the Nether portal!`.

Der Cursor rückt pro Tick eine Zeile weiter und läuft für jedes Zeichen durch `shiftLetter`, eine Nachricht mit 30 Zeichen braucht also etwa 20 Sekunden pro Richtung. Sieh dem Cursor auf dem Blatt zu, wie er durch die Schleife läuft.

## So funktioniert es

- `encode` geht mit FOR von 0 bis `length - 1` durch den Text. `text[i]` liest ein Zeichen eines STRING als CHAR, und `result ⊕ letter` hängt das verschobene Zeichen ans Ende des Ergebnisses.
- `shiftLetter` setzt `result` zuerst auf den Buchstaben selbst, alles, was kein Buchstabe ist, kommt also unverändert zurück.
- ASC liefert den Code. Die beiden IFs setzen `first` für einen Großbuchstaben auf 65 und für einen Kleinbuchstaben auf 97; für alles andere bleibt es 0.
- CHR macht aus dem verschobenen Code wieder ein CHAR. Der Code darin ist `first + ( code - first + key \ 26 + 26 ) \ 26`: `\` ist der Rest. `key \ 26` bringt jeden Schlüssel in den Bereich -25 bis 25, und das `+ 26` macht die Summe positiv, denn der Rest einer negativen Zahl ist in c0de negativ (`-7 \ 26` ist -7). So wirkt der Schlüssel -3 wie 23 und 29 wie 3.
- `laptop` verschlüsselt die Nachricht und entschlüsselt das Geheimnis dann mit `- key`, damit du siehst, dass der Rückweg funktioniert.

## Probier es selbst

1. ROT13 ist die Caesar-Verschlüsselung mit dem Schlüssel 13. Was ist das Besondere daran? Probier `Uryyb Fgrir` mit dem Schlüssel 13.

::: details Lösung
Das Programm schreibt `Secret: Hello Steve`. 13 ist die Hälfte von 26, darum ver- und entschlüsselt der Schlüssel 13 zugleich: Zweimal derselbe Schlüssel bringt jeden Buchstaben an seine Stelle zurück, und `Decoded` ist wieder `Uryyb Fgrir`.
:::

2. Versteck auch Zahlen: Verschiebe die Ziffern `0` bis `9` (Codepunkte 48 bis 57) um den Schlüssel, damit die Koordinaten deiner Basis geheim bleiben.

::: details Lösung
<<< @/tutorials/programs/libraries/strings/secret-messages-digits.c0de

Ein drittes IF macht dasselbe für Ziffern, mit 10 statt 26. Mit dem Schlüssel 3 wird aus `Base at 120 64 -300` der Text `Edvh dw 453 97 -633`, und der Schlüssel -3 bringt ihn zurück.
:::

## Mehr dazu

- [c0de/strings](/de/c0de/strings/): [ASC](/de/c0de/strings/asc), [CHR](/de/c0de/strings/chr)
- [Typen](/de/c0de/guide/language#typen): CHAR und STRING; [TYPE_STRING](/de/c0de/reference/data#type_string): ein Zeichen mit einem Index lesen
- [Operatoren](/de/c0de/guide/language#operatoren): `\`, der Rest
- [Der Cursor](/de/c0de/guide/running-programs#der-cursor): eine Zeile pro Tick
