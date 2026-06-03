import {
  MAX_CHAT_MESSAGE_LENGTH,
  validateCarIds,
  validateChatMessage,
  validateLeadPhoneRaw,
} from "../requestLimits";

describe("validateChatMessage", () => {
  it("rejects empty message", () => {
    const result = validateChatMessage("   ");
    expect(result.ok).toBe(false);
  });

  it("rejects too long message", () => {
    const result = validateChatMessage("a".repeat(MAX_CHAT_MESSAGE_LENGTH + 1));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.body.error.code).toBe("message_too_long");
    }
  });

  it("returns trimmed message", () => {
    const result = validateChatMessage("  KIA  ");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.message).toBe("KIA");
    }
  });
});

describe("validateCarIds", () => {
  it("rejects more than 20 ids", () => {
    const ids = Array.from({ length: 21 }, (_, i) => String(i));
    const result = validateCarIds(ids);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.body.error.code).toBe("too_many_cars");
    }
  });
});

describe("validateLeadPhoneRaw", () => {
  it("rejects very long phone input", () => {
    const result = validateLeadPhoneRaw("9".repeat(40));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.body.error.code).toBe("phone_too_long");
    }
  });
});
