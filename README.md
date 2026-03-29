# Paytm-Style Wallet Monorepo

Production oriented fintech monorepo built with Turborepo, Next.js, Express, Prisma, and PostgreSQL.

This project includes:
- User wallet app with add money, transfer, P2P, and merchant payment flows.
- Merchant dashboard app with Google OAuth (NextAuth).
- Dedicated webhook service for bank + Stripe events.
- Shared database, UI, lint, and TypeScript packages.

## Highlights

- Stripe Checkout integration for wallet topups.
- Verified Stripe webhook handling with signature validation.
- Merchant payment tracking with `MerchantTransaction` model.
- Shared Prisma schema and generated client via `@repo/db`.
- Turborepo task orchestration for local development and builds.

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

Create a root `.env` file (or per app env files) with the following values:

```bash
# Core
DATABASE_URL=""
JWT_SECRET=""

# Merchant auth (Google)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
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

