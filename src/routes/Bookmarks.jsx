import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchBookmarks()
  }, [token, navigate])

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.BOOKMARKS}/users/bookmarks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBookmarks(data.data || [])
      } else {
        setError('Bookmark\'lar yüklenemedi')
      }
    } catch (err) {
      console.error('Bookmarks fetch error:', err)
      setError('Bağlantı hatası oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBookmark = async (blogId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKMARKS}/blogs/${blogId}/bookmarks/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Bookmark'ı listeden kaldır
        setBookmarks(prev => prev.filter(bookmark => bookmark.id !== blogId))
      }
    } catch (err) {
      console.error('Remove bookmark error:', err)
      alert('Bookmark kaldırılırken hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="bookmarks-page">
        <div className="container">
          <h1>📚 Bookmark'larım</h1>
          <div className="loading">Yükleniyor...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bookmarks-page">
        <div className="container">
          <h1>📚 Bookmark'larım</h1>
          <div className="error">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bookmarks-page">
      <div className="container">
        <div className="page-header">
          <h1>📚 Bookmark'larım</h1>
          <p className="page-subtitle">
            {bookmarks.length > 0 
              ? `${bookmarks.length} adet bookmark'ınız var` 
              : 'Henüz bookmark eklemediniz'
            }
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Henüz bookmark eklemediniz</h3>
            <p>Beğendiğiniz blogları bookmark'a ekleyerek daha sonra kolayca erişebilirsiniz.</p>
            <Link to="/" className="btn btn-primary">
              Blog'ları Keşfet
            </Link>
          </div>
        ) : (
          <div className="bookmarks-list">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bookmark-item">
                <div className="bookmark-content">
                  <div className="bookmark-header">
                    <h3 className="bookmark-title">
                      <Link to={`/blog/${bookmark.id}`}>
                        📝 {bookmark.title || 'Blog Başlığı'}
                      </Link>
                    </h3>
                    <span className="bookmark-date">
                      📅 {new Date(bookmark.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  
                  <div className="bookmark-meta">
                    <span className="bookmark-author">
                      👤 {bookmark.author_name || 'Anonim'}
                    </span>
                    <span className="bookmark-category">
                      🏷️ {bookmark.category_name || 'Kategori Yok'}
                    </span>
                    <span className="bookmark-views">
                      👁️ {bookmark.view_count || 0} görüntüleme
                    </span>
                  </div>

                  {bookmark.content && (
                    <div className="bookmark-excerpt">
                      <p>{bookmark.content.substring(0, 200)}...</p>
                    </div>
                  )}
                </div>

                <div className="bookmark-actions">
                  <Link 
                    to={`/blog/${bookmark.id}`} 
                    className="btn btn-primary btn-sm"
                  >
                    👁️ Blog'u Görüntüle
                  </Link>
                  <button 
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    className="btn btn-danger btn-sm"
                    title="Bookmark'tan kaldır"
                  >
                    🗑️ Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookmarks
