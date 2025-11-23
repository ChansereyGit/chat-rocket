# ChatFlow Project Map

## 🗺️ Complete Project Structure

```
chat-rocket/
│
├── 📱 FRONTEND (React + Vite) - Port 3000
│   ├── src/
│   │   ├── pages/
│   │   │   └── authentication/
│   │   │       ├── index.jsx                    # Main auth page
│   │   │       └── components/
│   │   │           ├── LoginForm.jsx            # Login form
│   │   │           ├── RegisterForm.jsx         # Registration form
│   │   │           ├── AuthHeader.jsx           # Header component
│   │   │           ├── AuthToggle.jsx           # Login/Register toggle
│   │   │           └── SocialLogin.jsx          # Social auth buttons
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx                  # ✅ Modified - API integration
│   │   │
│   │   ├── services/
│   │   │   └── api.js                           # ✅ New - API service layer
│   │   │
│   │   └── components/
│   │       └── ui/                              # Reusable UI components
│   │
│   ├── vite.config.mjs                          # ✅ Modified - Port 3000 + proxy
│   ├── package.json                             # Dependencies
│   └── .env                                     # ✅ New - Environment variables
│
├── 🔧 BACKEND (Spring Boot WebFlux) - Port 8080
│   └── chatFlow/
│       ├── src/main/java/com/hotelbooking/chatflow/
│       │   │
│       │   ├── 🎯 ChatFlowApplication.java      # ✅ Modified - Main app
│       │   │
│       │   ├── 📋 config/
│       │   │   └── DatabaseConfig.java          # ✅ New - DB initialization
│       │   │
│       │   ├── 🌐 controller/
│       │   │   └── AuthController.java          # ✅ New - Auth endpoints
│       │   │
│       │   ├── 📦 dto/
│       │   │   ├── AuthResponse.java            # ✅ New - Auth response
│       │   │   ├── LoginRequest.java            # ✅ New - Login request
│       │   │   ├── RegisterRequest.java         # ✅ New - Register request
│       │   │   └── UserDto.java                 # ✅ New - User DTO
│       │   │
│       │   ├── 🗃️ entity/
│       │   │   ├── User.java                    # ✅ New - User entity
│       │   │   └── Message.java                 # ✅ New - Message entity
│       │   │
│       │   ├── 💾 repository/
│       │   │   ├── UserRepository.java          # ✅ New - User repo
│       │   │   └── MessageRepository.java       # ✅ New - Message repo
│       │   │
│       │   ├── 🔐 security/
│       │   │   ├── SecurityConfig.java          # ✅ New - Security config
│       │   │   └── JwtUtil.java                 # ✅ New - JWT utility
│       │   │
│       │   └── 💼 service/
│       │       └── AuthService.java             # ✅ New - Auth business logic
│       │
│       ├── src/main/resources/
│       │   ├── application.yml                  # ✅ Modified - Configuration
│       │   └── schema.sql                       # ✅ New - Database schema
│       │
│       ├── pom.xml                              # ✅ Modified - Dependencies
│       ├── README.md                            # ✅ New - Backend docs
│       └── API.md                               # ✅ New - API documentation
│
├── 🗄️ DATABASE (PostgreSQL) - Port 5432
│   ├── Database: chatflow
│   ├── User: root
│   ├── Password: Admin
│   └── Tables:
│       ├── users                                # User accounts
│       └── messages                             # Chat messages
│
├── 📜 SCRIPTS
│   ├── setup-database.sh                        # ✅ New - DB setup
│   ├── start-chatflow.sh                        # ✅ New - Start all services
│   └── stop-chatflow.sh                         # ✅ New - Stop all services
│
└── 📚 DOCUMENTATION
    ├── README.md                                # ✅ New - Main overview
    ├── QUICKSTART.md                            # ✅ New - Quick start guide
    ├── SETUP.md                                 # ✅ New - Detailed setup
    ├── INTEGRATION_SUMMARY.md                   # ✅ New - Integration details
    ├── PROJECT_MAP.md                           # ✅ New - This file
    └── .gitignore                               # ✅ New - Git ignore rules
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (React) - http://localhost:3000                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  LoginForm.jsx / RegisterForm.jsx                    │   │
│  │  - Collects user input                               │   │
│  │  - Validates form data                               │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│                       ↓                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AuthContext.jsx                                     │   │
│  │  - signIn() / signUp()                               │   │
│  │  - Manages auth state                                │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│                       ↓                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  api.js (API Service)                                │   │
│  │  - authAPI.login()                                   │   │
│  │  - authAPI.register()                                │   │
│  │  - Adds JWT token to headers                         │   │
│  └────────────────────┬─────────────────────────────────┘   │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │ HTTP POST /api/auth/login
                        │ HTTP POST /api/auth/register
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Spring Boot) - http://localhost:8080              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AuthController.java                                 │   │
│  │  - @PostMapping("/auth/login")                       │   │
│  │  - @PostMapping("/auth/register")                    │   │
│  │  - Validates request                                 │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│                       ↓                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AuthService.java                                    │   │
│  │  - login(LoginRequest)                               │   │
│  │  - register(RegisterRequest)                         │   │
│  │  - Business logic                                    │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│                       ↓                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  UserRepository.java (R2DBC)                         │   │
│  │  - findByEmail()                                     │   │
│  │  - save()                                            │   │
│  │  - Reactive database operations                      │   │
│  └────────────────────┬─────────────────────────────────┘   │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │ R2DBC (Reactive)
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL) - localhost:5432/chatflow            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  users table                                         │   │
│  │  - id, email, username, password, etc.              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  messages table                                      │   │
│  │  - id, sender_id, receiver_id, content, etc.        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Returns data
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  BACKEND - Generates JWT Token                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  JwtUtil.java                                        │   │
│  │  - generateToken(email, userId)                      │   │
│  │  - Creates JWT with 24h expiration                   │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        │ Returns AuthResponse
                        │ { token, user }
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND - Stores Token & User                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  localStorage.setItem('chatflow_token', token)       │   │
│  │  localStorage.setItem('chatflow_user', user)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                       │                                      │
│                       ↓                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Navigate to /main-chat-interface                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend validates input
   ↓
3. Frontend calls API (api.js)
   ↓
4. Backend receives request (AuthController)
   ↓
5. Backend validates credentials (AuthService)
   ↓
6. Backend queries database (UserRepository)
   ↓
7. Database returns user data
   ↓
8. Backend verifies password (BCrypt)
   ↓
9. Backend generates JWT token (JwtUtil)
   ↓
10. Backend returns { token, user }
    ↓
11. Frontend stores token in localStorage
    ↓
12. Frontend redirects to chat interface
    ↓
13. Subsequent requests include JWT in headers
```

---

## 📊 Technology Stack

### Frontend
```
React 18.2.0
├── Vite 5.4.11 (Build tool)
├── React Router 6.0.2 (Navigation)
├── TailwindCSS 3.4.6 (Styling)
├── Framer Motion 10.16.4 (Animations)
└── Lucide React 0.484.0 (Icons)
```

### Backend
```
Spring Boot 3.5.7
├── Spring WebFlux (Reactive web)
├── Spring Data R2DBC (Reactive DB)
├── Spring Security (Authentication)
├── JJWT 0.12.3 (JWT tokens)
├── Lombok (Code generation)
└── PostgreSQL R2DBC Driver
```

### Database
```
PostgreSQL 14+
├── R2DBC Protocol (Reactive)
└── JDBC Driver (Migrations)
```

---

## 🚀 Startup Sequence

### Automated (Recommended)
```bash
./setup-database.sh    # One-time setup
./start-chatflow.sh    # Start everything
```

### Manual
```bash
# 1. Start PostgreSQL
brew services start postgresql@14

# 2. Setup database
psql postgres < setup-database.sh

# 3. Start backend (Terminal 1)
cd chatFlow
./mvnw spring-boot:run

# 4. Start frontend (Terminal 2)
npm install
npm start

# 5. Open browser
open http://localhost:3000
```

---

## 🔍 Key Integration Points

### 1. Frontend → Backend
- **File:** `src/services/api.js`
- **Method:** `authAPI.login()`, `authAPI.register()`
- **URL:** `http://localhost:8080/api`

### 2. Backend → Database
- **File:** `UserRepository.java`
- **Protocol:** R2DBC (Reactive)
- **Connection:** `r2dbc:postgresql://localhost:5432/chatflow`

### 3. Authentication
- **File:** `JwtUtil.java`
- **Algorithm:** HS256
- **Expiration:** 24 hours

### 4. CORS
- **File:** `SecurityConfig.java`
- **Allowed Origins:** `localhost:3000`, `localhost:4028`

---

## 📝 Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `vite.config.mjs` | Frontend config | Port 3000, API proxy |
| `application.yml` | Backend config | Port 8080, DB connection, JWT |
| `.env` | Environment vars | API URL |
| `pom.xml` | Maven dependencies | Spring Boot, WebFlux, R2DBC |
| `package.json` | NPM dependencies | React, Vite, TailwindCSS |

---

## 🎯 Quick Reference

### URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- API: http://localhost:8080/api
- Health: http://localhost:8080/api/auth/health

### Credentials
- Database: `root` / `Admin`
- Demo User: `admin@chatflow.com` / `password123`

### Commands
```bash
# Start
./start-chatflow.sh

# Stop
./stop-chatflow.sh

# Database
psql -U root -d chatflow

# Logs
tail -f backend.log
tail -f frontend.log
```

---

## ✅ Verification Checklist

- [x] Frontend runs on port 3000
- [x] Backend runs on port 8080
- [x] Database configured (root/Admin)
- [x] JWT authentication implemented
- [x] API integration complete
- [x] CORS configured
- [x] Demo users seeded
- [x] Scripts created
- [x] Documentation complete

---

**Status:** ✅ Fully Integrated  
**Last Updated:** October 26, 2024
