import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS } from '../config/api'

export default function EditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Blog verilerini al
    fetch(`${API_ENDPOINTS.BLOGS}/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          setBlog(data.data)
          setTitle(data.data.title)
          setContent(data.data.content)
          setCategoryId(data.data.category_id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Blog yüklenirken hata:', err)
        setLoading(false)
      })

    // Kategorileri al
    fetch(API_ENDPOINTS.CATEGORIES)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          setCategories(data.data)
        }
      })
      .catch(err => {
        console.error('Kategoriler yüklenirken hata:', err)
      })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Giriş yapmanız gerekiyor')
      }

      const res = await fetch(`${API_ENDPOINTS.BLOGS}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          categoryId: parseInt(categoryId)
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Güncelleme başarısız')
      }

      navigate(`/blog/${id}`)
    } catch (err) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Bu blog\'u silmek istediğinizden emin misiniz?')) {
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Giriş yapmanız gerekiyor')
      }

      const res = await fetch(`${API_ENDPOINTS.BLOGS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Silme başarısız')
      }

      navigate('/')
    } catch (err) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="edit-page">
          <p>Yükleniyor...</p>
        </div>
      </>
    )
  }

  if (!blog) {
    return (
      <>
        <Navigation />
        <div className="edit-page">
          <p>Blog bulunamadı.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="edit-page">
        <div className="edit-header">
          <h1>✏️ Blog Düzenle</h1>
          <button 
            onClick={handleDelete} 
            className="delete-btn"
            disabled={submitting}
          >
            🗑️ Sil
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="edit-form">
          <input
            className="input"
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>Bir kategori seçin</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>

          <textarea
            className="textarea"
            placeholder="İçerik"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />

          <div className="button-group">
            <button 
              type="button" 
              onClick={() => navigate(`/blog/${id}`)} 
              disabled={submitting}
            >
              Vazgeç
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
