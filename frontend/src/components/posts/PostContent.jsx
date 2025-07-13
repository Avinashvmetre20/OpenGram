import React from 'react';

const PostContent = ({ content, hashtags }) => {
  return (
    <div className="content">
      <p>{content}</p>
      {hashtags && hashtags.length > 0 && (
        <div className="hashtags">
          {hashtags.map(tag => (
            <span key={tag} className="hashtag">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostContent; 