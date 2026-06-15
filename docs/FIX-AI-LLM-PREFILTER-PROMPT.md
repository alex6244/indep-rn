# Промпт: умный pre-filter каталога перед DeepSeek (F-08, вариант A)

Скопируйте блок **«Текст промпта»** ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

**Цель:** в `pickCatalogForLlm` сужать каталог по intent **так же, как в rules**, чтобы в промпт LLM попадали BMW/редкие марки, а не только «самые дешёвые 70».

**Вне скоупа:** embeddings, tool calling, полный каталог 248 строк без лимита (вариант B), изменения Laravel, UI.

---

## Контекст (для себя)

| Слой | Файл | Проблема |
|------|------|----------|
| LLM pick | `ai-api/src/llm/llmCatalogRecommend.ts` → `pickCatalogForLlm()` | При `maxPrice` берёт дешёвые + `diversifyByBrand`, **игнорирует `intent.brand`** |
| Rules (эталон) | `packages/ai-core/src/ruleBasedReply.ts` | `parseUserIntent` → `resolveBrandFromCatalog` → `filterAiCatalog` |
| Intent | `packages/ai-core/src/parseUserIntent.ts` | brand, maxPrice, bodyType, profile |
| EONIX | `packages/ai-core/src/eonixPolicy.ts` | `withoutEonixUnlessEligible` уже вызывается в `pickCatalogForLlm` — сохранить |

**Симптом:** запрос «BMW до 5 млн» → в LLM нет BMW (выпали из топа дешёвых), ИИ отвечает «не нашёл».

**Константы сейчас:** `LLM_CATALOG_LINES = 70`, fallback `sorted.slice(0, 120)`.

---

## Текст промпта (копировать отсюда)

```
Ты — senior TypeScript-разработчик. Улучши pre-filter каталога перед DeepSeek в `ai-api` (задача F-08, вариант A). Репозиторий: `indep-rn`. Минимальный diff, без новых зависимостей.

### Проблема

`ai-api/src/llm/llmCatalogRecommend.ts` → `pickCatalogForLlm()`:
- При запросе с бюджетом (`intent.maxPrice`) в LLM уходят самые дешёвые машины из каталога, а не машины запрошенной марки.
- Ветки для `intent.brand` нет (в отличие от `packages/ai-core/src/ruleBasedReply.ts`).

ИИ выбирает `carIds` только из subset (~70 строк) — если BMW не попали в subset, подбор ломается.

### Что сделать

1. **Вынеси или синхронизируй логику intent с rules** в `pickCatalogForLlm`:
   - `parseUserIntent(userText)`
   - если `!intent.brand` → `resolveBrandFromCatalog(userText, scopedCatalog)` (импорт из `packages/ai-core`)
   - `scopedCatalog = withoutEonixUnlessEligible(catalog, userText)` — уже есть, не ломать

2. **Добавь приоритетную ветку intent-filter** (до ветки «только maxPrice по цене»):
   - Если есть `brand` и/или `bodyType` и/или `maxPrice` (комбинации) → `filterAiCatalog(scopedCatalog, intent, большой limit)`  
     Используй limit ≥ 100 для внутреннего пула, финальный cap — ниже.
   - Если после фильтра **≤ 80** машин → верни **все** (не обрезай до 70).
   - Если **> 80** → `diversifyByBrand(pool, LLM_CATALOG_LINES)` или cap 100.

3. **Сохрани существующие спец-ветки**, если они всё ещё нужны:
   - `profile === "compact" && maxPrice` → `filterAffordableCompact`
   - `bodyType` без brand — как сейчас, но после intent enrichment
   - Fallback без явного intent: не только «самые дешёвые 120» — предпочти `diversifyByBrand` по всему каталогу, не sort-by-price-only (или документируй почему оставил)

4. **Экспорт для тестов (опционально):** если удобно — `export { pickCatalogForLlm }` или вынеси в `pickCatalogForLlm.ts` рядом с тестами. Не обязательно, если тестируешь через mock `completeDeepSeekChat` и проверку строки user prompt.

5. **Тесты** в `ai-api/src/llm/__tests__/llmCatalogRecommend.test.ts`:
   - Каталог: несколько KIA (дешёвые), 1–2 BMW (дороже, но ≤ 5 млн), EONIX (дешёвая).
   - Запрос «BMW до 5 млн» → в `completeDeepSeekChat` в user content **есть строки с BMW**, **нет** ситуации где только KIA/EONIX.
   - Запрос «KIA до 2 млн» → в prompt только KIA в разумном subset.
   - «машину на дачу» → subset с кроссоверами (если есть в фикстуре), EONIX по-прежнему вырезан (`eonixPolicy`).
   - Не ломай существующие тесты EONIX drop.

6. **Не трогай** без необходимости:
   - промпт system/user текст DeepSeek (кроме косвенного эффекта от subset)
   - `buildChatReply.ts` flow rules → LLM
   - мобильный клиент

### Ожидаемое поведение после фикса

| Запрос | Subset для LLM |
|--------|----------------|
| BMW до 5 млн | в основном BMW ≤ 5 млн |
| KIA до 2,5 млн | KIA ≤ бюджет |
| на дачу | кроссоверы (bodyType), без EONIX |
| размытый без марки | diversify по брендам, не только LADA с начала прайса |

### Проверка

```bash
cd ai-api && npm run typecheck
npm test -- --testPathPattern=llmCatalogRecommend --no-coverage
```

Ручная проверка (если ai-api запущен с DEEPSEEK_API_KEY):
```bash
curl -X POST http://localhost:8787/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"siteId":"indep","message":"BMW до 5 млн","selectedCount":0}'
```
В ответе `cars` должны быть BMW (если есть в каталоге indep.su).

### Отчёт в конце

- Какие файлы изменены
- Кратко: порядок веток в `pickCatalogForLlm`
- Результат тестов
- Остались ли edge cases (vague query без brand) — 1–2 предложения
```

---

## После выполнения

1. Перезапустить `ai-api` (`cd ai-api; npm run dev`).
2. Проверить в приложении: «BMW до 5 млн», «белджи», «на дачу».
3. При желании обновить `docs/AI-ROADMAP.md` — пункт F-08 / качество LLM subset.
