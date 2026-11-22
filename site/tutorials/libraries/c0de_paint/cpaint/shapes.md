---
description: A round window, an arched gate, a star in the floor and a spiral staircase, drawn with the flat shapes of c0de paint, which lie in any plane that three points give.
---

# Shapes in any plane

A box is only the start. This recipe draws flat shapes: a wall with a round window and a cross of dark oak, a gate with a round arch, a golden star set into the floor, and a spiral staircase that winds up around its own axis. The same functions draw upright, lying or slanted – the points decide.

**Functions:** [DRAW_BLOCK](/c0de_paint/cpaint/draw_block), [DRAW_LINE](/c0de_paint/cpaint/draw_line), [DRAW_RECTANGLE](/c0de_paint/cpaint/draw_rectangle), [DRAW_POLYGON](/c0de_paint/cpaint/draw_polygon), [DRAW_ELLIPSE](/c0de_paint/cpaint/draw_ellipse), [DRAW_ARC](/c0de_paint/cpaint/draw_arc) and [DRAW_SPIRAL](/c0de_paint/cpaint/draw_spiral), with [STYLE_SOLID](/c0de_paint/cpaint/style_solid), [STYLE_EMPTY](/c0de_paint/cpaint/style_empty) and [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas)

::: warning Needs an operator
These programs call RENDER_CANVAS without `input`: the blocks come out of nowhere, and whatever is in the way is replaced – the gate even cuts its passage out of the wall, the star replaces the ground. That only works if the owner of the trigger block is an operator, or if the server allows it with `allowBlockChanges=true` in `config/c0de.properties`; otherwise RENDER_CANVAS raises PERMISSION_DENIED. To build from a chest instead, for every player, see [A first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas).
:::

::: info What you need

- the mods **c0de** and **c0de paint**, and the [first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas) as a start
- a **trigger block** with a **button** on it, and an empty sheet for each program
- operator rights, or `allowBlockChanges` on the server (see above)
- a flat place of about 15 × 20 blocks; the staircase and the window grow up to 13 blocks high

:::

## The idea

A flat shape lies in a plane, and three points give that plane. A rectangle from 0,0,0 to 9,0,0 that reaches up to 0,4,0 stands upright like a wall; with 0,0,4 as its third point it lies flat like a carpet. Nothing else changes: there are no separate functions for walls and floors.

Flat shapes have two parts, each with its own style: the outline (`line_style`) and the area inside (`fill_style`). Without a line style, the outline takes the fill style. And what you draw later overwrites what is there: a window is a circle drawn into a wall.

All four programs share a little helper, `solid`, which turns a block id into a STYLE_SOLID, so the drawing functions don't drown in BLOCK variables.

## The round window

<<< @/tutorials/programs/libraries/paint/shapes-window.c0de

## Building and running it

1. Place the trigger block where the wall should start, and put the button on it.
2. Set the trigger block to `roundwindow` and `window`, and press the button.

A wall of stone bricks, 13 blocks wide and 13 high, rises from 2 to 14 blocks east of the trigger block, in its row. In its middle sits a round window of light blue glass with a rim of polished andesite, 9 blocks across, divided by a cross of dark oak planks.

<!-- screenshot: shapes-window | the wall of stone bricks, 13 × 13 blocks, with the round window of light blue glass in its middle, framed by polished andesite and divided by a cross of dark oak planks, the trigger block with its button in front of its west end -->

## How it works

- **Upright, because of the points.** DRAW_RECTANGLE gets `a` at 0,0,0 and `b` at 2r + 4,0,0, one side along the ground; `c` at 0,2r + 4,0 lies straight above `a`, so the other side runs up. The `z` of all points is 0: everything lies in one upright plane.
- **The circle.** [DRAW_ELLIPSE](/c0de_paint/cpaint/draw_ellipse) takes a `center` and two points: the distance of `a` is the first radius, the distance of `b` from the line through `center` and `a` the second one. Both are `r`, so it is a circle. `b` above the center also puts the circle into the plane of the wall.
- **Outline and area.** The rim gets `line_style rim`, the inside `fill_style glass`. They overwrite the bricks of the wall – drawing order matters.
- **The cross.** [DRAW_LINE](/c0de_paint/cpaint/draw_line) draws from `from` to `to`, here once across and once up the window. A line can go in any direction; its voxels connect through edges and corners.
- **Variables are reused.** `a`, `b` and `m` are only values: after the rectangle, the program sets their elements anew for the circle and the lines. The canvas has already stored the shapes.
- **The size.** `r` has the default value 4. A different radius needs only an INTEGER variable item `r` in the trigger block: wall, window and cross grow with it.

## The arched gate

Next comes a wall with a gate: a passage cut out with air, and a round arch on top of it.

<<< @/tutorials/programs/libraries/paint/shapes-gate.c0de

Move the trigger block to a free place, set it to `archgate` and `gate`, and press the button. A cobblestone wall, 11 blocks wide and 8 high, stands 2 blocks east of the trigger block. Its gate is 5 blocks wide and 5 high in the middle, framed by an arch of chiseled stone bricks.

- **Cutting out.** The passage is a second rectangle with [STYLE_EMPTY](/c0de_paint/cpaint/style_empty). Its voxels are set to air, so they overwrite the cobblestone, and in the world they remove whatever is there.
- **Half a circle.** [DRAW_ARC](/c0de_paint/cpaint/draw_arc) draws the part of an ellipse from `start` to `end`, in degrees, counted from `a` towards `b`. From 0 to 180 is the upper half: `a` lies east of the center, `b` above it.
- **The arch and the opening.** The line of the arc is the arch of chiseled stone bricks. Its `fill_style air` is the pie slice inside the arc, which opens the gate up to the arch. It starts at the top of the passage, so both openings meet.

## A star in the floor

A star is a polygon with 10 corners: 5 tips and 5 notches between them. The program computes them with COS and SIN on a circle and lays the star flat into the ground.

<<< @/tutorials/programs/libraries/paint/shapes-star.c0de

Set the trigger block to `floorstar` and `star` and press the button. A star of white concrete with a golden outline replaces the ground east of the trigger block, its middle 10 blocks away, with a sea lantern in its center. Its tips are 8 blocks from the middle, and one of them points north.

<!-- screenshot: shapes-star | the five-pointed star set into the grass, white concrete with a rim of gold blocks and a sea lantern in its middle, seen from above, the trigger block 2 blocks west of its western tip -->

- **The corners.** The loop goes round the circle in steps of 36°, which is `c0de/math/PI / 5`. The even corners are tips with the radius `r`, the odd ones notches with 2/5 of it. [COS](/c0de/math/cos) gives the share in `x`, SIN the share in `z`, and ROUND makes whole voxels of them. The `- 0.5` turns the first tip north.
- **An ARRAY of POINTs.** `ASSIGN corners[i] p ;` appends a copy of `p` to the array, so `p` can be reused for the next corner.
- **Lying flat.** All corners have `y` 0, so [DRAW_POLYGON](/c0de_paint/cpaint/draw_polygon) finds a horizontal plane. The polygon closes itself from the last corner back to the first.
- **One voxel.** [DRAW_BLOCK](/c0de_paint/cpaint/draw_block) sets a single voxel: the sea lantern in the middle, drawn last, so it overwrites the concrete.
- **Into the ground.** RENDER_CANVAS puts the voxel 0,0,0 one block below the trigger block, so the star replaces the ground and lies level with it.

## The spiral staircase

A spiral staircase is a single call: [DRAW_SPIRAL](/c0de_paint/cpaint/draw_spiral) draws a spiral up an axis, and its fill style fills the steps between the axis and the spiral.

<<< @/tutorials/programs/libraries/paint/shapes-staircase.c0de

Set the trigger block to `spiralstairs` and `stairs` and press the button. The staircase winds up around an axis 5 blocks east of the trigger block: steps of oak planks with an edge of spruce planks, 7 blocks across and 12 high. It starts east of the axis and turns clockwise, to the south first, one and a half times round.

<!-- screenshot: shapes-staircase | the spiral staircase of oak planks with an edge of spruce planks, 12 blocks high, winding clockwise around its central column, a player on one of its upper steps -->

- **The circle of the spiral.** `center`, `a` and `b` work as in DRAW_ELLIPSE: the spiral starts at `a`, east of the axis, and turns towards `b`, to the south. `direction "+y"` lets it rise. The circle lies across the direction: all three points have `y` 0.
- **`elevation`** says how many layers each voxel of the spiral lies above the one before, rounded down. 0.5 rises every second voxel: every step is two blocks long at the edge, and every step is one block higher than the one before – you can walk up.
- **`h`** is the height in layers: the spiral ends below layer 12, like a cylinder of the height 12.
- **Line and fill.** The line is the spiral itself, the outer edge of the steps. The fill is the ramp from the axis to the spiral, and the axis is drawn in every layer: the central column of the staircase.

## Try it yourself

1. Make the staircase steeper: what happens with an `elevation` of 1, and what with 2?

::: details Solution
No new code: put a FLOAT variable item `elevation` into the trigger block. With 1, every voxel of the edge is one layer higher than the one before; the steps are only one block long at the edge, but you can still walk up, and 12 layers are only three quarters of a turn. With 2, every voxel climbs two layers, so there is a gap of one layer between the steps – a decoration, but no staircase any more.
:::

2. Stand the star upright, like a star on a wall, with its tip up.

::: details Solution
Only the plane changes: the corners get `y` instead of `z`. The `+ 0.5` turns the first tip up, and RENDER_CANVAS lifts the star by `r`, so its lower tips stay above the ground.

<<< @/tutorials/programs/libraries/paint/shapes-upright.c0de

:::

3. Put an INTEGER variable item `r` with 0 into the trigger block of the star. What happens? Let the program say "No star: r is too small" instead.

::: details Solution
With `r` 0, all corners are 0,0,0. They lie on one line – even on one point – so they give no plane, and DRAW_POLYGON raises [NOT_A_PLANE](/c0de_paint/cpaint/errors): the program crashes. Catch the error in the CALL and compare its code with the constant `c0de_paint/cpaint/NOT_A_PLANE`.

<<< @/tutorials/programs/libraries/paint/shapes-safestar.c0de

:::

## Read more

- The functions of this recipe: [DRAW_BLOCK](/c0de_paint/cpaint/draw_block), [DRAW_LINE](/c0de_paint/cpaint/draw_line), [DRAW_RECTANGLE](/c0de_paint/cpaint/draw_rectangle), [DRAW_POLYGON](/c0de_paint/cpaint/draw_polygon), [DRAW_ELLIPSE](/c0de_paint/cpaint/draw_ellipse), [DRAW_ARC](/c0de_paint/cpaint/draw_arc) and [DRAW_SPIRAL](/c0de_paint/cpaint/draw_spiral)
- [Getting started](/c0de_paint/cpaint/getting-started) with c0de paint, and its [errors](/c0de_paint/cpaint/errors)
- [A first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas): building from a chest, for every player
- [Bodies](/tutorials/libraries/c0de_paint/cpaint/bodies): cylinders, domes and the Platonic solids
- [COS](/c0de/math/cos) and [PI](/c0de/math/pi) of c0de/math, and [Drawing a circle](/tutorials/libraries/c0de/math/circle) block by block
- [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) and [Errors](/c0de/guide/language#errors) in the guide
