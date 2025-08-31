// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  BLOGS: `${API_BASE_URL}/blogs`,
  USERS: `${API_BASE_URL}/users`,
  AUTH: `${API_BASE_URL}/auth`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  COMMENTS: `${API_BASE_URL}/comments`,
  HEALTH: `${API_BASE_URL}/health`
}

export default API_BASE_URL
