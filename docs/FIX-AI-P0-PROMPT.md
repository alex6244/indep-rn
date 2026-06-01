# Промпт: исправить P0 по ИИ (app + ai-api)

Скопируйте блок ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

---

## Текст промпта

```
Ты — senior TypeScript-разработчик. Исправь **4 критичные проблемы (P0)** в ветке ИИ-подбора. Работай в репозитории `indep-rn`. Не трогай Laravel и не переписывай проект целиком. После правок запусти `npm run typecheck`, `npm test`, `npm run typecheck --prefix ai-api`.

### Контекст
- Мобилка: `src/features/aiPicker/` — эталон логики (уже исправлен fallback: при непонятном запросе **нет карточек**).
- Сервер: `ai-api/` — дубликаты тех же файлов, **устарели**.
- Клиент API: `src/features/aiPicker/api/aiPickerApiClient.ts`, экран `src/features/aiPicker/ui/AiPickerScreen.tsx`.
- Env: `EXPO_PUBLIC_AI_API_URL` включает режим «чат через сервер».

---

## Задача 1 — убрать fallback «первые 5 LADA» на сервере

**Файл:** `ai-api/src/chat/ruleBasedReply.ts` (около стр. 70–73).

**Сейчас (плохо):** при пустом результате фильтра:
```ts
cars: filterAiCatalog(catalog, {}, 5),
```

**Должно быть как в app** (`src/features/aiPicker/chat/ruleBasedReply.ts`):
- `cars: []`
- текст с подсказкой уточнить марку/бюджет
- для `intent.bodyType === "crossover"` — отдельный hint (см. app)

Синхронизируй **весь** блок обработки `cars.length === 0` с app, не только одну строку.

---

## Задача 2 — один источник правды для логики чата (app = ai-api)

**Проблема:** дубли `parseUserIntent`, `filterCatalog`, `ruleBasedReply`, `resolveBrandFromCatalog` в:
- `src/features/aiPicker/chat/` + `catalog/filterCatalog.ts`
- `ai-api/src/chat/` + `ai-api/src/catalog/filterCatalog.ts`

В app есть `bodyType: "crossover"` и `CROSSOVER_TITLE_RE` в `filterCatalog` — на сервере этого нет.

**Сделай минимально и надёжно (выбери один путь и выполни полностью):**

### Вариант A (предпочтительный): общий пакет
1. Создай `packages/ai-core/` (или `shared/ai-chat/`) с:
   - `parseUserIntent.ts`
   - `filterCatalog.ts` (+ `isCrossoverTitle` если есть)
   - `resolveBrandFromCatalog.ts`
   - `ruleBasedReply.ts` (+ `normalizePhoneInput` если используется с обеих сторон)
   - общие типы `AiCatalogItem` / `CatalogFilter` (минимум для чата)
2. Импортируй из пакета в **app** и **ai-api** (настрой `tsconfig` paths / exports в `package.json` workspace или относительные импорты, что проще для текущего репо).
3. **Удали** дубликаты из `ai-api/src/chat` и замени реэкспортами или прямыми импортами.
4. App: замени локальные файлы на импорт из пакета **или** оставь тонкие re-export в `src/features/aiPicker/chat/` чтобы не ломать существующие импорты экрана.

### Вариант B (если A слишком тяжело за один проход)
Скопируй **актуальные** файлы из `src/features/aiPicker/` в `ai-api/src/` (chat + filterCatalog + resolveBrandFromCatalog) и добавь комментарий `// SYNC: keep in sync with src/features/aiPicker` + тест, который падает при расхождении (опционально).

**Критерий готовности:** запросы «на дачу», «кроссовер», «belgee до 2,5 млн» дают **одинаковый** `text` и набор `cars` локально и через `POST /v1/chat` (проверь вручную или тестом).

---

## Задача 3 — закрыть `GET /v1/leads`

**Файл:** `ai-api/src/routes/v1.ts`

**Сейчас:** `v1.get("/leads", ...)` отдаёт все лиды с телефонами без auth.

**Сделай:**
- В **production** (`NODE_ENV === "production"`) — **удали маршрут** или всегда `404`.
- В **development** — оставь только если `process.env.AI_API_DEV_LEADS === "true"` **или** защити заголовком `X-Dev-Key` = `process.env.AI_API_DEV_KEY` (добавь в `ai-api/.env.example`, без реального ключа в git).
- Обнови `ai-api/README.md` одной строкой про dev-only leads.

`POST /v1/leads` не ломай — он нужен для заявок.

---

## Задача 4 — не маскировать падение ai-api в приложении

**Файлы:**
- `src/features/aiPicker/api/aiPickerApiClient.ts`
- `src/features/aiPicker/ui/AiPickerScreen.tsx`

**Сейчас:** `postAiPickerChat` / `fetchAiPickerMeta` при ошибке возвращают `null` → экран молча вызывает `buildRuleBasedReply` локально.

**Сделай:**
1. Клиент при `!res.ok` или network error — **бросает** понятную ошибку или возвращает `{ ok: false, error: string }`, не `null`.
2. На экране, если `isAiPickerApiEnabled()`:
   - при ошибке chat — сообщение ассистента: «Сервер подбора временно недоступен. Попробуйте позже или отключите EXPO_PUBLIC_AI_API_URL для офлайн-режима.» **без карточек**
   - **не** вызывать `buildRuleBasedReply` автоматически при включённом API (fallback только если явная env-переменная, например `EXPO_PUBLIC_AI_API_FALLBACK_LOCAL=true` — опционально, по умолчанию false)
3. При загрузке: если `fetchAiPickerMeta` failed и API enabled — показать предупреждение в шапке или первом сообщении, но можно всё ещё грузить локальный каталог для карточек (не обязательно блокировать весь экран).

Добавь разумный timeout на fetch (10–15 с), как в `aiCatalogService`.

---

## Тесты (обязательно минимум)

В `src/features/aiPicker/` (или `packages/ai-core`):
1. `buildRuleBasedReply("на дачу поехать", catalog)` → `cars.length === 0`
2. `buildRuleBasedReply("кроссовер", catalog)` → не содержит только LADA Granta/Niva из начала seed, либо `cars.length > 0` только с кроссоверами по regex, либо `cars.length === 0` с hint — **как в эталоне app**
3. Если общий пакет — один тест, импортируемый и app не дублирует логику

Опционально: smoke в `ai-api` — один тест на `buildRuleBasedReply` импортом из shared.

---

## Ограничения
- Не добавляй DeepSeek в этом PR.
- Не коммить `.env` с ключами.
- Минимальный diff; не рефакторить `AiPickerScreen` целиком (только логика API/error).
- Пиши коммит-месседж на русском или английском по стилю репо — **не коммить**, если пользователь не просил.

## Формат отчёта в конце
1. Что сделано по задачам 1–4 (список файлов).
2. Как проверить вручную (2–3 шага: без API, с API, GET /leads).
3. Результаты `typecheck` / `test`.
```

---

## Короткая версия (только синхронизация + security)

```
Исправь P0 в indep-rn: (1) sync ai-api ruleBasedReply/filterCatalog/parseUserIntent с src/features/aiPicker — без fallback 5 LADA; (2) GET /v1/leads только dev+ключ; (3) при EXPO_PUBLIC_AI_API_URL не fallback на локальный чат без ошибки. Запусти typecheck и test. Отчёт списком файлов.
```

---

## Связанные файлы

- [CODE-AUDIT-PROMPT.md](./CODE-AUDIT-PROMPT.md) — полный аудит
- [AI-ROADMAP.md](./AI-ROADMAP.md)
- [../ai-api/README.md](../ai-api/README.md)
