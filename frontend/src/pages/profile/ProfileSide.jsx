import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import "./profileSide.css";

const profileSide = () => {
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setShowPasswordModal(false);
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
            {user.username.charAt(0).toUpperCase()}
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
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h3 className="user-name">{user.username}</h3>
            <p className="user-email">{user.email}</p>
            <div className="user-meta">
              <span className="user-role">Role: {user.role}</span>
              {user.isVerified && (
                <span className="verified-badge">Verified</span>
              )}
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

export default profileSide