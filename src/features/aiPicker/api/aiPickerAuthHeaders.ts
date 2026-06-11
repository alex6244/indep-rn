import { tokenStorage } from "../../../services/api/tokenStorage";
import { AiPickerApiError } from "./aiPickerApiError";
import { AI_PICKER_AUTH_REQUIRED_MESSAGE } from "./aiPickerEnv";

export async function buildAiAuthHeaders(
  init?: RequestInit,
): Promise<Record<string, string>> {
  const token = await tokenStorage.get();
  if (!token) {
    throw new AiPickerApiError(AI_PICKER_AUTH_REQUIRED_MESSAGE, 401, "unauthorized");
  }

  const base =
    init?.headers && typeof init.headers === "object" && !Array.isArray(init.headers)
      ? { ...(init.headers as Record<string, string>) }
      : {};

  return {
    ...base,
    Authorization: `Bearer ${token}`,
  };
}
