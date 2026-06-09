# Staging contract test: OTP auth

Opt-in smoke против **живого** API (`https://indep.su/api/v1.0` или staging). Не входит в обычный `npm test`.

Unit-тесты `authService.test.ts` мокают `api` — они не заменяют этот suite.

## Запуск

```bash
CONTRACT_TEST=1 \
CONTRACT_API_URL=https://indep.su/api/v1.0 \
CONTRACT_AUTH_EMAIL=your-test@example.com \
CONTRACT_AUTH_OTP=123456 \
npm run test:contract:auth
```

Windows (PowerShell):

```powershell
$env:CONTRACT_TEST="1"
$env:CONTRACT_API_URL="https://indep.su/api/v1.0"
$env:CONTRACT_AUTH_EMAIL="your-test@example.com"
$env:CONTRACT_AUTH_OTP="123456"
npm run test:contract:auth
```

## Env

| Переменная | Обязательна | Назначение |
|------------|-------------|------------|
| `CONTRACT_TEST` | да (`1`) | Включает suite |
| `CONTRACT_API_URL` | нет | Base URL (default: `https://indep.su/api/v1.0`) |
| `CONTRACT_AUTH_EMAIL` | для happy path | Тестовый email на staging |
| `CONTRACT_AUTH_OTP` | для happy path | OTP после request (или staging bypass) |
| `CONTRACT_AUTH_NAME` | нет | Имя для register-flow |
| `CONTRACT_AUTH_ROLE` | нет | `client` \| `picker` (picker → `realtor` в API) |

Если `CONTRACT_AUTH_EMAIL` или `CONTRACT_AUTH_OTP` не заданы — happy path **пропускается** с предупреждением в консоли (тесты не падают).

## Сценарии

1. `POST /auth/request-verification` → 2xx
2. `POST /auth/confirm-verification` + `GET /me` → токен в ответе, `me` 200 с `id` + `email`
3. `POST /auth/confirm-verification` с кодом `000000` → 4xx + тело ошибки

## CI

Workflow `.github/workflows/contract-auth.yml` — только `workflow_dispatch`, secrets:

- `CONTRACT_API_URL`
- `CONTRACT_AUTH_EMAIL`
- `CONTRACT_AUTH_OTP`

Перед preview/production release — запустить вручную.

## Что спросить у бэкенда

- Тестовый email без спама prod
- Фиксированный OTP или test bypass на staging
- Фактический JSON confirm (`api_token` vs `token` vs `{ data }`)

## Файлы

- `src/services/__tests__/authService.staging.contract.test.ts`
- `src/services/__tests__/helpers/contractAuth.ts`
