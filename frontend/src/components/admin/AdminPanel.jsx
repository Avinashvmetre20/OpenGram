const AdminPanel = ({ userCount, onAddAdmin }) => {
  return (
    <div className="admin-panel">
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{userCount}</p>
        </div>
      </div>
      <button 
        onClick={onAddAdmin}
        className="add-admin-btn"
      >
        Create New Admin
      </button>
    </div>
  );
};

export default AdminPanel;