import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'
import CommentForm from '../component/CommentForm'
import CommentItem from '../component/CommentItem'
import ViewCounter from '../component/ViewCounter'
import ReactionButtons from '../component/ReactionButtons'
import BookmarkButton from '../component/BookmarkButton'
import TagSelector from '../component/TagSelector'

function estimateReadingMinutes(text) {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Kullanıcı bilgisini al
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev])
  }

  const handleCommentUpdated = (updatedComment) => {
    setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c))
  }

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  useEffect(() => {
    setLoading(true)
    fetch(`${API_ENDPOINTS.BLOGS}/${id}`)
      .then((r) => r.json())
      .then((data) => {
        // API'den gelen veri yapısını kontrol et ve düzelt
        if (data && data.success && data.data) {
          const blogData = data.data;
          setBlog({
            id: blogData.id,
            title: blogData.title,
            content: blogData.content,
            author: blogData.author_name,
            authorId: blogData.author_id,
            category: blogData.category_name,
            createdAt: blogData.created_at,
            updatedAt: blogData.updated_at,
            viewCount: blogData.view_count
          });
        } else if (data && data.id) {
          // Direkt blog objesi gelmişse
          setBlog(data);
        } else {
          console.error("Blog verisi bulunamadı:", data);
          setBlog(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Blog yüklenirken hata:", err);
        setBlog(null);
        setLoading(false);
      })
  }, [id])

  useEffect(() => {
    setLoadingComments(true)
    fetch(`${API_ENDPOINTS.BLOGS}/${id}/comments`)
      .then((r) => r.json())
      .then((data) => {
        // API'den gelen veri yapısını kontrol et ve düzelt
        if (data && data.success && Array.isArray(data.data)) {
          setComments(data.data);
        } else if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error("Yorum verisi beklenmeyen format:", data);
          setComments([]);
        }
        setLoadingComments(false);
      })
      .catch((err) => {
        console.error("Yorumlar yüklenirken hata:", err);
        setComments([]);
        setLoadingComments(false);
      })
  }, [id])

  const minutes = useMemo(() => estimateReadingMinutes(blog?.content), [blog])

  const isAuthor = () => {
    return user && blog && user.id === blog.authorId
  }

  if (loading) {
    return (
      <div className="detail">
        <div className="detail-cover skeleton" />
        <div className="skeleton-title" style={{ height: 28, width: '70%', marginTop: 16 }} />
        <div className="skeleton-body" style={{ height: 80, marginTop: 12 }} />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="detail">
        <p>Yazı bulunamadı.</p>
        <Link to="/" className="read-btn" style={{ marginTop: 12 }}>Geri dön</Link>
      </div>
    )
  }

  const hueBase = 180 + (String(blog.id).split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % 150)

  return (
    <div className="detail">
      {/* View Counter - görünmez component */}
      <ViewCounter blogId={blog.id} />
      
      <div className="detail-topbar">
        <Link to="/" className="read-btn">← Listeye dön</Link>
        {isAuthor() && (
          <Link to={`/blog/${blog.id}/edit`} className="edit-btn">
            ✏️ Düzenle
          </Link>
        )}
      </div>
      
      <div className="detail-cover" style={{ '--h': hueBase }} />
      <h1 style={{ marginBottom: 8 }}>{blog.title}</h1>
      <div className="detail-meta">
        <span>{blog.author}</span>
        {blog.createdAt && <time>· {new Date(blog.createdAt).toLocaleDateString()}</time>}
        <span>· {minutes} dk okuma</span>
        {blog.viewCount && <span>· 👁️ {blog.viewCount} görüntüleme</span>}
        {blog.category && <span className="pill" style={{ marginLeft: 8 }}>{blog.category}</span>}
      </div>
      
      {/* Reaction ve Bookmark butonları */}
      <div className="blog-actions">
        <ReactionButtons 
          blogId={blog.id} 
          initialReactions={{ 
            likeCount: blog.likeCount || 0, 
            dislikeCount: blog.dislikeCount || 0 
          }} 
        />
        <BookmarkButton blogId={blog.id} />
      </div>
      
      <article className="detail-content">
        {String(blog.content ?? '').split('\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <section className="comments-wrap" style={{ marginTop: 24 }}>
        <h3 className="comments-title">Yorumlar</h3>
        
        <CommentForm blogId={blog.id} onCommentAdded={handleCommentAdded} />
        
        {loadingComments ? (
          <div className="comment-item skeleton" style={{ height: 64 }} />
        ) : !Array.isArray(comments) || comments.length === 0 ? (
          <p className="comment-empty">Henüz yorum yok.</p>
        ) : (
          <div className="comments">
            {comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}


