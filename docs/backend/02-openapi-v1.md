# 02. API контракт (REST v1) совместимый с NestJS и Laravel

## Принципы
- Все эндпоинты под префиксом /v1
- Формат ответа: { data: ..., meta?: ... }
- Формат ошибки: { error: { code, message, details?, requestId? } }

## Коды ошибок (code)
- VALIDATION_ERROR
- UNAUTHENTICATED
- FORBIDDEN
- NOT_FOUND
- CONFLICT
- RATE_LIMITED
- INTERNAL

## DTO (минимум для MVP)
### Auth
- RegisterRequest: name, phone, email, role (client or picker)
- LoginRequest: phone, email
- AuthTokens: accessToken, refreshToken, expiresInSeconds

### Me
- MeResponse: id, role, name, phone, email?

### Catalog filters (query)
- brand, model, paymentType (cash or credit)
- priceFrom, priceTo
- yearFrom, yearTo
- mileageFrom, mileageTo
- bodyTypes (array)
- features (array)
- flags: hasDiscount, vatReturn, weeklyOffer
- pagination: page + limit или cursor + limit

### Favorites
- list: возвращает items массива CarSummary
- idempotent add/remove по carId

### Reports
- ReportSummary: id, price, title, subtitle, city, imageUrl
- ReportDetails: см. структуру из src/data/reports.ts (defects, ptsData, mileageText, owners, legalCleanliness, commercialUsage, penalties, costEstimation)

## Endpoint-группы (MVP v1)
### Auth
- POST /v1/auth/register
- POST /v1/auth/login
- POST /v1/auth/refresh
- POST /v1/auth/logout
- GET /v1/me

### Catalog
- GET /v1/cars
- GET /v1/cars/{carId}

### Favorites
- GET /v1/favorites
- POST /v1/favorites/{carId}
- DELETE /v1/favorites/{carId}

### Reports
- GET /v1/reports
- GET /v1/reports/{reportId}
- POST /v1/reports/{reportId}/purchase
- GET /v1/reports/{reportId}/pdf (пока может возвращать 501 Not Implemented)

## Нотации для реализации
- refreshToken хранить в БД как хэш
- purchase и favorites должны быть идемпотентными по userId и resourceId
- запросы catalog должны поддерживать стабильную пагинацию
