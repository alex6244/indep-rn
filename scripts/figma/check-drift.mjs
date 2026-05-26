#!/usr/bin/env node
/**
 * Compare figma.generated tokens with src/shared/theme/colors.ts usage.
 */
import fs from "node:fs";
import path from "node:path";
import { GENERATED_TS, ROOT, readJson } from "./lib.mjs";

function normalizeHex(hex) {
  const h = hex.toUpperCase();
  if (h.length === 4) {
    return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return h;
}

function readThemeToken(blockName, key) {
  const colorsPath = path.join(ROOT, "src", "shared", "theme", "colors.ts");
  const text = fs.readFileSync(colorsPath, "utf8");
  const blockRe = new RegExp(`${blockName}:\\s*\\{([^}]+)\\}`, "s");
  const block = text.match(blockRe)?.[1];
  if (!block) return null;
  const keyRe = new RegExp(`${key}:\\s*"(#[0-9A-Fa-f]{3,8})"`);
  const hex = block.match(keyRe)?.[1];
  return hex ? normalizeHex(hex) : null;
}

function loadGenerated() {
  const modPath = path.join(ROOT, "src", "shared", "theme", "figma.generated.ts");
  if (!fs.existsSync(modPath)) {
    throw new Error("Missing figma.generated.ts — run: npm run figma:build");
  }
  const text = fs.readFileSync(modPath, "utf8");
  const extract = (key) => {
    const re = new RegExp(`${key}:\\s*"([^"]+)"`);
    const match = text.match(re);
    return match ? normalizeHex(match[1]) : null;
  };
  return {
    navBarBackground: extract("backgroundColor"),
    navBarInactive: extract("inactiveColor"),
  };
}

const THEME_MAP = [
  {
    figma: "navBarBackground",
    themePath: "surface.primary",
    themeKeys: ["screen", "primary"],
  },
  {
    figma: "navBarInactive",
    themePath: "icon.muted",
    themeKeys: ["muted"],
  },
];

function main() {
  const generated = loadGenerated();
  const surfaceNeutral = readThemeToken("surface", "neutral");
  const iconMuted = readThemeToken("icon", "muted");

  const checks = [
    {
      label: "Tab bar background vs colors.surface.neutral (used in tab bar)",
      figma: generated.navBarBackground,
      theme: surfaceNeutral ?? "",
    },
    {
      label: "Tab inactive vs colors.icon.muted",
      figma: generated.navBarInactive,
      theme: iconMuted ?? "",
    },
  ];

  let drift = 0;
  for (const c of checks) {
    const ok = c.figma === c.theme;
    const mark = ok ? "OK" : "DRIFT";
    if (!ok) drift += 1;
    console.log(`${mark}  ${c.label}`);
    console.log(`      Figma: ${c.figma}  Theme: ${c.theme}`);
  }

  const manifest = readJson(path.join(ROOT, "design", "figma", "manifest.json"));
  console.log(`\nSynced nodes in manifest: ${Object.keys(manifest.nodes).length}`);
  console.log(`Generated: ${path.relative(ROOT, GENERATED_TS)}`);

  if (drift > 0) {
    console.log("\nFix: update colors.ts or re-sync from Figma, then npm run figma:build");
    process.exit(1);
  }
  console.log("\nNo drift on checked tab-bar tokens.");
}

main();
