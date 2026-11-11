---
description: Was ein Computer und ein Programm sind, die Welt der Tutorials, ein Rundgang durch die c0de-Dimension und wie du die Programme auf diesen Seiten liest.
---

# Bevor du anfängst

In diesen Lektionen baust du den Computer deiner Basis Oak Hill: zuerst ein Schild, das Besucher begrüßt, später einen Rechner, eine bewachte Tür und ein Spiel. Bevor du den ersten Block setzt, richtet diese Lektion deine Welt ein, zeigt dir die c0de-Dimension und erklärt, wie du die Programme auf diesen Seiten liest.

::: tip Neue Wörter

- **Computer**: eine Maschine, die Anweisungen ausführt, sehr schnell und ohne je müde zu werden.
- **Programm**: eine Liste von Anweisungen für einen Computer.
- **Blatt**: der Streifen Boden in der c0de-Dimension, auf dem ein Programm liegt.
- **Zeile**: eine Reihe von Blöcken auf einem Blatt. Eine Zeile ist eine Anweisung.
  :::

::: info Was du brauchst
Minecraft mit der Mod c0de und eine neue Welt, wie unten beschrieben. Aus dem Kreativinventar: einen **Auslöserblock** und einen **Schraubenschlüssel**.
:::

## Die Idee

Ein **Computer** tut, was man ihm sagt, und sonst nichts. Er rät nicht, was du meinst. Er lässt keinen Schritt aus, der albern aussieht. Er tut genau das, was in den Anweisungen steht, in ihrer Reihenfolge.

Ein **Programm** ist so eine Liste von Anweisungen. Denk an einen Zettel für eine Freundin, die auf deine Basis aufpasst: „Füttere die Hühner. Schließ die Tür. Zünde die Fackeln an.“ Deine Freundin würde die Tür auch schließen, wenn du es vergessen hättest aufzuschreiben. Ein Computer nicht.

Das klingt streng, aber genau das macht Programmieren schön: Wenn das Programm stimmt, funktioniert es jedes Mal.

So etwas kennst du schon aus Minecraft. Eine Redstone-Schaltung tut genau das, was du verdrahtet hast, auch wenn du es falsch verdrahtet hast. In c0de verdrahtest du nicht, du schreibst: Du legst Blöcke in Reihen, und jede Reihe ist eine Anweisung.

## Deine Welt

Die Tutorials gehen von einer **Einzelspielerwelt im Kreativmodus mit erlaubten Cheats** aus. Dann hast du jeden Block zur Hand, und du bist Operator deiner Welt, sodass keine Lektion an einer fehlenden Berechtigung scheitert.

1. Starte Minecraft mit installiertem c0de.
2. Klicke auf **Einzelspieler**, dann auf **Neue Welt erstellen**.
3. Stelle den Spielmodus auf **Kreativ**.
4. Stelle **Cheats erlauben** auf **AN**.
5. Gib der Welt einen Namen, zum Beispiel „Oak Hill“, und klicke auf **Neue Welt erstellen**.

<!-- screenshot: before-you-start-new-world | the Minecraft "Create New World" screen with game mode Creative and Allow Cheats ON -->

Bau eine kleine Basis oder such dir einen Platz, der dir gefällt. Dort wird dein Computer stehen.

## Deine ersten Blöcke

Öffne das Kreativinventar. Der Reiter **c0de** (sein Symbol ist ein Schraubenschlüssel) enthält alle Blöcke und Gegenstände von c0de: die Auslöserblöcke, die Werkzeuge, die Anzeigeblöcke und Laptops, die Sprachblöcke und die Datenkarten.

<!-- screenshot: before-you-start-creative-tab | the creative inventory with the c0de tab open, showing the trigger block, the wrench and the language blocks -->

Nimm einen **Auslöserblock** und einen **Schraubenschlüssel**. Ein Auslöserblock startet Programme; der Schraubenschlüssel bringt dich an den Ort, an dem Programme leben.

Im Überlebensmodus würdest du sie aus Vanilla-Materialien herstellen. Die Rezepte stehen im Kapitel [Werkzeuge und Gegenstände](/de/c0de/guide/tools) der Anleitung.

## Ein Rundgang durch die c0de-Dimension

Platziere den Auslöserblock irgendwo in deiner Basis. Klicke ihn mit dem Schraubenschlüssel mit rechts an. Du wirst in die **c0de-Dimension** teleportiert. Da dieser Auslöserblock noch nicht eingerichtet ist, landest du vor dem ersten freien Blatt.

Sieh dich um:

- **Der Boden** sieht aus wie altes Computerpapier mit grünen und weißen Streifen. Jeder Streifen ist ein **Blatt**. Ein Blatt ist 32 Blöcke breit und reicht endlos nach Süden. Jedes Blatt enthält höchstens ein Programm.
- **Der schwarze Boden** außerhalb der Blätter gehört niemandem.
- **Die Blattnummer**: Nördlich der Ecke jedes Blatts zeigt der Boden die Nummer des Blatts, seine Koordinaten und seinen Besitzer. Der erste Spieler, der auf einem leeren Blatt baut, besitzt es.
- **Zeilen**: Ein Programm beginnt am Nordende eines Blatts und verläuft nach Süden. Jede Reihe von Blöcken quer über das Blatt ist eine **Zeile**. Die erste Zeile ist Zeile 0.
- **Der Codebereich**: Die Blöcke eines Programms liegen zwischen x=5 und x=28, gezählt vom Westrand des Blatts. Eine Zeile hat also höchstens 24 Blöcke.
- **Die Cursorschiene** bei x=4 ist eine graue Schiene. Wenn ein Programm läuft, bewegt sich ein leuchtender Cursor darauf entlang und zeigt, welche Zeile gerade arbeitet.
- **Zeilennummern** erscheinen bei x=2, sobald eine Zeile Blöcke hat. Ihre Farbe sagt dir, ob die Zeile stimmt: Dunkelgrün ist richtig, Dunkelgelb ist noch nicht fertig, Dunkelrot ist falsch.

<!-- screenshot: before-you-start-sheet | the north end of an empty sheet in the c0de dimension, seen from the north-west: the sheet number on the black floor, the green and white stripes and the cursor rail -->

Die Dimension hat keine Mobs, kein Wetter und keine Nacht. Um sie zu verlassen, klicke mit leerer Hand mit rechts auf den schwarzen Boden. Du kehrst an den Ort zurück, an dem du sie betreten hast.

## Wie du die Programme liest

Auf diesen Seiten stehen Programme als Text. Im Spiel baust du sie aus Blöcken. Jede Textzeile ist eine Zeile auf dem Blatt. Hier ist das Programm der nächsten Lektion; du musst es noch nicht bauen:

<<< @/tutorials/programs/learning/first-program-sign.c0de

Lies es so:

- **Wörter in Großbuchstaben** wie `PROGRAM`, `FUNCTION` und `CALL` sind Schlüsselwortblöcke. Der erste Block einer Zeile ist immer ein Schlüsselwortblock. Er bestimmt, was die Zeile tut.
- **Kleingeschriebene Namen** wie `sign` und `welcome` sind LABEL-Blöcke. Manche Namen stehen auch in Großbuchstaben, wie `PRINT`; das sind die Namen von Dingen, die c0de schon kennt.
- **Zahlen und Text in Anführungszeichen** wie `42` oder `"Welcome to my base!"` sind LITERAL-Blöcke. Sie enthalten einen Wert.
- **Zeichen** wie `+`, `⊕` und `;` sind OPERATOR-Blöcke.
- **Vier Leerzeichen** am Anfang einer Zeile bedeuten einen Block weiter östlich (nach rechts). `    CALL CLS` beginnt bei x=6, nicht bei x=5.

Jede Lektion sagt dir außerdem Zeile für Zeile, welcher Block wohin kommt.

## Probier es selbst

1. Geh zurück in die c0de-Dimension und finde die Nummer des Blatts vor dir. Merk sie dir: Dort wird dein erstes Programm leben.

::: details Lösung
Geh zum Nordende des Blatts. Nördlich seiner Westecke siehst du auf dem schwarzen Boden seine Nummer, seine Koordinaten und seinen Besitzer. Das Blatt ist noch leer, also hat es noch keinen Besitzer. In einer neuen Welt ist es meist das erste Blatt; in einer Welt, in der es schon Programme gibt, das erste freie.
:::

## Mehr dazu

- [Erste Schritte](/de/c0de/guide/getting-started): die Dimension, Blätter, Zeilennummern und Blöcke platzieren
- [Die Beispiele lesen](/de/c0de/guide/getting-started#die-beispiele-lesen): die Textschreibweise
- [Werkzeuge und Gegenstände](/de/c0de/guide/tools): die Rezepte aller Blöcke und Werkzeuge
- [Tutorials](/de/tutorials/): die Welt der Tutorials
