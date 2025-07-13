import React from 'react';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import MediaCarousel from './MediaCarousel';
import PostStats from './PostStats';
import CommentsPreview from './CommentsPreview';
import PostMeta from './PostMeta';

const PostCard = ({ 
  post, 
  currentUser, 
  onLike, 
  onShowLikes, 
  onNavClick, 
  statsComponent
}) => {
  return (
    <div className="post-card" data-id={post._id}>
      <PostHeader 
        user={post.user} 
        isPinned={post.isPinned} 
        currentUser={currentUser}
      />
      
      <PostContent 
        content={post.content} 
        hashtags={post.hashtags} 
      />
      
      {post.media && post.media.length > 0 && (
        <MediaCarousel 
          media={post.media} 
          postId={post._id} 
          onNavClick={onNavClick} 
        />
      )}
      
      {statsComponent ? (
        statsComponent
      ) : (
        <PostStats post={post} />
      )}
      
      {/* Show comments if there are comments */}
      {post.comments && post.comments.length > 0 && (
        <CommentsPreview 
          comments={post.comments} 
          commentCount={post.commentCount} 
        />
      )}
      
      <PostMeta 
        createdAt={post.createdAt} 
        visibility={post.visibility} 
      />
    </div>
  );
};

export default PostCard; 