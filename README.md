# Kreava - Digital Marketplace

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?logo=php&logoColor=white)](https://php.net)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v2-2D2D2D?logo=inertiajs&logoColor=white)](https://inertiajs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## About Project

**Kreava** is a modern digital marketplace platform that enables creators to sell their digital products — from UI kits, templates, source code, ebooks, icons, mockups, fonts, to music and audio. Built with Laravel and React using Inertia.js for a smooth SPA-like user experience.

Kreava is designed to meet the needs of digital creators and customers with a modern, fast, and responsive interface.

### 🎯 Vision

To become the primary platform for Indonesian digital creators to monetize their work easily and professionally.

### 🚀 Mission

- Provide a trusted and easily accessible digital marketplace
- Provide product and sales management tools for creators
- Create a creative ecosystem that connects creators with customers

---

## 🛠️ Technology

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Laravel Framework | 12.x |
| PHP | PHP | 8.2+ |
| Frontend | React | 19.x |
| SSR / SPA Bridge | Inertia.js | 2.x |
| Styling | Tailwind CSS | v4 |
| UI Components | shadcn/ui + Radix UI | Latest |
| Build Tool | Vite | 6.x |
| Database | SQLite (default) / MySQL / PostgreSQL | — |
| Auth | Laravel Built-in Auth | — |
| Testing | Pest PHP | 3.x |
| Code Formatter | Laravel Pint, Prettier, ESLint | — |
| Type Checker | TypeScript | 5.7.x |

---

## ✨ Features

### 👥 Public (No Login Required)

- **Landing Page** — Homepage with product categories, trending products, and customer testimonials
- **Marketplace** — Browse digital products with search, category filter, and pagination
- **Product Detail** — Product detail page with image gallery, reviews, rating breakdown, and related products
- **Creators** — Creator list with sales statistics and their featured products

### 🔐 Authentication

- Register, Login, Logout
- Email Verification
- Forgot & Reset Password
- Password Confirmation

### 🛒 Customer (Login Required)

- **Dashboard** — Customer activity summary
- **Orders** — View order history and order details
- **Downloads** — Download purchased digital files
- **Shopping Cart** — Add, remove, and manage cart items
- **Wishlist** — Save favorite products
- **Profile Settings** — Edit profile, change password, appearance settings, delete account

### 🏪 Seller (Role: Seller)

- **Seller Dashboard** — Store and sales summary
- **Product Management** — List of products for sale
- **Seller Orders** — Manage incoming orders
- **Analytics** — Store performance statistics
- **Customers** — Store customer list
- **Payout & Settings** — (Placeholder) Store settings and payout

### 👑 Admin (Role: Admin)

- Product and creator moderation (based on development roadmap)
---

## 🗂️ Folder Structure

\\\
kreava-digital-marketplace/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/           # Auth controllers
│   │   │   ├── Customer/       # Customer controllers
│   │   │   ├── Pages/          # Public page controllers
│   │   │   ├── Seller/         # Seller controllers
│   │   │   └── Settings/       # Settings controllers
│   │   ├── Middleware/         # EnsureUserRole, HandleInertiaRequests
│   │   └── Requests/           # Form requests
│   ├── Models/                 # Eloquent models
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Order.php
│   │   ├── Category.php
│   │   ├── Seller.php
│   │   └── ...
│   └── Providers/
├── bootstrap/
├── config/
├── database/
│   ├── migrations/             # 17 migration files
│   ├── factories/
│   └── seeders/                # 8 seeder files
├── public/
├── resources/
│   ├── css/
│   ├── js/
│   │   ├── components/         # React components
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/              # Inertia pages
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   ├── landing/
│   │   │   ├── marketplace/
│   │   │   ├── seller/
│   │   │   └── settings/
│   │   └── types/
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── web.php                 # Public + customer + seller routes
│   ├── auth.php                # Authentication routes
│   └── settings.php            # User settings routes
├── storage/
├── tests/
├── vendor/
├── node_modules/
├── artisan
├── composer.json
├── package.json
├── vite.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.example
\\\


---

## 📦 Installation

### Prerequisites

Make sure you have installed the following:

- **PHP** 8.2 or higher
- **Composer** (PHP dependency manager)
- **Node.js** & **npm** (for frontend)
- **SQLite** (default database)

### Setup Steps

1. **Clone repository**
   `ash
   git clone https://github.com/ZamiFaiz24/kreava-digital-marketplace.git
   cd kreava-digital-marketplace
   `

2. **Install PHP dependencies**
   `ash
   composer install
   `

3. **Install JavaScript dependencies**
   `ash
   npm install
   `

4. **Copy environment file**
   `ash
   cp .env.example .env
   `

5. **Generate application key**
   `ash
   php artisan key:generate
   `

6. **Create SQLite database** (if not exists)
   `ash
   touch database/database.sqlite
   `

7. **Run migration and seeder**
   `ash
   php artisan migrate --seed
   `

8. **Build frontend assets**
   `ash
   npm run build
   `

   Or for development:
   `ash
   npm run dev
   `

9. **Run development server**
   `ash
   php artisan serve
   `

   Open [http://localhost:8000](http://localhost:8000) in your browser.

### Running All at Once (Development)

`ash
composer run dev
`
This will run the Laravel server, queue listener, and Vite simultaneously.


---

## 🗃️ Database

### Main Tables

| Table | Description |
|-------|-------------|
| users | System users (customer, seller, admin) |
| sellers | Creator store profiles |
| categories | Digital product categories |
| products | Digital products for sale |
| product_images | Product images |
| orders | Customer orders |
| order_items | Items in orders |
| carts | Shopping carts |
| cart_items | Items in carts |
| eviews | Product reviews |
| wishlists | Customer favorite lists |
| wishlist_items | Wishlist items |
| downloads | Download history |
| download_logs | Download file logs |

### Seeders

Database seeder includes dummy data for:
- Users (customers & sellers)
- Categories
- Products & Product Images
- Reviews
- Orders

`ash
php artisan db:seed
`

---

## 🛣️ Routes

### Public

| Method | URI | Route Name | Description |
|--------|-----|------------|-------------|
| GET | / | landing | Landing page |
| GET | /marketplace | marketplace | Browse products |
| GET | /products/{slug} | product.show | Product detail |
| GET | /creators | creators | Creator list |
| GET | /welcome | welcome | Welcome page |

### Authentication

| Method | URI | Route Name |
|--------|-----|------------|
| GET/POST | /register | egister |
| GET/POST | /login | login |
| GET/POST | /forgot-password | password.request |
| GET/POST | /reset-password/{token} | password.reset |
| POST | /logout | logout |
| GET | /verify-email | erification.notice |

### Customer (Auth + Role: Customer)

| Method | URI | Route Name |
|--------|-----|------------|
| GET | /dashboard | dashboard |
| GET | /orders | orders.index |
| GET | /orders/{order} | orders.show |
| GET | /downloads | downloads.index |
| GET | /downloads/{download}/file | downloads.download |
| GET/POST/DELETE | /cart | cart.* |
| GET/POST/DELETE | /wishlist | wishlist.* |

### Seller (Auth + Role: Seller)

| Method | URI | Route Name |
|--------|-----|------------|
| GET | /seller/dashboard | seller.dashboard |
| GET | /seller/products | seller.products |
| GET | /seller/products/new | seller.products.new |
| GET | /seller/orders | seller.orders |
| GET | /seller/analytics | seller.analytics |
| GET | /seller/customers | seller.customers |
| GET | /seller/payouts | seller.payouts |
| GET | /seller/settings | seller.settings |

### Settings (Auth)

| Method | URI | Route Name |
|--------|-----|------------|
| GET/PATCH/DELETE | /settings/profile | profile.* |
| GET/PUT | /settings/password | password.* |
| GET | /settings/appearance | ppearance |


---

## 👥 User Roles

| Role | Access |
|------|--------|
| customer | Buyer, cart, wishlist, downloads |
| seller | All customer features + store & product management |
| dmin | System moderation (based on roadmap) |

Roles are managed through the EnsureUserRole middleware.

---

## 🛠️ Development Guide

### Code Style

- **PHP**: Follows PSR-12, formatted with Laravel Pint
- **JavaScript/TypeScript**: Formatted with Prettier + ESLint
- **Tailwind**: Class ordering managed by prettier-plugin-tailwindcss

### Useful Commands

`ash
# Format PHP code
./vendor/bin/pint

# Format JS/TS
npm run format

# Lint JS/TS
npm run lint

# Run tests
php artisan test

# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Clear cache
php artisan optimize:clear
`

### Development Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 1 | Branding & Landing Page (landing, marketplace, product detail) | ✅ Done |
| Phase 2 | Auth & Dashboard (login, seller dashboard, admin dashboard, customer library) | 🔄 In Progress |
| Phase 3 | Business Features (checkout, download, analytics, moderation) | ⏳ Pending |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repository
2. Create a feature branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m 'feat: add feature X')
4. Push to the branch (git push origin feature/your-feature)
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- eat: — New feature
- ix: — Bug fix
- docs: — Documentation
- style: — Formatting fixes
- efactor: — Code refactoring
- 	est: — Add or modify tests
- chore: — Maintenance tasks

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 📞 Contact

- **GitHub**: [ZamiFaiz24](https://github.com/ZamiFaiz24)
- **Repository**: [kreava-digital-marketplace](https://github.com/ZamiFaiz24/kreava-digital-marketplace)

---

Built with ❤️ by ZamiFaiz24

