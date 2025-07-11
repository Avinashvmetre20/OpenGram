import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <h1>Welcome to OpenGram</h1>
      
      {isAuthenticated ? (
        <div className="welcome-message">
          <p>Hello {user.username}!</p>
          <div className="action-buttons">
            <Link to="/profile" className="btn btn-primary">View Profile</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn btn-outline">Admin Dashboard</Link>
            )}
          </div>
        </div>
      ) : (
        <div className="auth-options">
          <h2>Join our community</h2>
          <div className="action-buttons">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;