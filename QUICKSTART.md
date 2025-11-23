# ChatFlow - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Setup Database (One-time)
```bash
./setup-database.sh
```

### 2️⃣ Start Application
```bash
./start-chatflow.sh
```

### 3️⃣ Open Browser
Navigate to: **http://localhost:3000**

Login with:
- **Email**: admin@chatflow.com
- **Password**: password123

---

## 🛑 Stop Application
```bash
./stop-chatflow.sh
```

---

## 📋 What's Running?

| Service | Port | URL |
|---------|------|-----|
| Frontend (React) | 3000 | http://localhost:3000 |
| Backend (Spring Boot) | 8080 | http://localhost:8080 |
| Database (PostgreSQL) | 5432 | localhost:5432/chatflow |

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@chatflow.com | password123 |
| User | user@chatflow.com | password123 |
| Jane | jane@chatflow.com | password123 |

---

## 📁 Project Structure

```
chat-rocket/
├── chatFlow/              # Spring Boot Backend (Port 8080)
│   ├── src/main/java/    # Java source code
│   └── src/main/resources/
│       └── application.yml  # Backend config
│
├── src/                   # React Frontend (Port 3000)
│   ├── pages/            # Page components
│   ├── services/         # API integration
│   └── contexts/         # Auth context
│
├── setup-database.sh     # Database setup script
├── start-chatflow.sh     # Start both services
└── stop-chatflow.sh      # Stop all services
```

---

## 🔧 Manual Start (Alternative)

If scripts don't work, start manually:

**Terminal 1 - Backend:**
```bash
cd chatFlow
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
npm install
npm start
```

---

## ✅ Verify Setup

1. **Check Backend**: http://localhost:8080/api/auth/health
2. **Check Frontend**: http://localhost:3000
3. **Test Login**: Use demo credentials above

---

## 🐛 Common Issues

### PostgreSQL not running?
```bash
brew services start postgresql@14  # macOS
```

### Port already in use?
```bash
lsof -ti:3000 | xargs kill -9  # Kill frontend
lsof -ti:8080 | xargs kill -9  # Kill backend
```

### Database connection failed?
```bash
psql -U root -d chatflow -h localhost
# Password: Admin
```

---

## 📚 Full Documentation

- [Complete Setup Guide](SETUP.md)
- [Backend Documentation](chatFlow/README.md)
- [Main README](README.md)

---

## 🎯 Next Steps

1. ✅ Login with demo account
2. ✅ Try registering a new user
3. ✅ Explore the chat interface
4. ✅ Check the database: `psql -U root -d chatflow`
5. ✅ Review the code structure

---

**Need Help?** Check [SETUP.md](SETUP.md) for detailed troubleshooting.
