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
  - `login(credentials: { email: string; password: string }): Promise<boolean>`
  - `register(payload: { name: string; email: string; password: string; role: UserRole }): Promise<boolean>`
  - `logout(): Promise<void>`
  - `user: User | null`
  - `loading: boolean`
  - `authError: "invalid_credentials" | "user_exists" | "network_error" | "unknown" | null`
- Source переключается через `EXPO_PUBLIC_AUTH_SOURCE=mock|api`.
- При `api`-source сессия восстанавливается через токен и `me()`-проверку.
- `logout()` очищает токен и user-сессию.

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
  - при `401` токен очищается через `tokenStorage.clear()`;
  - вызывается обработчик из `setUnauthorizedHandler(...)`;
  - наружу пробрасывается `ApiError(401, ...)`.
- Non-JSON ответы и transport-ошибки нормализуются в предсказуемые `ApiError`.

## Текущая структура экранов

- Активные экранные entrypoints находятся в `src/app/**`.
- Экранные реализации находятся в `src/features/**` и `src/widgets/**`.
- `src/screens/*` не используется как источник активного рендера.

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

