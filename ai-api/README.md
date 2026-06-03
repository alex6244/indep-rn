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

## Сейчас

- Каталог: `get-cars-to-banners` (indep.su) + fallback JSON из `../src/data/ai/`
- Ответы: **правила** из `packages/ai-core` (общий код с приложением)
- DeepSeek — позже через `DEEPSEEK_API_KEY`
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
