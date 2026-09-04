# T&P Club Event Management — Backend Documentation

Production-grade RESTful API and MySQL 8 database service for the **T&P Club Event Management (Opportunity Hub)** web application.

---

## 1. Project Architecture

The backend is built with a modular, maintainable layered architecture:

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # MySQL 8 connection pool (mysql2/promise)
│   │   └── env.js            # Environment configuration & validation
│   ├── controllers/
│   │   ├── authController.js         # Login, register, token issuance, demo switcher
│   │   ├── userController.js         # Student and staff directories, profile management
│   │   ├── eventController.js        # Event CRUD, search/filter, views & clicks tracking
│   │   ├── registrationController.js # Event registration, ticket generation, pass cancellation
│   │   ├── attendanceController.js   # QR scanner verification, live metrics, CSV export
│   │   ├── odController.js           # On-Duty request workflow (apply, approve, reject)
│   │   ├── notificationController.js # User & role notifications
│   │   └── reportController.js       # Turnout analytics, category breakdown
│   ├── middleware/
│   │   ├── auth.js           # JWT verification & RBAC authorization
│   │   ├── errorHandler.js   # Centralized error handler
│   │   └── validate.js       # Input sanitizer
│   ├── models/
│   │   ├── userModel.js
│   │   ├── eventModel.js
│   │   ├── registrationModel.js
│   │   ├── attendanceModel.js
│   │   ├── odModel.js
│   │   ├── notificationModel.js
│   │   └── pastParticipationModel.js
│   ├── routes/
│   │   ├── api.js            # Master /api router
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── odRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── reportRoutes.js
│   ├── utils/
│   │   ├── qrToken.js        # Registration numbers & secure QR token generation
│   │   └── response.js       # Standardized response format
│   └── server.js             # Express bootstrap with Helmet, CORS, JSON parser
├── database/
│   ├── schema.sql            # MySQL DDL schema
│   ├── seeds.js              # Initial development seed dataset
│   └── migrate.js           # Auto DB setup & migration runner
├── .env.example
├── .gitignore
└── package.json
```

---

## 2. Requirements & Versions

- **Node.js**: `v18.0.0+` (v20+ recommended)
- **MySQL**: `v8.0+`
- **npm**: `v9.0+`

---

## 3. Installation Instructions

Navigate to the project root or backend directory and install dependencies:

```bash
cd backend
npm install
```

---

## 4. Environment Variables Setup

Create a `.env` file in the `backend/` directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your local MySQL credentials:

```ini
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tp_club
DB_USER=tpclub_app
DB_PASSWORD=your_mysql_password_here

# JWT Secret
JWT_SECRET=tp_club_jwt_super_secure_secret_key_2026_x89f
JWT_EXPIRES_IN=7d
```

> **Security Note**: Never commit `.env` containing real passwords to version control.

---

## 5. Database Setup & Migrations

The project includes an automated migration and seed script.

### Create Database, Schema & Seed Initial Data
```bash
npm run db:setup
```

Or manually in MySQL CLI:
```sql
CREATE DATABASE tp_club CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tp_club;
SOURCE database/schema.sql;
```

---

## 6. Starting the Application

### Start Backend Server
- **Development (with hot-reload):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```
The backend will run on `http://localhost:5000`.

### Start Frontend Client
From the `frontend/` directory:
```bash
cd ../frontend
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## 7. Database Structure & Tables

| Table | Description | Key Constraints |
|---|---|---|
| `users` | Students, faculty, and administrators | `email` (UNIQUE), `register_number` (UNIQUE), `employee_id` (UNIQUE) |
| `events` | Club events and external opportunities | `start_date`, `type`, `category`, `capacity`, `registered_count` |
| `registrations` | Student event registration passes | `registration_number` (UNIQUE), `qr_code_token` (UNIQUE), FK -> users, FK -> events |
| `attendance` | Real-time verified check-in records | `(event_id, student_id)` (UNIQUE), FK -> events, FK -> users |
| `od_requests` | On-Duty leave applications | Status: `PENDING`, `APPROVED`, `REJECTED`, FK -> users, FK -> events |
| `notifications` | Role-based and user-specific alerts | `recipient_role`, `recipient_id`, `is_read` |
| `past_participation` | Student extracurricular history | FK -> users |

---

## 8. Authentication & User Roles

### User Roles
- **`student`**: Discovers events, registers for opportunities, generates QR tickets, applies for OD, views attendance.
- **`staff`**: Creates/edits events, reviews and approves OD requests, scans QR passes, monitors turnout analytics.
- **`admin`**: Full administrative system access.

### Default Seed Accounts (Development)
| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@college.edu` | `student123` | Vignesh B (23CSE001) |
| **Staff** | `staff@college.edu` | `staff123` | Dr. K. Ramanathan (EMP-CSE-104) |
| **Faculty** | `meenakshi.it@college.edu` | `staff123` | Prof. S. Meenakshi (EMP-IT-082) |
| **HOD** | `balaji.ece@college.edu` | `staff123` | Dr. R. Balaji (EMP-ECE-045) |

---

## 9. API Endpoint Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT token |
| `POST` | `/api/auth/register` | Public | Register new student or staff account |
| `GET` | `/api/auth/me` | Protected | Get authenticated user profile |
| `POST` | `/api/auth/switch-demo` | Public | 1-Click fast role switcher for demo/development |

### User Management (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/students` | Public/Staff | List student directory |
| `GET` | `/api/users/staff` | Public | List faculty & staff members |
| `PUT` | `/api/users/profile` | Protected | Update current user's profile |

### Opportunities & Events (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | List events (supports `search`, `type`, `category`, `city`, `fee`, `sort`) |
| `GET` | `/api/events/:id` | Public | Get single event details |
| `POST` | `/api/events` | Staff/Admin | Create new event or opportunity |
| `PUT` | `/api/events/:id` | Staff/Admin | Update event details |
| `DELETE` | `/api/events/:id` | Staff/Admin | Delete event |
| `POST` | `/api/events/:id/track-view` | Public | Increment views counter |
| `POST` | `/api/events/:id/track-click` | Public | Increment registration clicks counter |

### Registrations & Entry Passes (`/api/registrations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/registrations` | Public/Student | Register for event, generate Pass ID and QR Token |
| `GET` | `/api/registrations/my` | Student | Get logged-in student's registrations |
| `GET` | `/api/registrations/event/:eventId` | Staff/Admin | Get all registrations for an event |
| `GET` | `/api/registrations/:id` | Public | Get registration pass details |
| `POST` | `/api/registrations/:id/cancel` | Student/Staff | Cancel registration |
| `GET` | `/api/registrations/past/:studentId` | Public | Get student's past participation history |

### QR Scanner & Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/attendance/scan` | Public/Staff | Verify QR pass, check event matching, prevent duplicate check-in, record timestamp |
| `GET` | `/api/attendance/event/:eventId` | Staff/Admin | Get live attendance log for an event |
| `GET` | `/api/attendance/metrics/:eventId` | Public/Staff | Get turnout metrics (registered, present, absent, rate, capacity) |
| `GET` | `/api/attendance/export/:eventId` | Staff/Admin | Export attendance report as downloadable CSV |

### On-Duty (OD) Workflow (`/api/od`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/od` | Student | Submit new On-Duty application |
| `GET` | `/api/od/my` | Student | Get student's OD applications |
| `GET` | `/api/od` | Staff/Admin | Get all OD applications across college |
| `GET` | `/api/od/:id` | Public | Get OD application details |
| `PUT` | `/api/od/:id/approve` | Staff/Admin | Approve OD request and notify student |
| `PUT` | `/api/od/:id/reject` | Staff/Admin | Reject OD request with reason and notify student |

### Notifications & Reports (`/api/notifications`, `/api/reports`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Public/Protected | Get notifications for active user/role |
| `PUT` | `/api/notifications/:id/read` | Public/Protected | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | Public/Protected | Mark all notifications as read |
| `GET` | `/api/reports/analytics` | Staff/Admin | Opportunity traffic, clicks, registrations, and category breakdown |

---

## 10. QR & Attendance Verification Rules

1. **Event Match Validation**: The QR code token must match the registered event. If a student presents a ticket for Event A at Event B's gate, the API rejects with `400 WRONG_EVENT`.
2. **Duplicate Check-in Prevention**: Once a student is marked `PRESENT`, subsequent scans return `400 ALREADY_CHECKED_IN` with the exact previous check-in timestamp.
3. **Invalid Token Handling**: Fake or manipulated QR codes return `400 INVALID_QR`.
4. **Capacity Enforcement**: Event registration checks current registration count against `capacity`.

---

## 11. Troubleshooting

- **`ER_ACCESS_DENIED_ERROR`**: Verify `DB_USER` and `DB_PASSWORD` in `backend/.env`.
- **`ECONNREFUSED 127.0.0.1:3306`**: Ensure MySQL service is running (`net start MySQL80` or via Windows Services).
- **CORS Issues**: Ensure `CORS_ORIGIN` in `backend/.env` matches frontend host (`http://localhost:5173`).
