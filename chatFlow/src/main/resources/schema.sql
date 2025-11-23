-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    avatar_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'offline',
    bio TEXT,
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- Insert demo users (passwords are hashed for 'password123')
-- BCrypt hash: $2a$10$lfa8tZmlrJH/DxD/Ygjf4eFV1TbIOCif0BYwF3749dTT/HBQfWJfS
INSERT INTO users (email, username, full_name, password, avatar_url, status, is_online) 
VALUES 
    ('admin@chatflow.com', 'admin', 'Admin User', '$2a$10$lfa8tZmlrJH/DxD/Ygjf4eFV1TbIOCif0BYwF3749dTT/HBQfWJfS', 'https://ui-avatars.com/api/?name=Admin+User&background=random', 'online', true),
    ('user@chatflow.com', 'user', 'Regular User', '$2a$10$lfa8tZmlrJH/DxD/Ygjf4eFV1TbIOCif0BYwF3749dTT/HBQfWJfS', 'https://ui-avatars.com/api/?name=Regular+User&background=random', 'online', false),
    ('jane@chatflow.com', 'jane', 'Jane Doe', '$2a$10$lfa8tZmlrJH/DxD/Ygjf4eFV1TbIOCif0BYwF3749dTT/HBQfWJfS', 'https://ui-avatars.com/api/?name=Jane+Doe&background=random', 'online', false)
ON CONFLICT (email) DO NOTHING;
