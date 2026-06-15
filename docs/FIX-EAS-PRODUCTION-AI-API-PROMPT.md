# Промпт: EXPO_PUBLIC_AI_API_URL в production EAS (F-04 / store build)

Скопируйте блок **«Текст промпта»** ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

**Цель:** в production-сборке (`eas build --profile production`) подбор с ИИ должен ходить на тот же `ai-api`, что и `preview`. Сейчас URL есть только в `build.preview.env` — в `build.production.env` переменная отсутствует, `isAiPickerApiEnabled()` возвращает `false`, экран работает в офлайн-режиме (seed / rules без сервера).

| ID | Задача | Effort |
|----|--------|--------|
| F-04 | Добавить `EXPO_PUBLIC_AI_API_URL` в `eas.json` → `production` + выровнять demo-скрипты и доки | S |

---

## Контекст (для себя)

| Файл | Сейчас |
|------|--------|
| `eas.json` → `build.preview.env` | `EXPO_PUBLIC_AI_API_URL=https://ai-api.n-avtosalon.ru` ✅ |
| `eas.json` → `build.production.env` | **нет** `EXPO_PUBLIC_AI_API_URL` ❌ |
| `src/features/aiPicker/api/aiPickerEnv.ts` | `isAiPickerApiEnabled()` = URL не пустой |
| `package.json` → `start:demo` / `start:tunnel:demo` | нет `EXPO_PUBLIC_AI_API_URL` (в `docs/DEMO.md` описано иначе) |
| `ai-api/README.md` | упоминает только `preview` в EAS |
| Prod ai-api | `AI_API_AUTH_REQUIRED=true`, `AI_API_AUTH_ME_URL=https://indep.su/api/v1.0/me` — совместимо с `EXPO_PUBLIC_AUTH_SOURCE=api` в production |

**Поведение без URL:** bootstrap → `loadAiCatalogWithMeta` (прямой fetch баннеров или seed), чат → только `buildRuleBasedReply` на клиенте. Для store/release это неприемлемо.

**Вне скоупа:** F-02 (доставка лидов в CRM), смена домена ai-api, EAS Secrets вместо `eas.json`, `preview-mock` (там ИИ намеренно не нужен).

---

## Текст промпта (копировать отсюда)

```
Ты — senior TypeScript / React Native (Expo EAS) разработчик. Репозиторий: `indep-rn`. Исправь пропуск `EXPO_PUBLIC_AI_API_URL` в production-профиле EAS (finding F-04). Минимальный diff, без новых зависимостей.

---

### Проблема

`eas.json` → `build.production.env` не содержит `EXPO_PUBLIC_AI_API_URL`.
В `build.preview.env` уже задано:
`"EXPO_PUBLIC_AI_API_URL": "https://ai-api.n-avtosalon.ru"`

Без этой переменной в бандле production:
- `isAiPickerApiEnabled()` в `src/features/aiPicker/api/aiPickerEnv.ts` → `false`
- `useAiPickerBootstrap` не ходит на ai-api (meta/catalog/chat/leads)
- Пользователь store-сборки не получает ИИ с сервера

---

### Задача 1 — `eas.json` (главное)

В `eas.json` → `build.production.env` добавь:

```json
"EXPO_PUBLIC_AI_API_URL": "https://ai-api.n-avtosalon.ru"
```

Правила:
- URL **без** trailing slash (как в preview).
- Значение **то же**, что в `build.preview.env` (единый prod BFF).
- **Не** добавляй `EXPO_PUBLIC_AI_API_FALLBACK_LOCAL` в production/preview — только для локальной разработки.
- **Не** меняй `preview-mock` (mock-демо без ИИ — ок).

Убедись, что в production уже есть (не трогай без причины):
- `EXPO_PUBLIC_AUTH_SOURCE`: `"api"` — нужен для `requireUserAuth` на ai-api
- `EXPO_PUBLIC_CATALOG_SOURCE` / `REPORTS_SOURCE`: `"mock"` — отдельная тема, не меняй в этой задаче

---

### Задача 2 — demo-скрипты (согласованность с DEMO.md)

Файл: `package.json`

В `start:demo` и `start:tunnel:demo` добавь в `cross-env`:

```
EXPO_PUBLIC_AI_API_URL=https://ai-api.n-avtosalon.ru
```

Чтобы `npm run start:demo` реально включал ИИ без ручного `.env` (как обещано в `docs/DEMO.md`).

---

### Задача 3 — документация (кратко)

Обнови **только** нужные строки:

1. `ai-api/README.md` — в секции про EAS укажи, что URL задан в профилях **`preview` и `production`**, не только preview.

2. `docs/DEMO.md` — в блоке «Быстрый запуск» явно: `start:demo` теперь включает `EXPO_PUBLIC_AI_API_URL` (после правки package.json).

3. Опционально одна строка в `docs/AI-ROADMAP.md` — F-04 / production EAS env done.

Не пиши длинные новые доки.

---

### Задача 4 — проверка (опционально, если быстро)

Добавь лёгкий тест или скрипт **только если** в проекте уже есть паттерн для env/eas (иначе пропусти):

- Пример: `src/config/__tests__/easProductionEnv.test.ts` читает `eas.json` и assert:
  - `build.production.env.EXPO_PUBLIC_AI_API_URL === build.preview.env.EXPO_PUBLIC_AI_API_URL`
  - строка не пустая и начинается с `https://`

Не добавляй тяжёлый CI для EAS.

---

### Проверка вручную (описать в отчёте)

```bash
# JSON валиден
node -e "JSON.parse(require('fs').readFileSync('eas.json','utf8')); console.log('eas.json OK')"

# production env содержит URL
node -e "const e=require('./eas.json'); console.log(e.build.production.env.EXPO_PUBLIC_AI_API_URL)"

npm test -- --testPathPattern="easProduction|aiPicker" --no-coverage
```

После merge: следующий `eas build --profile production` подставит URL в бандл. Старые сборки без rebuild — не починятся.

**Сервер (напоминание в отчёте, не меняй на VPS):**
- `curl https://ai-api.n-avtosalon.ru/health` → `ok:true`
- На сервере: `AI_API_AUTH_REQUIRED=true`, `DEEPSEEK_API_KEY` для LLM

---

### Отчёт в конце

1. Список изменённых файлов
2. Diff `eas.json` production.env (до/после)
3. Как проверить на устройстве: вход по SMS → Подбор с ИИ → шапка «Каталог: с сайта (N)»
4. Что осталось вне скоупа (F-02 лиды, preview-mock)
```

---

## После выполнения

1. Закоммитить `eas.json` + `package.json` + доки.
2. Пересобрать: `eas build --profile production` (или `preview` для internal).
3. На телефоне: SMS-вход → бургер → **Подбор с ИИ** → запрос «KIA до 2,5 млн» → ответ с сервера.
4. Если 401 — проверить `AI_API_AUTH_ME_URL` на VPS и что пользователь залогинен через API, не mock.
