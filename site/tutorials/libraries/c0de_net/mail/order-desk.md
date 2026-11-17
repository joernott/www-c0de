---
description: An order desk that reads your mailbox – IMAP_SERVER, IMAP_SELECT with the variable it changes, IMAP_SEARCH with criteria, IMAP_FETCH with and without the text, IMAP_STORE with flags, and IMAP_MOVE.
---

# The order desk

Your neighbours order wheat, carrots and pumpkins by mail. The order desk looks into your mailbox, lists the new orders on the laptop, flags them and puts them into a folder **Orders**. A second button shows the next open order with its text and marks it as answered when you've packed it.

**Functions:** [IMAP_SERVER](/c0de_net/mail/imap_server), [MAILBOX](/c0de_net/mail/mailbox), [MAIL](/c0de_net/mail/mail), [IMAP_SELECT](/c0de_net/mail/imap_select), [IMAP_SEARCH](/c0de_net/mail/imap_search), [IMAP_FETCH](/c0de_net/mail/imap_fetch), [IMAP_STORE](/c0de_net/mail/imap_store) and [IMAP_MOVE](/c0de_net/mail/imap_move)

::: info What you need

- the mod **c0de net** in your game
- a mail account whose provider allows **IMAP** – look up its IMAP server, like `imap.example.com`, and its port, usually 993
- your app password as the secret `mailPassword` in your vault, as in [Mail from the farm](/tutorials/libraries/c0de_net/mail/farm-mail), and the vault open
- a folder **Orders** in your mailbox – make it in your mail program, or with the program of [Tidying the mailbox](/tutorials/libraries/c0de_net/mail/tidy-mailbox)
- two trigger blocks with buttons, `orders` and `deliver`, a laptop, and variable items `server` (STRING) and `port` (INTEGER)

:::

## The idea

**IMAP** is how mail programs read a mailbox on the server: the messages stay there, in folders like INBOX, and every program sees the same. c0de's struct type **IMAP_SERVER** holds the connection, like SMTP_SERVER for sending.

Every function of c0de_net/mail opens a connection of its own, does its work and closes it again – nothing stays open between two CALL lines. So how do the functions know which folder you're working in? **IMAP_SELECT** checks that a folder exists and writes its name into the element `folder` of your IMAP_SERVER variable. The functions for messages – IMAP_SEARCH, IMAP_FETCH, IMAP_STORE, IMAP_MOVE and IMAP_EXPUNGE – work in that folder. Because IMAP_SELECT changes the variable, you pass the variable itself, not a calculation.

Messages have **UIDs**, numbers that are unique in their folder. IMAP_SEARCH returns the UIDs of the messages that match **criteria**, IMAP_FETCH reads the messages of some UIDs. And every message has **flags**: `\Seen` once it's read, `\Answered`, `\Flagged` for the important ones, `\Deleted` and `\Draft`. IMAP_STORE sets and removes them.

## The program

<<< @/tutorials/programs/libraries/mail/order-desk-orders.c0de

## Building and running it

1. Set the first trigger block to `orderdesk` / `orders` and the second one to `orderdesk` / `deliver`. Put the variable items `server` and `port` into both, and an uninitialized variable item for the result `count` into the first one.
2. Bind the laptop to `orderdesk` / `orders` and press the first button. The laptop shows how many messages are unseen, and the new orders:

```
3 of 6 messages unseen
New: Order: 32 wheat
New: Order: 12 carrots
```

The result `count` is 2. In your mail program, the two orders have moved to **Orders**, with a flag, and they are still unread.

3. Bind the laptop to `orderdesk` / `deliver` and press the second button. It shows the oldest flagged order that isn't answered yet, with its text:

```
Sam <sam@example.com>
Order: 16 eggs
Sixteen eggs for the bakery, by Friday.
```

Press it again for the next order. When all are done, it says `No open orders`.

<!-- screenshot: order-desk-laptop | the laptop showing "3 of 6 messages unseen" and the two lines "New: Order: 32 wheat" and "New: Order: 12 carrots", the two trigger blocks of orders and deliver next to it -->

## How it works

- **IMAP_SELECT** without a `folder` selects INBOX and returns its **MAILBOX**: `messages`, `unseen`, `recent`, `uid_next` and `uid_validity`. After the CALL, `imap.folder` is `"INBOX"`.
- **The criteria** `UNSEEN SUBJECT Order:` are words of IMAP, and all of them must match: unread, with `Order:` in the subject. Others are `SEEN`, `FLAGGED`, `UNANSWERED`, `FROM alex`, `SINCE 1-Nov-2026` and more – the page of [IMAP_SEARCH](/c0de_net/mail/imap_search) lists them. A text with spaces goes in double quotes: type `SUBJECT "wheat order"` in the dialog of the literal, which the text notation writes as `"SUBJECT \"wheat order\""`.
- **IMAP_FETCH** returns a list of **MAIL** structs: `uid`, `from`, `to`, `cc`, `subject`, `date`, `text`, `flags` and `size`. With `text` FALSE, it reads everything but the text, which is faster and leaves the message **unseen** – your mail program still shows it as new. In `deliver`, it reads the text, and the message becomes `\Seen`, as when you open it.
- **IMAP_STORE** adds flags by default. In the dialog of the literal, type `\Flagged`; the text notation of the program writes the backslash twice, `"\\Flagged"`. `mode "remove"` takes a flag away, `mode "set"` replaces all of them.
- **IMAP_MOVE** puts the messages into another folder of the same mailbox. In INBOX, they are gone; in **Orders**, they get new UIDs.
- **`deliver`** selects **Orders**, searches `FLAGGED UNANSWERED` and takes the first UID, `uids[0]` – the UIDs come oldest first. After showing the order, it adds `\Answered` and removes `\Flagged`, so the next press shows the next one.

The functions take one UID or a list, so `uids[0]` and `uids` both work.

## Try it yourself

1. The orders should also be shown with their text when they arrive.

::: details Solution
Leave out `PARAMETER text FALSE ;` in `orders`, and print `letter.text` in the EACH loop. Mind that this marks every new order as seen. A laptop has 20 rows, so long texts scroll away – print only the first line: find the first line break, [CHR](/c0de/strings/chr) 10, with [INSTR](/c0de/strings/instr) of c0de/strings and cut the text there with [LEFT](/c0de/strings/left).
:::

2. Only orders from your neighbours should count, not the ones from strangers.

::: details Solution
Add `FROM` to the criteria, once for every neighbour you accept, each in its own search: `"UNSEEN SUBJECT Order: FROM alex@example.com"`. IMAP has no "or" in c0de's criteria, so search once per neighbour and move the UIDs of each search.
:::

## Read more

- [IMAP_SERVER](/c0de_net/mail/imap_server), [MAIL](/c0de_net/mail/mail) and [MAILBOX](/c0de_net/mail/mailbox)
- [IMAP_SEARCH](/c0de_net/mail/imap_search): all criteria
- [Reading orders](/c0de_net/http/examples#reading-orders) in the handbook
- [Tidying the mailbox](/tutorials/libraries/c0de_net/mail/tidy-mailbox)
