# 01. Аудит фронта (мобильные сценарии -> API домены)

## 1) Контекст
- Приложение: React Native + Expo Router (роуты в src/app/**).
- Auth/Избранное: локальные контексты (src/contexts/AuthContext.tsx, src/contexts/FavoritesContext.tsx).
- Данные (пока мок): src/data/users.ts, src/data/cars.ts, src/data/reports.ts.

## 2) Роуты и экраны (что нужно покрыть API v1)
- Auth: (auth)/index (login), (auth)/register (register).
- Catalog: (tabs)/catalog -> legacy UI src/screens/Catalog.jsx с фильтрами.
- Favorites: (tabs)/favorites (UI-заглушка) и переключение favorites в каталоге.
- Profile: (tabs)/profile (picker/client) и история/доступ к reports.
- Reports: reports + reports/[id], действия (пока Alert).
- Auto: auto/[id] (placeholder).

## 3) Данные/сущности для контракта
- User: id, role (client/picker), name, phone, email. (Источник: src/data/users.ts)
- Car: id, brand/title, price, year, mileage, engine/power/driveType/address, изображения, флаги для фильтров. (Источник: src/data/cars.ts)
- Report: id, price/title/subtitle/city, набор изображений, дефекты, PTS/владельцы, признаки legal/commercial, penalties, cost estimation. (Источник: src/data/reports.ts)
- Favorites: хранение списка favoriteIds в AsyncStorage (@favorites).

## 4) Контрактный MVP (какие endpoint-группы понадобятся)
1) Auth: register/login/refresh/logout + GET /me.
2) Catalog: GET /cars (фильтры + пагинация) и GET /cars/{id}.
3) Favorites: GET /favorites, POST /favorites/{carId}, DELETE /favorites/{carId}.
4) Reports: GET /reports, GET /reports/{id}, POST /reports/{id}/purchase, GET /reports/{id}/pdf (можно later).

## 5) Нефункциональные требования
- Предсказуемые ошибки (для Alert/UX).
- Идемпотентность favorites и purchase.
- Опциональная поддержка пагинации/курсорного формата для каталога.
