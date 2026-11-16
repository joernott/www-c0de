---
description: When mail fails – the errors of c0de_net/mail with a friendly message for each, app passwords, port 25, the limits of the server, and checking the vault before a SECRET line.
---

# When mail fails

A wrong password, a typo in the server name, a provider that blocks programs: a mail program meets more trouble than most. This recipe sends a test mail and, when it doesn't work, tells the player in plain words what to fix – the program to try first when you set up mail.

**Functions:** the [errors of c0de net](/c0de_net/http/errors), [SMTP_SEND](/c0de_net/mail/smtp_send), [IMAP_CREATE](/c0de_net/mail/imap_create), and [HAS_SECRET](/c0de/security/has_secret) of c0de/security

::: info What you need
The mod **c0de net**, your mail account and app password as in [Mail from the farm](/tutorials/libraries/c0de_net/mail/farm-mail), a trigger block with a button, a laptop, and variable items `server` (STRING) and `port` (INTEGER). For the exercise, the IMAP server of [The order desk](/tutorials/libraries/c0de_net/mail/order-desk).
:::

## The idea

The functions of c0de_net/mail raise an error when something goes wrong. A CALL with an ERROR variable catches it, and its `code` says what happened:

| Code | Name                  | What happened                                                  | What to do                                   |
| ---: | --------------------- | -------------------------------------------------------------- | -------------------------------------------- |
|  309 | INVALID_ARGUMENT      | no server or sender, an address that isn't one, unknown criteria | fix the program                              |
|  311 | PERMISSION_DENIED     | a connection to port 25                                        | use port 465 or 587 of your provider         |
| 1001 | CLIENT_UNAVAILABLE    | the player isn't online or has no c0de net                     | nothing, try later                           |
| 1003 | REQUEST_FAILED        | no connection: unknown server, refused, a certificate problem  | check server, port and `security`            |
| 1004 | REQUEST_TIMEOUT       | the server didn't answer in time                               | try again later                              |
| 1005 | RESPONSE_TOO_LARGE    | IMAP_FETCH would read too much                                 | fetch fewer messages, or without text        |
| 1006 | MAIL_DISABLED         | the server or the player has switched mail off                 | ask the administrator, or `allowMail=true`   |
| 1007 | AUTHENTICATION_FAILED | the user name or the password is wrong                         | use an app password                          |
| 1008 | MAIL_REJECTED         | the mail server refused, e.g. a recipient or a folder          | read the message of the error                |
| 1009 | MAIL_LIMIT            | too many recipients, too much text, too many mails a minute    | send less, or wait a minute                  |

INVALID_ARGUMENT and PERMISSION_DENIED are constants of c0de; the others come with `INCLUDE c0de_net/mail`, as `c0de_net/mail/AUTHENTICATION_FAILED` and so on.

Most problems of a new mail program are **AUTHENTICATION_FAILED**: many providers don't let programs in with the password of the account. In the security settings of your account, create an **app password** for c0de and use that one.

## The program

<<< @/tutorials/programs/libraries/mail/mail-errors-send.c0de

## Building and running it

1. Set the trigger block to `mailcheck` / `send`, put your variable items `server` and `port` into it, and bind the laptop to it.
2. Press the button. If everything is right, the laptop shows `Sent to steve@example.com` – use your own address for `to` – and a test mail arrives.
3. Now break it on purpose, one thing at a time, and watch the laptop:

| You change                            | The laptop shows                                 | Exit code |
| ------------------------------------- | ------------------------------------------------ | --------: |
| the vault is empty or closed          | `Put your password into the vault first`         |         2 |
| a wrong password in the vault         | `Wrong user or password (an app password?)`      |         1 |
| `server` to `smtp.nothing.invalid`    | `The mail server can't be reached`               |         1 |
| `port` to 25                          | `Port 25 is blocked, use 465 or 587`             |         1 |
| `to` to `nobody`                      | `Check the server, the sender and the addresses` |         1 |
| `lines` to 3000                       | `Too much mail: send less or wait a minute`      |         1 |

<!-- screenshot: mail-errors-laptop | the laptop showing "Wrong user or password (an app password?)" next to the trigger block of mailcheck -->

## How it works

- **`explain`** turns a code into words, like in [When the network fails](/tutorials/libraries/c0de_net/http/network-errors): it starts with a message for unknown codes and overwrites it for every code it knows.
- **HAS_SECRET** asks the vault first. A SECRET line for a missing secret raises SECRET_NOT_FOUND and stops the program, so `send` only calls `account`, which has the SECRET line, when the password is there. Without an open vault, HAS_SECRET says FALSE as well.
- **`account`** returns the SMTP_SERVER as a result, so the password lives only inside it and in the struct. Its `timeout` of 10 seconds lets a test fail fast instead of waiting the full 30.
- **The FOR loop** writes `lines` lines of text. 3000 lines are about 90 KiB, more than the 64 KiB a message may have: SMTP_SEND raises MAIL_LIMIT before it connects. Too many recipients or more than 10 mails a minute raise it as well.
- **The exit codes** are 0 for sent, 1 for an error of the mail and 2 for a missing password, so a comparator next to the trigger block can show them.

Unlike in [When the network fails](/tutorials/libraries/c0de_net/http/network-errors), there is no retry: most mail errors don't go away by themselves, and a retry of SMTP_SEND that timed out might send the message twice.

## Try it yourself

1. The folder program of a friend crashes when the folder exists already. Catch it.

::: details Solution
<<< @/tutorials/programs/libraries/mail/mail-errors-folder.c0de

IMAP_CREATE raises MAIL_REJECTED for a folder that exists – the mail server refuses the command. The program says so and ends with exit code 1. With the name `Invoices`, it shows `Created Invoices`. Every other error ends with its message and exit code 2.
:::

2. Alex has set `allowMail=false` in their game. What happens when Alex presses the button? And what when a timer block starts the program on a trigger block that Alex owns?

::: details Solution
Both times, the laptop shows `Mail is switched off`: MAIL_DISABLED. The mail would go out from Alex's computer – when Alex presses the button, because Alex started the process, and from the timer block, because a process that nobody started runs as the owner of the trigger block. When Steve presses the button, the mail goes out from Steve's computer and works. An administrator who sets `enableMail=false` in `config/c0de_net.properties` switches mail off for everybody.
:::

## Read more

- [Errors of c0de net](/c0de_net/http/errors)
- [Settings of c0de net](/c0de_net/http/getting-started#settings)
- [Errors](/tutorials/programmers/errors) in the programmer path
- [Exit codes](/c0de/guide/running-programs#exit-codes)
