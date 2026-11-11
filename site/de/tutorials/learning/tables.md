---
description: Ein Laden auf dem Laptop, der den Preis eines Gegenstands über seinen Namen findet, und ein Angebot des Tages aus Werten, die zusammengehören.
---

# Tabellen und eigene Typen

Oak Hill eröffnet einen Laden. Besucher tippen den Namen eines Gegenstands am Laptop, und der Laden nennt ihnen den Preis. Eine Liste aus der letzten Lektion hilft hier nicht: Du müsstest dir merken, dass der Sattel die Nummer 2 ist. Heute lernst du eine **Tabelle** kennen, die einen Wert über seinen Namen findet. Und das Angebot des Tages bekommt einen **eigenen Typ**, der den Gegenstand, seinen Preis und seinen Vorrat zusammenhält.

::: tip Neue Wörter

- **Tabelle** (in c0de: HASH): Werte, die unter Namen gespeichert sind, wie die Preise in einer Preisliste.
- **Schlüssel**: der Name, unter dem ein Wert in einer Tabelle gespeichert ist, zum Beispiel „bread“.
- **Struktur** (in c0de: STRUCT): dein eigener Typ, der Werte zusammenfasst, die zusammengehören, jeder mit seinem eigenen Namen.
  :::

::: info Was du brauchst

- den Laptop deiner Basis mit einem Auslöserblock und einem Knopf daneben
- ein neues, leeres Blatt in der c0de-Dimension
- aus dem Kreativinventar: die Blöcke, die du kennst, und die neuen Typblöcke **HASH** und **STRUCT**
  :::

## Die Idee

Schau dir die Preisliste an der Wand eines Marktstands an:

| Gegenstand | Preis |
| ---------- | ----- |
| bread      | 2     |
| torch      | 1     |
| saddle     | 12    |
| diamond    | 50    |

Niemand liest sie von oben, um den Sattel zu finden. Du suchst den Namen, und daneben steht der Preis. Eine **Tabelle** in einem Programm funktioniert so: Jeder Wert hat einen Namen, seinen **Schlüssel**. Du fragst nach dem Schlüssel „saddle“ und bekommst 12. In c0de heißt so eine Tabelle **HASH**.

Der Stand hat auch ein Schild für das Angebot des Tages: „golden apple, 20 Smaragde, nur noch 3“. Drei Werte, die zusammengehören. Du könntest sie in drei Variablen aufbewahren, aber eigentlich sind sie eine Sache: ein Angebot. Eine **Struktur** ist ein Typ, den du für so eine Sache selbst machst. Du gibst ihr einen Namen, `offer`, und sagst, was jedes Angebot hat: einen Gegenstand `item`, einen Preis `price` und einen Vorrat `stock`.

## Das Programm

Das Programm `shop` kommt auf ein neues Blatt.

<<< @/tutorials/programs/learning/tables-shop.c0de

<!-- screenshot: tables-shop-sheet | the program shop on its sheet, seen from above, with the STRUCT offer declaration at the top and the two VARIABLE blocks with their start values (the price table and the offer) below -->

## So baust du es

Die neuen Teile:

- Zeilen 2 bis 7: der Strukturtyp. Ein **STRUCT**-Block bei x=5 und ein LABEL `offer`, dann BEGIN bei x=5, drei Elementzeilen bei x=6 (ein LABEL `item` und ein STRING-Typblock, ein LABEL `price` und ein INTEGER-Typblock, ein LABEL `stock` und ein INTEGER-Typblock) und ein END-Block bei x=5, gefolgt von einem STRUCT-Block.
- Zeile 8: eine NOOP-Zeile, weil die FUNCTION folgt.
- Zeile 11: ein VARIABLE-Block bei x=6, ein LABEL `price`, ein **HASH**-Typblock und ein INTEGER-Typblock: eine Tabelle aus ganzen Zahlen.
- Zeilen 12 bis 17: die Startwerte der Tabelle: BEGIN bei x=6, vier Zeilen bei x=7, jede mit einem LABEL für den Schlüssel und einem LITERAL für den Wert (`bread` und 2, `torch` und 1 …), und ein END-Block bei x=6, gefolgt von einem VARIABLE-Block.
- Zeile 18: ein VARIABLE-Block bei x=6, ein LABEL `today`, ein STRUCT-Block und ein LABEL `offer`.
- Zeilen 19 bis 23: die Startwerte des Angebots, gebaut wie die Tabelle: ein LABEL mit dem Namen des Elements und ein LITERAL mit seinem Wert.
- Zeile 27: in der PARAMETER-Zeile die LABELs `today.item` und `today.price`. Im LABEL-Dialog ist `today` der Name und `.item` der Index.
- Zeile 35: das LABEL `price[wanted]`, mit dem Namen `price` und dem Index `[wanted]`.

Schlüssel und Elementnamen sind LABEL-Blöcke, also folgen sie den Regeln für Namen: Buchstaben, Ziffern und der Unterstrich, keine Leerzeichen.

## Starten

Binde den Laptop an das Programm `shop` und die Funktion `prices` und stelle den Auslöserblock genauso ein. Drück den Knopf und öffne den Laptop:

```
Offer: golden apple for 20 emeralds
Only 3 left!
What do you want to buy?
```

Tippe saddle und drück Enter. Der Laptop antwortet „saddle costs 12 emeralds.“, und das Programm endet. Drück den Knopf noch einmal für den nächsten Kunden.

<!-- screenshot: tables-shop-laptop | the laptop terminal showing the offer of the day, the question, the typed word saddle and the answer "saddle costs 12 emeralds." -->

Probier jetzt cake. Das Programm stürzt ab: Der Auslöserblock spielt einen tiefen Ton, und sein Dialog zeigt den Fehler UNKNOWN_KEY. Die Tabelle hat keinen Schlüssel „cake“. Aufgabe 2 behebt das.

## So funktioniert es

Die Struktur:

- `STRUCT offer` deklariert einen neuen Typ namens `offer`. Er steht bei x=5, außerhalb aller Funktionen, also kann das ganze Programm ihn verwenden. Wie eine Funktion muss er über den Zeilen stehen, die ihn verwenden.
- `VARIABLE today STRUCT offer` macht eine Variable dieses Typs. Sie hat drei Elemente, und der Codeblock darunter gibt jedem davon einen Startwert.
- `today.item` liest ein Element: Der Punkt sagt „das Element `item` von `today`“. `today.price` ist 20, `today.stock` ist 3.

Die Tabelle:

- `VARIABLE price HASH INTEGER` macht eine Tabelle, deren Werte INTEGER sind. Die Schlüssel sind immer Texte.
- `price[wanted]` schlägt den Wert unter dem Schlüssel in `wanted` nach. Hast du saddle getippt, ist das `price["saddle"]`, und die Antwort ist 12.
- Ein Schlüssel, der nicht in der Tabelle ist, ist ein Fehler: UNKNOWN_KEY. Das Programm stürzt in Zeile 34 ab, dem CALL PRINT, das `price[wanted]` braucht.
- `ASSIGN price["cake"] 5 ;` würde einen neuen Schlüssel in die Tabelle einfügen oder den Preis ändern, wenn es den Schlüssel schon gibt. Eine Tabelle wächst von selbst, wie eine Liste.

Eine Tabelle und eine Liste sehen sich ähnlich, aber du findest ihre Werte unterschiedlich: in einer Liste über die Position (0, 1, 2 …), in einer Tabelle über den Namen. EACH funktioniert auch mit Tabellen: Es geht die Schlüssel in alphabetischer Reihenfolge durch.

## Probier es selbst

1. Gib dem Angebot einen Rabatt: ein neues Element `discount` mit dem Wert 5. Zeige den Preis abzüglich des Rabatts und wie viel der Kunde spart.

::: details Lösung
Die Struktur bekommt ein viertes Element und das Angebot einen vierten Startwert. Der Preis wird in der PARAMETER-Zeile berechnet: `-` kommt vor `⊕`.

<<< @/tutorials/programs/learning/tables-shop-discount.c0de

Der Laptop zeigt „Offer: golden apple for 15 emeralds“ und „You save 5! Only 3 left!“.
:::

2. Stürze bei unbekannten Gegenständen nicht ab: Antworte stattdessen „Sorry, we don't sell cake.“.

::: details Lösung
Die eingebaute Funktion **HAS_KEY** fragt, ob eine Tabelle einen Schlüssel hat. Ihr Ergebnis ist ein BOOLEAN, das ein IF verwenden kann.

<<< @/tutorials/programs/learning/tables-shop-unknown.c0de

Bei cake antwortet der Laptop „Sorry, we don't sell cake.“. Bei diamond antwortet er „diamond costs 50 emeralds.“.
:::

## Mehr dazu

- [Typen](/de/c0de/guide/language#typen), [Variablen und Konstanten](/de/c0de/guide/language#variablen-und-konstanten) und [Strukturen](/de/c0de/guide/language#strukturen) in der Anleitung
- [TYPE_HASH](/de/c0de/reference/data#type_hash) und [TYPE_STRUCT](/de/c0de/reference/data#type_struct) im Handbuch Daten
- [HAS_KEY](/de/c0de/reference/functions#has_key) im Handbuch Funktionen
- [Abstürze](/de/c0de/guide/running-programs#abstürze): was der Auslöserblock zeigt, wenn ein Programm abstürzt
