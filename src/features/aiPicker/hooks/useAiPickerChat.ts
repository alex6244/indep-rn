import { useCallback, useEffect, useState } from "react";
import { aiPickerApi } from "../api/aiPickerApi";
import { isAiPickerLocalFallbackEnabled } from "../api/aiPickerEnv";
import { isAiPickerUnauthorizedError } from "../api/aiPickerApiError";
import { resolveAiPickerRemoteError } from "../api/resolveAiPickerRemoteError";
import { buildRuleBasedReply } from "../chat/ruleBasedReply";
import type { AiCatalogItem, AiChatMessage, AiSiteProfile } from "../types";
import { useAppDispatch } from "../../../store/hooks";
import { createMessageId } from "./aiPickerUtils";

type UseAiPickerChatArgs = {
  siteId: string;
  catalog: AiCatalogItem[];
  catalogLoading: boolean;
  useRemoteApi: boolean;
  site: AiSiteProfile;
  welcomeText: string | null;
  selectedCount: number;
  scrollToEnd: () => void;
};

export function useAiPickerChat({
  siteId,
  catalog,
  catalogLoading,
  useRemoteApi,
  site,
  welcomeText,
  selectedCount,
  scrollToEnd,
}: UseAiPickerChatArgs) {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [leadSuggested, setLeadSuggested] = useState(false);

  useEffect(() => {
    if (!welcomeText || messages.length > 0) return;
    setMessages([
      {
        id: createMessageId(),
        role: "assistant",
        text: welcomeText,
      },
    ]);
  }, [messages.length, welcomeText]);

  const sendUserMessage = useCallback(async () => {
    const text = draft.trim();
    if (!text || thinking || catalogLoading) return;

    setDraft("");
    setThinking(true);

    const userMsg: AiChatMessage = {
      id: createMessageId(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    scrollToEnd();

    let reply: {
      text: string;
      cars: AiCatalogItem[];
      suggestLead?: boolean;
      replySource?: "llm" | "rules";
    };

    if (useRemoteApi) {
      try {
        reply = await dispatch(
          aiPickerApi.endpoints.sendAiChat.initiate({
            siteId,
            message: text,
            selectedCount,
          }),
        ).unwrap();
        if (__DEV__ && reply.replySource) {
          console.info("[ai-picker][chat] replySource:", reply.replySource);
        }
      } catch (error) {
        if (isAiPickerUnauthorizedError(error) && isAiPickerLocalFallbackEnabled()) {
          reply = buildRuleBasedReply(text, catalog, {
            selectedCount,
            fixedBrand: site.mode === "monobrand" ? site.brand : undefined,
          });
        } else if (isAiPickerUnauthorizedError(error)) {
          reply = { text: resolveAiPickerRemoteError(error), cars: [] };
        } else if (isAiPickerLocalFallbackEnabled()) {
          reply = buildRuleBasedReply(text, catalog, {
            selectedCount,
            fixedBrand: site.mode === "monobrand" ? site.brand : undefined,
          });
        } else {
          reply = { text: resolveAiPickerRemoteError(error), cars: [] };
        }
      }
    } else {
      reply = buildRuleBasedReply(text, catalog, {
        selectedCount,
        fixedBrand: site.mode === "monobrand" ? site.brand : undefined,
      });
    }

    setLeadSuggested(reply.suggestLead === true);

    const assistantMsg: AiChatMessage =
      reply.cars.length > 0
        ? {
            id: createMessageId(),
            role: "assistant",
            text: reply.text,
            cars: reply.cars,
          }
        : {
            id: createMessageId(),
            role: "assistant",
            text: reply.text,
          };

    setMessages((prev) => [...prev, assistantMsg]);
    setThinking(false);
    scrollToEnd();
  }, [
    catalog,
    catalogLoading,
    draft,
    dispatch,
    scrollToEnd,
    selectedCount,
    site.brand,
    site.mode,
    siteId,
    thinking,
    useRemoteApi,
  ]);

  return {
    messages,
    setMessages,
    draft,
    setDraft,
    thinking,
    leadSuggested,
    sendUserMessage,
  };
}
