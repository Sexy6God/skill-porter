import fs from "fs-extra";
import path from "node:path";

export interface PorterOptions {
    overwrite?: boolean;
}

export class Porter {
    /**
     * Copies a skill directory to a destination.
     */
    async port(sourcePath: string, destPath: string, options: PorterOptions = {}): Promise<void> {
        const { name } = path.parse(sourcePath);
        const targetDir = path.join(destPath, name);

        // Ensure parent destination directory exists
        await fs.ensureDir(destPath);

        if (await fs.pathExists(targetDir)) {
            if (options.overwrite) {
                await fs.remove(targetDir);
            } else {
                throw new Error(`Target skill already exists at ${targetDir}`);
            }
        }

        await fs.copy(sourcePath, targetDir);
    }
}
