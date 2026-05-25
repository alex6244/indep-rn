# Demo checklist (boss presentation)

## `.env` (local, not committed)

```env
EXPO_PUBLIC_API_URL=https://indep.su/api/v1.0
EXPO_PUBLIC_AUTH_SOURCE=api
EXPO_PUBLIC_CATALOG_SOURCE=mock
EXPO_PUBLIC_REPORTS_SOURCE=mock
EXPO_PUBLIC_ALLOW_HTTP_DEV=false
```

Start:

```bash
npm run start:catalog:mock
# or: npx expo start  (after .env is set)
```

## 2–3 min script

1. Register / login (live API).
2. Catalog → filter → tap a car card → car details.
3. Heart icon → burger menu → **Избранное** → same car listed.
4. **Рассчитать в кредит** → adjust sliders → submit form → «Заявка отправлена».
5. Profile → reports banner / **Купить отчёт** → package modal (550 / 2000 / 4000 ₽).

## Avoid on demo

- Calls tab (hidden from tab bar).
- Cooperation menu item (removed from burger menu).
- Do not enable `EXPO_PUBLIC_CATALOG_SOURCE=api` until `GET /cars` works.

## Fallback

- Pre-login test account ready.
- Second phone number for registration if first fails.
