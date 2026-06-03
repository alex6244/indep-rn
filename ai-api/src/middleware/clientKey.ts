import type { Context, Next } from "hono";
import { apiError } from "../lib/apiError.js";
import { isOriginAllowed } from "./cors.js";

const HEADER = "X-AI-Client-Key";

export function requireBrowserClientKey() {
  return async (c: Context, next: Next): Promise<Response | void> => {
    const expected = process.env.AI_API_CLIENT_KEY?.trim();
    if (!expected) {
      await next();
      return;
    }

    const origin = c.req.header("Origin");
    if (!origin) {
      await next();
      return;
    }

    if (!isOriginAllowed(origin)) {
      await next();
      return;
    }

    const provided = c.req.header(HEADER);
    if (!provided) {
      return c.json(
        apiError("client_key_required", "Missing X-AI-Client-Key header"),
        401,
      );
    }
    if (provided !== expected) {
      return c.json(
        apiError("client_key_invalid", "Invalid X-AI-Client-Key"),
        403,
      );
    }

    await next();
  };
}
