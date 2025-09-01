import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

const BookmarkButton = ({ blogId, initialBookmarked = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (token && user.id) {
      checkBookmarkStatus()
    }
  }, [blogId, token, user.id])

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKMARKS}/blogs/${blogId}/bookmarks/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setIsBookmarked(data.data?.isBookmarked || false)
      }
    } catch (error) {
      console.error('Bookmark status check error:', error)
    }
  }

  const handleBookmarkToggle = async () => {
    if (!token) {
      alert('Bookmark eklemek için giriş yapmanız gerekiyor')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKMARKS}/blogs/${blogId}/bookmarks/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setIsBookmarked(data.data?.bookmarked || !isBookmarked)
      }
    } catch (error) {
      console.error('Bookmark toggle error:', error)
      alert('Bookmark işlemi başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
      onClick={handleBookmarkToggle}
      disabled={loading}
      title={isBookmarked ? 'Bookmark\'tan kaldır' : 'Bookmark\'a ekle'}
    >
      {isBookmarked ? '🔖' : '🔖'}
    </button>
  )
}

export default BookmarkButton
