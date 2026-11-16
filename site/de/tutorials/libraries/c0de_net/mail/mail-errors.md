---
description: Wenn Mails scheitern – die Fehler von c0de_net/mail mit einer freundlichen Meldung für jeden, App-Passwörter, Port 25, die Grenzen des Servers, und den Tresor vor einer SECRET-Zeile prüfen.
---

# Wenn Mails scheitern

Ein falsches Passwort, ein Tippfehler im Servernamen, ein Anbieter, der Programme sperrt: Ein Mailprogramm trifft auf mehr Ärger als die meisten. Dieses Rezept sendet eine Testmail und sagt dem Spieler, wenn es nicht klappt, in einfachen Worten, was zu reparieren ist – das Programm, das du zuerst probierst, wenn du Mails einrichtest.

**Funktionen:** die [Fehler von c0de net](/de/c0de_net/http/errors), [SMTP_SEND](/de/c0de_net/mail/smtp_send), [IMAP_CREATE](/de/c0de_net/mail/imap_create) und [HAS_SECRET](/de/c0de/security/has_secret) aus c0de/security

::: info Was du brauchst
Die Mod **c0de net**, dein Mailkonto und dein App-Passwort wie in [Mail von der Farm](/de/tutorials/libraries/c0de_net/mail/farm-mail), einen Auslöserblock mit Knopf, einen Laptop und Variablenkarten `server` (STRING) und `port` (INTEGER). Für die Übung den IMAP-Server aus [Der Bestellschalter](/de/tutorials/libraries/c0de_net/mail/order-desk).
:::

## Die Idee

Die Funktionen von c0de_net/mail lösen einen Fehler aus, wenn etwas schiefgeht. Ein CALL mit einer ERROR-Variablen fängt ihn ab, und ihr `code` sagt, was passiert ist:

| Code | Name                  | Was passiert ist                                                     | Was zu tun ist                               |
| ---: | --------------------- | -------------------------------------------------------------------- | -------------------------------------------- |
|  309 | INVALID_ARGUMENT      | kein Server oder Absender, eine Adresse, die keine ist, unbekannte Kriterien | korrigiere das Programm                      |
|  311 | PERMISSION_DENIED     | eine Verbindung zu Port 25                                           | nimm Port 465 oder 587 deines Anbieters      |
| 1001 | CLIENT_UNAVAILABLE    | der Spieler ist nicht online oder hat kein c0de net                  | nichts, später nochmal                       |
| 1003 | REQUEST_FAILED        | keine Verbindung: unbekannter Server, abgewiesen, ein Zertifikatsproblem | prüfe Server, Port und `security`            |
| 1004 | REQUEST_TIMEOUT       | der Server hat nicht rechtzeitig geantwortet                         | später nochmal                               |
| 1005 | RESPONSE_TOO_LARGE    | IMAP_FETCH würde zu viel lesen                                       | weniger Nachrichten holen, oder ohne Text    |
| 1006 | MAIL_DISABLED         | der Server oder der Spieler hat Mails abgeschaltet                   | frag den Administrator, oder `allowMail=true` |
| 1007 | AUTHENTICATION_FAILED | Benutzername oder Passwort ist falsch                                | nimm ein App-Passwort                        |
| 1008 | MAIL_REJECTED         | der Mailserver hat abgelehnt, etwa einen Empfänger oder einen Ordner | lies die Meldung des Fehlers                 |
| 1009 | MAIL_LIMIT            | zu viele Empfänger, zu viel Text, zu viele Mails pro Minute          | weniger senden, oder eine Minute warten      |

INVALID_ARGUMENT und PERMISSION_DENIED sind Konstanten von c0de; die anderen kommen mit `INCLUDE c0de_net/mail`, als `c0de_net/mail/AUTHENTICATION_FAILED` und so weiter.

Die meisten Probleme eines neuen Mailprogramms sind **AUTHENTICATION_FAILED**: Viele Anbieter lassen Programme nicht mit dem Passwort des Kontos herein. Leg in den Sicherheitseinstellungen deines Kontos ein **App-Passwort** für c0de an und nimm dieses.

## Das Programm

<<< @/tutorials/programs/libraries/mail/mail-errors-send.c0de

## Aufbauen und ausführen

1. Stelle den Auslöserblock auf `mailcheck` / `send`, leg deine Variablenkarten `server` und `port` hinein und binde den Laptop daran.
2. Drück den Knopf. Wenn alles stimmt, zeigt der Laptop `Sent to steve@example.com` – nimm deine eigene Adresse für `to` – und eine Testmail kommt an.
3. Mach es jetzt absichtlich kaputt, immer nur eine Sache, und schau auf den Laptop:

| Du änderst                            | Der Laptop zeigt                                 | Exit-Code |
| ------------------------------------- | ------------------------------------------------ | --------: |
| der Tresor ist leer oder geschlossen  | `Put your password into the vault first`         |         2 |
| ein falsches Passwort im Tresor       | `Wrong user or password (an app password?)`      |         1 |
| `server` auf `smtp.nothing.invalid`   | `The mail server can't be reached`               |         1 |
| `port` auf 25                         | `Port 25 is blocked, use 465 or 587`             |         1 |
| `to` auf `nobody`                     | `Check the server, the sender and the addresses` |         1 |
| `lines` auf 3000                      | `Too much mail: send less or wait a minute`      |         1 |

<!-- screenshot: mail-errors-laptop | the laptop showing "Wrong user or password (an app password?)" next to the trigger block of mailcheck -->

## So funktioniert es

- **`explain`** macht aus einem Code Worte, wie in [Wenn das Netz ausfällt](/de/tutorials/libraries/c0de_net/http/network-errors): Es beginnt mit einer Meldung für unbekannte Codes und überschreibt sie für jeden Code, den es kennt.
- **HAS_SECRET** fragt zuerst den Tresor. Eine SECRET-Zeile für ein fehlendes Geheimnis löst SECRET_NOT_FOUND aus und hält das Programm an, deshalb ruft `send` die Funktion `account` mit der SECRET-Zeile nur auf, wenn das Passwort da ist. Ohne offenen Tresor sagt HAS_SECRET ebenfalls FALSE.
- **`account`** gibt den SMTP_SERVER als Ergebnis zurück, sodass das Passwort nur darin und im Struct lebt. Sein `timeout` von 10 Sekunden lässt einen Test schnell scheitern, statt die vollen 30 zu warten.
- **Die FOR-Schleife** schreibt `lines` Zeilen Text. 3000 Zeilen sind etwa 90 KiB, mehr als die 64 KiB, die eine Nachricht haben darf: SMTP_SEND löst MAIL_LIMIT aus, bevor es sich verbindet. Zu viele Empfänger oder mehr als 10 Mails pro Minute lösen ihn ebenso aus.
- **Die Exit-Codes** sind 0 für gesendet, 1 für einen Fehler der Mail und 2 für ein fehlendes Passwort, sodass ein Komparator neben dem Auslöserblock sie anzeigen kann.

Anders als in [Wenn das Netz ausfällt](/de/tutorials/libraries/c0de_net/http/network-errors) gibt es keine Wiederholung: Die meisten Mailfehler gehen nicht von selbst weg, und eine Wiederholung eines SMTP_SEND, das in den Timeout lief, könnte die Nachricht zweimal senden.

## Probier es selbst

1. Das Ordnerprogramm eines Freundes stürzt ab, wenn der Ordner schon existiert. Fang das ab.

::: details Lösung
<<< @/tutorials/programs/libraries/mail/mail-errors-folder.c0de

IMAP_CREATE löst für einen Ordner, den es schon gibt, MAIL_REJECTED aus – der Mailserver lehnt den Befehl ab. Das Programm sagt das und endet mit Exit-Code 1. Mit dem Namen `Invoices` zeigt es `Created Invoices`. Jeder andere Fehler endet mit seiner Meldung und Exit-Code 2.
:::

2. Alex hat im eigenen Spiel `allowMail=false` gesetzt. Was passiert, wenn Alex den Knopf drückt? Und was, wenn ein Zeitgeberblock das Programm an einem Auslöserblock startet, der Alex gehört?

::: details Lösung
Beide Male zeigt der Laptop `Mail is switched off`: MAIL_DISABLED. Die Mail ginge von Alex' Computer hinaus – wenn Alex den Knopf drückt, weil Alex den Prozess gestartet hat, und beim Zeitgeberblock, weil ein Prozess, den niemand gestartet hat, als Besitzer des Auslöserblocks läuft. Drückt Steve den Knopf, geht die Mail von Steves Computer hinaus und klappt. Ein Administrator, der `enableMail=false` in `config/c0de_net.properties` setzt, schaltet Mails für alle ab.
:::

## Mehr dazu

- [Fehler von c0de net](/de/c0de_net/http/errors)
- [Einstellungen von c0de net](/de/c0de_net/http/getting-started#einstellungen)
- [Fehler](/de/tutorials/programmers/errors) im Pfad für Programmierer
- [Exit-Codes](/de/c0de/guide/running-programs#exit-codes)
