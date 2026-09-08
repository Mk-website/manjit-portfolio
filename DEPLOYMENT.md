# Deployment

## MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com.
2. Create a database user and copy the SRV connection string.
3. In Network Access, allow Render (commonly `0.0.0.0/0`) and protect database credentials carefully.

## Render backend

Create a Web Service from this repository.

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Set environment variables:

```text
NODE_ENV=production
MONGO_URI=<your Atlas connection string>
JWT_SECRET=<long random secret>
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=<your admin email>
ADMIN_PASSWORD=<strong unique password>
CLIENT_URL=https://yourportfolio.pages.dev
COOKIE_SECRET=<long random secret>
```

Run `npm run seed` once using the same variables to initialize content and the sole super-admin account.

## Cloudflare Pages frontend

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_API_URL=https://your-render-service.onrender.com`

After frontend deployment, update Render `CLIENT_URL` to the exact production frontend URL and redeploy.

## Free-tier limits

Render free services may sleep when idle; the first request can be slow. MongoDB Atlas Free Tier has storage and connection limitations. Use external object storage for resume and images, since Render filesystem storage is ephemeral.
