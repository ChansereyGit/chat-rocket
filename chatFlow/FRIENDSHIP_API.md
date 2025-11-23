# Friendship API Documentation

## Overview
Complete API for managing friendships, friend requests, and user search functionality in ChatFlow.

## Base URL
```
http://localhost:8080/api/friendships
```

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
X-User-Id: <user_id>
```

---

## Endpoints

### 1. Search Users

**GET** `/search?query={searchTerm}`

Search for users by username, full name, email, or phone number.

**Query Parameters:**
- `query` (required): Search term

**Headers:**
```
Authorization: Bearer <token>
X-User-Id: <user_id>
```

**Response:**
```json
[
  {
    "id": 2,
    "email": "user@chatflow.com",
    "username": "user",
    "fullName": "Regular User",
    "phoneNumber": "+1234567890",
    "avatarUrl": "https://ui-avatars.com/api/?name=Regular+User",
    "status": "online",
    "isOnline": true,
    "friendshipStatus": null,
    "isFriend": false
  }
]
```

**Friendship Status Values:**
- `null` - No friendship exists
- `"PENDING"` - Friend request sent/received
- `"ACCEPTED"` - Already friends
- `"BLOCKED"` - User is blocked

**Example:**
```bash
curl "http://localhost:8080/api/friendships/search?query=john" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 1"
```

---

### 2. Send Friend Request

**POST** `/request`

Send a friend request to another user.

**Headers:**
```
Authorization: Bearer <token>
X-User-Id: <user_id>
Content-Type: application/json
```

**Request Body:**
```json
{
  "friendId": 2
}
```

**Response:**
```json
{
  "id": 1,
  "friend": {
    "id": 2,
    "email": "user@chatflow.com",
    "username": "user",
    "fullName": "Regular User",
    "phoneNumber": null,
    "avatarUrl": "https://ui-avatars.com/api/?name=Regular+User",
    "status": "online",
    "isOnline": true
  },
  "status": "PENDING",
  "isRequester": true,
  "createdAt": "2024-10-26T12:00:00"
}
```

**Error Responses:**
- `400 Bad Request` - Cannot send request to yourself
- `400 Bad Request` - Friend request already exists
- `404 Not Found` - User not found

**Example:**
```bash
curl -X POST http://localhost:8080/api/friendships/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{"friendId": 2}'
```

---

### 3. Accept Friend Request

**PUT** `/{friendshipId}/accept`

Accept a pending friend request.

**Path Parameters:**
- `friendshipId` - ID of the friendship to accept

**Headers:**
```
Authorization: Bearer <token>
X-User-Id: <user_id>
```

**Response:**
```json
{
  "id": 1,
  "friend": {
    "id": 2,
    "email": "user@chatflow.com",
    "username": "user",
    "fullName": "Regular User",
    "avatarUrl": "https://ui-avatars.com/api/?name=Regular+User",
    "status": "online",
    "isOnline": true
  },
  "status": "ACCEPTED",
  "isRequester": false,
  "createdAt": "2024-10-26T12:00:00"
}
```

**Error Responses:**
- `404 Not Found` - Friend request not found
- `400 Bad Request` - Request is not pending
- `403 Forbidden` - Unauthorized

**Example:**
```bash
curl -X PUT http://localhost:8080/api/friendships/1/accept \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 2"
```

---

### 4. Reject Friend Request

**DELETE** `/{friendshipId}/reject`

Reject a pending friend request.

**Path Parameters:**
- `friendshipId` - ID of the friendship to reject

**Headers:**
```
Authorization: Bearer <token>
X-User-Id: <user_id>
```

**Response:**
```
200 OK (empty body)
```

**Error Responses:**
- `404 Not Found` - Friend request not found
- `403 Forbidden` - Unauthorized

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/friendships/1/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 2"
```

---

### 5. Remove Friend

**DELETE** `/{friendshipId}`

Remove an existing friendship.

**Path Parameters:**
- `friendshipId` - ID of the friendship to remove

**Headers:**
```
Authorization: Bearer <token>
X-User-Id: <user_id>
```

**Response:**
```
200 OK (empty body)
```

**Error Responses:**
- `404 Not Found` - Friendship not found
- `403 Forbidden` - Unauthorized

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/friendships/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 1"
```

---

### 6. Get Friends List

**GET** `/friends`

Get list of all accepted friends.

**Headers:**
```
Authorization: Bearer <token>
X-User-Id: <user_id>
```

**Response:**
```json
[
  {
    "id": 1,
    "friend": {
      "id": 2,
      "email": "user@chatflow.com",
      "username": "user",
      "fullName": "Regular User",
      "phoneNumber": "+1234567890",
      "avatarUrl": "https://ui-avatars.com/api/?name=Regular+User",
      "status": "online",
      "bio": "Hello!",
      "isOnline": true,
      "lastSeen": "2024-10-26T12:00:00"
    },
    "status": "ACCEPTED",
    "isRequester": true,
    "createdAt": "2024-10-26T11:00:00"
  }
]
```

**Example:**
```bash
curl http://localhost:8080/api/friendships/friends \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 1"
```

---

### 7. Get Pending Requests

**GET** `/pending`

Get list of pending friend requests (received only).

**Headers:**
```
Authorization: Bearer <token>
X-User-Id: <user_id>
```

**Response:**
```json
[
  {
    "id": 2,
    "friend": {
      "id": 3,
      "email": "jane@chatflow.com",
      "username": "jane",
      "fullName": "Jane Doe",
      "avatarUrl": "https://ui-avatars.com/api/?name=Jane+Doe",
      "status": "online",
      "isOnline": true
    },
    "status": "PENDING",
    "isRequester": false,
    "createdAt": "2024-10-26T12:30:00"
  }
]
```

**Example:**
```bash
curl http://localhost:8080/api/friendships/pending \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 1"
```

---

## Data Models

### FriendshipDto
```typescript
{
  id: number;
  friend: UserDto;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";
  isRequester: boolean;
  createdAt: string; // ISO 8601 datetime
}
```

### UserSearchDto
```typescript
{
  id: number;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string;
  status: string;
  isOnline: boolean;
  friendshipStatus: "PENDING" | "ACCEPTED" | "BLOCKED" | null;
  isFriend: boolean;
}
```

### UserDto
```typescript
{
  id: number;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string;
  status: string;
  bio: string | null;
  isOnline: boolean;
  lastSeen: string | null; // ISO 8601 datetime
}
```

---

## Database Schema

### friendships table
```sql
CREATE TABLE friendships (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    friend_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    requester_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, friend_id)
);
```

### Indexes
```sql
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

---

## Frontend Integration

### API Service (src/services/api.js)
```javascript
export const friendshipAPI = {
  sendFriendRequest: (friendId) => 
    apiService.post('/friendships/request', { friendId }),
  
  acceptFriendRequest: (friendshipId) => 
    apiService.put(`/friendships/${friendshipId}/accept`),
  
  rejectFriendRequest: (friendshipId) => 
    apiService.delete(`/friendships/${friendshipId}/reject`),
  
  removeFriend: (friendshipId) => 
    apiService.delete(`/friendships/${friendshipId}`),
  
  getFriends: () => 
    apiService.get('/friendships/friends'),
  
  getPendingRequests: () => 
    apiService.get('/friendships/pending'),
  
  searchUsers: (query) => 
    apiService.get(`/friendships/search?query=${encodeURIComponent(query)}`),
};
```

### Usage Example
```javascript
// Search users
const results = await friendshipAPI.searchUsers('john');

// Send friend request
await friendshipAPI.sendFriendRequest(userId);

// Accept request
await friendshipAPI.acceptFriendRequest(friendshipId);

// Get friends
const friends = await friendshipAPI.getFriends();

// Get pending requests
const pending = await friendshipAPI.getPendingRequests();
```

---

## Testing

### Test Search
```bash
curl "http://localhost:8080/api/friendships/search?query=user" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 1"
```

### Test Send Request
```bash
curl -X POST http://localhost:8080/api/friendships/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{"friendId": 2}'
```

### Test Get Friends
```bash
curl http://localhost:8080/api/friendships/friends \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-User-Id: 1"
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Success
- `400 Bad Request` - Invalid input or business logic error
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User not authorized for this action
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "message": "Error description",
  "timestamp": "2024-10-26T12:00:00",
  "status": 400
}
```

---

## Notes

- Search results are limited to 20 users
- Users cannot send friend requests to themselves
- Duplicate friend requests are prevented
- Both users in a friendship can remove it
- Only the recipient can accept a friend request
- Phone number search requires exact match
- Username, name, and email searches are case-insensitive
