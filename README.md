# Mo Style Hub

A full-stack luxury fashion e-commerce store built with Next.js 16, Prisma, Stripe, and Resend.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL via Prisma 5 |
| Auth | NextAuth v5 (credentials, JWT) |
| Payments | Stripe Checkout |
| Email | Resend |
| State | Zustand |
| Styling | Tailwind CSS 4 |
| Images | Cloudinary (unsigned upload) |

---

## Local Development

### 1. Clone and install

```bash
git clone <your-repo-url>
cd mo-style-hub
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local` — see the [Environment Variables](#environment-variables) section below.

### 3. Set up the database

```bash
# Push schema to your database and generate the Prisma client
npx prisma migrate deploy
npx prisma generate

# (Optional) Seed with sample categories, products, and an admin user
npm run db:seed
```

The seed creates:
- 3 categories (Women, Men, Accessories)
- 8 sample products with variants
- Admin account: `admin@mostylehub.com` / `admin123`

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Run Stripe webhook locally

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` secret it prints and set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (pooled) |
| `DIRECT_URL` | PostgreSQL direct connection string (for migrations) |
| `AUTH_SECRET` | Random secret for NextAuth — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full URL of your app, e.g. `https://yourapp.vercel.app` |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |
| `EMAIL_FROM` | Verified sender address, e.g. `Mo Style Hub <orders@yourdomain.com>` |
| `STRIPE_SECRET_KEY` | Secret key from [Stripe dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (from Stripe dashboard or CLI) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key from Stripe dashboard |
| `NEXT_PUBLIC_APP_URL` | Full public URL of your app (used in Stripe redirect URLs) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name in Cloudinary |

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### 2. Create a Vercel project

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo.
2. Vercel auto-detects Next.js — no build config needed.

### 3. Add environment variables

In your Vercel project → **Settings → Environment Variables**, add every variable from the table above with **production** values (live Stripe keys, your real domain, etc.).

> Make sure `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` both point to your Vercel deployment URL, e.g. `https://mo-style-hub.vercel.app`.

### 4. Run database migrations

After the first deploy, run migrations against your production database. The easiest way is via the Vercel CLI:

```bash
npx vercel env pull .env.production.local   # pull production env vars locally
npx prisma migrate deploy                    # run migrations against production DB
```

Or add a build command in Vercel that runs `prisma migrate deploy && next build`.

### 5. Register the Stripe webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks).
2. Click **Add endpoint**.
3. Set the URL to `https://your-domain.vercel.app/api/stripe/webhook`.
4. Select the event: `checkout.session.completed`.
5. Copy the **Signing secret** (`whsec_...`) and add it as `STRIPE_WEBHOOK_SECRET` in Vercel.

### 6. Verify your Resend sender domain

In [Resend](https://resend.com/domains), add and verify the domain that appears in `EMAIL_FROM`. Emails will not deliver from an unverified domain.

### 7. Set up Cloudinary

1. Create a free [Cloudinary](https://cloudinary.com) account.
2. Go to **Settings → Upload → Upload presets** and create an **unsigned** preset.
3. Name the preset (e.g. `mo-style-hub`) and set the folder to `mo-style-hub/products`.
4. Add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` to Vercel.

---

## Useful Scripts

```bash
npm run dev          # Start dev server (webpack)
npm run build        # Production build
npm run db:migrate   # Create and apply a new migration (dev only)
npm run db:generate  # Regenerate Prisma client
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with sample data
```

---

## Admin Panel

Navigate to `/admin` while signed in as a user with the `ADMIN` role.

The seed script creates `admin@mostylehub.com` (password: `admin123`). **Change this password immediately in production** via `/profile`.

---

## Features

- Product catalog with variants (size, color, stock tracking)
- Category browsing and filtering
- Full-text product search
- Cart (Zustand, persisted to localStorage)
- Wishlist (synced to database)
- Stripe Checkout with webhook-based order creation
- Order confirmation emails via Resend
- Order history and detail pages with status timeline
- Product reviews (gated to verified buyers with delivered orders)
- User profile (name and password management)
- Password reset via email
- Admin panel: product CRUD, order management, user management
- Cloudinary image uploads in admin
