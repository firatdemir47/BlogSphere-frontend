import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS } from '../config/api'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Form validation
    if (!formData.email.trim() || !formData.password) {
      setError('Email ve şifre gerekli')
      setLoading(false)
      return
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir email adresi girin')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.AUTH + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', data.token)
        
        // User bilgisini güvenli şekilde kaydet
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        
        // Ana sayfaya yönlendir
        navigate('/')
      } else {
        setError(data.message || 'Giriş başarısız')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>🔐 Giriş Yap</h1>
            <p>BlogSphere hesabınıza giriş yapın</p>
          </div>

          {successMessage && (
            <div className="success-message">
              <span>✅ {successMessage}</span>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span>❌ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
                placeholder="ornek@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Hesabınız yok mu?{' '}
              <Link to="/register" className="auth-link">
                Kayıt ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
