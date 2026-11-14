import de.joernott.c0de.core.edit.LabelContext;
import de.joernott.c0de.core.edit.LabelMode;
import de.joernott.c0de.core.edit.PropertyRules;
import de.joernott.c0de.core.edit.SheetView;
import de.joernott.c0de.core.line.Block;
import de.joernott.c0de.core.line.IndexText;
import de.joernott.c0de.core.line.Line;
import de.joernott.c0de.core.line.Notation;
import de.joernott.c0de.core.line.Sheet;
import de.joernott.c0de.core.runner.ProgramRunner;
import de.joernott.c0de.core.value.BooleanValue;
import de.joernott.c0de.core.value.CharValue;
import de.joernott.c0de.core.value.FloatValue;
import de.joernott.c0de.core.value.IntegerValue;
import de.joernott.c0de.core.value.StringValue;
import de.joernott.c0de.core.value.TimeValue;
import de.joernott.c0de.core.value.Value;
import de.joernott.c0de.core.yaml.ProgramYaml;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Prints the blocks of programs as the c0de disk places them (SheetWriter of the mod), for the screenshot world
 * (task 12.3): one line per block, "file TAB x TAB z TAB block", where block is the block ID with its block state
 * and the data of its block entity in SNBT, ready for setblock. Labels get the kind and parent that the game gives
 * them at their position (LabelContext), because setblock doesn't compute them.
 *
 * <p>With --yaml, prints each program in the YAML format of the disk instead: "file TAB yaml" with the newlines of
 * the YAML escaped as \n.
 *
 * <p>Usage: java -cp c0de-runner.jar:c0de-net-runner.jar SheetBlocks.java [--yaml] program.c0de...
 */
public class SheetBlocks {
    public static void main(String[] args) throws Exception {
        boolean yaml = args.length > 0 && args[0].equals("--yaml");
        var libraries = ProgramRunner.libraries();
        Set<String> builtins = libraries.builtins().functions().keySet();
        for (int i = yaml ? 1 : 0; i < args.length; i++) {
            String text = Files.readString(Path.of(args[i]), StandardCharsets.UTF_8);
            Sheet sheet = Notation.parse(text, ZoneOffset.UTC);
            if (yaml) {
                // A program with errors (on purpose, like the one of the lesson Errors) has no YAML; it is left out
                try {
                    System.out.println(
                            args[i] + "\t" + ProgramYaml.export(sheet).replace("\\", "\\\\").replace("\n", "\\n"));
                } catch (IllegalArgumentException e) {
                    System.err.println(args[i] + ": " + e.getMessage());
                }
                continue;
            }
            Map<String, String> ids = ids(ProgramRunner.layout(text, libraries, ZoneOffset.UTC));
            Map<Long, Block> blocks = new HashMap<>();
            for (Line line : sheet.lines()) {
                for (Line.Cell cell : line.cells()) {
                    blocks.put(key(cell.x(), line.z()), cell.block());
                }
            }
            SheetView view = (x, z) -> blocks.get(key(x, z));
            for (Line line : sheet.lines()) {
                for (Line.Cell cell : line.cells()) {
                    String id = ids.get(cell.x() + "," + line.z());
                    String nbt = nbt(cell.block(), view, cell.x(), line.z(), builtins);
                    System.out.println(args[i] + "\t" + cell.x() + "\t" + line.z() + "\t" + id + nbt);
                }
            }
        }
    }

    private static long key(int x, int z) {
        return ((long) x << 32) | (z & 0xffffffffL);
    }

    /** The block IDs with their block state by "x,z", from the layout of the runner. */
    @SuppressWarnings("unchecked")
    private static Map<String, String> ids(Map<String, Object> layout) {
        Map<String, String> ids = new HashMap<>();
        for (Map<String, Object> line : (List<Map<String, Object>>) layout.get("lines")) {
            for (Map<String, Object> block : (List<Map<String, Object>>) line.get("blocks")) {
                String id = (String) block.get("block");
                if (block.get("state") != null) {
                    id += "[" + block.get("state") + "]";
                }
                ids.put(block.get("x") + "," + line.get("z"), id);
            }
        }
        return ids;
    }

    /** The data of the block entity, as SheetWriter.properties and the apply methods of the block entities set it. */
    private static String nbt(Block block, SheetView view, int x, int z, Set<String> builtins) {
        return switch (block) {
            case Block.KeywordBlock keyword -> "";
            case Block.LabelBlock label -> {
                LabelContext context = LabelContext.of(view, x, z);
                String name = label.name() == null ? "" : label.name();
                String parent = context.parent() == null ? "" : context.parent();
                if (context.mode() == LabelMode.FUNCTION) {
                    List<String> split = PropertyRules.splitFunction(name, builtins, parent);
                    parent = split.get(0);
                    name = split.get(1);
                }
                String index = context.mode().allowsIndex() ? IndexText.format(label.index()) : "";
                yield "{kind:" + quote(context.kind().name()) + ",parent:" + quote(parent) + ",name:" + quote(name)
                        + ",index:" + quote(index) + "}";
            }
            case Block.LiteralBlock literal -> {
                Value value = literal.value();
                yield "{type:" + quote(value == null ? "" : literalType(value)) + ",value:"
                        + quote(value == null ? "" : value.text()) + "}";
            }
            case Block.OperatorBlock operator ->
                "{operator:" + quote(operator.operator() == null ? "" : operator.operator().name()) + "}";
            case Block.CommentBlock comment -> "{text:" + quote(comment.text()) + "}";
            case Block.TagBlock tag -> "{language:" + quote(tag.language() == null ? "" : tag.language()) + ",name:"
                    + quote(tag.name() == null ? "" : tag.name()) + "}";
        };
    }

    private static String literalType(Value value) {
        return switch (value) {
            case BooleanValue b -> "BOOLEAN";
            case IntegerValue i -> "INTEGER";
            case FloatValue f -> "FLOAT";
            case CharValue c -> "CHAR";
            case StringValue s -> "STRING";
            case TimeValue t -> "TIME";
            default -> throw new IllegalArgumentException("A literal can't be " + value);
        };
    }

    private static String quote(String text) {
        return "\"" + text.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }
}
