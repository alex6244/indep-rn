# Промпт: срок кредита в месяцах + ползунок срока

Скопируйте блок ниже в **новый чат Cursor (Agent)** с репозиторием `indep-rn`.

Уточнение от дизайна после первого PR калькулятора: **+/−** на карточке «Наше предложение» меняют срок **на 1 месяц** (не на год); в основном скролле **вернуть ползунок «Срок кредита»**, синхронизированный с тем же state.

**Вне скоупа:** процентная ставка, аннуитет, API банков, привязка к авто.

**Уже сделано (не откатывать):** калькулятор без `carId`, сумма/взнос слайдеры, `AutoCreditOfferCard`, адрес убран из каталога.

---

## Что меняем (для себя)

| Сейчас | Нужно |
|--------|--------|
| State `termYears` (1–7), +/− шаг **год** | State `termMonths`, +/− шаг **1 месяц** |
| Слайдер срока **убран** из скролла | **Вернуть** слайдер «Срок кредита» между взносом и offer card |
| `calcMonthlyPayment(principal, termYears)` | `calcMonthlyPayment(principal, termMonths)` → `principal / termMonths` |
| Подсказка «Срок: 3 года» | «36 мес.» или «3 года» при кратности 12 — см. задачу 2 |

---

## Текст промпта (копировать отсюда)

```
Ты — senior React Native / TypeScript. Доработай калькулятор автокредита: срок в **месяцах**, +/− на **1 месяц**, верни **ползунок срока** в скролле. Минимальный diff. Отчёт по-русски.

Перед правками: `npm run typecheck`, `npm test`.

---

### Контекст (прочитай код)

**Экран:** `src/features/autoCredit/ui/AutoCreditScreen.tsx`
- State: `creditAmount`, `downPayment`, `termYears` ← заменить на `termMonths`
- Слайдеры: сумма кредита, первоначальный взнос
- `AutoCreditOfferCard` — +/− срока (сейчас ±1 год)

**Расчёты:** `src/features/autoCredit/lib/autoCreditCalculations.ts`
- `calcMonthlyPayment(loanPrincipal, termYears)` — переделать на месяцы
- `adjustTermYears` / `canAdjustTermYears` — заменить на month-версии или удалить

**Константы:** `src/features/autoCredit/ui/autoCredit.content.ts`
- `CREDIT_TERM_YEARS = [1..7]`, `DEFAULT_TERM_YEARS = 3`
- Заменить на месячные границы (см. ниже)

**Карточка:** `src/features/autoCredit/ui/AutoCreditOfferCard.tsx`
- props `termYears` → `termMonths`, accessibility «на месяц»

**Тесты:** `src/features/autoCredit/lib/__tests__/autoCreditCalculations.test.ts`

**Опционально переиспользовать:** `AutoCreditPercentChips.tsx` — chips для быстрого выбора срока (12/24/36/48/60/72/84 мес.) под слайдером, как было с годами.

---

### Задача 1 — модель срока в месяцах (P0)

**Константы** (`autoCredit.content.ts`):

```ts
CREDIT_TERM_MONTHS_MIN = 12   // 1 год
CREDIT_TERM_MONTHS_MAX = 84   // 7 лет
CREDIT_TERM_MONTHS_STEP = 1    // для +/− и слайдера
DEFAULT_TERM_MONTHS = 36     // было 3 года
```

Опционально для chips: `CREDIT_TERM_MONTH_PRESETS = [12, 24, 36, 48, 60, 72, 84]`.

**Расчёт:**
- `calcMonthlyPayment(loanPrincipal, termMonths)` → `termMonths <= 0 ? 0 : round(loanPrincipal / termMonths)`
- Убрать умножение `termYears * 12` из формулы

**Хелперы:**
- `clampTermMonths(n): number` — clamp в [MIN, MAX]
- `adjustTermMonths(current, delta): number` — current + delta, clamp
- `canAdjustTermMonths(current, delta): boolean`
- `formatTermMonths(months): string` — для UI:
  - если `months % 12 === 0` и months >= 12 → можно показать `formatTermYears(months/12)` **дополнительно** или только «N мес.» — **выбери один формат для слайдера и один для карточки**; рекомендация: везде «36 мес.» + в скобках «(3 года)» при кратности 12, либо только `formatTermMonths` без дубля

**State на экране:** один `termMonths`, единый источник правды для слайдера и +/−.

**Тесты:** обновить/добавить cases для 36 мес., +1/−1, границы 12 и 84.

---

### Задача 2 — вернуть ползунок «Срок кредита» (P0)

**Файл:** `AutoCreditScreen.tsx`

Между блоком «Первоначальный взнос» и `AutoCreditOfferCard` вернуть секцию как раньше (до PR с только offer card):

1. Label: «Срок кредита»
2. Value: `formatTermMonths(termMonths)` (или с годами в скобках)
3. `Slider`:
   - `minimumValue={CREDIT_TERM_MONTHS_MIN}`
   - `maximumValue={CREDIT_TERM_MONTHS_MAX}`
   - `step={1}`
   - `value={termMonths}`
   - `onValueChange` → `setTermMonths(clampTermMonths(round(value)))`
4. Опционально: подписи min/max («12 мес.» / «84 мес.») и `AutoCreditPercentChips` с пресетами месяцев

**Синхронизация:** слайдер и +/− на offer card меняют **один** `termMonths`; платёж пересчитывается в `useMemo` без рассинхрона.

---

### Задача 3 — +/− на карточке: шаг 1 месяц (P0)

**Файл:** `AutoCreditOfferCard.tsx`

- `onDecreaseTerm` / `onIncreaseTerm` → `adjustTermMonths(termMonths, -1)` / `+1`
- `canDecreaseTerm` / `canIncreaseTerm` → `termMonths > MIN` / `termMonths < MAX`
- `accessibilityLabel`: «Уменьшить срок на 1 месяц» / «Увеличить срок на 1 месяц»
- Строка под заголовком: «Срок: …» с `formatTermMonths(termMonths)`

**Не делать:** modal/bottom sheet на +/− — только inline step (дизайн уточнили).

---

### Задача 4 — зачистка (P1)

- Удалить или не экспортировать `adjustTermYears`, `canAdjustTermYears`, `CREDIT_TERM_YEARS`, `DEFAULT_TERM_YEARS` если больше не используются
- `formatTermYears` оставить для отображения «N лет» внутри `formatTermMonths` при желании
- Props `termYears` → `termMonths` во всех дочерних компонентах

---

### Ограничения

- Не менять логику суммы кредита и взноса
- Не трогать каталог, picker report, ai-api
- Не добавлять процентную ставку

---

### Критерии готовности

- [ ] Слайдер срока виден в скролле, диапазон 12–84 мес.
- [ ] +/− на «Наше предложение» меняют срок на **1 месяц**, disabled на границах
- [ ] Слайдер и +/− синхронизированы (один state)
- [ ] Платёж пересчитывается при любом изменении срока
- [ ] `npm run typecheck` + `npm test` pass

---

### Формат отчёта

1. Изменённые файлы
2. Формула платежа и границы срока (таблица)
3. Как отображается срок в UI (слайдер vs карточка)
4. Smoke: слайдер 48 мес. → +/− → платёж меняется
5. Результаты typecheck + test
```

---

## Порядок для агента

1. Константы + `autoCreditCalculations.ts` + тесты  
2. `AutoCreditScreen` — state `termMonths` + слайдер  
3. `AutoCreditOfferCard` — +/− месяц  
4. Зачистка year-based API  

---

## Риски

| Риск | Как избежать |
|------|----------------|
| Два state (months/years) | Только `termMonths` |
| Slider 84 шага лагает на Android | step=1 допустим для MVP; при лаге — step=1 но snap на отпускании |
| Старые тесты на `adjustTermYears` | Переписать на months |
