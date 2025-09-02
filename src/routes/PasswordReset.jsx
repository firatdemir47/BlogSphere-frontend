import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'

const PasswordReset = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('request') // 'request', 'reset', 'success'
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // URL'den token'ı al
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      setStep('reset')
    }
  }, [])

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_ENDPOINTS.PASSWORD_RESET}/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Şifre sıfırlama linki email adresinize gönderildi')
        setStep('success')
      } else {
        setError(data.message || 'Bir hata oluştu')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.PASSWORD_RESET}/reset/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, confirmPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Şifreniz başarıyla güncellendi')
        setStep('success')
      } else {
        setError(data.message || 'Şifre sıfırlama başarısız')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="password-reset-page">
        <div className="reset-container">
          <h1>✅ Başarılı!</h1>
          <p>{success}</p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    )
  }

  if (step === 'reset') {
    return (
      <div className="password-reset-page">
        <div className="reset-container">
          <h1>🔑 Yeni Şifre Belirle</h1>
          {error && <p className="error">{error}</p>}
          
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>Yeni Şifre:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Yeni şifrenizi girin"
                required
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <label>Şifre Tekrarı:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                required
                minLength={6}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="password-reset-page">
      <div className="reset-container">
        <h1>🔑 Şifre Sıfırlama</h1>
        {error && <p className="error">{error}</p>}
        
        <form onSubmit={handleRequestReset}>
          <div className="form-group">
            <label>Email Adresi:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email adresinizi girin"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
          </button>
        </form>
        
        <div className="reset-links">
          <button 
            onClick={() => navigate('/login')}
            className="btn-secondary"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    </div>
  )
}

export default PasswordReset
