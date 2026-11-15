---
description: Keep an API key for good in your persistent vault, a KeePass file that only your game can decrypt – HAS_VAULT, CREATE_VAULT, IS_VAULT_OPEN and OPEN_VAULT with their password dialog, and SET_SECRET with persistent.
---

# Keeping keys

You type the key of a web service once, and it's there the next day, and the day after: in your **persistent vault**, a KeePass file that only your game can open with your password. The program creates the vault the first time, opens it on later days, keeps the key and shows its last four characters, so you can see which key it is without showing it.

**Functions:** [HAS_VAULT](/c0de/security/has_vault), [CREATE_VAULT](/c0de/security/create_vault), [IS_VAULT_OPEN](/c0de/security/is_vault_open), [OPEN_VAULT](/c0de/security/open_vault), [SET_SECRET](/c0de/security/set_secret) with `persistent`, [HAS_SECRET](/c0de/security/has_secret), and [RIGHT](/c0de/strings/right) of c0de/strings

::: info What you need

- an empty sheet, a **SECRET block** and a **TAG block**
- two **trigger blocks** with a **button** each, one for `store` and one for `show`, and a **laptop**
- a key or a code you want to keep – for a first try, any made-up text like `wx-3f9a-77c2-d00d`

:::

## The idea

The vault of the [door with a password](/tutorials/libraries/c0de/security/password-door) forgets everything when you leave. That's fine for a password you choose each day, but not for a key that a web service gave you once, like the token of the [home automation](/tutorials/libraries/c0de_net/http/home-automation). For those, every player can have a **persistent vault**: a file in the KeePass format on the server, encrypted with a password that only you know.

The server keeps the file, but can't open it. Your game does the work:

- **CREATE_VAULT** asks you for a new password, makes an empty KeePass file in your game, encrypts it and sends it to the server.
- **OPEN_VAULT** asks for the password, gets the file from the server, decrypts it in your game and puts its secrets into your vault, where SECRET lines find them. It stays open until you leave.
- **SET_SECRET with `persistent` TRUE** puts the secret into the vault and into the file: your game changes the file, encrypts it again and sends it back.

HAS_VAULT tells whether you have a file already, IS_VAULT_OPEN whether it's open. With these two, one function `unlock` does the right thing every time: nothing if the vault is open, OPEN_VAULT if there is a file, CREATE_VAULT if there isn't.

## The program

<<< @/tutorials/programs/libraries/security/keeping-keys-keys.c0de

## Building and running it

1. Set the first trigger block to the program `keys` and the function `store`, the second one to `show`. Set **Run** to *Only me* on both: the vault only works for you anyway. Leave their input inventories empty – no item for `password`.
2. Bind the laptop to `keys` and `store`.
3. Press the button of `store`. As you have no persistent vault yet, your game opens the dialog **Create your vault** with two fields, **Password** and **Repeat**. OK only works when both are the same. Choose a good password and remember it: nobody can open the vault without it, not even the administrator.

<!-- screenshot: keeping-keys-create | the dialog "Create your vault" with the fields Password and Repeat filled with dots, and the buttons OK and Cancel -->

4. The laptop shows `Your new vault is ready.` and `Key:`. Type your key: the line shows a `*` for every character. After Enter, the cursor waits a moment while your game encrypts the file, and the laptop says `Key kept in your vault.`
5. Bind the laptop to `keys` and `show`, and press the button of `show`. The vault is still open, so there's no dialog, and the laptop shows `Your key ends with ...d00d`.

Now leave the server, join again and press the button of `show`. Your vault is closed, so the dialog **Open your vault** asks for the password. A wrong one gets `Wrong password, try again` in the dialog, which stays open. With the right one, the laptop shows the end of your key again. **Cancel** closes the dialog, and the laptop says `Cancelled. Your vault stays shut.`

<!-- screenshot: keeping-keys-open | the dialog "Open your vault" with one password field, the message "Wrong password, try again" below it -->

Any program of yours can use the key now: open the vault, then `SECRET apiKey STRING`.

## How it works

- **`unlock`** decides with IS_VAULT_OPEN and HAS_VAULT, which never ask anything. Only OPEN_VAULT and CREATE_VAULT open a dialog, and the cursor waits on their CALL line until you answer it. The error variable `problem` catches VAULT_CANCELLED for the Cancel button, and every other error (like WRONG_PASSWORD) with its message.
- **The parameter `password`** has the default `""`, which means: ask the player. Leave it empty in the game – a password you type in the dialog never leaves your game. A password given as a parameter is sent from the server to your game, so the server sees it. That's how the program runner of the tests opens the vault: it has nobody to ask. If you ever pass the password as an item, make it a [hidden item](/c0de/reference/tools#hidden-items) (**Hide the value**: "Yes, for good").
- **`store`** reads the key with hidden INPUT into `key`, which has the tag `security: "sensitive"`, and keeps it with SET_SECRET and `persistent` TRUE. That needs an open vault – otherwise SET_SECRET raises VAULT_NOT_OPEN – which `unlock` took care of. A second `store` replaces the key, in the vault and in the file.
- **`show`** asks HAS_SECRET first, because a SECRET line for a missing secret raises SECRET_NOT_FOUND. **`peek`** reads it and shows only the last four characters with RIGHT.

### What the server sees – and what it doesn't

The server **never sees**:

- the password you type in the dialog: it stays in your game,
- what's in the file: it only stores it, encrypted, as `<world>/data/c0de_vaults/<your UUID>.kdbx`.

The server **sees**:

- your secrets while the vault is open: they are in its memory, where SECRET lines read them,
- the key you type on the laptop: INPUT goes through the server,
- a password that a program passes to CREATE_VAULT or OPEN_VAULT.

So the persistent vault protects your keys on the disk of the server: in backups, copies of the world and while you are offline. While you play, the server holds them in memory, like every value a program uses. And administrators can change every sheet, also yours. Use the vault on servers whose administrators you trust.

The file is a normal KeePass database (KDBX 4): your secrets are entries of the group `c0de`, with the name as title and the value as password. With a copy of the file, KeePass and other password managers open it with your password.

## Try it yourself

1. Write a program that tells you about your vault without opening it: whether you have one, whether it's open, and whether the key is in your vault.

::: details Solution
<<< @/tutorials/programs/libraries/security/keeping-keys-status.c0de

HAS_VAULT, IS_VAULT_OPEN and HAS_SECRET never ask for a password. A closed vault shows `Vault: locked` and `Key: not here`: the key is in the file, but not in your vault until OPEN_VAULT puts it there.
:::

2. Add a function `forget` that removes the key for good, from the vault and from the file.

::: details Solution
<<< @/tutorials/programs/libraries/security/keeping-keys-forget.c0de

DELETE_SECRET removes a persistent secret from the file too, and for that the vault must be open: so `forget` calls `unlock` first. A key that isn't there raises SECRET_NOT_FOUND, which `problem` catches.
:::

## Read more

- [c0de/security](/c0de/security/): [HAS_VAULT](/c0de/security/has_vault), [CREATE_VAULT](/c0de/security/create_vault), [IS_VAULT_OPEN](/c0de/security/is_vault_open), [OPEN_VAULT](/c0de/security/open_vault), [SET_SECRET](/c0de/security/set_secret), [HAS_SECRET](/c0de/security/has_secret), [DELETE_SECRET](/c0de/security/delete_secret)
- [Secrets in the vault](/c0de/guide/libraries#secrets-in-the-vault) in the guide, [SECRET](/c0de/reference/data#secret) in the handbook Data
- [RIGHT](/c0de/strings/right) of c0de/strings
- [Hidden items](/c0de/reference/tools#hidden-items) in the handbook Tools
- [A door with a password](/tutorials/libraries/c0de/security/password-door): the vault without a file
