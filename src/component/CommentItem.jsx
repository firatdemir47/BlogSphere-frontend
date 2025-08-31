import { useState } from 'react'
import { API_ENDPOINTS } from '../config/api'

export default function CommentItem({ comment, onCommentUpdated, onCommentDeleted }) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(comment.content)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Yorum düzenlemek için giriş yapmanız gerekiyor')
        return
      }

      const response = await fetch(`${API_ENDPOINTS.BLOGS}/${comment.blog_id}/comments/${comment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: content.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setIsEditing(false)
        if (onCommentUpdated) {
          onCommentUpdated({ ...comment, content: content.trim() })
        }
      } else {
        setError(data.error || 'Yorum güncellenirken hata oluştu')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Yorum silmek için giriş yapmanız gerekiyor')
        return
      }

      const response = await fetch(`${API_ENDPOINTS.BLOGS}/${comment.blog_id}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        if (onCommentDeleted) {
          onCommentDeleted(comment.id)
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Yorum silinirken hata oluştu')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const isAuthor = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.id === comment.author_id
  }

  return (
    <div className="comment-item">
      {error && <div className="comment-error">❌ {error}</div>}
      
      <div className="comment-header">
        <span className="comment-author">{comment.author_name || 'Anonim'}</span>
        {comment.created_at && (
          <time className="comment-time">
            {new Date(comment.created_at).toLocaleString()}
          </time>
        )}
        {isAuthor() && (
          <div className="comment-actions">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="comment-edit-btn"
              disabled={submitting}
            >
              ✏️
            </button>
            <button 
              onClick={handleDelete}
              className="comment-delete-btn"
              disabled={submitting}
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleEdit} className="comment-edit-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="comment-edit-input"
            rows="3"
            required
          />
          <div className="comment-edit-actions">
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false)
                setContent(comment.content)
              }}
              disabled={submitting}
            >
              Vazgeç
            </button>
            <button type="submit" disabled={submitting || !content.trim()}>
              {submitting ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      ) : (
        <p className="comment-content">{comment.content}</p>
      )}
    </div>
  )
}
