// Kategori icon ve color mapping
export const CATEGORY_CONFIG = {
  'Teknoloji': { icon: '💻', color: '#007bff' },
  'Bilim': { icon: '🔬', color: '#28a745' },
  'Sanat': { icon: '🎨', color: '#dc3545' },
  'Spor': { icon: '⚽', color: '#ffc107' },
  'Sağlık': { icon: '🏥', color: '#17a2b8' },
  'Eğitim': { icon: '📚', color: '#6f42c1' },
  'Seyahat': { icon: '✈️', color: '#fd7e14' },
  'Yemek': { icon: '🍕', color: '#e83e8c' }
}

// Kategori için icon ve color getirme fonksiyonu
export const getCategoryConfig = (categoryName) => {
  return CATEGORY_CONFIG[categoryName] || { icon: '📚', color: '#007bff' }
}

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
