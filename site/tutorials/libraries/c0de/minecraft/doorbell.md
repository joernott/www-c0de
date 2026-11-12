---
description: A doorbell for the front door that rings with BEEP and tells you in the chat who is there, and a melody that SOUND plays from an array of notes and instruments.
---

# Doorbell and music

A button at the front door rings a bell, and the chat tells everybody in the base who is waiting outside. Then the same door gets a melody, played note by note from two arrays.

**Functions:** [BEEP](/c0de/minecraft/beep), [SOUND](/c0de/minecraft/sound), [SAY](/c0de/minecraft/say), and [SLEEP](/c0de/time/sleep) of c0de/time

::: info What you need

- two **trigger blocks**, each with a **button** on it, next to your front door
- an empty sheet for each program
- nothing else: these functions need no rights, they work for every owner on every server

:::

## The idea

A program can't only compute; it can make itself heard. BEEP plays a short bell sound, SOUND plays a note like a note block, and both sound **at the trigger block**. So the trigger block has to stand where the sound should be: at the door.

SAY reaches farther: it writes into the chat of all players near the trigger block (within 64 blocks by default), or of one player you name. Each message starts with the name of the program and its PID, so you can see which program is talking.

## The doorbell

<<< @/tutorials/programs/libraries/minecraft/doorbell-bell.c0de

## Building and running it

1. Place a trigger block outside next to the front door, and put a button on it.
2. Open its dialog, set it to the program `doorbell` and the function `ring`, and set **Run** to _Players_, so your visitors may press it.
3. Press the button.

You hear the bell at the door, and the chat shows `Steve is at the front door.` after the name of the program and its PID.

<!-- screenshot: doorbell-door | the front door of the base from outside with the trigger block and its button beside it, and the chat line with "Steve is at the front door." -->

## How it works

- **Who rang?** `PID.activator` is the name of the player who started the process. A trigger block started by plain redstone, such as a pressure plate or a daylight sensor, may have no player to name; then `visitor` keeps its start value `"Someone"`.
- **BEEP** has no parameters: one bell sound at the trigger block, nothing else.
- **SAY** without `player` goes to everybody near the trigger block. Inside a big base, that's everybody who could open the door.

## The melody

A tune is a list of notes. Two arrays of the same length describe it: `notes` holds the pitch of each note, `instruments` the instrument that plays it.

<<< @/tutorials/programs/libraries/minecraft/doorbell-melody.c0de

Place the second trigger block next to the first one, set it to `melody` and `play`, and press its button: the beginning of "Twinkle, Twinkle, Little Star".

- **The notes.** `note` goes from 0 to 24, like the clicks on a note block: 0 is F♯, 1 is G, 6 is C, 8 is D, 10 is E, and 12 is F♯ again, one octave higher. A note outside 0 to 24 raises INVALID_ARGUMENT.
- **The instruments** are those of the note block, such as `harp` (the default), `bass`, `bell` and `flute`. A name that isn't one raises INVALID_ARGUMENT.
- **The loop** goes through both arrays with the same index `i`. LEN gives the number of notes, so the loop still fits when you add notes.
- **The rhythm.** SLEEP waits 6 ticks after each note. Without it, the cursor would play one note per tick, and the tune would be over in a blink.

## Try it yourself

1. Let the doorbell ring "ding-dong" with two bell notes instead of BEEP.

::: details Solution
Two SOUND calls with a pause between them: first the higher note 19, then 15.

<<< @/tutorials/programs/libraries/minecraft/doorbell-dingdong.c0de

:::

2. Send the message only to the owner of the trigger block, and tell the visitor when the owner isn't online.

::: details Solution
`PARAMETER player PID.owner ;` sends it to the owner only. If they aren't online, SAY raises INVALID_ARGUMENT, so the CALL catches the error in `problem`, and a second SAY tells everybody near the door.

<<< @/tutorials/programs/libraries/minecraft/doorbell-owner.c0de

:::

3. Play the whole first line of the song, with a rest in the middle. Use the note -1 for a rest.

::: details Solution
The second half is C C B B A A G: 6 6 5 5 3 3 1. The loop only plays notes from 0 up; for -1 it just waits. A rest needs an entry in `instruments` too, so both arrays keep the same length.

<<< @/tutorials/programs/libraries/minecraft/doorbell-rests.c0de

:::

## Read more

- The functions of this recipe: [BEEP](/c0de/minecraft/beep), [SOUND](/c0de/minecraft/sound), [SAY](/c0de/minecraft/say), [SLEEP](/c0de/time/sleep) and [LEN](/c0de/reference/functions#len)
- [Making music](/c0de/guide/libraries#making-music) and [c0de/minecraft](/c0de/guide/libraries#c0deminecraft) in the guide
- [Structs](/c0de/guide/language#structs) in the guide: the constant `PID` and its elements
- [Errors](/c0de/guide/language#errors) in the guide: catching an error in a CALL
