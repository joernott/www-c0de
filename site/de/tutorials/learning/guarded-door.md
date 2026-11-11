---
description: Das Abschlussprojekt – ein Zeitgeberblock startet jede Sekunde einen Wächter, der die Eisentür der Basis für dich und deine Freunde öffnet und die Besucher auf dem Willkommensschild zeigt.
---

# Projekt: die bewachte Tür

In der Lektion [Entscheidungen treffen](/de/tutorials/learning/decisions) konnte dein Türwächter die Leute nur begrüßen. Jetzt bekommt er echte Macht: Er öffnet die Tür. Der Eingang von Oak Hill bekommt eine Eisentür, die niemand mit der Hand öffnen kann. Davor liegt eine Druckplatte. Wenn du oder einer deiner Freunde darauftritt, geht die Tür auf. Fremde bleiben draußen. Und das Willkommensschild zeigt, wie viele Besucher an der Tür stehen.

::: tip Neue Wörter

- **Zeitgeber**: etwas, das ein Programm immer wieder startet, in einem festen Abstand – hier jede Sekunde.
- **Welt**: alles rund um das Programm in Minecraft: Blöcke, Türen, Spieler. Dieses Programm liest die Welt und verändert sie.

:::

::: info Was du brauchst

- ein neues, leeres Blatt in der c0de-Dimension und den Schraubenschlüssel
- eine **Eisentür** in der Wand deiner Basis, eine **Druckplatte**, einen **Knopf** und einen **Hebel**
- einen **Zeitgeberblock**
- deine Anzeigewand am Eingang (das Willkommensschild)
- die Blöcke, die du kennst, darunter INCLUDE, EACH, IF, RETURN und die Typblöcke ARRAY, STRUCT und BOOLEAN

:::

::: warning Braucht einen Operator
Eisentüren lassen sich nicht mit der Hand öffnen, darum darf ein Programm sie nur öffnen, wenn der Besitzer des Zeitgeberblocks ein Operator ist. In der Welt der Tutorials bist du ein Operator, also funktioniert es. Auf einem Server kann der Administrator es mit `allowBlockChanges=true` in `config/c0de.properties` für alle erlauben. Ohne dieses Recht stürzt das Programm mit PERMISSION_DENIED ab. Eine Holztür funktioniert für alle – aber dann kann jeder sie mit der Hand öffnen, und der Wächter kann nur begrüßen.
:::

## Die Idee

Stell dir eine Wache am Tor einer Burg vor. Alle paar Augenblicke schaut sie sich um: Wer steht auf der Fußmatte? Ist es der Burgherr oder einer seiner Freunde? Dann öffnet sie das Tor. Ist es ein Fremder? Dann bleibt das Tor zu. Dann wartet sie einen Moment und schaut wieder.

Die Wache entscheidet nicht einmal; sie prüft immer wieder. Genau das macht ein **Zeitgeber**: Ein **Zeitgeberblock** startet dein Programm jede Sekunde. Jeder Durchlauf schaut sich die Welt an, entscheidet und handelt – und ist nach einem Moment vorbei. Eine Sekunde später startet der nächste Durchlauf.

Jeder Durchlauf fängt frisch an. Wie eine Wache, die am Ende ihrer Runde alles vergisst, weiß ein Durchlauf nicht, was der Durchlauf davor gesehen hat. Darum zeigt das Schild, wer gerade jetzt an der Tür ist: Das Programm zählt in jedem Durchlauf die Spieler in der Nähe der Tür.

## Das Programm

Das Programm `door` kommt auf ein neues Blatt.

<<< @/tutorials/programs/learning/guarded-door-door.c0de

<!-- screenshot: guarded-door-sheet | the whole program door on its sheet, seen from above, with the start values of plate and door at the top, the function isFriend and the function watch below it -->

## So baust du es

Bau zuerst die Tür, damit du ihre Position ablesen kannst:

1. Setz eine Eisentür in den Eingang deiner Basis.
2. Lass draußen vor der Tür einen Block frei und leg die Druckplatte auf den Block danach. Die Platte darf die Tür nicht berühren: Eine Druckplatte direkt vor einer Eisentür öffnet sie mit Redstone – für alle.
3. Bring drinnen einen Knopf an der Wand neben der Tür an. Er öffnet die Tür mit Redstone, damit du hinauskommst.
4. Drücke F3 und schau die Druckplatte an. Der Debug-Bildschirm zeigt ihre Position unter „Targeted Block“, drei Zahlen x, y und z. Schreib sie auf. Mach dasselbe für die untere Hälfte der Tür.

Bau jetzt das Programm. Die Zeilen 0 bis 3 und die NOOP-Zeilen sind wie bisher. Neu sind:

- Zeilen 4 bis 7: die Liste `friends`, wie die Notizen der Lektion [Listen](/de/tutorials/learning/lists): VARIABLE `friends`, die Typblöcke ARRAY und STRING und zwischen BEGIN und END VARIABLE eine Zeile mit zwei LITERAL-Blöcken, `"Alex"` und `"Kai"`. Trag die Namen deiner Freunde ein.
- Zeilen 8 bis 13: die Position der Druckplatte. VARIABLE `plate`, ein STRUCT-Typblock und ein LABEL `c0de/minecraft/POSITION`: Das ist ein Strukturtyp der Bibliothek c0de/minecraft, mit den Elementen x, y und z. Zwischen BEGIN und END VARIABLE steht eine Zeile pro Element, wie beim Angebot der Lektion [Tabellen und eigene Typen](/de/tutorials/learning/tables): ein LABEL `x` und ein LITERAL mit deiner Zahl, dann `y` und `z`. Nimm deine Zahlen, nicht die aus dem Beispiel.
- Zeilen 14 bis 19: dasselbe für `door`, mit der Position der unteren Hälfte der Tür.
- Zeilen 21 bis 36: die Funktion `isFriend`. Sie antwortet mit wahr für den Besitzer des Blatts und für jeden Namen in `friends`.
- Zeilen 38 bis 85: die Funktion `watch`, die in jedem Durchlauf die Arbeit macht. Die neuen Funktionen von c0de/minecraft werden unten erklärt.

## Starten

1. Stell den Zeitgeberblock irgendwo in der Nähe des Eingangs auf, wo weder die Druckplatte noch der Knopf ihn berührt – ein Redstone-Signal pausiert einen Zeitgeberblock. Setz den Hebel direkt daneben, ausgeschaltet.
2. Öffne den Dialog des Zeitgeberblocks. Stelle ihn auf das Programm `door` und die Funktion `watch` ein und den Abstand auf 20 Ticks: eine Sekunde.
3. Öffne den Dialog deiner Anzeigewand und binde sie an `door` und `watch`. Die Wand gehört jetzt der Tür statt dem Schild.

Innerhalb einer Sekunde zeigt das Schild:

```
Welcome to Oak Hill!
Visitors at the door: 1
```

Wenn du in der Nähe der Tür stehst, bist du der eine Besucher. Tritt auf die Druckplatte: Die Tür geht auf. Geh hinein. Drinnen drückst du den Knopf, um wieder hinauszugehen.

<!-- screenshot: guarded-door-entrance | the entrance of the base from outside: the iron door open, the player on the pressure plate one block in front of it, the display wall next to the entrance showing "Welcome to Oak Hill!" and "Visitors at the door: 1" -->

Wenn jemand anderes auf die Platte tritt – auf einem Server ein Spieler, der nicht auf deiner Liste steht, oder einfach ein Schwein –, geht die Tür zu: Auf der Platte steht kein Freund.

Um das Programm zu ändern, schalte zuerst den Hebel ein. Er pausiert den Zeitgeberblock, und wenn der letzte Durchlauf vorbei ist, kannst du das Blatt ändern. Solange ein Prozess läuft, ist sein Blatt gesperrt – und bei einem Zeitgeber, der jede Sekunde startet, ist das fast immer.

## So funktioniert es

- **Der Zeitgeberblock** startet `watch` alle 20 Ticks. Ein neuer Durchlauf startet erst, wenn der letzte zu Ende ist.
- **Positionen.** Die Funktionen von c0de/minecraft müssen wissen, wo etwas ist. Eine `c0de/minecraft/POSITION` ist eine Struktur mit x, y und z. `plate` und `door` enthalten die Positionen, die du mit F3 abgelesen hast.
- **Wer ist da?** FIND_ENTITIES (Zeilen 45 bis 49) sucht alles im Umkreis von `radius` Blöcken um eine Position. Mit `type "minecraft:player"` findet es nur Spieler. Sein Ergebnis ist eine Liste von ENTITY-Strukturen. Jede hat einen `name`, einen `type` und eine `position`, die selbst eine POSITION ist.
- **Zählen.** LEN (Zeilen 50 bis 52) gibt die Zahl der Elemente der Liste: die Spieler im Umkreis von 5 Blöcken um die Tür. Das Schild zeigt sie in den Zeilen 53 bis 61.
- **Die Druckplatte.** GET_PRESSURE_PLATE (Zeilen 62 bis 64) gibt die Signalstärke der Platte: 0, wenn niemand darauf steht. Dann gibt es nichts zu tun, und RETURN beendet den Durchlauf in Zeile 67. Die Tür bleibt, wie sie ist.
- **Wer steht auf der Platte?** Die EACH-Schleife geht alle Spieler in der Nähe der Tür durch. Ein Spieler steht auf der Platte, wenn seine Position die Position der Platte ist: x, y und z müssen alle gleich sein. `visitor.position.x` liest das Element `x` des Elements `position` von `visitor`.
- **Freund oder Fremder?** Für jeden Spieler auf der Platte prüft `isFriend` den Namen. Ist einer von ihnen ein Freund, wird `letIn` wahr.
- **Die Tür.** SET_OPEN (Zeilen 82 bis 84) öffnet die Tür, wenn `letIn` wahr ist, und schließt sie, wenn es falsch ist. Ein Freund öffnet sie also, und ein Fremder auf der Platte schließt sie wieder.

Das Programm handelt im Namen des Besitzers des Zeitgeberblocks – in deinem. Darum darf es eine Eisentür öffnen, siehe den Kasten oben.

## Probier es selbst

1. Die Tür bleibt offen, nachdem ein Freund hineingegangen ist, bis ein Fremder auf die Platte tritt. Schließ sie nach fünf Sekunden wieder.

::: details Lösung
Nachdem die Tür aufgegangen ist, wartet das Programm 100 Ticks – fünf Sekunden – mit SLEEP aus der Bibliothek c0de/time und schließt dann die Tür. Das Programm braucht dafür eine dritte INCLUDE-Zeile.

<<< @/tutorials/programs/learning/guarded-door-close.c0de

Während das Programm schläft, ist der Durchlauf nicht vorbei, also startet der Zeitgeberblock keinen neuen, und das Schild wird nicht aktualisiert. Nach den fünf Sekunden geht alles weiter wie vorher.
:::

## Mehr dazu

- [Drei Auslöserblöcke](/de/c0de/guide/running-programs#drei-auslöserblöcke) in der Anleitung und der [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock) im Handbuch Auslöser
- [c0de/minecraft](/de/c0de/guide/libraries#c0deminecraft), [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern) und [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung
- Die Funktionen dieser Lektion: [FIND_ENTITIES](/de/c0de/minecraft/find_entities), [GET_PRESSURE_PLATE](/de/c0de/minecraft/get_pressure_plate), [SET_OPEN](/de/c0de/minecraft/set_open), [LEN](/de/c0de/reference/functions#len) und [SLEEP](/de/c0de/time/sleep)
- [Geschützte Programme](/de/c0de/guide/running-programs#geschützte-programme) in der Anleitung: warum das Blatt gesperrt ist, solange das Programm läuft
