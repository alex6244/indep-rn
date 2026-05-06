import { getAuthErrorMessage, getUserErrorMessage } from "../getUserErrorMessage";

describe("getAuthErrorMessage", () => {
  it("returns mapped message for auth code", () => {
    expect(getAuthErrorMessage("rate_limited")).toBe("Слишком много попыток. Попробуйте позже.");
  });

  it("returns explicit fallback when provided", () => {
    expect(getAuthErrorMessage("unknown", "Кастомное сообщение")).toBe("Кастомное сообщение");
  });
});

describe("getUserErrorMessage", () => {
  it("uses safe backend message first", () => {
    expect(
      getUserErrorMessage({ code: "network_error", message: "Сервис временно недоступен." }),
    ).toBe("Сервис временно недоступен.");
  });

  it("falls back to code-based message when backend message is unsafe", () => {
    expect(getUserErrorMessage({ code: "rate_limited", message: "<b>html</b>" })).toBe(
      "Слишком много попыток. Попробуйте позже.",
    );
  });

  it("uses fallback for unknown error payload", () => {
    expect(getUserErrorMessage({ code: "not_supported" }, "Ошибка операции")).toBe("Ошибка операции");
  });

  it("uses default unknown message when no fallback", () => {
    expect(getUserErrorMessage(null)).toBe("Сервис авторизации недоступен. Попробуйте снова.");
  });
});
