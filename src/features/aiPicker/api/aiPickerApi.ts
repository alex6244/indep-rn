import { createApi } from "@reduxjs/toolkit/query/react";
import { envBool, envString } from "../../../config/env";
import type { AiCatalogItem } from "../types";
import type { AiPickerChatReply, AiPickerMeta } from "./aiPickerApiClient";

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

const AI_FETCH_TIMEOUT_MS = 15_000;

export const AI_PICKER_RATE_LIMIT_MESSAGE =
  "Слишком много сообщений. Подождите минуту и попробуйте снова.";

function getAiBaseUrl(): string {
  const url = envString("EXPO_PUBLIC_AI_API_URL");
  if (!url) throw new Error("AI API URL is not configured");
  return url.replace(/\/$/, "");
}

function parseApiErrorMessage(payload: unknown, status: number): string {
  if (status === 429) {
    return AI_PICKER_RATE_LIMIT_MESSAGE;
  }
  if (payload && typeof payload === "object" && "error" in payload) {
    const err = (payload as { error: unknown }).error;
    if (typeof err === "object" && err !== null && "message" in err) {
      const message = (err as { message: unknown }).message;
      if (typeof message === "string" && message.length > 0) {
        return message;
      }
    }
    if (typeof err === "string" && err.length > 0) {
      return err;
    }
  }
  return `AI server responded with HTTP ${status}`;
}

async function aiFetch(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const baseUrl = getAiBaseUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
    });
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    if (!res.ok) {
      throw new Error(parseApiErrorMessage(payload, res.status));
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

    sendAiChat: builder.mutation<AiPickerChatReply, SendAiChatArgs>({
      async queryFn(args) {
        const data = (await aiFetch("/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        })) as { text: string; cars: AiCatalogItem[] };

        return { data: { text: data.text, cars: data.cars ?? [] } };
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

export function isAiPickerRtkEnabled(): boolean {
  return envString("EXPO_PUBLIC_AI_API_URL") !== null && !envBool("EXPO_PUBLIC_ALLOW_HTTP_DEV");
}
