---
description: Eine Tür, die aufgeht, wenn jemand auf eine Druckplatte tritt, und nach einer Weile wieder zugeht, mit GET_PRESSURE_PLATE, GET_OPEN und SET_OPEN, und ein Bericht im Chat über alle offenen Türen, Tore und Falltüren.
---

# Automatische Türen

Eine Ladentür, die von selbst aufgeht: Tritt auf die Druckplatte davor, und sie schwingt auf; zwei Sekunden nachdem du durch bist, geht sie wieder zu. Und bevor du ins Bett gehst, sagt dir ein Knopf, welche Türen, Tore und Falltüren deiner Basis noch offen sind.

**Funktionen:** [GET_PRESSURE_PLATE](/de/c0de/minecraft/get_pressure_plate), [GET_OPEN](/de/c0de/minecraft/get_open), [SET_OPEN](/de/c0de/minecraft/set_open) und [SLEEP](/de/c0de/time/sleep) aus c0de/time

::: info Was du brauchst

- einen **Zeitgeberblock**, einen **Auslöserblock** mit einem **Knopf** darauf und ein leeres Blatt für jedes Programm
- eine **Holztür** und zwei **Druckplatten**
- für den Bericht: noch ein paar Türen, **Zauntore** oder **Falltüren**
- keine Rechte für Holztüren, Tore und Falltüren. Eisentüren und Eisenfalltüren brauchen auf einem Server `allowBlockChanges` oder einen Operator als Besitzer, wie bei der [bewachten Tür](/de/tutorials/learning/guarded-door).

:::

## Die Idee

Eine Druckplatte direkt neben einer Tür öffnet sie mit Redstone – aber dann knallt die Tür zu, sobald du heruntersteigst, oft direkt vor deiner Nase. Ein Programm kann das besser: Es liest die Platten, öffnet die Tür und schließt sie erst, wenn zwei Sekunden lang niemand auf eine Platte getreten ist.

GET_PRESSURE_PLATE liest die Signalstärke einer Platte, von 0 (niemand) bis 15. GET_OPEN sagt, ob eine Tür offen ist, und SET_OPEN öffnet oder schließt sie. Alle drei funktionieren auch für Falltüren und Zauntore.

## Die Tür

<<< @/tutorials/programs/libraries/minecraft/automatic-doors-door.c0de

## Aufbauen und starten

Stell dich südlich vom Platz für den Zeitgeberblock hin und schau nach Norden.

| Was                   | Wo, vom Zeitgeberblock aus gesehen                                         |
| --------------------- | -------------------------------------------------------------------------- |
| die Holztür           | in einer Wand 4 Blöcke nördlich (untere Hälfte auf der Höhe des Zeitgebers) |
| die Platte draußen    | 2 Blöcke nördlich, vor der Tür                                             |
| die Platte drinnen    | 6 Blöcke nördlich, hinter der Tür                                          |

Zwischen jeder Platte und der Tür bleibt ein Block frei: Eine Platte, die die Tür berührt, würde sie selbst mit Redstone öffnen. Stelle den Zeitgeberblock auf `autodoor` und `watch` ein, mit einem Abstand von 10 Ticks. Lauf über die Platte: Die Tür geht auf, bevor du sie erreichst, und hinter dir wieder zu.

<!-- screenshot: automatic-doors-door | the open wooden door seen from outside, the player on the outside plate two blocks in front of it, the inside plate visible through the doorway and the timer block in the foreground -->

## So funktioniert es

- **`someone`** liest beide Platten und gibt `TRUE`, wenn eine von ihnen ein Signal hat. Weil das Programm das zweimal braucht, ist es eine eigene Funktion.
- **Öffnen.** Steht jemand auf einer Platte und ist die Tür zu, öffnet SET_OPEN sie. GET_OPEN verhindert, dass eine offene Tür noch einmal geöffnet wird – und es sagt dem Programm, wo es steht: Tür offen und niemand auf einer Platte heißt, es ist Zeit zu schließen.
- **Die Verzögerung.** Dann schläft der Durchlauf 40 Ticks, zwei Sekunden, und schaut noch einmal auf die Platten. Nur wenn sie immer noch leer sind, geht die Tür zu. Ist inzwischen jemand auf eine Platte getreten, bleibt die Tür offen, und der nächste Durchlauf fängt von vorn an.
- **Ein Durchlauf nach dem anderen.** Solange ein Durchlauf schläft, startet der Zeitgeberblock keinen neuen. Es gibt also nie einen zweiten Durchlauf, der die Tür schließt, während der erste wartet.

## Der Bericht

Das zweite Programm schaut sich eine Liste von Türen an und schreibt die offenen in den Chat. Drei Arrays beschreiben die Türen: ein Name und der Abstand nach Osten (`dx`), oben (`dy`) und Süden (`dz`) vom Auslöserblock. Element `i` jedes Arrays gehört zur selben Tür.

<<< @/tutorials/programs/libraries/minecraft/automatic-doors-report.c0de

Die Zahlen in den Arrays sind ein Beispiel; miss deine eigenen. Drück F3 und schau eine Tür an: „Targeted Block“ zeigt ihr x, y und z. Zieh x, y und z des Auslöserblocks ab, dann hast du `dx`, `dy` und `dz`. Nimm bei einer Tür die untere Hälfte. Stell den Auslöserblock mit seinem Knopf neben dein Bett, stelle ihn auf `doorreport` und `report` ein und drück den Knopf. Der Chat sagt `Open: front door, cellar trapdoor` oder `All doors are closed.`

- **Die Position** jeder Tür wird direkt in der Schleife berechnet: `spot.x` wird `PID.x + dx[i]` und so weiter.
- **Namen verbinden.** `openDoors` ist am Anfang leer. Vor jedem weiteren Namen hängt die Schleife `", "` an, so stehen die Kommas nur zwischen den Namen.

## Probier es selbst

1. Melde die offenen Türen nicht nur – schließ sie auch und sag, welche du geschlossen hast.

::: details Lösung
<<< @/tutorials/programs/libraries/minecraft/automatic-doors-close.c0de

SET_OPEN mit `open FALSE` schließt jede Tür, die GET_OPEN offen findet. Eine geschlossene Tür zu schließen würde nicht schaden, aber so weiß das Programm, was es getan hat.
:::

2. Nimm draußen eine **leichte Wägeplatte** (die goldene): Ihr Signal wächst mit der Zahl der Objekte darauf. Lass die Tür nur aufgehen, wenn mindestens zwei darauf stehen, zum Beispiel du und dein Pferd.

::: details Lösung
`someone` bekommt `ASSIGN result outside ≥ 2 OR inside > 0 ;`. Eine Holz- oder Steindruckplatte gibt immer 15 oder 0, eine Wägeplatte gibt mehr, je mehr darauf ist.
:::

## Mehr dazu

- Die Funktionen dieses Rezepts: [GET_PRESSURE_PLATE](/de/c0de/minecraft/get_pressure_plate), [GET_OPEN](/de/c0de/minecraft/get_open), [SET_OPEN](/de/c0de/minecraft/set_open), [SLEEP](/de/c0de/time/sleep) und [LEN](/de/c0de/reference/functions#len)
- [Projekt: die bewachte Tür](/de/tutorials/learning/guarded-door), die Eisentür mit einer Liste von Freunden
- [Die Welt verändern](/de/c0de/guide/libraries#die-welt-verändern) und [Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen) in der Anleitung
- Der [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock) im Handbuch Auslöser
