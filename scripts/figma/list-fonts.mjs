#!/usr/bin/env node
/**
 * List unique font families/styles used in a Figma file.
 * Usage: node scripts/figma/list-fonts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function walk(node, fonts) {
  if (!node || typeof node !== "object") return;
  if (node.style?.fontFamily) {
    const s = node.style;
    const key = `${s.fontFamily}|${s.fontWeight ?? ""}|${s.fontStyle ?? ""}`;
    if (!fonts.has(key)) {
      fonts.set(key, {
        family: s.fontFamily,
        weight: s.fontWeight,
        style: s.fontStyle,
        postScript: s.fontPostScriptName,
        sizes: new Set(),
      });
    }
    if (s.fontSize) fonts.get(key).sizes.add(s.fontSize);
  }
  for (const child of node.children ?? []) walk(child, fonts);
}

async function main() {
  loadEnv();
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  if (!token || !fileKey) {
    console.error("Set FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY in .env");
    process.exit(1);
  }

  const url = `https://api.figma.com/v1/files/${fileKey}?depth=1`;
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.err ?? body.message ?? `Figma API ${res.status}`);
  }

  const fonts = new Map();
  walk(body.document, fonts);
  for (const page of body.document?.children ?? []) {
    walk(page, fonts);
  }

  // Full tree needs deeper fetch — get file without depth limit (can be large)
  const fullUrl = `https://api.figma.com/v1/files/${fileKey}`;
  console.error("Fetching full file tree (may take a moment)...");
  const fullRes = await fetch(fullUrl, { headers: { "X-Figma-Token": token } });
  const full = await fullRes.json();
  if (!fullRes.ok) {
    throw new Error(full.err ?? full.message ?? `Figma API ${fullRes.status}`);
  }

  fonts.clear();
  walk(full.document, fonts);

  const families = [...new Set([...fonts.values()].map((f) => f.family))].sort();
  console.log(`File: ${full.name}`);
  console.log(`Last modified: ${full.lastModified}`);
  console.log(`\nFont families (${families.length}):`);
  for (const fam of families) console.log(`  - ${fam}`);

  console.log("\nStyles in use:");
  const rows = [...fonts.values()].sort((a, b) =>
    a.family.localeCompare(b.family) || (a.weight ?? 0) - (b.weight ?? 0),
  );
  for (const f of rows) {
    const sizes = [...f.sizes].sort((a, b) => a - b).join(", ");
    console.log(
      `  ${f.family}  ${f.style ?? ""}  w${f.weight ?? "?"}  (${f.postScript ?? "—"})  sizes: ${sizes || "—"}`,
    );
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
