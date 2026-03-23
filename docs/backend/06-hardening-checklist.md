# 06. Hardening чек-лист (перед продакшеном)

## 1) Безопасность (Security)
- Auth
  - refresh tokens хранить как хэши в БД
  - rotation refresh tokens (revoke старого при refresh)
  - защищать все protected endpoints access token guard
  - logout удаляет (revokes) текущий refresh token в БД
- Rate limiting
  - rate limit на auth endpoints и на cars search (особенно на query)
  - отдельные лимиты по userId и по IP
- Защита от массовых действий
  - favorites add/remove: идемпотентность и защита от race conditions (unique constraint + upsert)
  - reports purchase: идемпотентность по user_id + report_id
- Ошибки
  - не возвращать stack traces клиенту
  - единый формат ошибок из контракта v1

## 2) Производительность (Performance)
- Catalog caching
  - кэшировать результаты GET /cars по стабилизированному query key
  - invalidation при обновлении справочных данных
- Pagination
  - cursor-based pagination вместо page-based для стабильности (если каталог большой)
- Media
  - отдавать изображения/PDF через CDN или signed URLs (S3)

## 3) Observability (Наблюдаемость)
- request-id
  - middleware добавляет requestId в ответ и лог
- структурированные логи
  - единый формат логов (например JSON)
  - включить correlation id во все записи
- health / readiness
  - /healthz: быстрый self-check
  - /readyz: readiness для зависимостей (DB, Redis)
- мониторинг ошибок
  - собрать метрики по кодам ошибок и времени ответа

## 4) Reliability (Надёжность)
- Idempotency keys
  - purchase и favorites поддерживают repeat without side effects
- Retries и timeouts
  - разумные timeouts на вызовы медиа/БД
  - ретраи только для safe operations

## 5) Документация и соответствие контракту
- OpenAPI v1
  - контролировать соответствие реализации docs/backend/02-openapi-v1.md
- Contract tests
  - хотя бы smoke tests на основные endpoints

## 6) Пример списка задач для команды
- Backend: включить глобальный error handler
- Backend: добавить middleware request-id
- Backend: настроить rate limit (auth и cars)
- Backend: реализовать caching слой для catalog
- Backend: подключить генерацию подписанных URL для медиа
- Backend: добавить healthz/readyz
