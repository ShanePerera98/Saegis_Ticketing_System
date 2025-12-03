import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For FormData uploads, remove Content-Type to let browser set it with proper boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('📝 API: Detected FormData, removed Content-Type header');
    }
    
    console.log('📤 API Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasFormData: config.data instanceof FormData
    });
    
    return config;
  },
  (error) => {
    console.error('📤 API Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('📥 API Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Clear both storage types
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/me'),
};

export const ticketApi = {
  list: (params = {}) => api.get('/tickets', { params }),
  get: (id) => api.get(`/tickets/${id}`),
  create: (data) => {
    // If data is FormData, handle it with proper headers
    if (data instanceof FormData) {
      return api.post('/tickets', data, {
        headers: {
          // Let browser set Content-Type with boundary for FormData
        },
        timeout: 300000, // 5 minutes for file uploads
      });
    }
    // Regular JSON data
    return api.post('/tickets', data);
  },
  update: (id, data) => api.patch(`/tickets/${id}`, data),
  assignSelf: (id) => api.post(`/tickets/${id}/assign/self`),
  assign: (id, assigneeId) => api.post(`/tickets/${id}/assign`, { assignee_id: assigneeId }),
  addCollaborator: (id, userId) => api.post(`/tickets/${id}/collaborators`, { user_id: userId }),
  removeCollaborator: (id, userId) => api.delete(`/tickets/${id}/collaborators/${userId}`),
  updateStatus: (id, status, reason) => api.post(`/tickets/${id}/status`, { status, reason }),
  addComment: (id, data) => api.post(`/tickets/${id}/comments`, data),
  cancelIrrelevant: (id, reason) => api.post(`/tickets/${id}/cancel/irrelevant`, { reason }),
  clientDelete: (id, reason) => api.post(`/tickets/${id}/client-delete`, { reason }),
  
  // New workflow methods
  acquire: (id) => api.post(`/tickets/${id}/acquire`),
  setInProgress: (id) => api.post(`/tickets/${id}/progress`),
  pause: (id, reason) => api.post(`/tickets/${id}/pause`, { reason }),
  resume: (id) => api.post(`/tickets/${id}/resume`),
  resolve: (id, note) => api.post(`/tickets/${id}/resolve`, { note }),
  cancel: (id, reason, type) => api.post(`/tickets/${id}/cancel`, { reason, type }),
  close: (id, reason) => api.post(`/tickets/${id}/close`, { reason }),
  deleteTicket: (id) => api.delete(`/tickets/${id}/delete`),
  rate: (id, rating, feedback) => api.post(`/tickets/${id}/rate`, { rating, feedback }),
  
  // Other existing methods
  merge: (data) => api.post('/tickets/merge', data),
  undoMerge: (mergeId) => api.post(`/tickets/merge/${mergeId}/undo`),
  
  // Cancelled tickets
  getCancelled: (params = {}) => api.get('/tickets/cancelled', { params }),
  approveCancellation: (id) => api.post(`/tickets/cancelled/${id}/approve`),
  restoreTicket: (id) => api.post(`/tickets/cancelled/${id}/restore`),
  
  // Merge center
  getMerges: (params = {}) => api.get('/tickets/merges', { params }),
  
  // Reports & Analytics
  reports: (params = {}) => api.get('/tickets/reports', { params }),
  getStats: (params = {}) => api.get('/tickets/stats', { params }),
  exportReports: (params = {}) => api.get('/tickets/export', { params, responseType: 'blob' }),
  
  // Templates
  getTemplates: (params = {}) => api.get('/ticket-templates', { params }),
  createTemplate: (data) => api.post('/ticket-templates', data),
  updateTemplate: (id, data) => api.patch(`/ticket-templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/ticket-templates/${id}`),
  getTemplate: (id) => api.get(`/ticket-templates/${id}`),
  
  // Categories
  getCategories: () => api.get('/categories'),
};

export const notificationApi = {
  list: (params = {}) => api.get('/notifications', { params }),
  unread: () => api.get('/notifications/unread'),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/mark-all-read'),
  acceptCollaboration: (id) => api.post(`/notifications/${id}/accept`),
  rejectCollaboration: (id) => api.post(`/notifications/${id}/reject`),
};

export const userApi = {
  list: (params = {}) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateStatus: (id, is_active) => api.patch(`/users/${id}/status`, { is_active }),
  sendPasswordReset: (id) => api.post(`/users/${id}/send-password-reset`),
  resetPassword: (id, data) => api.patch(`/users/${id}/reset-password`, data),
};

export const profileApi = {
  show: () => api.get('/profile'),
  update: (data) => api.patch('/profile', data),
  updatePassword: (data) => api.patch('/profile/password', data),
  sendPasswordResetEmail: () => api.post('/profile/password-reset-email'),
  updateImage: (data) => api.post('/profile/image', data),
  deleteImage: () => api.delete('/profile/image'),
};

export const troubleshootApi = {
  list: () => api.get('/troubleshoot'),
  upload: (data) => {
    console.log('📡 API: Starting upload request...');
    // Create a new request instance without Content-Type header for file upload
    return api.post('/troubleshoot', data, {
      headers: {
        // Let the browser set the Content-Type with proper boundary for multipart/form-data
      },
      timeout: 300000, // 5 minutes timeout for large files
    });
  },
  update: (id, data) => api.patch(`/troubleshoot/${id}`, data),
  delete: (id) => api.delete(`/troubleshoot/${id}`),
  download: (id) => api.get(`/troubleshoot/${id}/download`, { responseType: 'blob' }),
  view: (id) => `/api/troubleshoot/${id}/view`,
};

export default api;
