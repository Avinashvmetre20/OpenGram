import React from 'react';

const PostStats = ({ post, isLiked, likeCount, onLike, loadingLike, onShowLikes }) => {
  return (
    <div className="post-stats">
      <div className="like-container">
        <button
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={onLike}
          disabled={loadingLike}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          <span className="heart-icon">
            {isLiked ? '❤️' : '🤍'}
          </span>
        </button>
        {likeCount > 0 && (
          <button 
            className="likes-count-button"
            onClick={onShowLikes}
            disabled={loadingLike}
          >
            <span className="likes-count-text">
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </span>
          </button>
        )}
      </div>
      <div className="other-stats">
        <span className="stat-item">💬 {post.commentCount} Comments</span>
        <span className="stat-item">🔁 {post.retweetCount} Retweets</span>
      </div>
    </div>
  );
};

export default PostStats; 