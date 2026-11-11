---
description: Dein erstes Programm – ein Begrüßungsschild am Eingang deiner Basis, das „Welcome to my base!“ zeigt.
---

# Dein erstes Programm

Jede Basis braucht ein Schild am Eingang. Heute baust du den ersten Teil deines Basiscomputers: eine Anzeigewand, die deine Besucher mit „Welcome to my base!“ begrüßt. Ein Programm schreibt den Text, und ein Knopf startet es.

::: tip Neue Wörter

- **Anweisung**: ein Schritt, den ein Computer ausführt, zum Beispiel „lösche den Bildschirm“ oder „schreib diesen Text“.
- **Funktion**: ein Teil eines Programms mit einem Namen. Ein Auslöserblock startet ein Programm bei einer seiner Funktionen.
- **Cursor**: die leuchtende Säule auf der Cursorschiene. Sie zeigt, an welcher Zeile der Computer gerade arbeitet.
  :::

::: info Was du brauchst
Aus dem Kreativinventar: einen **Auslöserblock**, einen **Schraubenschlüssel**, einen **Knopf** und zwei **Anzeigeblöcke**. Sprachblöcke: PROGRAM, NOOP, FUNCTION, BEGIN, END, CALL, PARAMETER, LABEL, LITERAL und OPERATOR.
:::

## Die Idee

Ein Programm ist eine Liste von Anweisungen. Der Computer führt sie **eine nach der anderen** aus, von oben nach unten, so wie du einem Rezept folgst: erst die Eier aufschlagen, dann rühren, dann backen.

Unser Schild braucht zwei Anweisungen:

1. Lösche den Bildschirm.
2. Schreib „Welcome to my base!“.

Die Reihenfolge ist wichtig. Würdest du zuerst den Text schreiben und danach den Bildschirm löschen, bliebe das Schild leer.

## Das Programm

<<< @/tutorials/programs/learning/first-program-sign.c0de

## So baust du es

Nimm deinen Schraubenschlüssel und klicke den Auslöserblock aus der letzten Lektion (oder einen neuen) mit rechts an. Du landest vor einem freien Blatt. Fang an seinem Nordende an, bei x=5 (dem ersten Block östlich der grauen Cursorschiene).

- Zeile 0: ein PROGRAM-Block bei x=5, dann ein LABEL. Klicke das LABEL mit leerer Hand mit rechts an und gib den Namen `sign` ein.
- Zeile 1: ein NOOP-Block bei x=5. Jedes Programm braucht ihn hier.
- Zeile 2: noch ein NOOP. Eine FUNCTION braucht immer direkt darüber eine NOOP-Zeile.
- Zeile 3: ein FUNCTION-Block bei x=5, dann ein LABEL mit dem Namen `welcome`.
- Zeile 4: ein BEGIN-Block bei x=5.
- Zeile 5: ein CALL-Block bei x=6, einen Block weiter östlich, dann ein LABEL mit dem Namen `CLS`.
- Zeile 6: ein CALL-Block bei x=6, dann ein LABEL mit dem Namen `PRINT`.
- Zeile 7: ein PARAMETER-Block bei x=7, ein LABEL mit dem Namen `value`, ein LITERAL und ein OPERATOR. Wähle im Dialog des LITERALs den Typ STRING und gib den Text `Welcome to my base!` ein. Wähle im Dialog des OPERATORs das `;`.
- Zeile 8: ein END-Block bei x=5, dann ein FUNCTION-Block.

Wenn alle Zeilennummern dunkelgrün oder blass sind, ist das Programm fertig. Lass die Zeile nach dem END leer: Die erste leere Zeile beendet das Programm.

<!-- screenshot: first-program-sign | the program "sign" on its sheet, seen from above at the north end, with dark green line numbers -->

## Starten

Verlasse die Dimension (klicke mit leerer Hand mit rechts auf den schwarzen Boden) und geh zum Eingang deiner Basis.

1. **Die Anzeigewand**: Platziere zwei Anzeigeblöcke nebeneinander, beide zum Weg gerichtet, auf dem Besucher hereinkommen. Zusammen bilden sie einen Bildschirm mit 32 Spalten und 8 Zeilen. Klicke einen davon mit leerer Hand mit rechts an. Klicke auf die Knöpfe Programm und Funktion, bis sie `sign` und `welcome` zeigen, dann auf ✔. Damit ist die ganze Wand an deine Funktion gebunden.
2. **Der Auslöserblock**: Platziere ihn in der Nähe der Wand, wo du ihn erreichst. Klicke ihn mit leerer Hand mit rechts an und wähle das Programm `sign` und die Funktion `welcome`.
3. **Der Knopf**: Setze einen Knopf an den Auslöserblock.

Drück den Knopf. Die Anzeigewand zeigt:

```text
Welcome to my base!
```

<!-- screenshot: first-program-result | the display wall of 2 x 1 display blocks at the entrance of the base, showing "Welcome to my base!", with the trigger block and button next to it -->

Während das Programm läuft, bewegt sich ein leuchtender grüner **Cursor** auf der Cursorschiene seines Blatts, eine Zeile pro Tick, und bei Zeile 0 erscheint ein dunkler PID-Block. Unser Programm ist kurz, es ist in weniger als einer Sekunde fertig. Um den Cursor zu beobachten, setze einen zweiten Auslöserblock mit Knopf auf den schwarzen Boden neben deinem Blatt, richte ihn genauso ein und drück seinen Knopf, während du auf die Schiene schaust.

## So funktioniert es

- `PROGRAM sign` gibt dem Programm seinen Namen. Auslöserblöcke und Anzeigeblöcke finden es unter diesem Namen.
- Die beiden `NOOP`-Zeilen tun nichts. Sie sind Regeln von c0de: Zeile 1 ist immer eine NOOP-Zeile, und jede FUNCTION braucht direkt darüber eine.
- `FUNCTION welcome` beginnt eine **Funktion**: einen Teil des Programms mit einem Namen. Ein Auslöserblock startet nicht „das Programm“, sondern eine seiner Funktionen.
- `BEGIN` und `END FUNCTION` markieren, wo die Funktion anfängt und endet. Die Zeilen dazwischen liegen einen Block weiter östlich, so siehst du auf einen Blick, dass sie zur Funktion gehören.
- `CALL CLS` ist die erste **Anweisung**: Sie löscht den Bildschirm. CALL heißt „tu das“. CLS ist die Abkürzung für „clear screen“ (Bildschirm löschen), eine Funktion, die c0de schon kennt.
- `CALL PRINT` schreibt auf den Bildschirm. Die Zeile darunter sagt, was es schreiben soll: Der PARAMETER `value` ist der Text `"Welcome to my base!"`. Das `;` am Ende sagt: Der Wert ist vollständig.
- Wenn der Cursor `END FUNCTION` erreicht, sind die Funktion und das Programm fertig.

Der Computer führt die Zeilen von oben nach unten aus. CLS kommt zuerst, also beginnt der Text immer auf einem leeren Bildschirm, in seiner linken oberen Ecke.

## Probier es selbst

1. Füge unter der ersten Textzeile eine zweite hinzu, zum Beispiel „Please wipe your feet.“.

::: details Lösung
Füge nach dem ersten CALL PRINT ein weiteres mit seiner PARAMETER-Zeile hinzu. Jedes PRINT beginnt danach eine neue Zeile auf dem Bildschirm, also erscheint der zweite Text unter dem ersten.

<<< @/tutorials/programs/learning/first-program-two-lines.c0de
:::

2. Schreib deinen eigenen Namen auf das Schild, zum Beispiel „Welcome to Alex's base!“.

::: details Lösung
Klicke das LITERAL in Zeile 7 mit leerer Hand mit rechts an und ändere seinen Text. Der Rest des Programms bleibt gleich.

<<< @/tutorials/programs/learning/first-program-name.c0de
:::

## Mehr dazu

- [Dein erstes Programm](/de/c0de/guide/getting-started#dein-erstes-programm) und [Schritt für Schritt](/de/c0de/guide/getting-started#schritt-für-schritt) in der Anleitung
- [Anzeigeblock](/de/c0de/reference/devices#anzeigeblock): Anzeigewände und wie du sie bindest
- [PRINT](/de/c0de/reference/functions#print) und [CLS](/de/c0de/reference/functions#cls)
- [Der Cursor](/de/c0de/guide/running-programs#der-cursor)
