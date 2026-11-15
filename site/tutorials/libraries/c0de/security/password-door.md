---
description: An iron door that opens when you type the right password on a laptop – hidden input with INPUT and hide, the password in your vault with SET_SECRET and SECRET, HAS_SECRET before reading it, and DELETE_SECRET to forget it.
---

# A door with a password

An iron door that opens when you type the password on the laptop next to it. While you type, the laptop shows only stars. The password isn't written anywhere in the world: not on the sheet, not in an item. It lives in your vault, and when you leave the server, the vault forgets it, so the door stays shut until you set a new one.

**Functions:** [SET_SECRET](/c0de/security/set_secret), [HAS_SECRET](/c0de/security/has_secret), [DELETE_SECRET](/c0de/security/delete_secret), and [INPUT](/c0de/reference/functions#input) with `hide`

::: info What you need

- an empty sheet, a **SECRET block** (a CONSTANT block and an iron ingot) and two **TAG blocks**
- three **trigger blocks** with a **button** each: one for the door, one to set the password, one to forget it
- two **laptops**, a **comparator** and an **iron door**
- no rights: the door is opened by redstone, which every player may use

:::

## The idea

A password on the sheet is no secret: everybody who visits the sheet can read its LITERAL blocks. A [hidden item](/c0de/reference/tools#hidden-items) is better, but its value still lies in the world, in a trigger block. c0de/security has a better place: your **vault**. Every player has one while they are online. SET_SECRET puts a value into it under a name, and a SECRET line reads it back, like a constant.

The vault has two rules that shape the door:

- **Only you.** A program only gets the vault of the player who started it, and only if that player owns the sheet. When somebody else presses the button, the program has no vault, and c0de/security raises VAULT_UNAVAILABLE. So the door only listens to you, and to you only with the password – like the PIN of a phone.
- **Only while you are online.** The vault is empty when you join. So the door needs a way to set the password (`setup`), and a way to ask whether there is one: HAS_SECRET. A SECRET line for a name that isn't in the vault raises SECRET_NOT_FOUND.

Typing should be secret, too: INPUT with `PARAMETER hide TRUE ;` shows a `*` for every character, and the laptop prints the line as `***`. And the tag `security: "sensitive"` keeps the password out of the debugging tool.

The door itself is opened by the **exit code**: a comparator next to the trigger block puts out a signal as strong as the exit code of the last process. `EXIT 1 ;` for the right password, 0 for everything else.

## The program

<<< @/tutorials/programs/libraries/security/password-door-door.c0de

## Building and running it

1. Put the iron door into the wall. Place the trigger block for the door next to it, with a comparator between them that points from the trigger block to the door. Put a button on the trigger block and the laptop next to it.
2. Set the trigger block to the program `passdoor` and the function `open`, and its **Run** button to *Only me*. Bind the laptop to `passdoor` and `open` too.
3. Inside your base, set up the second trigger block with a button for the function `setup` and a second laptop bound to `passdoor` and `setup`, and the third trigger block for `forget`. Give them the **Run** setting *Only me* too.
4. Press the button of `setup`. The laptop asks `New password:`; type the password and press Enter. The line shows `***`. Type it again after `Repeat it:`. The laptop answers `Password set.`

<!-- screenshot: password-door-setup | the laptop of the door after setup: "New password:", "***", "Repeat it:", "***" and "Password set." -->

5. Press the button of the door. The laptop asks `Password:`. Type the password: the door opens and the laptop says `Welcome home!`. A wrong password gets `Wrong password.`, and the door stays shut.

<!-- screenshot: password-door-open | the iron door open, the comparator between the trigger block and the door lit, the laptop next to it showing "Password:", "***" and "Welcome home!" -->

To close the door, press the button again: while a process runs, the comparator puts out 0, so the door closes while the laptop asks for the password.

Leave the server and join again, and press the button: `No password yet. Run setup first.` The vault forgot the password. The button of `forget` does the same on purpose: `Password forgotten. The door stays shut.`

## How it works

- **The name of the secret** is the constant `NAME`, `"doorPassword"`. SET_SECRET, HAS_SECRET and DELETE_SECRET take it as a STRING. The SECRET line in `check` names the same secret with a LABEL, `doorPassword`, because a SECRET line is a declaration, like CONSTANT.
- **`setup`** reads the password twice with hidden INPUT, compares the two and puts it into the vault with SET_SECRET. The type of the secret is the type of `value`, here STRING. A second `setup` replaces the old password.
- **`open` asks before it reads.** HAS_SECRET answers TRUE or FALSE, and it is a CALL, so the error variable `problem` can catch VAULT_UNAVAILABLE: then a visitor pressed the button (if **Run** allows *Players*), and the door says so instead of crashing. Only when the password is there does `open` call `check`.
- **`check` reads the secret.** The value is read when the cursor executes the SECRET line, so `check` is a function of its own that only runs after HAS_SECRET. Its value is sensitive: the debugging tool shows `***` for `doorPassword`. `typed` has the tag `security: "sensitive"`, and `password` and `again` in `setup` too – without it, the debugging tool would show what you typed.
- **Crashes open doors.** A process that crashes ends with exit code 15, which also powers the door. That's why `open` avoids every crash it can: it checks with HAS_SECRET first and catches VAULT_UNAVAILABLE.
- **`forget`** removes the secret with DELETE_SECRET. A secret that isn't there raises SECRET_NOT_FOUND, which `problem` catches.

## Try it yourself

1. Give the visitor three tries before the door gives up.

::: details Solution
<<< @/tutorials/programs/libraries/security/password-door-tries.c0de

The REPEAT loop calls `check` until the password is right or `tries` reaches 3. Each call of `check` reads the secret again – that's allowed, a SECRET line can run as often as you like.
:::

2. `setup` replaces the password without asking. Let it ask for the old password first, if there is one – like a phone that wants the old PIN before you choose a new one.

::: details Solution
<<< @/tutorials/programs/libraries/security/password-door-change.c0de

`setup` asks HAS_SECRET first. If there is a password, it calls `check` and stops after a wrong one with `Wrong password. Nothing changed.` Without a password, for the first `setup` after joining, it asks for the new one right away.
:::

## Read more

- [c0de/security](/c0de/security/): [SET_SECRET](/c0de/security/set_secret), [HAS_SECRET](/c0de/security/has_secret), [DELETE_SECRET](/c0de/security/delete_secret)
- [c0de/security](/c0de/guide/libraries#c0desecurity) and [Secrets in the vault](/c0de/guide/libraries#secrets-in-the-vault) in the guide
- [SECRET](/c0de/reference/data#secret) and [TAG](/c0de/reference/data#tag) in the handbook Data, [Hidden items](/c0de/reference/tools#hidden-items) in the handbook Tools
- [INPUT](/c0de/reference/functions#input) and the [laptop](/c0de/reference/devices#laptop)
- [Exit codes](/c0de/guide/running-programs#exit-codes) and [Errors](/c0de/guide/language#errors)
- [Keeping keys](/tutorials/libraries/c0de/security/keeping-keys): secrets that stay when you leave
