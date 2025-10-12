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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
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

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/me'),
};

export const ticketApi = {
  list: (params = {}) => api.get('/tickets', { params }),
  get: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.patch(`/tickets/${id}`, data),
  assignSelf: (id) => api.post(`/tickets/${id}/assign/self`),
  assign: (id, assigneeId) => api.post(`/tickets/${id}/assign`, { assignee_id: assigneeId }),
  addCollaborator: (id, userId) => api.post(`/tickets/${id}/collaborators`, { user_id: userId }),
  removeCollaborator: (id, userId) => api.delete(`/tickets/${id}/collaborators/${userId}`),
  updateStatus: (id, status, reason) => api.post(`/tickets/${id}/status`, { status, reason }),
  addComment: (id, data) => api.post(`/tickets/${id}/comments`, data),
  cancelIrrelevant: (id, reason) => api.post(`/tickets/${id}/cancel/irrelevant`, { reason }),
  clientDelete: (id, reason) => api.post(`/tickets/${id}/client-delete`, { reason }),
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

export const userApi = {
  list: (params = {}) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateStatus: (id, is_active) => api.patch(`/users/${id}/status`, { is_active }),
};

export default api;
