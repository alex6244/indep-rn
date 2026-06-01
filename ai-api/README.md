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
