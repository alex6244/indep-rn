# Промпт: senior code review ИИ-части indep-rn

Скопируйте блок **«Текст промпта»** ниже в **новый чат Cursor (Agent)** с открытым репозиторием `indep-rn`.

**Цель:** независимая сеньорская оценка модуля ИИ-подбора — архитектура, безопасность, продукт, LLM, тесты, деплой.  
**Не смешивать** с правками кода в том же чате — только анализ, риски и приоритеты.

**Вне скоупа:** корпоративный Laravel (`indep.su/api/v1.0`), CRM, переписывание всего стека на Nest/LangChain без ROI.

---

## Контекст (для себя)

| Слой | Путь | Роль |
|------|------|------|
| Shared-логика | `packages/ai-core/` | intent, фильтр каталога, rule-based ответы, mapBanner, eonixPolicy |
| BFF ИИ | `ai-api/` | Hono, каталог с `indep.su`, DeepSeek, auth, rate limit, leads |
| Мобилка | `src/features/aiPicker/` | UI, RTK Query, hooks, offline fallback |
| Конфиг сайта | `src/data/ai/sites/*.json` | siteId, catalogBannersUrl |
| Seed-каталог | `src/data/ai/*.seed.json` | офлайн fallback |
| Маршрут | `src/app/ai-picker.tsx` | экран без бизнес-логики |
| Env | `EXPO_PUBLIC_AI_API_URL`, `ai-api/.env` | локал / staging / prod |
| Деплой | `docs/DEPLOY-AI-API-SELECTEL.md`, `ai-api/ecosystem.config.cjs` | VPS + nginx + pm2 |

Поток данных:

```
Expo (aiPicker) → ai-api (localhost / ai-api.n-avtosalon.ru)
                      → indep.su/api/get-cars-to-banners (каталог)
                      → DeepSeek API (подбор + текст, если ключ есть)
                      → indep.su/api/v1.0/me (auth, если AI_API_AUTH_REQUIRED)
```

---

## Текст промпта (копировать отсюда)

```
Ты — senior fullstack (React Native / Expo, TypeScript, Node BFF, e-commerce/auto). Проведи **независимый code review ИИ-части** репозитория `indep-rn`. Пиши по-русски; термины TS/RN/API — на английском где уместно.

**Режим:** только анализ. Не вноси правки в код. Не предлагай «переписать всё» без обоснования ROI.

---

### 1. Скоуп — что обязательно прочитать

**Shared:**
- `packages/ai-core/src/` — parseUserIntent, filterCatalog, ruleBasedReply, mapBanner, eonixPolicy, types
- `packages/ai-core/src/__tests__/`

**BFF:**
- `ai-api/src/index.ts` — CORS, health, dotenv
- `ai-api/src/routes/v1.ts` — meta, catalog, chat, leads
- `ai-api/src/chat/buildChatReply.ts` — rules → LLM fallback
- `ai-api/src/llm/` — deepseek, llmCatalogRecommend
- `ai-api/src/catalog/catalogStore.ts` — sync, TTL, seed fallback
- `ai-api/src/middleware/` — cors, rateLimit, requireUserAuth, requestLimits, clientKey
- `ai-api/src/lib/` — apiError, env
- `ai-api/.env.example`, `ai-api/README.md`
- `ai-api/src/**/__tests__/`

**Мобилка:**
- `src/features/aiPicker/ui/AiPickerScreen.tsx`
- `src/features/aiPicker/hooks/` — bootstrap, chat, lead
- `src/features/aiPicker/api/` — aiPickerApi (RTK Query), auth headers, errors
- `src/features/aiPicker/catalog/aiCatalogService.ts`
- `src/app/ai-picker.tsx`
- `src/features/aiPicker/**/__tests__/`

**Конфиг и доки:**
- `src/data/ai/sites/indep.json`
- `eas.json` → EXPO_PUBLIC_AI_API_URL
- `docs/AI-ROADMAP.md`, `docs/DEMO.md`, `docs/DEPLOY-AI-API-SELECTEL.md`

**Связанное (кратко):**
- `src/contexts/AuthContext.tsx`, `src/services/api/tokenStorage.ts` — как токен попадает в ai-api
- `src/shared/config/` — пункт меню «Подбор с ИИ», auth gate если есть

---

### 2. Оси ревью (пройди все)

#### A. Архитектура и границы модулей
- Разделение `ai-core` / `ai-api` / `aiPicker`: нет ли дублирования (mapBanner, parseUserIntent, ruleBasedReply)?
- Правильно ли BFF отделён от мобилки? Можно ли переиспользовать ai-api для веб-виджета дилера?
- Зависимости: ai-api тянет `packages/ai-core` и `src/data/ai` через относительные пути — хрупкость при деплое?
- Single responsibility: AiPickerScreen, hooks, RTK endpoints — размер и coupling.
- Offline / remote: `useRemoteApi`, `isAiPickerLocalFallbackEnabled`, seed — согласованность поведения.

#### B. API-контракты и ошибки
- Формат ответов `/v1/chat`, `/v1/leads`, `/meta`, `/catalog` — стабильность для клиента.
- Единый формат ошибок (`apiError`) vs что парсит `aiPickerApi.parseAiApiError`.
- Коды: 401 unauthorized, 429 rate limit, 400 validation — покрыты ли на клиенте?
- `suggestLead`, `replySource`, `catalogSource` — используются ли на клиенте или мёртвые поля?
- Версионирование `/v1` — готовность к breaking changes.

#### C. Безопасность
- `requireUserAuth` + `AI_API_AUTH_ME_URL`: обход через curl, mock-токены в dev.
- CORS: web Expo (`localhost:8081`) vs RN (без Origin) vs prod nginx.
- Rate limit: in-memory, обход с разных IP, достаточно ли для DeepSeek cost control.
- `POST /v1/leads`: спам, валидация phone/carIds, PII в логах.
- Секреты: `DEEPSEEK_API_KEY` только на сервере? Утечки в клиентский bundle?
- `AI_API_DEV_LEADS`, admin refresh — не открыты ли в prod.

#### D. LLM (DeepSeek) и качество подбора
- Когда rules vs LLM vs LLM catalog pick — понятная и предсказуемая матрица?
- Промпты: галлюцинации, carIds не из каталога, post-filter.
- Таймауты, fallback при ошибке API, стоимость токенов.
- Бизнес-правила вроде `eonixPolicy` — достаточно ли или нужен общий механизм «brand tiers»?
- Качество на запросах: «на дачу», «семейный», «KIA до 2,5 млн», «самая дешевая» — оцени ожидаемое поведение по коду.

#### E. Каталог и данные
- Источник `get-cars-to-banners`: price_new/price_old, актуальность, TTL кэша.
- Поведение при падении indep.su: stale cache vs seed.
- 248 машин в LLM subset — риск пропустить релевантные модели.
- Монобренд-сайты: `fixedBrand`, конфиги в `src/data/ai/sites/`.

#### F. Мобильный UX и продукт
- Auth gate: можно ли открыть `/ai-picker` без логина; сообщения об ошибках («Failed to fetch» vs человекочитаемые).
- Состояния: catalogLoading, thinking, leadSent, apiServerWarning.
- Выбор авто + заявка: happy path и edge cases (0 выбранных, повторная заявка).
- Цены «от», зачёркнутая priceWas — корректность и disclaimer.
- Доступность, web vs native parity.

#### G. Тесты и наблюдаемость
- Покрытие: ai-core, ai-api middleware, RTK auth headers, ruleBasedReply.
- Чего не хватает: интеграционные тесты chat E2E, contract tests ai-api.
- Логирование: catalog refresh, LLM failures, lead submissions.
- `/health`: deepSeekConfigured, catalogAgeSec — достаточно для алертов?

#### H. DevOps и эксплуатация
- Локальный dev: dotenv, `AI_API_AUTH_REQUIRED=false`, CORS Authorization.
- Prod: pm2, nginx, `AI_API_REPO_ROOT`, 502 при падении процесса.
- EAS preview env vs `.env` разработчика.
- Чеклист перед демо из `docs/DEMO.md` — что реально работает сейчас.

---

### 3. Формат ответа (строго)

#### Executive summary (5–8 предложений)
Вердикт: готовность к demo / internal preview / production. Главный риск.

#### Карта системы
Короткая схема (mermaid или ASCII): клиент → ai-api → каталог / LLM / auth.

#### Findings table

| ID | Severity | Область | Файл(ы) | Проблема | Рекомендация | Effort |
|----|----------|---------|---------|----------|--------------|--------|
| F-01 | P0/P1/P2 | Security / … | `path` | … | … | S/M/L |

Severity:
- **P0** — блокер prod / утечка / спам / обход auth / потеря лидов
- **P1** — заметный техдолг, баги на edge cases, плохой DX
- **P2** — polish, тесты, доки

Минимум **12 findings**, если код позволяет; не выдумывай проблемы ради количества.

#### Сильные стороны (3–5 пунктов)
Что сделано зрело.

#### Пробелы в тестах
Конкретные сценарии + предложенный файл теста.

#### Roadmap (2 горизонта)
- **До demo (1–2 недели):** max 5 задач, только P0–P1
- **До production (1–2 месяца):** max 7 задач

#### Вопросы к команде
3–5 вопросов, без ответа на которые нельзя принять решение (CRM лидов, auth policy, monobrand и т.д.).

---

### 4. Запреты

- Не предлагай переносить ai-api в Laravel без явного trade-off.
- Не критикуй отсутствие Redis/K8s, если in-memory MVP обоснован.
- Не раздувай отчёт пересказом README — только выводы с путями к файлам.
- Если файл не читал — не делай вид, что читал; напиши «не проверял».

---

### 5. Быстрые smoke-команды (выполни если есть shell)

```bash
curl -s http://localhost:8787/health
# или staging:
curl -s https://ai-api.n-avtosalon.ru/health

npm test -- --testPathPattern="ai-core|ai-api|aiPicker" --no-coverage
```

Укажи в отчёте, что реально запускал.
```

---

## После ревью

1. P0 — отдельные задачи / PR до следующего demo.
2. Обновить `docs/AI-ROADMAP.md` по итогам (статус, новые пункты).
3. Промпт можно переиспользовать после крупных изменений (DeepSeek, CRM лидов, monobrand).
