import os from "node:os";
import path from "node:path";

/**
 * Expands '~' to the user's home directory.
 */
export function expandTilde(filepath: string): string {
    if (filepath.startsWith("~/") || filepath === "~") {
        return path.join(os.homedir(), filepath.slice(1));
    }
    return filepath;
}

/**
 * Normalizes a path and ensures it's absolute if it should be.
 */
export function resolvePath(filepath: string, baseDir: string = process.cwd()): string {
    const expanded = expandTilde(filepath);
    return path.resolve(baseDir, expanded);
}
