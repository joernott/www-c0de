---
description: The yearly clean-up of a mailbox – IMAP_LIST with patterns, IMAP_CREATE, IMAP_RENAME and IMAP_DELETE for folders, IMAP_STORE with \Deleted, IMAP_EXPUNGE and IMAP_STATUS.
---

# Tidying the mailbox

A mailbox fills up. Once a year, this program makes room: the folder **Archive** of last year gets the year in its name, a new empty **Archive** starts, the archive of two years ago is deleted, and old village news that you've read already disappear from the INBOX. At the end, it shows how full the INBOX is.

**Functions:** [IMAP_LIST](/c0de_net/mail/imap_list), [IMAP_CREATE](/c0de_net/mail/imap_create), [IMAP_RENAME](/c0de_net/mail/imap_rename), [IMAP_DELETE](/c0de_net/mail/imap_delete), [IMAP_STORE](/c0de_net/mail/imap_store), [IMAP_EXPUNGE](/c0de_net/mail/imap_expunge) and [IMAP_STATUS](/c0de_net/mail/imap_status)

::: info What you need

- the mod **c0de net**, a mail account with IMAP and your app password as the secret `mailPassword` in your open vault, as in [The order desk](/tutorials/libraries/c0de_net/mail/order-desk)
- a trigger block with a button, a laptop, and variable items `server` (STRING) and `port` (INTEGER)
- a mailbox you don't mind tidying: **IMAP_DELETE deletes a folder with all its messages**, and IMAP_EXPUNGE removes messages for good. Try it with a second account first.

:::

## The idea

Folders are managed with five functions:

- **IMAP_LIST** returns the names of the folders. Its pattern chooses which: `*` stands for any text, `%` for any text within one level of folders. `Archive*` finds **Archive**, **Archive 2024** and **Archive 2025**.
- **IMAP_CREATE**, **IMAP_RENAME** and **IMAP_DELETE** make, rename and delete a folder.
- **IMAP_STATUS** returns the MAILBOX of a folder – how many messages, how many unseen – without selecting it.

Deleting messages takes two steps in IMAP, like the recycle bin of a computer: IMAP_STORE gives them the flag `\Deleted`, and **IMAP_EXPUNGE** removes all messages of the selected folder that have it. Until then, a mail program can still bring them back.

## The program

<<< @/tutorials/programs/libraries/mail/tidy-mailbox-cleanup.c0de

## Building and running it

1. Set the trigger block to `tidymail` / `cleanup` and bind the laptop to it. Put the variable items `server` and `port` into the trigger block, and an uninitialized variable item for `removed`.
2. Press the button. With the folders **Archive** and **Archive 2024** and some old news in the INBOX, the laptop shows:

```
Archive is now Archive 2025
Deleted Archive 2024
Removed 1 old news
INBOX: 5 messages, 3 unseen
```

The order of the first two lines depends on the order in which the server lists the folders. A second press in the same year finds **Archive 2025**, which is younger than two years, and an empty **Archive**: it renames it to **Archive 2025** – which exists already, so the server refuses, and the program stops with MAIL_REJECTED. Run the clean-up once a year, or try the first exercise.

<!-- screenshot: tidy-mailbox-laptop | the laptop after the clean-up with the four lines "Archive is now Archive 2025", "Deleted Archive 2024", "Removed 1 old news" and "INBOX: 5 messages, 3 unseen" -->

## How it works

- **The names** of the archives are made from the parameter `year`: `"Archive " ⊕ ( year - 2 )` is `"Archive 2024"`. The parentheses make sure the year is calculated before it is joined to the text.
- **IMAP_LIST** with `Archive*` returns the names of the archives only. EACH goes through them: the oldest is deleted, and **Archive** is renamed to the year before and made anew with IMAP_CREATE.
- **IMAP_SELECT** selects INBOX, so the functions for messages know where to work. The criteria `SEEN SUBJECT "Village news"` find the news you've read; the quotes keep the two words together. In the dialog of the literal you type them as they are; the text notation of the program writes them `\"`.
- **IMAP_STORE** adds `\Deleted` to them – typed `\Deleted` in the dialog, written `"\\Deleted"` in the text notation – and **IMAP_EXPUNGE** removes them and returns how many – the result `removed`.
- **IMAP_STATUS** reads the MAILBOX of INBOX at the end. Unlike IMAP_SELECT, it doesn't change `imap.folder`.

## Try it yourself

1. Make the program safe to press twice: only rename **Archive** if there is no archive of last year yet.

::: details Solution
Before the EACH loop, look for `last` in `folders`: a second EACH that sets a BOOLEAN `done` when a name equals `last`. Then rename **Archive** only `IF name = "Archive" AND NOT done`. A second press shows only `Removed 0 old news` and the status.
:::

2. Before deleting the oldest archive, show how many messages are lost with it.

::: details Solution
Call IMAP_STATUS with `PARAMETER folder name ;` and a MAILBOX variable before IMAP_DELETE, and print its `messages`: `"Deleted " ⊕ name ⊕ " with " ⊕ box.messages ⊕ " messages"`.
:::

## Read more

- [IMAP_LIST](/c0de_net/mail/imap_list), [IMAP_STATUS](/c0de_net/mail/imap_status) and [IMAP_EXPUNGE](/c0de_net/mail/imap_expunge)
- [The order desk](/tutorials/libraries/c0de_net/mail/order-desk): selecting folders and flags
- [When mail fails](/tutorials/libraries/c0de_net/mail/mail-errors): MAIL_REJECTED and the other errors
