import React from 'react';

const PostMeta = ({ createdAt, visibility }) => {
  return (
    <div className="meta">
      <span>{new Date(createdAt).toLocaleString()}</span>
      {visibility !== 'public' && (
        <span className="visibility-badge">
          {visibility === 'followers' ? '👥 Followers Only' : '🔒 Private'}
        </span>
      )}
    </div>
  );
};

export default PostMeta; 