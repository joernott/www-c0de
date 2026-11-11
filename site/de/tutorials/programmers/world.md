---
description: Wie c0de-Programme in der Welt leben – Prozesse, PIDs und der Cursor, Auslöser-, Zeitgeber- und Debug-Auslöserblöcke, Karten als Schnittstelle, Ketten mit Trichtern, gesperrte Blätter, Besitzer, Berechtigungen und Disketten.
---

# Programme in der Welt

Ein c0de-Programm hat kein `main`, keine Kommandozeile und keine Dateien. Es liegt auf einem Blatt und wartet, bis ein Auslöserblock eine seiner Funktionen startet. Die Argumente kommen als Karten herein, die Ergebnisse gehen als Karten hinaus, und Trichter tragen sie zum nächsten Auslöserblock weiter. Diese Lektion verbindet zwei Auslöserblöcke zu einer kleinen Kette und erklärt, was wo läuft, wer was darf und wie Programme zwischen Welten wandern.

::: info Was du brauchst
Eine Kreativwelt mit erlaubten Cheats (siehe [Tutorials](/de/tutorials/)), einen **Auslöserblock**, einen **Zeitgeberblock**, einen **Knopf**, zwei **Trichter**, eine **Truhe**, eine **INTEGER-Variablenkarte** mit dem Namen `count`, eine **STRING-Variablenkarte** mit dem Namen `item` und eine **nicht initialisierte Variablenkarte**.
:::

## Das Modell

- **Ein Prozess ist ein Durchlauf einer Funktion.** Ein Auslöserblock startet einen Prozess seines Programms bei der Funktion, die du in seinem Dialog gewählt hast, der Einstiegsfunktion. Ein Programm kann in mehreren Prozessen gleichzeitig laufen, einer pro Auslöserblock, und jeder hat seinen eigenen Cursor und seine eigenen Variablen, auch seine eigene Kopie der globalen. Prozesse teilen sich nichts außer Karten.
- **Die PID ist eine Höhe.** Wenn ein Prozess startet, erscheint ein PID-Block auf der Cursorschiene des Blatts, neben Zeile 0. Seine y-Koordinate ist die PID, die erste freie Höhe von 0 aufwärts gezählt. Der Cursor, eine leuchtende Säule auf der Schiene, arbeitet dann das Programm durch, eine Zeile pro Tick.
- **Drei Arten zu starten.** Der **Auslöserblock** startet einen Prozess bei einem Redstone-Impuls, der **Zeitgeberblock** alle paar Ticks (20 Ticks sind eine Sekunde; ein Redstone-Signal pausiert ihn), und der **Debug-Auslöserblock** startet einen roten Debug-Cursor, den du mit dem Debugging-Werkzeug Zeile für Zeile bewegst.
- **Karten sind die Schnittstelle.** Jeder Parameter der Einstiegsfunktion bekommt die Variablen- oder Konstantenkarte mit seinem Namen aus dem Eingabeinventar. Jedes Ergebnis geht als Variablenkarte ins Ausgabeinventar. Initialisierte Karten, die kein Parameter nimmt, werden unverändert durchgereicht.
- **Das Programm weiß, wo es läuft.** Die eingebauten Konstanten `PID` (z. B. `PID.pid`, `PID.owner`, `PID.activator`, die Position `PID.x`, `PID.y`, `PID.z` des Auslöserblocks), `SHEET` (z. B. `SHEET.number`, `SHEET.owner`) und `CURSOR` beschreiben den Prozess, das Blatt und den Cursor.

Verglichen mit einer Shell ist ein Auslöserblock ein Befehl mit benannten Argumenten, das Ausgabeinventar seine Standardausgabe, der Exit-Code sein Exit-Status und ein Trichter die Pipe.

## Das Programm

Zwei Funktionen für einen Lagerraum. `pack` zählt, wie viele volle Stapel zu 64 und wie viele einzelne Gegenstände eine Anzahl von Gegenständen ergibt; `describe` macht daraus eine Beschriftung.

<<< @/tutorials/programs/programmers/world-storage.c0de

## Die Kette bauen

1. Setze einen Auslöserblock **A** mit einem Knopf daran und stelle ihn auf das Programm `storage` und die Funktion `pack` ein.
2. Setze einen Trichter unter A, der zur Seite zeigt. Ein Trichter unter einem Auslöserblock leert seine Ausgabe.
3. Setze einen Zeitgeberblock **B** dorthin, wohin dieser Trichter zeigt, und stelle ihn auf die Funktion `describe` und einen Abstand von 20 Ticks ein. Ein Trichter neben einem Auslöserblock füllt seine Eingabe.
4. Setze einen zweiten Trichter unter B, der in eine Truhe zeigt.
5. Lege drei Karten in das Eingabeinventar von A: `count` = 200, `item` = `"cobblestone"` und eine nicht initialisierte Karte. Drücke den Knopf.

| Schritt                | Nimmt                                                                                                     | Gibt                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| A führt `pack` aus     | `count`; eine nicht initialisierte Karte, weil `pack` zwei Ergebnisse hat und eine Parameterkarte bekommt | `stacks` = 3, `rest` = 8 und `item`, durchgereicht                      |
| der Trichter           | alles aus der Ausgabe von A                                                                               | alles in die Eingabe von B                                              |
| B führt `describe` aus | `item`, `stacks`, `rest`                                                                                  | `text` = `"cobblestone: 3 stacks and 8"` und zwei leere Variablenkarten |
| der zweite Trichter    | alles aus der Ausgabe von B                                                                               | alles in die Truhe                                                      |

Der Zeitgeberblock startet `describe` erst, wenn seine Eingabe für jeden Parameter eine Karte enthält, also wartet er, bis alle drei Karten angekommen sind. Die zwei leeren Karten am Ende gleichen die Parameter aus, die kein Ergebnis hatten: Aus einem Prozess kommen so viele Karten heraus, wie hineingehen. Lege sie für den nächsten Durchlauf zurück in A.

Du kannst beide Funktionen ohne die Kette testen: Der Programm-Runner führt `pack` mit `count` = 200 und `describe` mit den drei Werten oben aus, und der Debug-Auslöserblock führt sie im Spiel Schritt für Schritt aus.

## So funktioniert es

- **Durchreichen macht die Kette.** `pack` kennt `item` nicht. Weil kein Parameter es nimmt, geht es durch in die Ausgabe und weiter zu `describe`. In längeren Ketten nimmt jeder Prozess, was er braucht, und reicht den Rest weiter; das Ende der Kette sammelt alles.
- **Automatische Ausgabe.** Wenn genau ein Block mit Inventar einen Auslöserblock berührt, geht die Ausgabe von selbst dorthin; ein anderer Auslöserblock zählt auch, ein Trichter, der in den Auslöserblock zeigt, nicht. So bilden zwei Auslöserblöcke nebeneinander eine Kette ohne Trichter.
- **Wenn ein Auslöserblock nicht startet.** Er hat kein Programm oder keine Funktion, sein letzter Prozess läuft noch, eine Karte für einen Parameter ohne Standardwert fehlt, eine nicht initialisierte Karte für ein Ergebnis fehlt, oder das Ausgabeinventar hat zu wenige freie Plätze. Ein Zeitgeberblock versucht es einfach beim nächsten Abstand wieder.
- **Exit-Codes.** Ein Komparator liest den Exit-Code des letzten Prozesses aus dem Auslöserblock: 0 nach einem normalen Ende, den Wert von EXIT oder 15 nach einem Absturz. Nach einem Absturz gehen alle Karten, die der Prozess genommen hat, unverändert in die Ausgabe, und der Dialog des Auslöserblocks zeigt den Fehler.

## Gesperrte Blätter, Besitzer und Berechtigungen

- **Ein laufendes Programm kann nicht geändert werden.** Solange ein Prozess läuft, kann niemand Blöcke auf seinem Blatt setzen oder abbauen, nicht einmal Kolben oder Explosionen; der Schraubenschlüssel, der Hammer und die Zange funktionieren dort nicht, und die Dialoge seiner Blöcke öffnen sich schreibgeschützt. Pausiere einen schnellen Zeitgeberblock mit einem Hebel, bevor du sein Programm bearbeitest. Ein hängender Prozess wird beendet, indem du seinen PID-Block mit dem Debugging-Werkzeug bei gedrückter Umschalttaste mit rechts anklickst; er stürzt mit PROCESS_ABORTED ab.
- **Blätter haben Besitzer.** Der erste Spieler, der auf einem leeren Blatt baut, besitzt es. Nur der Besitzer und Administratoren können es ändern.
- **Auslöserblöcke haben Besitzer.** Der Spieler, der einen Auslöserblock zuletzt eingerichtet hat, besitzt ihn, und seine Programme handeln im Namen dieses Spielers. Der Knopf **Starten durch** in seinem Dialog legt fest, wer ihn starten darf: _Nur mich_, _Spieler_, _Mobs_ oder _Alle_ (auch einfaches Redstone).
- **Die Welt zu verändern braucht Rechte.** Die Funktionen von c0de/minecraft, die Gegenstände bewegen, Blöcke setzen oder entfernen, etwas erscheinen lassen oder teleportieren, funktionieren nur, wenn der Besitzer ein Administrator ist oder wenn der Server sie in `config/c0de.properties` erlaubt:

| Einstellung             | Funktionen                                   |
| ----------------------- | -------------------------------------------- |
| `allowInventoryChanges` | MOVE_ITEMS, DELETE_ITEMS                     |
| `allowBlockChanges`     | PLACE_BLOCK (ohne `inventory`), REMOVE_BLOCK |
| `allowSpawning`         | SPAWN_ITEM, SPAWN_ENTITY                     |
| `allowTeleporting`      | TELEPORT                                     |

Alle vier sind standardmäßig aus. Ohne das Recht löst die Funktion PERMISSION_DENIED aus; hat ein Spieler, der kein Administrator ist, den Prozess gestartet, stürzt er stattdessen ab. Die Rechte eines Administrators zählen nur für Programme auf Blättern, die einem Administrator oder niemandem gehören, damit niemand sein eigenes Programm mit dem Auslöserblock eines Administrators ausführen kann.

## Disketten

Eine **c0de-Diskette** trägt ein Programm. Klicke den PROGRAM-Block mit ihr mit rechts an, um das Programm zu kopieren; das funktioniert auch, während es läuft. Klicke mit rechts auf den Boden am Anfang eines leeren Blatts (x=5, Zeile 0), um es wieder zu bauen; ein Programm mit demselben Namen darf noch nicht existieren. Ein **Diskettenlaufwerk** speichert das Programm einer Diskette als Datei im Ordner `c0de` deines Minecraft, neben `saves`, und lädt solche Dateien auf eine Diskette. So sicherst du Programme und gibst sie an Freunde weiter.

## Unterschiede, über die du stolpern wirst

- Es gibt kein `main`. Jede Funktion kann eine Einstiegsfunktion sein; der Auslöserblock entscheidet, welche.
- Jeder Prozess hat seine eigenen Variablen. Zwei Prozesse desselben Programms, sogar zwei Durchläufe desselben Auslöserblocks, teilen sich keine globalen Variablen; nur Karten wandern zwischen ihnen.
- Ein Auslöserblock startet nichts, solange sein letzter Prozess läuft. Ein Auslöserblock ist ein Prozess zur Zeit.
- Parameterkarten werden verbraucht. Ein Ergebnis mit demselben Namen gibt es nicht (Namen sind in einer Funktion eindeutig), also muss ein Wert, den eine spätere Stufe braucht, stattdessen durchgereicht werden.
- Fehlende Karten lösen keinen Fehler aus: Der Auslöserblock startet einfach nicht. Sieh im Dialog nach.
- Das Blatt ist gesperrt, solange das Programm läuft. Ein Zeitgeberblock, der jeden Tick einen Prozess startet, hält es gesperrt.
- Der Cursor schafft eine Zeile pro Tick. Programme sind langsam; eine Schleife über tausend Zeilen dauert fast eine Minute.
- Programme handeln mit den Rechten des Besitzers des Auslöserblocks, nicht des Spielers, der den Knopf gedrückt hat – aber ein Spieler, der kein Administrator ist, kann eine eingeschränkte Funktion den Prozess zum Absturz bringen lassen.

## Probier es selbst

1. Lass `pack` mit Exit-Code 1 enden, wenn `count` 0 ist, und stelle einen Komparator mit einer Lampe neben Auslöserblock A.

::: details Lösung
<<< @/tutorials/programs/programmers/world-empty.c0de

Mit `count` = 0 endet der Prozess mit Exit-Code 1, und die Lampe leuchtet. EXIT schreibt trotzdem die Ergebnisse, `stacks` und `rest` sind 0, also meldet `describe` `cobblestone: 0 stacks and 0`. Mit `count` = 130 ist der Exit-Code 0, und die Ergebnisse sind 2 und 2.
:::

2. Beide Auslöserblöcke führen das Programm `storage` aus. Könnte `pack` den Namen des Gegenstands in einer globalen Variablen für `describe` ablegen?

::: details Lösung
Nein. Jeder Prozess hat seinen eigenen Cursor mit seinem eigenen Stack, und dort leben seine globalen Variablen. `describe` sähe den Startwert der globalen Variablen, nicht das, was `pack` zugewiesen hat. Werte wandern zwischen Prozessen nur als Karten.
:::

## Mehr dazu

- [Programme ausführen](/de/c0de/guide/running-programs): [Drei Auslöserblöcke](/de/c0de/guide/running-programs#drei-auslöserblöcke), [Was ein Prozess nimmt](/de/c0de/guide/running-programs#was-ein-prozess-nimmt), [Verketten](/de/c0de/guide/running-programs#verketten), [Geschützte Programme](/de/c0de/guide/running-programs#geschützte-programme) und [PID-Blöcke](/de/c0de/guide/running-programs#pid-blöcke)
- [Bibliotheken: Besitzer und Berechtigungen](/de/c0de/guide/libraries#besitzer-und-berechtigungen)
- Handbuch Auslöser: [Auslöserblock](/de/c0de/reference/triggers#auslöserblock), [Zeitgeberblock](/de/c0de/reference/triggers#zeitgeberblock), [Debug-Auslöserblock](/de/c0de/reference/triggers#debug-auslöserblock) und [PID-Block](/de/c0de/reference/triggers#pid-block)
- Handbuch Werkzeuge: [c0de-Diskette](/de/c0de/reference/tools#c0de-diskette), [Diskettenlaufwerk](/de/c0de/reference/tools#diskettenlaufwerk) und [Variablenkarte](/de/c0de/reference/tools#variablenkarte)
