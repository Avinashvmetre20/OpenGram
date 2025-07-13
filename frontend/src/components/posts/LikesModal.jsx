import React from 'react';
import './LikesModal.css';

const LikesModal = ({ isOpen, onClose, likes, loading, postId }) => {
  if (!isOpen) return null;

  return (
    <div className="likes-modal-overlay" onClick={onClose}>
      <div 
        className="likes-modal interactive-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="likes-modal-header">
          <div className="header-content">
            <h3>Likes</h3>
            <span className="likes-count">{likes?.length || 0} people liked this</span>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="likes-modal-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading likes...</p>
            </div>
          ) : likes && likes.length > 0 ? (
            <div className="likes-list">
              {likes.map((user, index) => (
                <div key={user._id || index} className="like-user-card interactive-card">
                  <div className="user-avatar-container">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.username}
                        className="user-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="avatar-placeholder">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="user-info">
                    <span className="username">{user.username}</span>
                    <span className="user-handle">@{user.username?.toLowerCase()}</span>
                  </div>
                  <div className="like-indicator">
                    <span className="heart-small">❤️</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-likes-container">
              <div className="no-likes-icon">🤍</div>
              <h4>No likes yet</h4>
              <p>Be the first to like this post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesModal; 