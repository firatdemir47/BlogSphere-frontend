import { useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

export default function ViewCounter({ blogId }) {
  useEffect(() => {
    const incrementView = async () => {
      try {
        await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}/view`, {
          method: 'POST'
        })
      } catch (err) {
        console.error('View count artırılırken hata:', err)
      }
    }

    // Blog görüntülendiğinde view count'u artır
    incrementView()
  }, [blogId])

  return null // Bu component görsel olarak bir şey render etmiyor
}
