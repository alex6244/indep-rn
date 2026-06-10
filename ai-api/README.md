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

EAS preview (`eas.json` → `build.preview.env`) задаёт `EXPO_PUBLIC_AI_API_URL` для internal-сборок.

## Staging deploy

Пошагово для **Selectel VPS**: [docs/DEPLOY-AI-API-SELECTEL.md](../docs/DEPLOY-AI-API-SELECTEL.md)

Минимальный чеклист перед preview/TestFlight:

1. Задеплойте `ai-api` на хост с HTTPS (Selectel VPS + nginx, или другой VPS).
2. Задайте env на сервере (см. `.env.example` в `ai-api/`).
3. На prod: `npm run start:prod` (или `pm2 start ai-api/ecosystem.config.cjs` из корня репо).
4. Обновите URL в `eas.json` → `EXPO_PUBLIC_AI_API_URL` (без trailing slash).

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

### Проверка rate limit

```bash
# 31-й POST /v1/chat с одного IP → HTTP 429
for i in $(seq 1 31); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8787/v1/chat \
    -H "Content-Type: application/json" \
    -d '{"siteId":"indep","message":"test"}'
done
```
