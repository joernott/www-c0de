---
title: Privacy policy
description: Which data c0de.at processes, why and for how long.
search: false
---

# Privacy policy

[[toc]]

## Controller

Jörn Ott<br>
Hauptstr. 2<br>
53604 Bad Honnef<br>
Germany<br>
E-mail: <c0de@c0de.at>

## Access log of the server

When you open a page of this site, your browser sends a request to the server. The server writes every request into an access log:

- your full IP address and the port of your connection,
- the date and time,
- the requested address, the method and the protocol,
- the headers your browser sends with the request, such as your browser and operating system (user agent), your preferred languages and the address of the page you came from (referrer); cookies and passwords are not logged,
- the encryption of the connection (TLS version and cipher),
- the status, the size and the duration of the answer.

**Purpose:** running the server, finding errors and recognizing and defending against attacks.

**Legal basis:** Art. 6 (1) (f) GDPR. The legitimate interest is a working and secure operation of the site.

**Storage:** the log starts a new file every day. Files older than three months are deleted.

The log is not combined with other data and is not passed on to anyone, unless the law requires it, for example to prosecute an attack.

## The API for programs in Minecraft

The tutorials of c0de net show how programs in Minecraft talk to web services. Some of their examples use a small API of this server: an echo (`/api/tutorial/echo`), a to-do list (`/api/tutorial/todo`) and the latest versions of the mods (`/api/version`). The requests come from the Minecraft game of the player who runs the program, not from a browser.

- Every request is written into the access log like any other (see above), with the IP address of the computer the game runs on.
- The echo sends the request back as it arrived and keeps nothing.
- The entries of the to-do list (a title and whether it is done) are kept in the memory of the server only, without the IP address of the sender, and **everybody who uses the API can read, change and delete them**. Please don't put personal data into them. They are deleted when somebody deletes them, every day at 00:00 UTC and when the server restarts.
- To limit the number of requests (60 a minute), the server counts the requests of every IP address in its memory; the counts are deleted after a minute.
- For the versions of the mods, the server asks GitHub for the releases of the mods once an hour. These questions contain no data about you.

**Purpose:** the examples of the tutorials, and the protection of the server against too many requests.

**Legal basis:** Art. 6 (1) (f) GDPR. The legitimate interest is to offer working examples for the tutorials and a secure operation of the API.

## No cookies, no tracking, no other providers

This site sets no cookies and uses no analytics or tracking. It stores one thing in your browser, and only when you ask for it: when you switch an example program between text and 3D, your browser remembers your choice (the entry `c0de-program-view` in its local storage) and shows the next programs the same way. The choice is never sent to the server; deleting the data of this site in your browser removes it. This storage is necessary for the function you asked for (§ 25 (2) no. 2 TDDDG). Its fonts, images and scripts come from this server; it loads nothing from other providers. The search runs in your browser: your search terms are not sent to the server.

The site links to other websites, such as GitHub, Modrinth and CurseForge. Only when you follow such a link does your browser contact them, and their privacy policies apply.

## Your rights

You have the right to access the data about you (Art. 15 GDPR), to have it corrected (Art. 16), deleted (Art. 17) or its processing restricted (Art. 18), to receive it (Art. 20) and to object to its processing (Art. 21). Write to the address above.

You also have the right to lodge a complaint with a supervisory authority (Art. 77 GDPR), for example the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia (Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen).

As of November 2026.
