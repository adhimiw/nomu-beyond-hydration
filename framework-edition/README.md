# NOMU Beverages — Modern Framework & Infrastructure as Code Edition

Enterprise-grade decoupled architecture for **NOMU Beyond Hydration**, pairing a typed **React 19 + TypeScript + Vite** frontend with a domain-driven **Laravel 11 PHP** headless CMS, review moderation ledger, and multi-product WhatsApp order fulfillment engine.

---

## 1. System Architecture

```
                                    +------------------------------+
                                    |       Client Browser         |
                                    +--------------+---------------+
                                                   |
                                                   v
                          +------------------------------------------------+
                          |        Nginx Reverse Proxy / Edge Router       |
                          |                   (Port 8080)                  |
                          +------------------------+-----------------------+
                                                   |
                         +-------------------------+-------------------------+
                         |                                                   |
                         v                                                   v
          +-----------------------------+                     +-----------------------------+
          |      React 19 Frontend      |                     |      Laravel 11 API         |
          |   (Vite + TypeScript SPA)   |                     |     (PHP 8.3 FPM Engine)    |
          |          Port 3000          |                     |          Port 9000          |
          +-----------------------------+                     +--------------+--------------+
                                                                             |
                                                            +----------------+----------------+
                                                            |                                 |
                                                            v                                 v
                                              +---------------------------+     +---------------------------+
                                              |    Redis Cache & Queue    |     |   SQLite WAL / MySQL DB   |
                                              |         Port 6379         |     |      (Persistent Disk)    |
                                              +---------------------------+     +---------------------------+
```

---

## 2. Directory Hierarchy

```
framework-edition/
├── docker-compose.yml              # Multi-container orchestration (Frontend, Backend, Redis, Nginx)
├── Makefile                        # 1-command developer lifecycle control
├── .env.example                    # Environment configuration template
│
├── frontend/                       # React 19 + TypeScript + Vite Application
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── types/index.ts          # Unified TypeScript interfaces
│       ├── data/flavors.ts         # Quartet blend data, sensory meters & pricing
│       ├── styles/theme.css        # Taste-compliant CSS tokens
│       ├── components/
│       │   ├── Header.tsx          # Sticky navigation & cart counter
│       │   ├── HeroSection.tsx     # 3-column coordinated Dribbble stage
│       │   ├── AboutSection.tsx    # Botanical distillation story
│       │   ├── ReviewsSection.tsx  # Community tasting ledger with filter tabs
│       │   ├── ShowcaseSection.tsx # Expanding accordion pillars
│       │   ├── ManifestoSection.tsx# Whole-plant philosophy
│       │   ├── RitualBoxBuilder.tsx# Multi-product box builder & flight presets
│       │   ├── OrderModal.tsx      # Customer details & formatted WhatsApp launch
│       │   ├── ReviewModal.tsx     # Tasting note submission & moderation notice
│       │   ├── AdminConsole.tsx    # Operations console & live telemetry
│       │   └── Footer.tsx          # Brand footer & workshop dispatch
│       ├── App.tsx                 # Root layout & state orchestration
│       └── main.tsx                # Mount entry point
│
├── backend/                        # Enterprise Laravel 11 Backend
│   ├── composer.json
│   ├── bootstrap/app.php
│   ├── routes/api.php              # RESTful API routing
│   ├── app/
│   │   ├── Models/                 # Order, Review, CmsContent, SystemLog
│   │   ├── Http/Requests/          # FormRequests with input validation & honeypot
│   │   ├── Services/               # OrderService, ReviewService, CmsService, Telemetry
│   │   └── Http/Controllers/Api/   # API endpoints with JSON responses
│   ├── database/migrations/        # Table schemas with indexes
│   └── tests/Feature/              # Automated PHPUnit / Pest integration tests
│
└── infra/                          # Infrastructure as Code Assets
    ├── Dockerfile.frontend         # Multi-stage Node 20 builder & static server
    ├── Dockerfile.backend          # Multi-stage PHP 8.3 FPM with OPcache & Redis
    ├── nginx/conf.d/default.conf   # Production Nginx reverse proxy configuration
    └── php/opcache.ini             # High-performance OPcache production tuning
```

---

## 3. Quick Start with Docker Compose

Ensure Docker and Docker Compose are installed on your host machine.

```bash
# 1. Navigate to the framework edition directory
cd framework-edition

# 2. Copy the environment configuration
cp .env.example .env

# 3. Spin up all containerized services
make up

# 4. Run database migrations and seeders
make seed

# 5. Access the services:
# - Storefront Application: http://localhost:8080/
# - React Dev Server:        http://localhost:3000/
# - API Healthcheck:         http://localhost:8080/api/content
# - Operations Console:      http://localhost:8080/ (Click "Operations Console")
```

---

## 4. Developer Makefile Commands

| Command | Action |
| :--- | :--- |
| `make up` | Start frontend, backend, redis, and nginx services in background |
| `make down` | Stop and tear down all active containers |
| `make build` | Rebuild container images without cache |
| `make logs` | Stream live aggregated container logs |
| `make seed` | Re-run database migrations and seed default CMS records |
| `make test` | Run automated test suites across frontend and backend |
| `make clean` | Stop containers and prune ephemeral volumes |

---

## 5. API Reference

### Storefront Endpoints (Public)
- `GET /api/content`: Returns current CMS settings (Hero headlines, ticker text, font choices).
- `GET /api/reviews?flavor={all|vetiver|chamomile|grapefruit|lemongrass}`: Lists approved reviews.
- `POST /api/reviews`: Submits a tasting review with `status = 'pending'`.
- `POST /api/orders`: Records an incoming multi-product ritual order with customer details before WhatsApp dispatch.

### Operations Console Endpoints (Protected by Bearer Token)
- `GET /api/admin/orders`: Orders ledger with status filtering, customer search, and `export=csv`.
- `POST /api/admin/orders/{id}/status`: Updates status (`confirmed`, `dispatched`, `delivered`).
- `GET /api/admin/reviews`: All reviews across pending, approved, and rejected queues.
- `POST /api/admin/reviews/{id}/moderate`: Moderates review (`approve`, `reject`, or `delete`).
- `POST /api/admin/content`: Updates hero text, brand statement, and concierge phone numbers.
- `GET /api/admin/system/status`: Real-time PHP 8.3, memory, disk, and database counts.
- `GET /api/admin/system/logs`: Audit trail with level filters (`INFO`, `NOTICE`, `WARNING`, `ERROR`).
