import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; full_name: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data: { full_name?: string; avatar_url?: string }) =>
    api.put('/api/auth/profile', data),
};

export const chatAPI = {
  sendMessage: (data: { message: string; conversation_id?: string }) =>
    api.post('/api/chat/message', data),
  getConversations: () => api.get('/api/chat/conversations'),
  getMessages: (conversationId: string) =>
    api.get(`/api/chat/conversations/${conversationId}/messages`),
  deleteConversation: (conversationId: string) =>
    api.delete(`/api/chat/conversations/${conversationId}`),
};

export const userAPI = {
  getStats: () => api.get('/api/user/stats'),
  logout: () => api.post('/api/user/logout'),
};

export default api;