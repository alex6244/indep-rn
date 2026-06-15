# Промпт: единый поиск по каталогу — «киа рио», модели, кириллица (F-09 / Catalog Search v2)

Скопируйте блок **«Текст промпта»** ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

**Цель:** один масштабируемый слой поиска в `packages/ai-core`, чтобы запросы вроде **«киа рио»**, **«KIA Rio»**, **«бмв x5»** находили нужную модель, а не «первые 5 KIA из JSON». Rules и LLM используют **один shortlist**, без расхождения логики.

| ID | Задача | Effort |
|----|--------|--------|
| F-09 | Catalog Search v2: model + normalize + rank + `searchCatalog()` | L |
| Связано | F-08 (LLM pre-filter), F-21 (`intentForCatalogFilter` сбрасывает query) | — |

**Вне скоупа:** embeddings / vector DB, новые npm-зависимости (только stdlib), Laravel, UI мобилки, смена формата API `/v1/chat`, офлайн-поиск на клиенте без ai-api.

---

## Контекст (для себя)

### Симптом

Запрос **«киа рио»** → в ответе KIA (Picanto, Ceed…), но **не Rio**, хотя в каталоге есть `KIA Rio`, `KIA Rio X`.

### Корневая причина (три бага, одна архитектура)

| # | Что ломается | Где |
|---|--------------|-----|
| 1 | `query = "киа рио"` сравнивается с `title = "KIA Rio"` — кириллица ≠ latin, полная фраза не матчится | `filterCatalog.ts` → `filter.query` |
| 2 | Fallback `{ brand: KIA }` → `list.slice(0, 5)` по **порядку в каталоге**, Rio далеко в списке | `ruleBasedReply.ts` |
| 3 | При `brand` + `query` LLM-pool **выбрасывает query** (`intentForCatalogFilter`) | `ai-api/.../llmCatalogRecommend.ts` |
| 4 | `model_name` из баннера **не сохраняется** в `AiCatalogItem` | `mapBanner.ts`, `types.ts` |

### Правильная архитектура (сеньорское решение)

```
indep.su banners → mapBanner (+ model, searchText)
                         ↓
              buildCatalogSearchIndex (опционально P1)
                         ↓
              searchCatalog(userText, catalog) → ranked shortlist
                    ↙              ↘
        buildRuleBasedReply    pickCatalogForLlm → DeepSeek (только текст + id из shortlist)
```

**Принцип:** детерминированный поиск + ранжирование в `ai-core`; LLM **не ищет** по 248 машинам, а выбирает из top-N.

### Ключевые файлы

| Слой | Путь |
|------|------|
| Типы | `packages/ai-core/src/types.ts` |
| Маппинг | `packages/ai-core/src/mapBanner.ts` |
| Intent | `packages/ai-core/src/parseUserIntent.ts` |
| Фильтр (legacy) | `packages/ai-core/src/filterCatalog.ts` |
| Rules | `packages/ai-core/src/ruleBasedReply.ts` |
| Бренд из каталога | `packages/ai-core/src/resolveBrandFromCatalog.ts` |
| LLM subset | `ai-api/src/llm/llmCatalogRecommend.ts` |
| Chat flow | `ai-api/src/chat/buildChatReply.ts` |
| Тесты | `packages/ai-core/src/__tests__/`, `ai-api/src/llm/__tests__/` |

---

## Текст промпта (копировать отсюда)

```
Ты — senior TypeScript-разработчик (search + e-commerce catalog). Репозиторий: `indep-rn`. Реализуй **Catalog Search v2** (F-09): единый поиск по каталогу для ИИ-подбора. Минимальный diff, **без новых npm-зависимостей**. Пиши по-русски в комментариях только где неочевидно.

---

### North star

После фикса **одна функция** `searchCatalog(userText, catalog, options?)` в `packages/ai-core` возвращает ранжированный shortlist. И `buildRuleBasedReply`, и `pickCatalogForLlm` **обязаны** использовать её — не дублировать filter/fallback по-разному.

---

## Фаза P0 — данные + нормализация + скоринг (обязательно)

### 1. Расширить `AiCatalogItem`

Файл: `packages/ai-core/src/types.ts`

Добавь опциональные поля (не ломай существующие JSON-ответы API):

```ts
model?: string;      // из banner.model_name, напр. "Rio"
searchText?: string; // нормализованная строка для поиска (заполняется в mapBanner)
```

Файл: `packages/ai-core/src/mapBanner.ts`

- При маппинге: `model: row.model_name?.trim() || ""` (если пусто — вытащи из `full_name` после brand)
- `searchText: buildItemSearchText({ brand, model, title })` — см. п.2

Обнови `mapBanner.test.ts` если есть.

**Обратная совместимость:** поля optional; старые seed JSON без model — searchText строится из title.

### 2. Модуль нормализации

Новый файл: `packages/ai-core/src/normalizeSearchText.ts`

```ts
export function normalizeSearchText(input: string): string
export function tokenizeSearchText(input: string): string[]
```

Поведение `normalizeSearchText`:
- trim, lower case, схлопнуть пробелы
- `ё` → `е`
- заменить `й` на `и` в конце слогов **не обязательно** — достаточно ё→е на старте
- **транслит кириллица → латиница** для букв (простая таблица а→a, б→b, …, или минимальный mapping для автобрендов — без внешних lib)
- оставить только буквы/цифры/пробелы (дефис → пробел)

`tokenizeSearchText`: split по пробелам, отфильтровать токены короче 2 символов (кроме цифр).

Экспорт из `packages/ai-core/src/index.ts`.

Тесты: `packages/ai-core/src/__tests__/normalizeSearchText.test.ts`
- `"киа рио"` и `"KIA Rio"` дают пересекающиеся токены (`kia`, `rio`)
- `"БМВ"` → содержит `bmw` или эквивалент после нормализации

### 3. Словарь алиасов марок (маленький, статический)

Новый файл: `packages/ai-core/src/brandAliases.ts` (или расширить `parseUserIntent.ts`)

- Перенеси/дублируй `BRAND_ALIASES` из `parseUserIntent.ts` в одно место
- `resolveBrandToken(token): string | undefined` — canonical brand name (KIA, BMW, …)

Не хардкодить **модели** (Rio, Sportage) — только марки.

### 4. Скоринг релевантности

Новый файл: `packages/ai-core/src/rankCatalogByQuery.ts`

```ts
export type CatalogSearchOptions = {
  limit?: number;           // default 5 для UI, 30–70 для LLM pool
  maxPrice?: number;
  bodyType?: BodyType;
  fixedBrand?: string;
};

export type CatalogSearchResult = {
  items: AiCatalogItem[];
  intent: CatalogFilter;   // из parseUserIntent + enrich
  matchedTokens: string[];
};

export function rankCatalogByQuery(
  userText: string,
  catalog: AiCatalogItem[],
  options?: CatalogSearchOptions,
): CatalogSearchResult
```

Алгоритм (детерминированный, без ML):

1. `scoped = withoutEonixUnlessEligible(catalog, userText)`
2. `intent = parseUserIntent(userText)` + `resolveBrandFromCatalog` если нет brand + `fixedBrand` override
3. `queryTokens = tokenizeSearchText(userText)` минус токены бюджета («до», «млн», числа) и минус brand-alias tokens
4. Для каждого item вычисли **score** (number):
   - +100 если `intent.brand` совпадает с item.brand
   - +50 за каждый queryToken, найденный в `item.searchText` (после normalize)
   - +80 если token совпадает с `item.model` (normalize, whole word)
   - +30 если token в `item.title`
   - применить hard filters: maxPrice, bodyType (как в `filterAiCatalog` — переиспользуй функции `isCrossoverTitle` и т.д.)
   - штраф 0 / exclude если hard filter не прошёл
5. Сортировка: score desc, затем priceFrom asc
6. Верни top `limit` (default 5)

**Важно:** при запросе «киа рио» в top должны быть **Rio / Rio X**, не Picanto.

### 5. Подключить P0 в rules

Файл: `packages/ai-core/src/ruleBasedReply.ts`

- Замени цепочку `filterAiCatalog` + fallback `{ brand }` + `slice` на:
  ```ts
  const { items: cars } = rankCatalogByQuery(trimmed, scopedCatalog, {
    limit: 5,
    fixedBrand: options?.fixedBrand,
  });
  ```
- Сохрани тексты ответов (filters в prose) — подстрой под `intent` из result
- Если `cars.length === 0` — оставь существующие human-readable hints (не ухудшай)

Тесты: `packages/ai-core/src/__tests__/rankCatalogByQuery.test.ts` или `ruleBasedReply.test.ts`
- Фикстура: 8 KIA включая Rio, Rio X, Picanto (разный порядок — Rio не первый)
- `"киа рио"` → первый результат содержит `Rio` в title
- `"KIA Rio"` → то же
- `"киа до 2.5 млн"` → только KIA ≤ бюджет

---

## Фаза P1 — единый `searchCatalog` + LLM (обязательно в этом PR)

### 6. Фасад `searchCatalog`

Новый файл: `packages/ai-core/src/searchCatalog.ts`

```ts
export function searchCatalog(
  userText: string,
  catalog: AiCatalogItem[],
  options?: CatalogSearchOptions,
): CatalogSearchResult
```

Сейчас = обёртка над `rankCatalogByQuery` (+ позже index). Экспорт из `index.ts`.

`buildRuleBasedReply` вызывает `searchCatalog(..., { limit: 5 })`.

### 7. LLM subset на том же поиске

Файл: `ai-api/src/llm/llmCatalogRecommend.ts`

- **`pickCatalogForLlm`** перепиши так:
  - вызывает `searchCatalog(userText, scopedCatalog, { limit: LLM_CATALOG_LINES })` из `@indep/ai-core` / относительный import
  - возвращает `result.items`
- **Удали или пересмотри `intentForCatalogFilter`**: не сбрасывай model-токены. Если нужно сбрасывать только «лишний» query при чистом «BMW до 5 млн» (где query дублирует brand+budget) — сделай условие: сбрасывать `query` только если **все** queryTokens уже покрыты brand/maxPrice/bodyType. Для «киа рио» токен `rio` **не** покрыт → query остаётся в скоринге.
- Сохрани: `withoutEonixUnlessEligible`, `filterAffordableCompact` для profile compact — можно внутри `searchCatalog` как ветка intent
- Fallback `diversifyByBrand` только если `searchCatalog` вернул 0 items

Тесты `ai-api/src/llm/__tests__/llmCatalogRecommend.test.ts`:
- «киа рио» → subset/prompt содержит строку с `Rio`
- «BMW до 5 млн» — не регресс (BMW в subset)
- EONIX policy — не регресс

### 8. Опционально P1.5 — лёгкий индекс (если успеваешь)

`packages/ai-core/src/buildCatalogSearchIndex.ts` — Map token → Set<id>, строится из catalog один раз. `rankCatalogByQuery` может сузить кандидатов через index перед полным скорингом. **Не обязательно** для merge, если скоринг по 248 items быстрый.

---

## Ограничения

- Не добавляй `fuse.js`, `elastic`, ML-модели
- Не меняй контракт `/v1/chat` (поля `text`, `cars`, `replySource`)
- Не трогай `aiPicker` UI
- `imageUrl` в тестовых фикстурах — добавляй где TypeScript требует (если сломается typecheck соседних тестов — минимальный fix)
- Комментарии кратко, без essay

---

## Проверка

```bash
npm test -- --testPathPattern="normalizeSearchText|rankCatalog|ruleBasedReply|llmCatalogRecommend|mapBanner" --no-coverage
cd ai-api && npm run typecheck
npm test -- --testPathPattern="ai-core" --no-coverage
```

Ручная (ai-api + DEEPSEEK или rules-only):

```bash
# rules path (без ключа — replySource rules)
curl -s -X POST http://localhost:8787/v1/chat \
  -H "Content-Type: application/json" \
  --data-binary '{"siteId":"indep","message":"киа рио","selectedCount":0}'

curl -s -X POST http://localhost:8787/v1/chat \
  -H "Content-Type: application/json" \
  --data-binary '{"siteId":"indep","message":"KIA Rio","selectedCount":0}'
```

В `cars[]` ожидается **KIA Rio** или **KIA Rio X** в первых позициях.

---

## Отчёт в конце

1. Список новых/изменённых файлов
2. Схема: кто вызывает `searchCatalog` (rules vs LLM)
3. Примеры score для «киа рио» (1 абзац)
4. Результат тестов (команды + pass/fail)
5. Что осталось на потом (embeddings, fuzzy opечатки, index в мобилке)
6. Обнови одну строку в `docs/AI-ROADMAP.md` — F-09 done / catalog search v2
```

---

## После выполнения

1. `cd ai-api && npm run dev` — перезапуск
2. В приложении: «киа рио», «KIA Rio», «киа до 2,5 млн», «BMW до 5 млн»
3. Убедиться, что `replySource: "rules"` и `"llm"` ведут себя согласованно по **cars[]** (текст LLM может отличаться)

## Связь с прошлыми задачами

| Задача | Статус после F-09 |
|--------|-------------------|
| F-08 LLM pre-filter по brand/budget | Входит в `searchCatalog` — можно считать supersede |
| F-21 intentForCatalogFilter | Должен быть исправлен или удалён |
| Хардкод моделей в `parseUserIntent` | **Не делать** — модели из catalog + токены |
