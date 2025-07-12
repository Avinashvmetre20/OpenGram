import React, { useEffect, useState } from 'react';
import './PostList.css'; // optional: for styling

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchPosts = async () => {
  try {
    const token = localStorage.getItem('token'); // or however you store it

    const res = await fetch('http://localhost:8080/post/', {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post._id} className="post-card">
          {/* User Info */}
          <div className="user-info">
            <img src={post.user.profilePicture} alt="Profile" className="avatar" />
            <span className="username">{post.user.username}</span>
          </div>

          {/* Post Content */}
          <div className="content">
            <p>{post.content}</p>
            {post.hashtags.length > 0 && (
              <div className="hashtags">
                {post.hashtags.map(tag => (
                  <span key={tag} className="hashtag">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Media */}
          <div className="media">
            {post.media.map(media => (
              <img key={media._id} src={media.url} alt="post media" className="media-img" />
            ))}
          </div>

          {/* Likes */}
          <div className="likes">
            <strong>Likes: {post.likeCount}</strong>
            {post.likes.map(user => (
              <span key={user._id} className="like-user">{user.username}</span>
            ))}
          </div>

          {/* Comments */}
          <div className="comments">
            <strong>Comments ({post.commentCount}):</strong>
            {post.comments.map(comment => (
              <div key={comment._id} className="comment">
                <img src={comment.user.profilePicture} alt="Commenter" className="avatar-small" />
                <span className="comment-user">{comment.user.username}</span>: {comment.text}
              </div>
            ))}
          </div>

          {/* Meta Info */}
          <div className="meta">
            <span>Created: {new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
