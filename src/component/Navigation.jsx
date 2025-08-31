import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgisini al
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: '🏠' },
    { path: '/trending', label: 'Trend', icon: '🔥' },
    { path: '/categories', label: 'Kategoriler', icon: '📚' },
    { path: '/search', label: 'Arama', icon: '🔍' },
    { path: '/about', label: 'Hakkında', icon: 'ℹ️' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-badge">B</span>
            <span className="brand-title">BlogSphere</span>
          </Link>
        </div>

        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={() => document.body.classList.toggle('light-theme')}>
            🌙
          </button>
          
          {user ? (
            <>
              <Link to="/write" className="write-btn">
                <span className="write-icon">✏️</span>
                <span className="write-text">Yaz</span>
              </Link>
              <div className="user-menu">
                <span className="user-name">👤 {user.first_name || user.username}</span>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">Profil</Link>
                  <Link to="/my-comments" className="dropdown-item">Yorumlarım</Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Çıkış
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Giriş Yap
              </Link>
              <Link to="/register" className="register-btn">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          
          {user ? (
            <div className="mobile-user-menu">
              <span className="mobile-user-name">👤 {user.first_name || user.username}</span>
              <Link to="/profile" className="mobile-nav-item">Profil</Link>
              <Link to="/my-comments" className="mobile-nav-item">Yorumlarım</Link>
              <button onClick={handleLogout} className="mobile-logout-btn">
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="mobile-login-btn">
                Giriş Yap
              </Link>
              <Link to="/register" className="mobile-register-btn">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
