# GNU Unifont (a part)

`unifont.hex` holds the glyphs of [GNU Unifont](https://unifoundry.com/unifont/) 16.0.04 (`font-builds/unifont-16.0.04.hex.gz`) for the characters that the texts of blocks in the 3D views of programs use (task 9.0): Basic Latin, Latin-1, Latin Extended-A, General Punctuation, Arrows, Mathematical Operators and the replacement character U+FFFD. The import draws them into `textures/glyphs.png` (`scripts/import/scene.ts`). Minecraft uses Unifont for the characters its own font doesn't have.

The fonts of Unifont are licensed under the SIL Open Font License 1.1 (`OFL-1.1.txt`) and under the GNU General Public License 2 or later with the GNU font embedding exception. Copyright: Roman Czyborra, Paul Hardy and the other contributors of GNU Unifont.

To add characters, take their lines from the full hex file of the same version; each line is `code point:glyph`, 32 hex digits for 8 x 16 pixels, 64 for 16 x 16.
