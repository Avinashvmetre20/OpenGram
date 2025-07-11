import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  createAdminUser,
  fetchAllUsers,
  deleteUser
} from '../../services/adminService';
import UserTable from '../../components/admin/UserTable';
import CreateAdminModal from '../../components/admin/CreateAdminModal';
import AdminPanel from '../../components/admin/AdminPanel';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await fetchAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleCreateAdmin = async (formData) => {
    try {
      const { data } = await createAdminUser(formData);
      setUsers([...users, data]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create admin');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminPanel
        userCount={users.length}
        onAddAdmin={() => setIsModalOpen(true)}
      />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading users...</div>
      ) : (
        <UserTable
          users={users}
          onDelete={handleDeleteUser}
          currentUserId={user._id}
        />
      )}

      <CreateAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAdmin}
      />
    </div>
  );
};

export default AdminDashboard;