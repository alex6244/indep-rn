# Промпт: техдолг AI-модуля (дубли, мёртвый код, split экрана, ошибки API, suggestLead)

Скопируйте блок ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

Связано с: senior-ревью ИИ (P1), **не** блокирует текущий деплой `ai-api.n-avtosalon.ru`.

**Вне скоупа этого PR:** TTL каталога, webhook лидов, DeepSeek, деплой/nginx.

---

## Что исправляем (5 пунктов)

| # | Проблема | Сейчас |
|---|----------|--------|
| 1 | Дубли `mapBanner`, `indep.json`, типов | client + `ai-api` копии |
| 2 | Мёртвый `fetchAiPickerMeta`, `postAiPicker*`, `isAiPickerRtkEnabled` | RTK жив, fetch-слой не используется |
| 3 | `AiPickerScreen` ~430 LOC | catalog + chat + leads в одном файле |
| 4 | Два формата ошибок API | `{ error: string }` vs `apiError()` |
| 5 | `suggestLead` с сервера игнорируется | поле есть в `v1.ts`, клиент не читает |

---

## Текст промпта (копировать отсюда)

```
Ты — senior fullstack (React Native / Expo, TypeScript, Hono). Исправь P1 техдолг AI-модуля в `indep-rn`. Минимальный diff, без новых фич (LLM, CRM, деплой). Не трогай Laravel. Пиши по-русски в отчёте.

### Контекст (прочитай код)

**Общая логика:** `packages/ai-core` — rules/intent/filter (уже shared).
**Дубли:**
- `ai-api/src/catalog/mapBanner.ts` ≈ `src/features/aiPicker/catalog/mapBannerToAiCatalogItem.ts`
- `ai-api/config/sites/indep.json` ≈ `src/data/ai/sites/indep.json`
- `ai-api/src/types.ts` ≈ `src/features/aiPicker/types.ts`

**API:** `ai-api/src/routes/v1.ts` — часть ошибок `{ error: "site_not_found" }`, middleware — `apiError()` из `ai-api/src/lib/apiError.ts`.
**Клиент:** `src/features/aiPicker/api/aiPickerApi.ts` (RTK Query, активный путь), `aiPickerApiClient.ts` (legacy fetch — мёртвые функции).
**Экран:** `src/features/aiPicker/ui/AiPickerScreen.tsx` (~430 строк).
**suggestLead:** `packages/ai-core/src/ruleBasedReply.ts` возвращает `suggestLead`; `v1.ts` отдаёт в JSON; клиент не парсит.

Перед правками: `npm run typecheck`, `npm test`, `npm run typecheck --prefix ai-api`.

---

### Задача 1 — единый источник mapBanner, site config, типов

**Цель:** одно место правды, без рассинхрона при новом `siteId`.

**Рекомендуемый подход (предпочтительно):** расширить `packages/ai-core`:

1. Добавить `packages/ai-core/src/types.ts`:
   - `AiCatalogItem`, `AiSiteProfile`, `AiCatalogSource` (`"api" | "seed"`)
   - Экспортировать из `packages/ai-core/src/index.ts`

2. Перенести mapper в `packages/ai-core/src/mapBanner.ts`:
   - `mapBannerToAiCatalogItem`, `mapBannerListToAiCatalog`
   - Тип строки banner: один `BannerCatalogRow` (объедини `BannerRow` / `BannerCatalogRow`)

3. **Site JSON — один файл:**
   - Канон: `src/data/ai/sites/indep.json` (уже импортируется в `aiCatalogService.ts`)
   - `ai-api`: убрать дубль `ai-api/config/sites/` ИЛИ оставить тонкий re-export/symlink — **проще:** читать сайты из `src/data/ai/sites/` в `ai-api/src/index.ts` (как seed в `catalogStore.ts` уже тянет `../../..`)
   - Обновить `CONFIG_DIR` / `loadSites()` чтобы не дублировать JSON

4. Заменить импорты:
   - `ai-api` → типы и mapper из `packages/ai-core`
   - `src/features/aiPicker` → типы и mapper из `packages/ai-core` (удалить локальные дубли или оставить re-export на 1 строку для обратной совместимости внутри feature)

5. Удалить мёртвые копии файлов после миграции импортов.

**Не делать:** новый пакет `packages/ai-contracts` без необходимости — достаточно `ai-core`.

**Тесты:** перенести/обновить `mapBannerToAiCatalogItem.test.ts` → тестировать экспорт из `ai-core` (или оставить thin wrapper test).

---

### Задача 2 — убрать мёртвый fetch-слой

**Файлы:** `src/features/aiPicker/api/aiPickerApiClient.ts`, `aiPickerApi.ts`

**Оставить** (используются):
- `isAiPickerApiEnabled`, `isAiPickerLocalFallbackEnabled`
- `AI_PICKER_SERVER_UNAVAILABLE_MESSAGE`
- Типы `AiPickerMeta`, `AiPickerChatReply` (или перенести типы в `features/aiPicker/types.ts` / `ai-core`)

**Удалить:**
- `fetchAiPickerMeta`, `postAiPickerChat`, `postAiPickerLead`
- `aiFetch` в `aiPickerApiClient.ts` если станет не нужен
- `isAiPickerRtkEnabled` из `aiPickerApi.ts`
- Неиспользуемые типы `AiPickerApiResult`, `AiPickerApiError` если нигде не останутся

**Опционально:** переименовать `aiPickerApiClient.ts` → `aiPickerEnv.ts` (только env + константы) — только если diff остаётся читаемым.

**Проверка:** `rg "fetchAiPickerMeta|postAiPickerChat|postAiPickerLead|isAiPickerRtkEnabled"` — 0 matches в `src/`.

---

### Задача 3 — разрезать `AiPickerScreen` (FSD-lite, без смены UX)

**Цель:** экран < ~200 LOC, логика в hooks, **поведение 1:1**.

Вынести из `AiPickerScreen.tsx`:

| Новый модуль | Содержание |
|--------------|------------|
| `hooks/useAiPickerBootstrap.ts` | catalog load, `useRemoteApi`, `catalogSource`, welcome, `apiServerWarning` |
| `hooks/useAiPickerChat.ts` | `sendMessage`, thinking, remote/local fallback, messages append |
| `hooks/useAiPickerLead.ts` | `submitLead`, `leadSent`, `leadSubmitting`, phone state |
| `ui/AiPickerLeadForm.tsx` | блок телефона + кнопка «Отправить заявку» (если >30 строк в экране) |

`AiPickerScreen.tsx` — composer: hooks + layout (`FlatList`, header, disclaimer).

**Не менять:**
- `SITE_ID = "indep"`
- `leadSent` только при успехе (remote) / offline dev accept
- `formatCatalogSourceLabel`
- Стили `aiPicker.styles.ts`

**Тесты:** по желанию 1–2 unit-теста на `useAiPickerLead` pure logic (extract `submitLead` core) — **не обязательно**, если время; главное — `npm test` зелёный.

---

### Задача 4 — единый формат ошибок в `ai-api`

**Цель:** все JSON-ошибки из `v1.ts` в формате:

```json
{ "error": { "code": "site_not_found", "message": "..." } }
```

**Действия:**
1. В `ai-api/src/routes/v1.ts` заменить все `c.json({ error: "..." }, status)` на `c.json(apiError("code", "message"), status)`.
2. Коды сохранить семантически (`invalid_site`, `site_not_found`, `invalid_body`, `no_cars`, …).
3. `message` — короткий русский или английский tech (как в `requestLimits.ts`); **единый стиль** с middleware.
4. Rate limit: уже `apiError` — не ломать.
5. **Клиент:** `parseApiErrorMessage` в `aiPickerApi.ts` уже поддерживает оба формата — после унификации упростить: только structured path (удалить ветку `typeof err === "string"` **только если** все v1 ошибки мигрированы).
6. Синхронизировать текст 429: использовать **одну** константу (server `RATE_LIMITED_MESSAGE` или client `AI_PICKER_RATE_LIMIT_MESSAGE`) — выбери одну фразу, экспортируй/продублируй в комментарии «keep in sync».

**Тесты:** добавить `ai-api/src/routes/__tests__/v1.errors.test.ts` (минимум: mock app, assert body shape на 400/404) ИЛИ расширить существующий middleware test pattern.

---

### Задача 5 — провязать `suggestLead` на клиенте

**Сервер:** уже отдаёт `suggestLead` в `POST /v1/chat` (`v1.ts`).

**Клиент:**
1. Расширить `AiPickerChatReply`: `{ text, cars, suggestLead?: boolean }`.
2. RTK `sendAiChat` — парсить `suggestLead` из ответа.
3. Локальный fallback (`buildRuleBasedReply`) — уже возвращает `suggestLead` из ai-core; прокинуть в тот же тип.

**UX (минимальный, без redesign):**
- Добавить state `leadSuggested: boolean` (или использовать последний ответ чата).
- Когда `suggestLead === true` && `selectedCount > 0` && `!leadSent`:
  - `scrollToEnd` к блоку заявки (уже есть `scrollToEnd`)
  - одноразовый hint в чате от assistant: «Можете оставить телефон — менеджер перезвонит» **или** subtle `Text` над полем телефона (выбери один вариант, не оба).
- Когда `suggestLead === true` && `selectedCount === 0`: **не** показывать форму лида; optional hint «Отметьте понравившиеся авто» в том же assistant bubble (если уже есть cars в сообщении — не дублировать текст).

**Не менять:** условие показа формы лида (`selectedCount > 0 && !leadSent`) — только усилить CTA через `suggestLead`.

**Тест:** unit на pure helper `shouldHighlightLead(suggestLead, selectedCount, leadSent)` — опционально.

---

### Ограничения

- Не менять контракт URL `/v1/*` (пути те же).
- Не добавлять CRM/Telegram webhook.
- Не трогать `eas.json`, деплой, nginx.
- Не рефакторить `packages/ai-core` rules (только types + mapBanner + exports).
- Сохранить monorepo paths для deploy (`ai-api` + `packages/ai-core` + `src/data/ai`).

---

### Проверки (обязательно)

```bash
npm run typecheck
npm test
npm run typecheck --prefix ai-api
```

Ручной smoke (опиши в отчёте):
1. `ai-api` dev: `/health`, `POST /v1/chat` → body содержит `suggestLead`
2. Expo + `EXPO_PUBLIC_AI_API_URL=http://localhost:8787`: чат → выбор авто → `suggestLead` CTA виден
3. Ошибка 404 site: structured `{ error: { code, message } }`

---

### Формат отчёта

1. Список изменённых файлов (группами: ai-core, ai-api, aiPicker).
2. Что стало single source of truth для mapBanner / sites / types.
3. Что удалено из `aiPickerApiClient.ts`.
4. Структура после split `AiPickerScreen` (дерево hooks/ui).
5. Пример JSON ошибки до/после (один endpoint).
6. Как работает `suggestLead` в UI (2 предложения).
7. Результаты typecheck + test.
```

---

## Порядок выполнения (для агента)

1. **Задача 1** (ai-core types + mapBanner + site path) — основа для остального.
2. **Задача 2** (мёртвый код) — быстрая очистка.
3. **Задача 4** (ошибки API) — до или параллельно с 5.
4. **Задача 5** (suggestLead) — зависит от типов chat reply.
5. **Задача 3** (split экрана) — в конце, когда типы/hooks стабильны.

---

## Критерии готовности

- [ ] Один `mapBanner` и один `indep.json` (или один canonical path)
- [ ] `AiCatalogItem` / `AiSiteProfile` импортируются из `ai-core` (или одного модуля)
- [ ] Нет `fetchAiPickerMeta` / `postAiPicker*` / `isAiPickerRtkEnabled`
- [ ] `AiPickerScreen.tsx` < 220 строк (ориентир)
- [ ] Все ошибки `v1.ts` в формате `apiError`
- [ ] `suggestLead` парсится и даёт видимый CTA
- [ ] 209+ tests pass, typecheck ok

---

## Риски (не сломать)

| Риск | Как избежать |
|------|----------------|
| Deploy `ai-api` без `src/data/ai` | site JSON path относительно repo root, как seed |
| Metro не резолвит `ai-core` из app | уже работает для rules — проверить новые exports |
| Сломать offline seed | `loadAiCatalogWithMeta` fallback без изменений поведения |
| Over-split экрана | 3 hooks достаточно, не 10 файлов |
