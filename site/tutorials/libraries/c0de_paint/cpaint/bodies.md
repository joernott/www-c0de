---
description: A lighthouse with a copper dome, the Platonic solids as garden sculptures and a tree of leaves, drawn with the bodies of c0de paint and their line, side and fill styles.
---

# Bodies

Spheres, cylinders, cones, pyramids and the five Platonic solids each take one call. This recipe builds a white lighthouse with red rings, a glass lantern room and a copper dome, a row of garden sculptures – one for each Platonic solid, each drawn a different way – and a little topiary garden of spruce leaves.

**Functions:** [DRAW_ELLIPSOID](/c0de_paint/cpaint/draw_ellipsoid), [DRAW_CYLINDER](/c0de_paint/cpaint/draw_cylinder), [DRAW_CONE](/c0de_paint/cpaint/draw_cone), [DRAW_PYRAMID](/c0de_paint/cpaint/draw_pyramid) and the [Platonic solids](/c0de_paint/cpaint/platonic-solids) [DRAW_TETRAHEDRON](/c0de_paint/cpaint/platonic-solids), [DRAW_OCTAHEDRON](/c0de_paint/cpaint/platonic-solids), [DRAW_DODECAHEDRON](/c0de_paint/cpaint/platonic-solids) and [DRAW_ICOSAHEDRON](/c0de_paint/cpaint/platonic-solids), with [DRAW_BOX](/c0de_paint/cpaint/draw_box), [DRAW_BLOCK](/c0de_paint/cpaint/draw_block), [STYLE_SOLID](/c0de_paint/cpaint/style_solid), [STYLE_EMPTY](/c0de_paint/cpaint/style_empty) and [RENDER_CANVAS](/c0de_paint/cpaint/render_canvas)

::: warning Needs an operator
These programs call RENDER_CANVAS without `input`: the blocks come out of nowhere, and whatever is in the way is replaced. That only works if the owner of the trigger block is an operator, or if the server allows it with `allowBlockChanges=true` in `config/c0de.properties`; otherwise RENDER_CANVAS raises PERMISSION_DENIED. To build from a chest instead, for every player, see [A first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas).
:::

::: info What you need

- the mods **c0de** and **c0de paint**, and the [first canvas](/tutorials/libraries/c0de_paint/cpaint/first-canvas) and [shapes](/tutorials/libraries/c0de_paint/cpaint/shapes) as a start
- a **trigger block** with a **button** on it, and an empty sheet for each program
- operator rights, or `allowBlockChanges` on the server (see above)
- open space: about 11 × 11 blocks and 23 high for the lighthouse, a row of about 60 blocks for the sculptures
- for the exercises: a **hill** to dig through

:::

## The idea

A body has three parts, each with its own style, like the box of the first canvas: its edges or rims (`line_style`), its surface (`side_style`) and its inside (`fill_style`). A part without a style takes the style of the next part inward. So the styles you give decide what a body looks like:

| Styles                               | The body                                  |
| ------------------------------------ | ----------------------------------------- |
| only `fill_style`                    | full                                      |
| only `side_style`                    | a hollow shell, the inside stays as it is |
| `side_style` and `fill_style` of air | a hollow shell that clears its inside     |
| only `line_style`                    | a frame of edges, nothing else            |
| `line_style` and `side_style`        | a shell with edges of a second block      |

Bodies don't lie in any plane like flat shapes. They are aligned with the axes, and cylinders, cones and pyramids grow in one of six directions: "+x" (east), "-x", "+y" (up), "-y", "+z" (south) and "-z".

## The lighthouse

<<< @/tutorials/programs/libraries/paint/bodies-lighthouse.c0de

## Building and running it

1. Place the trigger block with the button on free ground, 2 blocks west of where the lighthouse should stand.
2. Set the trigger block to `lighthouse` and `build`, and press the button.

The lighthouse stands around an axis 6 blocks east of the trigger block: a tower of white concrete, 9 blocks across and 16 high, with a red ring at its foot and at its top. On it sits a lantern room of glass, 7 blocks across and 4 high, with a sea lantern in its middle, and on top a dome of copper. The whole lighthouse is 23 blocks high. Over the days, the copper turns green.

<!-- screenshot: bodies-lighthouse | the white lighthouse, 23 blocks high, with red rings at its foot and its top, the glass lantern room with the sea lantern shining inside and the copper dome on top, seen from the side at dusk, the trigger block in front of it -->

## How it works

- **The tower.** [DRAW_CYLINDER](/c0de_paint/cpaint/draw_cylinder) draws a disc of the radius `r` around `center` and grows it by `h` voxels in `direction`. Its lines are the rims of both ends – the red rings. Its sides are the wall, the floor and the ceiling, in white. The fill is air: the tower is hollow inside, and whatever was there is gone.
- **The lantern room** is a second, thinner cylinder on top of the tower, which starts at the layer `h`. Its sides are glass – the floor and the roof too.
- **The dome.** [DRAW_ELLIPSOID](/c0de_paint/cpaint/draw_ellipsoid) draws a body around `center` with three radii; equal radii make a sphere. It only has a side style, so it is a hollow shell. Its middle lies in the roof of the lantern room, so its lower half would stick into the room.
- **The order.** That's why the dome comes first. The lantern room is drawn later and overwrites the lower half: its glass and its air are stronger, because they come last. Only the upper half of the dome remains.
- **The light.** [DRAW_BLOCK](/c0de_paint/cpaint/draw_block) sets the sea lantern into the air of the lantern room, one layer above its floor.
- **The size.** `r` and `h` have default values. INTEGER variable items `r` and `h` in the trigger block make a bigger lighthouse; the lantern room and the dome grow with `r`.

## The sculptures

[The Platonic solids](/c0de_paint/cpaint/platonic-solids) are the five bodies whose faces are all the same regular polygon: the tetrahedron (4 triangles), the cube (6 squares), the octahedron (8 triangles), the dodecahedron (12 pentagons) and the icosahedron (20 triangles). c0de paint has a function for each, with the corners at the distance `r` from `center` – and the cube is DRAW_BOX. This garden shows each of them in a different style.

<<< @/tutorials/programs/libraries/paint/bodies-garden.c0de

Move the trigger block to the west end of a free row, set it to `sculptures` and `garden`, and press the button. Five sculptures stand in a row to the east, 12 blocks apart, the first 6 blocks from the trigger block:

<!-- screenshot: bodies-sculptures | the row of five garden sculptures on the grass: the gold frame of the tetrahedron, the glass octahedron, the glass cube with quartz edges, the full moss dodecahedron and the icosahedron with quartz edges and glass faces -->

- **[DRAW_TETRAHEDRON](/c0de_paint/cpaint/platonic-solids)** with only a line style: a frame of gold edges. Its corners lie in alternate corners of a cube, so its lowest edge hangs a little above the ground.
- **[DRAW_OCTAHEDRON](/c0de_paint/cpaint/platonic-solids)** with only a side style: a hollow shell of glass. Its corners lie on the axes, so it stands on its lowest tip.
- **The cube** is a [DRAW_BOX](/c0de_paint/cpaint/draw_box) from corner to corner, 2r − 1 blocks wide, with quartz edges and glass sides.
- **[DRAW_DODECAHEDRON](/c0de_paint/cpaint/platonic-solids)** with only a fill style: the faces and the edges take it too, so it is full of moss.
- **[DRAW_ICOSAHEDRON](/c0de_paint/cpaint/platonic-solids)** with a line and a side style: 30 quartz edges and 20 glass faces.
- **Small solids are rough.** A voxel is a big step for a small body: below `r` 4, single voxels of the edges stick out of the faces. `r` 8 gives fine sculptures, in a row of 100 blocks. But a canvas ends at 127 on every axis (the setting `canvasMax`): with `r` 10, the icosahedron would reach 128, and DRAW_ICOSAHEDRON raises [CANVAS_LIMIT](/c0de_paint/cpaint/errors) – nothing is built.

Each solid has a fixed orientation. To turn one, you draw it into a canvas of its own and rotate it with CANVAS_ROTATE – more on that in [Shaping canvases](/tutorials/libraries/c0de_paint/cpaint/shaping-canvases).

## The topiary garden

Last, a tree and a hedge, cut into shape: a cone of leaves on a trunk, and a pyramid of leaves next to it.

<<< @/tutorials/programs/libraries/paint/bodies-topiary.c0de

Set the trigger block to `topiary` and `hedges` and press the button. A spruce tree, 10 blocks high, grows 5 blocks east of the trigger block, and a pyramid hedge of 7 × 7 blocks and 4 high stands 14 blocks east of it.

- **The trunk** is a cylinder with the radius 0: a single column of spruce logs, 2 high.
- **The crown.** [DRAW_CONE](/c0de_paint/cpaint/draw_cone) draws a cone on the base of a cylinder; its tip lies `h` voxels from the base in `direction`. With `r` 3 and `h` 7, it is a slim tree.
- **The hedge.** [DRAW_PYRAMID](/c0de_paint/cpaint/draw_pyramid) has a square base whose sides are 2r + 1 voxels long, and its tip lies `h` voxels above.
- **Leaves that stay.** Leaves without a tree nearby decay in Minecraft. The block state `persistent` "true" makes them stay, like leaves a player places. The BLOCK of the leaves gets it in its `properties`, so `solid` isn't enough here.

## Try it yourself

1. The lighthouse has no door. Cut one into its west wall, facing the trigger block: 1 block wide and 2 high, above the floor.

::: details Solution
A [DRAW_BOX](/c0de_paint/cpaint/draw_box) of air from `- r`,1,0 to `- r`,2,0, drawn after the tower, overwrites the white concrete there. In the middle row, the wall is only one block thick.

<<< @/tutorials/programs/libraries/paint/bodies-door.c0de

:::

2. Dig a tunnel through a hill: a round tube of stone bricks, 7 blocks across and 12 long, that runs east, starting 2 blocks east of the trigger block.

::: details Solution
A cylinder lying on its side, with `direction "+x"`. But the sides of a cylinder include its two ends, so the tube would be closed. A second, thinner cylinder of air, as long as the first one, clears the inside and opens both ends. The axis lies 2 above the trigger block, so the floor of the tunnel is 1 block below it.

<<< @/tutorials/programs/libraries/paint/bodies-tunnel.c0de

:::

3. Give the lighthouse a flatter dome.

::: details Solution
Change one line: the radius `ry` of DRAW_ELLIPSOID is the height of the dome. With `PARAMETER ry 2 ;` instead of `r - 1`, the dome is lower than it is wide. The radii `rx` and `rz` stay, so it still fits on the lantern room.
:::

## Read more

- The functions of this recipe: [DRAW_ELLIPSOID](/c0de_paint/cpaint/draw_ellipsoid), [DRAW_CYLINDER](/c0de_paint/cpaint/draw_cylinder), [DRAW_CONE](/c0de_paint/cpaint/draw_cone), [DRAW_PYRAMID](/c0de_paint/cpaint/draw_pyramid), the [Platonic solids](/c0de_paint/cpaint/platonic-solids) and [DRAW_BOX](/c0de_paint/cpaint/draw_box)
- [Shapes in any plane](/tutorials/libraries/c0de_paint/cpaint/shapes): windows, arches and a spiral staircase
- [Styles](/tutorials/libraries/c0de_paint/cpaint/styles): stripes, gradients and random blocks instead of plain white
- [Shaping canvases](/tutorials/libraries/c0de_paint/cpaint/shaping-canvases): rotating, mirroring and scaling bodies
- [Owner and permissions](/c0de/guide/libraries#owner-and-permissions) in the guide
