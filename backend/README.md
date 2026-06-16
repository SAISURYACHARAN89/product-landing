# cursur backend

Standalone Express service that:
- receives Razorpay/PayPal payment webhooks, verifies their signature, generates a license key, and emails it via Resend
- exposes `POST /api/license/validate` for the desktop app to check a key

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/webhooks/razorpay` | Razorpay payment webhook |
| POST | `/api/webhooks/paypal` | PayPal payment webhook |
| POST | `/api/license/validate` | `{ "key": "..." }` → `{ "valid": true, "email": "...", "product": "cursur" }` |
| GET | `/health` | health check |

## Local development

```bash
cp .env.example .env   # fill in real values
npm install
npm run dev
```

## Deploying to AWS

Any option that can run a Node process or container works. Two common paths:

### Option A — Elastic Beanstalk / App Runner / ECS (Docker)

A `Dockerfile` is included.

```bash
docker build -t cursur-backend .
docker run -p 8080:8080 --env-file .env cursur-backend
```

Push the image to ECR and point App Runner, ECS, or Elastic Beanstalk's Docker platform at it. Set the env vars from `.env.example` in the service's environment configuration (not baked into the image).

### Option B — plain EC2 (no Docker)

```bash
git clone <your-repo>
cd backend
npm install
npm run build
# put real values in .env (see .env.example)
npm start          # or run under pm2 / systemd so it survives reboots/crashes
```

Put it behind nginx or an Application Load Balancer with an HTTPS certificate (ACM) — webhook providers require HTTPS.

## After deploying

1. Note the public HTTPS URL of the deployed backend, e.g. `https://api.cursur.app`.
2. In the **Razorpay Dashboard** → Webhooks, update the webhook URL to `https://api.cursur.app/api/webhooks/razorpay` (or keep `https://cursur.app/api/webhooks/razorpay` if you're routing that path to this backend via a reverse proxy/load balancer rule).
3. In the **PayPal Dashboard** → Webhooks, same for `https://api.cursur.app/api/webhooks/paypal`.
4. Point the desktop app's license validation call at `https://api.cursur.app/api/license/validate`.
5. Set `ALLOWED_ORIGIN=https://cursur.app` once everything works, to lock down CORS.
