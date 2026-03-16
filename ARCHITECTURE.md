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
  - Состояние пользователя (`user`), методы `login`, `register`, `logout`, флаг `loading`.
  - Хранение пользователя в `AsyncStorage`.
  - Mock-пользователи для теста логина.
- **Защищённые действия**: `src/hooks/useProtected.ts`
  - `checkAuth({ message, redirectTo })` + `Alert` + редирект на `/(auth)`.
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
  <Tabs.Screen name="chat" options={{ title: "Чат" }} />
  <Tabs.Screen name="calls" options={{ title: "Звонки" }} />
  <Tabs.Screen name="profile" options={{ title: "Профиль" }} />
</Tabs>
```

- Все основные пользовательские разделы (главная, каталог, профиль и т.д.) находятся внутри `(tabs)`, поэтому нижняя панель всегда видна при навигации между ними.

### Авторизация (src/app/(auth)/**)

- `src/app/(auth)/index.tsx` — **логин**:
  - Поля: `login` (email/phone), `password`.
  - Вызывает `useAuth().login(login, password)` с mock-пользователями.
  - При успехе — `router.back()`.
  - Ссылка на `/(auth)/register`.
- `src/app/(auth)/register.tsx` — **регистрация**:
  - Поля: имя, телефон, тип пользователя (`client` / `picker`), чекбокс согласия.
  - Вызывает `useAuth().register(name, phone, role)`; сохраняет пользователя и делает `router.back()`.

## Ключевые экраны

### Главная (src/app/index.tsx)

- Адаптация главной страницы сайта под RN:
  - Хедер с логотипом, поиском и кнопками навигации (`Каталог`, `Подбор авто`, `Профиль`).
  - Hero-баннер.
  - Блок преимуществ.
  - Шаги “Хочу продать авто”.
  - Блок “Лучшие предложения” с карточкой авто.
- Навигация:
  - `router.push("/(tabs)/catalog")` — переход к вкладке каталога.
  - Кнопка “Профиль”:
    - гость → `/(auth)`,
    - авторизованный → `/(tabs)/profile`.
  - “Купить отчёт” использует `useProtected` для проверки авторизации.

### Каталог

- `src/app/catalog.tsx` — обёртка над существующим экраном каталога (можно рефакторить/типизировать отдельно).
- `src/app/(tabs)/catalog.tsx` — табовый роут:

```tsx
import Catalog from "../catalog";

export default function CatalogTab() {
  return <Catalog />;
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
- Рендерит `src/screens/Auto.jsx` и показывает отладочную строку `ID: {id}`.
- В дальнейшем можно заменить на typed-роут и реальный загрузчик данных по авто.

## Авторизация и защита действий

### AuthContext (src/contexts/AuthContext.tsx)

- Интерфейс `User`:
  - `id`, `login`, `password`, `role`, `name`, `phone`.
- Методы:
  - `login(login, password)`:
    - сверяет с `mockUsers.client` / `mockUsers.picker`,
    - сохраняет юзера в AsyncStorage,
    - устанавливает `user`.
  - `register(name, phone, role)`:
    - создаёт нового пользователя,
    - логин = телефон, пароль для демо = `"123"`,
    - роль задаётся явно (`"client"` / `"picker"`),
    - сохраняет в AsyncStorage.
  - `logout()` — очищает AsyncStorage и сбрасывает `user`.
- `loading` — флаг инициализации (чтения пользователя из AsyncStorage при старте).

### useProtected (src/hooks/useProtected.ts)

- Предназначен для **точечной защиты действий** (кнопок/операций), а не целых экранов.
- Интерфейс:

```ts
const { user, checkAuth } = useProtected();

if (!checkAuth({ message: "Авторизуйтесь, чтобы купить отчёт" })) {
  return;
}
// здесь уже точно есть user
```

- Поведение:
  - Если `user` отсутствует → `Alert("Доступ ограничен")` + редирект на `/(auth)` (или другой `redirectTo`).
  - Если `user` есть → `checkAuth` возвращает `true`.

## Наследие / что считать legacy

- Папки `app/*` и `src/screens/*` содержат наследованный код:
  - старые layout'ы Expo Router,
  - старые экраны (Auto, RegisterPage и пр.).
- Сейчас основной источник правды по роутам и логике — **`src/app/**` и `src/contexts/**`**.
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

