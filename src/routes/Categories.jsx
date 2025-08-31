import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../component/Navigation'
import { API_ENDPOINTS, getCategoryConfig } from '../config/api'

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Kategorileri API'den al
  useEffect(() => {
    fetch(API_ENDPOINTS.CATEGORIES + '/with-blog-count')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("API'den beklenmeyen veri formatı:", data);
          setCategories([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Kategoriler çekerken hata:', err)
        setCategories([]);
        setLoading(false);
      })
  }, [])

  // Her kategorideki yazı sayısını hesapla
  const getCategoryCount = (category) => {
    return category.blog_count || 0;
  }

  const filteredCategories = selectedCategory 
    ? categories.filter(cat => cat.name.toLowerCase().includes(selectedCategory.toLowerCase()))
    : categories

  return (
    <>
      <Navigation />
      <div className="categories-page">
        <div className="categories-header">
          <h1>📚 Kategoriler</h1>
          <p>İlgi alanınıza göre yazıları keşfedin</p>
          
          <div className="categories-search">
            <input
              type="text"
              placeholder="Kategori ara..."
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-search-input"
            />
          </div>
        </div>

        <div className="categories-grid">
          {filteredCategories.map((category) => {
            // Veritabanından gelen icon ve color varsa onları kullan, yoksa mapping'den al
            const config = category.icon && category.color 
              ? { icon: category.icon, color: category.color }
              : getCategoryConfig(category.name)
            
            return (
              <div key={category.id || category.name} className="category-card" style={{ '--category-color': config.color }}>
                <div className="category-icon">{config.icon}</div>
                <div className="category-content">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description || 'Kategori açıklaması'}</p>
                  <div className="category-footer">
                    <span className="category-count">
                      {loading ? '...' : `${getCategoryCount(category)} yazı`}
                    </span>
                    <Link to={`/category/${encodeURIComponent(category.name)}`} className="category-link">
                      Görüntüle →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="no-results">
            <p>"{selectedCategory}" ile eşleşen kategori bulunamadı.</p>
            <button 
              onClick={() => setSelectedCategory('')}
              className="clear-search-btn"
            >
              Aramayı temizle
            </button>
          </div>
        )}

        <div className="categories-info">
          <h3>Kategoriler Hakkında</h3>
          <p>Her kategori, belirli bir konu etrafında toplanan yazıları içerir. Kategorilere göz atarak ilgi alanınıza uygun içerikleri kolayca bulabilirsiniz.</p>
        </div>
      </div>
    </>
  )
}
