#!/usr/bin/env bun
import * as p from "@clack/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import { Scanner, type DiscoveredSkill } from "./src/core/scanner";
import { Porter } from "./src/core/porter";
import { PLATFORMS } from "./src/config/platforms";
import { expandTilde, resolvePath } from "./src/utils/paths";

async function main() {
    console.log("");
    p.intro(chalk.bgCyan.black(" SkillPorter - AI Skill Synchronizer "));

    const scanner = new Scanner();
    const porter = new Porter();

    const s = p.spinner();

    // 1. Scan for skills
    s.start("正在扫描 Claude 技能...");
    const discoveredSkills = await scanner.scan();
    s.stop("扫描完成");

    if (discoveredSkills.length === 0) {
        p.note("未在 ~/.claude 中找到任何技能。");
        p.outro("任务结束");
        return;
    }

    // 2. Select Skills
    const selectedSkillPaths = await p.multiselect({
        message: "请选择要同步的技能:",
        options: discoveredSkills.map((s) => ({
            value: s.path,
            label: s.name,
            hint: s.sourceType === "Marketplace" ? `插件: ${s.sourceName}` : "个人",
        })),
        required: true,
    });

    if (p.isCancel(selectedSkillPaths)) {
        p.outro("同步已取消");
        return;
    }

    // 3. Select Destinations
    s.start("正在寻找可用目的地...");
    const platformsOptions = [];
    for (const [key, config] of Object.entries(PLATFORMS)) {
        // Skip Claude as destination if it's the source (though currently we only sync from Claude)
        if (key === "Claude Code") continue;

        const globalPath = expandTilde(config.globalPath);
        let globalExists = false;
        if (await fs.pathExists(globalPath)) {
            globalExists = true;
            platformsOptions.push({
                value: { name: config.name, path: globalPath, type: "Global" },
                label: `${config.name} (Global)`,
                hint: globalPath,
            });
        }

        const localPath = resolvePath(config.localPath);
        // 如果 Local 路径和 Global 路径相同且 Global 已经添加过了，则跳过
        if (globalExists && localPath === globalPath) {
            continue;
        }

        // Only show local if it already exists (project-specific)
        if (await fs.pathExists(localPath)) {
            platformsOptions.push({
                value: { name: config.name, path: localPath, type: "Local" },
                label: `${config.name} (Local)`,
                hint: localPath,
            });
        }
    }
    s.stop("目的地扫描完成");

    if (platformsOptions.length === 0) {
        p.note("未检测到支持的目标平台目录。请确保相关 AI 工具已安装。");
        p.outro("任务结束");
        return;
    }

    const selectedDests = await p.multiselect({
        message: "请选择目标目的地:",
        options: platformsOptions,
        required: true,
    });

    if (p.isCancel(selectedDests)) {
        p.outro("同步已取消");
        return;
    }

    // 4. Perform Sync
    let overwrite = false;
    const overwriteChoice = await p.confirm({
        message: "如果目标目录已存在同名技能，是否覆盖?",
        initialValue: false,
    });
    if (p.isCancel(overwriteChoice)) return;
    overwrite = overwriteChoice;

    s.start("正在搬运技能...");
    const results = [];
    for (const skillPath of selectedSkillPaths as string[]) {
        const skillName = skillPath.split("/").pop();
        for (const dest of selectedDests as any[]) {
            try {
                await porter.port(skillPath, dest.path, { overwrite });
                results.push({ skill: skillName, dest: dest.name, type: dest.type, status: "SUCCESS" });
            } catch (e: any) {
                results.push({ skill: skillName, dest: dest.name, type: dest.type, status: "FAILED", error: e.message });
            }
        }
    }
    s.stop("搬运任务完成");

    // 5. Final Report
    console.log("\n" + chalk.bold("同步报告:"));
    results.forEach((r) => {
        const icon = r.status === "SUCCESS" ? chalk.green("✓") : chalk.red("✗");
        console.log(`${icon} [${r.skill}] -> ${r.dest} (${r.type}) ${r.status === "FAILED" ? chalk.dim(`(${r.error})`) : ""}`);
    });

    p.outro(chalk.bgGreen.black(" 全部任务已完成! "));
}

main().catch(console.error);