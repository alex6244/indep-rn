# Чеклист: auth и security (без ИИ)

Проверка перед prod / внешним демо.  
Окружение для api-режима: `EXPO_PUBLIC_AUTH_SOURCE=api`, `EXPO_PUBLIC_API_URL=https://indep.su/api/v1.0` (профиль EAS **`preview`** или **`production`**, не `preview-mock`).

---

## 1. Production: insecure fallback и токены

### 1.1 Env в сборках

| # | Проверка | Ожидание | ✓ |
|---|----------|----------|---|
| 1.1.1 | `eas.json` → `preview` / `production` | `EXPO_PUBLIC_ALLOW_INSECURE_TOKEN_STORAGE=false` | ☐ |
| 1.1.2 | `eas.json` → `preview` / `production` | `EXPO_PUBLIC_ALLOW_HTTP_DEV=false` | ☐ |
| 1.1.3 | Prod-сборка **без** `.env.local`, переопределяющего insecure flags | Только env из `eas.json` + EAS secrets | ☐ |
| 1.1.4 | `EXPO_PUBLIC_AUTH_SOURCE=api` в prod/preview (не mock) | Реальный бэкенд auth | ☐ |

### 1.2 Хранение токенов

| # | Проверка | Ожидание | ✓ |
|---|----------|----------|---|
| 1.2.1 | После login/confirm токен в SecureStore (не только AsyncStorage) | `api.ts`: fallback на AsyncStorage только при `ALLOW_INSECURE=true` | ☐ |
| 1.2.2 | С `ALLOW_INSECURE=false` refresh token не читается из AsyncStorage | Только SecureStore / in-memory | ☐ |
| 1.2.3 | Logout очищает token + refresh + `@auth/user` | Повторный вход требует OTP/логин | ☐ |

### 1.3 Логи и аналитика

| # | Проверка | Ожидание | ✓ |
|---|----------|----------|---|
| 1.3.1 | Grep: `console.log` / `console.info` с token, Bearer, password | Нет в `src/` (кроме тестов) | ☐ |
| 1.3.2 | Sentry: при тестовой ошибке API в breadcrumb/context **нет** access/refresh token | При необходимости — scrub в `beforeSend` | ☐ |
| 1.3.3 | Telemetry (`__INDEP_REPORT_TELEMETRY__`) не шлёт токены и код OTP | Только имена событий и безопасные атрибуты | ☐ |
| 1.3.4 | `EXPO_PUBLIC_SENTRY_DSN` — публичный DSN ок; `SENTRY_AUTH_TOKEN` только в CI | Не в `EXPO_PUBLIC_*` | ☐ |

---

## 2. Ротация засвеченных кредов (ops + бэкенд)

> Не в коде мобилки — отметить ответственного и дату.

| # | Действие | Сделано | Дата | ✓ |
|---|----------|---------|------|---|
| 2.1 | Инвентарь: что могло засветиться (SMTP, admin, БД, API keys) | | | ☐ |
| 2.2 | Сменить пароли / ключи SMTP | | | ☐ |
| 2.3 | Сменить пароли админок (staging/prod) | | | ☐ |
| 2.4 | Отозвать старые refresh/session на бэке (если применимо) | | | ☐ |
| 2.5 | Обновить секреты в CI/EAS (не коммитить в git) | | | ☐ |
| 2.6 | Проверить: старые креды **не** работают | | | ☐ |
| 2.7 | Mock-пароли в `src/data/users.ts` **не** используются в prod (`AUTH_SOURCE=api`) | | | ☐ |

---

## 3. Ошибки auth: неверный код, rate limit, сеть, 5xx

### 3.1 Unit-тесты (локально)

```bash
npm test -- --testPathPattern="authService|AuthContext|api.test"
```

| # | Сценарий | Тест есть | Проходит | ✓ |
|---|----------|-----------|----------|---|
| 3.1.1 | confirm: 422 неверный код → `validation_error` + текст бэка | `authService.test.ts` | | ☐ |
| 3.1.2 | confirm: 429 → `rate_limited` | `authService.test.ts` | | ☐ |
| 3.1.3 | confirm: 500 → `server_error` | `authService.test.ts` | | ☐ |
| 3.1.4 | login/transport: network → `network_error` | `authService.test.ts` | | ☐ |
| 3.1.5 | API envelope RATE_LIMITED → `rate_limited` | `api.test.ts` | | ☐ |
| 3.1.6 | AuthContext: confirm fail → UI error object | `AuthContext.test.tsx` | | ☐ |
| 3.1.7 | requestVerification: 429 / network / 5xx | Дописать при отсутствии | | ☐ |

### 3.2 Ручной QA на staging (реальный API)

Сборка/запуск: `AUTH_SOURCE=api`, реальный `indep.su` API.

| # | Действие | Ожидаемый текст / поведение | ✓ |
|---|----------|----------------------------|---|
| 3.2.1 | Ввести **неверный** 6-значный код | Сообщение об ошибке (422), остаёмся на шаге confirm, можно ввести снова | ☐ |
| 3.2.2 | Истёкший код (если есть на бэке) | Текст от бэка или «Проверьте корректность…» | ☐ |
| 3.2.3 | Rate limit: много запросов кода / confirm подряд | «Слишком много попыток. Попробуйте позже.» | ☐ |
| 3.2.4 | Режим полёта / отключить Wi‑Fi на confirm | «Сервис авторизации недоступен или нет сети…» | ☐ |
| 3.2.5 | 5xx (согласовать с бэком или mock proxy) | «Сервис временно недоступен…» или текст бэка | ☐ |
| 3.2.6 | Некорректный email на request | «Введите корректный e-mail.» (клиентская валидация) | ☐ |
| 3.2.7 | Код не 6 цифр | «Введите 6-значный код подтверждения.» | ☐ |

Зафиксировать фактические тексты (скрин или копипаст) в комментарии к релизу.

---

## 4. Полный OTP-flow в api-режиме + сессия после перезапуска

### 4.1 Happy path

| # | Шаг | Ожидание | ✓ |
|---|-----|----------|---|
| 4.1.1 | Открыть приложение без сессии | Экран логина / редирект на auth | ☐ |
| 4.1.2 | Ввести email → «Получить код» | Успех, переход на шаг ввода кода, таймер resend ~60 с | ☐ |
| 4.1.3 | Письмо с кодом пришло | SMTP/бэкенд работает | ☐ |
| 4.1.4 | Ввести верный код | Редирект в `/(tabs)/profile`, пользователь залогинен | ☐ |
| 4.1.5 | Закрытые табы / каталог доступны согласно роли | Нет принудительного logout | ☐ |

### 4.2 Восстановление сессии

| # | Шаг | Ожидание | ✓ |
|---|-----|----------|---|
| 4.2.1 | После успешного входа **полностью убить** приложение (swipe away) | — | ☐ |
| 4.2.2 | Открыть снова | **Без** повторного OTP: сразу профиль / главный флоу | ☐ |
| 4.2.3 | `checkAuth` → `GET /me` с сохранённым токеном | 200, user в state | ☐ |
| 4.2.4 | Протухший/отозванный токен на бэке | Logout, экран auth, токен очищен | ☐ |

### 4.3 Logout

| # | Шаг | Ожидание | ✓ |
|---|-----|----------|---|
| 4.3.1 | Выход из профиля | `user = null`, auth экран | ☐ |
| 4.3.2 | Перезапуск после logout | Снова требуется вход | ☐ |

### 4.4 Регистрация (если в scope)

| # | Шаг | Ожидание | ✓ |
|---|-----|----------|---|
| 4.4.1 | `/(auth)/register` → request code → confirm | Аналогично логину, роль client/picker | ☐ |

---

## 5. Быстрые команды

```bash
# Typecheck + auth-тесты
npm run typecheck
npm test -- --testPathPattern="authService|AuthContext|api.test|getUserErrorMessage"

# Dev api-режим (локально)
# .env: EXPO_PUBLIC_AUTH_SOURCE=api
npx expo start --lan

# APK api-режим (не mock)
npx eas build -p android --profile preview
```

---

## 6. Критерий «готово к prod auth»

Все пункты отмечены:

- [ ] **§1** — insecure fallback выкл, токены не в логах/Sentry  
- [ ] **§2** — креды ротированы (или явно N/A с подписью)  
- [ ] **§3** — unit + ручной QA по ошибкам задокументированы  
- [ ] **§4** — OTP happy path + перезапуск + logout на staging  

---

## Связанные файлы

| Область | Путь |
|---------|------|
| OTP UI | `src/app/(auth)/index.tsx`, `register.tsx` |
| Auth state | `src/contexts/AuthContext.tsx` |
| API auth | `src/services/authService.ts`, `api.ts` |
| EAS env | `eas.json` |
| Hardening (бэкенд) | `docs/backend/06-hardening-checklist.md` |

---

**Проверил:** _______________  
**Дата:** _______________  
**Сборка / профиль:** _______________  
**API URL:** _______________
