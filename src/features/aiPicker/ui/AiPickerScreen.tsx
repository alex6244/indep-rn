import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackCaretIcon from "../../../assets/icons/backCaret.svg";
import {
  AI_PICKER_SERVER_UNAVAILABLE_MESSAGE,
  fetchAiPickerMeta,
  isAiPickerApiEnabled,
  isAiPickerLocalFallbackEnabled,
  postAiPickerChat,
  postAiPickerLead,
} from "../api/aiPickerApiClient";
import { getAiSiteProfile, loadAiCatalogWithMeta } from "../catalog/aiCatalogService";
import {
  buildLeadSuccessMessage,
  buildRuleBasedReply,
  buildWelcomeMessage,
  normalizePhoneInput,
} from "../chat/ruleBasedReply";
import type { AiCatalogItem, AiChatMessage } from "../types";
import { AiCarSuggestionCard } from "./AiCarSuggestionCard";
import { aiPickerStyles as styles } from "./aiPicker.styles";
import { AppButton } from "../../../shared/ui/AppButton";
import { colors } from "../../../shared/theme/colors";

const SITE_ID = "indep";

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AiPickerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<AiChatMessage>>(null);

  const [catalog, setCatalog] = useState<AiCatalogItem[]>([]);
  const [catalogSource, setCatalogSource] = useState<"api" | "seed" | null>(null);
  const [useRemoteApi, setUseRemoteApi] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [phone, setPhone] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const [apiServerWarning, setApiServerWarning] = useState<string | null>(null);

  const site = getAiSiteProfile(SITE_ID);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      const remote = isAiPickerApiEnabled();
      setUseRemoteApi(remote);

      if (remote) {
        const meta = await fetchAiPickerMeta(SITE_ID);
        const { items, source } = await loadAiCatalogWithMeta(SITE_ID);
        if (cancelled) return;
        setCatalog(items);
        if (!meta.ok) {
          setApiServerWarning(meta.error);
          setCatalogSource(source);
          setMessages([
            {
              id: createMessageId(),
              role: "assistant",
              text: buildWelcomeMessage(items.length),
            },
          ]);
        } else {
          setApiServerWarning(null);
          setCatalogSource(meta.data.catalogSource ?? source);
          setMessages([
            {
              id: createMessageId(),
              role: "assistant",
              text: meta.data.welcomeText ?? buildWelcomeMessage(items.length),
            },
          ]);
        }
      } else {
        setApiServerWarning(null);
        const { items, source } = await loadAiCatalogWithMeta(SITE_ID);
        if (cancelled) return;
        setCatalog(items);
        setCatalogSource(source);
        setMessages([
          {
            id: createMessageId(),
            role: "assistant",
            text: buildWelcomeMessage(items.length),
          },
        ]);
      }
      setCatalogLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const toggleCar = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

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

    await new Promise((r) => setTimeout(r, 400));

    let reply: { text: string; cars: AiCatalogItem[] };

    if (useRemoteApi) {
      const remote = await postAiPickerChat(SITE_ID, text, selectedIds.size);
      if (remote.ok) {
        reply = remote.data;
      } else if (isAiPickerLocalFallbackEnabled()) {
        reply = buildRuleBasedReply(text, catalog, {
          selectedCount: selectedIds.size,
        });
      } else {
        reply = { text: AI_PICKER_SERVER_UNAVAILABLE_MESSAGE, cars: [] };
      }
    } else {
      reply = buildRuleBasedReply(text, catalog, {
        selectedCount: selectedIds.size,
      });
    }

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
  }, [catalog, catalogLoading, draft, scrollToEnd, selectedIds.size, thinking, useRemoteApi]);

  const submitLead = useCallback(() => {
    const normalized = normalizePhoneInput(phone);
    if (!normalized || selectedIds.size === 0 || leadSent) return;

    const titles = catalog
      .filter((c) => selectedIds.has(c.id))
      .map((c) => c.title);
    const carIds = [...selectedIds];

    void (async () => {
      let successText = buildLeadSuccessMessage(normalized, titles);

      if (useRemoteApi) {
        const remote = await postAiPickerLead(SITE_ID, normalized, carIds);
        if (remote.ok) {
          successText = remote.data.message;
        } else if (!isAiPickerLocalFallbackEnabled()) {
          successText = `${AI_PICKER_SERVER_UNAVAILABLE_MESSAGE} Заявка не отправлена.`;
        }
      } else if (__DEV__) {
        console.info("[ai-picker][lead]", {
          siteId: SITE_ID,
          phone: normalized,
          carIds,
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          text: successText,
        },
      ]);
      setLeadSent(true);
      scrollToEnd();
    })();
  }, [catalog, leadSent, phone, scrollToEnd, selectedIds, useRemoteApi]);

  const renderMessage = useCallback(
    ({ item }: { item: AiChatMessage }) => {
      const isUser = item.role === "user";
      return (
        <View>
          <View style={isUser ? styles.bubbleUser : styles.bubbleAssistant}>
            <Text style={isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant}>
              {item.text}
            </Text>
          </View>
          {"cars" in item && item.cars.length > 0 ? (
            <View style={styles.carList}>
              {item.cars.map((car) => (
                <AiCarSuggestionCard
                  key={car.id}
                  car={car}
                  selected={selectedIds.has(car.id)}
                  onToggle={() => toggleCar(car.id)}
                />
              ))}
            </View>
          ) : null}
        </View>
      );
    },
    [selectedIds, toggleCar],
  );

  const selectedCount = selectedIds.size;
  const phoneOk = normalizePhoneInput(phone) !== null;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Назад">
          <BackCaretIcon width={24} height={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Подбор с ИИ</Text>
          <Text style={styles.headerSubtitle}>
            Новые автомобили · {site.displayName}
            {catalogSource
              ? ` · ${catalog.length} в каталоге (${catalogSource === "api" ? "с сайта" : "офлайн"})`
              : ""}
          </Text>
          {apiServerWarning ? (
            <Text style={styles.disclaimer}>{apiServerWarning}</Text>
          ) : null}
        </View>
      </View>

      {catalogLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.brand.primary} />
          <Text style={styles.disclaimer}>Загружаем каталог…</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          onContentSizeChange={scrollToEnd}
          ListFooterComponent={
            thinking ? (
              <View style={styles.bubbleAssistant}>
                <ActivityIndicator size="small" color={colors.brand.primary} />
              </View>
            ) : null
          }
        />
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        {selectedCount > 0 && !leadSent ? (
          <View style={styles.leadBox}>
            <Text style={styles.leadTitle}>Оставить заявку</Text>
            <Text style={styles.selectedHint}>
              Выбрано: {selectedCount} — укажите телефон, менеджер перезвонит
            </Text>
            <TextInput
              style={styles.input}
              placeholder="+7 (999) 123-45-67"
              placeholderTextColor={colors.text.muted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!leadSent}
            />
            <AppButton
              label="Отправить заявку"
              onPress={submitLead}
              disabled={!phoneOk}
            />
          </View>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Напишите запрос…"
            placeholderTextColor={colors.text.muted}
            value={draft}
            onChangeText={setDraft}
            multiline
            editable={!catalogLoading && !leadSent}
            onSubmitEditing={() => void sendUserMessage()}
          />
          <AppButton
            label="Отпр."
            onPress={() => void sendUserMessage()}
            disabled={!draft.trim() || thinking || catalogLoading || leadSent}
          />
        </View>
        <Text style={styles.disclaimer}>{site.disclaimer}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
