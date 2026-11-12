---
description: Eine Türklingel für die Haustür, die mit BEEP läutet und dir im Chat sagt, wer da ist, und eine Melodie, die SOUND aus einem Array von Noten und Instrumenten spielt.
---

# Türklingel und Musik

Ein Knopf an der Haustür läutet eine Glocke, und der Chat sagt allen in der Basis, wer draußen wartet. Danach bekommt dieselbe Tür eine Melodie, Note für Note aus zwei Arrays gespielt.

**Funktionen:** [BEEP](/de/c0de/minecraft/beep), [SOUND](/de/c0de/minecraft/sound), [SAY](/de/c0de/minecraft/say) und [SLEEP](/de/c0de/time/sleep) aus c0de/time

::: info Was du brauchst

- zwei **Auslöserblöcke** mit je einem **Knopf** darauf, neben deiner Haustür
- ein leeres Blatt für jedes Programm
- sonst nichts: Diese Funktionen brauchen keine Rechte, sie funktionieren für jeden Besitzer auf jedem Server

:::

## Die Idee

Ein Programm kann nicht nur rechnen, es kann sich auch hören lassen. BEEP spielt einen kurzen Glockenton, SOUND spielt eine Note wie ein Notenblock, und beide klingen **am Auslöserblock**. Der Auslöserblock muss also dort stehen, wo der Ton sein soll: an der Tür.

SAY reicht weiter: Es schreibt in den Chat aller Spieler in der Nähe des Auslöserblocks (standardmäßig im Umkreis von 64 Blöcken) oder eines Spielers, den du nennst. Jede Nachricht beginnt mit dem Namen des Programms und seiner PID, so siehst du, welches Programm spricht.

## Die Türklingel

<<< @/tutorials/programs/libraries/minecraft/doorbell-bell.c0de

## Aufbauen und starten

1. Stell einen Auslöserblock draußen neben die Haustür und setz den Knopf darauf.
2. Öffne seinen Dialog, stelle ihn auf das Programm `doorbell` und die Funktion `ring` ein und setz **Starten durch** auf _Spieler_, damit deine Besucher ihn drücken dürfen.
3. Drück den Knopf.

Du hörst die Glocke an der Tür, und der Chat zeigt `Steve is at the front door.` nach dem Namen des Programms und seiner PID.

<!-- screenshot: doorbell-door | the front door of the base from outside with the trigger block and its button beside it, and the chat line with "Steve is at the front door." -->

## So funktioniert es

- **Wer hat geklingelt?** `PID.activator` ist der Name des Spielers, der den Prozess gestartet hat. Ein Auslöserblock, den einfaches Redstone startet, etwa eine Druckplatte oder ein Tageslichtsensor, hat vielleicht keinen Spieler zu nennen; dann behält `visitor` seinen Startwert `"Someone"`.
- **BEEP** hat keine Parameter: ein Glockenton am Auslöserblock, sonst nichts.
- **SAY** ohne `player` geht an alle in der Nähe des Auslöserblocks. In einer großen Basis sind das alle, die die Tür öffnen könnten.

## Die Melodie

Eine Melodie ist eine Liste von Noten. Zwei Arrays gleicher Länge beschreiben sie: `notes` enthält die Tonhöhe jeder Note, `instruments` das Instrument, das sie spielt.

<<< @/tutorials/programs/libraries/minecraft/doorbell-melody.c0de

Stell den zweiten Auslöserblock neben den ersten, stelle ihn auf `melody` und `play` ein und drück seinen Knopf: der Anfang von „Morgen kommt der Weihnachtsmann“ – im Englischen „Twinkle, Twinkle, Little Star“.

- **Die Noten.** `note` geht von 0 bis 24, wie die Klicks auf einem Notenblock: 0 ist Fis, 1 ist G, 6 ist C, 8 ist D, 10 ist E, und 12 ist wieder Fis, eine Oktave höher. Eine Note außerhalb von 0 bis 24 löst INVALID_ARGUMENT aus.
- **Die Instrumente** sind die des Notenblocks, etwa `harp` (die Voreinstellung), `bass`, `bell` und `flute`. Ein Name, der keines ist, löst INVALID_ARGUMENT aus.
- **Die Schleife** geht mit demselben Index `i` durch beide Arrays. LEN gibt die Anzahl der Noten, also passt die Schleife auch noch, wenn du Noten hinzufügst.
- **Der Rhythmus.** SLEEP wartet nach jeder Note 6 Ticks. Ohne das würde der Cursor eine Note pro Tick spielen, und die Melodie wäre im Nu vorbei.

## Probier es selbst

1. Lass die Türklingel mit zwei Glockentönen „Ding-Dong“ machen statt BEEP.

::: details Lösung
Zwei SOUND-Aufrufe mit einer Pause dazwischen: erst die höhere Note 19, dann 15.

<<< @/tutorials/programs/libraries/minecraft/doorbell-dingdong.c0de

:::

2. Schick die Nachricht nur an den Besitzer des Auslöserblocks, und sag dem Besucher, wenn der Besitzer nicht online ist.

::: details Lösung
`PARAMETER player PID.owner ;` schickt sie nur an den Besitzer. Ist er nicht online, löst SAY INVALID_ARGUMENT aus. Darum fängt der CALL den Fehler in `problem` auf, und ein zweites SAY sagt es allen in der Nähe der Tür.

<<< @/tutorials/programs/libraries/minecraft/doorbell-owner.c0de

:::

3. Spiel die ganze erste Zeile des Lieds, mit einer Pause in der Mitte. Nimm die Note -1 für eine Pause.

::: details Lösung
Die zweite Hälfte ist C C H H A A G: 6 6 5 5 3 3 1. Die Schleife spielt nur Noten ab 0; bei -1 wartet sie nur. Eine Pause braucht auch einen Eintrag in `instruments`, damit beide Arrays gleich lang bleiben.

<<< @/tutorials/programs/libraries/minecraft/doorbell-rests.c0de

:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [BEEP](/de/c0de/minecraft/beep), [SOUND](/de/c0de/minecraft/sound), [SAY](/de/c0de/minecraft/say), [SLEEP](/de/c0de/time/sleep) und [LEN](/de/c0de/reference/functions#len)
- [Musik machen](/de/c0de/guide/libraries#musik-machen) und [c0de/minecraft](/de/c0de/guide/libraries#c0deminecraft) in der Anleitung
- [Strukturen](/de/c0de/guide/language#strukturen) in der Anleitung: die Konstante `PID` und ihre Elemente
- [Fehler](/de/c0de/guide/language#fehler) in der Anleitung: einen Fehler im CALL auffangen
