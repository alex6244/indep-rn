# Промпт: защита ai-api от злоупотреблений (без регистрации)

Скопируйте блок ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

Связано с аудитом: **P0 #2** (CORS) и **P0 #5** (нет rate limit / auth на публичных эндпоинтах).

---

## Что это за проблема (для себя)

ИИ-подбор **намеренно публичный** — логин не нужен. Но `POST /v1/chat` и `POST /v1/leads` сейчас **без лимитов**: любой, кто знает URL, может слать тысячи запросов (скрипт, чужой сайт через CORS, бот). Это не «взлом аккаунтов», а **спам и нагрузка** (позже — счёт за LLM). Регистрация пользователей **не обязательна**; нужны **rate limit + CORS + лимиты тела запроса**.

---

## Текст промпта (копировать отсюда)

```
Ты — senior TypeScript-разработчик. Защити `ai-api/` от злоупотреблений анонимными клиентами (мобилка, будущие монобренд-сайты, боты). Работай в `indep-rn`. Не трогай Laravel. Не переписывай проект на Nest. Минимальный diff, без новых тяжёлых зависимостей (Redis не обязателен — in-memory rate limit на MVP достаточно).

### Контекст
- `ai-api/src/index.ts` — CORS сейчас фактически открыт (`origin ?? "*"`).
- `ai-api/src/routes/v1.ts` — публичные `POST /v1/chat`, `POST /v1/leads`, `GET /v1/sites/:siteId/meta` без лимитов.
- Мобилка: `src/features/aiPicker/api/aiPickerApi.ts` — fetch на ai-api.
- Чат без логина — норма; задача не «ввести auth пользователя», а **ограничить злоупотребление**.

### Цели (обязательно)

#### 1. Rate limit по IP (in-memory)
- Новый модуль, например `ai-api/src/middleware/rateLimit.ts`.
- Лимиты через env (с разумными дефолтами для dev):
  - `AI_API_RATE_CHAT_PER_MIN` (default 30)
  - `AI_API_RATE_LEADS_PER_MIN` (default 10)
  - `AI_API_RATE_META_PER_MIN` (default 60)
- Применить к:
  - `POST /v1/chat`
  - `POST /v1/leads`
  - `GET /v1/sites/:siteId/meta` (легче, но тоже можно заспамить)
- Ответ при превышении: **HTTP 429**, JSON:
  `{ "error": { "code": "rate_limited", "message": "Слишком много запросов. Попробуйте позже." } }`
- IP: `x-forwarded-for` (первый адрес) или `x-real-ip`, иначе fallback (для Node adapter — что доступно в Hono context).
- В `NODE_ENV !== "production"` можно ослабить лимиты или отключать через `AI_API_RATE_LIMIT_ENABLED=false` (default true).

#### 2. CORS whitelist
- Env `AI_API_CORS_ORIGINS` — список через запятую, например:
  `http://localhost:8081,http://localhost:19006,https://indep.su`
- В production: **не** отражать произвольный `Origin`; только whitelist + запросы без Origin (мобилка/React Native часто без Origin — разрешить).
- В dev: если env пустой — разрешить localhost-порты Expo и `http://localhost:8787`.
- Обновить `ai-api/.env.example` и `ai-api/README.md`.

#### 3. Лимиты размера запроса (anti-spam)
В `v1.ts` до бизнес-логики:
- `message`: trim, max 500 символов (иначе 400 `message_too_long`)
- `carIds`: max 20 элементов (иначе 400)
- `phone`: уже нормализуется — отклонять слишком длинные строки до normalize

#### 4. Опциональный client key (только для партнёров, не панацея)
- Env `AI_API_CLIENT_KEY` (опционально).
- Если задан на сервере: требовать заголовок `X-AI-Client-Key` на `POST /chat` и `POST /v1/leads` **только когда** запрос пришёл с браузерного Origin из whitelist (защита виджетов на сайтах).
- Запросы **без** Origin (типичная RN fetch) — **не** требовать ключ (ключ в APK всё равно извлекают).
- Документировать в README: ключ не заменяет rate limit.

#### 5. Мобилка (минимально)
- Если в будущем понадобится — только документировать; **не** класть секрет в `EXPO_PUBLIC_*` как обязательный шаг.
- При ошибке 429 в `aiPickerApi.ts` — понятное сообщение пользователю («Слишком много сообщений, подождите»), не generic HTTP error.

#### 6. Тесты
- Unit-тесты на rate limit helper (сброс окна, 429 после N запросов) — Jest в корне или отдельный минимальный test в `ai-api` если проще через extract pure functions.
- Хотя бы 3–5 тест-кейсов.

#### 7. Проверки
- `npm run typecheck --prefix ai-api`
- `npm run typecheck`
- `npm test` (корень)

### Формат отчёта
- Список изменённых файлов
- Таблица env-переменных
- Как проверить вручную (curl: 31-й запрос chat → 429)
- Что **не** решено (нужен Redis/WAF на высокой нагрузке) — одним абзацем

### Ограничения
- Не добавлять регистрацию пользователей в ai-api.
- Не ломать текущий dev-flow: `npm run dev` в ai-api + мобилка с `EXPO_PUBLIC_AI_API_URL`.
- Не менять контракт успешных ответов chat/leads (только новые коды ошибок).
```

---

## Короткая версия

```txt
Защити ai-api от анонимного спама: in-memory rate limit по IP на POST /v1/chat, /v1/leads, GET meta (429 rate_limited); CORS whitelist из AI_API_CORS_ORIGINS (+ RN без Origin); лимиты длины message и carIds; опционально X-AI-Client-Key для browser Origin. Обнови README/.env.example, 429 в aiPickerApi, тесты на limiter. typecheck + npm test.
```

---

## Связь с аудитом

| Пункт аудита | Суть |
|--------------|------|
| **P0 #5** | Нет rate limit и auth на публичных POST — боты и анонимы могут «издеваться» над API |
| **P0 #2** | CORS `*` — чужой сайт в браузере может слать запросы к вашему API |

После этого промпта закрываются оба для типичного MVP; полноценный WAF/Redis — позже при росте трафика.
