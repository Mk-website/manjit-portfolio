# Manjit Kumar — MERN Portfolio

A resume-driven personal portfolio for an Embedded Firmware Engineer, with a React/Vite frontend and secure Node.js/Express/MongoDB admin CMS.

## Features

- Public portfolio: Home, About, Skills, Experience, Projects, Education, Certifications, Achievements, Resume, Contact
- Admin dashboard and cookie-based JWT super-admin authentication
- CRUD APIs for all portfolio content and contact messages
- Resume-derived seed data only; blank resume fields remain admin-editable
- Helmet, strict CORS, input body limits, MongoDB operator sanitization, protected routes and login/contact rate limiting
- Designed for Cloudflare Pages/Vercel, Render, and MongoDB Atlas Free Tier

## Local setup

```bash
git clone https://github.com/Mk-website/manjit-portfolio.git
cd manjit-portfolio
npm install
cd server && npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, COOKIE_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed
npm run dev
```

The frontend setup and UI are added in the next implementation commit. Admin credentials are never stored in source; use `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.
