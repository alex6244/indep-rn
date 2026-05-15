const base = require("./app.json");

const isEasBuild = process.env.EAS_BUILD === "true";
const buildProfile = process.env.EAS_BUILD_PROFILE;

/** Detox native hooks break EAS preview/production Gradle (dynamic `com.wix:detox:+`). */
const includeDetoxPlugin = !isEasBuild || buildProfile === "development";

const plugins = base.expo.plugins.filter((entry) => {
  const name = Array.isArray(entry) ? entry[0] : entry;
  return name !== "expo-detox-config-plugin";
});

if (includeDetoxPlugin) {
  plugins.push("expo-detox-config-plugin");
}

module.exports = {
  expo: {
    ...base.expo,
    plugins,
  },
};
