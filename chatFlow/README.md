# ChatFlow Backend - Spring Boot WebFlux

## Overview
This is the backend service for ChatFlow, built with Spring Boot WebFlux for reactive programming and PostgreSQL for data persistence.

## Tech Stack
- **Spring Boot 3.5.7** - Application framework
- **Spring WebFlux** - Reactive web framework
- **Spring Data R2DBC** - Reactive database access
- **PostgreSQL** - Database
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Lombok** - Reduce boilerplate code

## Prerequisites
- Java 21
- PostgreSQL 14+
- Maven 3.8+

## Database Setup

### 1. Install PostgreSQL
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql-14
sudo systemctl start postgresql
```

### 2. Create Database and User
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE chatflow;

# Create user (if not exists)
CREATE USER root WITH PASSWORD 'Admin';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE chatflow TO root;

# Exit
\q
```

### 3. Verify Connection
```bash
psql -U root -d chatflow -h localhost
# Password: Admin
```

## Running the Application

### 1. Build the project
```bash
cd chatFlow
./mvnw clean install
```

### 2. Run the application
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/health` - Health check

### Request Examples

#### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "fullName": "Test User",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chatflow.com",
    "password": "password123"
  }'
```

## Demo Credentials
- **Admin**: admin@chatflow.com / password123
- **User**: user@chatflow.com / password123
- **Jane**: jane@chatflow.com / password123

## Configuration
Edit `src/main/resources/application.yml` to change:
- Database connection
- JWT secret and expiration
- CORS settings
- Server port

## Project Structure
```
chatFlow/
├── src/main/java/com/hotelbooking/chatflow/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # Database entities
│   ├── repository/     # R2DBC repositories
│   ├── security/       # Security configuration
│   └── service/        # Business logic
└── src/main/resources/
    ├── application.yml  # Application configuration
    └── schema.sql      # Database schema
```

## Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running: `brew services list` or `systemctl status postgresql`
2. Check credentials in `application.yml`
3. Ensure database exists: `psql -U root -d chatflow`

### Port Already in Use
Change the port in `application.yml`:
```yaml
server:
  port: 8081
```

## Development
- The application uses R2DBC for reactive database access
- JWT tokens expire after 24 hours
- CORS is configured for localhost:3000 and localhost:4028
- Database schema is auto-initialized on startup
