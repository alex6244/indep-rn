import {
  AI_PICKER_AUTH_REQUIRED_MESSAGE,
  AI_PICKER_SERVER_UNAVAILABLE_MESSAGE,
} from "./aiPickerEnv";
import { AiPickerApiError, isAiPickerUnauthorizedError } from "./aiPickerApiError";

export function resolveAiPickerRemoteError(error: unknown): string {
  if (isAiPickerUnauthorizedError(error)) {
    return AI_PICKER_AUTH_REQUIRED_MESSAGE;
  }
  if (error instanceof AiPickerApiError) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return AI_PICKER_SERVER_UNAVAILABLE_MESSAGE;
}
