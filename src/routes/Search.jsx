import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS } from '../config/api'

export default function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(`${API_ENDPOINTS.BLOGS}/search?q=${encodeURIComponent(query.trim())}`)
      const data = await response.json()

      if (data && data.success && Array.isArray(data.data)) {
        const transformedResults = data.data.map(blog => ({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          author: blog.author_name || blog.author,
          category: blog.category_name || blog.category,
          createdAt: blog.created_at || blog.createdAt
        }))
        setResults(transformedResults)
      } else {
        setResults([])
      }
    } catch (err) {
      console.error('Arama hatası:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="search-page">
        <div className="search-header">
          <h1>🔍 Arama</h1>
          <p>BlogSphere'de aradığınız içeriği bulun</p>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Blog başlığı, içerik veya yazar ara..."
              className="search-input"
              required
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Aranıyor...' : 'Ara'}
            </button>
          </div>
        </form>

        {searched && (
          <div className="search-results">
            <h3>Arama Sonuçları</h3>
            {loading ? (
              <div className="loading">Aranıyor...</div>
            ) : results.length === 0 ? (
              <div className="no-results">
                <p>"{query}" ile eşleşen sonuç bulunamadı.</p>
                <p>Farklı anahtar kelimeler deneyin.</p>
              </div>
            ) : (
              <div className="results-list">
                <p className="results-count">{results.length} sonuç bulundu</p>
                {results.map((blog) => (
                  <div key={blog.id} className="result-item">
                    <h4 className="result-title">
                      <button 
                        onClick={() => navigate(`/blog/${blog.id}`)}
                        className="result-link"
                      >
                        {blog.title}
                      </button>
                    </h4>
                    <p className="result-excerpt">
                      {blog.content.length > 200 
                        ? `${blog.content.substring(0, 200)}...` 
                        : blog.content
                      }
                    </p>
                    <div className="result-meta">
                      <span className="result-author">Yazar: {blog.author}</span>
                      {blog.category && (
                        <span className="result-category">Kategori: {blog.category}</span>
                      )}
                      {blog.createdAt && (
                        <time className="result-date">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </time>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
