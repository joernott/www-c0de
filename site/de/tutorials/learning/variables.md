---
description: Das Begrüßungsschild zeigt den Namen deiner Basis aus einer Konstanten und das Jahr aus einer Variablen – Kisten mit Namen für Werte.
---

# Dinge merken: Variablen

Deine Basis hat einen Namen: Oak Hill. Heute sagt das Schild „Welcome to Oak Hill!“ und darunter das Jahr, in dem du die Basis gegründet hast. Beide Werte bekommen im Programm einen Namen, so kannst du sie an einer Stelle ändern.

::: tip Neue Wörter

- **Wert**: ein Stück Daten, zum Beispiel die Zahl 2026 oder der Text „Oak Hill“.
- **Variable**: eine Kiste mit einem Namen, die einen Wert enthält. Du kannst jederzeit einen neuen Wert hineinlegen.
- **Konstante**: eine Kiste mit einem Namen, deren Wert feststeht. Er ändert sich nie, solange das Programm läuft.
- **Typ**: die Art von Wert, die eine Kiste aufnimmt, zum Beispiel ganze Zahlen (INTEGER) oder Text (STRING).
  :::

::: info Was du brauchst
Das Schild aus der letzten Lektion. Sprachblöcke: CONSTANT, VARIABLE, ASSIGN, NOOP, LABEL, LITERAL, OPERATOR, einen STRING- und einen INTEGER-Typblock, und den Hammer.
:::

## Die Idee

Denk an die Truhen in deinem Lagerraum. An jeder hängt ein Schild: „Bruchstein“, „Holz“, „Essen“. Du musst dir nicht merken, was in welcher Truhe ist; du suchst nach dem Namen.

Eine **Variable** ist so eine Truhe in deinem Programm. Sie hat einen Namen und enthält einen **Wert**. Wenn das Programm den Wert braucht, verwendet es den Namen. Du kannst jederzeit einen neuen Wert hineinlegen; der alte ist dann weg.

Eine **Konstante** ist eine Truhe, die verschlossen wird, sobald sie gefüllt ist. Ihr Wert wird festgelegt, wenn du das Programm baust, und bleibt gleich.

Truhen in Minecraft nehmen jeden Gegenstand. Kisten in c0de nicht: Jede hat einen **Typ** und nimmt nur Werte dieses Typs. Eine Kiste für ganze Zahlen (INTEGER) kann keinen Text (STRING) aufnehmen, so wie der Brennstoffplatz eines Ofens kein Schwert nimmt.

## Das Programm

Das Programm bleibt auf demselben Blatt und ersetzt das farbige Schild.

<<< @/tutorials/programs/learning/variables-sign.c0de

## So baust du es

Das Programm wird länger, darum stehen hier nur die neuen und geänderten Zeilen. Füge mit dem Hammer leere Zeilen ein (Rechtsklick auf eine Zeile), wie in der letzten Lektion.

- Zeile 2: ein CONSTANT-Block bei x=5, ein LABEL `BASE`, ein STRING-Typblock und ein LITERAL vom Typ STRING mit dem Text `Oak Hill`.
- Zeile 3: ein CONSTANT-Block, ein LABEL `FRAME`, ein STRING-Typblock und ein LITERAL mit 32 Gleichheitszeichen.
- Zeile 4: das NOOP, das bisher Zeile 2 war. Die FUNCTION, jetzt in Zeile 5, braucht es weiterhin direkt über sich.
- Zeile 7: ein VARIABLE-Block bei x=6, ein LABEL `year` und ein INTEGER-Typblock.
- Zeile 8: ein ASSIGN-Block bei x=6, ein LABEL `year`, ein LITERAL 2026 vom Typ INTEGER und ein OPERATOR `;`.
- Zeilen 13 und 34: Ersetze das LITERAL mit den Gleichheitszeichen durch ein LABEL `FRAME`.
- Zeile 21: ein PARAMETER `value`, dann ein LITERAL `Welcome to ` (mit einem Leerzeichen am Ende), ein OPERATOR `⊕`, ein LABEL `BASE`, ein OPERATOR `⊕`, ein LITERAL `!` vom Typ STRING und ein OPERATOR `;`.
- Zeilen 22 bis 24: ein CALL `LOCATE` mit `row` 4 und `column` 8.
- Zeilen 25 und 26: ein CALL `COLOR` mit `foreground` `COLOR_WHITE`.
- Zeilen 27 und 28: ein CALL `PRINT` mit dem `value` `"Founded in " ⊕ year ;`.

<!-- screenshot: variables-sign | the top of the program "sign" on its sheet, seen from above: the CONSTANT lines, the VARIABLE and ASSIGN lines inside the function -->

## Starten

Drück den Knopf am Eingang. Die Wand zeigt:

```text
================================


      Welcome to Oak Hill!
        Founded in 2026

================================
```

<!-- screenshot: variables-result | the display wall at the entrance showing "Welcome to Oak Hill!" in yellow on blue and "Founded in 2026" in white, between the gold lines -->

## So funktioniert es

- `CONSTANT BASE STRING "Oak Hill"` macht eine Konstante mit dem Namen `BASE`, vom Typ STRING (Text), mit dem Wert „Oak Hill“. Sie steht bei x=5, außerhalb der Funktion, also kann das ganze Programm sie verwenden. Konstanten schreibt man meist in Großbuchstaben, damit man sie von Variablen unterscheiden kann.
- `CONSTANT FRAME …` enthält die Linie aus Gleichheitszeichen. Das Programm verwendet sie zweimal. Willst du stattdessen eine Linie aus Sternen, änderst du sie nur an einer Stelle.
- `VARIABLE year INTEGER` macht eine Variable mit dem Namen `year`, die ganze Zahlen enthält. Sie beginnt mit 0.
- `ASSIGN year 2026 ;` legt den Wert 2026 hinein. ASSIGN heißt „speichere“. Das `;` beendet den Wert, wie in einer PARAMETER-Zeile.
- `"Welcome to " ⊕ BASE ⊕ "!"` baut einen Text aus drei Teilen. `⊕` fügt Werte zu Text zusammen: den Text „Welcome to “, den Wert der Konstanten `BASE` und ein Ausrufezeichen.
- `"Founded in " ⊕ year` fügt einen Text und eine Zahl zusammen. `⊕` macht aus der Zahl Text: „Founded in 2026“.

Das Programm gibt nicht das Wort „year“ aus. Es gibt den Wert in der Kiste mit diesem Namen aus. Das ist der ganze Trick von Variablen.

## Probier es selbst

1. Du hast deine Basis ein Jahr später gegründet. Ändere das Jahr und sieh zu, wie sich das Schild ändert.

::: details Lösung
Klicke das LITERAL in Zeile 8 mit leerer Hand mit rechts an und gib 2027 ein. Drück den Knopf: Das Schild sagt „Founded in 2027“. Nur ein Block hat sich geändert; die PRINT-Zeile bleibt gleich, weil sie den Namen `year` verwendet.
:::

2. Versuch, der Basis in der Funktion einen neuen Namen zu geben: Füge nach Zeile 8 die Zeile `ASSIGN BASE "Stone Hill" ;` ein. Was passiert?

::: details Lösung
Die Zeilennummer wird dunkelrot. Eine Konstante kann nicht geändert werden. Das Debugging-Werkzeug, mit rechts auf die Zeile geklickt, sagt es dir: Die Konstante `BASE` kann nicht geändert werden. Um die Basis umzubenennen, ändere stattdessen das LITERAL in Zeile 2, und entferne die neue Zeile wieder.
:::

3. Ändere in Zeile 8 den Typ des LITERALs auf STRING, sodass es den Text "2026" statt der Zahl 2026 enthält. Drück den Knopf. Was passiert?

::: details Lösung
Der Auslöserblock spielt einen tiefen Ton, und das Schild ändert sich nicht: Das Programm ist in Zeile 8 **abgestürzt**, bevor es den Bildschirm gelöscht hat. Sein Dialog zeigt den Fehler TYPE_MISMATCH: Ein STRING passt nicht in einen INTEGER. Die Kiste `year` nimmt nur ganze Zahlen, und "2026" in Anführungszeichen ist Text, auch wenn es wie eine Zahl aussieht. Stell den Typ wieder auf INTEGER.
:::

## Mehr dazu

- [Variablen und Konstanten](/de/c0de/guide/language#variablen-und-konstanten) und [Typen](/de/c0de/guide/language#typen) in der Anleitung
- [ASSIGN](/de/c0de/guide/language#assign) und der Operator [⊕](/de/c0de/guide/language#operatoren)
- [VARIABLE](/de/c0de/reference/data#variable) und [CONSTANT](/de/c0de/reference/data#constant) im Handbuch
