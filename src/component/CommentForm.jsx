import { useState } from 'react'
import { API_ENDPOINTS } from '../config/api'

export default function CommentForm({ blogId, onCommentAdded }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Yorum yapmak için giriş yapmanız gerekiyor')
        return
      }

      const response = await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: content.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setContent('')
        if (onCommentAdded) {
          onCommentAdded(data.data)
        }
      } else {
        setError(data.error || 'Yorum eklenirken hata oluştu')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
        </div>
      )}
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yorumunuzu yazın..."
        className="comment-input"
        rows="3"
        required
      />
      
      <button 
        type="submit" 
        className="comment-submit-btn"
        disabled={submitting || !content.trim()}
      >
        {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
      </button>
    </form>
  )
}
