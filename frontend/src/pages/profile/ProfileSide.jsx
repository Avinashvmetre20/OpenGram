import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import followService from '../../services/followService';
import download from '../../assets/download.jpeg';
import "./profileSide.css";

const ProfileSide = () => {
  const { user, logout, updatePassword } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      followService.getFollowers(user._id).then(res => setFollowers(res.data || [])).catch(() => setFollowers([]));
      followService.getFollowing(user._id).then(res => setFollowing(res.data || [])).catch(() => setFollowing([]));
    }
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setShowPasswordModal(false);
        setShowFollowersModal(false);
        setShowFollowingModal(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordError("Passwords don't match");
    }
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to update password');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {/* Profile dropdown toggle */}
      <div className="profile-dropdown">
        <button 
          className="profile-toggle"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
        >
          <div className="profile-avatar">
            <img
              src={user.profilePicture || download}
              alt="Profile"
              className="profile-avatar-img"
              onError={(e) => {
                e.target.src = download;
              }}
            />
          </div>
          <span className="profile-name">{user.username}</span>
          <svg
            className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Overlay */}
        <div 
          className={`dropdown-overlay ${isDropdownOpen ? 'visible' : ''}`}
          onClick={() => setIsDropdownOpen(false)}
        />

        {/* Chrome-like Side Panel */}
        <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
          <div className="panel-header">
            <div className="panel-title">Profile</div>
            <button className="close-btn" onClick={() => setIsDropdownOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="user-details">
            <div className="user-avatar-large">
              <img
                src={user.profilePicture || download}
                alt="Profile"
                className="user-avatar-large-img"
                onError={(e) => {
                  e.target.src = download;
                }}
              />
            </div>
            <h3 className="user-name">{user.username}</h3>
            <p className="user-email">{user.email}</p>
            <div className="user-meta">
              <span className="user-role">Role: {user.role}</span>
              {user.isVerified && (
                <span className="verified-badge">Verified</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 16, margin: '8px 0' }}>
              <span style={{ cursor: 'pointer', color: '#1da1f2' }} onClick={() => setShowFollowersModal(true)}>
                <b>{followers.length}</b> Followers
              </span>
              <span style={{ cursor: 'pointer', color: '#1da1f2' }} onClick={() => setShowFollowingModal(true)}>
                <b>{following.length}</b> Following
              </span>
            </div>
            {user.bio && <p className="user-bio">{user.bio}</p>}
            
          </div>

          <div className="dropdown-actions">
            <Link to="/profile/edit" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
              <i className="fas fa-user-edit"></i>
              Edit Profile
            </Link>
            <button 
              className="dropdown-link" 
              onClick={() => {
                setIsDropdownOpen(false);
                setShowPasswordModal(true);
              }}
            >
              <i className="fas fa-key"></i>
              Change Password
            </button>
            <button onClick={handleLogout} className="dropdown-link logout">
              <i className="fas fa-sign-out-alt"></i>
              Sign Out
            </button>
          </div>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
              >
                &times;
              </button>
            </div>
            {passwordError && <div className="alert error">{passwordError}</div>}
            {passwordSuccess && <div className="alert success">{passwordSuccess}</div>}
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn cancel-btn"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn submit-btn"
                  disabled={
                    !passwordData.currentPassword || 
                    !passwordData.newPassword || 
                    !passwordData.confirmPassword
                  }
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSide;