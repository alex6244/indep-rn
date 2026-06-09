# Промпт: UI/UX флоу отчёта подборщика (create → confirm)

Скопируйте блок ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

Связано с: недавняя валидация ПТС (VIN, год wheel, объём). **Следующий слой** — убрать трение формы, не ломая контракт `DraftReport` и API.

**Вне скоупа:** Laravel, POST `/reports`, checksum VIN (P1), марка/модель из каталога (отдельная фича), рефактор FSD каталога (`docs/FIX-CATALOG-COMPOSITION-PROMPT.md`).

---

## Что ещё бесит в UI/UX (для себя)

| # | Проблема | Сейчас | Приоритет |
|---|----------|--------|-----------|
| 1 | Ошибка «Далее» только в `InlineMessage` сверху | Длинный `ScrollView`, кнопка внизу — пользователь не видит notice | **P0** |
| 2 | ПТС: нет подсветки полей при submit | `validatePtsForm` в контроллере; `PtsForm` красит поля только на `onBlur` | **P0** |
| 3 | Владельцы: то же | `validateAllOwnersDates` → notice; `OwnersForm.fieldErrors` не синхронизируются | **P0** |
| 4 | Нет `KeyboardAvoidingView` на create | `AutoCreditScreen` / auth уже используют; create-report — нет | **P0** |
| 5 | Пробег — свободный `TextInput` | Placeholder `000 000 км`, без маски и без валидации на «Далее»; в фильтрах — wheel | **P1** |
| 6 | Медиа «обязательно» в копирайте, но не в коде | `uploadModalsConfig` говорит «обязательно», `saveDraftAndContinue` не проверяет | **P1** |
| 7 | Confirm «Подтвердить» без loading | Двойной тап, нет спиннера во время `pickerReportsService.submit` | **P1** |
| 8 | Цвет — иконка dropdown, но обычный input | Вводит в заблуждение (picker нет) | **P2** |
| 9 | Год: нет ошибки до открытия sheet / «Далее» | Inline year error только после apply в sheet | **P2** |
| 10 | `PtsFormState` дублируется | `PtsForm.tsx` и `src/types/draftReport.ts` | **P2** (типы, не UX) |

**Уже сделано (не трогать без причины):** VIN mask/validate, `YearBottomSheet` + `WheelColumn`, engine `X.Y`, `validatePtsForm` на create/confirm, `normalizeVinForCompare`.

---

## Текст промпта (копировать отсюда)

```
Ты — senior React Native / TypeScript. Улучши UI/UX флоу создания и подтверждения отчёта подборщика в `indep-rn`. Минимальный diff, без Laravel и без смены API-контракта `DraftReport`. Не рефактори весь `pickerReport` — только перечисленные UX-задачи. Отчёт по-русски.

### Контекст (прочитай код)

**Create:**
- `src/features/pickerReport/ui/PickerReportCreatePage.tsx` — длинный `ScrollView`, notice сверху, `CreateFooterActions` («Далее») sticky внизу
- `src/features/pickerReport/ui/create/usePickerReportCreateController.ts` — `saveDraftAndContinue`: `validatePtsForm` → `validateAllOwnersDates` → AsyncStorage → `/selection-confirm`
- Секции: media, generalInfo, pts (`PtsForm`), mileage (`MileageSection`), owners (`OwnersForm`), legal, commercial, defects

**Confirm:**
- `PickerReportConfirmPage.tsx`, `usePickerReportConfirmController.ts` — `handleConfirm` async без `submitting` state

**Валидация (уже есть):**
- `src/shared/validation/ptsValidation.ts` — `validatePtsForm`, field helpers
- `src/shared/validation/formatDdMmYyyy.ts` — `validateAllOwnersDates`, `validateOwnerDates`

**Эталоны UX в проекте:**
- Inline field errors: `OwnersForm` (`inputInvalid`, `fieldError`, `colors.text.warning`)
- Keyboard + scroll: `src/features/autoCredit/ui/AutoCreditScreen.tsx` (`KeyboardAvoidingView`, `scrollRef`, `onLayout` + `scrollTo`)
- Wheel пробега: `src/features/filters/ui/MileageBottomSheet.tsx`, `CatalogFiltersMileageSection.tsx`
- Год ПТС: `src/features/pickerReport/ui/YearBottomSheet.tsx` (уже wheel)

Перед правками: `npm run typecheck`, `npm test`.

---

### Задача 1 — scroll к первой ошибке + подсветка полей (P0)

**Проблема:** при «Далее» ошибка в `InlineMessage` вверху экрана; пользователь внизу у кнопки.

**Цель:** при неуспешной валидации:
1. Прокрутить к секции с первой ошибкой
2. Показать inline-ошибки в полях (как на blur), не только banner

**Реализация (предпочтительно):**

1. Расширить `ptsValidation.ts`:
   - `validatePtsFormFields(pts): { vin?: string; year?: string; engineVolume?: string } | null`
   - `validatePtsForm` оставить как `first message` wrapper (не ломать confirm)

2. `PtsForm`: опциональный prop `externalErrors?: PtsFieldErrors` и/или `submitAttempt?: number`
   - При изменении `externalErrors` / `submitAttempt` — мержить в `fieldErrors` и подсвечивать border

3. `OwnersForm`: аналогично — prop `externalErrorsByOwnerId` или callback `exposeValidateAll(): boolean` из ref
   - При fail `validateAllOwnersDates` — проставить errors во все проблемные строки (не только первую), но notice — текст **первой** ошибки

4. `PickerReportCreatePage`:
   - `scrollRef` на `ScrollView`
   - `sectionY` через `onLayout` на обёртках секций (минимум: `pts`, `owners`; опционально media/mileage после задач 2–3)
   - В `saveDraftAndContinue` при ошибке: `scrollTo({ y: sectionY.pts - 16, animated: true })` + передать field errors в формы

5. После scroll — опционально `scrollRef.current?.scrollTo({ y: 0 })` для notice (или держать notice sticky под safe area — **не** делать оба, выбери один паттерн)

**Не делать:** react-hook-form / zod на весь draft — overkill для MVP.

**Тесты:** unit на `validatePtsFormFields`; UI smoke в отчёте.

---

### Задача 2 — KeyboardAvoidingView на create (P0)

**Файл:** `PickerReportCreatePage.tsx`

- Обернуть контент как в `AutoCreditScreen`: `KeyboardAvoidingView` + `keyboardShouldPersistTaps="handled"`
- `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`
- `paddingBottom` у `ScrollView` оставить с запасом под sticky «Далее»
- Проверить: VIN / объём / даты владельцев не перекрываются клавиатурой и footer

---

### Задача 3 — пробег: маска + валидация на «Далее» (P1)

**Сейчас:** `MileageSection.tsx` — голый `TextInput`, `mileage: ""` без проверки.

**Цель:**
- Формат отображения: пробелы тысяч (`125 000`), хранение в draft — строка цифр или уже отформатированная (согласовать с `mapSubmittedReportToReport` / confirm display — **не сломать** `${mileage} км`)
- Валидация: обязательное поле, `> 0`, разумный max (напр. 9_999_999)
- Сообщения на русском: «Укажите пробег», «Некорректный пробег»

**Опционально P1.5 (только если diff маленький):** переиспользовать `MileageBottomSheet` / `mileagePickerUtils` как в каталоге — **одна колонка «от»**, без «до». Если diff > ~80 строк — оставить TextInput + маску.

**Файлы:** `src/shared/validation/mileageValidation.ts` (или рядом с pts), `MileageSection.tsx`, `saveDraftAndContinue`.

**Тесты:** `mileageValidation.test.ts`.

---

### Задача 4 — обязательные медиа на «Далее» (P1)

**Сейчас:** `uploadModalsConfig` — «В обязательном порядке загрузите…», но контроллер не проверяет.

**Цель:**
- `validateMediaUpload(media): string | null` — минимум `salonPhoto` и `bodyPhoto` (уточни по `uploadModalsConfig`; видео — если в copy «обязательно», включить)
- При ошибке: notice + scroll к секции media (задача 1)
- Визуально: подсветить пустые слоты (border/label) — минимально, без нового дизайна

**Не менять:** логику `ImagePicker` / permissions.

---

### Задача 5 — loading на confirm submit (P1)

**Файлы:** `usePickerReportConfirmController.ts`, `ConfirmFooterActions.tsx`

- State `submitting: boolean`
- На `handleConfirm`: guard `if (submitting) return`; `setSubmitting(true)` в try/finally
- Кнопка «Подтвердить»: disabled + `ActivityIndicator` или текст «Отправляем…»
- Ошибка сети — как сейчас, `submitting` сбросить

---

### Задача 6 — мелочи UX (P2, по остаточному принципу)

**6a. Цвет — убрать ложный dropdown**
- `PtsForm` поле «Цвет»: убрать `DropdownIcon` и `dropdownWrap`, оставить обычный `TextInput` как марка/модель

**6b. Год — hint при пустом**
- При `submitAttempt` и пустом `year` — inline «Укажите год выпуска» под полем (даже без открытия sheet)

**6c. Типы**
- `PtsForm` импортирует `PtsFormState` из `src/types/draftReport.ts`, локальный дубль типа удалить

---

### Ограничения

- Не менять структуру `DraftReport` и поля API
- Не добавлять марку/модель из каталога / autocomplete
- Не трогать duplicate-VIN modal на confirm
- Не рефакторить `DefectsForm` / legal / commercial без явной валидации в ТЗ
- Стили карточек: `PR_TYPO`, `pickerReport.styles` — сохранить

---

### Порядок выполнения

1. Задача 1 (scroll + field errors) — основа
2. Задача 2 (keyboard)
3. Задачи 3–4 (mileage, media) — подключают scroll из п.1
4. Задача 5 (confirm loading)
5. Задача 6 (polish)

---

### Критерии готовности

- [ ] «Далее» с пустым VIN: scroll к ПТС + красная рамка VIN + notice
- [ ] «Далее» с кривыми датами владельца: scroll к owners + inline под полем
- [ ] Клавиатура не перекрывает активное поле на create (iOS smoke)
- [ ] Пробег валидируется; confirm показывает пробег как раньше
- [ ] Без фото салона/кузова «Далее» блокируется с понятным текстом
- [ ] «Подтвердить» нельзя нажать дважды
- [ ] `npm run typecheck` + `npm test` pass

---

### Формат отчёта

1. Список изменённых файлов
2. Как устроен scroll-to-error (2–3 предложения)
3. Правила пробега и медиа (таблица поле → правило)
4. Скриншоты/описание smoke на iOS (или эмулятор)
5. Результаты typecheck + test
```

---

## Риски

| Риск | Как избежать |
|------|----------------|
| Сломать отображение пробега на confirm/PDF | Читать `mapSubmittedReportToReport` перед сменой формата |
| Двойной state ошибок в формах | `externalErrors` перезаписывает только при submit, blur очищает локально |
| Раздувание diff wheel для пробега | P1 = маска; wheel только если переиспользование ≤ 1 новый файл |

---

## Что сознательно не в этом PR

- Pickers марки/модели/цвета из справочника
- Валидация дефектов (описание + фото повреждений)
- VIN checksum (ISO 3779 P1)
- FSD каталога, AI-чат UX, auth staging
