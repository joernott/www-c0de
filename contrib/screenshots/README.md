# The screenshot world

The screenshots of the tutorials (tasks 7.1.1 and 12.3) are taken in a world where every program they show is
already built on its own sheet. `npm run screenshot-world` in `site/` writes:

- `docs/screenshots.md`, the to-do list: every screenshot with its page, its program, its sheet and the code,
- `docs/screenshots.yaml`, the same as data, with every program also in the YAML format of the c0de disk,
- `contrib/screenshots/out/c0de_screenshots/`, a datapack that builds the world (not committed).

It needs `npm run content` first, which downloads the program runners of the versions in `sources.yaml`, and
Java. `SheetBlocks.java` uses the classes of the runner to place the blocks like the c0de disk does: every label
gets the kind and parent that the game gives it at its position, every literal, operator, comment and tag its
properties.

## The world

- Sheet 0 is empty; the programs are on the even sheets from 2 on, in the order of the pages, so an empty sheet
  lies between two programs. A sheet starts at x = 32 × its number.
- North of every sheet, at z = -3 from x + 5 on: a trigger block with a stone button, a debug trigger block with a
  laptop, a timer block with a lever that is on (it pauses the timer), an I/O block, a disk drive and a gray
  shulker box with a stack of variable, constant and literal items and a disk. The three trigger blocks are set
  to the program and the function of its test.
- Behind them, at z = -6: a display wall of 4 × 3 display blocks facing the sheet, in a frame of iron blocks.

## Building it

On the Minecraft 1.21.1 Fabric test server of c0de on the VM (`contrib/docker/compose.yaml` of c0de), with the
released jars of c0de and c0de net in `contrib/docker/mods/1.21.1-fabric/` of that repository, in a new world:

```sh
# from site/ on Windows
npm run screenshot-world
# copy the datapack to the VM and into the world of the server
tar czf - -C ../contrib/screenshots/out c0de_screenshots | ssh doener@<vm> 'tar xzf - -C /tmp'
# on the VM, in ~/src/minecraft-c0de
C="docker compose -f contrib/docker/compose.yaml"
docker cp /tmp/c0de_screenshots "$($C ps -q c0de-1.21.1-fabric):/data/world/datapacks/"
$C exec -T -u root c0de-1.21.1-fabric chown -R 1000:1000 /data/world/datapacks
$C exec -T c0de-1.21.1-fabric rcon-cli reload
$C exec -T c0de-1.21.1-fabric rcon-cli "function c0de_screenshots:build"
```

The build loads one sheet after the other and takes about half a minute. Afterwards
`function c0de_screenshots:check` counts the blocks of every program whose line number isn't dark green; read the
counts with `scoreboard players get sheet_<n> c0de_shots`. They are 0, except for the program of the lesson
Errors, which has its bugs on purpose, and the programs that share a name.

## Programs with the same name

A program name can only be used once in a world; a second sheet with the same name gets a red line 0. The
lessons build some programs step by step under the same name (`sign`, `stacks`), so only one of them is valid
at a time: after the build, the first one. `function c0de_screenshots:activate/<file>` (e.g.
`activate/colors-sign`) makes another one the valid one; the to-do list names the command where it is needed.
