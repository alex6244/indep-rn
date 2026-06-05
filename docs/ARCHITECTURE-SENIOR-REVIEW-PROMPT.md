# Промпт: оценка архитектуры, стиля и «сеньорности» кода

Скопируйте блок ниже в **новый чат Cursor (Agent)** с доступом к репозиторию `indep-rn`.

Цель: **независимая оценка** — насколько код выглядит как работа **middle+ / senior**, где архитектура осознанная, а где «работает, но нарастёт долг».  
**Не смешивать** с правками в том же чате — только анализ, оценки и приоритеты.

Связано с: `docs/CODE-AUDIT-PROMPT.md` (шире: безопасность, CI, продукт), `docs/AI-SENIOR-REVIEW-PROMPT.md` (только ИИ).

---

## Что оцениваем (три оси)

| Ось | Вопрос |
|-----|--------|
| **Архитектура** | Понятны ли границы слоёв, зависимости, расширяемость? |
| **Стиль** | Единообразие, читаемость, TypeScript, соответствие конвенциям проекта? |
| **Сеньорность** | Зрелые решения: ошибки, тесты, идемпотентность, trade-offs, минимальный scope? |

---

## Текст промпта (копировать отсюда)

```
Ты — staff/senior engineer (React Native / Expo, TypeScript, продуктовые BFF). Проведи **оценку архитектуры, стиля кода и уровня инженерной зрелости («сеньорность»)** репозитория `indep-rn` + `ai-api/` + `packages/ai-core/`. Пиши по-русски. Не анализируй Laravel вне репо. Не предлагай переписать проект; давай вердикт с путями к файлам и примерами.

### Контекст (прочитай перед оценкой)
- **Мобилка:** Expo Router `src/app/`, слои `features/`, `widgets/`, `shared/`, плюс `services/`, `contexts/`, `hooks/`, `types/` — **FSD-inspired, не строгий FSD**
- **Домены:** auth (OTP), catalog, filters, reports/pickerReport, aiPicker, autoCredit
- **BFF ИИ:** `ai-api/` (Hono, `/v1`, middleware abuse)
- **Shared logic:** `packages/ai-core/`
- **Тесты:** Jest (`src/`, `ai-api/src`), CI: typecheck + lint + test (`.github/workflows/ci.yml`)
- **Вне скоупа:** корпоративный Laravel, figma raw, `node_modules`, `coverage/`

### Как работать
1. Обзор структуры: дерево `src/` (1-й уровень), ключевые `package.json`, `tsconfig`, `jest.config.js`, `eas.json`.
2. Выборочно **прочитай 8–12 репрезентативных файлов** (не только один модуль):
   - `src/services/api.ts`, `authService.ts`
   - `src/contexts/AuthContext.tsx`
   - `src/features/catalog/ui/CatalogScreen.tsx` + `useCatalogFiltersController.ts`
   - `src/features/aiPicker/ui/AiPickerScreen.tsx`
   - `src/features/pickerReport/ui/create/usePickerReportCreateController.ts`
   - `src/shared/errors/getUserErrorMessage.ts`
   - `src/shared/config/mainBurgerMenu.tsx`
   - `ai-api/src/routes/v1.ts` + один middleware
   - `packages/ai-core/src/` (entry + ruleBasedReply или аналог)
3. Запусти: `npm run typecheck`, `npm run lint`, `npm test -- --ci` (корень), `npm run typecheck --prefix ai-api`. Зафиксируй pass/fail.
4. Построй **диаграмму зависимостей слоёв** (mermaid): кто кого импортирует; отметь нарушения (feature→widget, feature→feature, UI→fetch).
5. Отделяй: **осознанный компромисс** (solo, MVP) vs **техдолг без комментария**.

---

### Ось 1 — Архитектура (вес 35%)

Оцени по критериям:

#### A1. Слои и границы
- Соответствие заявленной модели: `app` = роуты, `features` = сценарии, `widgets` = композиции, `shared` = kit/utils
- Нарушения FSD/слоёв: `features` импортирует `widgets`? `services` в UI? циклы?
- Роль `services/` vs будущие `entities/` — логично ли для RN?
- `contexts/` vs feature-local state — не размазано ли глобально?

#### A2. Модульность фич
- У фич есть ли `ui/`, `hooks/`, `api/`, `lib/`, тесты рядом?
- Размер «божественных» файлов (`AiPickerScreen`, `CatalogScreen`, `api.ts`) — порог ~300–400 строк
- Переиспользование: filters ↔ catalog, reports widgets ↔ profile

#### A3. Monorepo и дубли
- `aiPicker` (app) ↔ `ai-api` ↔ `ai-core`: одна логика или три копии?
- Env strategy: `src/config/env.ts`, `EXPO_PUBLIC_*`, `eas.json` — согласованность

#### A4. Расширяемость
- Новая фича (billing, Autoteka, monobrand site): куда класть код без ломки?
- Контракт API: envelope, legacy Laravel fields — централизовано?

**Выход по оси:** оценка 1–5 + 3 сильные стороны + 3 архитектурных риска (P0/P1).

---

### Ось 2 — Стиль и консистентность (вес 25%)

#### B1. TypeScript
- `any`, `as unknown as`, дубли типов, strictness
- Публичные API функций: явные типы vs inference
- Zod на границе API — где есть, где дыра

#### B2. Именование и структура файлов
- Единообразие: `*Screen`, `*Section`, `use*Controller`, `*Service`
- Импорты: `@/src/...` vs относительные `../../../`
- Стили: colocated `*.styles.ts` vs inline StyleSheet

#### B3. React / RN паттерны
- Hooks: зависимости useEffect, cleanup, AbortController
- Мемоизация: оправдана или шум?
- UI kit: `AppButton`, `InlineMessage`, theme tokens — используются ли последовательно?

#### B4. Ошибки и тексты
- `getUserErrorMessage`, `authTypes`, envelope в `api.ts` — единый язык ошибок?
- Хардкод русских строк в UI vs shared словарь

#### B5. Комментарии и документация в коде
- Комментарии там, где non-obvious (legacy API, security)
- Нет ли шума («✅ ГОТОВЫЙ!», закомментированный мёртвый код)

**Выход по оси:** оценка 1–5 + таблица «конвенция | соблюдается? | пример файла».

---

### Ось 3 — «Сеньорность» кода (вес 40%)

Оцени не «красиво ли», а **зрелость инженерных решений**:

#### C1. Обработка ошибок и граничные случаи
- Сеть: status 0, 429, 5xx, envelope vs plain Error
- Не глотаются ли ошибки (`catch {}`, `leadSent=true` при fail)
- Fail-safe vs fail-closed (auth, tokens)

#### C2. Тестируемость
- Критичные сервисы с unit-тестами? качество (моки vs contract)
- Что **не** тестируется, но должно (auth staging, billing, ai leads)
- CI как quality gate: достаточно ли typecheck+test?

#### C3. Безопасность и prod-мышление
- Секреты не в `EXPO_PUBLIC_*`
- Rate limit / CORS в ai-api — осознанный MVP?
- PII в логах, insecure token fallback выключен в eas preview/production

#### C4. Продуктовые trade-offs явны?
- Mock vs api sources — документировано?
- Временные заглушки помечены (оплата, PDF list, CRM leads)?

#### C5. Минимальный scope и YAGNI
- Нет ли over-engineering (лишние абстракции, мёртвый RTK/клиент)?
- Нет ли under-engineering (всё в одном экране, RAM leads)?

#### C6. Сигналы уровня (заполни таблицу)

| Сигнал | Junior | Middle | Senior | Где в проекте (файл) |
|--------|--------|--------|--------|----------------------|
| Слои и зависимости | всё в экране | папки есть, импорты путаются | явные границы, composition в app | |
| Ошибки | generic alert | коды ошибок | UX + server message + telemetry | |
| API контракт | хардкод JSON | моки в тестах | + staging contract / zod | |
| Тесты | нет | happy path | негатив, auth, abuse | |
| Конфиг/env | .env в коде | .env.example | eas.json + docs + guards | |
| Async | race в useEffect | loading state | abort, idempotent actions | |

**Итоговый уровень команды (по коду):** Junior / Middle / Middle+ / Senior- — **одна фраза обоснования**.

---

### Сводная шкала 1–5

| # | Область | 1 | 3 | 5 |
|---|---------|---|---|---|
| 1 | Архитектура слоёв | хаос | FSD-inspired с дырами | чёткие границы, мало циклов |
| 2 | Модульность фич | god files | норм, 2–3 перегруза | slice + hooks + тесты |
| 3 | TypeScript / стиль | any, хаос | в целом strict | единый стиль, zod на границах |
| 4 | Ошибки и UX ошибок | глотаются | auth/catalog ок | везде предсказуемо |
| 5 | Тесты | почти нет | services/auth | + contract, CI gates |
| 6 | Prod-готовность | только dev | preview частично | eas, abuse, secrets ok |
| 7 | Документация vs код | расходятся | частично | docs/DEMO/AUTH отражают реальность |
| 8 | **Общая сеньорность** | | | |

**Общий балл:** среднее или взвешенное (арх 35%, стиль 25%, сеньорность 40%) → **X/5**.

---

### Формат ответа (строго)

## Executive summary (6–8 предложений)
Для тимлида/начальства: зрелость кодовой базы, можно ли масштабировать команду, главный риск.

## Вердикт по уровню
- **Архитектура:** X/5 — …
- **Стиль:** X/5 — …
- **Сеньорность:** X/5 — …
- **Итого:** X/5 ≈ уровень **Middle / Middle+ / Senior-** (выбери один)

## Диаграмма слоёв (mermaid)
Текущее состояние + стрелками отметь 2–3 проблемных импорта.

## Что сделано по-сеньорски (топ-5)
Файл → почему это хороший пример.

## Что выдаёт middle/junior (топ-5)
Файл → проблема → как бы сделал senior (1–2 предложения, без полного рефактора).

## P0 / P1 / P2
| Приоритет | Находка | Файл | Влияние на архитектуру/сеньорность |

## Рекомендации (макс. 7, минимальный scope)
Только обоснованные; без «перейти на Nx/Turbo» без причины.

## Для собеседования / self-review
3 вопроса, которые стоит задать автору кода по этому репо.

## Вопросы к команде
Что нельзя оценить по коду (процессы, code review, ownership бэкенда).

### Ограничения
- Не выдумывай файлы — только репозиторий.
- Не генерируй огромные диффы; для примеров — 5–15 строк или ссылка path:line.
- Отделяй «баг» от «стиль» от «архитектурный долг».
- Учитывай контекст: solo, MVP, RN + отдельный ai-api — не штрафуй за отсутствие enterprise-паттернов без нужды.
```

---

## Короткая версия (только архитектура + сеньорность)

```txt
Оцени indep-rn + ai-api + ai-core: архитектура слоёв (FSD-inspired), стиль TS/RN, сеньорность (ошибки, тесты, prod, trade-offs). Прочитай api.ts, authService, AuthContext, CatalogScreen, AiPickerScreen, v1.ts. Запусти typecheck/lint/test. Формат: X/5 по трём осям, mermaid слоёв, топ-5 хорошо/плохо, P0/P1, вердикт Middle/Middle+/Senior-. Laravel вне скоупа. По-русски.
```

---

## Вариант «только стиль кода»

```txt
Аудит **стиля и консистентности** `src/` (без ai-api): TypeScript strictness, именование, импорты, colocated styles, ошибки, хардкод строк. Таблица конвенций + 10 конкретных несоответствий с path. Оценка 1–5. Без архитектурных советов.
```

---

## Как использовать

| Шаг | Действие |
|-----|----------|
| 1 | Новый чат Agent, вставить полный промпт |
| 2 | Указать ветку / «включая uncommitted» |
| 3 | Сохранить ответ в `docs/reviews/YYYY-MM-DD-architecture.md` (опционально) |
| 4 | Отдельный чат — «исправь P0 #1–#2» из отчёта |
| 5 | Повтор через 4–6 недель — сравнить оценки X/5 |

---

## Отличие от других промптов

| Промпт | Фокус |
|--------|--------|
| `CODE-AUDIT-PROMPT.md` | Полный аудит: безопасность, CI, продукт, ai-api abuse |
| `AI-SENIOR-REVIEW-PROMPT.md` | Только ИИ-модуль |
| **Этот файл** | Архитектура + стиль + **уровень зрелости кода** (сеньорность) |

---

## Связанные файлы

- [CODE-AUDIT-PROMPT.md](./CODE-AUDIT-PROMPT.md)
- [AI-SENIOR-REVIEW-PROMPT.md](./AI-SENIOR-REVIEW-PROMPT.md)
- [AUTH-QA-CHECKLIST.md](./AUTH-QA-CHECKLIST.md)
- [AI-ROADMAP.md](./AI-ROADMAP.md)
