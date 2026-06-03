import { apiError } from "../lib/apiError.js";

export const MAX_CHAT_MESSAGE_LENGTH = 500;
export const MAX_LEAD_CAR_IDS = 20;
export const MAX_PHONE_RAW_LENGTH = 32;

export function validateChatMessage(message: string):
  | { ok: true; message: string }
  | { ok: false; body: ReturnType<typeof apiError> } {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      ok: false,
      body: apiError("invalid_body", "message is required"),
    };
  }
  if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    return {
      ok: false,
      body: apiError(
        "message_too_long",
        `message must be at most ${MAX_CHAT_MESSAGE_LENGTH} characters`,
      ),
    };
  }
  return { ok: true, message: trimmed };
}

export function validateLeadPhoneRaw(phone: string):
  | { ok: true }
  | { ok: false; body: ReturnType<typeof apiError> } {
  if (phone.length > MAX_PHONE_RAW_LENGTH) {
    return {
      ok: false,
      body: apiError("phone_too_long", "phone is too long"),
    };
  }
  return { ok: true };
}

export function validateCarIds(carIds: string[]):
  | { ok: true; carIds: string[] }
  | { ok: false; body: ReturnType<typeof apiError> } {
  if (carIds.length > MAX_LEAD_CAR_IDS) {
    return {
      ok: false,
      body: apiError(
        "too_many_cars",
        `carIds must contain at most ${MAX_LEAD_CAR_IDS} items`,
      ),
    };
  }
  return { ok: true, carIds };
}
