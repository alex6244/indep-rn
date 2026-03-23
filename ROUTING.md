# Expo Router — единая точка входа

**Корень маршрутов:** `./src/app` (задано в `app.json` → плагин `expo-router` с опцией `root`).

Ранее в репозитории дублировались корневой каталог `app/` (шаблон) и `src/app/` (приложение с `AuthProvider` / `FavoritesProvider`). Используется только **`src/app`**, чтобы не было двух разных `_layout` и конфликтов deep linking / typed routes.

**Стартовый экран:** `src/app/index.tsx` делает `<Redirect href="/(tabs)" />` — при открытии приложения сразу показывается домашний таб (`(tabs)/index.tsx`). Старый полноэкранный маркетинговый лендинг вынесен в **`src/app/landing.tsx`** (маршрут **`/landing`**).
