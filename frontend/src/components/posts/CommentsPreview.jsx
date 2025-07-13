import React from 'react';
import download from '../../assets/download.jpeg';

const CommentsPreview = ({ comments, commentCount }) => {
  return (
    <div className="comments-preview">
      <strong>Recent Comments:</strong>
      {comments.slice(0, 2).map(comment => (
        <div key={comment._id} className="comment">
          <div className="comment-user-info">
            <img
              src={comment.user.profilePicture || download}
              alt="Commenter"
              className="avatar-small"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = download;
              }}
            />
            <span className="comment-username">{comment.user.username}</span>
          </div>
          <p className="comment-text">{comment.text}</p>
        </div>
      ))}
      {commentCount > 2 && (
        <button className="view-all-comments">
          View all {commentCount} comments
        </button>
      )}
    </div>
  );
};

export default CommentsPreview; 