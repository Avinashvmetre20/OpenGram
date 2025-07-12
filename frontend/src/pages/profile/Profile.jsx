import React, { useEffect, useState } from 'react';
import './Profile.css'; // optional: for styling

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // or however you store it

      const res = await fetch(`http://localhost:8080/post/?page=${page}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
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

  const handleLike = async (postId, isLiked) => {
    try {
      const token = localStorage.getItem('token');
      const method = isLiked ? 'DELETE' : 'PUT';

      const response = await fetch(`http://localhost:8080/post/${postId}/like`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state to reflect the change
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
            // Assuming your backend returns whether the current user has liked the post
            // If not, you might need to track this separately
            isLiked: !isLiked
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
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
            <div key={post._id} className="post-card"  data-id={post._id}>
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
                  <div className="media-container">
                    {post.media.map((media, index) => (
                      <div
                        key={media._id}
                        className={`media-item ${post.media.length === 1 ? 'single' : ''}`}
                      >
                        {media.mediaType === 'image' ? (
                          <img
                            src={media.url}
                            alt="post media"
                            className="media-content"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/500';
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
                    <>
                      <button
                        className="carousel-nav prev"
                        onClick={() => handleNavClick(post._id, 'prev')}
                      >
                        &lt;
                      </button>
                      <button
                        className="carousel-nav next"
                        onClick={() => handleNavClick(post._id, 'next')}
                      >
                        &gt;
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Post Stats */}
              <div className="post-stats">
                <button
                  className={`stat-item like-button ${post.isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id, post.isLiked)}
                >
                  {post.isLiked ? '❤️' : '🤍'} {post.likeCount} Likes
                </button>
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
                              e.target.src = 'https://via.placeholder.com/150';
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

export default Profile;