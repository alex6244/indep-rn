# Архитектура проекта INDEP RN

## Стек

- React Native + Expo SDK 54
- Expo Router 6 (file-based routing)
- TypeScript (строгий режим; основная пользовательская логика пока в JS/JSX)
- ESLint: `eslint-config-expo`

## Слои

- **UI / Роуты**: `src/app/**`
  - Expo Router страницы и layout'ы.
  - `(tabs)` — основной таб-бар.
  - `(auth)` — модальный стек авторизации.
  - Доп. стек-экраны (например, `auto/[id]`).
- **Авторизация**: `src/contexts/AuthContext.tsx`
  - Состояние пользователя (`user`), методы `login`, `register`, `logout`, флаги `loading` и `authError`.
  - Контракт: `login({ email, password })`, `register({ name, email, password, role })`.
  - Переключаемый source: `mock | api` через `EXPO_PUBLIC_AUTH_SOURCE`.
  - Сессия пользователя хранится в `AsyncStorage`, токен — через `tokenStorage` (SecureStore + fallback).
- **Защищённые действия**: `src/hooks/useProtected.ts`
  - `checkAuth({ redirectTo })`: при `!user` делает `router.push(redirectTo)` и возвращает `false`.
- **Инфраструктура**:
  - `metro.config.js` — SVG-трансформер.
  - `tsconfig.json` — базовый TS-конфиг (extends от Expo).
  - `app.json` — Expo-конфиг (иконки, splash, typedRoutes и т.п.).

## Навигация

### Стек (src/app/_layout.tsx)

```tsx
<AuthProvider>
  <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#F7F7F7" } }}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
    <Stack.Screen name="auto/[id]" />
  </Stack>
</AuthProvider>
```

- Все экраны завернуты в `AuthProvider`, чтобы `useAuth()` был доступен в любом роуте.
- Каталог живёт внутри табов (см. ниже), а не как отдельный стековый экран.

### Табы (src/app/(tabs)/_layout.tsx)

```tsx
<Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: "#DB4431",
  }}
>
  <Tabs.Screen name="index" options={{ title: "Главная" }} />
  <Tabs.Screen name="catalog" options={{ title: "Каталог" }} />
  <Tabs.Screen name="calls" options={{ title: "Звонки" }} />
  <Tabs.Screen name="profile" options={{ title: "Профиль" }} />
  <Tabs.Screen
    name="favorites"
    options={{
      title: "Избранное",
      tabBarButton: () => null,
    }}
  />
</Tabs>
```

- Нижняя панель видна при навигации между вкладками внутри `(tabs)`. `favorites` скрыт в таббаре, но доступен по роуту.

### Авторизация (src/app/(auth)/**)

- `src/app/(auth)/index.tsx` — **логин**:
  - Поля: `email`, `password`.
  - Валидация на клиенте + inline message для ошибок/информации.
  - Вызывает `useAuth().login({ email, password })`.
  - При успехе — `router.replace("/(tabs)/profile")`.
  - Ссылка на `/(auth)/register`.
- `src/app/(auth)/register.tsx` — **регистрация**:
  - Поля: `name`, `email`, `password`, `confirmPassword`, `role` (`client` / `picker`) + чекбокс согласия.
  - Валидация на клиенте + inline message для ошибок.
  - Вызывает `useAuth().register({ name, email, password, role })` и редиректит на `/(tabs)/profile`.

## Ключевые экраны

### Главная (src/app/index.tsx)

- При cold start `src/app/index.tsx` делает редирект на домашнюю вкладку: `/(tabs)`.

### Лендинг (src/app/landing.tsx)

- Старый полноэкранный маркетинговый контент вынесен в `src/app/landing.tsx`.
- Маршрут: `/landing`.

### Каталог

- `src/app/(tabs)/catalog.tsx` — табовый роут:

```tsx
import CatalogScreen from "../../features/catalog/ui/CatalogScreen";

export default function CatalogTab() {
  return <CatalogScreen />;
}
```

- Переходы в каталог с главной и других мест должны использовать `"/(tabs)/catalog"`, чтобы сохранить таб-бар.

### Профиль (src/app/(tabs)/profile.tsx)

- Использует `useAuth()` и `useProtected()`:
  - `loading === true` → спиннер и текст “Загрузка профиля…”.
  - `!user` → экран “Вы не авторизованы” с кнопками “Войти” (`/(auth)`) и “Регистрация” (`/(auth)/register`).
  - `user` → карточка профиля:
    - аватар с инициалами,
    - имя / логин,
    - телефон,
    - роль (`client` / `picker`),
    - кнопка “Мои объявления” (пока заглушка под будущий роут),
    - кнопка “Выйти” (`logout()`).

### Авто по id (src/app/auto/[id].tsx)

- Берёт `id` через `useLocalSearchParams()`.
- Рендерит `src/features/auto/ui/AutoScreen.tsx` и показывает отладочную строку `ID: {id}`.
- В дальнейшем можно заменить на typed-роут и реальный загрузчик данных по авто.

## Авторизация и защита действий

### AuthContext (src/contexts/AuthContext.tsx)

- Интерфейс `User`:
  - `id`, `login`, `role`, `name`, `phone`, `email?`.
- Методы:
  - `login({ email, password })`:
    - работает через выбранный gateway (`mock` или `api`),
    - при успехе сохраняет/обновляет user-сессию.
  - `register({ name, email, password, role })`:
    - работает через выбранный gateway (`mock` или `api`),
    - при успехе сохраняет/обновляет user-сессию.
  - `logout()` — очищает сессию и сбрасывает `user`.
- Состояния:
  - `loading` — инициализация/восстановление сессии;
  - `authError` — нормализованный код auth-ошибки (`invalid_credentials`, `user_exists`, `network_error`, `unknown`).
- Source selection:
  - `EXPO_PUBLIC_AUTH_SOURCE=mock|api`.

### useProtected (src/hooks/useProtected.ts)

- Предназначен для **точечной защиты действий** (кнопок/операций), а не целых экранов.
- Интерфейс:

```ts
const { user, checkAuth } = useProtected();

if (!checkAuth({ redirectTo: "/(auth)" })) {
  return;
}
// здесь уже точно есть user
```

- Поведение:
  - Если `user` отсутствует → редирект на `redirectTo` и `checkAuth` возвращает `false`.
  - Если `user` есть → `checkAuth` возвращает `true`.
- Для защиты экранов есть `useRequireAuth(redirectTo)` — редирект до рендера контента.

## API client policy

- Базовый клиент: `src/services/api.ts`.
- Timeout:
  - default `10000ms`,
  - можно переопределить через `EXPO_PUBLIC_API_TIMEOUT_MS` или `timeoutMs` в опциях запроса.
- Retry (селективный):
  - только для idempotent-методов (`GET/HEAD`),
  - по умолчанию до 2 ретраев с backoff,
  - только на `Request timeout`, `Network request failed`, `HTTP 502/503/504`.
- Manual abort:
  - `Request aborted` **не ретраится**.
- 401 flow (централизованный):
  - на `401` токен очищается (`tokenStorage.clear()`),
  - вызывается зарегистрированный unauthorized handler (`setUnauthorizedHandler`),
  - дальше пробрасывается `ApiError(401, ...)`.
- Ошибки нормализуются в `ApiError(status, message)` с fallback-сообщениями для non-JSON ответов.

## Наследие / что считать legacy

- Папки `app/*` и `src/screens/*` содержат наследованный код:
  - старые layout'ы Expo Router,
  - старые экраны (Auto, RegisterPage и пр.).
- Сейчас основной источник правды по роутам и логике — **`src/app/**` и `src/contexts/**`**.
- Текущие рабочие экранные компоненты:
  - `src/features/catalog/ui/CatalogScreen.jsx`
  - `src/features/auto/ui/AutoScreen.tsx`
- Legacy экраны из `src/screens/*` удалены из активного рендера и очищены как мёртвый код.
- Рекомендуется:
  - новые экраны и фичи добавлять только в `src/app/**`,
  - постепенно мигрировать полезное из `src/screens/**` и удалять неиспользуемое.

## Как добавлять новые разделы

1. **Новый таб**:
   - добавьте `Tabs.Screen` в `src/app/(tabs)/_layout.tsx`,
   - создайте `src/app/(tabs)/<name>.tsx` и реализуйте экран.
2. **Новый модальный стек (auth-подобный)**:
   - создайте папку `src/app/(something)/`,
   - добавьте `<Stack.Screen name="(something)" options={{ presentation: "modal" }} />` в `_layout.tsx`.
3. **Новый защищённый экран/действие**:
   - используйте `useAuth()` для экрана или `useProtected()` для действий/кнопок.

