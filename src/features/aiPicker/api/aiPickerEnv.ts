import { envBool, envString } from "../../../config/env";
import type { AiCatalogItem, AiCatalogSource } from "../types";

export type AiPickerMeta = {
  catalogCount: number;
  catalogSource: AiCatalogSource;
  welcomeText: string;
  disclaimer: string;
};

export type AiPickerCatalog = {
  items: AiCatalogItem[];
  catalogSource: AiCatalogSource;
};

export type AiPickerChatReply = {
  text: string;
  cars: AiCatalogItem[];
  suggestLead?: boolean;
};

function baseUrl(): string | null {
  return envString("EXPO_PUBLIC_AI_API_URL");
}

export function isAiPickerApiEnabled(): boolean {
  return baseUrl() !== null;
}

export function isAiPickerLocalFallbackEnabled(): boolean {
  return envBool("EXPO_PUBLIC_AI_API_FALLBACK_LOCAL");
}

export const AI_PICKER_AUTH_REQUIRED_MESSAGE =
  "Войдите в аккаунт, чтобы пользоваться подбором с ИИ.";

export const AI_PICKER_SERVER_UNAVAILABLE_MESSAGE =
  "Сервер подбора временно недоступен. Попробуйте позже или отключите EXPO_PUBLIC_AI_API_URL для офлайн-режима.";

// Keep in sync with ai-api/src/lib/apiError.ts RATE_LIMITED_MESSAGE
export const AI_PICKER_RATE_LIMIT_MESSAGE =
  "Слишком много запросов. Попробуйте позже.";
