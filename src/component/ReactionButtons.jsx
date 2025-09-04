import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

const ReactionButtons = ({ blogId, initialReactions = { likeCount: 0, dislikeCount: 0 } }) => {
  const [reactions, setReactions] = useState(initialReactions)
  const [userReaction, setUserReaction] = useState(null)
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (token && user.id) {
      fetchUserReaction()
    }
  }, [blogId, token, user.id])

  const fetchUserReaction = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.REACTIONS}/blogs/${blogId}/reactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUserReaction(data.data?.userReaction || null)
      }
    } catch (error) {
      console.error('User reaction fetch error:', error)
    }
  }

  const handleReaction = async (reactionType) => {
    if (!token) {
      alert('Beğeni yapmak için giriş yapmanız gerekiyor')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.REACTIONS}/blogs/${blogId}/reactions/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reactionType })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Reaction sayılarını güncelle
        if (data.action === 'removed') {
          if (reactionType === 'like') {
            setReactions(prev => ({ ...prev, likeCount: Math.max(0, prev.likeCount - 1) }))
          } else {
            setReactions(prev => ({ ...prev, dislikeCount: Math.max(0, prev.dislikeCount - 1) }))
          }
          setUserReaction(null)
        } else {
          if (reactionType === 'like') {
            setReactions(prev => ({ ...prev, likeCount: prev.likeCount + 1 }))
            if (userReaction === 'dislike') {
              setReactions(prev => ({ ...prev, dislikeCount: Math.max(0, prev.dislikeCount - 1) }))
            }
          } else {
            setReactions(prev => ({ ...prev, dislikeCount: prev.dislikeCount + 1 }))
            if (userReaction === 'like') {
              setReactions(prev => ({ ...prev, likeCount: Math.max(0, prev.likeCount - 1) }))
            }
          }
          setUserReaction(reactionType)
        }
      } else {
        const errorData = await response.json()
        if (errorData.message && errorData.message.includes('maksimum')) {
          alert(errorData.message)
        } else {
          alert('Beğeni işlemi başarısız')
        }
      }
    } catch (error) {
      console.error('Reaction error:', error)
      alert('Beğeni işlemi başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reaction-buttons">
      <button
        className={`reaction-btn like-btn ${userReaction === 'like' ? 'active' : ''}`}
        onClick={() => handleReaction('like')}
        disabled={loading}
      >
        👍 {reactions.likeCount}
      </button>
      
      <button
        className={`reaction-btn dislike-btn ${userReaction === 'dislike' ? 'active' : ''}`}
        onClick={() => handleReaction('dislike')}
        disabled={loading}
      >
        👎 {reactions.dislikeCount}
      </button>
    </div>
  )
}

export default ReactionButtons

