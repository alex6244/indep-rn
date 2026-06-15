#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const aiApiRoot = path.resolve(__dirname, "..");
const repoRoot = process.env.AI_API_REPO_ROOT
  ? path.resolve(process.env.AI_API_REPO_ROOT)
  : path.resolve(aiApiRoot, "..");

const port = process.env.PORT ?? "8787";
const healthUrl = `http://127.0.0.1:${port}/health`;

const requiredPaths = [
  ["packages/ai-core", path.join(repoRoot, "packages", "ai-core")],
  ["src/data/ai/sites", path.join(repoRoot, "src", "data", "ai", "sites")],
  [
    "src/data/ai/indep-banner-catalog.seed.json",
    path.join(repoRoot, "src", "data", "ai", "indep-banner-catalog.seed.json"),
  ],
];

let failed = false;

for (const [label, fullPath] of requiredPaths) {
  if (!existsSync(fullPath)) {
    console.error(`✗ Missing ${label} at ${fullPath}`);
    console.error("  Запустите pm2 из корня репозитория (AI_API_REPO_ROOT должен указывать на indep-rn).");
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

let health;
try {
  const response = await fetch(healthUrl);
  if (!response.ok) {
    console.error(`✗ GET ${healthUrl} → HTTP ${response.status}`);
    console.error("  Убедитесь, что ai-api запущен (pm2 status / npm run dev).");
    process.exit(1);
  }
  health = await response.json();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`✗ GET ${healthUrl} failed: ${message}`);
  console.error("  Убедитесь, что ai-api запущен на порту", port);
  process.exit(1);
}

if (health?.ok !== true) {
  console.error("✗ /health ok is not true:", health);
  process.exit(1);
}

const catalogCount = health.catalogCount ?? 0;
if (catalogCount <= 0) {
  console.error(`✗ catalogCount is ${catalogCount} — каталог пуст.`);
  console.error("  Проверьте доступ к indep.su и fallback seed в src/data/ai/.");
  process.exit(1);
}

console.log(`✓ smoke-deploy ok (catalogCount=${catalogCount}, source=${health.catalogSource ?? "?"})`);
