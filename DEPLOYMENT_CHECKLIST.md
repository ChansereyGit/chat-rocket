# ChatFlow Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Files Created ✅
- [x] 14 Java backend files
- [x] 1 Frontend API service file
- [x] 3 Shell scripts (setup, start, stop)
- [x] 6 Documentation files
- [x] 1 Environment file (.env)
- [x] 1 Database schema file

### 2. Configuration Changes ✅
- [x] Frontend port changed: 4028 → 3000
- [x] Backend port configured: 8080
- [x] Database credentials: root/Admin
- [x] JWT secret configured
- [x] CORS enabled for localhost:3000
- [x] API proxy configured in Vite

### 3. Dependencies ✅
- [x] Spring WebFlux added
- [x] Spring Data R2DBC added
- [x] R2DBC PostgreSQL driver added
- [x] Spring Security added
- [x] JWT library (JJWT) added
- [x] Validation library added

---

## 🚀 Deployment Steps

### Step 1: Database Setup
```bash
# Run the setup script
./setup-database.sh

# Verify database
psql -U root -d chatflow -h localhost
\dt
\q
```

**Expected Output:**
- Database `chatflow` created
- User `root` created
- Tables will be created on first backend start

---

### Step 2: Backend Deployment
```bash
cd chatFlow

# Clean and build
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

**Verification:**
```bash
# Check health endpoint
curl http://localhost:8080/api/auth/health

# Expected response:
# {"status":"UP","service":"ChatFlow Authentication Service"}
```

**Troubleshooting:**
- If port 8080 is in use: `lsof -ti:8080 | xargs kill -9`
- If database connection fails: Check PostgreSQL is running
- If build fails: Check Java 21 is installed

---

### Step 3: Frontend Deployment
```bash
# Install dependencies
npm install

# Start development server
npm start
```

**Verification:**
- Browser opens at http://localhost:3000
- Login page displays correctly
- No console errors

**Troubleshooting:**
- If port 3000 is in use: `lsof -ti:3000 | xargs kill -9`
- If dependencies fail: `rm -rf node_modules && npm install`
- If build fails: Check Node.js 18+ is installed

---

### Step 4: Integration Testing

#### Test 1: Health Check
```bash
curl http://localhost:8080/api/auth/health
```
**Expected:** `{"status":"UP",...}`

#### Test 2: User Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "username":"testuser",
    "fullName":"Test User",
    "password":"password123"
  }'
```
**Expected:** Returns token and user object

#### Test 3: User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@chatflow.com",
    "password":"password123"
  }'
```
**Expected:** Returns token and user object

#### Test 4: Frontend Login
1. Open http://localhost:3000
2. Enter: admin@chatflow.com / password123
3. Click "Sign In"
4. Should redirect to /main-chat-interface

#### Test 5: Database Verification
```bash
psql -U root -d chatflow -h localhost
SELECT * FROM users;
```
**Expected:** Shows demo users and any registered users

---

## 🔍 Post-Deployment Checks

### Backend Checks
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] Login endpoint works
- [ ] Register endpoint works
- [ ] JWT tokens are generated
- [ ] Database connection established
- [ ] CORS headers present

### Frontend Checks
- [ ] Application loads at localhost:3000
- [ ] Login form displays
- [ ] Registration form displays
- [ ] Form validation works
- [ ] API calls succeed
- [ ] Tokens stored in localStorage
- [ ] Navigation works after login

### Database Checks
- [ ] Database exists
- [ ] Tables created (users, messages)
- [ ] Demo users seeded
- [ ] Indexes created
- [ ] Foreign keys established

---

## 📊 Monitoring

### Backend Logs
```bash
# View logs
tail -f backend.log

# Or if running in terminal
cd chatFlow
./mvnw spring-boot:run
```

**Watch for:**
- Application startup messages
- Database connection success
- API request logs
- Any error messages

### Frontend Logs
```bash
# View logs
tail -f frontend.log

# Or check browser console
# Open DevTools → Console
```

**Watch for:**
- Vite server started
- API calls (Network tab)
- Any console errors
- React warnings

### Database Logs
```bash
# PostgreSQL logs (macOS)
tail -f /usr/local/var/log/postgresql@14.log

# Or check connection
psql -U root -d chatflow -h localhost
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Port Already in Use
**Symptom:** "Port 3000/8080 is already in use"

**Solution:**
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Or use stop script
./stop-chatflow.sh
```

---

### Issue 2: Database Connection Failed
**Symptom:** "Connection refused" or "Authentication failed"

**Solution:**
```bash
# Check PostgreSQL is running
pg_isready

# Start PostgreSQL
brew services start postgresql@14

# Verify credentials
psql -U root -d chatflow -h localhost

# Re-run setup if needed
./setup-database.sh
```

---

### Issue 3: CORS Error
**Symptom:** "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
1. Check `SecurityConfig.java` has correct origins
2. Verify frontend URL matches allowed origins
3. Restart backend after changes

---

### Issue 4: JWT Token Invalid
**Symptom:** "Invalid token" or "Token expired"

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Login again to get new token
3. Check JWT secret in `application.yml`

---

### Issue 5: Frontend Can't Reach Backend
**Symptom:** "Network Error" or "Failed to fetch"

**Solution:**
1. Verify backend is running: `curl http://localhost:8080/api/auth/health`
2. Check proxy in `vite.config.mjs`
3. Verify API URL in `.env`

---

## 🔐 Security Checklist

- [x] Passwords hashed with BCrypt
- [x] JWT tokens used for authentication
- [x] CORS properly configured
- [x] SQL injection prevented (R2DBC parameterized queries)
- [x] Input validation on backend
- [x] HTTPS ready (configure in production)
- [ ] Rate limiting (TODO for production)
- [ ] API key rotation (TODO for production)

---

## 📈 Performance Checklist

- [x] Reactive programming (WebFlux)
- [x] Non-blocking database access (R2DBC)
- [x] Connection pooling configured
- [x] Database indexes created
- [ ] Caching (TODO for production)
- [ ] Load balancing (TODO for production)

---

## 🎯 Production Readiness

### Before Production Deployment:

1. **Environment Variables**
   - [ ] Move secrets to environment variables
   - [ ] Use production database credentials
   - [ ] Update CORS allowed origins
   - [ ] Change JWT secret

2. **Database**
   - [ ] Use production PostgreSQL instance
   - [ ] Enable SSL connections
   - [ ] Set up backups
   - [ ] Configure connection pooling

3. **Security**
   - [ ] Enable HTTPS
   - [ ] Add rate limiting
   - [ ] Implement API versioning
   - [ ] Add request logging
   - [ ] Set up monitoring

4. **Build**
   - [ ] Build frontend: `npm run build`
   - [ ] Build backend: `./mvnw clean package`
   - [ ] Test production builds
   - [ ] Configure reverse proxy (nginx)

---

## 📝 Deployment Commands

### Development
```bash
# Quick start
./start-chatflow.sh

# Stop
./stop-chatflow.sh
```

### Production Build
```bash
# Backend
cd chatFlow
./mvnw clean package
java -jar target/chatFlow-0.0.1-SNAPSHOT.jar

# Frontend
npm run build
npm run serve
```

---

## ✅ Final Verification

Run this complete test:

```bash
# 1. Check all services
pg_isready                                    # PostgreSQL
curl http://localhost:8080/api/auth/health    # Backend
curl http://localhost:3000                    # Frontend

# 2. Test authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chatflow.com","password":"password123"}'

# 3. Check database
psql -U root -d chatflow -h localhost -c "SELECT COUNT(*) FROM users;"

# 4. Open browser
open http://localhost:3000
```

**All checks passed?** ✅ Deployment successful!

---

## 📞 Support

If issues persist:
1. Check logs: `backend.log`, `frontend.log`
2. Review documentation: `SETUP.md`, `QUICKSTART.md`
3. Verify configuration files
4. Check database connectivity
5. Review error messages carefully

---

**Deployment Status:** ✅ Ready for Development  
**Production Ready:** ⚠️ Additional configuration needed  
**Last Updated:** October 26, 2024
