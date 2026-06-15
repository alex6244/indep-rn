# Промпт: тесты hooks + deploy smoke + UX polish (F-10, F-11, F-12, F-14)

Скопируйте блок **«Текст промпта»** ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

**Цель:** закрыть четыре finding из senior review ИИ-части — без F-13 (`suggestLead`), без Laravel, без большого рефактора UI.

| ID | Задача | Effort |
|----|--------|--------|
| F-10 | RTL-тесты `useAiPickerBootstrap` / `Chat` / `Lead` с мок RTK | M |
| F-11 | Зафиксировать деплой ai-api: `AI_API_REPO_ROOT` + smoke script | S |
| F-12 | Убрать искусственную задержку 400ms в чате | S |
| F-14 | Показывать `meta.disclaimer` с сервера, не только JSON | S |

---

## Контекст (для себя)

| Файл | Сейчас |
|------|--------|
| `src/features/aiPicker/hooks/useAiPickerBootstrap.ts` | remote meta+catalog, seed fallback, без тестов |
| `src/features/aiPicker/hooks/useAiPickerChat.ts` | `setTimeout(400)` перед ответом; remote/local/auth fallback |
| `src/features/aiPicker/hooks/useAiPickerLead.ts` | remote lead + `resolveSelectedCarTitles` (уже починен F-03) |
| `src/features/aiPicker/ui/AiPickerScreen.tsx` | footer: `site.disclaimer` из JSON; форма лида по `selectedCount` |
| `src/hooks/__tests__/useProtected.test.tsx` | эталон `renderHook` + mocks |
| `ai-api/ecosystem.config.cjs` | уже задаёт `AI_API_REPO_ROOT` |
| `docs/DEPLOY-AI-API-SELECTEL.md` | чеклист деплоя |

**Вне скоупа:** F-13 (логика `suggestLead` vs форма лида), F-07 Redis rate limit, F-16 import shims.

---

## Текст промпта (копировать отсюда)

```
Ты — senior TypeScript / React Native разработчик. Репозиторий: `indep-rn`. Выполни задачи F-10, F-11, F-12, F-14 из code review ИИ-подбора. Минимальный diff, без новых тяжёлых зависимостей.

---

### F-12 — убрать задержку 400ms (сначала, тривиально)

Файл: `src/features/aiPicker/hooks/useAiPickerChat.ts`

- Удали `await new Promise((r) => setTimeout(r, 400));` перед формированием ответа.
- Индикатор «думает» уже есть: `thinking` + `ActivityIndicator` в `AiPickerScreen` ListFooterComponent — этого достаточно.
- Не добавляй новую задержку.

---

### F-14 — disclaimer с сервера

Проблема: `useAiPickerBootstrap` получает `meta.disclaimer` через RTK `getAiMeta`, но UI показывает только `site.disclaimer` из `getAiSiteProfile` / `indep.json`.

Сделай:

1. В `useAiPickerBootstrap` — state `disclaimer: string | null`, при успешном meta: `setDisclaimer(meta.disclaimer ?? site.disclaimer)`.
2. При offline / без remote: `site.disclaimer`.
3. При fallback без meta: `site.disclaimer`.
4. В `AiPickerScreen` — footer disclaimer из bootstrap (`disclaimer`), не напрямую `site.disclaimer`.
5. Не дублируй disclaimer в header и footer — один раз в footer как сейчас.

Тест (лёгкий): unit на bootstrap сложен — достаточно проверить, что meta disclaimer пробрасывается (опционально маленький тест с мок dispatch, если F-10 уже делает bootstrap).

---

### F-10 — тесты hooks (главный объём)

Добавь тесты по образцу `src/hooks/__tests__/useProtected.test.tsx` (`@testing-library/react-native`, `renderHook`, `act`).

**Инфраструктура:**
- Оберни hooks в `Provider` с тестовым store (`configureStore` + `aiPickerApi` reducer/middleware) ИЛИ замокай `useAppDispatch` и `aiPickerApi.endpoints.*.initiate`.
- Предпочтительно: мок `useAppDispatch` + `initiate().unwrap()` — проще, как в `aiPickerApi.auth.test.ts`.
- Замокай `isAiPickerApiEnabled`, `isAiPickerLocalFallbackEnabled` из `../api/aiPickerEnv` где нужно.
- Замокай `buildRuleBasedReply` в chat-тестах при offline fallback (опционально).

**Файлы тестов** (создай если нет):
- `src/features/aiPicker/hooks/__tests__/useAiPickerBootstrap.test.ts`
- `src/features/aiPicker/hooks/__tests__/useAiPickerChat.test.ts`
- `src/features/aiPicker/hooks/__tests__/useAiPickerLead.test.ts`

**Минимальные сценарии (must have):**

`useAiPickerBootstrap`:
1. Remote: meta ok + catalog ok → `catalogLoading` false, `useRemoteApi` true, items из catalog, `apiServerWarning` null.
2. Remote: meta fail + catalog ok → каталог есть, warning или graceful (как в коде).
3. Remote off (`isAiPickerApiEnabled` false) → `loadAiCatalogWithMeta` path, `useRemoteApi` false.

`useAiPickerChat`:
1. Remote: `sendAiChat` success → assistant message с text/cars.
2. Remote: 401 (`AiPickerApiError` unauthorized) → текст auth, **без** local fallback даже если `FALLBACK_LOCAL=true`.
3. Remote: network error + `FALLBACK_LOCAL=true` → `buildRuleBasedReply` fallback.
4. Offline (`useRemoteApi` false) → rule-based reply.

`useAiPickerLead`:
1. Remote lead success → `leadSent` true, сообщение от сервера.
2. Remote lead fail → `leadSent` false, error text в assistant bubble.
3. **Titles из chat cars:** catalog пустой, selected id только в `messages[].cars` → `resolveSelectedCarTitles` в success message (регрессия F-03).

Не тестируй весь UI `AiPickerScreen` — только hooks.

---

### F-11 — deploy smoke для ai-api

Проблема: `ai-api` импортирует `../../../packages/ai-core` и `../../src/data/ai` — без корня монорепо и `AI_API_REPO_ROOT` деплой ломается.

Сделай:

1. **Проверь** `ai-api/ecosystem.config.cjs` — `AI_API_REPO_ROOT` указывает на корень репо (уже есть; не ломай).

2. **Добавь скрипт** `ai-api/scripts/smoke-deploy.sh` (bash, работает на Linux/macOS; для Windows — `smoke-deploy.ps1` опционально):
   - Проверяет наличие `packages/ai-core`, `src/data/ai/sites`, `src/data/ai/indep-banner-catalog.seed.json` относительно `AI_API_REPO_ROOT` или cwd.
   - `curl -sf http://127.0.0.1:${PORT:-8787}/health` → exit 0 только если `ok:true` и `catalogCount > 0`.
   - Печатает понятные ошибки («запустите pm2 из корня репо», «catalogCount 0»).

3. **Добавь npm script** в `ai-api/package.json`: `"smoke:deploy": "bash scripts/smoke-deploy.sh"` (или node cross-platform скрипт, если bash недоступен на CI).

4. **Обнови** `ai-api/README.md` и кратко `docs/DEPLOY-AI-API-SELECTEL.md` — секция «После деплоя: npm run smoke:deploy».

Не меняй импорты ai-api на npm-пакеты — только документация + smoke.

---

### Проверка

```bash
npm test -- --testPathPattern="useAiPickerBootstrap|useAiPickerChat|useAiPickerLead" --no-coverage
# весь ai-picker suite:
npm test -- --testPathPattern="aiPicker" --no-coverage

cd ai-api && npm run typecheck
# smoke локально (ai-api должен быть запущен):
cd ai-api && npm run smoke:deploy
```

Убедись, что удаление 400ms не ломает тесты (fake timers не нужны, если delay убран).

---

### Отчёт в конце

1. Список изменённых файлов
2. Сколько тестов добавлено по каждому hook
3. Как запустить smoke-deploy
4. Что осталось вне скоупа (F-13)
```

---

## После выполнения

1. `npx expo start` — чат без лишней паузы, disclaimer актуальный при remote meta.
2. На сервере после pm2: `cd ai-api && npm run smoke:deploy`.
3. Опционально: пункт в `docs/AI-ROADMAP.md` — F-10/F-11/F-12/F-14 done.
