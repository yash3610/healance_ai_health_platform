import axios from 'axios';
import { API_URL } from '../constants/config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healance_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle rate limiting
    if (error.response?.status === 429) {
      console.error('Too many requests. Please wait a moment before trying again.');
      // You can dispatch a toast notification here
    }
    
    // Handle unauthorized
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('healance_token');
      localStorage.removeItem('healance_user');
      // Optionally dispatch logout action or redirect
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('healance_token', response.data.token);
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('healance_token', response.data.token);
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Send WhatsApp OTP for login
  sendWhatsAppLoginOtp: async (payload) => {
    const response = await api.post('/whatsapp/send-login-otp', payload);
    return response.data;
  },

  // Verify WhatsApp OTP and login
  verifyWhatsAppLoginOtp: async (payload) => {
    const response = await api.post('/whatsapp/verify-login-otp', payload);
    if (response.data.token) {
      localStorage.setItem('healance_token', response.data.token);
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Send SMS OTP for login
  sendSmsLoginOtp: async (payload) => {
    const response = await api.post('/sms/send-login-otp', payload);
    return response.data;
  },

  // Verify SMS OTP and login
  verifySmsLoginOtp: async (payload) => {
    const response = await api.post('/sms/verify-login-otp', payload);
    if (response.data.token) {
      localStorage.setItem('healance_token', response.data.token);
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Send WhatsApp OTP for signup
  sendWhatsAppSignupOtp: async (payload) => {
    const response = await api.post('/whatsapp/send-signup-otp', payload);
    return response.data;
  },

  // Verify WhatsApp signup OTP and create account
  verifyWhatsAppSignupOtp: async (payload) => {
    const response = await api.post('/whatsapp/verify-signup-otp', payload);
    if (response.data.token) {
      localStorage.setItem('healance_token', response.data.token);
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('healance_token');
      localStorage.removeItem('healance_user');
    }
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    if (response.data.user) {
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetToken, password) => {
    const response = await api.put(`/auth/reset-password/${resetToken}`, { password });
    if (response.data.token) {
      localStorage.setItem('healance_token', response.data.token);
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Update password (when logged in)
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Update logged-in user profile
  updateProfile: async (payload) => {
    const response = await api.put('/users/profile', payload);
    if (response.data?.user) {
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  uploadProfileAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data?.user) {
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Social login (Google/GitHub)
  socialLogin: async (socialData) => {
    const response = await api.post('/auth/social', socialData);
    if (response.data.token) {
      localStorage.setItem('healance_token', response.data.token);
      localStorage.setItem('healance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};

// ==================== HEALTH DATA SERVICES ====================

export const healthService = {
  // Get user health data
  getHealthData: async () => {
    const response = await api.get('/health-data');
    return response.data;
  },

  // Add health data
  addHealthData: async (data) => {
    const response = await api.post('/health-data', data);
    return response.data;
  },

  // Get latest health snapshot
  getLatest: async () => {
    const response = await api.get('/health-data/latest');
    return response.data;
  },
};

// ==================== BLOG SERVICES ====================

export const blogService = {
  // Get all blogs
  getBlogs: async (params) => {
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  // Get single blog
  getBlog: async (identifier) => {
    const response = await api.get(`/blogs/${identifier}`);
    return response.data;
  },

  // Get trending blogs
  getTrending: async () => {
    const response = await api.get('/blogs/trending');
    return response.data;
  },

  // Like a blog
  likeBlog: async (blogId) => {
    const response = await api.post(`/blogs/${blogId}/like`);
    return response.data;
  },
};

// ==================== RISK PREDICTION SERVICES ====================

export const riskService = {
  // Analyze health risks
  analyzeRisk: async (data) => {
    const response = await api.post('/risk-prediction/analyze', data);
    return response.data;
  },

  // Get risk history
  getRiskHistory: async () => {
    const response = await api.get('/risk-prediction/history');
    return response.data;
  },

  // Get latest risk assessment
  getLatestRisk: async () => {
    const response = await api.get('/risk-prediction/latest');
    return response.data;
  },

  predictDiabetes: async (data) => {
    const response = await api.post('/predict/diabetes', data);
    return response.data;
  },

  predictHeart: async (data) => {
    const response = await api.post('/predict/heart', data);
    return response.data;
  },

  predictAll: async (data) => {
    const response = await api.post('/predict/all', data);
    return response.data;
  },

  shareToWhatsapp: async (data) => {
    const response = await api.post('/predict/share-whatsapp', data);
    return response.data;
  },
};

// ==================== CHATBOT SERVICES ====================

export const chatbotService = {
  // Send message to chatbot
  sendMessage: async ({ sessionId, message, botType }) => {
    const response = await api.post('/chatbot/message', { sessionId, message, botType });
    return response.data;
  },

  // Get chat sessions
  getSessions: async () => {
    const response = await api.get('/chatbot/sessions');
    return response.data;
  },

  // Get session messages
  getSessionMessages: async (sessionId) => {
    const response = await api.get(`/chatbot/sessions/${sessionId}`);
    return response.data;
  },

  // Delete session
  deleteSession: async (sessionId) => {
    const response = await api.delete(`/chatbot/sessions/${sessionId}`);
    return response.data;
  },
};

// ==================== GOAL SERVICES ====================

export const goalService = {
  // Get user goals
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  // Create goal
  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  // Update goal
  updateGoal: async (goalId, updates) => {
    const response = await api.put(`/goals/${goalId}`, updates);
    return response.data;
  },

  // Log progress
  logProgress: async (goalId, value) => {
    const response = await api.post(`/goals/${goalId}/progress`, { value });
    return response.data;
  },

  // Delete goal
  deleteGoal: async (goalId) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
  },

  // Get AI suggestions
  getSuggestions: async () => {
    const response = await api.get('/goals/suggestions');
    return response.data;
  },
};

// ==================== WALK & EARN SERVICES ====================

export const walkEarnService = {
  // Get rewards catalog
  getRewards: async () => {
    const response = await api.get('/walk-earn/rewards');
    return response.data;
  },

  // Redeem reward
  redeemReward: async (rewardId) => {
    const response = await api.post(`/walk-earn/redeem/${rewardId}`);
    return response.data;
  },

  // Get redemption history
  getRedemptions: async () => {
    const response = await api.get('/walk-earn/redemptions');
    return response.data;
  },

  // Log steps
  logSteps: async (steps, date) => {
    const response = await api.post('/walk-earn/log-steps', { steps, date });
    return response.data;
  },
};

// ==================== FORECAST SERVICES ====================

export const forecastService = {
  // Get health forecast
  getForecast: async (params) => {
    const response = await api.get('/forecast', { params });
    return response.data;
  },

  // Get weekly forecast
  getWeeklyForecast: async () => {
    const response = await api.get('/forecast/weekly');
    return response.data;
  },
};

// ==================== CONTACT SERVICES ====================

export const contactService = {
  // Submit contact form
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  // Submit support ticket
  submitTicket: async (formData) => {
    const response = await api.post('/contact/ticket', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get my tickets
  getMyTickets: async () => {
    const response = await api.get('/contact/tickets');
    return response.data;
  },
};

export default api;
