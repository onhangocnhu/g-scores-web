# g-scores-web

This project includes:

- **Frontend:** React + Tailwind + Vite  
- **Backend:** NestJS + Prisma (MongoDB)  
- **Database:** MongoDB  

The system provides:
- Search exam scores  
- Score distribution chart (by subject groups)  
- Top 10 national ranking in group A (Math, Physics, Chemistry)  

---

## 1. Requirements

- Node.js ≥ 18  
- Docker (recommended)  
- npm

---
## 2. Project Setup

### Clone the repository

```bash
git clone https://github.com/onhangocnhu/g-scores-web.git
cd g-scores-web
```

### Backend Setup

This backend is built with **NestJS** and uses **MongoDB** as its database.  
To work with MongoDB more efficiently, the project uses **Prisma** (MongoDB connector) for schema management and query handling.

---

#### Requirements

- Node.js (>= 18)
- MongoDB (local or cloud)
- Docker (recommended)
- npm or yarn

---

#### Environment Setup

Create your environment file:

```bash
cp .env.example .env
```
Make sure to update all required variables (DATABASE_URL, etc.)

#### Generate Prisma client:

```bash
npx prisma generate
```

#### Running the Backend

Using Docker (recommended)
```bash
docker compose up -d
```

Running locally (without Docker)
```bash
npm install
npm run start:dev
```
The backend will run at: http://localhost:3000

#### Database Commands

Sync Prisma schema:
```bash
npm run db:sync
```

Push updated Prisma schema to MongoDB:

```bash
npx prisma db push
```

Regenerate Prisma client:
```bash
npx prisma generate
```

### Backend Structure
- ``src/student``: score search, ranking, reporting
- ``prisma/schema.prisma``: database structure
- ``prisma/seed.ts``: seeding script
- ``Dockerfile``: production image
- ``docker-compose.yml``: local development stack

### API Endpoints

| Route                            | Description               |
| -------------------------------- | ------------------------- |
| `GET /student/search-scores/:id` | Search exam results       |
| `GET /student/report/:groupName` | Score statistics by group |
| `GET /student/ranking`           | Top 10 ranking            |

### Notes

Prisma MongoDB connector does not support migrations, so manual schema updates require db push.
Seed script automatically checks existing data before inserting (safe to re-run).

## Frontend Setup

### Running the Frontend

Install dependencies:
```bash
npm install
```

Start dev server:
```bash
npm run dev
```

The frontend will run at: http://localhost:5173

### Notes
- UI uses TailwindCSS for some external components.
- Some pages use custom CSS where Tailwind alone isn't enough.