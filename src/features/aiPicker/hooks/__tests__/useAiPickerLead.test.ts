import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useState } from "react";
import type { AiCatalogItem, AiChatMessage } from "../../types";
import { useAiPickerLead } from "../useAiPickerLead";

const mockDispatch = jest.fn();
const scrollToEnd = jest.fn();

jest.mock("../../../../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock("../../api/aiPickerApi", () => ({
  aiPickerApi: {
    endpoints: {
      sendAiLead: { initiate: jest.fn() },
    },
  },
}));

const { aiPickerApi } = jest.requireMock("../../api/aiPickerApi") as {
  aiPickerApi: {
    endpoints: {
      sendAiLead: { initiate: jest.Mock };
    };
  };
};

const chatCar: AiCatalogItem = {
  id: "99",
  siteId: "indep",
  brand: "KIA",
  title: "KIA Sportage New",
  priceFrom: 1_499_000,
  year: 2026,
  condition: "new",
  availability: "from_price",
};

function useLeadHarness(useRemoteApi: boolean) {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: "a1",
      role: "assistant",
      text: "Варианты",
      cars: [chatCar],
    },
  ]);

  const lead = useAiPickerLead({
    siteId: "indep",
    catalog: [],
    messages,
    selectedIds: new Set(["99"]),
    useRemoteApi,
    scrollToEnd,
    setMessages,
  });

  return { ...lead, messages };
}

describe("useAiPickerLead", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockImplementation((action: { unwrap: () => Promise<unknown> }) => action);
  });

  it("marks lead as sent on remote success", async () => {
    aiPickerApi.endpoints.sendAiLead.initiate.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          ok: true,
          message: "Заявка принята. Менеджер перезвонит.",
        }),
    });

    const { result } = renderHook(() => useLeadHarness(true));

    act(() => {
      result.current.setPhone("+7 (999) 123-45-67");
    });

    act(() => {
      result.current.submitLead();
    });

    await waitFor(() => {
      expect(result.current.leadSent).toBe(true);
    });
    const last = result.current.messages.at(-1);
    expect(last?.text).toBe("Заявка принята. Менеджер перезвонит.");
  });

  it("keeps leadSent false and shows error on remote failure", async () => {
    aiPickerApi.endpoints.sendAiLead.initiate.mockReturnValue({
      unwrap: () => Promise.reject(new Error("server error")),
    });

    const { result } = renderHook(() => useLeadHarness(true));

    act(() => {
      result.current.setPhone("89991234567");
    });

    act(() => {
      result.current.submitLead();
    });

    await waitFor(() => {
      expect(result.current.messages.at(-1)?.text).toContain("Заявка не отправлена.");
    });
    expect(result.current.leadSent).toBe(false);
  });

  it("resolves car titles from chat messages when catalog is empty (offline)", async () => {
    const { result } = renderHook(() => useLeadHarness(false));

    act(() => {
      result.current.setPhone("+79991234567");
    });

    act(() => {
      result.current.submitLead();
    });

    await waitFor(() => {
      expect(result.current.leadSent).toBe(true);
    });
    const last = result.current.messages.at(-1);
    expect(last?.text).toContain("KIA Sportage New");
    expect(aiPickerApi.endpoints.sendAiLead.initiate).not.toHaveBeenCalled();
  });
});
