---
description: A door that opens when somebody steps on a pressure plate and closes after a delay, with GET_PRESSURE_PLATE, GET_OPEN and SET_OPEN, and a report in the chat of all doors, gates and trapdoors that are open.
---

# Automatic doors

A shop door that opens by itself: step on the pressure plate in front of it, and it swings open; two seconds after you have passed, it closes again. And before you go to bed, one button tells you which doors, gates and trapdoors of your base are still open.

**Functions:** [GET_PRESSURE_PLATE](/c0de/minecraft/get_pressure_plate), [GET_OPEN](/c0de/minecraft/get_open), [SET_OPEN](/c0de/minecraft/set_open), and [SLEEP](/c0de/time/sleep) of c0de/time

::: info What you need

- a **timer block**, a **trigger block** with a **button** on it, and an empty sheet for each program
- a **wooden door** and two **pressure plates**
- for the report: a few more doors, **fence gates** or **trapdoors**
- no rights for wooden doors, gates and trapdoors. Iron doors and iron trapdoors need `allowBlockChanges` on a server, or an operator as owner, like in the [guarded door](/tutorials/learning/guarded-door).

:::

## The idea

A pressure plate right next to a door opens it by redstone – but then the door shuts the moment you step off, often in front of your nose. A program can do better: it reads the plates, opens the door, and closes it only when nobody has stepped on a plate for two seconds.

GET_PRESSURE_PLATE reads a plate's signal strength from 0 (nobody) to 15. GET_OPEN tells if a door is open, and SET_OPEN opens or closes it. All three also work for trapdoors and fence gates.

## The door

<<< @/tutorials/programs/libraries/minecraft/automatic-doors-door.c0de

## Building and running it

Stand south of the place for the timer block and look north.

| What               | Where, seen from the timer block                         |
| ------------------ | -------------------------------------------------------- |
| the wooden door    | in a wall 4 blocks north (lower half at the timer's height) |
| the outside plate  | 2 blocks north, in front of the door                     |
| the inside plate   | 6 blocks north, behind the door                          |

Between each plate and the door, one block stays free: a plate that touches the door would open it by redstone itself. Set the timer block to `autodoor` and `watch`, with an interval of 10 ticks. Walk over the plate: the door opens before you reach it and closes behind you.

<!-- screenshot: automatic-doors-door | the open wooden door seen from outside, the player on the outside plate two blocks in front of it, the inside plate visible through the doorway and the timer block in the foreground -->

## How it works

- **`someone`** reads both plates and gives `TRUE` if one of them has a signal. Because the program needs this twice, it is a function of its own.
- **Opening.** If somebody is on a plate and the door is closed, SET_OPEN opens it. GET_OPEN avoids opening a door that is already open – and it tells the program where it is: door open, nobody on a plate means it's time to close.
- **The delay.** Then the run sleeps 40 ticks, two seconds, and looks at the plates again. Only if they are still empty, the door closes. If somebody stepped on a plate meanwhile, the door stays open, and the next run starts over.
- **One run at a time.** While a run sleeps, the timer block starts no new run. So there is never a second run that closes the door while the first is waiting.

## The report

The second program looks at a list of doors and writes the open ones into the chat. Three arrays describe the doors: a name, and the distance east (`dx`), up (`dy`) and south (`dz`) from the trigger block. Element `i` of each array belongs to the same door.

<<< @/tutorials/programs/libraries/minecraft/automatic-doors-report.c0de

The numbers in the arrays are an example; measure your own. Press F3 and look at a door: "Targeted Block" shows its x, y and z. Subtract the x, y and z of the trigger block, and you have `dx`, `dy` and `dz`. For a door, take the lower half. Put the trigger block with its button by your bed, set it to `doorreport` and `report`, and press the button. The chat says `Open: front door, cellar trapdoor` or `All doors are closed.`

- **The position** of each door is computed right in the loop: `spot.x` becomes `PID.x + dx[i]`, and so on.
- **Joining names.** `openDoors` starts empty. Before each further name, the loop adds `", "`, so the list has commas only between the names.

## Try it yourself

1. Don't just report the open doors – close them, too, and say which ones you closed.

::: details Solution
<<< @/tutorials/programs/libraries/minecraft/automatic-doors-close.c0de

SET_OPEN with `open FALSE` closes each door that GET_OPEN finds open. Closing a closed door would do no harm, but this way the program knows what it did.
:::

2. Use a **light weighted pressure plate** (the gold one) outside: its signal grows with the number of entities on it. Let the door open only when at least two stand on it, for example you and your horse.

::: details Solution
`someone` gets `ASSIGN result outside ≥ 2 OR inside > 0 ;`. A wooden or stone plate always gives 15 or 0, a weighted plate gives more the more there is on it.
:::

## Read more

- The functions of this recipe: [GET_PRESSURE_PLATE](/c0de/minecraft/get_pressure_plate), [GET_OPEN](/c0de/minecraft/get_open), [SET_OPEN](/c0de/minecraft/set_open), [SLEEP](/c0de/time/sleep) and [LEN](/c0de/reference/functions#len)
- [Project: the guarded door](/tutorials/learning/guarded-door), the iron door with a list of friends
- [Changing the world](/c0de/guide/libraries#changing-the-world) and [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide
- [The Timer block](/c0de/reference/triggers#timer-block) in the handbook Triggers
