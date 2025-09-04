import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS } from '../config/api'

export default function MyComments() {
  const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMyComments()
  }, [])

  const loadMyComments = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      // Kullanıcının yorumlarını al
      const response = await fetch(`${API_ENDPOINTS.COMMENTS}/my-comments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setComments(data.data)
        }
      } else {
        navigate('/login')
      }
    } catch (err) {
      console.error('Yorumlar yüklenirken hata:', err)
      setError('Yorumlar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  const handleCommentUpdated = (updatedComment) => {
    setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c))
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="my-comments-page">
          <p>Yükleniyor...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="my-comments-page">
        <div className="my-comments-header">
          <h1>💬 Yorumlarım</h1>
          <p>Yaptığınız tüm yorumları görüntüleyin</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <div className="my-comments-content">
          {comments.length === 0 ? (
            <div className="empty-state">
              <p>Henüz yorum yapmamışsınız.</p>
              <button onClick={() => navigate('/')} className="browse-btn">
                Blog'ları Keşfet
              </button>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="my-comment-item">
                  <div className="comment-header">
                    <div className="comment-blog-info">
                      <h3 className="blog-title">
                        <button 
                          onClick={() => navigate(`/blog/${comment.blog_id}`)}
                          className="blog-link"
                        >
                          📝 {comment.blog_title || 'Blog Başlığı'}
                        </button>
                      </h3>
                      <span className="comment-date">
                        📅 {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="comment-content">
                    <div className="comment-text">
                      <span className="comment-label">💬 Yorumunuz:</span>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                  
                  <div className="comment-actions">
                    <button 
                      onClick={() => navigate(`/blog/${comment.blog_id}`)}
                      className="view-blog-btn"
                    >
                      👁️ Blog'u Görüntüle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
