---
description: Ein Bestellschalter, der dein Postfach liest – IMAP_SERVER, IMAP_SELECT mit der Variablen, die es ändert, IMAP_SEARCH mit Kriterien, IMAP_FETCH mit und ohne Text, IMAP_STORE mit Flags und IMAP_MOVE.
---

# Der Bestellschalter

Deine Nachbarn bestellen Weizen, Karotten und Kürbisse per Mail. Der Bestellschalter schaut in dein Postfach, listet die neuen Bestellungen auf dem Laptop, markiert sie und legt sie in einen Ordner **Orders**. Ein zweiter Knopf zeigt die nächste offene Bestellung mit ihrem Text und markiert sie als beantwortet, wenn du sie gepackt hast.

**Funktionen:** [IMAP_SERVER](/de/c0de_net/mail/imap_server), [MAILBOX](/de/c0de_net/mail/mailbox), [MAIL](/de/c0de_net/mail/mail), [IMAP_SELECT](/de/c0de_net/mail/imap_select), [IMAP_SEARCH](/de/c0de_net/mail/imap_search), [IMAP_FETCH](/de/c0de_net/mail/imap_fetch), [IMAP_STORE](/de/c0de_net/mail/imap_store) und [IMAP_MOVE](/de/c0de_net/mail/imap_move)

::: info Was du brauchst

- die Mod **c0de net** in deinem Spiel
- ein Mailkonto, dessen Anbieter **IMAP** erlaubt – schlag seinen IMAP-Server nach, etwa `imap.example.com`, und den Port, meist 993
- dein App-Passwort als Geheimnis `mailPassword` in deinem Tresor, wie in [Mail von der Farm](/de/tutorials/libraries/c0de_net/mail/farm-mail), und den Tresor offen
- einen Ordner **Orders** in deinem Postfach – leg ihn in deinem Mailprogramm an oder mit dem Programm aus [Das Postfach aufräumen](/de/tutorials/libraries/c0de_net/mail/tidy-mailbox)
- zwei Auslöserblöcke mit Knöpfen, `orders` und `deliver`, einen Laptop und Variablenkarten `server` (STRING) und `port` (INTEGER)

:::

## Die Idee

**IMAP** ist die Art, wie Mailprogramme ein Postfach auf dem Server lesen: Die Nachrichten bleiben dort, in Ordnern wie INBOX, und jedes Programm sieht dasselbe. Der Struct-Typ **IMAP_SERVER** von c0de hält die Verbindung, wie SMTP_SERVER fürs Senden.

Jede Funktion von c0de_net/mail öffnet ihre eigene Verbindung, erledigt ihre Arbeit und schließt sie wieder – zwischen zwei CALL-Zeilen bleibt nichts offen. Woher wissen die Funktionen dann, in welchem Ordner du arbeitest? **IMAP_SELECT** prüft, ob ein Ordner existiert, und schreibt seinen Namen in das Element `folder` deiner IMAP_SERVER-Variablen. Die Funktionen für Nachrichten – IMAP_SEARCH, IMAP_FETCH, IMAP_STORE, IMAP_MOVE und IMAP_EXPUNGE – arbeiten in diesem Ordner. Weil IMAP_SELECT die Variable ändert, gibst du ihm die Variable selbst, keine Berechnung.

Nachrichten haben **UIDs**, Nummern, die in ihrem Ordner eindeutig sind. IMAP_SEARCH gibt die UIDs der Nachrichten zurück, die zu **Kriterien** passen, IMAP_FETCH liest die Nachrichten zu UIDs. Und jede Nachricht hat **Flags**: `\Seen`, sobald sie gelesen ist, `\Answered`, `\Flagged` für die wichtigen, `\Deleted` und `\Draft`. IMAP_STORE setzt und entfernt sie.

## Das Programm

<<< @/tutorials/programs/libraries/mail/order-desk-orders.c0de

## Aufbauen und ausführen

1. Stelle den ersten Auslöserblock auf `orderdesk` / `orders` und den zweiten auf `orderdesk` / `deliver`. Leg die Variablenkarten `server` und `port` in beide und eine nicht initialisierte Variablenkarte für das Ergebnis `count` in den ersten.
2. Binde den Laptop an `orderdesk` / `orders` und drück den ersten Knopf. Der Laptop zeigt, wie viele Nachrichten ungelesen sind, und die neuen Bestellungen:

```
3 of 6 messages unseen
New: Order: 32 wheat
New: Order: 12 carrots
```

Das Ergebnis `count` ist 2. In deinem Mailprogramm sind die beiden Bestellungen nach **Orders** gewandert, mit Markierung, und noch ungelesen.

3. Binde den Laptop an `orderdesk` / `deliver` und drück den zweiten Knopf. Er zeigt die älteste markierte Bestellung, die noch nicht beantwortet ist, mit ihrem Text:

```
Sam <sam@example.com>
Order: 16 eggs
Sixteen eggs for the bakery, by Friday.
```

Drück ihn noch einmal für die nächste Bestellung. Wenn alle erledigt sind, sagt er `No open orders`.

<!-- screenshot: order-desk-laptop | the laptop showing "3 of 6 messages unseen" and the two lines "New: Order: 32 wheat" and "New: Order: 12 carrots", the two trigger blocks of orders and deliver next to it -->

## So funktioniert es

- **IMAP_SELECT** ohne `folder` wählt INBOX und gibt ihre **MAILBOX** zurück: `messages`, `unseen`, `recent`, `uid_next` und `uid_validity`. Nach dem CALL ist `imap.folder` gleich `"INBOX"`.
- **Die Kriterien** `UNSEEN SUBJECT Order:` sind Wörter von IMAP, und alle müssen passen: ungelesen, mit `Order:` im Betreff. Andere sind `SEEN`, `FLAGGED`, `UNANSWERED`, `FROM alex`, `SINCE 1-Nov-2026` und mehr – die Seite von [IMAP_SEARCH](/de/c0de_net/mail/imap_search) listet sie. Ein Text mit Leerzeichen kommt in doppelte Anführungszeichen, in einem Text als `\"` geschrieben: `"SUBJECT \"wheat order\""`.
- **IMAP_FETCH** gibt eine Liste von **MAIL**-Structs zurück: `uid`, `from`, `to`, `cc`, `subject`, `date`, `text`, `flags` und `size`. Mit `text` FALSE liest es alles außer dem Text, was schneller ist und die Nachricht **ungelesen** lässt – dein Mailprogramm zeigt sie weiter als neu. In `deliver` liest es den Text, und die Nachricht wird `\Seen`, wie wenn du sie öffnest.
- **IMAP_STORE** fügt Flags standardmäßig hinzu. In der Textschreibweise wird ein Backslash doppelt geschrieben: `"\\Flagged"` ist das Flag `\Flagged`. `mode "remove"` nimmt ein Flag weg, `mode "set"` ersetzt alle.
- **IMAP_MOVE** legt die Nachrichten in einen anderen Ordner desselben Postfachs. In INBOX sind sie weg; in **Orders** bekommen sie neue UIDs.
- **`deliver`** wählt **Orders**, sucht `FLAGGED UNANSWERED` und nimmt die erste UID, `uids[0]` – die UIDs kommen älteste zuerst. Nach dem Anzeigen fügt es `\Answered` hinzu und entfernt `\Flagged`, damit der nächste Druck die nächste zeigt.

Die Funktionen nehmen eine UID oder eine Liste, `uids[0]` und `uids` gehen also beide.

## Probier es selbst

1. Die Bestellungen sollen beim Eintreffen gleich mit ihrem Text gezeigt werden.

::: details Lösung
Lass in `orders` die Zeile `PARAMETER text FALSE ;` weg und gib in der EACH-Schleife `letter.text` aus. Bedenke, dass dadurch jede neue Bestellung gelesen ist. Ein Laptop hat 20 Zeilen, lange Texte rollen also weg – gib nur die erste Zeile aus: Finde das erste `"\n"` mit [INSTR](/de/c0de/strings/instr) aus c0de/strings und schneide den Text dort mit [LEFT](/de/c0de/strings/left) ab.
:::

2. Nur Bestellungen deiner Nachbarn sollen zählen, nicht die von Fremden.

::: details Lösung
Füge den Kriterien `FROM` hinzu, einmal für jeden Nachbarn, den du annimmst, jeweils in einer eigenen Suche: `"UNSEEN SUBJECT Order: FROM alex@example.com"`. Die Kriterien von c0de kennen kein „oder“, also suche einmal pro Nachbar und verschiebe die UIDs jeder Suche.
:::

## Mehr dazu

- [IMAP_SERVER](/de/c0de_net/mail/imap_server), [MAIL](/de/c0de_net/mail/mail) und [MAILBOX](/de/c0de_net/mail/mailbox)
- [IMAP_SEARCH](/de/c0de_net/mail/imap_search): alle Kriterien
- [Bestellungen lesen](/de/c0de_net/http/examples#bestellungen-lesen) im Handbuch
- [Das Postfach aufräumen](/de/tutorials/libraries/c0de_net/mail/tidy-mailbox)
