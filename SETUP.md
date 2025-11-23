# ChatFlow Setup Guide

## Complete Setup Instructions

### Step 1: Database Setup

Run the automated database setup:
```bash
./setup-database.sh
```

This will:
- Install PostgreSQL (if not installed)
- Create the `chatflow` database
- Create user `root` with password `Admin`
- Grant necessary permissions

### Step 2: Verify Database Connection

```bash
psql -U root -d chatflow -h localhost
# Password: Admin

# Inside psql, check tables:
\dt

# Exit:
\q
```

### Step 3: Start the Application

Option A - Use the startup script (recommended):
```bash
./start-chatflow.sh
```

Option B - Start manually:

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

### Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/api/auth/health

### Step 5: Login

Use one of the demo credentials:
- admin@chatflow.com / password123
- user@chatflow.com / password123
- jane@chatflow.com / password123

## Stopping the Application

```bash
./stop-chatflow.sh
```

Or manually:
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

## Troubleshooting

### PostgreSQL Not Running
```bash
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Port Already in Use
```bash
# Check what's using the port
lsof -i :8080
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
1. Check PostgreSQL is running: `pg_isready`
2. Verify credentials: `psql -U root -d chatflow -h localhost`
3. Check application.yml has correct credentials

### Backend Won't Start
```bash
# Clean and rebuild
cd chatFlow
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## Configuration Files

### Backend Configuration
File: `chatFlow/src/main/resources/application.yml`
```yaml
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/chatflow
    username: root
    password: Admin

server:
  port: 8080
```

### Frontend Configuration
File: `.env`
```env
VITE_API_URL=http://localhost:8080/api
```

File: `vite.config.mjs`
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080'
    }
  }
}
```

## Development Tips

### Watch Backend Logs
```bash
tail -f backend.log
```

### Watch Frontend Logs
```bash
tail -f frontend.log
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8080/api/auth/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chatflow.com","password":"password123"}'

# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@test.com",
    "username":"newuser",
    "fullName":"New User",
    "password":"password123"
  }'
```

### Database Management
```bash
# Connect to database
psql -U root -d chatflow -h localhost

# View all users
SELECT * FROM users;

# View all messages
SELECT * FROM messages;

# Reset database
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;
# Then restart the backend to recreate tables
```

## Next Steps

After successful setup:
1. Explore the authentication flow
2. Test user registration
3. Check the database for created users
4. Review the API responses
5. Customize the UI as needed

## Support

If you encounter issues:
1. Check the logs (backend.log, frontend.log)
2. Verify all services are running
3. Check database connectivity
4. Review the troubleshooting section above
