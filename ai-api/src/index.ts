import { serve } from "@hono/node-server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { registerSite, ensureCatalog, getCatalog } from "./catalog/catalogStore.js";
import type { AiSiteProfile } from "./types.js";
import { v1 } from "./routes/v1.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.resolve(__dirname, "../config/sites");

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/health", (c) => {
  const indep = getCatalog("indep");
  return c.json({
    ok: true,
    catalogCount: indep?.items.length ?? 0,
    catalogSource: indep?.source ?? null,
  });
});

app.route("/v1", v1);

async function loadSites(): Promise<void> {
  const indepPath = path.join(CONFIG_DIR, "indep.json");
  const raw = await readFile(indepPath, "utf8");
  const profile = JSON.parse(raw) as AiSiteProfile;
  registerSite(profile);
  await ensureCatalog(profile.siteId);
  const cat = getCatalog(profile.siteId);
  console.info(
    `[ai-api] ${profile.siteId}: ${cat?.items.length ?? 0} cars (${cat?.source ?? "?"})`,
  );
}

const port = Number(process.env.PORT) || 8787;

await loadSites();

serve({ fetch: app.fetch, port }, (info) => {
  console.info(`[ai-api] listening on http://localhost:${info.port}`);
});
