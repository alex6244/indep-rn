const base = require("./app.json");

const isEasBuild = process.env.EAS_BUILD === "true";
const buildProfile = process.env.EAS_BUILD_PROFILE;

/** Detox native hooks break EAS preview/production Gradle (dynamic `com.wix:detox:+`). */
const includeDetoxPlugin = !isEasBuild || buildProfile === "development";

/** Native Sentry Gradle hooks need org/project; skip until EXPO_PUBLIC_SENTRY_DSN is configured. */
const includeSentryPlugin = Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN?.trim());

const plugins = base.expo.plugins.filter((entry) => {
  const name = Array.isArray(entry) ? entry[0] : entry;
  return name !== "expo-detox-config-plugin" && name !== "@sentry/react-native/expo";
});

if (includeDetoxPlugin) {
  plugins.push("expo-detox-config-plugin");
}
if (includeSentryPlugin) {
  plugins.push("@sentry/react-native/expo");
}

module.exports = {
  expo: {
    ...base.expo,
    plugins,
  },
};
