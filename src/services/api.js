const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('chatflow_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();

// Auth API
export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  register: (userData) => apiService.post('/auth/register', userData),
  health: () => apiService.get('/auth/health'),
};

// User API
export const userAPI = {
  getProfile: () => apiService.get('/users/profile'),
  updateProfile: (data) => apiService.put('/users/profile', data),
  setOnline: () => apiService.post('/users/status/online'),
  setOffline: () => apiService.post('/users/status/offline'),
  heartbeat: () => apiService.post('/users/heartbeat'),
};

// Friendship API
export const friendshipAPI = {
  sendFriendRequest: (friendId) => apiService.post('/friendships/request', { friendId }),
  acceptFriendRequest: (friendshipId) => apiService.put(`/friendships/${friendshipId}/accept`),
  rejectFriendRequest: (friendshipId) => apiService.delete(`/friendships/${friendshipId}/reject`),
  removeFriend: (friendshipId) => apiService.delete(`/friendships/${friendshipId}`),
  getFriends: () => apiService.get('/friendships/friends'),
  getPendingRequests: () => apiService.get('/friendships/pending'),
  searchUsers: (query) => apiService.get(`/friendships/search?query=${encodeURIComponent(query)}`),
};

// Message API
export const messageAPI = {
  sendMessage: (receiverId, content, messageType = 'text') => 
    apiService.post('/messages', { receiverId, content, messageType }),
  getConversations: () => apiService.get('/messages/conversations'),
  getConversationMessages: (friendId) => apiService.get(`/messages/conversation/${friendId}`),
  markAsRead: (messageId) => apiService.put(`/messages/${messageId}/read`),
  markConversationAsRead: (friendId) => apiService.put(`/messages/conversation/${friendId}/read`),
};

export default apiService;
