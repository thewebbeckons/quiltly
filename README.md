# Quiltly

Quiltly is a Nuxt 4 workspace for tracking quilting supplies, projects, and inspiration. It deploys as a Cloudflare Worker with D1 for relational data, R2 for uploads, Better Auth for accounts, and Cloudflare Email Service for verification email.

## Local development

```bash
pnpm install
pnpm dev
```

Before opening a pull request or deploying:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Cloudflare deployment

The repository is already configured for a Worker named `quiltly`. The checked-in `wrangler.jsonc` expects:

- D1 binding `DB` with database ID `4d929007-4b2b-4e9c-bf25-2f1392d3fd50`
- R2 binding `BLOB` with bucket `quiltly-blob`
- Email binding `EMAIL`
- Worker logs and invocation logging

### 1. Authenticate Wrangler

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
```

Confirm that Wrangler shows the Cloudflare account that owns the configured D1 database, R2 bucket, and sending domain.

### 2. Confirm the storage resources

```bash
pnpm exec wrangler d1 list
pnpm exec wrangler r2 bucket list
```

If the configured resources do not exist in that account, create replacements and copy the new D1 ID and R2 bucket name into `wrangler.jsonc`:

```bash
pnpm exec wrangler d1 create quiltly
pnpm exec wrangler r2 bucket create quiltly-blob
```

R2 can remain private; Quiltly serves uploaded files through its authenticated server route.

### 3. Configure production email

In the Cloudflare dashboard, open **Compute → Email Service** and configure sending for the domain used by `noreply@quiltly.app`. Verify the sending domain/address and make sure the account can send verification emails to real recipients.

Create an API token that can send email for the account. Keep the account ID and token for the secrets step. The Worker uses the `EMAIL` binding first and the REST credentials as a fallback.

If the sender address is not `noreply@quiltly.app`, set `NUXT_EMAIL_FROM` in the production secrets file in the next step.

### 4. Prepare production secrets

Generate a high-entropy auth secret of at least 32 characters:

```bash
openssl rand -base64 32
```

Create an ignored `.env.production` file locally:

```dotenv
NUXT_BETTER_AUTH_SECRET=replace-with-generated-secret
NUXT_PUBLIC_SITE_URL=https://quiltly.ca
NUXT_CF_ACCOUNT_ID=replace-with-cloudflare-account-id
NUXT_CF_EMAIL_API_TOKEN=replace-with-email-api-token
# NUXT_EMAIL_FROM=noreply@your-production-domain.example
```

Do not commit this file. `.env.production` is already covered by `.gitignore`.

### 5. Build the Cloudflare bundle

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build:cloudflare
```

The Cloudflare build explicitly loads `.env.production`; a plain `pnpm build` loads the local `.env`, where `NUXT_PUBLIC_SITE_URL` is normally a localhost URL. The build generates the deployable Worker configuration at `.output/server/wrangler.json`.

### 6. Apply the production database migrations

```bash
pnpm exec wrangler d1 migrations apply DB --remote --config .output/server/wrangler.json
```

Review the migration list before confirming. This creates the auth, preference, project, supply, bookmark, and project-supply tables.

### 7. Deploy the Worker and secrets

For the first production deployment:

```bash
pnpm exec wrangler deploy --config .output/server/wrangler.json --keep-vars --secrets-file .env.production
```

For later deployments, the configured script rebuilds with `.env.production`, applies migrations, publishes the Worker, and synchronizes the production secrets:

```bash
pnpm deploy:cloudflare
```

Wrangler prints the `workers.dev` URL when deployment succeeds.

### 8. Attach the production domain

In **Workers & Pages → quiltly → Settings → Domains & Routes**, add the custom domain. If the final domain changes, update `NUXT_PUBLIC_SITE_URL` in `.env.production` and redeploy:

```bash
pnpm deploy:cloudflare
```

### 9. Run the production smoke test

Open the deployed app and verify, in order:

1. The landing and sign-in pages load over HTTPS.
2. A new user can register and receives a verification email.
3. The verification link returns to the production domain and opens onboarding.
4. A supply can be created and an upload can be retrieved.
5. A project can be created, linked to a supply, and marked complete.
6. A bookmark can be saved and its preview appears.
7. The Dashboard totals update.
8. Desktop and mobile navigation work without horizontal overflow.

Watch production logs while running the test:

```bash
pnpm exec wrangler tail quiltly
```

If a request fails, check the Worker logs first, then confirm the D1, R2, Email, and secret bindings in **Workers & Pages → quiltly → Settings**.
