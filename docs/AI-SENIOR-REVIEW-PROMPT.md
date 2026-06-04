# Промпт: senior-оценка ИИ-части indep-rn

Скопируйте блок ниже в **новый чат Cursor (Agent)** с доступом к репозиторию.  
Цель: **всесторонняя оценка** модуля ИИ-подбора — не переписать проект, а дать зрелый вердикт для команды, ревью и roadmap.

**Не смешивать** с правками кода в том же чате — только анализ и приоритеты.

---

## Текст промпта (копировать отсюда)

```
Ты — senior fullstack (React Native / Expo, TypeScript, Node BFF, продукт e-commerce/auto). Проведи **независимую оценку ИИ-части** репозитория `indep-rn`. Пиши по-русски, термины TS/RN/API — на английском где уместно. Не анализируй корпоративный Laravel. Не предлагай «переписать всё на Nest/LangChain» без обоснования ROI.

### Скоуп: что считать «ИИ-частью»

**Обязательно прочитай код в:**
- `packages/ai-core/` — правила, фильтр каталога, intent
- `ai-api/` — Hono, `src/routes/v1.ts`, `src/catalog/`, `src/middleware/`, `config/sites/`
- `src/features/aiPicker/` — UI, API, каталог, тесты
- `src/data/ai/` — seed, site profiles
- `src/app/ai-picker.tsx`, `src/shared/config/mainBurgerMenu.tsx`
- `src/features/aiPicker/api/aiPickerApi.ts`, `aiPickerApiClient.ts`
- `src/store/store.ts` (Redux только для AI)
- `src/config/env.ts` — `EXPO_PUBLIC_AI_*`
- `eas.json` — env в APK-сборках для AI
- `docs/AI-ROADMAP.md`, `ai-api/README.md`, `docs/BACKEND-CARS.md`

**Вне скоупа:** остальные features (auth, catalog app, reports), если не пересекаются с AI env/навигацией.

### Как работать

1. Краткая **карта файлов** (дерево + кто за что отвечает) — 15–25 строк.
2. Читай **реальный код**, не только docs.
3. Запусти: `npm run typecheck`, `npm test`, `npm run typecheck --prefix ai-api`. Зафиксируй результат.
4. Отдельно проверь: дубли app ↔ ai-api, поведение при падении API, monobrand (`fixedBrand`), защита от abuse (rate limit, CORS).
5. Не трать время на `node_modules`, `.expo`, figma raw.

---

### Оси оценки (все обязательны)

#### 1. Продукт и UX
- Понятно ли пользователю, что это **правила**, а не «магический GPT»? (disclaimer, тексты)
- Сценарий: запрос → карточки → выбор → лид — где трение?
- Пустой/непонятный запрос — адекватный ответ без «рандомных 5 LADA»?
- Индикатор каталога api/seed, предупреждение при недоступном сервере
- Готовность к monobrand (только своя марка) vs multibrand Indep
- Что не хватает для дилера: согласие на ПДн, повтор отправки лида, FAQ

#### 2. Архитектура и границы
- Роль `ai-core` vs `ai-api` vs `aiPicker` — нет ли утечки бизнес-логики в UI?
- Зачем отдельный BFF, а не Laravel — убедительно ли для текущей стадии?
- Двойной каталог (клиент `loadAiCatalogWithMeta` + сервер `ensureCatalog`) — риск рассинхрона
- RTK Query: оправдан ли scope; мёртвый код (`aiPickerApiClient`, `isAiPickerRtkEnabled`)
- Версионирование `/v1`, расширяемость под `/v2` и DeepSeek
- Monorepo: что вынести в shared (mapBanner, types, site config)

#### 3. Качество кода и TypeScript
- Типы на границе API (cast vs zod)
- Размер/сложность `AiPickerScreen.tsx`
- Единообразие ошибок (старый `{ error: string }` vs новый `{ error: { code, message } }`)
- Тесты: что покрыто, что критично добавить

#### 4. Безопасность и abuse
- Rate limit, CORS, лимиты body, client key — достаточно ли для MVP в интернете?
- Публичный chat/leads без user auth — осознанные риски
- PII (телефон в логах, in-memory leads)
- Готовность к prompt injection при появлении LLM
- Секреты только на сервере, не в `EXPO_PUBLIC_*`

#### 5. Данные и каталог
- Источник ~248 машин: banner API + seed
- Актуальность цен «от», id машин для лидов
- Связь с будущим `GET /cars` (`docs/BACKEND-CARS.md`)

#### 6. Интеграции и эксплуатация
- Лиды: куда идут сейчас vs куда должны (CRM, webhook, Laravel)
- Деплой `ai-api` (есть ли инструкция, health)
- APK/EAS: какие env в профилях; работает ли AI на устройстве (localhost vs LAN)
- Наблюдаемость: логи, метрики, события (telemetry) — пробелы

#### 7. Готовность к roadmap (AI-ROADMAP)
- DeepSeek: куда вставить, что оставить rule-based, guardrails
- LangGraph — нужен ли на горизонте 6 мес или overkill
- Monobrand onboarding (новый `config/sites/*.json`)
- Оценка трудозатрат: MVP prod-ready vs «демо в офисе»

#### 8. Сравнение с альтернативами (кратко, без фанатизма)
- ai-api (Hono) vs всё в Laravel
- RTK Query vs только Zustand/fetch для 3 эндпоинтов
- Rules-first vs LLM-first
- Таблица: альтернатива | плюс | минус | вердикт для **этого** проекта

---

### Формат ответа (строго)

## Executive summary (7–10 предложений)
Для PM/тимлида: зрелость, можно ли показывать клиенту, главный блокер.

## Карта системы
Mermaid: Мобилка → ai-api → ai-core → каталог; offline path.

## Оценки 1–5

| Ось | Оценка | Одна фраза |
|-----|--------|------------|
| Продукт/UX | | |
| Архитектура | | |
| Код/TS | | |
| Безопасность | | |
| Данные/каталог | | |
| Эксплуатация/интеграции | | |
| Готовность к LLM | | |
| Тестируемость | | |

**Итоговая оценка ИИ-модуля (1–5):** …

## Сильные стороны (5–7 буллетов)
Конкретно, со ссылкой на файлы/паттерны.

## Слабые стороны и риски (5–7 буллетов)
Раздели: «баг сейчас» vs «долг».

## P0 — до показа внешнему пользователю / prod
Файл → проблема → последствие → рекомендация (1–3 предложения).

## P1 — следующий спринт (2–4 недели)

## P2 — backlog

## Вопросы к бизнесу/бэкенду
Что нельзя решить по коду.

## Рекомендуемая последовательность работ (5–8 шагов)
С зависимостями (например: CRM лидов → потом LLM).

## Вердикт senior-ревьюера
Одним абзацем: «брать в прод / только internal demo / нужен ещё X недель».

### Ограничения
- Не выдумывай файлы.
- Не генерируй огромные диффы.
- Отделяй факты из кода от гипотез (помечай «гипотеза»).
- Учти уже сделанное: `packages/ai-core`, rate limit, P0 без fallback LADA (проверь в коде, не по памяти).
```

---

## Короткая версия

```txt
Senior-оценка ИИ-модуля indep-rn: прочитай ai-core, ai-api, aiPicker, data/ai, env, eas.json. Запусти typecheck и tests. Оцени продукт, архитектуру, security/abuse, каталог, лиды, APK/env, готовность к DeepSeek/monobrand. Формат: executive summary, mermaid, таблица 1–5 по осям, P0/P1/P2, сильные/слабые стороны, вердикт prod vs demo. Laravel вне скоупа. По-русски.
```

---

## Советы по использованию

| Совет | Зачем |
|--------|--------|
| Новый чат, Agent | Нужен обход файлов и скрипты |
| После отчёта — отдельные чаты по `FIX-AI-P0`, `FIX-AI-ABUSE` | Не смешивать оценку и код |
| Сравнить с прошлым аудитом (`CODE-AUDIT-PROMPT`) | Видеть прогресс |
| Дать контекст: «готовим APK для дилера» / «готовим monobrand HAVAL» | Вердикт точнее |

---

## Связанные промпты

| Файл | Когда |
|------|--------|
| [CODE-AUDIT-PROMPT.md](./CODE-AUDIT-PROMPT.md) | Аудит всего репо |
| [FIX-AI-ABUSE-PROMPT.md](./FIX-AI-ABUSE-PROMPT.md) | Защита от спама API |
| [AI-ROADMAP.md](./AI-ROADMAP.md) | План фич |
| [RTK-AI-MIGRATION-PROMPT.md](./RTK-AI-MIGRATION-PROMPT.md) | Миграция RTK (исторически) |
