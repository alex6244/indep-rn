# 04. Реализация MVP на NestJS (REST API + Auth + БД)

## Цель
Реализовать v1 контракт, совместимый с фронтом: Auth, Catalog cars, Favorites, Reports.

## 1) Структура проекта (feature-based)
- src
  - auth
    - auth.module.ts
    - auth.controller.ts
    - auth.service.ts
    - dto
    - guards
    - jwt
  - users
    - users.module.ts
    - users.controller.ts
    - users.service.ts
  - catalog
    - catalog.module.ts
    - catalog.controller.ts
    - catalog.service.ts
    - dto
  - favorites
    - favorites.module.ts
    - favorites.controller.ts
    - favorites.service.ts
    - dto
  - reports
    - reports.module.ts
    - reports.controller.ts
    - reports.service.ts
    - dto
  - common
    - decorators (CurrentUser)
    - filters (HttpException filter)
    - interceptors (requestId)
    - errors (error codes)

## 2) Контроллеры (transport layer)
Контроллеры отвечают за:
- маршруты и валидацию входных DTO
- маппинг коды ошибок в единый формат
- возврат response формата { data, meta }

### AuthController
- POST v1 auth register
- POST v1 auth login
- POST v1 auth refresh
- POST v1 auth logout
- GET v1 me (или отдельный UsersController)

### CatalogController
- GET v1 cars с query DTO (фильтры, пагинация)
- GET v1 cars carId

### FavoritesController
- GET v1 favorites
- POST v1 favorites carId
- DELETE v1 favorites carId

### ReportsController
- GET v1 reports
- GET v1 reports reportId
- POST v1 reports reportId purchase
- GET v1 reports reportId pdf (опционально)

## 3) Сервисы (use-cases)
- AuthService
  - register: создание user, хэширование пароля (если нужно)
  - login: проверка, генерация access и refresh, сохранение refresh token hash
  - refresh: rotation refresh tokens, revoke старый
  - logout: revoke refresh token
- CatalogService
  - build filters из DTO
  - query cars с пагинацией
- FavoritesService
  - idempotent add/remove
- ReportsService
  - list and get details
  - purchase: проверка что user имеет доступ, запись report_purchases

## 4) ORM и модель данных
Вариант А: Prisma
- schema.prisma с моделями users, refresh_tokens, cars, car_media, reports, favorites, report_purchases
- отдельные репозитории или прямые вызовы Prisma client внутри сервисов

## 5) Auth слой
- Access token: JWT short-lived
- Refresh token: hashed и хранится в refresh_tokens
- Guard: JwtAuthGuard для доступа к /me, favorites, purchase
- Decorator CurrentUser возвращает user id и role

## 6) Валидация и ошибки
- class-validator и class-transformer для DTO
- единый ExceptionFilter переводит ошибки в формат:
  - error.code
  - error.message
  - error.details
  - error.requestId

## 7) Документация
- nestjs/swagger с генерацией OpenAPI по контракту v1.
