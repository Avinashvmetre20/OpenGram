import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserById, updateUser } from '../../services/adminService';
import './EditUser.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    bio: '',
    isVerified: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await fetchUserById(id);
        setFormData({
          username: data.username,
          email: data.email,
          password: '', // Never pre-fill password
          role: data.role,
          bio: data.bio || '',
          isVerified: data.isVerified
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send password if it was changed
      const dataToSend = showPasswordField 
        ? formData 
        : { ...formData, password: undefined };
      
      await updateUser(id, dataToSend);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user');
    }
  };

  if (loading) return <div className="loading">Loading user data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (user?.role !== 'admin') return <div>Access Denied</div>;

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            maxLength={20}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {showPasswordField && (
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              placeholder="Leave blank to keep current password"
            />
          </div>
        )}

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={150}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isVerified"
            name="isVerified"
            checked={formData.isVerified}
            onChange={handleChange}
          />
          <label htmlFor="isVerified">Verified Account</label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin')}
            className="cancel-btn"
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            onClick={() => setShowPasswordField(!showPasswordField)}
            className="toggle-password-btn"
          >
            {showPasswordField ? 'Hide Password' : 'Change Password'}
          </button>
          
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;