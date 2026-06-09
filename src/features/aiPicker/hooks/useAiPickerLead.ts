import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { aiPickerApi } from "../api/aiPickerApi";
import { AI_PICKER_SERVER_UNAVAILABLE_MESSAGE } from "../api/aiPickerEnv";
import { buildLeadSuccessMessage, normalizePhoneInput } from "../chat/ruleBasedReply";
import type { AiCatalogItem, AiChatMessage } from "../types";
import { useAppDispatch } from "../../../store/hooks";
import { createMessageId } from "./aiPickerUtils";

type UseAiPickerLeadArgs = {
  siteId: string;
  catalog: AiCatalogItem[];
  selectedIds: Set<string>;
  useRemoteApi: boolean;
  scrollToEnd: () => void;
  setMessages: Dispatch<SetStateAction<AiChatMessage[]>>;
};

export function useAiPickerLead({
  siteId,
  catalog,
  selectedIds,
  useRemoteApi,
  scrollToEnd,
  setMessages,
}: UseAiPickerLeadArgs) {
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const phoneOk = normalizePhoneInput(phone) !== null;

  const submitLead = useCallback(() => {
    const normalized = normalizePhoneInput(phone);
    if (!normalized || selectedIds.size === 0 || leadSent || leadSubmitting) return;

    const titles = catalog
      .filter((c) => selectedIds.has(c.id))
      .map((c) => c.title);
    const carIds = [...selectedIds];

    void (async () => {
      setLeadSubmitting(true);
      let assistantText = buildLeadSuccessMessage(normalized, titles);
      let leadAccepted = false;

      try {
        if (useRemoteApi) {
          try {
            const remote = await dispatch(
              aiPickerApi.endpoints.sendAiLead.initiate({
                siteId,
                phone: normalized,
                carIds,
              }),
            ).unwrap();
            assistantText = remote.message;
            leadAccepted = true;
          } catch (error) {
            const detail =
              error instanceof Error && error.message.trim().length > 0
                ? error.message
                : AI_PICKER_SERVER_UNAVAILABLE_MESSAGE;
            assistantText = `${detail} Заявка не отправлена.`;
          }
        } else {
          if (__DEV__) {
            console.info("[ai-picker][lead]", {
              siteId,
              phone: normalized,
              carIds,
            });
          }
          leadAccepted = true;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: createMessageId(),
            role: "assistant",
            text: assistantText,
          },
        ]);
        if (leadAccepted) {
          setLeadSent(true);
        }
        scrollToEnd();
      } finally {
        setLeadSubmitting(false);
      }
    })();
  }, [
    catalog,
    dispatch,
    leadSent,
    leadSubmitting,
    phone,
    scrollToEnd,
    selectedIds,
    setMessages,
    siteId,
    useRemoteApi,
  ]);

  return {
    phone,
    setPhone,
    leadSent,
    leadSubmitting,
    phoneOk,
    submitLead,
  };
}
