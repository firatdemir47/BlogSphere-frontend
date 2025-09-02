import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (token && user.id) {
      fetchUnreadCount()
      fetchNotifications()
    }
  }, [token, user.id])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/users/notifications/unread/count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.data?.count || 0)
      }
    } catch (error) {
      console.error('Unread count fetch error:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/users/notifications?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data || [])
      }
    } catch (error) {
      console.error('Notifications fetch error:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Mark as read error:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/users/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Mark all as read error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment': return '💬'
      case 'like': return '👍'
      case 'follow': return '👥'
      default: return '🔔'
    }
  }

  return (
    <div className="notification-bell">
      <button
        className="notification-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Bildirimler</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={markAllAsRead}
                disabled={loading}
              >
                Tümünü Okundu İşaretle
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">Bildirim yok</p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <span className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <small>{new Date(notification.created_at).toLocaleDateString('tr-TR')}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell

