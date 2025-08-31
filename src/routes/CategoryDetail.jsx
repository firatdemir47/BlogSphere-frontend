import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS, getCategoryConfig } from '../config/api'

export default function CategoryDetail() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(null)

  useEffect(() => {
    // Kategori bilgisini API'den al
    fetch(`${API_ENDPOINTS.CATEGORIES}?name=${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data) {
          setCategory(data.data)
        }
      })
      .catch((err) => {
        console.error('Kategori bilgisi alınırken hata:', err)
      })

    // Bu kategorideki blogları çek
    fetch(`${API_ENDPOINTS.BLOGS}/category-name/${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          const transformedBlogs = data.data.map(blog => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            author: blog.author_name || blog.author,
            category: blog.category_name || blog.category,
            createdAt: blog.created_at || blog.createdAt,
            updatedAt: blog.updated_at || blog.updatedAt
          }));
          setBlogs(transformedBlogs)
        } else {
          console.error("API'den beklenmeyen veri formatı:", data);
          setBlogs([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Blogları çekerken hata:', err)
        setBlogs([])
        setLoading(false)
      })
  }, [categoryName])

  if (!category) {
    return (
      <>
        <Navigation />
        <div className="category-detail-page">
          <div className="error-message">
            <h1>Kategori Bulunamadı</h1>
            <p>"{categoryName}" kategorisi mevcut değil.</p>
            <button onClick={() => navigate('/categories')} className="back-btn">
              Kategorilere Dön
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="category-detail-page">
        <div className="category-header">
          <div className="category-info">
            <div className="category-icon">{category.icon || getCategoryConfig(category.name).icon}</div>
            <div>
              <h1>{category.name}</h1>
              <p>{category.description}</p>
            </div>
          </div>
          <button onClick={() => navigate('/categories')} className="back-btn">
            ← Kategorilere Dön
          </button>
        </div>

        <div className="category-stats">
          <span className="blog-count">{blogs.length} yazı bulundu</span>
        </div>

        {loading ? (
          <div className="loading">
            <p>Yazılar yükleniyor...</p>
          </div>
        ) : !Array.isArray(blogs) || blogs.length === 0 ? (
          <div className="empty-state">
            <p>Bu kategoride henüz yazı bulunmuyor.</p>
            <button onClick={() => navigate('/write')} className="write-btn">
              İlk Yazıyı Yaz
            </button>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">
                    {blog.content.length > 150 
                      ? `${blog.content.substring(0, 150)}...` 
                      : blog.content
                    }
                  </p>
                  <div className="blog-meta">
                    <span className="blog-author">Yazar: {blog.author}</span>
                    {blog.createdAt && (
                      <time className="blog-date">
                        {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                      </time>
                    )}
                  </div>
                  <button 
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    className="read-more-btn"
                  >
                    Devamını Oku →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
