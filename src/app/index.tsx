import { Redirect, type Href } from "expo-router";

/**
 * Cold start: show tab home (`(tabs)/index`), not the legacy marketing page.
 * Legacy full layout lives in `landing.tsx` → route `/landing`.
 */
export default function Index() {
  return <Redirect href={"/(tabs)" as Href} />;
}
