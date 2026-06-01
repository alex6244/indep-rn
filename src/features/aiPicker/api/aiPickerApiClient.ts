import { envBool, envString } from "../../../config/env";
import type { AiCatalogItem } from "../types";

const AI_FETCH_TIMEOUT_MS = 15_000;

export type AiPickerMeta = {
  catalogCount: number;
  catalogSource: "api" | "seed";
  welcomeText: string;
  disclaimer: string;
};

export type AiPickerChatReply = {
  text: string;
  cars: AiCatalogItem[];
};

export type AiPickerApiError = {
  ok: false;
  error: string;
};

export type AiPickerApiResult<T> = { ok: true; data: T } | AiPickerApiError;

function baseUrl(): string | null {
  return envString("EXPO_PUBLIC_AI_API_URL");
}

export function isAiPickerApiEnabled(): boolean {
  return baseUrl() !== null;
}

export function isAiPickerLocalFallbackEnabled(): boolean {
  return envBool("EXPO_PUBLIC_AI_API_FALLBACK_LOCAL");
}

async function aiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = baseUrl();
  if (!url) {
    throw new Error("AI API URL is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_FETCH_TIMEOUT_MS);

  try {
    return await fetch(`${url.replace(/\/$/, "")}${path}`, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAiPickerMeta(siteId: string): Promise<AiPickerApiResult<AiPickerMeta>> {
  try {
    const res = await aiFetch(`/v1/sites/${siteId}/meta`);
    if (!res.ok) {
      return { ok: false, error: `Сервер подбора ответил с ошибкой (${res.status})` };
    }

    const data = (await res.json()) as {
      catalogCount: number;
      catalogSource: "api" | "seed";
      welcomeText: string;
      disclaimer: string;
    };

    return {
      ok: true,
      data: {
        catalogCount: data.catalogCount,
        catalogSource: data.catalogSource,
        welcomeText: data.welcomeText,
        disclaimer: data.disclaimer,
      },
    };
  } catch {
    return { ok: false, error: "Не удалось связаться с сервером подбора" };
  }
}

export async function postAiPickerChat(
  siteId: string,
  message: string,
  selectedCount: number,
): Promise<AiPickerApiResult<AiPickerChatReply>> {
  try {
    const res = await aiFetch("/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, message, selectedCount }),
    });
    if (!res.ok) {
      return { ok: false, error: `Сервер подбора ответил с ошибкой (${res.status})` };
    }

    const data = (await res.json()) as { text: string; cars: AiCatalogItem[] };
    return { ok: true, data: { text: data.text, cars: data.cars ?? [] } };
  } catch {
    return { ok: false, error: "Не удалось связаться с сервером подбора" };
  }
}

export async function postAiPickerLead(
  siteId: string,
  phone: string,
  carIds: string[],
): Promise<AiPickerApiResult<{ message: string }>> {
  try {
    const res = await aiFetch("/v1/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, phone, carIds }),
    });
    if (!res.ok) {
      return { ok: false, error: `Не удалось отправить заявку (${res.status})` };
    }

    const data = (await res.json()) as { message: string };
    return { ok: true, data: { message: data.message } };
  } catch {
    return { ok: false, error: "Не удалось связаться с сервером подбора" };
  }
}

export const AI_PICKER_SERVER_UNAVAILABLE_MESSAGE =
  "Сервер подбора временно недоступен. Попробуйте позже или отключите EXPO_PUBLIC_AI_API_URL для офлайн-режима.";
