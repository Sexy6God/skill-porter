import os from "node:os";
import path from "node:path";

export interface PlatformConfig {
    name: string;
    globalPath: string;
    localPath: string;
}

const home = os.homedir();

export const PLATFORMS: Record<string, PlatformConfig> = {
    "Claude Code": {
        name: "Claude Code",
        globalPath: path.join(home, ".claude/skills"), // 图片: ~/.claude/skills/
        localPath: ".claude/skills",
    },
    "GitHub Copilot": {
        name: "GitHub Copilot",
        globalPath: path.join(home, ".copilot/skills"), // 图片修正: ~/.copilot/skills/ (原为 .github/skills)
        localPath: ".github/skills",
    },
    "Google Antigravity": {
        name: "Google Antigravity",
        globalPath: path.join(home, ".gemini/antigravity/skills"), // 图片: ~/.gemini/antigravity/skills/
        localPath: ".agent/skills",
    },
    "Cursor": {
        name: "Cursor",
        globalPath: path.join(home, ".cursor/skills"), // 图片: ~/.cursor/skills/
        localPath: ".cursor/skills",
    },
    "OpenCode": {
        name: "OpenCode",
        globalPath: path.join(home, ".opencode/skill"), // 用户修正: ~/.opencode/skill
        localPath: ".opencode/skill",
    },
    "OpenAI Codex": {
        name: "OpenAI Codex",
        globalPath: path.join(home, ".codex/skills"), // 图片: ~/.codex/skills/
        localPath: ".codex/skills",
    },
    "Gemini CLI": {
        name: "Gemini CLI",
        globalPath: path.join(home, ".gemini/skills"), // 图片: ~/.gemini/skills/
        localPath: ".gemini/skills",
    },
    "Windsurf": {
        name: "Windsurf",
        globalPath: path.join(home, ".codeium/windsurf/skills"), // 图片: ~/.codeium/windsurf/skills/
        localPath: ".windsurf/skills",
    },
};
