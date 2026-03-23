# 05. Реализация MVP на Laravel (REST API + Auth + БД)

## Цель
Реализовать v1 контракт: Auth, Catalog (cars + filters), Favorites, Reports.

## 1) Структура проекта (feature-oriented)
- app
  - Http
    - Controllers
      - AuthController
      - UsersController (me)
      - CarsController
      - FavoritesController
      - ReportsController
    - Requests
      - AuthRegisterRequest
      - AuthLoginRequest
      - RefreshRequest
      - FavoritesUpsertRequest
      - CarsFilterRequest
      - PurchaseReportRequest
    - Resources
      - UserResource
      - CarSummaryResource
      - ReportSummaryResource
      - ReportDetailsResource
    - Middleware
      - AuthMiddleware (проверка access token)
      - RequestIdMiddleware
      - RateLimitMiddleware

- app
  - Models
    - User
    - RefreshToken
    - Car
    - Report
    - Favorite
    - ReportPurchase

## 2) Роутинг
- routes/api.php
  - v1 prefix
  - Route::post auth register/login/refresh/logout
  - Route::get me
  - Route::get cars
  - Route::get cars carId
  - Route::get favorites
  - Route::post favorites carId
  - Route::delete favorites carId
  - Route::get reports
  - Route::get reports reportId
  - Route::post reports reportId purchase
  - Route::get reports reportId pdf (optional)

## 3) Auth (Laravel)
Вариант для MVP:
- Sanctum token-based auth (для мобильного клиента)
- Access token: JWT или Sanctum personal access token
- Refresh token таблица (refresh_tokens) как hashed значения

Общий flow:
- register создаёт пользователя и роль
- login выдаёт access+refresh
- refresh вращает refresh token (revoke старый, issue новый)
- logout отзывает refresh token в БД

## 4) Middleware и ответы
- Auth middleware подставляет текущего пользователя в request (например request user)
- Rate limit (throttle) и request-id для корреляции
- Единый формат ошибок через Handler (непосредственно в app/Exceptions/Handler.php)

## 5) Eloquent и связи
- Favorites: belongsTo user, belongsTo car; уникальность unique(user_id, car_id)
- Reports: belongsTo car
- Purchases: belongsTo user, belongsTo report
- Media: либо отдельная таблица car_media, либо jsonb внутри car

## 6) Resources (DTO слой)
- Использовать API Resources для:
  - CarSummaryResource
  - ReportSummaryResource
  - ReportDetailsResource
- Это даст единый контракт и позволит поддерживать изменения без поломки фронта.

## 7) Валидация
- FormRequest для каждого endpoint DTO контракта
- Формат ошибок в Handler привести к контрактному формату из v1.

## 8) Swagger/OpenAPI
- Laravel OpenAPI (например package) или генерация вручную из контрактного markdown
- Главное: сохранить соответствие v1 спецификации (docs/backend/02-openapi-v1.md)
