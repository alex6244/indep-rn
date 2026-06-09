# Промпт: AI Phase0, День 1–3 (leadSent + staging + EAS + индикатор)

Скопируйте блок ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

Фокус: быстрый прод-качественный v1 для demo/preview, без изменений контрактов Laravel.

---

## Контекст

- Приложение: `indep-rn`, экран `/ai-picker` (файл `src/features/aiPicker/ui/AiPickerScreen.tsx`)
- BFF ИИ: `ai-api/` (Hono), endpoints:
  - `GET /v1/sites/:siteId/meta`
  - `POST /v1/chat`
  - `POST /v1/leads`
- Каталог в чате может быть из `api` или `seed`, в коде это `catalogSource: "api" | "seed"`.

---

## День 1–2

### 1) (0.1) Исправь `leadSent` так, чтобы он становился `true` только при реальной успешной отправке лида

**Проблема в коде:**
В `src/features/aiPicker/ui/AiPickerScreen.tsx` функция `submitLead()` сейчас делает:
- отправляет lead на `ai-api` через `aiPickerApi.endpoints.sendAiLead`
- в `catch` может выставить текст ошибки (например, что заявка не отправлена)
- но затем всё равно выполняется `setLeadSent(true)` вне веток try/catch

Из-за этого UI воспринимает ошибку как успех: исчезает форма заявки, и повторить отправку нельзя.

**Требования:**
1. `setLeadSent(true)` должен выполняться:
   - если `useRemoteApi === true` и `sendAiLead(...).unwrap()` завершился успешно
   - или если `useRemoteApi === false` (dev/local offline) и заявка считается «принятой» локально (как сейчас)
2. При ошибке отправки на remote:
   - добавь в чат сообщение с понятным текстом (как сейчас: `${AI_PICKER_SERVER_UNAVAILABLE_MESSAGE} ...` или текст от RTK при наличии)
   - **НЕ** делай `setLeadSent(true)` (форма заявки должна оставаться доступной)
3. Добавь защиту от двойного клика/двух in-flight запросов (минимально):
   - введи локальный state `leadSubmitting` (boolean)
   - отключай кнопку `Отправить заявку`, пока `leadSubmitting === true`
   - `leadSubmitting` возвращается в `false` в `finally`
4. Никаких изменений API/контрактов `ai-api`.

**Где править:**
- `src/features/aiPicker/ui/AiPickerScreen.tsx`

---

### 2) (0.2) Деплой `ai-api` на staging и проверь `GET /meta` и `POST /leads`

**Требования:**
1. Разверни `ai-api` на staging (куда именно — ваш текущий процесс деплоя).
2. У staging должен быть стабильный base URL, например:
   - `https://<ai-api-staging-host>/v1/...`
3. После деплоя выполни проверку доступности:
   - `GET {base}/v1/sites/indep/meta` → 200
   - `POST {base}/v1/leads` с валидным телом → 200 и ответ содержит `{ ok: true, message }`
4. Убедись, что ошибки и 429 отдаётся корректно (минимум один тест на 429 при необходимости).

**Что сделать в репозитории:**
- Если в `ai-api/README.md` нет явной секции про staging/deploy, добавь короткий раздел `Staging deploy`:
  - как запустить
  - где задаются env переменные
  - какая health-check ссылка

---

### 3) (0.3) Добавь `EXPO_PUBLIC_AI_API_URL` в EAS env (preview/internal), чтобы телефон брал staging

**Проблема:**
В `eas.json` есть env для `EXPO_PUBLIC_API_URL`, auth/catalog/reports source, но нет `EXPO_PUBLIC_AI_API_URL`.

**Требования:**
1. Добавь `EXPO_PUBLIC_AI_API_URL` в минимум один профиль EAS, который вы используете для preview/internal testing:
   - предпочтительно `build.preview.env`
2. Значение:
   - используй staging base URL, полученный в шаге 0.2 (без trailing slash)
3. Обнови `.env.example` (корень проекта) чтобы переменная появилась у разработчиков локально:
   - `EXPO_PUBLIC_AI_API_URL=<your-url>`
4. Никаких новых зависимостей.

**Где править:**
- `eas.json`
- `.env.example`

---

## День 3

### 4) (0.4) Индикатор источника каталога (с сайта/офлайн) + полировка текста

**В коде уже есть попытка:**
`AiPickerScreen` выводит в header subtitle:
`{catalog.length} в каталоге (с сайта|офлайн)` на основе `catalogSource`.

**Доработай под требования:**
1. Убедись, что индикатор:
   - показывает `с сайта` когда `catalogSource === "api"`
   - показывает `офлайн` когда `catalogSource === "seed"`
2. Убедись, что индикатор появляется и при ситуации, когда:
   - remote включен, но `/meta` не удалось (fallback на seed или api-catalog fetch)
3. Текст UX:
   - формат понятный: `Каталог: с сайта (N) / офлайн (N)` (можно сохранить текущий дизайн, но сделай явно)

---

### 5) (0.4) Ручной smoke (обязателен) — 3 сценария

Сделай и зафиксируй:
1. Staging доступен:
   - открыть `/ai-picker`
   - убедиться, что показан индикатор каталога (с сайта или офлайн)
   - выбрать 1–3 авто
   - ввести телефон
   - нажать «Отправить заявку»
   - ожидаемо: форма исчезает, в чат приходит success message
2. Staging недоступен:
   - временно выключить `ai-api` на staging или указать неверный `EXPO_PUBLIC_AI_API_URL`
   - повторить отправку заявки
   - ожидаемо: форма НЕ исчезает, появляется сообщение «Заявка не отправлена»
3. Проверка 429 (опционально, если успеешь):
   - быстро отправить много сообщений
   - ожидаемо: показывается `AI_PICKER_RATE_LIMIT_MESSAGE`, и чат не падает

---

## Ограничения

- Не меняй контракт сообщений чат/лиды на клиенте и на сервере.
- Не трогай Laravel.
- Не подключай DeepSeek/LLM на этом шаге.
- Минимальный diff.

---

## Проверки (после правок)

В корне:
```bash
npm run typecheck
npm test
```

Дополнительно (если уместно для ai-api):
```bash
npm run typecheck --prefix ai-api
```

---

## Формат отчёта агента

1. Какие файлы изменены (список).
2. Что именно поменялось по `leadSent` (1–2 пункта).
3. Где теперь задаётся `EXPO_PUBLIC_AI_API_URL` (eas.json + .env.example).
4. Ссылки/команды для staging health-check и 2 endpoint smoke.
5. Результат ручного smoke (как в разделе День 3, пункты 1–2–3).

