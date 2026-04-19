# Paytm-Style Wallet Monorepo

Production-oriented fintech monorepo built with Turborepo, Next.js, Express, Prisma, and PostgreSQL.

This project includes:
- User wallet app with add-money, transfer, P2P, and merchant payment flows.
- Merchant dashboard app with Google OAuth (NextAuth).
- Dedicated webhook service for bank + Stripe events.
- Shared database, UI, lint, and TypeScript packages.

## Highlights

- Stripe Checkout integration for wallet top-ups.
- Verified Stripe webhook handling with signature validation.
- Merchant payment tracking with `MerchantTransaction` model.
- Shared Prisma schema and generated client via `@repo/db`.
- Turborepo task orchestration for local development and builds.
- Recent real-time layer updates (WebSocket/event-stream friendly architecture).

## Monorepo Structure

```text
apps/
	user-app/         # Next.js user wallet app (port 3000)
	merchant-app/     # Next.js merchant app (port 3001)
	bank-webhook/     # Express webhook receiver (set PORT, recommended 4000)

packages/
	db/               # Prisma schema + client exports
	ui/               # Shared React UI components
	store/            # Shared state hooks/atoms
	eslint-config/    # Shared ESLint presets
	typescript-config/# Shared tsconfig presets
```

## Tech Stack

- Turborepo
- Next.js (App Router)
- Express.js
- Prisma + PostgreSQL
- NextAuth
- Stripe
- TypeScript



## Environment Variables

Create a root `.env` file (or per-app env files) with the following values:

```bash
# Core
DATABASE_URL="postgresql://..."
JWT_SECRET="replace-me"

# Merchant auth (Google)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="replace-me"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend callback URL used by Stripe session success/cancel redirect
NEXT_PUBLIC_URL="http://localhost:3000"

# Webhook service (set to avoid conflict with merchant app on 3001)
PORT=4000
```

Notes:
- Some code paths still include fallbacks like `STRIPE_ENV` / `STRIPE_Env`; standardize on `STRIPE_SECRET_KEY` for consistency.
- Turborepo currently exposes global env keys in `turbo.json`.

## Setup

```bash
npm install
```

Generate Prisma client:

```bash
npm run build --workspace=@repo/db
```

## Run Locally

Start all apps/packages with Turborepo:

```bash
npm run dev
```

Default local endpoints:
- User App: `http://localhost:3000`
- Merchant App: `http://localhost:3001`
- Bank/Webhook Service: `http://localhost:${PORT:-4000}`

## Stripe Payment Flow

1. User selects `Stripe (Credit/Debit)` in Add Money.
2. `createStripeSession` creates a Stripe Checkout Session and records an `OnRampTransaction` in `Processing` state.
3. Stripe sends `checkout.session.completed` event to `/stripeWebhook`.
4. Webhook verifies signature, increments user balance, and marks transaction `Success`.

Relevant files:
- `apps/user-app/app/lib/actions/createStripeSession.ts`
- `apps/user-app/components/AddMoneyCard.tsx`
- `apps/bank-webhook/src/index.ts`

## WebSocket / Real-Time Notes

Recent updates introduced a real-time communication layer for transaction-status aware UX.

Recommended documentation practice for maintainability:
- Keep event names versioned and consistent across backend and frontend.
- Centralize connection URL in env (example: `NEXT_PUBLIC_WS_URL`).
- Reconnect with exponential backoff and idempotent event handling.
- Treat webhook events as source of truth; use WebSocket updates for UI freshness.

## Scripts

Root scripts:

```bash
npm run dev      # turbo dev
npm run build    # turbo build
npm run lint     # turbo lint
npm run format   # prettier write
```

Targeted workspace examples:

```bash
npm run dev --workspace=merchant-app
npm run dev --workspace=docs            # user-app workspace name in package.json
npm run dev --workspace=bank-webhook
```

## Operational Tips

- Ensure `PORT` for `bank-webhook` does not clash with `merchant-app` (`3001`).
- Keep Prisma migrations committed under `packages/db/prisma/migrations`.
- Validate Stripe webhook signatures in all environments.
- Use separate secrets for development and production.

## Testing the Unified Flow

1. Run `npm run dev`.
2. In User App (`/transfer`), add money via Stripe.
3. Confirm Stripe redirects back to the app.
4. Verify webhook service logs successful event processing.
5. Confirm wallet balance update and transaction status change.
6. Open Merchant App and validate merchant-side transaction visibility.

## Future Improvements

- Add explicit `db:migrate` and `db:seed` root scripts.
- Add integration tests for Stripe webhook and replay protection.
- Document WebSocket contract (event schema, auth, retry policy).
- Add architecture diagram for money movement lifecycle.
