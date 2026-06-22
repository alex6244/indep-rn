# Промпт: senior code review ИИ-части indep-rn (v2)

Скопируйте блок **«Текст промпта»** ниже в **новый чат Cursor (Agent)** с открытым репозиторием `indep-rn`.

**Цель:** независимая сеньорская оценка модуля ИИ-подбора — архитектура, стиль кода, UX, безопасность, LLM, тесты, деплой, эксплуатация.  
**Режим:** только анализ. Не вноси правки в код в том же чате.

**Вне скоупа:** корпоративный Laravel (`indep.su/api/v1.0`), **CRM / интеграция лидов в CRM**, переписывание всего стека на Nest/LangChain без ROI.

---

## Контекст (для себя)

| Слой | Путь | Роль |
|------|------|------|
| Shared-логика | `packages/ai-core/` | intent, searchCatalog (F-09), rankCatalogByQuery, ruleBasedReply, mapBanner, eonixPolicy, brandAliases |
| BFF ИИ | `ai-api/` | Hono, каталог с `indep.su`, DeepSeek, auth, rate limit, leads (in-memory) |
| Мобилка | `src/features/aiPicker/` | UI, RTK Query, hooks, offline fallback, индикатор режима |
| Конфиг сайта | `src/data/ai/sites/*.json` | siteId, catalogBannersUrl |
| Seed-каталог | `src/data/ai/*.seed.json` | офлайн fallback |
| Env / EAS | `eas.json`, `ai-api/.env` | preview/production → `https://ai-api.n-avtosalon.ru` |
| Деплой | `docs/DEPLOY-AI-API-SELECTEL.md`, `ai-api/ecosystem.config.cjs` | VPS + nginx + **pm2** (`~/.npm-global/bin/pm2`) |

Поток данных:

```
Expo (aiPicker) → ai-api (ai-api.n-avtosalon.ru)
                      → indep.su/api/get-cars-to-banners (каталог ~248)
                      → DeepSeek API (текст / pick, если DEEPSEEK_API_KEY)
                      → indep.su/api/v1.0/me (auth, если AI_API_AUTH_REQUIRED)
```

**Известные ops-нюансы (проверь в коде/доках, не только в памяти):**
- pm2 не читает `.env` сам — нужен `dotenv` в `index.ts` и/или `source .env` + `pm2 start --update-env`
- `AI_API_ALLOW_MOCK_AUTH` — только demo/staging
- Лиды пока in-memory на ai-api (CRM не подключаем)

---

## Текст промпта (копировать отсюда)

```
Ты — senior fullstack (React Native / Expo, TypeScript, Node BFF, e-commerce/auto). Проведи **независимый code review ИИ-части** репозитория `indep-rn`. Пиши по-русски; термины TS/RN/API — на английском где уместно.

**Режим:** только анализ. Не вноси правки в код. Не предлагай «переписать всё» без обоснования ROI.

**Вне скоупа:** Laravel-бэкенд indep.su, **CRM для лидов**, миграция на K8s/Redis без обоснования.

---

### 1. Скоуп — что обязательно прочитать

**Shared (`packages/ai-core/src/`):**
- `parseUserIntent.ts`, `brandAliases.ts`, `normalizeSearchText.ts`
- `searchCatalog.ts`, `rankCatalogByQuery.ts`, `filterCatalog.ts` — что используется, что legacy?
- `ruleBasedReply.ts`, `mapBanner.ts`, `eonixPolicy.ts`, `resolveBrandFromCatalog.ts`
- `types.ts`, `index.ts` (публичный API пакета)
- `__tests__/` — покрытие и качество ассертов

**BFF (`ai-api/src/`):**
- `index.ts` — dotenv, health, CORS
- `routes/v1.ts` — meta, catalog, chat, leads, admin
- `chat/buildChatReply.ts` — порядок rules vs LLM
- `llm/deepseek.ts`, `llm/llmCatalogRecommend.ts`
- `catalog/catalogStore.ts`
- `middleware/` — cors, rateLimit, requireUserAuth (mock tokens), requestLimits, clientKey
- `lib/apiError.ts`, `lib/env.ts`
- `ai-api/.env.example`, `ai-api/README.md`, `ai-api/ecosystem.config.cjs`
- `ai-api/**/__tests__/`

**Мобилка (`src/features/aiPicker/`):**
- `ui/AiPickerScreen.tsx`, `ui/AiPickerLeadForm.tsx`, `ui/AiCarSuggestionCard.tsx`, `ui/aiPicker.styles.ts`
- `hooks/useAiPickerBootstrap.ts`, `useAiPickerChat.ts`, `useAiPickerLead.ts`, `aiPickerUtils.ts`
- `api/aiPickerApi.ts`, `api/resolveAiPickerRemoteError.ts`
- `catalog/aiCatalogService.ts`
- `src/app/ai-picker.tsx`
- `__tests__/` по hooks и api

**Конфиг и доки:**
- `src/data/ai/sites/indep.json`
- `eas.json` — preview / preview-mock / production env
- `package.json` — `start:demo`, `start:tunnel:demo`
- `docs/AI-ROADMAP.md`, `docs/DEMO.md`, `docs/DEPLOY-AI-API-SELECTEL.md`

**Связанное (кратко):**
- `src/contexts/AuthContext.tsx`, token storage — как токен попадает в ai-api
- Пункт меню «Подбор с ИИ», auth gate

---

### 2. Оси ревью (пройди все)

#### A. Архитектура и границы модулей
- Разделение `ai-core` / `ai-api` / `aiPicker`: дублирование, утечка абстракций
- Импорты ai-api → `../../../packages/ai-core` и `../../src/data/ai` — хрупкость при деплое (`AI_API_REPO_ROOT`)
- Поток chat: rules-first vs LLM-first — предсказуемость для продукта
- F-09 `searchCatalog` vs старый `filterCatalog` — мёртвый код, миграция завершена?
- Готовность к monobrand / второму siteId без копипасты

#### B. Стиль кода, оформление, консистентность
- Единый стиль: именование, экспорты, barrel `index.ts`, размер файлов
- TypeScript: `any`, неявные касты, дубли типов между ai-core и ai-api
- Импорты: порядок, `.js` суффиксы в ESM, import-after-code в `index.ts` (dotenv)
- React: hooks deps, `useCallback`/`useMemo` — оправданность
- Стили: `aiPicker.styles.ts` vs shared theme (`colors`, `spacing`) — консистентность, magic numbers
- Комментарии: полезные vs шум; self-documenting code
- Соответствие остальному репо (`src/features/*`) — читается как один проект?

#### C. API-контракты и ошибки
- Стабильность `/v1/chat`, `/v1/leads`, `/meta`, `/catalog`
- `apiError` на сервере vs `parseAiApiError` на клиенте
- 401 / 429 / 400 — обработка на клиенте, fallback local
- Поля `suggestLead`, `replySource`, `catalogSource` — используются или мёртвые

#### D. Безопасность
- `requireUserAuth`, mock tokens (`AI_API_ALLOW_MOCK_AUTH`) — риск на prod
- CORS, rate limit (in-memory), cost control DeepSeek
- `POST /v1/leads`: спам, PII в логах
- Секреты только на сервере; утечки в `EXPO_PUBLIC_*`

#### E. LLM (DeepSeek) и качество подбора
- Матрица: rules / searchCatalog / LLM pick / LLM rewrite
- Промпты, галлюцинации carIds, post-filter
- Таймауты, fallback, стоимость
- Тест-кейсы: «белджи», «KIA до 2,5 млн», «молодой девушке», «самая дешёвая», опечатки брендов

#### F. Каталог и данные
- Sync TTL, stale cache, seed fallback
- 248 машин — достаточно ли для search/LLM subset
- `mapBanner`, price_new/price_old, searchText

#### G. Мобильный UX и продукт
- Индикатор «Режим: сервер ИИ» / локально — понятность для пользователя и демо
- Состояния: loading, thinking, leadSent, ошибки сети
- Выбор авто + заявка: edge cases
- Web vs native parity
- Доступность (размер тач-таргетов, контраст)

#### H. Тесты и наблюдаемость
- Покрытие unit; пробелы integration/E2E
- `/health`: deepSeekConfigured, catalogAgeSec
- Логирование LLM failures, catalog refresh

#### I. DevOps и эксплуатация
- pm2 + `.env` + dotenv — воспроизводимый деплой
- `npm run smoke:deploy`
- EAS preview vs `start:demo` — расхождение env
- Диск VPS, ротация логов pm2

#### J. Плюсы и минусы (явная секция)
- **5 сильных сторон** с примерами файлов
- **5 слабых мест** / техдолг с приоритетом
- **Что бы ты оставил как есть** vs **что рефакторить в v2**

---

### 3. Формат ответа (строго)

#### Executive summary (5–8 предложений)
Вердикт: demo / internal preview / production. Главный риск. Оценка стиля кода (1–2 предложения).

#### Карта системы
Mermaid или ASCII: клиент → ai-api → каталог / LLM / auth.

#### Findings table

| ID | Severity | Область | Файл(ы) | Проблема | Рекомендация | Effort |
|----|----------|---------|---------|----------|--------------|--------|
| F-01 | P0/P1/P2 | … | `path` | … | … | S/M/L |

Severity:
- **P0** — блокер prod / утечка / спам / обход auth
- **P1** — заметный техдолг, баги edge cases, плохой DX
- **P2** — polish, стиль, тесты, доки

Минимум **15 findings** по всем осям, если код позволяет. Не выдумывай.

#### Code style scorecard (таблица)

| Критерий | Оценка 1–5 | Комментарий |
|----------|------------|-------------|
| Структура модулей | | |
| TypeScript strictness | | |
| Тестируемость | | |
| UI/стили aiPicker | | |
| Документация / README | | |
| Согласованность с монорепо | | |

#### Сильные стороны (3–5)
#### Слабые стороны (3–5)
#### Пробелы в тестах (конкретные сценарии + файл)

#### Roadmap без CRM (2 горизонта)
- **До demo (1–2 недели):** max 5 задач P0–P1 (лиды: email/webhook/dev-log OK, **не CRM**)
- **До production (1–2 месяца):** max 7 задач

#### Вопросы к команде (3–5)
Без CRM; про auth policy, monobrand, LLM budget, store release.

---

### 4. Запреты

- Не предлагай CRM в roadmap.
- Не переносить ai-api в Laravel без trade-off.
- Не критикуй отсутствие Redis/K8s без контекста MVP.
- Не пересказывай README — только выводы с путями.
- Файл не читал — напиши «не проверял».

---

### 5. Smoke (выполни если есть shell)

```bash
curl -s https://ai-api.n-avtosalon.ru/health

npm test -- --testPathPattern="ai-core|ai-api|aiPicker" --no-coverage
cd ai-api && npm run typecheck
```

Укажи в отчёте, что реально запускал.
```

---

## Что делать по ИИ без CRM (краткий план)

| # | Задача | Зачем |
|---|--------|--------|
| 1 | `git push` + `git pull` на VPS + `pm2 restart --update-env` | Код F-09, mock auth, dotenv на сервере |
| 2 | Прогнать demo: Expo `start:demo` + preview APK | Проверка end-to-end |
| 3 | Запустить этот промпт в новом чате | Список P0/P1 без CRM |
| 4 | Лиды: оставить dev-log / in-memory + понятное сообщение в чате | До появления CRM |
| 5 | Опционально: email/webhook для лидов (P1, не CRM) | Реальный канал для менеджера |
| 6 | `pm2 flush`, место на диске VPS | Стабильность |
| 7 | Ротация DeepSeek ключа | Безопасность |

---

## После ревью

1. P0 — отдельные PR до следующего demo.
2. Обновить `docs/AI-ROADMAP.md`.
3. Переиспользовать промпт после крупных изменений (search v2, auth, EAS production).
