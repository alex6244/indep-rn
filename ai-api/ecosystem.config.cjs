/** pm2: из корня репо — pm2 start ai-api/ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "ai-api",
      cwd: __dirname,
      script: "npm",
      args: "run start:prod",
      env: {
        NODE_ENV: "production",
        PORT: "8787",
      },
    },
  ],
};
