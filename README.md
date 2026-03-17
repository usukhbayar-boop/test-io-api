# Zangia Exam API

Online Examination System REST API with Admin and User roles.

## Tech Stack

- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Multer (file uploads)
- bcrypt (password hashing)
- express-validator (input validation)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

### 3. Run migrations

```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Seed database (optional)

```bash
npm run prisma:seed
```

Creates admin (`admin@zangia.io` / `admin123`) and user (`user@zangia.io` / `user123`) accounts.

### 6. Start server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000` by default.

## API Endpoints

### Auth

| Method | Endpoint             | Description       | Auth |
|--------|----------------------|-------------------|------|
| POST   | /api/auth/register   | Register user     | No   |
| POST   | /api/auth/login      | Login             | No   |

### Courses

| Method | Endpoint          | Description       | Auth  |
|--------|-------------------|-------------------|-------|
| GET    | /api/courses      | List all courses  | No    |
| POST   | /api/courses      | Create course     | Admin |
| PUT    | /api/courses/:id  | Update course     | Admin |
| DELETE | /api/courses/:id  | Delete course     | Admin |

### Questions (Admin)

| Method | Endpoint                       | Description             | Auth  |
|--------|--------------------------------|-------------------------|-------|
| GET    | /api/questions/course/:courseId | List course questions   | Admin |
| POST   | /api/questions/course/:courseId | Create question         | Admin |
| PUT    | /api/questions/:id             | Update question         | Admin |
| DELETE | /api/questions/:id             | Delete question         | Admin |

### Exam (User)

| Method | Endpoint                        | Description        | Auth |
|--------|---------------------------------|--------------------|------|
| POST   | /api/exam/start/:courseId       | Start exam         | User |
| POST   | /api/exam/submit                | Submit exam        | User |
| PATCH  | /api/exam/:examId/start-timer   | Start exam timer   | User |

### Admin

| Method | Endpoint                          | Description          | Auth  |
|--------|-----------------------------------|----------------------|-------|
| GET    | /api/admin/courses/:id/results    | View exam results    | Admin |

### Health

| Method | Endpoint     | Description   |
|--------|-------------|---------------|
| GET    | /api/health  | Health check  |

## Example curl Requests

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+97612345678",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
# Login with email
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zangia.io",
    "password": "admin123"
  }'

# Login with phone
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+97699999999",
    "password": "admin123"
  }'
```

### Create Course (Admin)

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -F "name=Mathematics" \
  -F "image=@/path/to/image.jpg"
```

### Create Question with Media (Admin)

```bash
curl -X POST http://localhost:3000/api/questions/course/<COURSE_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -F "text_content=What is 2+2?" \
  -F 'answers=[{"text":"4"},{"text":"3"},{"text":"5"},{"text":"6"}]' \
  -F "image=@/path/to/image.png"
```

Note: First answer in the array is automatically marked as correct.

### Delete Course (Admin, requires confirmation)

```bash
curl -X DELETE http://localhost:3000/api/courses/<COURSE_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"confirm": "true"}'
```

### List Courses

```bash
curl http://localhost:3000/api/courses
```

### Start Exam (User)

```bash
curl -X POST http://localhost:3000/api/exam/start/<COURSE_ID> \
  -H "Authorization: Bearer <USER_TOKEN>"
```

### Start Timer (User)

```bash
curl -X PATCH http://localhost:3000/api/exam/<EXAM_ID>/start-timer \
  -H "Authorization: Bearer <USER_TOKEN>"
```

### Submit Exam (User)

```bash
curl -X POST http://localhost:3000/api/exam/submit \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "exam_id": "<EXAM_ID>",
    "answers": [
      {"question_id": "<Q_ID>", "selected_answer_id": "<A_ID>"},
      {"question_id": "<Q_ID>", "selected_answer_id": "<A_ID>"}
    ]
  }'
```

### View Exam Results (Admin, paginated)

```bash
curl "http://localhost:3000/api/admin/courses/<COURSE_ID>/results?page=1&limit=20" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

## Project Structure

```
src/
├── config/          # App config, database client
├── controllers/     # Request handlers
├── middlewares/      # Auth, upload, validation, error handling
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Helpers (ApiError, pagination, shuffle)
└── validators/      # express-validator rules
prisma/
├── schema.prisma    # Database schema
└── seed.js          # Seed data
```

## Cloud Database

The `DATABASE_URL` in `.env` supports any PostgreSQL provider:

- **Supabase**: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`
- **Neon**: `postgresql://[user]:[password]@[host].neon.tech/[db]?sslmode=require`
- **AWS RDS**: `postgresql://[user]:[password]@[host].rds.amazonaws.com:5432/[db]`
- **Local**: `postgresql://user:password@localhost:5432/zangia_exam`
