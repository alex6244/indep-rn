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
import { AppButton } from "../../../shared/ui/AppButton";
import { colors } from "../../../shared/theme/colors";
import { formatCatalogSourceLabel, shouldShowLeadCta } from "../hooks/aiPickerUtils";
import { useAiPickerBootstrap } from "../hooks/useAiPickerBootstrap";
import { useAiPickerChat } from "../hooks/useAiPickerChat";
import { useAiPickerLead } from "../hooks/useAiPickerLead";
import type { AiChatMessage } from "../types";
import { AiCarSuggestionCard } from "./AiCarSuggestionCard";
import { AiPickerLeadForm } from "./AiPickerLeadForm";
import { aiPickerStyles as styles } from "./aiPicker.styles";

const SITE_ID = "indep";

export function AiPickerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<AiChatMessage>>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const {
    site,
    catalog,
    catalogSource,
    useRemoteApi,
    catalogLoading,
    apiServerWarning,
    welcomeText,
  } = useAiPickerBootstrap(SITE_ID);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const selectedCount = selectedIds.size;

  const {
    messages,
    setMessages,
    draft,
    setDraft,
    thinking,
    leadSuggested,
    sendUserMessage,
  } = useAiPickerChat({
    siteId: SITE_ID,
    catalog,
    catalogLoading,
    useRemoteApi,
    site,
    welcomeText,
    selectedCount,
    scrollToEnd,
  });

  const {
    phone,
    setPhone,
    leadSent,
    leadSubmitting,
    phoneOk,
    submitLead,
  } = useAiPickerLead({
    siteId: SITE_ID,
    catalog,
    selectedIds,
    useRemoteApi,
    scrollToEnd,
    setMessages,
  });

  const toggleCar = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const showLeadCta = shouldShowLeadCta(leadSuggested, selectedCount, leadSent);

  useEffect(() => {
    if (showLeadCta) {
      scrollToEnd();
    }
  }, [showLeadCta, scrollToEnd]);

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
              ? ` · ${formatCatalogSourceLabel(catalogSource, catalog.length)}`
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
          <AiPickerLeadForm
            selectedCount={selectedCount}
            phone={phone}
            onPhoneChange={setPhone}
            leadSent={leadSent}
            leadSubmitting={leadSubmitting}
            phoneOk={phoneOk}
            showLeadCta={showLeadCta}
            onSubmit={submitLead}
          />
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
