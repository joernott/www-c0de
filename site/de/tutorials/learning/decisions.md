---
description: Ein Türwächter auf der Anzeigewand begrüßt dich mit Namen und sagt allen anderen, dass die Basis geschlossen ist – dein erstes Programm, das eine Entscheidung trifft.
---

# Entscheidungen treffen

Bisher haben deine Programme jedes Mal dasselbe getan. Heute wird das Willkommensschild von Oak Hill klüger: Es wird zum **Türwächter**. Wenn du den Knopf am Eingang drückst, begrüßt es dich mit deinem Namen. Wenn jemand anderes ihn drückt, sagt es ihm, dass die Basis geschlossen ist.

::: tip Neue Wörter

- **Bedingung**: eine Frage, die der Computer mit wahr oder falsch beantwortet, zum Beispiel „Ist der Besucher der Besitzer?“.
- **BOOLEAN**: der Typ eines Werts, der entweder wahr oder falsch ist.
- **IF und ELSE**: „wenn die Bedingung wahr ist, tu das; sonst tu jenes“.
  :::

::: info Was du brauchst

- deine Anzeigewand aus 2 × 1 Anzeigeblöcken neben dem Eingang und daneben einen Auslöserblock mit einem Knopf
- ein neues, leeres Blatt in der c0de-Dimension und den Schraubenschlüssel
- aus dem Kreativinventar: die Blöcke, die du kennst (PROGRAM, NOOP, CONSTANT, FUNCTION, BEGIN, END, VARIABLE, ASSIGN, CALL, PARAMETER, LABEL, LITERAL, OPERATOR, den Typblock STRING) und die neuen: einen **IF**-Block, einen **ELSE**-Block und einen **BOOLEAN**-Typblock
  :::

## Die Idee

Stell dir eine Wache am Tor einer Burg vor. Jedes Mal, wenn jemand klopft, stellt die Wache eine einzige Frage: „Ist das der König?“ Wenn die Antwort Ja ist, öffnet die Wache das Tor. Wenn die Antwort Nein ist, sagt die Wache: „Tut mir leid, geschlossen.“

Ein Programm kann dasselbe. Es stellt eine Frage, deren Antwort **wahr** oder **falsch** ist. Diese Frage ist eine **Bedingung**. Je nach Antwort geht das Programm einen von zwei Wegen. Nur einer davon läuft, nie beide.

Um Fragen zu stellen, vergleichst du Werte:

| Zeichen | Fragt                | Beispiel | Antwort |
| ------- | -------------------- | -------- | ------- |
| `=`     | gleich?              | `3 = 3`  | wahr    |
| `≠`     | ungleich?            | `3 ≠ 3`  | falsch  |
| `<`     | kleiner?             | `2 < 5`  | wahr    |
| `>`     | größer?              | `2 > 5`  | falsch  |
| `≤`     | kleiner oder gleich? | `3 ≤ 3`  | wahr    |
| `≥`     | größer oder gleich?  | `2 ≥ 3`  | falsch  |

## Das Programm

Der Wächter ist ein neues Programm namens `guard`. Es kommt auf ein neues Blatt, damit dein Schild bleibt, wie es ist.

<<< @/tutorials/programs/learning/decisions-guard.c0de

<!-- screenshot: decisions-guard-sheet | the program guard on its sheet in the c0de dimension, seen from above at the south end, with the IF and ELSE lines in the middle and all line numbers dark green -->

## So baust du es

Die ersten Zeilen sind wie die, die du kennst. Neu sind die BOOLEAN-Variable und die Zeilen mit IF und ELSE:

- Zeile 7: ein VARIABLE-Block bei x=6, ein LABEL `isOwner` und ein **BOOLEAN**-Typblock. Ein neues BOOLEAN enthält falsch.
- Zeile 8: ein ASSIGN-Block bei x=6, ein LABEL `visitor`, ein LABEL `PID.activator` und ein OPERATOR `;`. Im LABEL-Dialog ist `PID` der Name und `.activator` der Index.
- Zeile 9: ein ASSIGN-Block bei x=6, ein LABEL `isOwner`, ein LABEL `visitor`, ein OPERATOR `=`, ein LABEL `SHEET.owner` und ein OPERATOR `;`.
- Zeile 11: ein **IF**-Block bei x=6, ein LABEL `isOwner` und ein OPERATOR `;`.
- Zeile 12: ein BEGIN-Block bei x=6, direkt unter dem IF.
- Zeilen 13 und 14: das CALL PRINT für den Besitzer, einen Block weiter östlich (x=7 und x=8).
- Zeile 15: ein END-Block bei x=6, allein. Er beendet den ersten Weg.
- Zeile 16: ein **ELSE**-Block bei x=6, allein in seiner Zeile.
- Zeile 17: ein BEGIN-Block bei x=6.
- Zeilen 18 bis 21: die zwei CALL-PRINT-Zeilen für alle anderen, bei x=7 und x=8.
- Zeile 22: ein END-Block bei x=6, gefolgt von einem IF-Block. Er beendet die ganze Entscheidung.
- Zeile 23: END FUNCTION bei x=5.

Zeile 12 ist dunkelgelb, bis du das END in Zeile 15 setzt: Das ist beim Bauen normal.

## Starten

Verlasse die Dimension. Öffne den Dialog der Anzeigewand: Klicke auf Programm und Funktion, bis sie `guard` und `check` zeigen, und klicke dann auf ✔. Die Wand gehört jetzt dem Wächter statt dem Schild. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein. Der Wächter braucht keine Variablenkarten.

Drück den Knopf. Die Wand zeigt:

```
Welcome home, Steve!
```

mit deinem eigenen Namen statt Steve.

<!-- screenshot: decisions-guard-wall | the display wall at the entrance of the base showing "Welcome home, Steve!", the trigger block with a button below it, the player standing in front -->

Du bist der einzige Spieler in deiner Welt, darum siehst du immer die Begrüßung. Auf einem Server sieht eine Freundin, die den Knopf drückt, „Hello, Alex!“ und „Oak Hill is closed.“ Um den anderen Weg allein zu sehen, setze einen Redstone-Block neben den Auslöserblock. Jetzt hat kein Spieler das Programm gestartet, also ist der Name leer: Die Wand zeigt „Hello, !“ und „Oak Hill is closed.“ Aufgabe 2 behebt das.

## So funktioniert es

- `VARIABLE visitor STRING` und `ASSIGN visitor PID.activator ;` speichern den Namen des Spielers, der das Programm gestartet hat. `PID` ist eine Konstante, die jedes Programm hat. Ihr Element `activator` ist der Spieler, der den Knopf gedrückt hat.
- `SHEET.owner` ist der Name des Spielers, dem das Blatt gehört: dir, weil du als Erster darauf gebaut hast.
- `ASSIGN isOwner visitor = SHEET.owner ;` fragt „Ist der Besucher der Besitzer?“ und speichert die Antwort, wahr oder falsch, in der BOOLEAN-Variablen `isOwner`. Hier vergleicht `=` nur. Es speichert nie etwas; das ist die Aufgabe von ASSIGN.
- `IF isOwner ;` schaut sich die Antwort an. Ist sie wahr, führt der Cursor die Zeilen zwischen BEGIN und END aus und springt dann über den ELSE-Teil.
- Ist sie falsch, springt der Cursor über den ersten Teil und führt die Zeilen zwischen dem BEGIN nach ELSE und `END IF` aus.
- Nach `END IF` treffen sich beide Wege wieder. Hier endet die Funktion.

Du kannst Fragen auch verbinden:

- **AND**: Beide müssen wahr sein. `visitor = "Alex" AND isOwner` ist nur wahr, wenn beides wahr ist.
- **OR**: Eins genügt. `visitor = "Alex" OR visitor = "Kai"` ist für Alex und für Kai wahr.
- **NOT**: dreht die Antwort um. `NOT isOwner` ist für alle außer dem Besitzer wahr.

PRINT schreibt ein BOOLEAN als `TRUE` oder `FALSE`, so wie das Handbuch (bis c0de 0.4.0 war es `true` oder `false`). Für die Spieler sagt ein eigener Text meist mehr: Verwende das BOOLEAN in einem IF und gib aus, was es bedeutet.

## Probier es selbst

1. Deine Freunde Alex und Kai dürfen auch herein. Begrüße sie mit „Come in, Alex!“ statt mit dem Geschlossen-Schild.

::: details Lösung
Ein zweites BOOLEAN fragt mit OR, ob der Besucher ein Freund ist. Im ELSE-Teil entscheidet ein zweites IF zwischen Freund und Fremdem. Es gibt kein „ELSE IF“: Du setzt ein IF in das ELSE.

<<< @/tutorials/programs/learning/decisions-guard-friends.c0de
:::

2. Wenn kein Spieler den Wächter gestartet hat (der Redstone-Block), zeige „Nobody there.“ statt „Hello, !“.

::: details Lösung
Frage zuerst, ob der Name leer ist (`""`, ein Text ohne Zeichen). Nur wenn nicht, folgt die alte Entscheidung, innerhalb des ELSE.

<<< @/tutorials/programs/learning/decisions-guard-nobody.c0de
:::

## Mehr dazu

- [IF und ELSE](/de/c0de/guide/language#if-und-else) und [Operatoren](/de/c0de/guide/language#operatoren) in der Anleitung
- [IF](/de/c0de/reference/statements#if) und [ELSE](/de/c0de/reference/statements#else) im Handbuch Anweisungen
- [TYPE_BOOLEAN](/de/c0de/reference/data#type_boolean) und [CONSTANT](/de/c0de/reference/data#constant) für alles, was `PID` und `SHEET` wissen
