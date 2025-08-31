import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS } from '../config/api'

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(`${API_ENDPOINTS.USERS}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProfile(data.data)
          setFormData({
            firstName: data.data.first_name || '',
            lastName: data.data.last_name || '',
            email: data.data.email || ''
          })
        }
      } else {
        navigate('/login')
      }
    } catch (err) {
      console.error('Profil yüklenirken hata:', err)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.USERS}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Profil başarıyla güncellendi')
        setEditing(false)
        loadProfile() // Profili yeniden yükle
      } else {
        setError(data.message || 'Güncelleme başarısız')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor')
      setSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.USERS}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Şifre başarıyla değiştirildi')
        setShowPasswordForm(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setError(data.message || 'Şifre değiştirme başarısız')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="profile-page">
          <p>Yükleniyor...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="profile-page">
        <div className="profile-header">
          <h1>👤 Profil</h1>
          <p>Hesap bilgilerinizi yönetin</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}

        <div className="profile-content">
          <div className="profile-section">
            <h2>Kişisel Bilgiler</h2>
            
            {!editing ? (
              <div className="profile-info">
                <div className="info-item">
                  <label>Ad:</label>
                  <span>{profile?.first_name || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-item">
                  <label>Soyad:</label>
                  <span>{profile?.last_name || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-item">
                  <label>E-posta:</label>
                  <span>{profile?.email}</span>
                </div>
                <div className="info-item">
                  <label>Kullanıcı Adı:</label>
                  <span>{profile?.username}</span>
                </div>
                <div className="info-item">
                  <label>Kayıt Tarihi:</label>
                  <span>{new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
                
                <button 
                  onClick={() => setEditing(true)}
                  className="edit-btn"
                >
                  ✏️ Düzenle
                </button>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Ad:</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="profile-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Soyad:</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="profile-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>E-posta:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="profile-input"
                    required
                  />
                </div>
                
                <div className="button-group">
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)}
                    disabled={submitting}
                  >
                    Vazgeç
                  </button>
                  <button type="submit" disabled={submitting}>
                    {submitting ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="profile-section">
            <h2>Şifre Değiştir</h2>
            
            {!showPasswordForm ? (
              <button 
                onClick={() => setShowPasswordForm(true)}
                className="password-btn"
              >
                🔐 Şifre Değiştir
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label>Mevcut Şifre:</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="profile-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Yeni Şifre:</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="profile-input"
                    minLength="6"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Yeni Şifre Tekrar:</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="profile-input"
                    minLength="6"
                    required
                  />
                </div>
                
                <div className="button-group">
                  <button 
                    type="button" 
                    onClick={() => setShowPasswordForm(false)}
                    disabled={submitting}
                  >
                    Vazgeç
                  </button>
                  <button type="submit" disabled={submitting}>
                    {submitting ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
