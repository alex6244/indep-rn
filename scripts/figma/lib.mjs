import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "../..");
export const FIGMA_DIR = path.join(ROOT, "design", "figma");
export const RAW_DIR = path.join(FIGMA_DIR, "raw");
export const SNAPSHOT_DIR = path.join(FIGMA_DIR, "snapshots");
export const GENERATED_TS = path.join(ROOT, "src", "shared", "theme", "figma.generated.ts");

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** Figma 0–1 RGB → #RRGGBB */
export function rgbToHex({ r, g, b }, alpha = 1) {
  const toByte = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255);
  const rr = toByte(r).toString(16).padStart(2, "0");
  const gg = toByte(g).toString(16).padStart(2, "0");
  const bb = toByte(b).toString(16).padStart(2, "0");
  if (alpha < 1) {
    const aa = toByte(alpha).toString(16).padStart(2, "0");
    return `#${rr}${gg}${bb}${aa}`.toUpperCase();
  }
  return `#${rr}${gg}${bb}`.toUpperCase();
}

export function solidFillHex(node) {
  const fill = node?.fills?.find((f) => f.type === "SOLID" && f.visible !== false);
  if (!fill?.color) return null;
  return rgbToHex(fill.color, fill.opacity ?? fill.color.a ?? 1);
}

export function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  visit(node);
  for (const child of node.children ?? []) {
    walk(child, visit);
  }
}

export function findNodeById(root, id) {
  let found = null;
  walk(root, (node) => {
    if (node.id === id) found = node;
  });
  return found;
}

export function loadNodesExport(rawFile) {
  const filePath = path.join(RAW_DIR, rawFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing Figma raw export: ${filePath}\nRun: npm run figma:pull`);
  }
  const payload = readJson(filePath);
  return payload;
}

export function getDocumentFromExport(payload, nodeId) {
  const entry = payload.nodes?.[nodeId];
  if (!entry?.document) {
    throw new Error(`Node ${nodeId} not found in Figma export`);
  }
  return entry.document;
}

export function emitGeneratedTs({ meta, navBar, colors }) {
  const lines = [
    "/**",
    " * AUTO-GENERATED — do not edit by hand.",
    ` * Source: design/figma/raw (${meta.sourceFiles.join(", ")})`,
    ` * Generated: ${meta.generatedAt}`,
    " * Regenerate: npm run figma:build",
    " */",
    "",
    `export const FIGMA_FILE_NAME = ${JSON.stringify(meta.fileName)} as const;`,
    `export const FIGMA_LAST_MODIFIED = ${JSON.stringify(meta.lastModified ?? null)} as const;`,
    "",
    "/** Bottom tab bar — node «Навигационная панель» (612:1715). */",
    "export const figmaNavBar = {",
    `  nodeId: ${JSON.stringify(navBar.nodeId)},`,
    `  name: ${JSON.stringify(navBar.name)},`,
    `  height: ${navBar.height},`,
    `  paddingHorizontal: ${navBar.paddingHorizontal},`,
    `  paddingTop: ${navBar.paddingTop},`,
    `  paddingBottom: ${navBar.paddingBottom},`,
    `  itemSpacing: ${navBar.itemSpacing},`,
    `  tabItemSize: ${navBar.tabItemSize},`,
    `  tabIconSize: ${navBar.tabIconSize},`,
    `  tabLabelGap: ${navBar.tabLabelGap},`,
    `  labelFontSize: ${navBar.labelFontSize},`,
    `  labelLineHeight: ${navBar.labelLineHeight},`,
    `  labelFontFamily: ${JSON.stringify(navBar.labelFontFamily)},`,
    `  backgroundColor: ${JSON.stringify(navBar.backgroundColor)},`,
    `  inactiveColor: ${JSON.stringify(navBar.inactiveColor)},`,
    "} as const;",
    "",
    "/** Colors extracted from synced Figma nodes (for drift checks). */",
    "export const figmaColors = {",
    ...Object.entries(colors).map(([key, value]) => `  ${key}: ${JSON.stringify(value)},`),
    "} as const;",
    "",
    "export type FigmaNavBar = typeof figmaNavBar;",
    "",
  ];
  fs.mkdirSync(path.dirname(GENERATED_TS), { recursive: true });
  fs.writeFileSync(GENERATED_TS, lines.join("\n"), "utf8");
}
