---
description: Eine Eisentür, die aufgeht, wenn du auf einem Laptop das richtige Passwort tippst – verborgene Eingabe mit INPUT und hide, das Passwort in deinem Tresor mit SET_SECRET und SECRET, HAS_SECRET vor dem Lesen und DELETE_SECRET zum Vergessen.
---

# Eine Tür mit Passwort

Eine Eisentür, die aufgeht, wenn du auf dem Laptop daneben das Passwort tippst. Während du tippst, zeigt der Laptop nur Sternchen. Das Passwort steht nirgends in der Welt: nicht auf dem Blatt, nicht in einer Karte. Es liegt in deinem Tresor, und wenn du den Server verlässt, vergisst der Tresor es – die Tür bleibt zu, bis du ein neues festlegst.

**Funktionen:** [SET_SECRET](/de/c0de/security/set_secret), [HAS_SECRET](/de/c0de/security/has_secret), [DELETE_SECRET](/de/c0de/security/delete_secret) und [INPUT](/de/c0de/reference/functions#input) mit `hide`

::: info Was du brauchst

- ein leeres Blatt, einen **SECRET-Block** (ein CONSTANT-Block und ein Eisenbarren) und zwei **TAG-Blöcke**
- drei **Auslöserblöcke** mit je einem **Knopf**: einen für die Tür, einen zum Festlegen des Passworts, einen zum Vergessen
- zwei **Laptops**, einen **Komparator** und eine **Eisentür**
- keine Rechte: Die Tür geht über Redstone auf, und das darf jeder Spieler

:::

## Die Idee

Ein Passwort auf dem Blatt ist kein Geheimnis: Jeder, der das Blatt besucht, kann seine LITERAL-Blöcke lesen. Eine [verborgene Karte](/de/c0de/reference/tools#verborgene-karten) ist besser, aber ihr Wert liegt trotzdem in der Welt, in einem Auslöserblock. c0de/security hat einen besseren Ort: deinen **Tresor**. Jeder Spieler hat einen, solange er online ist. SET_SECRET legt einen Wert unter einem Namen hinein, und eine SECRET-Zeile liest ihn wieder, wie eine Konstante.

Der Tresor hat zwei Regeln, die die Tür prägen:

- **Nur du.** Ein Programm bekommt nur den Tresor des Spielers, der es gestartet hat, und nur, wenn diesem Spieler das Blatt gehört. Drückt jemand anderes den Knopf, hat das Programm keinen Tresor, und c0de/security löst VAULT_UNAVAILABLE aus. Die Tür hört also nur auf dich, und auf dich nur mit dem Passwort – wie die PIN eines Handys.
- **Nur, solange du online bist.** Der Tresor ist leer, wenn du dem Server beitrittst. Die Tür braucht also einen Weg, das Passwort festzulegen (`setup`), und einen Weg zu fragen, ob es eins gibt: HAS_SECRET. Eine SECRET-Zeile für einen Namen, der nicht im Tresor ist, löst SECRET_NOT_FOUND aus.

Auch das Tippen soll geheim sein: INPUT mit `PARAMETER hide TRUE ;` zeigt für jedes Zeichen ein `*`, und der Laptop schreibt die Zeile als `***`. Und der Tag `security: "sensitive"` hält das Passwort aus dem Debugging-Werkzeug heraus.

Die Tür selbst öffnet der **Exit-Code**: Ein Komparator neben dem Auslöserblock gibt ein Signal so stark wie der Exit-Code des letzten Prozesses aus. `EXIT 1 ;` für das richtige Passwort, 0 für alles andere.

## Das Programm

<<< @/tutorials/programs/libraries/security/password-door-door.c0de

## So baust und startest du es

1. Setze die Eisentür in die Wand. Platziere den Auslöserblock für die Tür daneben, mit einem Komparator dazwischen, der vom Auslöserblock zur Tür zeigt. Setze einen Knopf an den Auslöserblock und den Laptop daneben.
2. Stelle den Auslöserblock auf das Programm `passdoor` und die Funktion `open` ein und seinen Knopf **Starten durch** auf *Nur mich*. Binde auch den Laptop an `passdoor` und `open`.
3. Richte drinnen in deiner Basis den zweiten Auslöserblock mit einem Knopf für die Funktion `setup` ein, mit einem zweiten Laptop, der an `passdoor` und `setup` gebunden ist, und den dritten Auslöserblock für `forget`. Stelle auch bei ihnen **Starten durch** auf *Nur mich*.
4. Drücke den Knopf von `setup`. Der Laptop fragt `New password:`; tippe das Passwort und drücke Enter. Die Zeile zeigt `***`. Tippe es nach `Repeat it:` noch einmal. Der Laptop antwortet `Password set.`

<!-- screenshot: password-door-setup | the laptop of the door after setup: "New password:", "***", "Repeat it:", "***" and "Password set." -->

5. Drücke den Knopf der Tür. Der Laptop fragt `Password:`. Tippe das Passwort: Die Tür geht auf, und der Laptop sagt `Welcome home!`. Ein falsches Passwort bekommt `Wrong password.`, und die Tür bleibt zu.

<!-- screenshot: password-door-open | the iron door open, the comparator between the trigger block and the door lit, the laptop next to it showing "Password:", "***" and "Welcome home!" -->

Um die Tür zu schließen, drücke den Knopf noch einmal: Solange ein Prozess läuft, gibt der Komparator 0 aus, die Tür geht also zu, während der Laptop nach dem Passwort fragt.

Verlasse den Server, tritt wieder bei und drücke den Knopf: `No password yet. Run setup first.` Der Tresor hat das Passwort vergessen. Der Knopf von `forget` macht dasselbe mit Absicht: `Password forgotten. The door stays shut.`

## So funktioniert es

- **Der Name des Geheimnisses** ist die Konstante `NAME`, `"doorPassword"`. SET_SECRET, HAS_SECRET und DELETE_SECRET nehmen ihn als STRING. Die SECRET-Zeile in `check` nennt dasselbe Geheimnis mit einem LABEL, `doorPassword`, denn eine SECRET-Zeile ist eine Deklaration, wie CONSTANT.
- **`setup`** liest das Passwort zweimal mit verborgenem INPUT, vergleicht die beiden und legt es mit SET_SECRET in den Tresor. Der Typ des Geheimnisses ist der Typ von `value`, hier STRING. Ein zweites `setup` ersetzt das alte Passwort.
- **`open` fragt, bevor es liest.** HAS_SECRET antwortet TRUE oder FALSE, und es ist ein CALL, also kann die Fehlervariable `problem` VAULT_UNAVAILABLE abfangen: Dann hat ein Besucher den Knopf gedrückt (wenn **Starten durch** *Spieler* erlaubt), und die Tür sagt das, statt abzustürzen. Erst wenn das Passwort da ist, ruft `open` die Funktion `check` auf.
- **`check` liest das Geheimnis.** Der Wert wird gelesen, wenn der Cursor die SECRET-Zeile ausführt, darum ist `check` eine eigene Funktion, die erst nach HAS_SECRET läuft. Ihr Wert ist sensibel: Das Debugging-Werkzeug zeigt `***` für `doorPassword`. `typed` hat den Tag `security: "sensitive"`, und `password` und `again` in `setup` auch – ohne ihn würde das Debugging-Werkzeug zeigen, was du getippt hast.
- **Abstürze öffnen Türen.** Ein Prozess, der abstürzt, endet mit dem Exit-Code 15, und der öffnet die Tür auch. Darum vermeidet `open` jeden Absturz, den es kann: Es prüft zuerst mit HAS_SECRET und fängt VAULT_UNAVAILABLE ab.
- **`forget`** entfernt das Geheimnis mit DELETE_SECRET. Ein Geheimnis, das nicht da ist, löst SECRET_NOT_FOUND aus, und `problem` fängt es ab.

## Probier es selbst

1. Gib dem Besucher drei Versuche, bevor die Tür aufgibt.

::: details Lösung
<<< @/tutorials/programs/libraries/security/password-door-tries.c0de

Die REPEAT-Schleife ruft `check` auf, bis das Passwort stimmt oder `tries` 3 erreicht. Jeder Aufruf von `check` liest das Geheimnis neu – das ist erlaubt, eine SECRET-Zeile darf so oft laufen, wie du willst.
:::

2. `setup` ersetzt das Passwort, ohne zu fragen. Lass es zuerst nach dem alten Passwort fragen, wenn es eins gibt – wie ein Handy, das die alte PIN will, bevor du eine neue wählst.

::: details Lösung
<<< @/tutorials/programs/libraries/security/password-door-change.c0de

`setup` fragt zuerst HAS_SECRET. Gibt es ein Passwort, ruft es `check` auf und hört nach einem falschen mit `Wrong password. Nothing changed.` auf. Ohne Passwort, beim ersten `setup` nach dem Beitreten, fragt es gleich nach dem neuen.
:::

## Mehr dazu

- [c0de/security](/de/c0de/security/): [SET_SECRET](/de/c0de/security/set_secret), [HAS_SECRET](/de/c0de/security/has_secret), [DELETE_SECRET](/de/c0de/security/delete_secret)
- [c0de/security](/de/c0de/guide/libraries#c0desecurity) und [Geheimnisse im Tresor](/de/c0de/guide/libraries#geheimnisse-im-tresor) im Leitfaden
- [SECRET](/de/c0de/reference/data#secret) und [TAG](/de/c0de/reference/data#tag) im Handbuch Daten, [Verborgene Karten](/de/c0de/reference/tools#verborgene-karten) im Handbuch Werkzeuge
- [INPUT](/de/c0de/reference/functions#input) und der [Laptop](/de/c0de/reference/devices#laptop)
- [Exit-Codes](/de/c0de/guide/running-programs#exit-codes) und [Fehler](/de/c0de/guide/language#fehler)
- [Schlüssel aufbewahren](/de/tutorials/libraries/c0de/security/keeping-keys): Geheimnisse, die bleiben, wenn du gehst
