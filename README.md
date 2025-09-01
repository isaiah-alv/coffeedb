# CoffeeDB ☕

A community‑driven café finder and review app. Discover cafés around New Jersey and NYC, save your favorites, and rate coffee, food/pastries, and atmosphere. Built with Next.js (App Router), MongoDB Atlas, Tailwind CSS, and NextAuth.

## Tech Stack

* **Web**: Next.js (App Router), React
* **Auth**: NextAuth (Google OAuth)
* **Database**: MongoDB Atlas (via Mongoose)
* **UI**: Tailwind CSS
* **Deployment**: Vercel

---

## Getting Started

### Prerequisites

* **Node.js** ≥ 18
* **MongoDB Atlas** project & cluster
* **Google Cloud** project with **OAuth Consent Screen** + **OAuth 2.0 Client ID** (Web)

---

## Project Structure

```
coffeedb/
├─ app/              # Next.js App Router routes (server components by default)
├─ components/       # Reusable UI components
├─ libs/             # DB connection, auth config, helpers
├─ models/           # Mongoose models (User, Cafe, Rating, etc.)
├─ public/           # Static assets (images, icons)
├─ tailwind.config.js
├─ next.config.mjs
└─ package.json
```


> © 2025 CoffeeDB. All rights reserved.
