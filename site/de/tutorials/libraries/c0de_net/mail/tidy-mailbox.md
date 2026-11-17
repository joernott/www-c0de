---
description: Der jährliche Hausputz eines Postfachs – IMAP_LIST mit Mustern, IMAP_CREATE, IMAP_RENAME und IMAP_DELETE für Ordner, IMAP_STORE mit \Deleted, IMAP_EXPUNGE und IMAP_STATUS.
---

# Das Postfach aufräumen

Ein Postfach läuft voll. Einmal im Jahr schafft dieses Programm Platz: Der Ordner **Archive** des letzten Jahres bekommt die Jahreszahl in den Namen, ein neues leeres **Archive** beginnt, das Archiv von vor zwei Jahren wird gelöscht, und alte Dorfnachrichten, die du schon gelesen hast, verschwinden aus der INBOX. Am Ende zeigt es, wie voll die INBOX ist.

**Funktionen:** [IMAP_LIST](/de/c0de_net/mail/imap_list), [IMAP_CREATE](/de/c0de_net/mail/imap_create), [IMAP_RENAME](/de/c0de_net/mail/imap_rename), [IMAP_DELETE](/de/c0de_net/mail/imap_delete), [IMAP_STORE](/de/c0de_net/mail/imap_store), [IMAP_EXPUNGE](/de/c0de_net/mail/imap_expunge) und [IMAP_STATUS](/de/c0de_net/mail/imap_status)

::: info Was du brauchst

- die Mod **c0de net**, ein Mailkonto mit IMAP und dein App-Passwort als Geheimnis `mailPassword` in deinem offenen Tresor, wie in [Der Bestellschalter](/de/tutorials/libraries/c0de_net/mail/order-desk)
- einen Auslöserblock mit Knopf, einen Laptop und Variablenkarten `server` (STRING) und `port` (INTEGER)
- ein Postfach, das du aufräumen magst: **IMAP_DELETE löscht einen Ordner mit allen Nachrichten**, und IMAP_EXPUNGE entfernt Nachrichten endgültig. Probier es zuerst mit einem zweiten Konto.

:::

## Die Idee

Ordner verwalten fünf Funktionen:

- **IMAP_LIST** gibt die Namen der Ordner zurück. Sein Muster wählt aus, welche: `*` steht für beliebigen Text, `%` für beliebigen Text innerhalb einer Ordnerebene. `Archive*` findet **Archive**, **Archive 2024** und **Archive 2025**.
- **IMAP_CREATE**, **IMAP_RENAME** und **IMAP_DELETE** legen einen Ordner an, benennen ihn um und löschen ihn.
- **IMAP_STATUS** gibt die MAILBOX eines Ordners zurück – wie viele Nachrichten, wie viele ungelesen –, ohne ihn auszuwählen.

Nachrichten löschen geht in IMAP in zwei Schritten, wie der Papierkorb eines Computers: IMAP_STORE gibt ihnen das Flag `\Deleted`, und **IMAP_EXPUNGE** entfernt alle Nachrichten des ausgewählten Ordners, die es haben. Bis dahin kann ein Mailprogramm sie noch zurückholen.

## Das Programm

<<< @/tutorials/programs/libraries/mail/tidy-mailbox-cleanup.c0de

## Aufbauen und ausführen

1. Stelle den Auslöserblock auf `tidymail` / `cleanup` und binde den Laptop daran. Leg die Variablenkarten `server` und `port` in den Auslöserblock und eine nicht initialisierte Variablenkarte für `removed`.
2. Drück den Knopf. Mit den Ordnern **Archive** und **Archive 2024** und alten Nachrichten in der INBOX zeigt der Laptop:

```
Archive is now Archive 2025
Deleted Archive 2024
Removed 1 old news
INBOX: 5 messages, 3 unseen
```

Die Reihenfolge der ersten beiden Zeilen hängt davon ab, in welcher Reihenfolge der Server die Ordner auflistet. Ein zweiter Druck im selben Jahr findet **Archive 2025**, das jünger als zwei Jahre ist, und ein leeres **Archive**: Er benennt es in **Archive 2025** um – das gibt es schon, also lehnt der Server ab, und das Programm hält mit MAIL_REJECTED an. Räum einmal im Jahr auf, oder probier die erste Übung.

<!-- screenshot: tidy-mailbox-laptop | the laptop after the clean-up with the four lines "Archive is now Archive 2025", "Deleted Archive 2024", "Removed 1 old news" and "INBOX: 5 messages, 3 unseen" -->

## So funktioniert es

- **Die Namen** der Archive entstehen aus dem Parameter `year`: `"Archive " ⊕ ( year - 2 )` ist `"Archive 2024"`. Die Klammern sorgen dafür, dass das Jahr ausgerechnet wird, bevor es an den Text gehängt wird.
- **IMAP_LIST** mit `Archive*` gibt nur die Namen der Archive zurück. EACH geht sie durch: Das älteste wird gelöscht, und **Archive** wird auf das Vorjahr umbenannt und mit IMAP_CREATE neu angelegt.
- **IMAP_SELECT** wählt INBOX, damit die Funktionen für Nachrichten wissen, wo sie arbeiten. Die Kriterien `SEEN SUBJECT "Village news"` finden die Nachrichten, die du gelesen hast; die Anführungszeichen halten die beiden Wörter zusammen. Im Dialog des Literals tippst du sie, wie sie sind; die Textschreibweise des Programms schreibt sie `\"`.
- **IMAP_STORE** fügt ihnen `\Deleted` hinzu – im Dialog als `\Deleted` getippt, in der Textschreibweise `"\\Deleted"` geschrieben – und **IMAP_EXPUNGE** entfernt sie und gibt zurück, wie viele – das Ergebnis `removed`.
- **IMAP_STATUS** liest am Ende die MAILBOX der INBOX. Anders als IMAP_SELECT ändert es `imap.folder` nicht.

## Probier es selbst

1. Mach das Programm sicher gegen zweimal Drücken: Benenne **Archive** nur um, wenn es noch kein Archiv des letzten Jahres gibt.

::: details Lösung
Such vor der EACH-Schleife nach `last` in `folders`: eine zweite EACH-Schleife, die ein BOOLEAN `done` setzt, wenn ein Name gleich `last` ist. Benenne **Archive** dann nur um, `IF name = "Archive" AND NOT done`. Ein zweiter Druck zeigt nur `Removed 0 old news` und den Status.
:::

2. Zeig vor dem Löschen des ältesten Archivs, wie viele Nachrichten mit ihm verloren gehen.

::: details Lösung
Rufe vor IMAP_DELETE IMAP_STATUS mit `PARAMETER folder name ;` und einer MAILBOX-Variablen auf und gib ihr `messages` aus: `"Deleted " ⊕ name ⊕ " with " ⊕ box.messages ⊕ " messages"`.
:::

## Mehr dazu

- [IMAP_LIST](/de/c0de_net/mail/imap_list), [IMAP_STATUS](/de/c0de_net/mail/imap_status) und [IMAP_EXPUNGE](/de/c0de_net/mail/imap_expunge)
- [Der Bestellschalter](/de/tutorials/libraries/c0de_net/mail/order-desk): Ordner auswählen und Flags
- [Wenn Mails scheitern](/de/tutorials/libraries/c0de_net/mail/mail-errors): MAIL_REJECTED und die anderen Fehler
