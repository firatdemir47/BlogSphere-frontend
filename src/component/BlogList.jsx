import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config/api';

export default function BlogList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const normalizeCategory = (value) =>
    String(value ?? "")
      .trim()
      .toLocaleLowerCase("tr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i");

  useEffect(() => {
    fetch(API_ENDPOINTS.BLOGS)
      .then((res) => res.json())
      .then((data) => {
        // API'den gelen veri yapısını kontrol et ve düzelt
        if (data && data.success && Array.isArray(data.data)) {
          // API'den gelen veriyi dönüştür
          const transformedBlogs = data.data.map(blog => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            author: blog.author_name || blog.author,
            category: blog.category_name || blog.category,
            createdAt: blog.created_at || blog.createdAt,
            updatedAt: blog.updated_at || blog.updatedAt
          }));
          setBlogs(transformedBlogs);
        } else {
          console.error("API'den beklenmeyen veri formatı:", data);
          setBlogs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Blogları çekerken hata:", err);
        setBlogs([]);
        setLoading(false);
      });
  }, []);

  // Sync selectedCategory with URL query parameter `?category=`
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const c = params.get("category");
    setSelectedCategory(c || null);
    setVisibleCount(6);
  }, [location.search]);

  if (loading) {
    return (
      <section className="blog-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <article key={i} className="blog-card skeleton">
            <div className="skeleton-title" />
            <div className="skeleton-body" />
            <div className="skeleton-footer" />
          </article>
        ))}
      </section>
    );
  }

  // blogs array olduğundan emin ol
  if (!Array.isArray(blogs)) {
    console.error("blogs bir array değil:", blogs);
    return <p className="empty">Blog verileri yüklenirken hata oluştu.</p>;
  }

  const categories = Array.from(
    new Set(
      blogs
        .map((b) => b.category)
        .filter((c) => typeof c === "string" && c.trim().length > 0)
    )
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = blogs.filter((b) => {
    const passesCategory =
      !selectedCategory ||
      normalizeCategory(b.category) === normalizeCategory(selectedCategory);
    if (!normalizedQuery) return passesCategory;
    const hay = `${b.title ?? ""} ${b.content ?? ""} ${b.author ?? ""}`.toLowerCase();
    return passesCategory && hay.includes(normalizedQuery);
  });

  const visibleBlogs = filtered.slice(0, visibleCount);

  const hueFromId = (id) => {
    const n = typeof id === "number" ? id : (String(id).split("").reduce((a, ch) => a + ch.charCodeAt(0), 0));
    return 180 + (n % 150);
  };

  return (
    <section className="blog-section">
      <div className="controls">
        <input
          className="search-input"
          placeholder="Yazı ara... (başlık, içerik, yazar)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisibleCount(6); }}
        />
        {categories.length > 0 && (
          <div className="chips">
            <button
              className={`chip${selectedCategory ? "" : " active"}`}
              onClick={() => { setSelectedCategory(null); setVisibleCount(6); navigate("/"); }}
            >Tümü</button>
            {categories.map((c) => (
              <button
                key={c}
                className={`chip${normalizeCategory(selectedCategory) === normalizeCategory(c) ? " active" : ""}`}
                onClick={() => {
                  const next = c === selectedCategory ? null : c;
                  setSelectedCategory(next);
                  setVisibleCount(6);
                  navigate(next ? `/?category=${encodeURIComponent(next)}` : "/");
                }}
              >{c}</button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="empty">Hiç blog yok.</p>
      ) : (
        <div className="blog-grid">
          {visibleBlogs.map((blog, i) => (
            <article key={blog.id} className="blog-card" style={{ "--i": i, "--h": hueFromId(blog.id) }}>
              <button
                className="blog-card-click"
                onClick={() => {
                  navigate(`/blog/${blog.id}`)
                }}
                aria-expanded={false}
              >
                <div className="blog-cover" />
                <div className="blog-meta">
                  {blog.category && <span className="pill">{blog.category}</span>}
                  {blog.createdAt && (
                    <time className="date">{new Date(blog.createdAt).toLocaleDateString()}</time>
                  )}
                </div>
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-content blog-excerpt">{blog.content}</p>
                <div className="blog-footer">
                  <span className="blog-author">Yazar: {blog.author}</span>
                  <span className="read-btn" role="presentation">Oku</span>
                </div>
              </button>
            </article>
          ))}
        </div>
      )}

      {filtered.length > visibleCount && (
        <div className="load-wrap">
          <button className="load-more" onClick={() => setVisibleCount((c) => c + 6)}>Daha fazla yükle</button>
        </div>
      )}
    </section>
  );
}
