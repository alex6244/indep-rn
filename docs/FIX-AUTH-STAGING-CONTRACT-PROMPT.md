# Промпт: staging contract test для OTP auth

Скопируйте блок ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

Связано с: `docs/AUTH-QA-CHECKLIST.md` §3–4, чеклист auth/security (unit-тесты ≠ живой API).

---

## Что это за проблема (для себя)

Сейчас `authService.test.ts` и `reportsService.contract.test.ts` **мокают** `api.post` / `api.get`. Они проверяют логику клиента при _предполагаемых_ ответах, но **не** то, что реальный Laravel/staging (`https://indep.su/api/v1.0`) отвечает так, как ждёт приложение.

Итог: CI зелёный, а на staging ломается вход, `confirm` без токена, `me()` 401 после перезапуска, несовпадение envelope / legacy полей (`api_token`, snake_case, `realtor`).

Нужен **отдельный opt-in suite** против живого API, не в каждом PR.

---

## Текст промпта (копировать отсюда)

```
Ты — senior TypeScript-разработчик. Добавь **staging contract test** для OTP auth в `indep-rn`: цепочка `POST /auth/request-verification` → `POST /auth/confirm-verification` → `GET /me` против реального API (staging/prod URL из env). Работай минимальным diff. Не трогай Laravel. Не ломай существующие unit-тесты с моками.

### Контекст (прочитай перед правками)
- Клиент: `src/services/authService.ts` — `requestVerification`, `confirmVerification`, `me`.
- HTTP: `src/services/api.ts` — base URL `EXPO_PUBLIC_API_URL` (сейчас `https://indep.su/api/v1.0`), envelope `{ data }` / `{ error: { code, message } }`, legacy Laravel поля.
- Unit-тесты (моки): `src/services/__tests__/authService.test.ts` — **оставить как есть**, не переименовывать в «contract».
- QA-чеклист: `docs/AUTH-QA-CHECKLIST.md` — после реализации обновить §3 (отметить контрактный suite).
- `reportsService.contract.test.ts` — тоже с моками; **не** копировать его паттерн для staging.

### Проблема, которую решаем
Unit-тесты не ловят расхождение FE/BE: другой JSON, другой путь, нет токена в confirm, `me` не принимает выданный токен, смена роли `realtor`/`picker`. Нужен один детерминированный smoke против живого API.

### Цели (обязательно)

#### 1. Отдельный suite (не смешивать с unit)
Создай один из вариантов (выбери лучший для Jest + RN, без тяжёлых зависимостей):
- **Предпочтительно:** `src/services/__tests__/authService.staging.contract.test.ts`
- **Альтернатива:** `scripts/contract-auth.mjs` + npm script `test:contract:auth`

Требования к suite:
- Файл/паттерн **исключён** из обычного `npm test` (через `testPathIgnorePatterns` или отдельный `testMatch` / npm script).
- Запуск только явно: `CONTRACT_TEST=1 npm run test:contract:auth` (добавь script в `package.json`).
- В начале файла: если `process.env.CONTRACT_TEST !== "1"` → `describe.skip` или ранний exit с понятным сообщением.
- Таймаут теста ≥ 60s (сеть + почта).

#### 2. Env для контракта (документировать в `.env.example` и коротком `docs/AUTH-CONTRACT-TEST.md`)
| Переменная | Назначение |
|------------|------------|
| `CONTRACT_TEST` | `1` — включить suite |
| `CONTRACT_API_URL` | Base URL API (default: `https://indep.su/api/v1.0`) |
| `CONTRACT_AUTH_EMAIL` | Тестовый email на staging (обязателен) |
| `CONTRACT_AUTH_OTP` | **Опция A:** фиксированный OTP на staging (если бэк даёт test bypass) |
| `CONTRACT_AUTH_OTP_PROVIDER` | **Опция B:** `manual` \| `env` — откуда брать код |
| `CONTRACT_AUTH_NAME` | Имя для register-flow (optional) |
| `CONTRACT_AUTH_ROLE` | `client` \| `picker` (optional, default client) |

**Не коммитить** реальные email/OTP в git. В CI — только secrets / manual workflow.

#### 3. Механизм OTP (реализуй с graceful skip)
Поддержи минимум **два** режима (чтобы suite не был мёртвым без договорённости с бэком):

**Режим `env` (предпочтительный для CI):**
- Если задан `CONTRACT_AUTH_OTP` — использовать его после `requestVerification`.
- Если не задан — `test.skip` с текстом: «Set CONTRACT_AUTH_OTP or enable staging test bypass».

**Режим `manual` (локально):**
- После request вывести в stderr: «Введите OTP из письма и задайте CONTRACT_AUTH_OTP=…», затем skip или retry hook — **не** блокировать CI интерактивом.

**Опционально (если бэк подтвердит):** документировать webhook/Mailhog — но **не** внедрять без URL в env.

#### 4. Сценарии контракта (happy path + минимум негатива)
Используй **реальный fetch** к `CONTRACT_API_URL` (можно тонкий helper `contractFetch.ts` в `src/services/__tests__/helpers/` или прямой fetch без мока `api` — главное не jest.mock("../api")).

**Happy path (обязательно):**
1. `POST {base}/auth/request-verification` body `{ email }` (+ name/role если register) → ожидание 2xx, тело не пустое (зафиксировать фактическую форму в assert: `message` или envelope).
2. `POST {base}/auth/confirm-verification` body `{ email, code: OTP }` → 2xx, в ответе **есть** access token в одном из полей: `token` | `access_token` | `api_token` | `tokens.access_token` (assert через ту же логику, что `pickAccessToken` в authService — вынеси в shared helper или импортируй если экспортируешь).
3. `GET {base}/me` с `Authorization: Bearer <token>` → 200, user с `id` + `email` (нормализация id string/number).

**Негатив (хотя бы 1, без OTP из почты):**
- `confirm` с кодом `000000` → 4xx, тело ошибки парсится (message или `error.code`).

**Не делать в этом PR:** полный register нового пользователя на prod (только staging email, согласованный с бэком).

#### 5. Согласованность с клиентом
- Пути относительно base: `/auth/request-verification`, `/auth/confirm-verification`, `/me` (как в `authService.ts`).
- Для picker: в request отправлять `role: "realtor"` если тестируется picker (как `toApiRole`).
- Задокументировать **фактический** JSON ответов staging (пример в `docs/AUTH-CONTRACT-TEST.md`) — это living contract для FE/BE.

#### 6. CI (opt-in, не каждый PR)
- В `.github/workflows/ci.yml` **не** добавлять обязательный шаг на каждый push.
- Добавить отдельный workflow `contract-auth.yml` (или job с `workflow_dispatch`):
  - `CONTRACT_TEST=1`
  - secrets: `CONTRACT_API_URL`, `CONTRACT_AUTH_EMAIL`, `CONTRACT_AUTH_OTP`
  - `npm run test:contract:auth`
- В README / AUTH-CONTRACT-TEST: «перед релизом preview/production — запустить вручную».

#### 7. Переименование / ясность (малый diff)
- В комментарии к `reportsService.contract.test.ts` или в `docs/AUTH-CONTRACT-TEST.md` одной строкой: «локальный contract = mocked JSON fixtures; staging contract = authService.staging.contract.test.ts».
- **Не** переименовывать массово файлы без нужды.

#### 8. Проверки перед отчётом
- `npm run typecheck`
- `npm test` — все **обычные** тесты зелёные (staging suite не запускается без флага)
- `CONTRACT_TEST=1 CONTRACT_API_URL=... CONTRACT_AUTH_EMAIL=... CONTRACT_AUTH_OTP=... npm run test:contract:auth` — описать в отчёте (если нет секретов — skip ожидаем, тесты не падают)

### Формат отчёта
- Список изменённых файлов
- Таблица env-переменных
- Как запустить локально и в CI (workflow_dispatch)
- Пример фактического JSON staging (request / confirm / me) — redact токены
- Что **не** решено: нет автоматического чтения почты без бэкенд bypass; rate limit на staging может флакать — retry policy или skip

### Ограничения
- Не менять поведение `authService` / UI без необходимости для контракта.
- Не хранить OTP и токены в репозитории.
- Не гонять контракт на каждый PR (только opt-in).
- Не трогать `ai-api/` и Laravel.
- Минимальные новые зависимости (нативный fetch / node fetch достаточно).
```

---

## Короткая версия

```txt
Добавь opt-in staging contract test OTP: request-verification → confirm-verification → me против CONTRACT_API_URL. Файл authService.staging.contract.test.ts или scripts/contract-auth.mjs; запуск CONTRACT_TEST=1 npm run test:contract:auth; исключить из обычного npm test. Env: CONTRACT_API_URL, CONTRACT_AUTH_EMAIL, CONTRACT_AUTH_OTP (или skip с понятным текстом). Реальный fetch, assert token fields + me 200. CI: отдельный workflow_dispatch, не каждый PR. Док AUTH-CONTRACT-TEST.md + .env.example. typecheck + npm test.
```

---

## Что спросить у бэкенда до первого зелёного прогона

| Вопрос                                                                | Зачем                              |
| --------------------------------------------------------------------- | ---------------------------------- |
| Есть ли **тестовый email** на staging без спама prod?                 | Стабильный CONTRACT_AUTH_EMAIL     |
| Есть ли **фиксированный OTP** или test bypass для staging?            | Автоматизация без чтения почты     |
| Точные пути и версия: `/api/v1.0/auth/...`?                           | Совпадение с `EXPO_PUBLIC_API_URL` |
| Формат успеха confirm: `api_token` vs `token` vs envelope `{ data }`? | Assert в контракте                 |
| Какой заголовок для `me`: `Bearer`?                                   | Авторизация после confirm          |
| Rate limit на request/confirm для одного IP?                          | Таймауты / не гонять в loop        |

---

## Связь с чеклистом

| Пункт                       | До                   | После промпта                 |
| --------------------------- | -------------------- | ----------------------------- |
| Unit `authService` (моки)   | ✓                    | ✓ без изменений смысла        |
| Живой API OTP → me          | ручной QA только     | автоматический smoke по флагу |
| Расхождение envelope/legacy | всплывает на staging | ловится до релиза             |

---

## Типичные поломки, которые должен ловить suite

- Confirm 200, но нет поля токена → сессия не сохранится.
- Токен есть, но `me` 401 → неверный формат Authorization или другой тип токена.
- `user.id` number vs string → падение `mapApiUserToDomain`.
- Ошибка не в том envelope → UI показывает generic вместо текста бэка.
- Путь `/v1/` vs `/v1.0/` → 404 при «зелёных» unit-тестах.
