# Unread Messages Feature

## Overview
The unread message indicator shows the number of unread messages for each conversation in the sidebar. When a user clicks on a conversation, all messages are automatically marked as read and the counter disappears.

## How It Works

### Backend
1. **Mark Conversation as Read Endpoint**: `PUT /api/messages/conversation/{friendId}/read`
   - Marks all unread messages in a conversation as read
   - Only marks messages where the current user is the receiver

2. **Get Conversations Endpoint**: `GET /api/messages/conversations`
   - Returns all conversations with unread count for each
   - Counts only messages where current user is receiver and `isRead = false`

### Frontend
1. **Unread Count Display**: Shows in the conversation list (Sidebar component)
   - Blue badge with white text showing the number
   - Only appears when `unreadCount > 0`

2. **Auto Mark as Read**: When user clicks a conversation
   - Calls `markConversationAsRead(friendId)` API
   - Updates local state to set `unreadCount = 0`
   - Happens automatically when conversation is opened

## API Endpoints

### Mark Conversation as Read
```
PUT /api/messages/conversation/{friendId}/read
Headers: Authorization: Bearer {token}
Response: 200 OK
```

### Get Conversations (includes unread count)
```
GET /api/messages/conversations
Headers: Authorization: Bearer {token}
Response: [
  {
    "friend": { ... },
    "lastMessage": { ... },
    "unreadCount": 2  // Number of unread messages
  }
]
```

## UI Behavior

1. **Conversation List**:
   - Shows blue badge with number when there are unread messages
   - Badge appears on the right side of the conversation item
   - Badge disappears when conversation is opened

2. **Message Status**:
   - Single check: Sent
   - Double gray check: Delivered
   - Double blue check: Read

## Testing

1. Login as User A
2. Send messages to User B
3. Login as User B
4. See unread count badge on User A's conversation
5. Click on the conversation
6. Badge should disappear (messages marked as read)
