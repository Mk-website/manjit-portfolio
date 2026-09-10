import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !window.location.pathname.startsWith('/admin/login')) {
      window.location.assign('/admin/login');
    }
    return Promise.reject(error);
  },
);

const crud = (path) => ({
  get: () => API.get(`/api/${path}`),
  listAll: () => API.get(`/api/${path}/all`),
  create: (data) => API.post(`/api/${path}`, data),
  update: (id, data) => API.put(`/api/${path}/${id}`, data),
  remove: (id) => API.delete(`/api/${path}/${id}`),
});

export const api = {
  profile: {
    get: () => API.get('/api/profile'),
    update: (data) => API.put('/api/profile', data),
  },
  skills: crud('skills'),
  experience: crud('experience'),
  projects: { ...crud('projects'), getOne: (id) => API.get(`/api/projects/${id}`) },
  education: crud('education'),
  certifications: crud('certifications'),
  achievements: crud('achievements'),
  resume: {
    get: () => API.get('/api/resume'),
    listAll: () => API.get('/api/resume/all'),
    create: (data) => API.post('/api/resume', data),
    activate: (id) => API.patch(`/api/resume/${id}/activate`),
    remove: (id) => API.delete(`/api/resume/${id}`),
  },
  settings: {
    get: () => API.get('/api/settings'),
    update: (data) => API.put('/api/settings', data),
  },
  messages: {
    get: () => API.get('/api/messages'),
    post: (data) => API.post('/api/messages', data),
    markRead: (id, isRead) => API.patch(`/api/messages/${id}/read`, { isRead }),
    remove: (id) => API.delete(`/api/messages/${id}`),
  },
  auth: {
    me: () => API.get('/api/auth/me'),
    login: (email, password) => API.post('/api/auth/login', { email, password }),
    logout: () => API.post('/api/auth/logout'),
  },
};
