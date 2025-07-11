import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaUserShield } from 'react-icons/fa';
import './UserTable.css';

const UserTable = ({ users, onDelete, currentUserId }) => {
  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <div className="user-cell">
                  {user.username}
                  {user._id === currentUserId && (
                    <span className="current-user-badge">You</span>
                  )}
                </div>
              </td>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge ${user.role}`}>
                  <FaUserShield /> {user.role}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <Link 
                    to={`/admin/users/${user._id}`} 
                    className="edit-btn"
                  >
                    <FaEdit />
                  </Link>
                  {user._id !== currentUserId && (
                    <button 
                      onClick={() => onDelete(user._id)}
                      className="delete-btn"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;