# dealer-ai-api

Backend для ИИ-подбора (мобилка + сайт). Живёт в репозитории `indep-rn` в отдельной папке.

## Запуск

```bash
cd ai-api
cp .env.example .env
npm install
npm run dev
```

Проверка: http://localhost:8787/health

## Эндпоинты

| Метод | Путь | Назначение |
|-------|------|------------|
| GET | `/health` | статус + размер каталога |
| POST | `/v1/chat` | `{ siteId, message }` → `{ text, cars[] }` |
| POST | `/v1/leads` | `{ siteId, phone, carIds[] }` |

## Мобилка

В `.env` / `.env.local` проекта:

```env
EXPO_PUBLIC_AI_API_URL=http://localhost:8787
```

На реальном устройстве вместо `localhost` — IP компьютера в локальной сети.

EAS `preview` и `production` (`eas.json` → `build.*.env`) задают `EXPO_PUBLIC_AI_API_URL` для сборок с подбором ИИ.

## Staging deploy

Пошагово для **Selectel VPS**: [docs/DEPLOY-AI-API-SELECTEL.md](../docs/DEPLOY-AI-API-SELECTEL.md)

Минимальный чеклист перед preview/TestFlight:

1. Задеплойте `ai-api` на хост с HTTPS (Selectel VPS + nginx, или другой VPS).
2. Задайте env на сервере (см. `.env.example` в `ai-api/`).
3. На prod: `npm run start:prod` (или `pm2 start ai-api/ecosystem.config.cjs` из корня репо).
4. Обновите URL в `eas.json` → `EXPO_PUBLIC_AI_API_URL` (без trailing slash).

**После деплоя: smoke-deploy**

С сервера (ai-api должен быть запущен через pm2):

```bash
cd ai-api && npm run smoke:deploy
```

Скрипт проверяет наличие `packages/ai-core`, `src/data/ai/` и `GET /health` (`ok: true`, `catalogCount > 0`).

**Health-check:**

```bash
curl -sS https://<your-ai-api-host>/health
curl -sS https://<your-ai-api-host>/v1/sites/indep/meta
```

**Smoke lead:**

```bash
curl -sS -X POST https://<your-ai-api-host>/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"siteId":"indep","phone":"+79991234567","carIds":["test-id-1"]}'
```

Ожидание: HTTP 200, тело содержит `"ok":true` и `"message"`.

Целевой staging URL в репозитории: `https://ai-api.indep.su` — замените после фактического деплоя.

## Сейчас

- Каталог: `get-cars-to-banners` (indep.su) + fallback JSON из `../src/data/ai/`
- Ответы: **правила** из `packages/ai-core` (общий код с приложением)
- DeepSeek — `DEEPSEEK_API_KEY` в `.env` на сервере; машины из каталога (rules), текст от LLM; fallback на rules
- `GET /v1/leads` — только dev: `AI_API_DEV_LEADS=true` + заголовок `X-Dev-Key: <AI_API_DEV_KEY>`

## Защита от злоупотреблений

| Механизм | Env | Описание |
|----------|-----|----------|
| Rate limit | `AI_API_RATE_*_PER_MIN`, `AI_API_RATE_LIMIT_ENABLED` | In-memory лимит по IP; `429` + `rate_limited` |
| CORS whitelist | `AI_API_CORS_ORIGINS` | Только перечисленные Origin; без Origin (RN) — разрешено |
| Лимиты body | — | `message` ≤ 500 символов, `carIds` ≤ 20 |
| Client key | `AI_API_CLIENT_KEY` | Только для браузера с Origin из whitelist; заголовок `X-AI-Client-Key` |

`X-AI-Client-Key` **не** защищает мобилку (секрет в APK извлекается). Rate limit — основная защита.

## Auth: матрица приложение ↔ ai-api (F-06)

**Продуктовое решение:** ИИ-чат в приложении **только для залогиненных** — без входа в аккаунт запросы к ai-api не уходят (см. `buildAiAuthHeaders` в приложении).

Два независимых «замка»:

1. **Приложение** — есть ли токен в `tokenStorage`? Нет → «Войдите в аккаунт», сеть не дергается.
2. **ai-api** — если `AI_API_AUTH_REQUIRED=true`, токен проверяется через `GET /me` на indep.su. Mock-токен (`mock_…`) Laravel **не примет**.

Настройки **должны совпадать**. Иначе чат покажет 401, хотя сервер «живой».

### Таблица: что ставить

| Сценарий | Приложение (`.env`) | ai-api (`ai-api/.env`) | Вход в приложении |
|----------|---------------------|-------------------------|-------------------|
| **Local dev** (mock + localhost) | `EXPO_PUBLIC_AUTH_SOURCE=mock`<br>`EXPO_PUBLIC_AI_API_URL=http://localhost:8787` | `AI_API_AUTH_REQUIRED=false` | Да, mock-логин (любой тестовый пользователь) |
| **Staging / prod** (реальный JWT) | `EXPO_PUBLIC_AUTH_SOURCE=api`<br>`EXPO_PUBLIC_AI_API_URL=https://…` | `AI_API_AUTH_REQUIRED=true`<br>`AI_API_AUTH_ME_URL=https://indep.su/api/v1.0/me` | Да, OTP / API auth |
| **Demo на телефоне** (mock + prod ai-api) | `npm run start:demo` | `AI_API_AUTH_REQUIRED=true`<br>`AI_API_ALLOW_MOCK_AUTH=true`<br>`DEEPSEEK_API_KEY=…` | Mock: `client@test.com` / `client123` |
| **Офлайн-чат** (без ai-api) | `EXPO_PUBLIC_AI_API_URL=` (пусто) | ai-api не нужен | Не влияет на сервер |

Опционально для local dev, если ai-api падает:

```env
EXPO_PUBLIC_AI_API_FALLBACK_LOCAL=true
```

### Быстрый старт local (скопировать)

**Корень репо `.env`:**

```env
EXPO_PUBLIC_AUTH_SOURCE=mock
EXPO_PUBLIC_AI_API_URL=http://localhost:8787
```

**`ai-api/.env`:**

```env
AI_API_AUTH_REQUIRED=false
PORT=8787
```

Запуск: `cd ai-api && npm run dev`, в другом терминале `npx expo start`. В приложении — войти через mock.

### Если в чате «Войдите в аккаунт»

| Симптом | Причина | Что сделать |
|---------|---------|-------------|
| 401 сразу, запросов к ai-api нет | Не залогинен в приложении | Войти (mock или api) |
| 401 после запроса, mock + local ai-api | `AI_API_AUTH_REQUIRED=true`, mock-токен не проходит `/me` | `AI_API_AUTH_REQUIRED=false` в `ai-api/.env` и перезапуск |
| 401 на staging | `AUTH_SOURCE=api`, но токен протух / не тот API | Перелогиниться; проверить `AI_API_AUTH_ME_URL` |

### Переменные ai-api

| Env | Описание |
|-----|----------|
| `AI_API_AUTH_REQUIRED` | `true` в production по умолчанию; **`false` обязательно** для local dev с `AUTH_SOURCE=mock` |
| `AI_API_ALLOW_MOCK_AUTH` | `true` — принимать `mock_*` токены без `/me` (demo/staging) |
| `AI_API_AUTH_ME_URL` | Полный URL, напр. `https://indep.su/api/v1.0/me` |
| `AI_API_AUTH_API_BASE` | Альтернатива: база API + `/me` |
| `DEEPSEEK_API_KEY` | Без ключа — только rules, `deepSeekConfigured: false` в `/health` |

Без валидного токена (когда auth включён): `401` + `{ "error": { "code": "unauthorized", ... } }`.

### Проверка rate limit

```bash
# 31-й POST /v1/chat с одного IP → HTTP 429
for i in $(seq 1 31); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8787/v1/chat \
    -H "Content-Type: application/json" \
    -d '{"siteId":"indep","message":"test"}'
done
```
