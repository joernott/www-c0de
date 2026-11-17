---
description: Deine Farm schreibt dir jeden Morgen eine Mail – ein SMTP_SERVER mit dem Passwort aus deinem Tresor, SMTP_SEND mit to, cc, bcc und reply_to, und wozu die Message-ID gut ist.
---

# Mail von der Farm

Du bist nicht auf dem Server, und deine Farm arbeitet weiter. Dieses Rezept lässt sie dir einen kurzen Bericht schreiben: was heute in der Scheune liegt, als echte Mail in dein Postfach, mit einer Kopie für deinen Nachbarn. Du liest sie auf dem Handy wie jede andere Nachricht.

**Funktionen:** [SMTP_SERVER](/de/c0de_net/mail/smtp_server), [SMTP_SEND](/de/c0de_net/mail/smtp_send), [SECRET](/de/c0de/reference/data#secret) für das Passwort aus dem Tresor und [CHR](/de/c0de/strings/chr) aus c0de/strings

::: info Was du brauchst

- die Mod **c0de net** in deinem Spiel
- ein Mailkonto, bei dem Programme über **SMTP** senden dürfen – das geht bei den meisten Anbietern. Schlag den Namen seines SMTP-Servers und den Port nach, etwa `smtp.example.com` und 465. Viele Anbieter wollen für Programme ein **App-Passwort**: ein zweites Passwort, das du in den Einstellungen deines Kontos anlegst und jederzeit zurückziehen kannst.
- dieses Passwort als Geheimnis `mailPassword` in deinem dauerhaften Tresor, aufbewahrt wie der Schlüssel in [Schlüssel aufbewahren](/de/tutorials/libraries/c0de/security/keeping-keys)
- einen Auslöserblock mit Knopf, einen Laptop und **Variablenkarten** `server` (STRING) und `port` (INTEGER) mit Server und Port deines Anbieters

:::

## Die Idee

Ein Mailprogramm muss wissen, worüber es sendet. In c0de ist das eine Variable vom Struct-Typ **SMTP_SERVER**: der Server, der Port, wie die Verbindung verschlüsselt ist, der Benutzername, das Passwort und der Absender. `server` und `from` sind nötig; der Rest hat Vorgaben, die zu den meisten Anbietern passen.

Heikel ist das Passwort. Es darf nie im Programm stehen, wo es jeder lesen kann, der sich das Blatt ansieht. Deshalb holt das Programm es mit einer **SECRET**-Zeile aus deinem Tresor, und das Element `password` von SMTP_SERVER ist _sensibel_: Das Debugging-Werkzeug zeigt `***` statt seiner.

Dann sendet **SMTP_SEND** die Nachricht: an eine Adresse oder an eine Liste, mit Kopien (`cc`), Blindkopien (`bcc`) und einer Adresse für Antworten (`reply_to`). Es gibt die **Message-ID** zurück, den Namen, den dein Mailanbieter der Nachricht gibt, etwa `<a1b2c3@example.com>`.

Wie die Anfragen von c0de_net/http geht die Mail vom Computer des Spielers hinaus, der das Programm startet, nicht vom Minecraft-Server. Dein Anbieter sieht also deine eigene Internetverbindung, wie wenn du vom Handy aus schreibst.

## Das Programm

<<< @/tutorials/programs/libraries/mail/farm-mail-report.c0de

## Aufbauen und ausführen

1. Bewahre dein App-Passwort in deinem Tresor als `mailPassword` auf und öffne den Tresor – das Programm kann nicht nach seinem Passwort fragen.
2. Stelle den Auslöserblock auf `farmmail` / `report`, leg die Variablenkarten `server` und `port` und eine nicht initialisierte Variablenkarte für das Ergebnis hinein, und binde den Laptop an dieselbe Funktion.
3. Ersetze `steve@example.com` durch deine eigene Adresse und `alex@example.com` durch die deines Nachbarn, und drück den Knopf. Nach einem Moment zeigt der Laptop `Report sent`.
4. Schau in dein Postfach: Dort ist eine Mail **The farm today** von **Farm computer**:

```
Good morning!

In the barn today:
64 wheat
12 carrots

Your farm
```

<!-- screenshot: farm-mail-laptop | the laptop next to the trigger block of farmmail with "Report sent" on its screen, the variable items server and port in the input inventory of the trigger block -->

## So funktioniert es

- **`smtp.security "tls"`** verschlüsselt die Verbindung von Anfang an, wie es Port 465 erwartet. Mit `starttls`, der Vorgabe, beginnt die Verbindung auf Port 587 unverschlüsselt und wird vor der Anmeldung verschlüsselt. `none` schickt alles lesbar – nur für einen Server in deinem Heimnetz. `port 0` wählt 465 bei `tls` und sonst 587.
- **`smtp.from`** ist der Absender mit einem Namen vor der Adresse, `Farm computer <steve@example.com>`. Die meisten Anbieter nehmen als Absender nur Adressen deines eigenen Kontos an.
- **`SECRET mailPassword STRING`** liest das Passwort aus deinem Tresor in eine Variable, die nur in dieser Funktion lebt. Fehlt es, löst die Zeile SECRET_NOT_FOUND aus – [Wenn Mails scheitern](/de/tutorials/libraries/c0de_net/mail/mail-errors) prüft das vorher.
- **`nl`** ist ein Zeilenumbruch: [CHR](/de/c0de/strings/chr) aus c0de/strings mit dem Code 10. Der Dialog eines Literals nimmt, was du tippst, so wie es ist, deshalb lässt sich ein Zeilenumbruch nicht in einen Text tippen; das Programm hängt ihn mit `⊕` an. Eine Mail ist reiner Text: keine Farben, keine Bilder, keine Anhänge.
- **`to`** nimmt eine Adresse als Text, **`cc`** eine Liste von Adressen, hier die Variable `helpers` mit ihrem Wert in einem BEGIN-Block. Die Adressen von `to` und `cc` sehen alle.
- **`reply_to`** sagt, wohin Antworten gehen. Ohne geht es an den Absender – hier ist das dasselbe, du kannst es also weglassen; es hilft, wenn die Farm von einem anderen Konto sendet als deinem.
- **`id`**, die Message-ID, ist das, womit Mailprogramme eine Antwort ihrer Nachricht zuordnen. Heb sie auf, wenn du Antworten später erkennen willst.

### Die Grenzen

Der Minecraft-Server sorgt dafür, dass Programme nicht zu Spamschleudern werden. Jede Nachricht hat höchstens 20 Empfänger, `to`, `cc` und `bcc` zusammen, und 64 KiB Text, und ein Spieler kann 10 Nachrichten pro Minute senden. Der Administrator kann diese Grenzen in `config/c0de_net.properties` ändern; ein Programm über einer Grenze bekommt MAIL_LIMIT. Port 25, über den Mailserver miteinander sprechen, ist gesperrt: Sende immer über deinen Anbieter.

## Probier es selbst

1. Schick allen Nachbarn eine Einladung zum Erntefest – ohne ihnen die Adressen der anderen zu zeigen.

::: details Lösung
<<< @/tutorials/programs/libraries/mail/farm-mail-bcc.c0de

Die Nachbarn kommen in `bcc`: Jeder von ihnen bekommt die Nachricht, aber keiner sieht, wer sie sonst noch bekam. Die Nachricht braucht trotzdem ein `to`, also geht sie an dich selbst.
:::

2. Der Bericht soll erst hinausgehen, wenn die Scheune voll ist. Starte ihn mit einem Komparator.

::: details Lösung
Stell einen Komparator hinter die Truhe der Scheune, sodass sein Signal den Auslöserblock erreicht, wenn die Truhe voll ist, und stelle **Starten durch** auf *Alle*: Andere Redstone-Signale als Knopf, Hebel oder Platte starten einen Auslöserblock nur bei *Alle*. Dann drückt niemand einen Knopf, und der Prozess läuft als **Besitzer** des Auslöserblocks. Dieser Spieler muss mit c0de net online sein und den Tresor offen haben – sein Computer sendet die Mail. Lies [Wie Anfragen gesendet werden](/de/c0de_net/http/getting-started#wie-anfragen-gesendet-werden) und [den Auslöserblock](/de/c0de/reference/triggers).
:::

## Mehr dazu

- [SMTP_SERVER](/de/c0de_net/mail/smtp_server) und [SMTP_SEND](/de/c0de_net/mail/smtp_send)
- [Schlüssel aufbewahren](/de/tutorials/libraries/c0de/security/keeping-keys): der dauerhafte Tresor
- [Einstellungen von c0de net](/de/c0de_net/http/getting-started#einstellungen): die Grenzen für Mails
- [Der Bestellschalter](/de/tutorials/libraries/c0de_net/mail/order-desk): die Antworten lesen
