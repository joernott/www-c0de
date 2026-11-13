---
title: Datenschutzerklärung
description: Welche Daten c0de.at verarbeitet, wozu und wie lange.
search: false
---

# Datenschutzerklärung

[[toc]]

## Verantwortlicher

Jörn Ott<br>
Hauptstr. 2<br>
53604 Bad Honnef<br>
Deutschland<br>
E-Mail: <c0de@c0de.at>

## Zugriffsprotokoll des Servers

Wenn Sie eine Seite dieser Website aufrufen, sendet Ihr Browser eine Anfrage an den Server. Der Server schreibt jede Anfrage in ein Zugriffsprotokoll:

- Ihre vollständige IP-Adresse und den Port Ihrer Verbindung,
- Datum und Uhrzeit,
- die angefragte Adresse, die Methode und das Protokoll,
- die Kopfzeilen, die Ihr Browser mit der Anfrage sendet, etwa Ihren Browser und Ihr Betriebssystem (User-Agent), Ihre bevorzugten Sprachen und die Adresse der Seite, von der Sie kommen (Referrer); Cookies und Passwörter werden nicht protokolliert,
- die Verschlüsselung der Verbindung (TLS-Version und Verfahren),
- Status, Größe und Dauer der Antwort.

**Zweck:** der Betrieb des Servers, die Suche nach Fehlern und das Erkennen und Abwehren von Angriffen.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist ein funktionierender und sicherer Betrieb der Website.

**Speicherdauer:** Das Protokoll beginnt jeden Tag eine neue Datei. Dateien, die älter als drei Monate sind, werden gelöscht.

Das Protokoll wird nicht mit anderen Daten zusammengeführt und nicht weitergegeben, es sei denn, ein Gesetz verlangt es, etwa zur Verfolgung eines Angriffs.

## Die API für Programme in Minecraft

Die Tutorials von c0de net zeigen, wie Programme in Minecraft mit Webdiensten sprechen. Einige ihrer Beispiele nutzen eine kleine API dieses Servers: ein Echo (`/api/tutorial/echo`), eine Aufgabenliste (`/api/tutorial/todo`) und die neuesten Versionen der Mods (`/api/version`). Die Anfragen kommen aus dem Minecraft-Spiel der Person, die das Programm ausführt, nicht aus einem Browser.

- Jede Anfrage wird wie jede andere in das Zugriffsprotokoll geschrieben (siehe oben), mit der IP-Adresse des Computers, auf dem das Spiel läuft.
- Das Echo sendet die Anfrage so zurück, wie sie ankam, und speichert nichts.
- Die Einträge der Aufgabenliste (ein Titel und ob er erledigt ist) werden nur im Arbeitsspeicher des Servers gehalten, ohne die IP-Adresse des Absenders, und **alle, die die API nutzen, können sie lesen, ändern und löschen**. Bitte tragen Sie keine personenbezogenen Daten ein. Sie werden gelöscht, wenn jemand sie löscht, jeden Tag um 00:00 Uhr UTC und wenn der Server neu startet.
- Um die Zahl der Anfragen zu begrenzen (60 pro Minute), zählt der Server die Anfragen jeder IP-Adresse in seinem Arbeitsspeicher; die Zählung wird nach einer Minute gelöscht.
- Für die Versionen der Mods fragt der Server einmal pro Stunde bei GitHub nach den Veröffentlichungen der Mods. Diese Anfragen enthalten keine Daten über Sie.

**Zweck:** die Beispiele der Tutorials und der Schutz des Servers vor zu vielen Anfragen.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist, funktionierende Beispiele für die Tutorials anzubieten und die API sicher zu betreiben.

## Keine Cookies, kein Tracking, keine anderen Anbieter

Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Werkzeuge. Sie speichert eine Sache in Ihrem Browser, und nur, wenn Sie es wünschen: Wenn Sie ein Beispielprogramm zwischen Text und 3D umschalten, merkt sich Ihr Browser Ihre Wahl (der Eintrag `c0de-program-view` in seinem lokalen Speicher) und zeigt die nächsten Programme genauso. Die Wahl wird nie an den Server gesendet; wenn Sie die Daten dieser Website in Ihrem Browser löschen, ist sie entfernt. Diese Speicherung ist für die Funktion erforderlich, die Sie gewünscht haben (§ 25 Abs. 2 Nr. 2 TDDDG). Schriften, Bilder und Skripte kommen von diesem Server; sie lädt nichts von anderen Anbietern. Die Suche läuft in Ihrem Browser: Ihre Suchbegriffe werden nicht an den Server gesendet.

Die Website verlinkt auf andere Websites, etwa GitHub, Modrinth und CurseForge. Erst wenn Sie einem solchen Link folgen, nimmt Ihr Browser Kontakt zu ihnen auf, und es gelten deren Datenschutzerklärungen.

## Ihre Rechte

Sie haben das Recht auf Auskunft über die Daten zu Ihrer Person (Art. 15 DSGVO), auf Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen die Verarbeitung (Art. 21). Schreiben Sie dazu an die oben genannte Adresse.

Außerdem haben Sie das Recht, sich bei einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), etwa bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.

Stand: November 2026.
