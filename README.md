# Reusable Portfolio CMS Frontend

A modern, production-ready portfolio frontend built with **Next.js (App Router)** and **shadcn/ui**, designed to dynamically render portfolio content from a CMS backend API.

This project depends on the backend:

👉 https://github.com/sami-mersha/reusable-portfolio-cms-backend

---

## 🚀 Overview

This application is a **dynamic portfolio renderer** that consumes structured data from an API and builds a complete personal portfolio website.

It is designed with:

* **Separation of concerns** (Frontend ↔ Backend)
* **Reusability** (plug different data, same UI)
* **Scalability** (modular sections)
* **Production-readiness** (error handling, loading states)

---

## 🧩 Core Features

* Dynamic Hero section (profile, branding, social links)
* Skills grouped by category
* Experience timeline (sorted, highlight-based)
* Featured projects showcase
* Certificates display
* Resume download/view
* Responsive UI (mobile-first)
* Dark mode support
* Section-level error handling
* Loading states for async rendering

---

## 🏗️ Tech Stack

* **Next.js (App Router)**
* **React Server Components**
* **Tailwind CSS**
* **shadcn/ui**
* **TypeScript**

---

## 🔗 Backend Dependency

This frontend **does not work standalone**.

It consumes data from:

👉 https://github.com/sami-mersha/reusable-portfolio-cms-backend

### Key API Characteristics

* Single aggregated endpoint for portfolio data
* Media served via `/storage`
* Structured JSON response
* Supports:

  * Profile (with favicon, contact info, linktree)
  * Projects & Featured Projects
  * Skills (categorized)
  * Experiences (ordered, visibility controlled)
  * Certificates
  * Resumes

---

## ⚙️ Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_HOME_URL=http://localhost:3000
NEXT_PUBLIC_DEBUG=false
```

### Description

| Variable             | Purpose              |
| -------------------- | -------------------- |
| NEXT_PUBLIC_BASE_URL | Backend API base URL |
| NEXT_PUBLIC_HOME_URL | Frontend base URL    |
| NEXT_PUBLIC_DEBUG    | Enables debug logs   |

---

## 🛠️ Installation

```bash
git clone https://github.com/sami-mersha/reusable-portfolio-cms-frontend.git
cd reusable-portfolio-cms-frontend

npm install
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 🔄 Data Fetching Flow

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

## 📁 Project Structure

```bash
app/
 ├── _components/
 │    ├── Hero.tsx
 │    ├── Skills.tsx
 │    ├── Experiences.tsx
 │    ├── Projects.tsx
 │    ├── Certificates.tsx
 │    ├── Resumes.tsx
 │    ├── Header.tsx
 │    └── Footer.tsx
 │
 ├── _lib/
 │    ├── portfolio.ts   # API abstraction layer
 │    └── types.ts       # Type definitions
 │
 ├── layout.tsx
 └── page.tsx
```

---

## 🧠 Design Principles

### 1. Server-First Rendering

* Uses async server components
* Improves SEO and performance

### 2. Centralized API Layer

* All fetching logic lives in one place
* Easy to switch backend or extend

### 3. Strong Typing

* Prevents runtime errors
* Improves maintainability

### 4. Fault Isolation

* Each section handles:

  * Errors
  * Empty states
  * Loading states

### 5. Clean UI Architecture

* Component-based layout
* Easily extendable sections

---

## ⚠️ Important Notes

* Backend must be running before frontend
* Ensure backend CORS is configured
* Media files require:

  ```bash
  php artisan storage:link
  ```
* Invalid or missing API data will trigger graceful UI fallbacks

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 🔮 Future Enhancements

* Multi-tenant portfolio support
* Dynamic routing per user
* Theme customization
* CMS-driven layout configuration
* Internationalization (i18n)
* Analytics integration

---

## 🤝 Contribution

This project is structured for extensibility. You can contribute by:

* Adding new sections (blogs, testimonials, etc.)
* Improving UI/UX
* Enhancing performance
* Extending API integration

---

## 📄 License

MIT License

---

## 👤 Author

Samuel Mersha

---
