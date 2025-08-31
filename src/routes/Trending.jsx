import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS } from '../config/api'

export default function Trending() {
  const [trendingBlogs, setTrendingBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Popüler blogları API'den al
    fetch(`${API_ENDPOINTS.BLOGS}/popular?limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          const transformedBlogs = data.data.map(blog => ({
            id: blog.id,
            title: blog.title,
            author: blog.author_name || blog.author,
            category: blog.category_name || blog.category,
            views: blog.view_count || 0,
            likes: blog.like_count || 0,
            createdAt: blog.created_at || blog.createdAt
          }));
          setTrendingBlogs(transformedBlogs);
        } else {
          console.error("API'den beklenmeyen veri formatı:", data);
          setTrendingBlogs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Trend yazılar çekerken hata:', err);
        setTrendingBlogs([]);
        setLoading(false);
      });
  }, [])

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="trending-page">
          <div className="trending-header">
            <h1>🔥 Trend Yazılar</h1>
            <p>En popüler ve güncel içerikler</p>
          </div>
          <div className="trending-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="trending-card skeleton">
                <div className="skeleton-title" />
                <div className="skeleton-body" />
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="trending-page">
        <div className="trending-header">
          <h1>🔥 Trend Yazılar</h1>
          <p>En popüler ve güncel içerikler</p>
        </div>
        
        <div className="trending-grid">
          {trendingBlogs.map((blog, index) => (
            <div key={blog.id} className="trending-card">
              <div className="trending-rank">#{index + 1}</div>
              <div className="trending-content">
                <h3 className="trending-title">{blog.title}</h3>
                <div className="trending-meta">
                  <span className="trending-author">{blog.author}</span>
                  <span className="trending-category">{blog.category}</span>
                </div>
                <div className="trending-stats">
                  <span className="trending-views">👁️ {blog.views.toLocaleString()}</span>
                  <span className="trending-likes">❤️ {blog.likes.toLocaleString()}</span>
                </div>
                <Link to={`/blog/${blog.id}`} className="trending-link">
                  Oku →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="trending-info">
          <h3>Trend Yazılar Nasıl Belirlenir?</h3>
          <p>Trend yazılar, okunma sayısı, beğeni sayısı, paylaşım oranı ve güncellik gibi faktörlere göre belirlenir. Bu sayfada en popüler içerikleri bulabilirsiniz.</p>
        </div>
      </div>
    </>
  )
}
