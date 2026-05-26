#!/usr/bin/env node
/**
 * Pull Figma node trees via REST API into design/figma/raw/.
 *
 * Requires in .env (or shell):
 *   FIGMA_ACCESS_TOKEN — Personal access token from Figma → Settings → Security
 *   FIGMA_FILE_KEY     — File key from URL: figma.com/design/<FILE_KEY>/...
 */
import fs from "node:fs";
import path from "node:path";
import { FIGMA_DIR, RAW_DIR, ROOT, readJson, writeJson } from "./lib.mjs";

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function fetchNodes(fileKey, nodeIds, token) {
  const ids = nodeIds.join(",");
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`;
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.err ?? body.message ?? `Figma API ${res.status}`);
  }
  return body;
}

async function main() {
  loadEnv();
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  if (!token || !fileKey) {
    console.error(
      "Set FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY in .env\n" +
        "See docs/FIGMA.md",
    );
    process.exit(1);
  }

  const manifest = readJson(path.join(FIGMA_DIR, "manifest.json"));
  const entries = Object.entries(manifest.nodes).filter(([, cfg]) => cfg.id && cfg.rawFile);

  for (const [key, cfg] of entries) {
    console.log(`Pulling ${key} (${cfg.id}) → raw/${cfg.rawFile}`);
    const data = await fetchNodes(fileKey, [cfg.id], token);
    const nodePayload = data.nodes[cfg.id];
    if (!nodePayload?.document) {
      throw new Error(`No document for node ${cfg.id}`);
    }
    const outfile = path.join(RAW_DIR, cfg.rawFile);
    writeJson(outfile, {
      name: data.name,
      lastModified: data.lastModified,
      role: data.role,
      version: data.version,
      nodes: { [cfg.id]: nodePayload },
    });
  }

  console.log("Done. Run: npm run figma:build");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
