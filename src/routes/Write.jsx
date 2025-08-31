import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS } from '../config/api'

export default function Write() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    // API'den kategorileri al
    fetch(API_ENDPOINTS.CATEGORIES)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          setCategories(data.data)
        } else {
          console.error('Kategoriler yüklenirken hata:', data)
          setCategories([])
        }
        setLoadingCategories(false)
      })
      .catch(err => {
        console.error('Kategoriler çekilirken hata:', err)
        setCategories([])
        setLoadingCategories(false)
      })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      // Token'ı al
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Giriş yapmanız gerekiyor')
      }

      // Kategori ID'sini bul
      const selectedCategory = categories.find(c => c.name === category)
      if (!selectedCategory) {
        throw new Error('Geçerli bir kategori seçin')
      }

      const res = await fetch(API_ENDPOINTS.BLOGS, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          content, 
          categoryId: selectedCategory.id 
        })
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Kaydetme başarısız')
      }
      
      const created = await res.json()
      navigate(`/category/${encodeURIComponent(category)}`)
    } catch (err) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="write-page">
        <h1>✍️ Yeni Yazı</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="write-form">
          <input
            className="input"
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Yazar"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          {loadingCategories ? (
            <select className="input" disabled>
              <option>Kategoriler yükleniyor...</option>
            </select>
          ) : categories.length > 0 ? (
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Bir kategori seçin</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.icon} {c.name} - {c.description}
                </option>
              ))}
            </select>
          ) : (
            <select className="input" disabled>
              <option>Kategori bulunamadı</option>
            </select>
          )}
          <textarea
            className="textarea"
            placeholder="İçerik"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />
          <div className="button-group">
            <button type="button" onClick={() => navigate(-1)} disabled={submitting}>Vazgeç</button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : 'Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}


