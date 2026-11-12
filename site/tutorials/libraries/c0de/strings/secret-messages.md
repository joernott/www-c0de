---
description: A Caesar cipher on a laptop – letters turned into numbers with ASC, shifted, and turned back into letters with CHR.
---

# Secret messages

A laptop that encodes messages with the Caesar cipher: every letter moves a few places on in the alphabet, so with the key 3, `Meet me at the Nether portal!` becomes `Phhw ph dw wkh Qhwkhu sruwdo!`. Your friend decodes it with the same key on their laptop.

**Functions:** [ASC](/c0de/strings/asc), [CHR](/c0de/strings/chr)

::: info What you need
A trigger block with a button and a **laptop**. The program has no parameters and no results.
:::

## The idea

To a computer, a character is a number: its **code point**. ASC gives the code point of a character, CHR the character of a code point. The capital letters `A` to `Z` are 65 to 90, the small letters `a` to `z` are 97 to 122, one after the other.

So moving a letter on by 3 is arithmetic: subtract the code of `A` to get its place in the alphabet (0 to 25), add 3, take the remainder of the division by 26 so that `Z` wraps around to `C`, and add the code of `A` again. Everything that is not a letter – spaces, digits, `!` – stays as it is. Decoding is the same with the key turned around: -3.

## The program

<<< @/tutorials/programs/libraries/strings/secret-messages-caesar.c0de

## Building and running it

1. Place the laptop, right-click it, click the buttons until they show `caesar` and `laptop`, and click ✔.
2. Set the trigger block to the same program and function and press the button.
3. Open the laptop. Type `Meet me at the Nether portal!` into the input line and press Enter, then the key `3`.

The screen shows:

```
Message?
Meet me at the Nether portal!
Key?
3
Secret: Phhw ph dw wkh Qhwkhu sruwdo!
Decoded: Meet me at the Nether portal!
```

<!-- screenshot: secret-messages-laptop | the terminal of the laptop after the run: the typed message and key, the secret text and the decoded message -->

To read a message from a friend, run the program again, type the secret text and the key with a minus: `Phhw ph dw wkh Qhwkhu sruwdo!` and `-3` give `Secret: Meet me at the Nether portal!`.

The cursor moves one line per tick and walks through `shiftLetter` for every character, so a message of 30 characters takes about 20 seconds per direction. Watch the cursor run through the loop on the sheet.

## How it works

- `encode` goes through the text with FOR from 0 to `length - 1`. `text[i]` reads one character of a STRING as a CHAR, and `result ⊕ letter` adds the shifted character to the end of the result.
- `shiftLetter` starts with `result` set to the letter itself, so anything that is not a letter comes back unchanged.
- ASC gives the code. The two IFs set `first` to 65 for a capital letter and to 97 for a small one; for anything else it stays 0.
- CHR turns the shifted code back into a CHAR. The code inside is `first + ( code - first + key \ 26 + 26 ) \ 26`: `\` is the remainder. `key \ 26` brings any key into -25 to 25, and the `+ 26` makes the sum positive, because the remainder of a negative number is negative in c0de (`-7 \ 26` is -7). So the key -3 works like 23, and 29 like 3.
- `laptop` encodes the message and then decodes the secret with `- key`, so you can see that the way back works.

## Try it yourself

1. ROT13 is the Caesar cipher with the key 13. What is special about it? Try `Uryyb Fgrir` with the key 13.

::: details Solution
The program writes `Secret: Hello Steve`. 13 is half of 26, so the key 13 encodes and decodes: the same key twice brings every letter back to where it was, and `Decoded` is `Uryyb Fgrir` again.
:::

2. Hide numbers too: shift the digits `0` to `9` (code points 48 to 57) by the key, so that the coordinates of your base are secret.

::: details Solution
<<< @/tutorials/programs/libraries/strings/secret-messages-digits.c0de

A third IF does the same for digits with 10 instead of 26. With the key 3, `Base at 120 64 -300` becomes `Edvh dw 453 97 -633`, and the key -3 brings it back.
:::

## Read more

- [c0de/strings](/c0de/strings/): [ASC](/c0de/strings/asc), [CHR](/c0de/strings/chr)
- [Types](/c0de/guide/language#types): CHAR and STRING; [TYPE_STRING](/c0de/reference/data#type_string): reading one character with an index
- [Operators](/c0de/guide/language#operators): `\`, the remainder
- [The cursor](/c0de/guide/running-programs#the-cursor): one line per tick
