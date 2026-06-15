# Демо для босса (2–3 минуты)

Показать **рабочий сценарий**: вход **mock** (без SMS), каталог и отчёты — **mock**, ИИ — прод `ai-api` с локальным fallback при 401.

## Быстрый запуск (рекомендуется)

Один раз перед показом:

```bash
npm install
npm run start:demo
```

Скрипт `start:demo` выставляет mock-вход, prod URL ИИ и `EXPO_PUBLIC_AI_API_FALLBACK_LOCAL=true` (отдельный `.env` не нужен).

**Тестовый вход (mock):** `client@test.com` / `client123` или `picker@test.com` / `picker123` (см. `src/data/users.ts`).

Показ с телефона босса в той же Wi‑Fi сети:

```bash
npm run start:tunnel:demo
```

Откройте QR в Expo Go.

## Альтернатива: файл `.env`

Скопируйте `.env.example` → `.env` и проверьте:

```env
EXPO_PUBLIC_API_URL=https://indep.su/api/v1.0
EXPO_PUBLIC_AUTH_SOURCE=mock
EXPO_PUBLIC_CATALOG_SOURCE=mock
EXPO_PUBLIC_REPORTS_SOURCE=mock
EXPO_PUBLIC_ALLOW_HTTP_DEV=false
EXPO_PUBLIC_AI_API_URL=https://ai-api.n-avtosalon.ru
EXPO_PUBLIC_AI_API_FALLBACK_LOCAL=true
```

Запуск:

```bash
npx expo start
```

> Не используйте только `npm run start:catalog:mock` — он меняет **только** каталог. Для демо нужен полный `start:demo` или те же переменные, что в нём.

## Сценарий на встрече (что нажимать и что сказать)

**Главный сценарий для демо ИИ (2–3 мин):** mock-вход → бургер → **Подбор с ИИ** → запрос («белджи», «KIA до 2,5 млн») → выбрать авто → телефон → заявка. Нужен `EXPO_PUBLIC_AI_API_URL=https://ai-api.n-avtosalon.ru`; при mock-токене prod ai-api может отдать 401 — тогда сработает локальный fallback (правила + seed-каталог).

| # | Действие | Что сказать боссу (кратко) |
|---|----------|----------------------------|
| 1 | Вход mock (`client@test.com` / `client123`) | «Для демо без SMS; в проде — OTP по телефону.» |
| 0 | Бургер → **Подбор с ИИ** → запрос → выбор авто → телефон | «ИИ подбирает новые авто из каталога дилера, заявка уходит менеджеру. Только для авторизованных.» |
| 2 | Главная → **Перейти в каталог** (или таб «Каталог») → фильтр → тап по карточке | «Каталог с фильтрами, карточка авто с деталями.» |
| 3 | Сердечко на авто → бургер → **Избранное** | «Избранное сохраняется в профиле.» |
| 4 | На карточке авто → **Рассчитать в кредит** → слайдеры → отправить | «Заявка на кредит уходит, пользователь видит подтверждение.» |
| 5 | Профиль → баннер отчётов / **Купить отчёт** | «Покупка пакета отчётов — модалка с тарифами.» |

**Профиль подборщика:** отдельный сценарий — статистика, баланс, отчёты; для клиентского демо достаточно таблицы выше.

Перед встречей **один раз** пройдите шаги 1–5 сами и убедитесь, что нет красных экранов.

## Чего не показывать

- Таб **Звонки** (скрыт).
- Пункт **Сотрудничество** в бургер-меню (убран).
- Не включать `EXPO_PUBLIC_CATALOG_SOURCE=api`, пока на бэке не работает `GET /cars`.

## Включить полный ИИ на телефоне (248 + DeepSeek)

Два блокера: **нет ключа DeepSeek на VPS** и **mock-токен → 401 на ai-api**.

### 1. На VPS (`ai-api/.env`)

```env
DEEPSEEK_API_KEY=sk-...
AI_API_AUTH_REQUIRED=true
AI_API_AUTH_ME_URL=https://indep.su/api/v1.0/me
AI_API_ALLOW_MOCK_AUTH=true
```

`AI_API_ALLOW_MOCK_AUTH` — чтобы `start:demo` + mock-логин (`client@test.com`) проходил на prod ai-api. **Только для demo/staging**, не оставлять на боевом без необходимости.

Перезапуск:

```bash
cd ~/indep-rn/ai-api && npm install && pm2 restart ai-api
```

Проверка:

```bash
curl -s https://ai-api.n-avtosalon.ru/health
# deepSeekConfigured: true, catalogCount: 248
```

### 2. На ноутбуке

```bash
npm run start:demo
```

Вход mock → «Подбор с ИИ». В шапке **«Каталог: с сайта (248)»**. В Metro: `[ai-picker][chat] replySource: llm` (если DeepSeek ответил).

### Альтернатива без mock на сервере

`EXPO_PUBLIC_AUTH_SOURCE=api` + вход по SMS (скрипт без mock — правьте `.env` или используйте EAS preview).

## Если что-то сломалось

| Проблема | Что сделать |
|----------|-------------|
| SMS / вход не нужен (mock) | `client@test.com` / `client123` |
| Пустой каталог | Проверить `CATALOG_SOURCE=mock` и перезапуск `npm run start:demo` |
| ИИ offline / «Каталог: с сайта (0)» | Проверить `EXPO_PUBLIC_AI_API_URL` и `curl https://ai-api.n-avtosalon.ru/health` |
| «API URL not configured» | Запускать `start:demo`, не голый `expo start` без `.env` |

## Когда бэк догонит

По мере готовности эндпоинтов меняйте в `.env` или в `eas.json`:

- `EXPO_PUBLIC_CATALOG_SOURCE=api` — когда живой каталог.
- `EXPO_PUBLIC_REPORTS_SOURCE=api` — когда отчёты и оплата на API.

После каждого переключения — тот же сценарий 1–5 на staging/production сборке.
