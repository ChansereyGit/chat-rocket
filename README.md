# ChatFlow - Real-time Chat Application

A modern, full-stack chat application built with React and Spring Boot WebFlux.

## 🏗️ Architecture

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations

### Backend
- **Spring Boot 3.5.7** - Application framework
- **Spring WebFlux** - Reactive web framework
- **Spring Data R2DBC** - Reactive database access
- **PostgreSQL** - Database
- **JWT** - Authentication
- **WebSocket** - Real-time messaging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 21
- PostgreSQL 14+
- Maven 3.8+

### 1. Database Setup

Run the automated setup script:
```bash
chmod +x setup-database.sh
./setup-database.sh
```

Or manually:
```bash
# Create database
psql postgres
CREATE DATABASE chatflow;
CREATE USER root WITH PASSWORD 'Admin';
GRANT ALL PRIVILEGES ON DATABASE chatflow TO root;
\q
```

### 2. Backend Setup

```bash
cd chatFlow
./mvnw clean install
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

## 📁 Project Structure

```
chat-rocket/
├── chatFlow/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/hotelbooking/chatflow/
│   │       ├── config/      # Configuration
│   │       ├── controller/  # REST Controllers
│   │       ├── dto/        # Data Transfer Objects
│   │       ├── entity/     # Database Entities
│   │       ├── repository/ # R2DBC Repositories
│   │       ├── security/   # Security & JWT
│   │       └── service/    # Business Logic
│   └── src/main/resources/
│       ├── application.yml  # Configuration
│       └── schema.sql      # Database Schema
│
├── src/                     # React Frontend
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utilities
│
└── setup-database.sh       # Database setup script
```

## 🔑 Demo Credentials

- **Admin**: admin@chatflow.com / password123
- **User**: user@chatflow.com / password123
- **Jane**: jane@chatflow.com / password123

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/health` - Health check

### Example Request
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chatflow.com",
    "password": "password123"
  }'
```

## ⚙️ Configuration

### Backend (application.yml)
```yaml
server:
  port: 8080

spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/chatflow
    username: root
    password: Admin
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
```

## 🛠️ Development

### Backend
```bash
cd chatFlow
./mvnw spring-boot:run
```

### Frontend
```bash
npm start
```

### Build for Production

Backend:
```bash
cd chatFlow
./mvnw clean package
java -jar target/chatFlow-0.0.1-SNAPSHOT.jar
```

Frontend:
```bash
npm run build
npm run serve
```

## 🧪 Testing

### Backend
```bash
cd chatFlow
./mvnw test
```

### Frontend
```bash
npm test
```

## 📝 Features

- ✅ User authentication (JWT)
- ✅ User registration
- ✅ Reactive backend with WebFlux
- ✅ PostgreSQL database
- ✅ Modern React UI
- ✅ Responsive design
- 🚧 Real-time messaging (WebSocket)
- 🚧 User profiles
- 🚧 Message history
- 🚧 Online status

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
brew services list  # macOS
systemctl status postgresql  # Linux

# Test connection
psql -U root -d chatflow -h localhost
```

### Port Already in Use
Change ports in:
- Backend: `chatFlow/src/main/resources/application.yml`
- Frontend: `vite.config.mjs`

### CORS Issues
Update allowed origins in:
- `chatFlow/src/main/java/com/hotelbooking/chatflow/security/SecurityConfig.java`

## 📚 Documentation

- [Backend README](chatFlow/README.md)
- [Spring WebFlux Docs](https://docs.spring.io/spring-framework/reference/web/webflux.html)
- [React Docs](https://react.dev)

## 📄 License

MIT License

## 👥 Contributors

Built with ❤️ for real-time communication
# chat-rocket
