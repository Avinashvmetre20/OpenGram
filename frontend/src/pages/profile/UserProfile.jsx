import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import followService from '../../services/followService';
import { useAuth } from '../../context/AuthContext';
import download from '../../assets/download.jpeg';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState('');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setError('');
      try {
        const res = await followService.getFollowers(id);
        setFollowers(res.data || []);
      } catch (e) {
        setFollowers([]);
      }
      try {
        const res = await followService.getFollowing(id);
        setFollowing(res.data || []);
      } catch (e) {
        setFollowing([]);
      }
      try {
        // Fetch user info (reuse adminService or make a direct API call)
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setProfile(data.data || null);
      } catch (e) {
        setProfile(null);
        setError('User not found');
      }
      const current = currentUser?.data || currentUser;
      if (current && id !== (current._id || current.id)) {
        try {
          const res = await followService.isFollowing(id);
          setIsFollowing(res.data?.isFollowing);
        } catch (e) {
          setIsFollowing(false);
        }
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  const handleFollowClick = async () => {
    const current = currentUser?.data || currentUser;
    if (!current || !profile || (current._id || current.id) === profile._id) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollowUser(profile._id);
        setIsFollowing(false);
        setFollowers(followers.filter(f => f._id !== (current._id || current.id)));
      } else {
        await followService.followUser(profile._id);
        setIsFollowing(true);
        setFollowers([...followers, { _id: current._id || current.id, username: current.username, profilePicture: current.profilePicture }]);
      }
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="profile-page"><h2>{error}</h2></div>;
  if (!profile) return <div className="profile-page"><h2>Loading...</h2></div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={profile.profilePicture || download}
          alt="Profile"
          className="user-avatar-large-img"
          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginRight: 24 }}
          onError={e => { e.target.src = download; }}
        />
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.bio}</p>
          <div style={{ display: 'flex', gap: 16, margin: '8px 0' }}>
            <span style={{ cursor: 'pointer', color: '#1da1f2' }} onClick={() => setShowFollowersModal(true)}>
              <b>{followers.length}</b> Followers
            </span>
            <span style={{ cursor: 'pointer', color: '#1da1f2' }} onClick={() => setShowFollowingModal(true)}>
              <b>{following.length}</b> Following
            </span>
          </div>
          {(() => {
            const current = currentUser?.data || currentUser;
            return current && profile._id !== (current._id || current.id) && (
              <button
                className={`follow-btn${isFollowing ? ' following' : ''}`}
                onClick={handleFollowClick}
                disabled={loading}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            );
          })()}
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 300, maxHeight: 400, overflowY: 'auto' }}>
            <h3>Followers</h3>
            <button style={{ float: 'right', marginTop: -32, marginRight: -16, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowFollowersModal(false)}>&times;</button>
            {followers.length === 0 ? <p>No followers yet.</p> : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {followers.map(f => (
                  <li key={f._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <img src={f.profilePicture || download} alt={f.username} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }} onError={e => { e.target.src = download; }} />
                    <span>@{f.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 300, maxHeight: 400, overflowY: 'auto' }}>
            <h3>Following</h3>
            <button style={{ float: 'right', marginTop: -32, marginRight: -16, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowFollowingModal(false)}>&times;</button>
            {following.length === 0 ? <p>Not following anyone yet.</p> : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {following.map(f => (
                  <li key={f._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <img src={f.profilePicture || download} alt={f.username} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }} onError={e => { e.target.src = download; }} />
                    <span>@{f.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 