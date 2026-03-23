# 03. Схема БД (PostgreSQL) для MVP

## 1) Логика данных (из фронта)
- Auth и роль пользователя: client и picker
- Favorites: избранные автомобили
- Catalog: автомобили и фильтры (статические/справочные поля плюс изображения)
- Reports: купленные отчеты и их детальная структура

## 2) Основные сущности

### users
- id (uuid or bigint)
- phone (unique)
- email (unique nullable)
- password_hash (nullable если внешняя auth система)
- name
- role (client, picker)
- status (active, blocked)
- created_at, updated_at

### refresh_tokens
- id
- user_id (FK users)
- token_hash
- device_id (optional)
- expires_at
- revoked_at (nullable)
- created_at

### cars
- id
- brand
- model or title
- price (numeric)
- year (int)
- mileage (int)
- engine (text)
- power (int)
- drive_type (text)
- address / city
- specs (jsonb)
- filter_flags (jsonb)
- status (active, archived)
- created_at

### car_media
- id
- car_id (FK cars)
- url
- sort_order
- media_type (image, scheme)

### reports
- id
- car_id (FK cars)
- price (numeric)
- title
- subtitle
- city
- cover_url
- carousel_urls (array or отдельная таблица)
- defects (jsonb)
- pts_data (jsonb)
- mileage_text
- owners (jsonb)
- legal_cleanliness (jsonb)
- commercial_usage (jsonb)
- penalties (jsonb array)
- cost_estimation (jsonb)
- year_text (optional)
- body_type_text (optional)

### report_purchases
- id
- user_id (FK users)
- report_id (FK reports)
- amount (numeric)
- paid_at
- provider_ref (optional)
- created_at

### favorites
- id
- user_id (FK users)
- car_id (FK cars)
- created_at

## 3) Связи (ERD, упрощенно)
- users 1 to N refresh_tokens
- users 1 to N report_purchases
- reports N to 1 cars
- users N to M cars через favorites

## 4) Индексы (для скорости catalog и access)
- cars: composite index по brand, model, year, price, mileage (или частичные индексы в зависимости от запросов)
- favorites: unique index (user_id, car_id)
- favorites: index по user_id
- reports: index по car_id

## 5) Замечания по медиа
- Рекомендуется хранить URL в БД (S3 keys)
- Генерацию изображений схем и PDF делать асинхронно позже (jobs/queue)

## 6) Миграционный план (MVP)
- Использовать PostgreSQL DDL из `docs/backend/sql/01-schema.sql` как стартовую миграцию.
- После подключения ORM (Prisma или Eloquent) привести DDL к генерации миграций через ORM.
- Добавить уточняющие enum/constraints под реальный словарь полей фильтров каталога.
