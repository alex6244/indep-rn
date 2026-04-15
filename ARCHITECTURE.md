# Архитектура проекта INDEP RN

## Стек

- React Native + Expo SDK 54
- Expo Router 6 (file-based routing)
- TypeScript (strict mode)
- ESLint: `eslint-config-expo`

## Source Of Truth

- Роутинг и composition экранов: `src/app/**`
- Бизнес-фичи экранов: `src/features/**`
- Переиспользуемые крупные UI-блоки: `src/widgets/**`
- Глобальное auth-состояние: `src/contexts/AuthContext.tsx`
- Глобальное favorites-состояние: `src/contexts/FavoritesContext.tsx`
- API-клиент и сервисы: `src/services/**`
- Общие UI/тема/навигационные утилиты: `src/shared/**`

## Слои

- **UI / роуты**: `src/app/**`
  - `(tabs)` — основной таб-бар.
  - `(auth)` — модальный стек авторизации.
  - Дополнительные stack-экраны (например, `auto/[id]`).
- **Features**: `src/features/**`
  - Экранная бизнес-логика и feature-специфичные UI/хуки.
- **Widgets**: `src/widgets/**`
  - Переиспользуемые секции страниц.
- **Contexts**: `src/contexts/**`
  - Глобальные состояния (`AuthContext`, `FavoritesContext`).
- **Services**: `src/services/**`
  - API-клиент и доменные сервисы (`authService`, `carService`, `reportsService`).
- **Shared**: `src/shared/**`
  - Общие UI-компоненты, стили, конфиг, навигационные метрики.

### DTO vs Domain Rule

- API DTO типы (`ApiXxx`) живут только в `src/services/**`.
- UI/Features/Widgets/Contexts должны работать только с domain-типами из `src/types/**`.
- Mapping DTO -> Domain выполняется только внутри сервисов.
- Временный технический долг: error-контракты сервисов частично различаются; планируется унификация на `AppError`.

## Навигация

### Корневой стек (`src/app/_layout.tsx`)

- Все экраны обёрнуты в `AuthProvider`.
- Корневой Stack содержит:
  - `"(tabs)"`
  - `"(auth)"` (modal presentation)
  - `"auto/[id]"`

### Табы (`src/app/(tabs)/_layout.tsx`)

- Основные табы: `index`, `catalog`, `calls`, `profile`.
- `favorites` существует как роут, но скрыт из tab bar через `tabBarButton: () => null`.
- Для сохранения tab bar переходы в каталог должны использовать `"/(tabs)/catalog"`.

### Auth-экраны (`src/app/(auth)/**`)

- `src/app/(auth)/index.tsx` (login):
  - Поля: `email`, `password`.
  - Клиентская валидация + `InlineMessage`.
  - Вызов: `login({ email, password })`.
  - Успех: `router.replace("/(tabs)/profile")`.
- `src/app/(auth)/register.tsx` (register):
  - Поля: `name`, `email`, `password`, `confirmPassword`, `role`, agreement.
  - Клиентская валидация + `InlineMessage`.
  - Вызов: `register({ name, email, password, role })`.
  - Успех: `router.replace("/(tabs)/profile")`.

## Ключевые точки входа экранов

- `src/app/index.tsx` -> redirect на `/(tabs)`.
- `src/app/(tabs)/catalog.tsx` -> `src/features/catalog/ui/CatalogScreen.tsx`.
- `src/app/auto/[id].tsx` -> `src/features/auto/ui/AutoScreen.tsx`.
- `src/app/(tabs)/profile.tsx` -> профильный flow на базе `useAuth()` и `useProtected()`.

## Auth И Защита Действий

### `AuthContext` (`src/contexts/AuthContext.tsx`)

- Публичный контракт:
  - `login(credentials: { email: string; password: string }): Promise<{ success: true } | { success: false; error: { code: AuthErrorCode; message: string } }>`
  - `register(payload: { name: string; email: string; password: string; role: UserRole }): Promise<{ success: true } | { success: false; error: { code: AuthErrorCode; message: string } }>`
  - `logout(): Promise<void>`
  - `user: User | null`
  - `loading: boolean`
  - `authError: { code: AuthErrorCode; message: string } | null`
- Source переключается через `EXPO_PUBLIC_AUTH_SOURCE=mock|api`.
- При `api`-source сессия восстанавливается через токен и `me()`-проверку.
- `logout()` очищает токен и user-сессию.
- `reportsService` переключает источник отчётов через `EXPO_PUBLIC_REPORTS_SOURCE=mock|api` (по умолчанию `mock` для dev без backend).

### `useProtected` (`src/hooks/useProtected.ts`)

- `checkAuth({ redirectTo })`:
  - если `!user` -> `router.push(redirectTo)` и возврат `false`;
  - если `user` -> возврат `true`.
- Хук не показывает `Alert`.
- Для защиты всего экрана используется `useRequireAuth(redirectTo)`.

## API Client Policy

- Source of truth: `src/services/api.ts`.
- `ApiError(status, message)` — единый формат ошибок клиента.
- Timeout:
  - default: `10000ms`;
  - override: `EXPO_PUBLIC_API_TIMEOUT_MS` или `timeoutMs` в request options.
- Retry policy:
  - только idempotent-методы (`GET`, `HEAD`);
  - default до 2 ретраев с backoff;
  - ретраи только для `Request timeout`, `Network request failed`, `HTTP 502/503/504`.
- Manual abort:
  - `Request aborted` не ретраится.
- 401 policy:
  - preflight: access token проверяется по `exp`; при истечении выполняется refresh до запроса;
  - fallback: при `401` выполняется единичный refresh retry (deduplicated);
  - если refresh неуспешен: токены очищаются и вызывается `setUnauthorizedHandler(...)`.
- Non-JSON ответы и transport-ошибки нормализуются в предсказуемые `ApiError`.

## Текущая структура экранов

- Активные экранные entrypoints находятся в `src/app/**`.
- Экранные реализации находятся в `src/features/**` и `src/widgets/**`.
- Legacy-обёртка `src/screens/Catalog.jsx` удалена; `catalog` рендерится напрямую из `src/features/catalog/ui/CatalogScreen.tsx`.

## Правила добавления нового функционала

1. **Новый tab**
   - добавить `Tabs.Screen` в `src/app/(tabs)/_layout.tsx`;
   - создать `src/app/(tabs)/<name>.tsx`;
   - поместить бизнес-логику в `src/features/<feature>/ui/*`.
2. **Новый modal stack**
   - создать группу роутов `src/app/(group)/`;
   - зарегистрировать группу в `src/app/_layout.tsx`.
3. **Новый защищённый flow**
   - использовать `useAuth()` для screen-level состояния;
   - использовать `useProtected()` для action-level guard.

