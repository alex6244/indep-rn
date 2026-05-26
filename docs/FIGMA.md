# Figma ↔ indep-rn

Макет: [**Indep/Лизинг/Далматин**](https://www.figma.com/design/qcewqqrs8iRjohWoFPMynp/Indep-%D0%9B%D0%B8%D0%B7%D0%B8%D0%BD%D0%B3-%D0%94%D0%B0%D0%BB%D0%BC%D0%B0%D1%82%D0%B8%D0%BD) (`FIGMA_FILE_KEY=qcewqqrs8iRjohWoFPMynp`).

В коде дизайн-система живёт в `src/shared/theme/`, а значения из Figma подтягиваются скриптами в `design/figma/`.

## Быстрый старт

1. В [Figma → Settings → Security](https://www.figma.com/settings) создай **Personal access token**.
2. Открой файл макета и скопируй **file key** из URL:  
   `https://www.figma.com/design/<FILE_KEY>/...`
3. Добавь в `.env` (не коммитить):

```env
FIGMA_ACCESS_TOKEN=figd_...
FIGMA_FILE_KEY=your_file_key_here
```

4. Синхронизация:

```bash
npm run figma:pull    # скачать узлы из API → design/figma/raw/
npm run figma:build   # собрать src/shared/theme/figma.generated.ts
npm run figma:check   # сравнить с colors.ts (tab bar)
npm run figma:fonts   # список шрифтов по всему файлу
```

Без токена можно работать с уже лежащим `design/figma/raw/nav-bar.nodes.json` и только `npm run figma:build`.

## Структура

| Путь | Назначение |
|------|------------|
| `design/figma/manifest.json` | Какие узлы Figma связаны с какими файлами в `src/` |
| `design/figma/raw/` | Сырые ответы API (в git не попадают, кроме локальной копии) |
| `design/figma/snapshots/` | Компактные снимки для ревью (коммитятся) |
| `src/shared/theme/figma.generated.ts` | Автогенерация — не править вручную |
| `src/shared/theme/figma.ts` | Мост Figma → `colors` / tab bar |

## Добавить новый экран из Figma

1. В Figma: правый клик по фрейму → **Copy link to selection** (или скопировать node id вида `123:456`).
2. В `design/figma/manifest.json` добавь узел с `id`, `rawFile`, списком `code`.
3. `npm run figma:pull && npm run figma:build`
4. Используй токены из `figma.generated.ts` или перенеси цвета в `colors.ts`, затем `npm run figma:check`.

## Уже привязано

| Узел / область | Figma | Код |
|----------------|-------|-----|
| Нижняя навигация | `612:1715` «Навигационная панель» | `(tabs)/_layout.tsx`, `tabBarMetrics.ts` |
| Карточки статистики профиля | вручную по макету | `profileStatCardMetrics.ts` |
| Picker report типографика | вручную по макету | `pickerReport.styles.ts` (`PR_TYPO`) |

## Типографика

- Шрифт в приложении: **Moderustic** (variable), веса **300–700** — как в макете.
- Стили: `src/shared/theme/typography.ts` → `figmaText.*` (размеры/межстрочные из Figma).
- Picker report: `PR_TYPO` строится на `figmaText`.
- Список шрифтов в файле: `npm run figma:fonts`.

## Правила для разработки

- В компонентах — **`colors.*`**, не сырые `#hex` (ESLint предупреждает).
- Текст — **`figmaText`**, не `fontWeight: "800"` / `"900"`.
- После смены макета в Figma: `figma:pull` → `figma:build` → при расхождении обновить `colors.ts` или вёрстку.
- Большие `figma_full.json` в корне не хранить — только `design/figma/raw/` + snapshots.
