import { serve } from "@hono/node-server";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  catalogObservabilityFields,
  ensureCatalog,
  getCatalog,
  registerSite,
} from "./catalog/catalogStore.js";
import type { AiSiteProfile } from "./types.js";
import { v1 } from "./routes/v1.js";
import { resolveCorsOrigin } from "./middleware/cors.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.resolve(__dirname, "../../src/data/ai/sites");

const app = new Hono();

app.use(
  "*",
  cors({
    origin: resolveCorsOrigin,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "X-AI-Client-Key", "X-Dev-Key"],
  }),
);

app.get("/health", (c) => {
  const indep = getCatalog("indep");
  const deepSeekConfigured = Boolean(process.env.DEEPSEEK_API_KEY?.trim());
  return c.json({
    ok: true,
    catalogCount: indep?.items.length ?? 0,
    catalogSource: indep?.source ?? null,
    deepSeekConfigured,
    ...(indep ? catalogObservabilityFields(indep) : {
      catalogLoadedAt: null,
      catalogAgeSec: null,
    }),
  });
});

app.route("/v1", v1);

async function loadSites(): Promise<void> {
  const files = await readdir(CONFIG_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  for (const file of jsonFiles) {
    const fullPath = path.join(CONFIG_DIR, file);
    const raw = await readFile(fullPath, "utf8");
    const profile = JSON.parse(raw) as AiSiteProfile;

    registerSite(profile);
    await ensureCatalog(profile.siteId);

    const cat = getCatalog(profile.siteId);
    console.info(
      `[ai-api] ${profile.siteId}: ${cat?.items.length ?? 0} cars (${cat?.source ?? "?"})`,
    );
  }
}

const port = Number(process.env.PORT) || 8787;

await loadSites();

serve({ fetch: app.fetch, port }, (info) => {
  console.info(`[ai-api] listening on http://localhost:${info.port}`);
});
