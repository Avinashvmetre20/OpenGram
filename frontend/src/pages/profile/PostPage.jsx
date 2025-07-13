import React, { useEffect, useState } from 'react';
import { postService } from '../../services/postService';
import authService from '../../services/authService';
import './PostPage.css'; // optional: for styling

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [currentPostLikes, setCurrentPostLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // const token = localStorage.getItem('token');
        const user = await authService.getMe();
        setCurrentUser(user);
        // if (token) {
        // }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);


  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const data = await postService.getPosts(page, pagination.limit);

      if (data.success) {
        const enhancedPosts = data.data.map(post => ({
          ...post,
          isLiked: currentUser && post.likes.some(like => like.toString() === currentUser._id)
        }));
        setPosts(enhancedPosts);
        setPagination({
          page: data.currentPage,
          limit: pagination.limit,
          total: data.total,
          pages: data.pages
        });
      }
    } catch (err) {
      console.error('Error fetching posts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchPosts(newPage);
    }
  };

  const handleLike = async (postId, isCurrentlyLiked) => {
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Optimistic UI update
      setPosts(posts.map(post => {
        if (post._id === postId) {
          // Calculate new likes array
          const newLikes = isCurrentlyLiked
            ? post.likes.filter(id => id !== currentUser._id)
            : [...new Set([...(post.likes || []), currentUser._id])]; // Ensure no duplicates

          return {
            ...post,
            likeCount: newLikes.length, // Derive count from likes array
            isLiked: !isCurrentlyLiked,
            likes: newLikes
          };
        }
        return post;
      }));

      // API call
      if (isCurrentlyLiked) {
        await postService.unlikePost(postId);
      } else {
        await postService.likePost(postId);
      }

    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setPosts(posts.map(post => post._id === postId ? {
        ...post,
        likeCount: isCurrentlyLiked ? post.likeCount : post.likeCount - 1,
        isLiked: isCurrentlyLiked,
        likes: isCurrentlyLiked
          ? [...post.likes, currentUser._id]
          : post.likes.filter(id => id.toString() !== currentUser._id)
      } : post));
    }

  };

  const handleShowLikes = async (postId) => {
    setLoadingLikes(true);
    try {
      const response = await postService.getPostLikes(postId);
      setCurrentPostLikes(response.data);
      setShowLikesModal(true);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleNavClick = (postId, direction) => {
    const container = document.querySelector(`.post-card[data-id="${postId}"] .media-container`);
    if (container) {
      const scrollAmount = direction === 'next'
        ? container.scrollLeft + container.offsetWidth
        : container.scrollLeft - container.offsetWidth;
      container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="post-list">
      {posts.length === 0 ? (
        <div className="no-posts">No posts found</div>
      ) : (
        <>
          {posts.map(post => (
            <div key={post._id} className="post-card" data-id={post._id}>
              {/* User Info */}
              <div className="user-info">
                {post.user.profilePicture ? (
                  <img
                    src={post.user.profilePicture}
                    alt="Profile"
                    className="avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {post.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="username">{post.user.username}</span>
                {post.isPinned && <span className="pinned-badge">📌 Pinned</span>}
              </div>

              {/* Post Content */}
              <div className="content">
                <p>{post.content}</p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="hashtags">
                    {post.hashtags.map(tag => (
                      <span key={tag} className="hashtag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Media */}
              {post.media && post.media.length > 0 && (
                <div className="media-carousel">
                  <div className={`media-grid media-count-${post.media.length}`}>
                    {post.media.map((media, index) => (
                      <div key={media._id} className="media-item">
                        {media.mediaType === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Post media ${index + 1}`}
                            className="media-content"
                            onError={(e) => {
                              e.target.onerror = null;
                              // e.target.src = 'https://via.placeholder.com/500';
                            }}
                          />
                        ) : (
                          <video controls className="media-content">
                            <source src={media.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                  {post.media.length > 1 && (
                    <div className="media-navigation">
                      <button
                        className="media-nav-button prev"
                        onClick={() => handleNavClick(post._id, 'prev')}
                      >
                        &lt;
                      </button>
                      <button
                        className="media-nav-button next"
                        onClick={() => handleNavClick(post._id, 'next')}
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Post Stats */}
              <div className="post-stats">
                <div className="like-container">
                  <button
                    className={`stat-item like-button ${post.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id, post.isLiked)}
                    disabled={!currentUser}
                  >
                    {post.isLiked ? (
                      <span className="heart-icon" style={{ color: 'red' }}>❤️</span>
                    ) : (
                      <span className="heart-icon">🤍</span>
                    )}
                  </button>
                  <span
                    className="likes-count"
                    onClick={() => handleShowLikes(post._id)}
                  >
                    {post.likeCount} Likes
                  </span>
                </div>
                <span className="stat-item">💬 {post.commentCount} Comments</span>
                <span className="stat-item">🔁 {post.retweetCount} Retweets</span>
              </div>

              {/* Comments Preview */}
              {post.comments && post.comments.length > 0 && (
                <div className="comments-preview">
                  <strong>Recent Comments:</strong>
                  {post.comments.slice(0, 2).map(comment => (
                    <div key={comment._id} className="comment">
                      <div className="comment-user-info">
                        {comment.user.profilePicture ? (
                          <img
                            src={comment.user.profilePicture}
                            alt="Commenter"
                            className="avatar-small"
                            onError={(e) => {
                              e.target.onerror = null;
                              // e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        ) : (
                          <div className="avatar-small-placeholder">
                            {comment.user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="comment-username">{comment.user.username}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                  {post.commentCount > 2 && (
                    <button className="view-all-comments">
                      View all {post.commentCount} comments
                    </button>
                  )}
                </div>
              )}

              {/* Meta Info */}
              <div className="meta">
                <span>{new Date(post.createdAt).toLocaleString()}</span>
                {post.visibility !== 'public' && (
                  <span className="visibility-badge">
                    {post.visibility === 'followers' ? '👥 Followers Only' : '🔒 Private'}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Likes Modal */}
          {showLikesModal && (
            <div className="likes-modal" onClick={() => setShowLikesModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Liked by</h3>
                  <button
                    className="close-button"
                    onClick={() => setShowLikesModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="likes-list">
                  {loadingLikes ? (
                    <div className="loading-likes">Loading...</div>
                  ) : currentPostLikes.length > 0 ? (
                    currentPostLikes.map(user => (
                      <div key={user._id} className="like-user">
                        <img
                          src={user.profilePicture || 'https://via.placeholder.com/150'}
                          alt={user.username}
                          className="like-user-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                        <span className="like-username">{user.username}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-likes">No likes yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.pages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostPage;