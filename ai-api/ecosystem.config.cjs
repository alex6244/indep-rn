/** pm2: из корня репо — pm2 start ai-api/ecosystem.config.cjs */
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

module.exports = {
  apps: [
    {
      name: "ai-api",
      cwd: path.join(repoRoot, "ai-api"),
      script: "npm",
      args: "run start:prod",
      env: {
        NODE_ENV: "production",
        PORT: "8787",
        /** Корень монорепо (packages/ai-core, src/data/ai). Обязателен, если cwd не внутри indep-rn. */
        AI_API_REPO_ROOT: repoRoot,
      },
    },
  ],
};
