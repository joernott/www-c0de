import de.joernott.c0de.core.line.Notation;
import de.joernott.c0de.core.line.Sheet;
import de.joernott.c0de.core.yaml.ProgramYaml;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.ZoneOffset;
import java.util.stream.Stream;

/**
 * Writes every program of a folder in the YAML format of the c0de disk, the file that the disk drive saves to the
 * folder c0de of the client (the download of the 3D views): for every name.c0de of the folder, name.yaml next to
 * it. A program that can't be exported (one with errors on purpose) gets no file; its message goes to stderr.
 *
 * <p>Usage: java -cp c0de-runner.jar ProgramFiles.java folder
 */
public class ProgramFiles {
    public static void main(String[] args) throws Exception {
        Path folder = Path.of(args[0]);
        try (Stream<Path> files = Files.list(folder)) {
            for (Path file : files.filter(f -> f.toString().endsWith(".c0de")).sorted().toList()) {
                String name = file.getFileName().toString().replaceFirst("\\.c0de$", "");
                try {
                    Sheet sheet = Notation.parse(Files.readString(file, StandardCharsets.UTF_8), ZoneOffset.UTC);
                    Files.writeString(folder.resolve(name + ".yaml"), ProgramYaml.export(sheet), StandardCharsets.UTF_8);
                } catch (IllegalArgumentException e) {
                    System.err.println(name + ": " + e.getMessage());
                }
            }
        }
    }
}
