---
description: Ein Laptop, der dir sagt, wie oft du eine Zahl halbieren kannst, und so lange weiterfragt, wie du willst – Schleifen, die laufen, bis etwas passiert.
---

# Schleifen mit Bedingung

Wie oft kannst du ein Blatt Papier in der Mitte falten? Das weißt du vorher nicht: Du faltest, bis es nicht mehr geht. Eine FOR-Schleife kann das nicht, weil sie ihr Ende kennen muss, bevor sie beginnt. Heute lernst du Schleifen kennen, die laufen, _bis etwas passiert_. Der Laptop von Oak Hill bekommt eine kleine Halbiermaschine, und sie fragt so lange nach Zahlen, wie du „yes“ antwortest.

::: tip Neue Wörter

- **WHILE-Schleife**: eine Schleife, die läuft, solange ihre Bedingung wahr ist, und sie vor jeder Runde prüft.
- **REPEAT-Schleife**: eine Schleife, die ihre Bedingung nach jeder Runde prüft und deshalb immer mindestens einmal läuft.
- **Endlosschleife**: eine Schleife, deren Bedingung sich nie ändert, sodass sie nie endet.
- **BREAK**: verlässt eine Schleife sofort.
  :::

::: info Was du brauchst

- den Laptop deiner Basis mit einem Auslöserblock und einem Knopf daneben
- ein neues, leeres Blatt in der c0de-Dimension
- aus dem Kreativinventar: die Blöcke, die du kennst, den Typblock FLOAT und die neuen **WHILE**- und **REPEAT**-Blöcke (für die Aufgaben auch einen **BREAK**-Block)
  :::

## Die Idee

Zwei Arten von Regeln aus dem Alltag wiederholen etwas, bis sich eine Bedingung ändert:

- „**Solange** es regnet, bleib drinnen.“ Du schaust _zuerst_ aus dem Fenster. Scheint die Sonne, bleibst du gar nicht drinnen.
- „Probier die Suppe und gib Salz dazu, **bis** sie gut schmeckt.“ Du probierst _zuerst_ und entscheidest _danach_. Du probierst immer mindestens einmal.

Die erste Regel ist eine WHILE-Schleife: erst prüfen, dann tun. Die zweite ist eine REPEAT-Schleife: erst tun, dann prüfen. In c0de macht REPEAT weiter, solange seine Bedingung wahr ist, also wird aus „bis sie gut schmeckt“ ein „wiederhole, solange sie noch nicht gut schmeckt“.

Beide Schleifen brauchen etwas, das sich ändert. „Solange es regnet“ endet, weil sich das Wetter ändert. Wenn nichts in der Schleife die Bedingung je ändert, läuft die Schleife für immer: eine **Endlosschleife**.

## Das Programm

Das Programm `halving` kommt auf ein neues Blatt.

<<< @/tutorials/programs/learning/condition-loops-halving.c0de

<!-- screenshot: condition-loops-halving-sheet | the program halving on its sheet, seen from the south end, showing the REPEAT block with the WHILE loop indented inside it -->

## So baust du es

Neu sind die zwei Schleifen:

- Zeile 6: ein VARIABLE-Block bei x=6, ein LABEL `half` und ein **FLOAT**-Typblock. Ein FLOAT kann Zahlen mit Nachkommastellen enthalten, zum Beispiel 62.5.
- Zeile 9: ein **REPEAT**-Block bei x=6, allein in seiner Zeile.
- Zeile 10: BEGIN bei x=6. Alle Zeilen der REPEAT-Schleife liegen einen Block weiter östlich, bei x=7.
- Zeile 17: ein **WHILE**-Block bei x=7, ein LABEL `half`, ein OPERATOR `>`, ein LITERAL 1 und ein OPERATOR `;`.
- Zeile 18: BEGIN bei x=7. Die zwei ASSIGN-Zeilen der WHILE-Schleife liegen bei x=8.
- Zeile 21: ein END-Block bei x=7, gefolgt von einem WHILE-Block.
- Zeile 28: ein END-Block bei x=6, ein REPEAT-Block und dann die Bedingung: ein LABEL `again`, ein OPERATOR `=`, ein LITERAL `"yes"` und ein OPERATOR `;`.

## Starten

Öffne den Laptop (klicke ihn mit rechts an), wähle mit den zwei Knöpfen oben das Programm `halving` und die Funktion `halve` und klicke auf ✔. Stelle den Auslöserblock auf dasselbe Programm und dieselbe Funktion ein und drück den Knopf.

Öffne den Laptop wieder. Er zeigt „Type a number:“, und die Eingabezeile unter dem Bildschirm zeigt `INPUT number (INTEGER):`. Tippe 8 und drück Enter. Der Laptop antwortet:

```
You can halve 8 3 times.
Another number? (yes/no)
```

Tippe yes, dann 1000: „You can halve 1000 10 times.“ Tippe no, und der Laptop sagt „Bye!“. Das Programm ist zu Ende.

<!-- screenshot: condition-loops-halving-laptop | the laptop terminal after two numbers: "Type a number:", 8, "You can halve 8 3 times.", "Another number? (yes/no)", yes, "Type a number:", 1000, "You can halve 1000 10 times." and the input line waiting for the answer -->

Tippst du etwas, das keine ganze Zahl ist, zum Beispiel „ten“, lehnt der Laptop es mit einer Zeile ab, die mit `?` beginnt, und wartet, bis du eine Zahl tippst.

## So funktioniert es

Das Programm hat zwei Schleifen, eine in der anderen.

Die innere Schleife halbiert:

- `ASSIGN half number ;` kopiert die Zahl in das FLOAT `half`. `steps` beginnt bei 0.
- `WHILE half > 1 ;` fragt vor jeder Runde: „Ist `half` noch größer als 1?“
- Wenn ja, halbiert die Runde `half` und zählt einen Schritt. Bei 8: 4, dann 2, dann 1. Jetzt ist `half > 1` falsch, und die Schleife endet nach 3 Runden.
- Bei 1000 geht es 500, 250, 125, 62.5 … bis 0.98, nach 10 Runden. Darum ist `half` ein FLOAT: `/` ergibt immer eine Zahl mit Nachkommastellen, und die passt nicht in ein INTEGER.
- Tippst du 1, ist `half > 1` sofort falsch. Die WHILE-Schleife läuft gar nicht, und die Antwort ist 0-mal.

Die äußere Schleife fragt weiter:

- `REPEAT` führt seine Zeilen zuerst aus: fragen, halbieren, antworten und „Another number?“ fragen.
- Dann prüft `END REPEAT again = "yes" ;` die Antwort. Ist sie „yes“, geht der Cursor zurück nach oben zu REPEAT, und alles beginnt von vorn.
- Jede andere Antwort beendet die Schleife, und das Programm sagt „Bye!“.

Was, wenn du die Zeile `ASSIGN half half / 2 ;` vergisst? Dann ändert sich `half` nie, `half > 1` bleibt wahr, und die WHILE-Schleife läuft für immer. Der Cursor dreht auf dem Blatt Runde um Runde. Um ihn anzuhalten, klicke den PID-Block des Prozesses mit dem Debugging-Werkzeug bei gedrückter Umschalttaste mit rechts an. Der Prozess stürzt dann mit PROCESS_ABORTED ab. Bevor du eine Schleife baust, frag dich also: Was ändert sich in jeder Runde, damit die Schleife enden kann?

Manchmal willst du eine Schleife mitten in einer Runde verlassen. **BREAK** tut das: Es verlässt die Schleife sofort, und der Cursor macht nach ihrem END weiter. Mit einer Bedingung, zum Beispiel `BREAK number = 0 ;`, verlässt es die Schleife nur, wenn die Bedingung wahr ist. Aufgabe 2 verwendet es.

## Probier es selbst

1. Frag so lange, bis der Spieler eine Zahl von 1 bis 10 tippt.

::: details Lösung
Eine zweite REPEAT-Schleife um die Frage herum fragt erneut, solange die Zahl zu klein oder (OR) zu groß ist.

<<< @/tutorials/programs/learning/condition-loops-range.c0de

Tippst du 1000 und dann 0, fragt der Laptop beide Male erneut. Bei 10 antwortet er „You can halve 10 4 times.“
:::

2. Statt „Another number?“ zu fragen, lass den Spieler 0 tippen, um aufzuhören.

::: details Lösung
`BREAK number = 0 ;` direkt nach dem INPUT verlässt die REPEAT-Schleife, wenn die Zahl 0 ist. Die Schleife selbst wiederholt sich für immer (`END REPEAT TRUE ;`): Das BREAK ist ihr einziger Ausweg.

<<< @/tutorials/programs/learning/condition-loops-zero.c0de
:::

## Mehr dazu

- [WHILE und REPEAT](/de/c0de/guide/language#while-und-repeat) und [BREAK](/de/c0de/guide/language#break) in der Anleitung
- [WHILE](/de/c0de/reference/statements#while), [REPEAT](/de/c0de/reference/statements#repeat) und [BREAK](/de/c0de/reference/statements#break) im Handbuch Anweisungen
- [Einen Prozess abbrechen](/de/c0de/guide/running-programs#einen-prozess-abbrechen), für Schleifen, die nicht enden
- [Laptop](/de/c0de/reference/devices#laptop) im Handbuch Geräte
