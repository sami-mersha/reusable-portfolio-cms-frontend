# Reusable Portfolio CMS Frontend

A modern, production-ready portfolio and blog frontend built with Next.js (App Router) and shadcn/ui, designed to dynamically render content from a CMS backend API.

Backend dependency:
https://github.com/sami-mersha/reusable-portfolio-cms-backend

---

## Overview

This application is a dynamic portfolio + blog renderer that consumes structured data from an API and builds a complete personal portfolio website.

Design goals:
* Separation of concerns (Frontend ↔ Backend)
* Reusability (plug different data, same UI)
* Scalability (modular sections)
* Production-readiness (error handling, loading states)

---

## Core Features

* Dynamic hero section (profile, branding, social links)
* Skills grouped by category
* Experience timeline (sorted, highlight-based)
* Featured projects showcase
* Certificates display
* Resume download/view
* Blog archive with pagination
* Blog detail pages with comments
* Blog search (server-backed)
* Responsive UI (mobile-first)
* Dark mode support
* Section-level error handling
* Loading states for async rendering

---

## Tech Stack

* Next.js (App Router)
* React Server Components
* Tailwind CSS
* shadcn/ui
* TypeScript

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_HOME_URL=http://localhost:3000
NEXT_PUBLIC_DEBUG=false
```

| Variable             | Purpose              |
| -------------------- | -------------------- |
| NEXT_PUBLIC_BASE_URL | Backend API base URL |
| NEXT_PUBLIC_HOME_URL | Frontend base URL    |
| NEXT_PUBLIC_DEBUG    | Enables debug logs   |

---

## Installation

```bash
git clone https://github.com/sami-mersha/reusable-portfolio-cms-frontend.git
cd reusable-portfolio-cms-frontend

npm install
```

---

## Run Development Server

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## Data Fetching Flow

1. UI sections call:

   ```
   getPortfolio()
   ```

2. Data is fetched from:

   ```
   {BASE_URL}/api/portfolio
   ```

3. Response is mapped into:

   * Hero
   * Skills
   * Experience
   * Projects
   * Certificates
   * Resume

Each section handles its own failure independently.

---

## Blog Endpoints Used

* Archive: `GET /api/blogs?page=1`
* Search: `GET /api/blogs/search?q=keyword`
* Detail: `GET /api/blogs/{slug}`
* Comments: `POST /api/comments`

---

## Project Structure

```bash
app/
 ├── _components/
 │    ├── BlogCard.tsx
 │    ├── BlogCommentForm.tsx
 │    ├── BlogPagination.tsx
 │    ├── Certificates.tsx
 │    ├── Experiences.tsx
 │    ├── FeaturedBlogs.tsx
 │    ├── Footer.tsx
 │    ├── Header.tsx
 │    ├── Hero.tsx
 │    ├── PortfolioLoading.tsx
 │    ├── Projects.tsx
 │    ├── PublicErrorState.tsx
 │    ├── Resumes.tsx
 │    ├── Skills.tsx
 │    └── ThemeToggle.tsx
 │
 ├── _lib/
 │    ├── api.ts         # API abstraction layer
 │    ├── blogs.ts       # Blog helpers + search
 │    ├── debug.ts       # Debug flag helper
 │    ├── errors.ts      # Error helpers
 │    ├── portfolio.ts   # Portfolio helpers
 │    ├── sanitize.ts    # HTML sanitization
 │    ├── seo.ts         # Metadata + JSON-LD helpers
 │    └── types.ts       # Type definitions
 │
 ├── blogs/
 │    ├── [slug]/
 │    │    ├── loading.tsx
 │    │    └── page.tsx
 │    ├── actions.ts
 │    ├── BlogSearchBar.tsx
 │    ├── comment-form-state.ts
 │    ├── loading.tsx
 │    └── page.tsx
 │
 ├── projects/
 │    └── [slug]/
 │         └── page.tsx
 │
 ├── error.tsx
 ├── global-error.tsx
 ├── globals.css
 ├── icon.ts
 ├── layout.tsx
 ├── loading.tsx
 ├── page.tsx
 ├── robots.ts
 └── sitemap.ts
```

---

## Important Notes

* Backend must be running before frontend.
* Ensure backend CORS is configured.
* Media files require:

  ```bash
  php artisan storage:link
  ```

* Blog HTML is sanitized on the frontend for safety.

---

## Production Build

```bash
npm run build
npm start
```

---

## Production Checklist

* Set real production URLs in your host env vars
* Update `next.config.ts` with production image domains
* Confirm API endpoints respond quickly in production
* Disable debug mode (`NEXT_PUBLIC_DEBUG=false`)
* Optional: enable caching/revalidation for faster TTFB

---

## Contribution

This project is structured for extensibility. You can contribute by:

* Adding new sections (blogs, testimonials, etc.)
* Improving UI/UX
* Enhancing performance
* Extending API integration

---

## License

MIT License

---

## Author

Samuel Mersha

---
