---
description: Bewahre einen API-Schlüssel dauerhaft in deinem dauerhaften Tresor auf, einer KeePass-Datei, die nur dein Spiel entschlüsseln kann – HAS_VAULT, CREATE_VAULT, IS_VAULT_OPEN und OPEN_VAULT mit ihrem Passwortdialog und SET_SECRET mit persistent.
---

# Schlüssel aufbewahren

Du tippst den Schlüssel eines Webdienstes einmal ein, und er ist am nächsten Tag noch da und am Tag danach auch: in deinem **dauerhaften Tresor**, einer KeePass-Datei, die nur dein Spiel mit deinem Passwort öffnen kann. Das Programm legt den Tresor beim ersten Mal an, öffnet ihn an späteren Tagen, bewahrt den Schlüssel auf und zeigt seine letzten vier Zeichen, damit du siehst, welcher Schlüssel es ist, ohne ihn zu zeigen.

**Funktionen:** [HAS_VAULT](/de/c0de/security/has_vault), [CREATE_VAULT](/de/c0de/security/create_vault), [IS_VAULT_OPEN](/de/c0de/security/is_vault_open), [OPEN_VAULT](/de/c0de/security/open_vault), [SET_SECRET](/de/c0de/security/set_secret) mit `persistent`, [HAS_SECRET](/de/c0de/security/has_secret) und [RIGHT](/de/c0de/strings/right) aus c0de/strings

::: info Was du brauchst

- ein leeres Blatt, einen **SECRET-Block** und einen **TAG-Block**
- zwei **Auslöserblöcke** mit je einem **Knopf**, einen für `store` und einen für `show`, und einen **Laptop**
- einen Schlüssel oder Code, den du aufbewahren willst – für einen ersten Versuch einen beliebigen ausgedachten Text wie `wx-3f9a-77c2-d00d`

:::

## Die Idee

Der Tresor der [Tür mit Passwort](/de/tutorials/libraries/c0de/security/password-door) vergisst alles, wenn du gehst. Für ein Passwort, das du jeden Tag neu wählst, ist das in Ordnung, aber nicht für einen Schlüssel, den dir ein Webdienst einmal gegeben hat, wie das Token der [Hausautomation](/de/tutorials/libraries/c0de_net/http/home-automation). Dafür kann jeder Spieler einen **dauerhaften Tresor** haben: eine Datei im KeePass-Format auf dem Server, verschlüsselt mit einem Passwort, das nur du kennst.

Der Server bewahrt die Datei auf, kann sie aber nicht öffnen. Die Arbeit macht dein Spiel:

- **CREATE_VAULT** fragt dich nach einem neuen Passwort, macht in deinem Spiel eine leere KeePass-Datei, verschlüsselt sie und schickt sie an den Server.
- **OPEN_VAULT** fragt nach dem Passwort, holt die Datei vom Server, entschlüsselt sie in deinem Spiel und legt ihre Geheimnisse in deinen Tresor, wo SECRET-Zeilen sie finden. Er bleibt offen, bis du gehst.
- **SET_SECRET mit `persistent` TRUE** legt das Geheimnis in den Tresor und in die Datei: Dein Spiel ändert die Datei, verschlüsselt sie neu und schickt sie zurück.

HAS_VAULT sagt, ob du schon eine Datei hast, IS_VAULT_OPEN, ob sie offen ist. Mit diesen beiden macht eine Funktion `unlock` jedes Mal das Richtige: nichts, wenn der Tresor offen ist, OPEN_VAULT, wenn es eine Datei gibt, CREATE_VAULT, wenn nicht.

## Das Programm

<<< @/tutorials/programs/libraries/security/keeping-keys-keys.c0de

## So baust und startest du es

1. Stelle den ersten Auslöserblock auf das Programm `keys` und die Funktion `store` ein, den zweiten auf `show`. Stelle bei beiden **Starten durch** auf *Nur mich*: Der Tresor funktioniert sowieso nur für dich. Lass ihre Eingabeinventare leer – keine Karte für `password`.
2. Binde den Laptop an `keys` und `store`.
3. Drücke den Knopf von `store`. Da du noch keinen dauerhaften Tresor hast, öffnet dein Spiel den Dialog **Deinen Tresor anlegen** mit zwei Feldern, **Passwort** und **Wiederholen**. OK geht nur, wenn beide gleich sind. Wähle ein gutes Passwort und merke es dir: Ohne es kann niemand den Tresor öffnen, auch nicht der Administrator.

<!-- screenshot: keeping-keys-create | the dialog "Create your vault" with the fields Password and Repeat filled with dots, and the buttons OK and Cancel -->

4. Der Laptop zeigt `Your new vault is ready.` und `Key:`. Tippe deinen Schlüssel: Die Zeile zeigt für jedes Zeichen ein `*`. Nach Enter wartet der Cursor einen Moment, während dein Spiel die Datei verschlüsselt, und der Laptop sagt `Key kept in your vault.`
5. Binde den Laptop an `keys` und `show` und drücke den Knopf von `show`. Der Tresor ist noch offen, also kommt kein Dialog, und der Laptop zeigt `Your key ends with ...d00d`.

Verlasse jetzt den Server, tritt wieder bei und drücke den Knopf von `show`. Dein Tresor ist zu, also fragt der Dialog **Deinen Tresor öffnen** nach dem Passwort. Ein falsches bekommt im Dialog `Falsches Passwort, versuch es noch einmal`, und der Dialog bleibt offen. Mit dem richtigen zeigt der Laptop wieder das Ende deines Schlüssels. **Abbrechen** schließt den Dialog, und der Laptop sagt `Cancelled. Your vault stays shut.`

<!-- screenshot: keeping-keys-open | the dialog "Open your vault" with one password field, the message "Wrong password, try again" below it -->

Jedes deiner Programme kann den Schlüssel jetzt verwenden: den Tresor öffnen, dann `SECRET apiKey STRING`.

## So funktioniert es

- **`unlock`** entscheidet mit IS_VAULT_OPEN und HAS_VAULT, die nie etwas fragen. Nur OPEN_VAULT und CREATE_VAULT öffnen einen Dialog, und der Cursor wartet in ihrer CALL-Zeile, bis du ihn beantwortest. Die Fehlervariable `problem` fängt VAULT_CANCELLED für den Abbrechen-Knopf ab und jeden anderen Fehler (wie WRONG_PASSWORD) mit seiner Meldung.
- **Der Parameter `password`** hat den Standardwert `""`, und der heißt: den Spieler fragen. Lass ihn im Spiel leer – ein Passwort, das du im Dialog tippst, verlässt dein Spiel nie. Ein Passwort als Parameter schickt der Server an dein Spiel, er sieht es also. So öffnet der Programm-Runner der Tests den Tresor: Er hat niemanden, den er fragen kann. Falls du das Passwort je als Karte übergibst, mach sie zu einer [verborgenen Karte](/de/c0de/reference/tools#verborgene-karten) (**Wert verbergen**: „Ja, endgültig“).
- **`store`** liest den Schlüssel mit verborgenem INPUT in `key`, das den Tag `security: "sensitive"` hat, und bewahrt ihn mit SET_SECRET und `persistent` TRUE auf. Dafür muss der Tresor offen sein – sonst löst SET_SECRET VAULT_NOT_OPEN aus –, und darum hat sich `unlock` gekümmert. Ein zweites `store` ersetzt den Schlüssel, im Tresor und in der Datei.
- **`show`** fragt zuerst HAS_SECRET, denn eine SECRET-Zeile für ein fehlendes Geheimnis löst SECRET_NOT_FOUND aus. **`peek`** liest es und zeigt mit RIGHT nur die letzten vier Zeichen.

### Was der Server sieht – und was nicht

Der Server sieht **nie**:

- das Passwort, das du im Dialog tippst: Es bleibt in deinem Spiel,
- was in der Datei steht: Er speichert sie nur, verschlüsselt, als `<world>/data/c0de_vaults/<deine UUID>.kdbx`.

Der Server **sieht**:

- deine Geheimnisse, solange der Tresor offen ist: Sie sind in seinem Speicher, wo SECRET-Zeilen sie lesen,
- den Schlüssel, den du auf dem Laptop tippst: INPUT geht über den Server,
- ein Passwort, das ein Programm an CREATE_VAULT oder OPEN_VAULT übergibt.

Der dauerhafte Tresor schützt deine Schlüssel also auf der Festplatte des Servers: in Backups, in Kopien der Welt und während du offline bist. Während du spielst, hat der Server sie im Speicher, wie jeden Wert, den ein Programm verwendet. Und Administratoren können jedes Blatt ändern, auch deins. Verwende den Tresor auf Servern, deren Administratoren du vertraust.

Die Datei ist eine ganz normale KeePass-Datenbank (KDBX 4): Deine Geheimnisse sind Einträge der Gruppe `c0de`, mit dem Namen als Titel und dem Wert als Passwort. Mit einer Kopie der Datei öffnen KeePass und andere Passwortmanager sie mit deinem Passwort.

## Probier es selbst

1. Schreib ein Programm, das dir etwas über deinen Tresor sagt, ohne ihn zu öffnen: ob du einen hast, ob er offen ist und ob der Schlüssel in deinem Tresor ist.

::: details Lösung
<<< @/tutorials/programs/libraries/security/keeping-keys-status.c0de

HAS_VAULT, IS_VAULT_OPEN und HAS_SECRET fragen nie nach einem Passwort. Ein geschlossener Tresor zeigt `Vault: locked` und `Key: not here`: Der Schlüssel ist in der Datei, aber erst in deinem Tresor, wenn OPEN_VAULT ihn hineinlegt.
:::

2. Füge eine Funktion `forget` hinzu, die den Schlüssel endgültig entfernt, aus dem Tresor und aus der Datei.

::: details Lösung
<<< @/tutorials/programs/libraries/security/keeping-keys-forget.c0de

DELETE_SECRET entfernt ein dauerhaftes Geheimnis auch aus der Datei, und dafür muss der Tresor offen sein: Darum ruft `forget` zuerst `unlock` auf. Ein Schlüssel, der nicht da ist, löst SECRET_NOT_FOUND aus, und `problem` fängt es ab.
:::

## Mehr dazu

- [c0de/security](/de/c0de/security/): [HAS_VAULT](/de/c0de/security/has_vault), [CREATE_VAULT](/de/c0de/security/create_vault), [IS_VAULT_OPEN](/de/c0de/security/is_vault_open), [OPEN_VAULT](/de/c0de/security/open_vault), [SET_SECRET](/de/c0de/security/set_secret), [HAS_SECRET](/de/c0de/security/has_secret), [DELETE_SECRET](/de/c0de/security/delete_secret)
- [Geheimnisse im Tresor](/de/c0de/guide/libraries#geheimnisse-im-tresor) im Leitfaden, [SECRET](/de/c0de/reference/data#secret) im Handbuch Daten
- [RIGHT](/de/c0de/strings/right) aus c0de/strings
- [Verborgene Karten](/de/c0de/reference/tools#verborgene-karten) im Handbuch Werkzeuge
- [Eine Tür mit Passwort](/de/tutorials/libraries/c0de/security/password-door): der Tresor ohne Datei
