import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export interface DiscoveredSkill {
    name: string;
    path: string;
    sourceType: "Personal" | "Marketplace";
    sourceName?: string;
}

export class Scanner {
    private static readonly PERSONAL_SKILLS_PATH = path.join(os.homedir(), ".claude/skills");
    private static readonly MARKETPLACE_PATH = path.join(os.homedir(), ".claude/plugins/marketplaces");

    /**
     * Scans for all available skills.
     */
    async scan(): Promise<DiscoveredSkill[]> {
        const skills: DiscoveredSkill[] = [];

        // 1. Scan Personal Skills
        const personal = await this.scanDirectory(Scanner.PERSONAL_SKILLS_PATH, "Personal");
        skills.push(...personal);

        // 2. Scan Marketplace Skills
        try {
            const marketplaces = await fs.readdir(Scanner.MARKETPLACE_PATH);
            for (const marketplace of marketplaces) {
                const skillsDir = path.join(Scanner.MARKETPLACE_PATH, marketplace, "skills");
                const marketplaceSkills = await this.scanDirectory(skillsDir, "Marketplace", marketplace);
                skills.push(...marketplaceSkills);
            }
        } catch (e) {
            // Marketplace path might not exist
        }

        return skills;
    }

    private async scanDirectory(dir: string, type: "Personal" | "Marketplace", sourceName?: string): Promise<DiscoveredSkill[]> {
        const found: DiscoveredSkill[] = [];
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    found.push({
                        name: entry.name,
                        path: path.join(dir, entry.name),
                        sourceType: type,
                        sourceName: sourceName,
                    });
                }
            }
        } catch (e) {
            // Directory might not exist
        }
        return found;
    }
}
