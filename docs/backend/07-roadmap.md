# 07. Роудмап проекта (MVP -> Production -> Scale)

## Этап A. Discovery (1-2 недели)
1. Front-audit: карта сценариев, сущностей и текущих mock-данных.
2. API contract v1: endpoint-группы, error codes, DTO, пагинация, единый формат ошибок.
3. DB design: ERD, миграционный план, выбор стратегий для enums/jsonb.
4. OpenAPI/контрактные тесты: smoke-кейс для каждого endpoint-группы.

## Этап B. Core backend MVP (2-4 недели)
Реализовать в выбранном стеке:
- Auth: register/login/refresh/logout + GET /me
- Catalog: GET /cars (фильтры + пагинация)
- Favorites: GET /favorites, add/remove idempotently
- Reports: GET /reports, GET /reports/{id}, purchase (запись в report_purchases)

## Этап C. Production hardening (1-2 недели)
- request-id и structured logging
- rate limit (auth и cars)
- caching для каталога
- healthz/readyz
- security checklist по OWASP API Top 10

## Этап D. Scale prep
- выделение jobs/очередей для медиа/PDF
- декомпозиция по доменам и event-contracts
- подготовка к микросервисам (если появится потребность)
