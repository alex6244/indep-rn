#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  FIGMA_DIR,
  GENERATED_TS,
  SNAPSHOT_DIR,
  emitGeneratedTs,
  getDocumentFromExport,
  loadNodesExport,
  readJson,
  rgbToHex,
  solidFillHex,
  walk,
} from "./lib.mjs";

const manifest = readJson(path.join(FIGMA_DIR, "manifest.json"));

function extractNavBar(document) {
  const bg = solidFillHex(document) ?? rgbToHex(document.backgroundColor ?? { r: 1, g: 1, b: 1 });

  let inactiveColor = null;
  let labelStyle = null;
  let tabItemSize = 62;
  let tabIconSize = 40;
  let tabLabelGap = 2;

  walk(document, (node) => {
    if (node.type === "TEXT" && node.style && !labelStyle) {
      labelStyle = node.style;
      const hex = solidFillHex(node);
      if (hex) inactiveColor = inactiveColor ?? hex;
    }
    if (node.layoutMode === "VERTICAL" && node.itemSpacing === 2 && node.absoluteBoundingBox?.width === 62) {
      tabItemSize = Math.round(node.absoluteBoundingBox.width);
      tabLabelGap = node.itemSpacing;
    }
    if (node.absoluteBoundingBox?.width === 40 && node.absoluteBoundingBox?.height === 40) {
      tabIconSize = 40;
    }
    if (!inactiveColor && node.type === "VECTOR") {
      const hex = solidFillHex(node);
      if (hex && hex !== "#000000") inactiveColor = hex;
    }
  });

  const box = document.absoluteBoundingBox ?? { height: 78 };
  return {
    nodeId: document.id,
    name: document.name,
    height: Math.round(box.height),
    paddingHorizontal: Math.round(document.paddingLeft ?? 20),
    paddingTop: Math.round(document.paddingTop ?? 8),
    paddingBottom: Math.round(document.paddingBottom ?? 8),
    itemSpacing: Math.round(document.itemSpacing ?? 32),
    tabItemSize,
    tabIconSize,
    tabLabelGap,
    labelFontSize: Math.round(labelStyle?.fontSize ?? 10),
    labelLineHeight: Math.round(labelStyle?.lineHeightPx ?? 12),
    labelFontFamily: labelStyle?.fontFamily ?? "Moderustic",
    backgroundColor: bg,
    inactiveColor: inactiveColor ?? "#A0A0A0",
  };
}

function main() {
  const navConfig = manifest.nodes.navBar;
  const raw = loadNodesExport(navConfig.rawFile);
  const document = getDocumentFromExport(raw, navConfig.id);
  const navBar = extractNavBar(document);

  const colors = {
    navBarBackground: navBar.backgroundColor,
    navBarInactive: navBar.inactiveColor,
  };

  const snapshot = {
    generatedAt: new Date().toISOString(),
    navBar,
    colors,
  };
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(SNAPSHOT_DIR, "nav-bar.json"),
    `${JSON.stringify(snapshot, null, 2)}\n`,
    "utf8",
  );

  emitGeneratedTs({
    meta: {
      fileName: raw.name ?? manifest.fileName,
      lastModified: raw.lastModified ?? null,
      sourceFiles: [navConfig.rawFile],
      generatedAt: snapshot.generatedAt,
    },
    navBar,
    colors,
  });

  console.log(`Wrote ${path.relative(process.cwd(), GENERATED_TS)}`);
  console.log(`Wrote design/figma/snapshots/nav-bar.json`);
}

main();
