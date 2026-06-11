import { createApi } from "@reduxjs/toolkit/query/react";
import { envString } from "../../../config/env";
import type { AiCatalogItem } from "../types";
import { buildAiAuthHeaders } from "./aiPickerAuthHeaders";
import { AiPickerApiError } from "./aiPickerApiError";
import {
  AI_PICKER_AUTH_REQUIRED_MESSAGE,
  AI_PICKER_RATE_LIMIT_MESSAGE,
  type AiPickerCatalog,
  type AiPickerChatReply,
  type AiPickerMeta,
} from "./aiPickerEnv";

export type SendAiChatArgs = {
  siteId: string;
  message: string;
  selectedCount: number;
};

export type SendAiLeadArgs = {
  siteId: string;
  phone: string;
  carIds: string[];
};

const AI_FETCH_TIMEOUT_MS = 30_000;

function getAiBaseUrl(): string {
  const url = envString("EXPO_PUBLIC_AI_API_URL");
  if (!url) throw new Error("AI API URL is not configured");
  return url.replace(/\/$/, "");
}

export function parseAiApiError(
  payload: unknown,
  status: number,
): { message: string; code?: string } {
  if (payload && typeof payload === "object" && "error" in payload) {
    const err = (payload as { error: unknown }).error;
    if (typeof err === "object" && err !== null) {
      const message =
        "message" in err && typeof (err as { message: unknown }).message === "string"
          ? (err as { message: string }).message
          : undefined;
      const code =
        "code" in err && typeof (err as { code: unknown }).code === "string"
          ? (err as { code: string }).code
          : undefined;
      if (message && message.length > 0) {
        return { message, code };
      }
    }
  }
  if (status === 401 || status === 403) {
    return { message: AI_PICKER_AUTH_REQUIRED_MESSAGE, code: "unauthorized" };
  }
  if (status === 429) {
    return { message: AI_PICKER_RATE_LIMIT_MESSAGE, code: "rate_limited" };
  }
  return { message: `AI server responded with HTTP ${status}` };
}

async function aiFetch(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const baseUrl = getAiBaseUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_FETCH_TIMEOUT_MS);

  try {
    const authHeaders = await buildAiAuthHeaders(init);
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...authHeaders,
        ...(init?.headers as Record<string, string> | undefined),
      },
      signal: controller.signal,
    });
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    if (!res.ok) {
      const { message, code } = parseAiApiError(payload, res.status);
      throw new AiPickerApiError(message, res.status, code);
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

export const aiPickerApi = createApi({
  reducerPath: "aiPickerApi",
  // `queryFn` endpoints are used, but RTK Query still requires a baseQuery.
  baseQuery: () => ({ data: undefined }),
  endpoints: (builder) => ({
    getAiMeta: builder.query<AiPickerMeta, string>({
      async queryFn(siteId) {
        const data = (await aiFetch(`/v1/sites/${siteId}/meta`)) as {
          catalogCount: number;
          catalogSource: "api" | "seed";
          welcomeText: string;
          disclaimer: string;
        };

        return {
          data: {
            catalogCount: data.catalogCount,
            catalogSource: data.catalogSource,
            welcomeText: data.welcomeText,
            disclaimer: data.disclaimer,
          },
        };
      },
    }),

    getAiCatalog: builder.query<AiPickerCatalog, string>({
      async queryFn(siteId) {
        const data = (await aiFetch(`/v1/sites/${siteId}/catalog`)) as {
          items: AiCatalogItem[];
          catalogSource: "api" | "seed";
        };

        return {
          data: {
            items: data.items ?? [],
            catalogSource: data.catalogSource,
          },
        };
      },
    }),

    sendAiChat: builder.mutation<AiPickerChatReply, SendAiChatArgs>({
      async queryFn(args) {
        const data = (await aiFetch("/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        })) as { text: string; cars: AiCatalogItem[]; suggestLead?: boolean };

        return {
          data: {
            text: data.text,
            cars: data.cars ?? [],
            suggestLead: data.suggestLead,
          },
        };
      },
    }),

    sendAiLead: builder.mutation<{ message: string }, SendAiLeadArgs>({
      async queryFn(args) {
        const data = (await aiFetch("/v1/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        })) as { message: string };

        return { data: { message: data.message } };
      },
    }),
  }),
});
