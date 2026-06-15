# Деплой ai-api на Selectel

Цель: `https://ai-api.indep.su/health` открывается с телефона, preview build ходит в API.

## Что деплоится

Не только папка `ai-api/`. На сервере нужен **весь репозиторий** (или эти пути):

```
indep-rn/
  ai-api/
  packages/ai-core/
  src/data/ai/          # fallback-каталог
```

Старт: `npm run start:prod` из `ai-api/` (через `tsx`, без `dist/`).

---

## Шаг 1. Сервер в Selectel

**Панель:** Продукты → VDS (или Облачные серверы).

| Параметр | Значение |
|----------|----------|
| ОС | Ubuntu 22.04 |
| vCPU / RAM | 2 / 2–4 GB |
| Диск | 20 GB |
| Сеть | публичный IPv4 |

Запиши **IP сервера**.

---

## Шаг 2. DNS

У регистратора домена `indep.su` (или в DNS Selectel):

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `ai-api` | `<IP сервера>` |

Проверка (с ПК, через 5–30 мин):

```bash
nslookup ai-api.indep.su
```

---

## Шаг 3. SSH и софт

```bash
ssh root@<IP>
apt update && apt upgrade -y
apt install -y git nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

---

## Шаг 4. Код на сервер

```bash
git clone <URL репозитория> /opt/indep-rn
cd /opt/indep-rn/ai-api
npm install
cp .env.example .env
nano .env
```

**Минимальный `.env` на prod:**

```env
PORT=8787
NODE_ENV=production
AI_API_CORS_ORIGINS=https://indep.su
AI_API_RATE_LIMIT_ENABLED=true
```

`AI_API_DEV_LEADS` на prod **не включать**.

---

## Шаг 5. Запуск через pm2

**Важно:** старт только из **корня монорепо**, не из отдельной папки `ai-api/`. В `ecosystem.config.cjs` задан `AI_API_REPO_ROOT` — иначе не найдутся `packages/ai-core` и `src/data/ai/`.

```bash
cd /opt/indep-rn
pm2 delete ai-api 2>/dev/null || true
pm2 start ai-api/ecosystem.config.cjs
pm2 save
pm2 startup   # выполни команду, которую выведет pm2
```

Проверка пути в pm2:

```bash
pm2 env ai-api | grep AI_API_REPO_ROOT
# ожидание: AI_API_REPO_ROOT=/opt/indep-rn
```

Локально на сервере:

```bash
curl -sS http://127.0.0.1:8787/health
```

Ожидание: `{"ok":true,"catalogCount":...,"catalogSource":"api"}` (или `seed`, если indep.su недоступен).

---

## Шаг 6. Nginx + HTTPS

```bash
cp /opt/indep-rn/ai-api/deploy/nginx-ai-api.conf.example \
   /etc/nginx/sites-available/ai-api.indep.su
ln -s /etc/nginx/sites-available/ai-api.indep.su /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d ai-api.indep.su
```

---

## Шаг 7. Проверка с телефона

В браузере на телефоне:

1. `https://ai-api.indep.su/health`
2. `https://ai-api.indep.su/v1/sites/indep/meta`

В приложении (preview): бургер → «Подбор с ИИ» → в шапке **«Каталог: с сайта (N)»**.

---

## Обновление после git push

```bash
cd /opt/indep-rn
git pull
cd ai-api && npm install
cd ..
pm2 delete ai-api 2>/dev/null || true
pm2 start ai-api/ecosystem.config.cjs
pm2 save
```

---

## Если основной сайт уже на этом же VPS

Можно не заказывать новый сервер — добавь `server_name ai-api.indep.su` и `proxy_pass` на `:8787` в существующий nginx, pm2 как выше.

---

## Частые проблемы

| Симптом | Решение |
|---------|---------|
| 502 Bad Gateway | `pm2 status` — процесс упал; `pm2 logs ai-api` |
| `catalogSource: seed`, мало машин | сервер не достучался до indep.su; проверь firewall / исходящий HTTPS |
| Приложение offline | неверный URL; в `eas.json` уже `https://ai-api.indep.su` |
| Crash при старте | клонирован не весь репо — нет `packages/ai-core` |

---

## После деплоя: smoke-deploy

На сервере (из клонированного репо, ai-api уже в pm2):

```bash
cd /opt/indep-rn/ai-api && npm run smoke:deploy
```

Проверяет монорепо-пути (`packages/ai-core`, `src/data/ai/`) и локальный `/health` (`catalogCount > 0`).

## Smoke (с ПК)

```bash
curl -sS https://ai-api.indep.su/health
curl -sS https://ai-api.indep.su/v1/sites/indep/meta
curl -sS -X POST https://ai-api.indep.su/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"siteId":"indep","phone":"+79991234567","carIds":["test"]}'
```
