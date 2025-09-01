import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

const TagSelector = ({ selectedTags = [], onTagsChange, blogId }) => {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTagNames, setSelectedTagNames] = useState(selectedTags)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchTags()
    if (blogId) {
      fetchBlogTags()
    }
  }, [blogId])

  const fetchTags = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TAGS)
      if (response.ok) {
        const data = await response.json()
        setTags(data.data || [])
      }
    } catch (error) {
      console.error('Tags fetch error:', error)
    }
  }

  const fetchBlogTags = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TAGS}/blogs/${blogId}/tags`)
      if (response.ok) {
        const data = await response.json()
        const tagNames = data.data?.map(tag => tag.name) || []
        setSelectedTagNames(tagNames)
        onTagsChange(tagNames)
      }
    } catch (error) {
      console.error('Blog tags fetch error:', error)
    }
  }

  const handleTagToggle = (tagName) => {
    const newSelectedTags = selectedTagNames.includes(tagName)
      ? selectedTagNames.filter(name => name !== tagName)
      : [...selectedTagNames, tagName]
    
    setSelectedTagNames(newSelectedTags)
    onTagsChange(newSelectedTags)
  }

  const handleSaveTags = async () => {
    if (!token) {
      alert('Etiket kaydetmek için giriş yapmanız gerekiyor')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.TAGS}/blogs/${blogId}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tags: selectedTagNames })
      })

      if (response.ok) {
        alert('Etiketler başarıyla kaydedildi')
      }
    } catch (error) {
      console.error('Save tags error:', error)
      alert('Etiket kaydetme başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tag-selector">
      <div className="tags-list">
        {tags.map(tag => (
          <button
            key={tag.id}
            className={`tag-item ${selectedTagNames.includes(tag.name) ? 'selected' : ''}`}
            onClick={() => handleTagToggle(tag.name)}
            style={{ backgroundColor: selectedTagNames.includes(tag.name) ? tag.color : 'transparent' }}
          >
            {tag.name}
          </button>
        ))}
      </div>
      
      {blogId && (
        <button
          className="save-tags-btn"
          onClick={handleSaveTags}
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Etiketleri Kaydet'}
        </button>
      )}
    </div>
  )
}

export default TagSelector
