import React, { useState } from 'react'
import { API_ENDPOINTS } from '../config/api'

const FileUpload = ({ onUpload, type = 'blog-image', multiple = false, maxFiles = 5 }) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    
    // Dosya tipi kontrolü
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      setError('Sadece resim dosyaları kabul edilir (JPEG, PNG, GIF, WebP)')
      return
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır')
      return
    }

    // Maksimum dosya sayısı kontrolü
    if (files.length > maxFiles) {
      setError(`Maksimum ${maxFiles} dosya seçebilirsiniz`)
      return
    }

    uploadFiles(files)
  }

  const uploadFiles = async (files) => {
    setUploading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Dosya yüklemek için giriş yapmanız gerekiyor')
      }

      const formData = new FormData()
      
      if (multiple) {
        files.forEach(file => {
          formData.append('images', file)
        })
      } else {
        formData.append(type === 'avatar' ? 'avatar' : 'image', files[0])
      }

      const endpoint = multiple 
        ? `${API_ENDPOINTS.UPLOADS}/multiple-images`
        : type === 'avatar' 
          ? `${API_ENDPOINTS.UPLOADS}/avatar`
          : `${API_ENDPOINTS.UPLOADS}/blog-image`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Dosya yükleme başarısız')
      }

      const result = await response.json()
      
      if (multiple) {
        setUploadedFiles(prev => [...prev, ...result.data.imageUrls])
        onUpload && onUpload(result.data.imageUrls)
      } else {
        const fileUrl = type === 'avatar' ? result.data.avatarUrl : result.data.imageUrl
        setUploadedFiles(prev => [...prev, fileUrl])
        onUpload && onUpload(fileUrl)
      }

    } catch (err) {
      setError(err.message || 'Dosya yükleme hatası')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="file-upload">
      <div className="upload-area">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={uploading}
          className="file-input"
          id={`file-upload-${type}`}
        />
        <label htmlFor={`file-upload-${type}`} className="upload-label">
          {uploading ? (
            <div className="uploading">
              <span>Yükleniyor...</span>
            </div>
          ) : (
            <div className="upload-prompt">
              <span className="upload-icon">📁</span>
              <span className="upload-text">
                {multiple ? 'Resimleri seçin' : 'Resim seçin'}
              </span>
              <span className="upload-hint">
                {multiple ? `Maksimum ${maxFiles} dosya` : 'JPEG, PNG, GIF, WebP'}
              </span>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div className="upload-error">
          <span>❌ {error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Yüklenen Dosyalar:</h4>
          <div className="file-list">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <img 
                  src={file} 
                  alt={`Uploaded ${index + 1}`} 
                  className="file-preview"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="remove-file-btn"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
