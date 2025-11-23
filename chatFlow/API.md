# ChatFlow API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Health Check

**GET** `/auth/health`

Check if the API is running.

**Response:**
```json
{
  "status": "UP",
  "service": "ChatFlow Authentication Service"
}
```

---

### 2. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "fullName": "Full Name",
  "password": "password123"
}
```

**Validation:**
- `email`: Required, valid email format
- `username`: Required, minimum 3 characters
- `fullName`: Required
- `password`: Required, minimum 6 characters

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "fullName": "Full Name",
    "avatarUrl": "https://ui-avatars.com/api/?name=Full+Name&background=random",
    "status": "online",
    "bio": null,
    "isOnline": true,
    "lastSeen": "2024-10-26T10:30:00",
    "isAuthenticated": true
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email already exists"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser",
    "fullName": "New User",
    "password": "password123"
  }'
```

---

### 3. Login

**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@chatflow.com",
  "password": "password123"
}
```

**Validation:**
- `email`: Required, valid email format
- `password`: Required

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@chatflow.com",
    "username": "admin",
    "fullName": "Admin User",
    "avatarUrl": "https://ui-avatars.com/api/?name=Admin+User&background=random",
    "status": "online",
    "bio": null,
    "isOnline": true,
    "lastSeen": "2024-10-26T10:30:00",
    "isAuthenticated": true
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chatflow.com",
    "password": "password123"
  }'
```

---

## Data Models

### User
```typescript
{
  id: number;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  status: string;
  bio: string | null;
  isOnline: boolean;
  lastSeen: string; // ISO 8601 datetime
  isAuthenticated: boolean;
}
```

### AuthResponse
```typescript
{
  token: string;  // JWT token
  user: User;
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "message": "Error description",
  "timestamp": "2024-10-26T10:30:00",
  "status": 400
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## JWT Token

### Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwidXNlcklkIjoxLCJpYXQiOjE2OTg0MDAwMDAsImV4cCI6MTY5ODQ4NjQwMH0.
signature
```

### Token Payload
```json
{
  "sub": "user@example.com",
  "userId": 1,
  "iat": 1698400000,
  "exp": 1698486400
}
```

### Token Expiration
- Default: 24 hours (86400000 ms)
- Configurable in `application.yml`

---

## Using the API in Frontend

### JavaScript/React Example

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Store token
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.message);
  }
};

// Register
const register = async (userData) => {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.message);
  }
};

// Authenticated Request
const makeAuthenticatedRequest = async (endpoint) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:8080/api${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
};
```

---

## Testing with Postman

1. **Import Collection**: Create a new collection named "ChatFlow"

2. **Set Base URL**: 
   - Variable: `baseUrl`
   - Value: `http://localhost:8080/api`

3. **Test Login**:
   - Method: POST
   - URL: `{{baseUrl}}/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@chatflow.com",
       "password": "password123"
     }
     ```

4. **Save Token**: Add to Tests tab:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

5. **Use Token**: In Authorization tab:
   - Type: Bearer Token
   - Token: `{{token}}`

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding:
- Spring Cloud Gateway
- Bucket4j
- Redis-based rate limiting

---

## CORS Configuration

Allowed origins:
- `http://localhost:3000`
- `http://localhost:4028`

To add more origins, update `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://localhost:4028",
    "https://yourdomain.com"
));
```

---

## Future Endpoints (Coming Soon)

- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /messages` - Get message history
- `POST /messages` - Send message
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `WebSocket /ws/chat` - Real-time messaging

---

## Support

For issues or questions:
1. Check the logs: `tail -f backend.log`
2. Review [SETUP.md](../SETUP.md)
3. Check database: `psql -U root -d chatflow`
