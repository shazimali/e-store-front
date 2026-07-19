# E-Store Front 🛒
### Modern Vue 3 Admin Dashboard for E-Commerce & Retail Management

[![Frontend CI/CD](https://github.com/your-username/e-store-front/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/e-store-front/actions)
[![Vue Version](https://img.shields.io/badge/vue-3.x-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An advanced, responsive administration panel designed for large-scale enterprise, retail, and e-commerce resource management. This repository contains the front-end dashboard of a **Full-Stack Application** built with **Vue 3, TypeScript, and Vuetify 3**, which interfaces with a companion **Laravel REST API** backend.

---

## 📸 Overview & Features

This system provides complete administrative tools to manage multi-tenant stores, branches, stock movements, and financial accounts:

*   📊 **Interactive Dashboards:** Analytics for sales, sessions, and profits with ApexCharts.
*   🛍️ **Store & Branch Control:** Hierarchical management of multiple stores and their respective local branches.
*   📦 **Inventory & Stock Management:** Stock tracking, procurement procurement purchases, deliverables, and customer return deliverables.
*   🧾 **Invoicing & Digital Billing:** Complete sales billing creation with built-in printable layouts, PDF-friendly templates, and integrated **FBR Digital Invoicing** complete with dynamic QR codes.
*   🔑 **RBAC (Role-Based Access Control):** Granular permission management where users are assigned roles that dynamically control UI rendering and router guards.
*   💳 **Vouchers & Discount Systems:** Financial adjustments (Receipt/Payment vouchers), ledgers, profit/loss reports, and percentage-based store discount overrides.

---

## 🛠️ Architecture & Tech Stack

This project is built using modern web development practices:

*   **Frontend Core:** [Vue 3](https://vuejs.org/) (using the performance-focused Composition API and `<script setup>` syntax).
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for robust static typing and compiler safety.
*   **Build Tool:** [Vite](https://vitejs.dev/) for ultra-fast hot reloading and bundling.
*   **UI Framework:** [Vuetify 3](https://vuetifyjs.com/) conforming to Material Design specifications.
*   **State Management:** [Pinia](https://pinia.vuejs.org/) for modern, reactive global stores.
*   **Routing:** [Vue Router](https://router.vuejs.org/) with dynamic auth checking and client-side guards.
*   **HTTP Client:** [Axios](https://axios-http.com/) configured with global base URLs and authorization header interceptors.
*   **Styling:** [Sass/SCSS](https://sass-lang.com/) for organized custom utility classes.
*   **Code Quality:** [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) configurations to maintain team consistency.

---

## 🔗 Companion Backend
This frontend dashboard interfaces with a secure **Laravel API** backend that handles:
*   JWT Authentication & Password resets.
*   Database migrations & relation mapping (Eloquent).
*   Form validation requests.
*   FBR Digital Invoice registration.
*   Financial report calculations.

*Companion Laravel Backend Repository:* **[Link to your Laravel Backend Repo here]**

---

## 🚀 Local Development Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v20+ recommended)
*   [npm](https://www.npmjs.com/)

### 1. Clone & Enter Directory
```bash
git clone https://github.com/your-username/e-store-front.git
cd e-store-front
```

### 2. Configure Environment Variables
Copy the example variables file:
```bash
cp .env.example .env
```
Open `.env` and configure:
*   `VITE_API_URL`: The URL of your local or staging Laravel API backend (e.g. `http://localhost:8000/api`).
*   `VITE_RECAPTCHA_SITE_KEY`: Your Google reCAPTCHA v2 site key for auth security.

### 3. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Run Development Server
```bash
npm run dev
```
Open the application on: [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker Deployment

A multi-stage `Dockerfile` and `docker-compose` setup are included for clean, repeatable containers:

### 1. Build and Run Container
```bash
docker compose up -d --build
```
This commands:
1. Compiles, type-checks, and builds the static assets in a Node builder stage.
2. Injects the build-time environment variable `VITE_API_URL`.
3. Copies the output to a high-performance **Nginx** container configured via `nginx.conf`.

### 2. Stop Containers
```bash
docker compose down
```

---

## 🧪 Quality Assurance & CI/CD
This project runs automated checks via **GitHub Actions** on pushes to the `main` branch:
*   Installs dependencies deterministically.
*   Lints all files using `eslint` (`npm run lint`).
*   Runs TypeScript compilation validation (`npm run typecheck`).
*   Builds the docker container and deploys to staging/production on success.
