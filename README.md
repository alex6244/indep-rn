# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside `src/app`. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

For navigation details (Expo Router groups and start route) see `ROUTING.md`.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Theme Colors

- Use `src/shared/theme/colors.ts` as the single source of truth for UI colors.
- Prefer semantic tokens (`colors.surface.card`, `colors.text.primary`, `colors.brand.primary`) over raw `#hex` values.
- Add new colors only when a semantic token does not already fit.
- Keep raw colors out of components; the only acceptable exceptions are explicit platform shadow presets where React Native APIs require inline shadow values.

## Reliability And Monitoring

- Enable Sentry by setting `EXPO_PUBLIC_SENTRY_DSN` and `EXPO_PUBLIC_SENTRY_ENVIRONMENT` in runtime env.
- The app initializes Sentry in `src/app/_layout.tsx` and routes `reportError/reportTelemetry` through a monitoring adapter.
- Request aborts are treated as expected control flow and are not captured as critical incidents.
- `api.ts` classifies failures into `network`, `timeout`, `aborted`, `unauthorized`, `not_found`, `server_error`, `unknown`.
- `carService` and `reportsService` validate API payloads with Zod before domain mapping and throw controlled `AppError` on schema mismatch.
- For sourcemaps upload in CI/EAS, keep `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` only in CI secrets (never in `EXPO_PUBLIC_*`).
- Incidents and traces are viewed in your Sentry project dashboard; use `environment`, `release`, `platform`, `app_version` tags to filter.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
