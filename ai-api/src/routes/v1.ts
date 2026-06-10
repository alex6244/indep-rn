import { Hono } from "hono";
import {
  buildLeadSuccessMessage,
  buildWelcomeMessage,
  normalizePhoneInput,
} from "../../../packages/ai-core/src/index";
import { buildChatReply } from "../chat/buildChatReply.js";
import {
  catalogObservabilityFields,
  ensureCatalog,
  getCatalog,
  getSite,
  refreshCatalog,
} from "../catalog/catalogStore.js";
import type { AiCatalogItem } from "../types.js";
import { apiError } from "../lib/apiError.js";
import { requireBrowserClientKey } from "../middleware/clientKey.js";
import {
  rateLimitMiddleware,
} from "../middleware/rateLimit.js";
import {
  validateCarIds,
  validateChatMessage,
  validateLeadPhoneRaw,
} from "../middleware/requestLimits.js";

type LeadRecord = {
  siteId: string;
  phone: string;
  carIds: string[];
  createdAt: string;
};

const leads: LeadRecord[] = [];

function isDevLeadsListingEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.AI_API_DEV_LEADS !== "true") return false;
  return true;
}

function isDevKeyValid(header: string | undefined): boolean {
  const expected = process.env.AI_API_DEV_KEY;
  if (!expected || expected.length === 0) return false;
  return header === expected;
}

export const v1 = new Hono();

v1.get("/sites/:siteId/meta", rateLimitMiddleware("meta"), async (c) => {
  const siteId = c.req.param("siteId") ?? "";
  if (!siteId) {
    return c.json(apiError("invalid_site", "siteId is required"), 400);
  }
  const site = getSite(siteId);
  if (!site) {
    return c.json(apiError("site_not_found", "Site not found"), 404);
  }

  const catalog = await ensureCatalog(siteId);
  return c.json({
    siteId,
    displayName: site.displayName,
    disclaimer: site.disclaimer,
    catalogCount: catalog.items.length,
    catalogSource: catalog.source,
    welcomeText: buildWelcomeMessage(catalog.items.length),
    ...catalogObservabilityFields(catalog),
  });
});

v1.get("/sites/:siteId/catalog", rateLimitMiddleware("meta"), async (c) => {
  const siteId = c.req.param("siteId") ?? "";
  if (!siteId) {
    return c.json(apiError("invalid_site", "siteId is required"), 400);
  }
  const site = getSite(siteId);
  if (!site) {
    return c.json(apiError("site_not_found", "Site not found"), 404);
  }

  const catalog = await ensureCatalog(siteId);
  return c.json({
    siteId,
    items: catalog.items,
    catalogSource: catalog.source,
    ...catalogObservabilityFields(catalog),
  });
});

v1.post(
  "/chat",
  rateLimitMiddleware("chat"),
  requireBrowserClientKey(),
  async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body.message !== "string" || typeof body.siteId !== "string") {
      return c.json(apiError("invalid_body", "Invalid request body"), 400);
    }

    const messageCheck = validateChatMessage(body.message);
    if (!messageCheck.ok) {
      return c.json(messageCheck.body, 400);
    }

    const site = getSite(body.siteId);
    if (!site) {
      return c.json(apiError("site_not_found", "Site not found"), 404);
    }

    const catalog = await ensureCatalog(body.siteId);
    const selectedCount =
      typeof body.selectedCount === "number" ? body.selectedCount : 0;

    const fixedBrand =
      site.mode === "monobrand" ? site.brand : undefined;
    if (site.mode === "monobrand" && (!fixedBrand || fixedBrand.length === 0)) {
      return c.json(
        apiError("site_brand_not_configured", "Monobrand site has no brand configured"),
        500,
      );
    }

    const reply = await buildChatReply(messageCheck.message, catalog.items, {
      selectedCount,
      fixedBrand,
      siteDisplayName: site.displayName,
    });

    return c.json({
      text: reply.text,
      cars: reply.cars,
      suggestLead: reply.suggestLead,
      catalogSource: catalog.source,
      replySource: reply.replySource,
    });
  },
);

v1.post(
  "/leads",
  rateLimitMiddleware("leads"),
  requireBrowserClientKey(),
  async (c) => {
    const body = await c.req.json().catch(() => null);
    if (
      !body ||
      typeof body.siteId !== "string" ||
      typeof body.phone !== "string" ||
      !Array.isArray(body.carIds)
    ) {
      return c.json(apiError("invalid_body", "Invalid request body"), 400);
    }

    const phoneRawCheck = validateLeadPhoneRaw(body.phone);
    if (!phoneRawCheck.ok) {
      return c.json(phoneRawCheck.body, 400);
    }

    const site = getSite(body.siteId);
    if (!site) {
      return c.json(apiError("site_not_found", "Site not found"), 404);
    }

    const phone = normalizePhoneInput(body.phone);
    if (!phone) {
      return c.json(apiError("invalid_phone", "Invalid phone number"), 400);
    }

    const carIds = body.carIds.filter((id: unknown) => typeof id === "string");
    const carIdsCheck = validateCarIds(carIds);
    if (!carIdsCheck.ok) {
      return c.json(carIdsCheck.body, 400);
    }
    if (carIdsCheck.carIds.length === 0) {
      return c.json(apiError("no_cars", "At least one car must be selected"), 400);
    }

    const record: LeadRecord = {
      siteId: body.siteId,
      phone,
      carIds: carIdsCheck.carIds,
      createdAt: new Date().toISOString(),
    };
    leads.push(record);
    console.info("[ai-api][lead]", record);

    const catalog = getCatalog(body.siteId);
    const titles: string[] = [];
    if (catalog) {
      const byId = new Map(catalog.items.map((item: AiCatalogItem) => [item.id, item]));
      for (const id of carIdsCheck.carIds) {
        const car = byId.get(id);
        if (car) titles.push(car.title);
      }
    }

    const message = buildLeadSuccessMessage(phone, titles);
    return c.json({ ok: true, message });
  },
);

/** Dev-only: list leads when AI_API_DEV_LEADS=true and X-Dev-Key matches AI_API_DEV_KEY. */
v1.get("/leads", (c) => {
  if (!isDevLeadsListingEnabled()) {
    return c.json(apiError("not_found", "Not found"), 404);
  }
  if (!isDevKeyValid(c.req.header("X-Dev-Key"))) {
    return c.json(apiError("forbidden", "Forbidden"), 403);
  }
  return c.json({ leads });
});

/** Dev-only: force catalog refresh for a site. */
v1.post("/admin/catalog/:siteId/refresh", async (c) => {
  if (!isDevLeadsListingEnabled()) {
    return c.json(apiError("not_found", "Not found"), 404);
  }
  if (!isDevKeyValid(c.req.header("X-Dev-Key"))) {
    return c.json(apiError("forbidden", "Forbidden"), 403);
  }

  const siteId = c.req.param("siteId") ?? "";
  if (!siteId) {
    return c.json(apiError("invalid_site", "siteId is required"), 400);
  }

  const site = getSite(siteId);
  if (!site) {
    return c.json(apiError("site_not_found", "Site not found"), 404);
  }

  const catalog = await refreshCatalog(siteId);
  return c.json({
    catalogCount: catalog.items.length,
    catalogSource: catalog.source,
    ...catalogObservabilityFields(catalog),
  });
});
