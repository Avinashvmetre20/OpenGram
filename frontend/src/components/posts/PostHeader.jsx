import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import followService from '../../services/followService';
import download from '../../assets/download.jpeg';

const getId = (u) => u?._id || u?.id;

const PostHeader = ({ user, isPinned, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Use currentUser.data if present (from API response)
  const current = currentUser?.data || currentUser;

  // Robustly compare user IDs
  const isOwnPost = current && user && String(getId(current)) === String(getId(user));

  useEffect(() => {
    let ignore = false;
    setError('');
    if (!isOwnPost && current && user) {
      const checkFollow = async () => {
        try {
          const res = await followService.isFollowing(getId(user));
          if (!ignore && res.success) {
            setIsFollowing(res.data.isFollowing);
          }
        } catch (e) {
          setIsFollowing(false);
        }
      };
      checkFollow();
    }
    return () => { ignore = true; };
  }, [user, current, isOwnPost]);

  const handleFollowClick = async (e) => {
    e.stopPropagation();
    if (!current || !user || isOwnPost) return;
    setLoading(true);
    setError('');
    const prev = isFollowing;
    setIsFollowing(!isFollowing); // Optimistic update
    try {
      if (prev) {
        await followService.unfollowUser(getId(user));
      } else {
        await followService.followUser(getId(user));
      }
    } catch (err) {
      setIsFollowing(prev); // Revert on error
      setError('Failed to update follow status.');
    } finally {
      setLoading(false);
    }
  };

  // Only show follow button if not own post and both users exist
  const showFollow = !isOwnPost && current && user;

  return (
    <div className="post-header-row">
      <div className="avatar-container" onClick={() => navigate(`/users/${getId(user)}`)} style={{ cursor: 'pointer' }}>
        <img
          src={user.profilePicture || download}
          alt="Profile"
          className="avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = download;
          }}
        />
      </div>
      <div className="user-details-col" onClick={() => navigate(`/users/${getId(user)}`)} style={{ cursor: 'pointer' }}>
        <span className="display-name">{user.displayName || user.username}</span>
        <span className="username">@{user.username}</span>
      </div>
      {showFollow && (
        <button
          className={`follow-btn${isFollowing ? ' following' : ''}`}
          onClick={handleFollowClick}
          disabled={loading}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
      {error && <span style={{ color: 'red', marginLeft: 8, fontSize: 12 }}>{error}</span>}
    </div>
  );
};

export default PostHeader; 