---
description: Your farm writes you a mail every morning – an SMTP_SERVER with the password from your vault, SMTP_SEND with to, cc, bcc and reply_to, and what the Message-ID is for.
---

# Mail from the farm

You're away from the server, and your farm keeps working. This recipe makes it write you a short report: what's in the barn today, sent as a real mail to your inbox, with a copy for your neighbour. You read it on your phone like any other message.

**Functions:** [SMTP_SERVER](/c0de_net/mail/smtp_server), [SMTP_SEND](/c0de_net/mail/smtp_send), [SECRET](/c0de/reference/data#secret) for the password from the vault, and [CHR](/c0de/strings/chr) of c0de/strings

::: info What you need

- the mod **c0de net** in your game
- a mail account whose provider lets programs send mail over **SMTP** – most do. Look up the name of its SMTP server and its port, like `smtp.example.com` and 465. Many providers want an **app password** for programs: a second password that you create in the settings of your account and can withdraw at any time.
- that password as the secret `mailPassword` in your persistent vault, stored like the key in [Keeping keys](/tutorials/libraries/c0de/security/keeping-keys)
- a trigger block with a button, a laptop, and **variable items** `server` (STRING) and `port` (INTEGER) with your provider's server and port

:::

## The idea

A mail program needs to know where to send from. In c0de, that's a variable of the struct type **SMTP_SERVER**: the server, the port, how the connection is encrypted, the user name, the password and the sender. `server` and `from` are needed; the rest has defaults that fit most providers.

The password is the delicate part. It must never stand in the program, where everybody who looks at the sheet can read it. So the program takes it from your vault with a **SECRET** line, and the element `password` of SMTP_SERVER is _sensitive_: the debugging tool shows `***` instead of it.

Then **SMTP_SEND** sends the message: to one address or to a list, with copies (`cc`), hidden copies (`bcc`) and an address for answers (`reply_to`). It returns the **Message-ID**, the name your mail provider gives the message, like `<a1b2c3@example.com>`.

Like the requests of c0de_net/http, mail goes out from the computer of the player who runs the program, not from the Minecraft server. So your provider sees your own internet connection, as when you send mail from your phone.

## The program

<<< @/tutorials/programs/libraries/mail/farm-mail-report.c0de

## Building and running it

1. Store your app password in your vault as `mailPassword`, and open the vault – the program can't ask for its password.
2. Set the trigger block to `farmmail` / `report`, put the variable items `server` and `port` and one uninitialized variable item for the result into it, and bind the laptop to the same function.
3. Replace `steve@example.com` with your own address and `alex@example.com` with the one of your neighbour, and press the button. After a moment, the laptop shows `Report sent`.
4. Look into your inbox: there is a mail **The farm today** from **Farm computer**:

```
Good morning!

In the barn today:
64 wheat
12 carrots

Your farm
```

<!-- screenshot: farm-mail-laptop | the laptop next to the trigger block of farmmail with "Report sent" on its screen, the variable items server and port in the input inventory of the trigger block -->

## How it works

- **`smtp.security "tls"`** encrypts the connection from the start, which is what port 465 expects. With `starttls`, the default, the connection starts unencrypted on port 587 and is encrypted before the login. `none` sends everything readable – only for a server in your home network. `port 0` picks 465 for `tls` and 587 otherwise.
- **`smtp.from`** is the sender with a name in front of the address, `Farm computer <steve@example.com>`. Most providers only accept addresses of your own account as sender.
- **`SECRET mailPassword STRING`** reads the password from your vault into a variable that only lives in this function. If it isn't there, the line raises SECRET_NOT_FOUND – [When mail fails](/tutorials/libraries/c0de_net/mail/mail-errors) checks that first.
- **`nl`** is a line break: [CHR](/c0de/strings/chr) of c0de/strings with the code 10. The dialog of a literal takes what you type as it is, so a line break can't be typed into a text; the program joins it in with `⊕`. A mail is plain text: no colours, no pictures, no attachments.
- **`to`** takes one address as a text, **`cc`** a list of addresses, here the variable `helpers` with its value in a BEGIN block. Everybody sees the addresses of `to` and `cc`.
- **`reply_to`** says where answers go. Without it, they go to the sender – here that's the same, so you may leave it out; it helps when the farm sends from another account than yours.
- **`id`**, the Message-ID, is how mail programs link an answer to its message. Keep it if you want to recognize answers later.

### The limits

The Minecraft server makes sure that programs don't turn into spam machines. Every message has at most 20 recipients, `to`, `cc` and `bcc` together, and 64 KiB of text, and one player can send 10 messages a minute. The administrator can change these limits in `config/c0de_net.properties`; a program over a limit gets MAIL_LIMIT. Port 25, where mail servers talk to each other, is blocked: always send through your provider.

## Try it yourself

1. Send an invitation to the harvest festival to all your neighbours – without showing them each other's addresses.

::: details Solution
<<< @/tutorials/programs/libraries/mail/farm-mail-bcc.c0de

The neighbours go into `bcc`: every one of them gets the message, but nobody sees who else got it. The message still needs a `to`, so it goes to yourself.
:::

2. The report should only go out when the barn is full. Start it from a comparator.

::: details Solution
Put a comparator behind the chest of the barn, so its signal reaches the trigger block when the chest is full, and set **Run** to *Everyone*: other redstone signals than a button, lever or plate only start a trigger block with *Everyone*. Then nobody presses a button, and the process runs as the **owner** of the trigger block. That player must be online with c0de net and have the vault open – their computer sends the mail. Read [How requests are sent](/c0de_net/http/getting-started#how-requests-are-sent) and [the trigger block](/c0de/reference/triggers).
:::

## Read more

- [SMTP_SERVER](/c0de_net/mail/smtp_server) and [SMTP_SEND](/c0de_net/mail/smtp_send)
- [Keeping keys](/tutorials/libraries/c0de/security/keeping-keys): the persistent vault
- [Settings of c0de net](/c0de_net/http/getting-started#settings): the limits of mail
- [The order desk](/tutorials/libraries/c0de_net/mail/order-desk): reading the answers
